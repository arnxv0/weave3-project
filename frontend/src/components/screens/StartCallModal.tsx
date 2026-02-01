import { useState } from "react";
import { X, Star } from "lucide-react";
import type { Agent, Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StartCallModalProps {
  lead: Lead;
  agents: Agent[];
  onClose: () => void;
  onConfirm: (agentId: string) => void;
}

export function StartCallModal({ lead, agents, onClose, onConfirm }: StartCallModalProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(
    agents.find(a => a.recommended)?.id || null
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Start Call</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lead.name} • {lead.company} • ${lead.dealSize.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Selection */}
        <div className="p-6">
          <h3 className="font-semibold mb-4">Select Agent</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`relative bg-card border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAgent === agent.id
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {agent.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {agent.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{agent.name}</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium text-foreground">{agent.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Calls:</span>
                        <span className="font-medium text-foreground">{agent.totalCalls || agent.callsToday}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call Configuration */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Call Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Call Type</label>
                <select className="w-full p-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Discovery Call</option>
                  <option>Follow-up</option>
                  <option>Demo</option>
                  <option>Closing Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Persona Mode</label>
                <select className="w-full p-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Technical Expert</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Enable Real-time Coaching</span>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Auto-escalate if needed</span>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedAgent && onConfirm(selectedAgent)}
            disabled={!selectedAgent}
          >
            Start Call
          </Button>
        </div>
      </div>
    </div>
  );
}
