import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function TasksPage() {
  const { tasks } = useOutletContext();

  const [title, setTitle] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedTitle = title.trim();

    if (!cleanedTitle) return;

    setDraftTitle(cleanedTitle);
    setTitle("");
    setIsPlannerOpen(true);
  }

  return (
    <section className="max-w-4xl">
      <h1 className="text-3xl font-bold">Your Tasks</h1>

      <p className="mt-2 text-gray-500">
        You currently have {tasks.length} tasks.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you want to work on?"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </form>

      {isPlannerOpen && (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Create a time plan
              </p>

              <h2 className="mt-1 text-xl font-bold">{draftTitle}</h2>

              <p className="mt-2 text-gray-600">
                Next, we will collect the estimated time and preferred session
                duration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPlannerOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default TasksPage;