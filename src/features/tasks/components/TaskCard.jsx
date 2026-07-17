function TaskCard({ task, sessionCount }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{task.title}</h2>

          <p className="mt-1 text-sm text-gray-500">
            {task.estimatedMinutes} min estimated - {task.sessionDuration} min
            per session
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {task.status}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {sessionCount} planned sessions
      </p>
    </article>
  );
}

export default TaskCard;