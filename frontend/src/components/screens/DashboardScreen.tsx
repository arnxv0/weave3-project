import { Search, Phone } from "lucide-react";
import type { Agent, Lead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardScreenProps {
  agents: Agent[];
  leads: Lead[];
  onStartCall: (lead: Lead) => void;
}

export function DashboardScreen({ agents, leads, onStartCall }: DashboardScreenProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Agents */}
      <div className="w-[35%] border-r border-border p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Available Agents</h2>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {agent.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                    agent.status === 'Available' ? 'bg-green-500' : 
                    agent.status === 'On Call' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{agent.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium text-foreground">{agent.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calls Today:</span>
                      <span className="font-medium text-foreground">{agent.callsToday}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.specialties.map((specialty, idx) => (
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
      </div>

      {/* Right Panel - Leads Pipeline */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Sales Pipeline</h1>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer">Hot</Badge>
              <Badge variant="outline" className="cursor-pointer">Warm</Badge>
              <Badge variant="outline" className="cursor-pointer">Cold</Badge>
            </div>
          </div>
        </div>

        {/* Leads Cards */}
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{lead.name}</h3>
                    <Badge variant={
                      lead.status === 'Hot' ? 'destructive' : 
                      lead.status === 'Warm' ? 'default' : 'outline'
                    }>
                      {lead.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-foreground">{lead.company}</span>
                      <span>•</span>
                      <span>{lead.industry}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg text-foreground">
                        ${lead.dealSize.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Last contact: {lead.lastContact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                        {lead.bestMatchAgent.agentName.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">{lead.bestMatchAgent.agentName}</div>
                        <div className="text-muted-foreground">
                          {lead.bestMatchAgent.matchScore}% match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onStartCall(lead)}
                  className="ml-4"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
