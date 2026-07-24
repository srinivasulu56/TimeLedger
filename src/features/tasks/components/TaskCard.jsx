import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

export default function TaskCard({ task }) {
  const { sessions } = useTasks();

  // Find all sessions for this specific task
  const taskSessions = sessions.filter((s) => s.taskId === task.id);
  const totalSessions = taskSessions.length;
  
  // Count completed sessions
  const completedSessions = taskSessions.filter((s) =>
    s.status?.startsWith("Completed")
  ).length;

  // Calculate dynamic progress percentage
  const progressPct = totalSessions > 0
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  const isFullyCompleted = totalSessions > 0 && completedSessions === totalSessions;

  return (
    <div
      className={`rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
        isFullyCompleted
          ? "bg-gray-50/80 border-gray-200 opacity-90"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {task.category || "General"}
          </span>

          {/* Dynamic Status Badge */}
          {isFullyCompleted ? (
            <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              ✓ Completed
            </span>
          ) : (
            <span className="text-[11px] font-medium text-gray-500">
              {completedSessions}/{totalSessions} Sessions
            </span>
          )}
        </div>

        <h3
          className={`font-bold text-lg line-clamp-1 ${
            isFullyCompleted ? "text-gray-600 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {task.estimatedMinutes} mins total • {task.sessionDuration} mins/session
        </p>

        {/* Dynamic Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-gray-800">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isFullyCompleted ? "bg-green-500" : "bg-blue-600"
              }`}
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/dashboard/tasks/${task.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View Task Details →
        </Link>
      </div>
    </div>
  );
}