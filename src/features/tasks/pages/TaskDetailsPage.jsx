import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, sessions, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId);

  function handleDeleteTask() {
    if (window.confirm(`Delete "${task.title}" and all of its sessions?`)) {
      deleteTask(task.id);
      navigate("/dashboard/tasks");
    }
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

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
        <h2 className="text-xl font-bold text-gray-800">Generated Sessions</h2>
        <div className="mt-4 space-y-3">
          {taskSessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Session {session.order}</h3>
                  <p className="text-sm text-gray-500">{session.topic}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">{session.plannedDuration} min</span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{session.status}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TaskDetailsPage;