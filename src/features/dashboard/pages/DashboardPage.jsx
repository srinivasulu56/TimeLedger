import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ListTodo, AlertTriangle, Play, Sparkles, Terminal, ArrowRight } from "lucide-react";
import { useTasks } from "../../tasks/context/TaskContext";
import SessionTimerModal from "../../tasks/components/SessionTimerModal";
import PageTransition from "../../../shared/components/PageTransition";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, sessions, updateSessionStatus, carryForwardSession } = useTasks();
  const [activeSession, setActiveSession] = useState(null);

  // 1. Calculate Today's Stats
  const stats = useMemo(() => {
    let totalMinutesWorkedToday = 0;
    let completedSessionsCount = 0;
    const pauseReasonCounts = {};

    sessions.forEach((session) => {
      if (session.status?.startsWith("Completed")) {
        completedSessionsCount += 1;
        totalMinutesWorkedToday += session.actualDuration || session.plannedDuration || 0;
      }

      if (session.pauseLogs && session.pauseLogs.length > 0) {
        session.pauseLogs.forEach((log) => {
          const category = log.reasonCategory || "Other Reason";
          pauseReasonCounts[category] = (pauseReasonCounts[category] || 0) + 1;
        });
      }
    });

    const hoursWorkedToday = (totalMinutesWorkedToday / 60).toFixed(1);

    let topDistraction = "NONE_LOGGED";
    let maxCount = 0;
    Object.entries(pauseReasonCounts).forEach(([reason, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topDistraction = reason;
      }
    });

    return {
      hoursWorkedToday,
      completedSessionsCount,
      totalTasksCount: tasks.length,
      topDistraction,
    };
  }, [tasks, sessions]);

  // 2. Identify Actionable Upcoming Sessions
  const pendingSessions = useMemo(() => {
    return sessions
      .filter((s) => s.status === "planned" || s.status === "Pending")
      .sort((a, b) => a.order - b.order);
  }, [sessions]);

  function handleCompleteFull(sessionId, status, actualMinutes, pauseLogs) {
    updateSessionStatus(sessionId, status, actualMinutes, pauseLogs);
    setActiveSession(null);
  }

  function handleCarryForward(session, remainingMinutes, actualMinutesWorked, pauseLogs) {
    carryForwardSession(session, remainingMinutes, actualMinutesWorked, pauseLogs);
    setActiveSession(null);
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6 font-mono">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" /> Focus Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution telemetry & disruption diagnostics.
          </p>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1 */}
          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">HOURS_WORKED</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400">
                {stats.hoursWorkedToday}
              </span>
              <span className="text-xs text-slate-500">hrs</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">COMPLETED_BLOCKS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400">
                {stats.completedSessionsCount}
              </span>
              <span className="text-xs text-slate-500">blocks</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">ACTIVE_PLANS</span>
              <ListTodo className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">
                {stats.totalTasksCount}
              </span>
              <span className="text-xs text-slate-500">plans</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-400">
              <span className="uppercase tracking-wider font-semibold">TOP_LEAK</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-xs font-bold text-amber-300 truncate">
              {stats.topDistraction}
            </div>
            <p className="text-[10px] text-amber-500/80 mt-1">[DISRUPTION_LOG]</p>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Up Session Launcher */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h2 className="font-bold text-slate-200 uppercase tracking-wider">
                [EXECUTION_QUEUE]
              </h2>
              <button
                onClick={() => navigate("/dashboard/tasks")}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                View Plans <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingSessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-800 bg-[#0A0A0A] p-8 text-center">
                <p className="text-xs text-slate-400">
                  // QUEUE_EMPTY: No pending focus sessions.
                </p>
                <button
                  onClick={() => navigate("/dashboard/tasks")}
                  className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  + INITIALIZE_NEW_PLAN
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingSessions.slice(0, 4).map((session) => {
                  const parentTask = tasks.find((t) => t.id === session.taskId);

                  return (
                    <div
                      key={session.id}
                      className={`rounded-lg border p-4 shadow-sm flex items-center justify-between transition-all ${
                        session.isCarryover
                          ? "bg-amber-500/5 border-amber-500/30"
                          : "bg-[#0A0A0A] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                            {parentTask?.title || "TASK"}
                          </span>
                          {session.isCarryover && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> CARRYOVER
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-100 text-sm mt-2">
                          Block #{session.order}: {session.topic || "Work Session"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Duration: {session.plannedDuration}m
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveSession(session)}
                        className="flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" /> EXECUTE
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Features Telemetry */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              [SYSTEM_CAPABILITIES]
            </h2>
            <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 space-y-3 text-xs text-slate-400">
              <div className="border-b border-slate-800 pb-2">
                <strong className="block text-slate-200 mb-0.5">01. INTERVAL_SPLITTING</strong>
                Auto-divides estimates into discrete focus blocks.
              </div>
              <div className="border-b border-slate-800 pb-2">
                <strong className="block text-amber-300 mb-0.5">02. ADAPTIVE_CARRYOVER</strong>
                Unfinished tasks dynamically insert forward in queue.
              </div>
              <div>
                <strong className="block text-emerald-400 mb-0.5">03. PAUSE_DIAGNOSTICS</strong>
                Tracks interruption sources to optimize flow.
              </div>
            </div>
          </div>
        </div>

        {/* Timer Modal */}
        {activeSession && (
          <SessionTimerModal
            session={activeSession}
            onClose={() => setActiveSession(null)}
            onCompleteFull={handleCompleteFull}
            onCarryForward={handleCarryForward}
          />
        )}
      </div>
    </PageTransition>
  );
}