import { useKnowledgeStore } from "@/stores/knowledgeStore";

export function KnowledgeTab() {
    const { knowledge } = useKnowledgeStore();

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Knowledge Base</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {knowledge.length} entries • Shared across all agents
                        </p>
                    </div>
                </div>

                {knowledge.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                            school
                        </span>
                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            No knowledge entries yet
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            Knowledge from escalated calls will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {knowledge.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-white dark:bg-[#1e1e2d] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">
                                                lightbulb
                                            </span>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {entry.topic}
                                            </h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.source === 'call-escalation'
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            {entry.source === 'call-escalation' ? 'From Escalation' : 'Manual'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {entry.question && (
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Customer Question
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                                                "{entry.question}"
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            Approved Response
                                        </p>
                                        <p className="text-sm text-slate-900 dark:text-white leading-relaxed">
                                            {entry.response}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            Added {formatTime(entry.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-green-500">verified</span>
                                            Active for all agents
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
