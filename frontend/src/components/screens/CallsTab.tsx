import { useKnowledgeStore } from "@/stores/knowledgeStore";

export function CallsTab() {
    const { calls } = useKnowledgeStore();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getOutcomeStyle = (outcome: string) => {
        switch (outcome) {
            case "success":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "escalated":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            default:
                return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
        }
    };

    const getOutcomeIcon = (outcome: string) => {
        switch (outcome) {
            case "success": return "check_circle";
            case "escalated": return "school";
            default: return "call_end";
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Call History</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {calls.length} calls recorded
                        </p>
                    </div>
                </div>

                {calls.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                            call
                        </span>
                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            No calls yet
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            Start a call to see it recorded here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {calls.map((call) => (
                            <div
                                key={call.id}
                                className="bg-white dark:bg-[#1e1e2d] rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${getOutcomeStyle(call.outcome)}`}>
                                            <span className="material-symbols-outlined text-xl">
                                                {getOutcomeIcon(call.outcome)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {call.leadName}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {call.leadCompany}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    {call.agentName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">timer</span>
                                                    {formatDuration(call.duration)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    {formatTime(call.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getOutcomeStyle(call.outcome)}`}>
                                        {call.outcome}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
