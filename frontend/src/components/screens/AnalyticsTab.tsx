import { useKnowledgeStore } from "@/stores/knowledgeStore";

export function AnalyticsTab() {
    const { calls, knowledge } = useKnowledgeStore();

    // Calculate stats
    const successCalls = calls.filter(c => c.outcome === 'success').length;
    const escalatedCalls = calls.filter(c => c.outcome === 'escalated').length;
    const totalDuration = calls.reduce((acc, c) => acc + c.duration, 0);
    const avgDuration = calls.length > 0 ? Math.round(totalDuration / calls.length) : 0;
    const successRate = calls.length > 0 ? Math.round((successCalls / calls.length) * 100) : 0;

    const stats = [
        {
            label: "Total Calls",
            value: calls.length,
            icon: "call",
            color: "primary",
            bgColor: "bg-primary/10",
            iconColor: "text-primary",
        },
        {
            label: "Success Rate",
            value: `${successRate}%`,
            icon: "trending_up",
            color: "green",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
        },
        {
            label: "Avg Duration",
            value: `${Math.floor(avgDuration / 60)}:${String(avgDuration % 60).padStart(2, '0')}`,
            icon: "timer",
            color: "blue",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
            label: "Knowledge Entries",
            value: knowledge.length,
            icon: "school",
            color: "purple",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
        },
    ];

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Performance metrics and insights
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-[#1e1e2d] rounded-xl border border-slate-200 dark:border-slate-700 p-5"
                        >
                            <div className={`inline-flex p-2.5 rounded-lg ${stat.bgColor} mb-3`}>
                                <span className={`material-symbols-outlined ${stat.iconColor}`}>
                                    {stat.icon}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call Outcomes Breakdown */}
                <div className="bg-white dark:bg-[#1e1e2d] rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                        Call Outcomes
                    </h3>
                    {calls.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                            No data yet. Complete calls to see analytics.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {/* Success Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Successful</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {successCalls} calls
                                    </span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                                        style={{ width: `${calls.length > 0 ? (successCalls / calls.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Escalated Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Escalated (Learning)</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                        {escalatedCalls} calls
                                    </span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                                        style={{ width: `${calls.length > 0 ? (escalatedCalls / calls.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Learning Progress */}
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl border border-primary/20 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Collective Learning
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Knowledge captured from calls
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-primary">{knowledge.length}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Entries</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {knowledge.filter(k => k.source === 'call-escalation').length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">From Escalations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
