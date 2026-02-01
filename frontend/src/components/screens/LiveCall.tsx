import { useState, useEffect, useRef } from "react";
import { Phone, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import type { Lead, Agent, TranscriptMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LiveCallProps {
  lead: Lead;
  agent: Agent;
  onEndCall: () => void;
}

export function LiveCall({ lead, agent, onEndCall }: LiveCallProps) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [transcript] = useState<TranscriptMessage[]>([
    {
      id: "1",
      speaker: "customer",
      text: "Hello, this is John speaking.",
      timestamp: "00:05",
    },
    {
      id: "2",
      speaker: "agent",
      text: "Hi John! This is Agent Alpha from SalesMind AI. I hope I'm catching you at a good time?",
      timestamp: "00:12",
    },
    {
      id: "3",
      speaker: "customer",
      text: "Yes, sure. What can I help you with?",
      timestamp: "00:18",
    },
  ]);
  
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Simulate typing indicator
  useEffect(() => {
    const typingTimer = setInterval(() => {
      setIsAgentTyping((prev) => !prev);
    }, 5000);
    return () => clearInterval(typingTimer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <span className="text-sm font-semibold text-red-500">LIVE CALL</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{lead.name}</span>
              <span className="text-muted-foreground ml-2">• {lead.company}</span>
            </div>
            <Badge variant="outline" className="ml-2">{formatDuration(duration)}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant={isSpeakerOn ? "outline" : "destructive"}
              size="sm"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" size="sm" onClick={onEndCall}>
              <Phone className="h-4 w-4 mr-2" />
              End Call
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Transcript and Waveform */}
        <div className="w-[60%] border-r border-border flex flex-col">
          {/* Audio Waveform */}
          <div className="border-b border-border p-6 bg-muted/30">
            <div className="flex items-center justify-center gap-1 h-24">
              {Array.from({ length: 50 }).map((_, i) => {
                const height = Math.random() * 100;
                const delay = i * 50;
                return (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full transition-all"
                    style={{
                      height: `${height}%`,
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${delay}ms`,
                      opacity: height > 50 ? 1 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="font-semibold mb-4 sticky top-0 bg-background pb-2">
              Live Transcript
            </h3>
            <div className="space-y-4">
              {transcript.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.speaker === "agent" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[80%] ${message.speaker === "agent" ? "order-1" : "order-2"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.speaker === "agent" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          {agent.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium">
                        {message.speaker === "agent" ? agent.name : lead.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      {message.speaker === "customer" && (
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                          {lead.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.speaker === "agent"
                          ? "bg-primary/10 text-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isAgentTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="bg-primary/10 rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* Right Panel - Call Insights */}
        <div className="w-[40%] p-6 overflow-y-auto">
          <h3 className="font-semibold mb-4">Call Insights</h3>
          
          <div className="space-y-4">
            {/* Agent Performance */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Agent Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentiment</span>
                  <Badge variant="default" className="bg-green-500">Positive</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-medium">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Talk Ratio</span>
                  <span className="font-medium">60/40</span>
                </div>
              </div>
            </div>

            {/* Key Topics */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Key Topics Discussed</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Pricing</Badge>
                <Badge variant="outline">Features</Badge>
                <Badge variant="outline">Integration</Badge>
              </div>
            </div>

            {/* Next Best Action */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-primary">💡 Suggested Action</h4>
              <p className="text-sm text-foreground">
                Customer shows interest in enterprise features. Consider offering a custom demo focused on security and compliance.
              </p>
            </div>

            {/* Deal Information */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Deal Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deal Size</span>
                  <span className="font-medium">${lead.dealSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{lead.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">{lead.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
