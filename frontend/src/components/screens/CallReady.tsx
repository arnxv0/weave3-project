import { useEffect } from "react";
import { Check } from "lucide-react";
import type { Lead, Agent } from "@/types";

interface CallReadyProps {
  lead: Lead;
  agent: Agent;
  onComplete: () => void;
}

const steps = [
  { label: "Analyzing Lead Profile", status: "completed" },
  { label: "Loading Agent Knowledge Base", status: "completed" },
  { label: "Establishing Connection", status: "completed" },
  { label: "Initiating Call", status: "completed" },
];

export function CallReady({ lead, onComplete }: CallReadyProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-24 h-24 rounded-full bg-green-500"></div>
            </div>
            <Check className="h-12 w-12 text-green-500" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Agent Ready!</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Dialing {lead.name}...
        </p>

        {/* Progress Bar - Complete */}
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"></div>
          </div>
          <div className="text-xs text-green-600 text-center mt-2 font-medium">
            100% Complete
          </div>
        </div>

        {/* Steps Timeline - All Completed */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border-2 bg-green-500 border-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {step.label}
                </div>
                <div className="text-xs text-green-600 mt-0.5">Completed</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
