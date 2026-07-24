import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { tasks, setTasks, sessions, setSessions } = useOutletContext();

  const task = tasks.find((currentTask) => currentTask.id === taskId);

  function handleDeleteTask() {
    const shouldDelete = window.confirm(
      `Delete "${task.title}" and all of its sessions?`
    );

    if (!shouldDelete) return;

    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== task.id)
    );

    setSessions((currentSessions) =>
      currentSessions.filter((session) => session.taskId !== task.id)
    );

    navigate("/dashboard/tasks");
  }

  if (!task) {
    return (
      <section>
        <h1 className="text-2xl font-bold">Task not found</h1>

        <Link
          to="/dashboard/tasks"
          className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-800"
        >
          Back to tasks
        </Link>
      </section>
    );
  }

  const taskSessions = sessions
    .filter((session) => session.taskId === task.id)
    .sort((firstSession, secondSession) => {
      return firstSession.order - secondSession.order;
    });

  return (
    <section className="max-w-4xl">
      <Link
        to="/dashboard/tasks"
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Back to tasks
      </Link>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Task plan</p>

            <h1 className="mt-1 text-3xl font-bold">{task.title}</h1>

            <p className="mt-2 text-gray-500">
              {task.estimatedMinutes} minutes estimated -{" "}
              {task.sessionDuration} minutes per session
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {task.status}
            </span>

            <button
              type="button"
              onClick={handleDeleteTask}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete task
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Sessions</h2>

        <div className="mt-4 space-y-3">
          {taskSessions.map((session) => (
            <article
              key={session.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Session {session.order}</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {session.topic || "No topic added"}
                  </p>
                </div>

                <span className="text-sm font-medium text-gray-600">
                  {session.plannedDuration} min
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TaskDetailsPage;