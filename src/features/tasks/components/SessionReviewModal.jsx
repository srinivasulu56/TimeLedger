import { useState } from "react";

export default function SessionReviewModal({
  session,
  actualMinutesWorked,
  pauseLogs,
  onCompleteFull,
  onCarryForward,
}) {
  const [isSubtaskFinished, setIsSubtaskFinished] = useState(true);
  const [remainingMinutes, setRemainingMinutes] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubtaskFinished) {
      onCompleteFull(session.id, "Completed", actualMinutesWorked, pauseLogs);
    } else {
      onCarryForward(
        session,
        Number(remainingMinutes),
        actualMinutesWorked,
        pauseLogs
      );
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            🎉 Session Time Finished
          </span>
          <span className="text-xs font-medium text-gray-500">
            Worked: <strong className="text-gray-900">{actualMinutesWorked} min</strong>
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold text-gray-900">
          Subtask Completion Review
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Topic: <span className="font-semibold text-gray-800">{session.topic || `Session ${session.order}`}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Question: Did you finish the subtask? */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Did you complete this subtask/topic?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsSubtaskFinished(true)}
                className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                  isSubtaskFinished
                    ? "border-green-500 bg-green-50 text-green-800 shadow-xs"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                ✅ Yes, Fully Done!
              </button>

              <button
                type="button"
                onClick={() => setIsSubtaskFinished(false)}
                className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                  !isSubtaskFinished
                    ? "border-amber-500 bg-amber-50 text-amber-800 shadow-xs"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                ⏳ No, Need More Time
              </button>
            </div>
          </div>

          {/* If Not Completed: Ask for Remaining Minutes */}
          {!isSubtaskFinished && (
            <div className="rounded-xl bg-amber-50/60 p-4 border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-amber-900">
                How much more time do you need for this subtask?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={remainingMinutes}
                  onChange={(e) => setRemainingMinutes(e.target.value)}
                  className="w-full rounded-lg border border-amber-300 bg-white p-2.5 text-sm font-bold text-gray-900 outline-none focus:border-amber-500"
                />
                <span className="text-xs font-medium text-amber-800">Minutes</span>
              </div>
              <p className="text-[11px] text-amber-700">
                TimeLedger will auto-create a carryover session for this subtask.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
          >
            {isSubtaskFinished
              ? "Save & Mark Completed"
              : "Generate Carryover Session ⚡"}
          </button>
        </form>
      </div>
    </div>
  );
}