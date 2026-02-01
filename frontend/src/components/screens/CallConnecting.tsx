import { useEffect, useState } from "react";
import { Phone, Check, Loader2 } from "lucide-react";
import type { Lead, Agent } from "@/types";

interface CallConnectingProps {
  lead: Lead;
  agent: Agent;
  onComplete: () => void;
}

const steps = [
  { label: "Analyzing Lead Profile", status: "completed" },
  { label: "Loading Agent Knowledge Base", status: "completed" },
  { label: "Establishing Connection", status: "active" },
  { label: "Initiating Call", status: "pending" },
];

export function CallConnecting({ lead, agent, onComplete }: CallConnectingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-8">
        {/* Animated Phone Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-24 h-24 rounded-full bg-primary"></div>
            </div>
            <div className="absolute inset-4 animate-ping opacity-30 animation-delay-200">
              <div className="w-16 h-16 rounded-full bg-primary"></div>
            </div>
            <div className="relative w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Phone className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Connecting Call...</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {lead.name} • {agent.name}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            {progress}% Complete
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepProgress = Math.floor((index / steps.length) * 100);
            const isCompleted = progress > stepProgress;
            const isActive = progress >= stepProgress && progress < stepProgress + 25;
            
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                  isCompleted
                    ? "bg-primary border-primary"
                    : isActive
                    ? "border-primary"
                    : "border-muted-foreground/30"
                }`}>
                  {isCompleted ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : isActive ? (
                    <Loader2 className="h-3 w-3 text-primary animate-spin" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </div>
                  {isActive && (
                    <div className="text-xs text-primary mt-0.5">In progress...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
