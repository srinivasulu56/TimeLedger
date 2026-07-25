import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Play,
  Sparkles,
  Terminal,
  ArrowRight,
  Zap,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useTasks } from "../../tasks/context/TaskContext";
import SessionTimerModal from "../../tasks/components/SessionTimerModal";
import PageTransition from "../../../shared/components/PageTransition";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, sessions, updateSessionStatus, carryForwardSession } = useTasks();
  const [activeSession, setActiveSession] = useState(null);

  // 1. Calculate Comprehensive Dashboard & Task-Specific Telemetry
  const telemetry = useMemo(() => {
    let totalMinutesWorkedToday = 0;
    let completedSessionsCount = 0;
    const globalPauseReasonCounts = {};

    // Analyze Global Stats
    sessions.forEach((session) => {
      if (session.status?.startsWith("Completed")) {
        completedSessionsCount += 1;
        totalMinutesWorkedToday += session.actualDuration || session.plannedDuration || 0;
      }

      if (session.pauseLogs && session.pauseLogs.length > 0) {
        session.pauseLogs.forEach((log) => {
          const category = log.reasonCategory || "Other Reason";
          globalPauseReasonCounts[category] = (globalPauseReasonCounts[category] || 0) + 1;
        });
      }
    });

    const hoursWorkedToday = (totalMinutesWorkedToday / 60).toFixed(1);

    // Global Top Distraction
    let topGlobalDistraction = "NONE_LOGGED";
    let maxGlobalCount = 0;
    Object.entries(globalPauseReasonCounts).forEach(([reason, count]) => {
      if (count > maxGlobalCount) {
        maxGlobalCount = count;
        topGlobalDistraction = reason;
      }
    });

    // 2. Per-Task Telemetry Calculations
    const taskDiagnostics = tasks.map((task) => {
      const taskSessions = sessions.filter((s) => s.taskId === task.id);
      const totalBlocks = taskSessions.length;
      const completedBlocks = taskSessions.filter((s) =>
        s.status?.startsWith("Completed")
      );

      const actualMinutes = completedBlocks.reduce(
        (sum, s) => sum + (s.actualDuration || s.plannedDuration || 0),
        0
      );

      // Calculate task-specific top disruption
      const taskPauseCounts = {};
      taskSessions.forEach((s) => {
        if (s.pauseLogs) {
          s.pauseLogs.forEach((log) => {
            const cat = log.reasonCategory || "Other";
            taskPauseCounts[cat] = (taskPauseCounts[cat] || 0) + 1;
          });
        }
      });

      let taskTopDisruption = "NONE";
      let maxTaskPause = 0;
      Object.entries(taskPauseCounts).forEach(([reason, count]) => {
        if (count > maxTaskPause) {
          maxTaskPause = count;
          taskTopDisruption = reason;
        }
      });

      // Variance calculation
      const estimatedMinutes = task.estimatedMinutes || 0;
      const varianceMinutes = actualMinutes - estimatedMinutes;

      return {
        ...task,
        totalBlocks,
        completedBlocksCount: completedBlocks.length,
        actualMinutes,
        varianceMinutes,
        topDisruption: taskTopDisruption,
        totalPauses: maxTaskPause,
      };
    });

    // 3. Generate Intelligent Recommendations
    const recommendations = [];

    if (maxGlobalCount > 0) {
      recommendations.push({
        type: "distraction",
        title: "PRIMARY_LEAK_DETECTED",
        message: `Your most frequent disruption is "${topGlobalDistraction}". Consider toggling Do-Not-Disturb or adjusting your physical environment.`,
      });
    }

    const overestimatingTasks = taskDiagnostics.filter((t) => t.varianceMinutes > 15);
    if (overestimatingTasks.length > 0) {
      recommendations.push({
        type: "variance",
        title: "TIME_ESTIMATION_OVERRUN",
        message: `Task "${overestimatingTasks[0].title}" exceeded estimated time by +${overestimatingTasks[0].varianceMinutes}m. Try increasing block size for complex tasks.`,
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "optimal",
        title: "OPTIMAL_FLOW_MAINTAINED",
        message: "No major focus leaks detected in recent sessions. Keep maintaining execution momentum!",
      });
    }

    return {
      hoursWorkedToday,
      completedSessionsCount,
      totalTasksCount: tasks.length,
      topGlobalDistraction,
      taskDiagnostics,
      recommendations,
    };
  }, [tasks, sessions]);

  // Upcoming Executable Sessions
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
            <Terminal className="w-5 h-5 text-cyan-400" /> Focus Dashboard & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution telemetry, task duration variance, & focus diagnostic intelligence.
          </p>
        </div>

        {/* Global Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">HOURS_WORKED</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-cyan-400">
                {telemetry.hoursWorkedToday}
              </span>
              <span className="text-xs text-slate-500">hrs</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">COMPLETED_BLOCKS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400">
                {telemetry.completedSessionsCount}
              </span>
              <span className="text-xs text-slate-500">blocks</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">ACTIVE_PLANS</span>
              <ListTodo className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100">
                {telemetry.totalTasksCount}
              </span>
              <span className="text-xs text-slate-500">plans</span>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-400">
              <span className="uppercase tracking-wider font-semibold">TOP_LEAK</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-xs font-bold text-amber-300 truncate">
              {telemetry.topGlobalDistraction}
            </div>
            <p className="text-[10px] text-amber-500/80 mt-1">[DISRUPTION_DIAGNOSTIC]</p>
          </div>
        </div>

        {/* Task Specific Performance & Variance Telemetry */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> [TASK_SPECIFIC_TELEMETRY]
          </h2>

          <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">TASK_NAME</th>
                  <th className="p-3">ESTIMATED</th>
                  <th className="p-3">ACTUAL_LOGGED</th>
                  <th className="p-3">VARIANCE</th>
                  <th className="p-3">TOP_DISTURBANCE</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {telemetry.taskDiagnostics.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-500">
                      // NO_TASK_DATA_AVAILABLE
                    </td>
                  </tr>
                ) : (
                  telemetry.taskDiagnostics.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-bold text-slate-100">
                        {t.title}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {t.completedBlocksCount}/{t.totalBlocks} BLOCKS COMPLETED
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{t.estimatedMinutes}m</td>
                      <td className="p-3 text-slate-200 font-bold">{t.actualMinutes}m</td>
                      <td className="p-3">
                        {t.varianceMinutes > 0 ? (
                          <span className="text-amber-400 font-bold">+{t.varianceMinutes}m</span>
                        ) : t.varianceMinutes < 0 ? (
                          <span className="text-emerald-400 font-bold">{t.varianceMinutes}m</span>
                        ) : (
                          <span className="text-slate-500">0m</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">
                        {t.topDisruption !== "NONE" ? (
                          <span className="text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                            {t.topDisruption}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">[NONE_LOGGED]</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate(`/dashboard/tasks/${t.id}`)}
                          className="text-cyan-400 hover:underline font-bold text-[11px]"
                        >
                          VIEW_SEQUENCE →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation Engine & Execution Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Execution Queue */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h2 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" /> [EXECUTION_QUEUE]
              </h2>
              <button
                onClick={() => navigate("/dashboard/tasks")}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
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
                  className="mt-4 rounded border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all"
                >
                  + INITIALIZE_NEW_PLAN
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingSessions.slice(0, 3).map((session) => {
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
                        className="flex items-center gap-1.5 rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-cyan-400" /> EXECUTE
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Focus Recommendations Panel */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> [FOCUS_RECOMMENDATIONS]
            </h2>
            <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-4 space-y-3 text-xs">
              {telemetry.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded border border-slate-800/80 bg-black/60 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{rec.title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {rec.message}
                  </p>
                </div>
              ))}
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