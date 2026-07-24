import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Play, CheckCircle2, Sparkles, Terminal } from "lucide-react";
import { useTasks } from "../context/TaskContext";
import SessionTimerModal from "../components/SessionTimerModal";
import PageTransition from "../../../shared/components/PageTransition";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const {
    tasks,
    sessions,
    deleteTask,
    updateSessionStatus,
    carryForwardSession,
  } = useTasks();

  const [activeSession, setActiveSession] = useState(null);

  const task = tasks.find((t) => t.id === taskId);

  function handleDeleteTask() {
    if (window.confirm(`Delete "${task.title}" and all associated focus blocks?`)) {
      deleteTask(task.id);
      navigate("/dashboard/tasks");
    }
  }

  function handleCompleteFull(sessionId, status, actualMinutes, pauseLogs) {
    updateSessionStatus(sessionId, status, actualMinutes, pauseLogs);
    setActiveSession(null);
  }

  function handleCarryForward(
    session,
    remainingMinutes,
    actualMinutesWorked,
    pauseLogs
  ) {
    carryForwardSession(
      session,
      remainingMinutes,
      actualMinutesWorked,
      pauseLogs
    );
    setActiveSession(null);
  }

  if (!task) {
    return (
      <PageTransition>
        <section className="p-8 text-center space-y-4 font-mono">
          <h1 className="text-xl font-bold text-slate-100">// TASK_PLAN_NOT_FOUND</h1>
          <button
            onClick={() => navigate("/dashboard/tasks")}
            className="inline-flex items-center gap-2 rounded border border-slate-800 bg-black px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN_TO_PLANS
          </button>
        </section>
      </PageTransition>
    );
  }

  const taskSessions = sessions
    .filter((s) => s.taskId === task.id)
    .sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      <section className="max-w-4xl mx-auto space-y-6 font-mono">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate("/dashboard/tasks")}
            className="inline-flex items-center gap-2 rounded border border-slate-800 bg-[#0A0A0A] px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>BACK_TO_PLANS</span>
          </button>
        </div>

        {/* Main Task Banner */}
        <div className="rounded-lg border border-slate-800 bg-[#0A0A0A] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                {task.category || "DEVELOPMENT"}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-slate-100 uppercase tracking-tight">
                {task.title}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                TOTAL: {task.estimatedMinutes}m • BLOCK_SIZE: {task.sessionDuration}m
              </p>
            </div>

            <button
              onClick={handleDeleteTask}
              className="flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> DELETE_PLAN
            </button>
          </div>
        </div>

        {/* Execution Sequence Stream */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> [EXECUTION_SEQUENCE]
          </h2>

          <div className="space-y-2">
            {taskSessions.map((session) => (
              <article
                key={session.id}
                className={`rounded-lg border p-4 shadow-sm flex items-center justify-between transition-all ${
                  session.isCarryover
                    ? "bg-amber-500/5 border-amber-500/30"
                    : session.status?.startsWith("Completed")
                    ? "bg-[#070A0D] border-slate-900"
                    : "bg-[#0A0A0A] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-xs uppercase">
                      BLOCK_#{session.order}
                    </h3>
                    {session.isCarryover && (
                      <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> CARRYOVER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {session.topic || "Standard Focus Session"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    {session.plannedDuration}m
                  </span>

                  {session.status?.startsWith("Completed") ? (
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold text-emerald-400/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> [DONE_{session.actualDuration}m]
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveSession(session)}
                      className="flex items-center gap-1.5 rounded border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-cyan-400" /> EXECUTE
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {activeSession && (
          <SessionTimerModal
            session={activeSession}
            onClose={() => setActiveSession(null)}
            onCompleteFull={handleCompleteFull}
            onCarryForward={handleCarryForward}
          />
        )}
      </section>
    </PageTransition>
  );
}