import { useState } from 'react';
import type { Agent, Lead } from './types';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { StartCallModal } from './components/screens/StartCallModal';
import { CallConnecting } from './components/screens/CallConnecting';
import { CallReady } from './components/screens/CallReady';
import { LiveCall } from './components/screens/LiveCall';
import { KnowledgeStoreProvider } from './stores/knowledgeStore';

// Mock data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Agent Alpha",
    avatar: "A",
    status: "Available",
    successRate: 78,
    callsToday: 12,
    totalCalls: 245,
    specialties: ["Enterprise", "SaaS"],
    recommended: true,
  },
  {
    id: "2",
    name: "Agent Beta",
    avatar: "B",
    status: "Available",
    successRate: 92,
    callsToday: 8,
    totalCalls: 189,
    specialties: ["SMB", "E-commerce"],
  },
  {
    id: "3",
    name: "Agent Gamma",
    avatar: "G",
    status: "On Call",
    successRate: 65,
    callsToday: 15,
    totalCalls: 312,
    specialties: ["FinTech", "Healthcare"],
  },
  {
    id: "4",
    name: "Agent Delta",
    avatar: "D",
    status: "Available",
    successRate: 82,
    callsToday: 10,
    totalCalls: 276,
    specialties: ["Manufacturing", "Logistics"],
  },
];

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    company: "TechCorp Inc",
    industry: "Technology",
    status: "Hot",
    dealSize: 75000,
    lastContact: "2 hours ago",
    priority: "high",
    matchScore: 85,
    bestMatchAgent: {
      agentId: "1",
      agentName: "Agent Alpha",
      matchScore: 85,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "Acme Corp",
    industry: "Manufacturing",
    status: "Warm",
    dealSize: 120000,
    lastContact: "1 day ago",
    priority: "high",
    matchScore: 92,
    bestMatchAgent: {
      agentId: "4",
      agentName: "Agent Delta",
      matchScore: 92,
    },
  },
  {
    id: "3",
    name: "Michael Chen",
    company: "DataFlow Systems",
    industry: "SaaS",
    status: "New",
    dealSize: 45000,
    lastContact: "3 days ago",
    priority: "medium",
    matchScore: 78,
    bestMatchAgent: {
      agentId: "1",
      agentName: "Agent Alpha",
      matchScore: 78,
    },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    company: "HealthCare Plus",
    industry: "Healthcare",
    status: "Qualified",
    dealSize: 95000,
    lastContact: "5 hours ago",
    priority: "high",
    matchScore: 88,
    bestMatchAgent: {
      agentId: "3",
      agentName: "Agent Gamma",
      matchScore: 88,
    },
  },
];

type AppState =
  | { screen: 'dashboard' }
  | { screen: 'start-call-modal'; lead: Lead }
  | { screen: 'connecting'; lead: Lead; agent: Agent; flowId: 'call1' | 'call2' }
  | { screen: 'ready'; lead: Lead; agent: Agent; flowId: 'call1' | 'call2' }
  | { screen: 'live-call'; lead: Lead; agent: Agent; flowId: 'call1' | 'call2' };

function AppContent() {
  const [state, setState] = useState<AppState>({ screen: 'dashboard' });

  const handleStartCall = (lead: Lead) => {
    setState({ screen: 'start-call-modal', lead });
  };

  const handleConfirmCall = (agentId: string, flowId: 'call1' | 'call2') => {
    if (state.screen !== 'start-call-modal') return;
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) return;
    setState({ screen: 'connecting', lead: state.lead, agent, flowId });
  };

  const handleConnectingComplete = () => {
    if (state.screen !== 'connecting') return;
    setState({ screen: 'ready', lead: state.lead, agent: state.agent, flowId: state.flowId });
  };

  const handleReadyComplete = () => {
    if (state.screen !== 'ready') return;
    setState({ screen: 'live-call', lead: state.lead, agent: state.agent, flowId: state.flowId });
  };

  const handleEndCall = () => {
    setState({ screen: 'dashboard' });
  };

  const handleCloseModal = () => {
    setState({ screen: 'dashboard' });
  };

  return (
    <>
      {state.screen === 'dashboard' && (
        <DashboardScreen
          agents={mockAgents}
          leads={mockLeads}
          onStartCall={handleStartCall}
        />
      )}

      {state.screen === 'start-call-modal' && (
        <StartCallModal
          lead={state.lead}
          agents={mockAgents}
          onClose={handleCloseModal}
          onConfirm={handleConfirmCall}
        />
      )}

      {state.screen === 'connecting' && (
        <CallConnecting
          lead={state.lead}
          agent={state.agent}
          onComplete={handleConnectingComplete}
        />
      )}

      {state.screen === 'ready' && (
        <CallReady
          lead={state.lead}
          agent={state.agent}
          onComplete={handleReadyComplete}
        />
      )}

      {state.screen === 'live-call' && (
        <LiveCall
          lead={state.lead}
          agent={state.agent}
          onEndCall={handleEndCall}
          flowId={state.flowId}
        />
      )}
    </>
  );
}

function App() {
  return (
    <KnowledgeStoreProvider>
      <AppContent />
    </KnowledgeStoreProvider>
  );
}

export default App;
