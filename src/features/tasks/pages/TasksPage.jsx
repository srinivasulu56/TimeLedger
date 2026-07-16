import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function TasksPage() {
  const { tasks, setTasks, setSessions } = useOutletContext();

  const [title, setTitle] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [plannedSessions, setPlannedSessions] = useState([]);
  const [plannerStep, setPlannerStep] = useState("details");
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerError, setPlannerError] = useState("");

  function resetPlanner() {
    setDraftTitle("");
    setEstimatedMinutes("");
    setSessionDuration("");
    setPlannedSessions([]);
    setPlannerStep("details");
    setPlannerError("");
    setIsPlannerOpen(false);
  }

  function handleTitleSubmit(event) {
    event.preventDefault();

    const cleanedTitle = title.trim();

    if (!cleanedTitle) return;

    setDraftTitle(cleanedTitle);
    setTitle("");
    setPlannerError("");
    setIsPlannerOpen(true);
  }

  function handleGenerateSessions(event) {
    event.preventDefault();

    const totalMinutes = Number(estimatedMinutes);
    const preferredDuration = Number(sessionDuration);

    if (totalMinutes <= 0 || preferredDuration <= 0) {
      setPlannerError("Enter valid time values greater than zero.");
      return;
    }

    const taskId = crypto.randomUUID();
    const generatedSessions = [];
    let remainingMinutes = totalMinutes;
    let order = 1;

    while (remainingMinutes > 0) {
      const plannedDuration = Math.min(
        preferredDuration,
        remainingMinutes
      );

      generatedSessions.push({
        id: crypto.randomUUID(),
        taskId,
        order,
        topic: "",
        plannedDuration,
        actualDuration: null,
        status: "planned",
      });

      remainingMinutes -= plannedDuration;
      order += 1;
    }

    setPlannedSessions(generatedSessions);
    setPlannerError("");
    setPlannerStep("sessions");
  }

  function handleTopicChange(sessionId, topic) {
    setPlannedSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId ? { ...session, topic } : session
      )
    );
  }

  function handleCreateTask() {
    const newTask = {
      id: plannedSessions[0].taskId,
      title: draftTitle,
      estimatedMinutes: Number(estimatedMinutes),
      sessionDuration: Number(sessionDuration),
      status: "planned",
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setSessions((currentSessions) => [
      ...currentSessions,
      ...plannedSessions,
    ]);

    resetPlanner();
  }

  return (
    <section className="max-w-4xl">
      <h1 className="text-3xl font-bold">Your Tasks</h1>

      <p className="mt-2 text-gray-500">
        You currently have {tasks.length} tasks.
      </p>

      <form onSubmit={handleTitleSubmit} className="mt-8 flex gap-3">
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planner-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Create time plan
                </p>

                <h2 id="planner-title" className="mt-1 text-2xl font-bold">
                  {draftTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetPlanner}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            {plannerStep === "details" && (
              <form
                onSubmit={handleGenerateSessions}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="estimatedMinutes"
                    className="mb-1 block text-sm font-medium"
                  >
                    Estimated total time in minutes
                  </label>

                  <input
                    id="estimatedMinutes"
                    type="number"
                    min="1"
                    value={estimatedMinutes}
                    onChange={(event) =>
                      setEstimatedMinutes(event.target.value)
                    }
                    placeholder="Example: 600"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sessionDuration"
                    className="mb-1 block text-sm font-medium"
                  >
                    Preferred session duration in minutes
                  </label>

                  <input
                    id="sessionDuration"
                    type="number"
                    min="1"
                    value={sessionDuration}
                    onChange={(event) =>
                      setSessionDuration(event.target.value)
                    }
                    placeholder="Example: 50"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                {plannerError && (
                  <p className="text-sm text-red-600">{plannerError}</p>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Generate sessions
                </button>
              </form>
            )}

            {plannerStep === "sessions" && (
              <div className="mt-6">
                <p className="text-gray-600">
                  Add an optional topic or subtask for each session.
                </p>

                <div className="mt-5 space-y-3">
                  {plannedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <p className="font-medium">
                        Session {session.order} · {session.plannedDuration} min
                      </p>

                      <input
                        type="text"
                        value={session.topic}
                        onChange={(event) =>
                          handleTopicChange(session.id, event.target.value)
                        }
                        placeholder="Topic or subtask (optional)"
                        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPlannerStep("details")}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateTask}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    Create task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default TasksPage;