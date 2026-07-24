import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useTasks } from "../context/TaskContext";

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { sessions } = useTasks();

  const taskSessions = sessions.filter((s) => s.taskId === task.id);
  const totalSessions = taskSessions.length;

  const completedSessions = taskSessions.filter((s) =>
    s.status?.startsWith("Completed")
  ).length;

  const progressPct =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  const isFullyCompleted =
    totalSessions > 0 && completedSessions === totalSessions;

  return (
    <div
      onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
      className={`group cursor-pointer rounded-lg border p-4 transition-all duration-150 font-mono ${
        isFullyCompleted
          ? "bg-[#0A0A0A] border-emerald-500/30 hover:border-emerald-500/60"
          : "bg-[#0D0D0D] border-slate-800 hover:border-slate-600 hover:bg-[#121212]"
      }`}
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between mb-3 text-[11px]">
        <span className="font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
          {task.category || "GENERAL"}
        </span>

        {isFullyCompleted ? (
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> [DONE]
          </span>
        ) : (
          <span className="text-slate-400">
            {completedSessions}/{totalSessions} BLOCKS
          </span>
        )}
      </div>

      {/* Task Title */}
      <h3
        className={`font-bold text-base tracking-tight truncate ${
          isFullyCompleted ? "text-slate-500 line-through" : "text-slate-100 group-hover:text-emerald-400"
        }`}
      >
        {task.title}
      </h3>

      {/* Timing Details */}
      <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>{task.estimatedMinutes}m total</span>
        <span className="text-slate-600">•</span>
        <span>{task.sessionDuration}m / block</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between text-[10px] mb-1 text-slate-400">
          <span>PROGRESS</span>
          <span className="font-bold text-slate-200">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-sm h-1.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              isFullyCompleted ? "bg-emerald-500" : "bg-emerald-400"
            }`}
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
        <span>Execute Plan</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}