import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import SessionTimerModal from "../components/SessionTimerModal";

function TaskDetailsPage() {
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
    if (window.confirm(`Delete "${task.title}" and all of its sessions?`)) {
      deleteTask(task.id);
      navigate("/dashboard/tasks");
    }
  }

  // Handle Full Completion
  function handleCompleteFull(sessionId, status, actualMinutes, pauseLogs) {
    updateSessionStatus(sessionId, status, actualMinutes, pauseLogs);
    setActiveSession(null);
  }

  // Handle Carry-Forward Session Generation
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
      <section className="p-4">
        <h1 className="text-2xl font-bold">Task not found</h1>
        <Link to="/dashboard/tasks" className="mt-4 inline-block font-medium text-blue-600">
          Back to tasks
        </Link>
      </section>
    );
  }

  const taskSessions = sessions
    .filter((s) => s.taskId === task.id)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="max-w-4xl mx-auto">
      <Link to="/dashboard/tasks" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to tasks
      </Link>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Task Plan</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{task.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {task.estimatedMinutes} mins total • {task.sessionDuration} mins / session
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {task.status}
            </span>
            <button
              onClick={handleDeleteTask}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800">Sessions</h2>
        <div className="mt-4 space-y-3">
          {taskSessions.map((session) => (
            <article
              key={session.id}
              className={`rounded-lg border p-4 shadow-xs flex items-center justify-between ${
                session.isCarryover
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">
                    Session {session.order}
                  </h3>
                  {session.isCarryover && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      ⚡ Carryover
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {session.topic || "No topic added"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  {session.plannedDuration} min
                </span>

                {session.status?.startsWith("Completed") ? (
                  <span className="rounded bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Completed ({session.actualDuration}m)
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveSession(session)}
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Start Timer
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
  );
}

export default TaskDetailsPage;