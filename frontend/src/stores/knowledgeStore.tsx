import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface KnowledgeEntry {
    id: string;
    topic: string;
    response: string;
    question?: string;
    createdAt: string;
    source: 'call-escalation' | 'manual';
}

export interface CallRecord {
    id: string;
    leadName: string;
    leadCompany: string;
    agentName: string;
    duration: number;
    outcome: 'success' | 'escalated' | 'ended';
    timestamp: string;
    flowId: 'call1' | 'call2';
}

interface KnowledgeStoreContextType {
    knowledge: KnowledgeEntry[];
    calls: CallRecord[];
    addKnowledge: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>) => void;
    addCall: (call: Omit<CallRecord, 'id' | 'timestamp'>) => void;
}

const KnowledgeStoreContext = createContext<KnowledgeStoreContextType | null>(null);

const STORAGE_KEY_KNOWLEDGE = 'salesmind_knowledge';
const STORAGE_KEY_CALLS = 'salesmind_calls';

export function KnowledgeStoreProvider({ children }: { children: ReactNode }) {
    const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_KNOWLEDGE);
        return stored ? JSON.parse(stored) : [];
    });

    const [calls, setCalls] = useState<CallRecord[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_CALLS);
        return stored ? JSON.parse(stored) : [];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_KNOWLEDGE, JSON.stringify(knowledge));
    }, [knowledge]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_CALLS, JSON.stringify(calls));
    }, [calls]);

    const addKnowledge = (entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>) => {
        const newEntry: KnowledgeEntry = {
            ...entry,
            id: `knowledge-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setKnowledge(prev => [newEntry, ...prev]);
    };

    const addCall = (call: Omit<CallRecord, 'id' | 'timestamp'>) => {
        const newCall: CallRecord = {
            ...call,
            id: `call-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
        setCalls(prev => [newCall, ...prev]);
    };

    return (
        <KnowledgeStoreContext.Provider value={{ knowledge, calls, addKnowledge, addCall }}>
            {children}
        </KnowledgeStoreContext.Provider>
    );
}

export function useKnowledgeStore() {
    const context = useContext(KnowledgeStoreContext);
    if (!context) {
        throw new Error('useKnowledgeStore must be used within KnowledgeStoreProvider');
    }
    return context;
}
