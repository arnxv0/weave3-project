import { useState, useEffect, useRef } from "react";
import type { Lead, Agent, TranscriptMessage } from "@/types";

interface LiveCallProps {
  lead: Lead;
  agent: Agent;
  onEndCall: () => void;
}

export function LiveCall({ lead, agent, onEndCall }: LiveCallProps) {
  const [duration, setDuration] = useState(263); // Start at 04:23 like reference
  const [showToast, setShowToast] = useState(true);
  const [transcript] = useState<TranscriptMessage[]>([
    {
      id: "1",
      speaker: "customer",
      text: "Hello, I'm calling because I saw your ad about the enterprise plan, but I'm not sure if it fits our current budget cycle.",
      timestamp: "00:03:12",
    },
    {
      id: "2",
      speaker: "agent",
      text: "I completely understand budget cycles can be tricky. We actually offer flexible payment terms specifically for enterprise clients. Could you tell me a bit more about what you're looking for?",
      timestamp: "00:03:25",
    },
    {
      id: "3",
      speaker: "customer",
      text: "Well, mostly looking for API access and dedicated support. But I heard your implementation takes months.",
      timestamp: "00:04:15",
    },
    {
      id: "4",
      speaker: "agent",
      text: "That's a valid concern. However, for a setup like yours, we typically go live in under 2 weeks.",
      timestamp: "00:04:22",
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

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Waveform bar heights (simulated)
  const waveformBars = [
    { height: "h-8", color: "bg-secondary/40" },
    { height: "h-12", color: "bg-secondary/60" },
    { height: "h-6", color: "bg-secondary/80" },
    { height: "h-10", color: "bg-secondary/40" },
    { height: "h-2", color: "bg-slate-200 dark:bg-slate-700", isSpacer: true },
    { height: "h-16", color: "bg-primary/60", animate: true },
    { height: "h-20", color: "bg-primary", animate: true },
    { height: "h-24", color: "bg-primary", animate: true },
    { height: "h-14", color: "bg-primary", animate: true },
    { height: "h-18", color: "bg-primary/80", animate: true },
    { height: "h-10", color: "bg-primary/50", animate: true },
    { height: "h-6", color: "bg-primary/30" },
    { height: "h-2", color: "bg-slate-200 dark:bg-slate-700", isSpacer: true },
    { height: "h-5", color: "bg-secondary/40" },
    { height: "h-9", color: "bg-secondary/60" },
    { height: "h-4", color: "bg-secondary/30" },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-[#1e1e2d] shadow-sm z-20 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Live Status */}
          <div className="flex items-center gap-3 w-1/4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold tracking-tight text-sm uppercase">Live Call</span>
          </div>

          {/* Center: Call Info & Timer */}
          <div className="flex flex-col items-center justify-center w-2/4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="text-slate-900 dark:text-white font-semibold">{lead.name}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>{lead.company}</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white tracking-wider mt-0.5">
              {formatDuration(duration)}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Mute">
              <span className="material-symbols-outlined text-[20px]">mic_off</span>
            </button>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Volume">
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={onEndCall}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              End Call
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6 max-w-[1600px] w-full mx-auto">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* LEFT PANEL (60%) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 h-full overflow-y-auto pr-1">
            {/* Audio Visualizer Card */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">graphic_eq</span>
                  <h3 className="font-bold text-slate-900 dark:text-white">Live Audio Stream</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{agent.name} is speaking...</span>
                </div>
              </div>
              {/* Waveform Visual */}
              <div className="h-24 flex items-center justify-center gap-1 w-full overflow-hidden">
                {waveformBars.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-1.5 ${bar.color} ${bar.height} rounded-full ${bar.animate ? "animate-pulse" : ""}`}
                  />
                ))}
                {/* Extra placeholder bars */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="w-1.5 bg-slate-100 dark:bg-slate-800 h-1 rounded-full" />
                ))}
              </div>
            </div>

            {/* Live Transcript Card */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">forum</span>
                  Live Transcript
                </h3>
                <span className="text-xs font-mono text-slate-400">Auto-scrolling ON</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {transcript.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-1 ${message.speaker === "agent" ? "items-end self-end" : "items-start"} max-w-[85%] ${message.speaker === "agent" ? "ml-auto" : ""}`}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${message.speaker === "agent" ? "flex-row-reverse" : ""}`}>
                      <span className={`text-xs font-semibold ${message.speaker === "agent" ? "text-primary" : "text-slate-500"}`}>
                        {message.speaker === "agent" ? agent.name : "Customer"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">[{message.timestamp}]</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${message.speaker === "agent"
                        ? "bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                      }`}>
                      {message.text}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                <div className="flex flex-col gap-1 items-start max-w-[85%] animate-pulse">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-500">Customer is typing...</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed w-16 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>

                <div ref={transcriptEndRef} />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (40%) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto pb-1">
            {/* Agent Activity Card */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              {/* Sticky Header */}
              <div className="bg-white/90 dark:bg-[#1e1e2d]/90 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                  AI Intelligence
                </h3>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-primary rounded-full border border-purple-100 dark:border-purple-900/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide">Thinking...</span>
                </div>
              </div>
              {/* Timeline Content */}
              <div className="p-5">
                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-700 space-y-8">
                  {/* Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#1e1e2d] bg-blue-500 shadow-sm"></span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 mb-0.5">Just now</span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Analyzing customer sentiment shift</p>
                      <p className="text-xs text-slate-500 mt-1">Detected positive signal keywords.</p>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#1e1e2d] bg-secondary shadow-sm"></span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 mb-0.5">15s ago</span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Retrieved Response #47</p>
                      <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                        Suggested: "We typically go live in under 2 weeks for this scale."
                      </div>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#1e1e2d] bg-purple-500 shadow-sm"></span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 mb-0.5">1m ago</span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Detected objection: Pricing comparison</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Metrics Card */}
            <div className="bg-primary/5 dark:bg-[#252538] rounded-xl border border-primary/10 dark:border-primary/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                <h3 className="font-bold text-slate-900 dark:text-white">Live Metrics</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Metric 1 */}
                <div className="bg-white dark:bg-[#1e1e2d] rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Sentiment</span>
                  <span className="text-xl font-bold text-secondary">75/100</span>
                </div>
                {/* Metric 2 */}
                <div className="bg-white dark:bg-[#1e1e2d] rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Close Prob.</span>
                  <span className="text-xl font-bold text-primary">65%</span>
                </div>
                {/* Metric 3 */}
                <div className="bg-white dark:bg-[#1e1e2d] rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Questions</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-white">8</span>
                </div>
              </div>
              {/* Talk Time Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Agent (55%)</span>
                  <span>Talk Time</span>
                  <span>Customer (45%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: "55%" }}></div>
                  <div className="h-full bg-secondary" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-5 mt-auto">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-lg shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Join Call
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-[18px]">note_add</span>
                    Add Note
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-[18px]">manage_search</span>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Overlay */}
      {showToast && (
        <div className="fixed top-24 right-8 z-50 animate-bounce">
          <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-400 dark:text-yellow-500">lightbulb</span>
            <div>
              <p className="font-bold text-sm">New pattern learned!</p>
              <p className="text-xs text-slate-300 dark:text-slate-500">Objection handling for 'Enterprise Budget'</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-white dark:hover:text-slate-700 ml-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
