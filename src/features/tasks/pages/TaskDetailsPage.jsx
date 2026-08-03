import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Play,
  CheckCircle2,
  Sparkles,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { useTasks } from "../../../context/TaskContext";
import SessionTimerModal from "../components/SessionTimerModal";
import PageTransition from "../../../shared/components/PageTransition";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const context = useTasks();

  const tasks = context.tasks || [];
  const sessions = context.sessions || [];
  const deleteTask = context.deleteTask || context.deleteTaskPlan;
  const updateSessionStatus = context.updateSessionStatus;
  const carryForwardSession = context.carryForwardSession;

  const [activeSession, setActiveSession] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const task = tasks.find((t) => String(t.id) === String(taskId));

  // Extract task sessions from top-level sessions context OR nested inside task object
  const taskSessions = useMemo(() => {
    if (!task) return [];

    let list = [];
    if (Array.isArray(sessions) && sessions.length > 0) {
      list = sessions.filter(
        (s) => String(s.taskId) === String(task.id) || String(s.task_id) === String(task.id)
      );
    }

    if (list.length === 0 && Array.isArray(task.sessions)) {
      list = task.sessions;
    }

    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [task, sessions]);

  function confirmAndDeleteTask() {
    if (deleteTask && task) {
      deleteTask(task.id);
    }
    setIsDeleteModalOpen(false);
    navigate("/dashboard/tasks");
  }

  function handleCompleteFull(sessionId, status, actualMinutes, pauseLogs) {
    if (updateSessionStatus) {
      updateSessionStatus(sessionId, status, actualMinutes, pauseLogs);
    }
    setActiveSession(null);
  }

  function handleCarryForward(
    session,
    remainingMinutes,
    actualMinutesWorked,
    pauseLogs
  ) {
    if (carryForwardSession) {
      carryForwardSession(
        session,
        remainingMinutes,
        actualMinutesWorked,
        pauseLogs
      );
    }
    setActiveSession(null);
  }

  if (!task) {
    return (
      <PageTransition>
        <section className="p-8 text-center space-y-4 font-mono">
          <h1 className="text-xl font-bold text-slate-100">// TASK_PLAN_NOT_FOUND</h1>
          <button
            onClick={() => navigate("/dashboard/tasks")}
            className="inline-flex items-center gap-2 rounded border border-slate-800 bg-black px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN_TO_PLANS
          </button>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="max-w-4xl mx-auto space-y-6 font-mono">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate("/dashboard/tasks")}
            className="inline-flex items-center gap-2 rounded border border-slate-800 bg-[#0A0A0A] px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer"
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
                TOTAL: {task.estimated_minutes || task.estimatedMinutes || 0}m • BLOCK_SIZE: {task.session_duration || task.sessionDuration || 0}m
              </p>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
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
            {taskSessions.length === 0 ? (
              <div className="p-6 rounded border border-dashed border-slate-800 text-center text-xs text-slate-500">
                // NO_SESSIONS_CONFIGURED
              </div>
            ) : (
              taskSessions.map((session) => {
                const isCarryover = session.is_carryover || session.isCarryover;
                const isCompleted = session.status?.toLowerCase().startsWith("completed");
                const plannedDuration = session.planned_duration || session.plannedDuration || 0;
                const actualDuration = session.actual_duration || session.actualDuration || plannedDuration;

                return (
                  <article
                    key={session.id}
                    className={`rounded-lg border p-4 shadow-sm flex items-center justify-between transition-all ${
                      isCarryover
                        ? "bg-amber-500/5 border-amber-500/30"
                        : isCompleted
                        ? "bg-[#070A0D] border-slate-900"
                        : "bg-[#0A0A0A] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-100 text-xs uppercase">
                          BLOCK_#{session.order}
                        </h3>
                        {isCarryover && (
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
                        {plannedDuration}m
                      </span>

                      {isCompleted ? (
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold text-emerald-400/80 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> [DONE_{actualDuration}m]
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveSession(session)}
                          className="flex items-center gap-1.5 rounded border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-cyan-400" /> EXECUTE
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Timer Execution Modal */}
        {activeSession && (
          <SessionTimerModal
            session={activeSession}
            onClose={() => setActiveSession(null)}
            onCompleteFull={handleCompleteFull}
            onCarryForward={handleCarryForward}
          />
        )}

        {/* Mobile & Theme-Friendly Terminal Delete Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm font-mono">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-lg border border-red-500/30 bg-[#0A0A0A] p-6 shadow-2xl text-center space-y-4"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                    DELETE_PLAN_CONFIRMATION
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Delete <span className="text-slate-200 font-bold">"{task.title}"</span> and all associated focus blocks?
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 rounded border border-slate-800 bg-black py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={confirmAndDeleteTask}
                    className="flex-1 rounded border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    CONFIRM_DELETE
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}