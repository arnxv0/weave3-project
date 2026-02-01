import { useState, useCallback, useEffect, useRef } from "react";
import type { Lead, Agent } from "@/types";
import { TranscriptPanel, type TranscriptMessage } from "./TranscriptPanel";
import { ActivityFeed } from "./ActivityFeed";
import { KnowledgeModal } from "./KnowledgeModal";
import { SuccessCelebration } from "./SuccessCelebration";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useKnowledgeStore } from "@/stores/knowledgeStore";
import {
  call1Flow,
  call2Flow,
  type ConversationStep,
  type ActivityItem,
} from "./conversationFlows";

interface LiveCallProps {
  lead: Lead;
  agent: Agent;
  onEndCall: () => void;
  flowId?: "call1" | "call2"; // Which demo flow to run
}

export function LiveCall({ lead, agent, onEndCall, flowId = "call1" }: LiveCallProps) {
  // Select the flow based on prop
  const selectedFlow = flowId === "call2" ? call2Flow : call1Flow;
  const [currentFlow] = useState<ConversationStep[]>(selectedFlow);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [waitingForUser, setWaitingForUser] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const audioPlayer = useAudioPlayer();
  const { addKnowledge, addCall } = useKnowledgeStore();
  const lastProcessedTranscriptRef = useRef<string>("");
  const durationRef = useRef(0);
  const lastProcessedIndexRef = useRef(-1);
  const isProcessingRef = useRef(false);

  // Speech recognition for background listening
  const {
    isListening,
    transcript,
    interimText,
    startListening,
    stopListening,
    isSupported: speechSupported,
  } = useSpeechRecognition();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const addMessage = useCallback(
    (speaker: "agent" | "customer", text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          speaker,
          text,
          timestamp: formatDuration(durationRef.current),
        },
      ]);
    },
    []
  );

  const addActivity = useCallback((activity: ActivityItem) => {
    setActivities((prev) => [
      {
        ...activity,
        id: `act-${Date.now()}`,
        timestamp: "Just now",
      },
      ...prev.map((a, i) => ({
        ...a,
        timestamp: i === 0 ? "2s ago" : `${(i + 1) * 2}s ago`,
      })),
    ]);
  }, []);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const processStep = useCallback(
    async (step: ConversationStep) => {
      // Prevent overlapping step processing
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        // Add activity if present
        if (step.activity) {
          await delay(step.activityDelay || 300);
          addActivity(step.activity);
        }

        // If agent speaks
        if (step.speaker === "agent" && step.text) {
          setIsAgentSpeaking(true);

          // Try to play audio if available
          if (step.audioFile) {
            try {
              await audioPlayer.play(`/agent-audio/${step.audioFile}`);
            } catch {
              // Audio not found, simulate with delay
              await delay(Math.min(step.text.length * 50, 3000));
            }
          } else {
            await delay(Math.min(step.text.length * 50, 3000));
          }

          setIsAgentSpeaking(false);
          addMessage("agent", step.text);
        }

        // Check for end conditions
        if (step.isEnd) {
          setCallEnded(true);
          if (step.endType === "escalate") {
            await delay(1000);
            setShowKnowledgeModal(true);
          } else if (step.endType === "success") {
            await delay(1000);
            setShowSuccessModal(true);
          }
          isProcessingRef.current = false;
          return;
        }

        // Wait for user or auto-advance
        if (step.waitForUser) {
          setWaitingForUser(true);
          isProcessingRef.current = false; // Allow processing again for next step
        } else if (step.autoAdvanceDelay) {
          await delay(step.autoAdvanceDelay);
          isProcessingRef.current = false; // Allow processing before advancing
          setCurrentStepIndex(prev => prev + 1);
        } else {
          isProcessingRef.current = false;
        }
      } catch (error) {
        console.error('Error processing step:', error);
        isProcessingRef.current = false;
      }
    },
    [addActivity, addMessage, audioPlayer]
  );

  const handleUserResponse = useCallback(
    (text: string) => {
      // Prevent double submissions
      if (!waitingForUser) return;

      // Add customer message
      addMessage("customer", text);
      setWaitingForUser(false);

      // Delay then advance to give audio time to finish
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 800);
    },
    [addMessage, waitingForUser]
  );

  const handleEndCall = useCallback(() => {
    audioPlayer.stop();
    onEndCall();
  }, [audioPlayer, onEndCall]);

  // --- Effects ---

  // Main Effect: Process current step when index changes
  useEffect(() => {
    if (callEnded || currentStepIndex >= currentFlow.length) return;

    // Safety check: ensure we don't re-run for the SAME step if already processed
    if (lastProcessedIndexRef.current === currentStepIndex) return;

    // Small delay on mount to allow UI to settle
    const timeout = setTimeout(() => {
      // Re-check inside timeout to handle strict mode double-firing correctly
      if (lastProcessedIndexRef.current === currentStepIndex) return;

      lastProcessedIndexRef.current = currentStepIndex;
      const step = currentFlow[currentStepIndex];
      if (step) processStep(step);
    }, currentStepIndex === 0 ? 800 : 0);

    return () => clearTimeout(timeout);
  }, [currentStepIndex, currentFlow, callEnded, processStep]);

  // Timer effect
  useEffect(() => {
    if (callEnded) return;
    const timer = setInterval(() => {
      setDuration((prev) => {
        const next = prev + 1;
        durationRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [callEnded]);

  // Speech recognition control - start/stop based on waiting state
  useEffect(() => {
    if (!speechSupported) return;

    if (waitingForUser && !callEnded && !isAgentSpeaking) {
      // Start listening when waiting for user
      const timeout = setTimeout(() => {
        if (!isListening) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      // Stop listening when not waiting
      if (isListening) {
        stopListening();
      }
    }
  }, [waitingForUser, callEnded, isAgentSpeaking, speechSupported, isListening, startListening, stopListening]);

  // Handle final transcript - submit as user response (with deduplication)
  useEffect(() => {
    if (
      transcript &&
      waitingForUser &&
      !isProcessingRef.current &&
      transcript !== lastProcessedTranscriptRef.current
    ) {
      lastProcessedTranscriptRef.current = transcript;
      handleUserResponse(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, waitingForUser]);

  const handleKnowledgeSave = useCallback((data: { topic: string; response: string }) => {
    // Save to knowledge store
    addKnowledge({
      topic: data.topic,
      response: data.response,
      question: "Are you HIPAA compliant?",
      source: 'call-escalation',
    });

    // Record the call with escalated outcome
    addCall({
      leadName: lead.name,
      leadCompany: lead.company,
      agentName: agent.name,
      duration,
      outcome: 'escalated',
      flowId,
    });

    setShowKnowledgeModal(false);
    // Return to dashboard after saving knowledge
    setTimeout(() => onEndCall(), 500);
  }, [addKnowledge, addCall, lead.name, lead.company, agent.name, duration, flowId, onEndCall]);

  // Handle success completion
  const handleSuccessComplete = useCallback(() => {
    addCall({
      leadName: lead.name,
      leadCompany: lead.company,
      agentName: agent.name,
      duration,
      outcome: 'success',
      flowId,
    });
    setShowSuccessModal(false);
    setTimeout(() => onEndCall(), 500);
  }, [addCall, lead.name, lead.company, agent.name, duration, flowId, onEndCall]);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-[#1e1e2d] shadow-sm z-20 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Live Status */}
          <div className="flex items-center gap-3 w-1/4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold tracking-tight text-sm uppercase">
              Live Call
            </span>
          </div>

          {/* Center: Agent & Lead Info */}
          <div className="flex flex-col items-center justify-center w-2/4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="text-slate-900 dark:text-white font-semibold">
                {agent.name}
              </span>
              <span className="text-slate-300 dark:text-slate-600">→</span>
              <span>{lead.name}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs">{lead.company}</span>
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-wider">
              {formatDuration(duration)}
            </div>
          </div>

          {/* Right: End Call */}
          <div className="flex justify-end w-1/4">
            <button
              onClick={handleEndCall}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-lg">
                call_end
              </span>
              End Call
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6 max-w-[1600px] w-full mx-auto">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* LEFT PANEL - Transcript */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 h-full">
            {/* Transcript */}
            <div className="flex-1 min-h-0">
              <TranscriptPanel
                messages={messages}
                agentName={agent.name}
                isAgentSpeaking={isAgentSpeaking}
                interimText={interimText}
              />
            </div>

            {/* User Input Area */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 shrink-0">
              {waitingForUser ? (
                <div className="space-y-4">
                  {/* Listening indicator */}
                  {isListening && (
                    <div className="flex items-center justify-center gap-3 py-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          Listening to call...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Interim text - what user is saying */}
                  {interimText && (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        "{interimText}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">
                  <span className="material-symbols-outlined text-2xl mb-2 block animate-pulse">
                    {isAgentSpeaking ? "record_voice_over" : "hourglass_empty"}
                  </span>
                  <p className="text-sm">
                    {isAgentSpeaking
                      ? `${agent.name} is speaking...`
                      : "Waiting..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Activity Feed */}
          <div className="col-span-12 lg:col-span-5 h-full">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <KnowledgeModal
        isOpen={showKnowledgeModal}
        onClose={() => {
          setShowKnowledgeModal(false);
          onEndCall();
        }}
        onSave={handleKnowledgeSave}
      />

      <SuccessCelebration
        isOpen={showSuccessModal}
        onClose={handleSuccessComplete}
      />
    </div>
  );
}
