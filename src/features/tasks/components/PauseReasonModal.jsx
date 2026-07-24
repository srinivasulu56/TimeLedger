import { useState } from "react";

const PRESET_REASONS = [
  { id: "family", label: "👨‍👩‍👧 Family Distraction" },
  { id: "friends", label: "💬 Friends / Social" },
  { id: "phone", label: "📱 Notifications / Social Media" },
  { id: "fatigue", label: "☕ Fatigue / Mental Break" },
  { id: "work_interrupt", label: "📩 Urgent Work / Email" },
  { id: "other", label: "❓ Other Reason" },
];

export default function PauseReasonModal({ pauseDurationMins, onResumeSession }) {
  const [selectedReason, setSelectedReason] = useState(PRESET_REASONS[0].label);
  const [customNote, setCustomNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onResumeSession({
      reasonCategory: selectedReason,
      customNote: customNote.trim(),
      pauseDurationMinutes: pauseDurationMins,
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            ⏸️ Session Paused
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Paused for: <span className="text-amber-600 font-mono font-bold">{pauseDurationMins} min</span>
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-gray-900">Why did you pause?</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Tracking pause reasons helps TimeLedger optimize your peak focus hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {PRESET_REASONS.map((reason) => (
              <button
                key={reason.id}
                type="button"
                onClick={() => setSelectedReason(reason.label)}
                className={`flex items-center justify-between rounded-xl border p-3 text-xs font-medium transition-all ${
                  selectedReason === reason.label
                    ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{reason.label}</span>
                {selectedReason === reason.label && <span>✓</span>}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Optional Detail / Note
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g., Answering quick delivery door knock"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
          >
            Log Reason & Resume Focus ▶
          </button>
        </form>
      </div>
    </div>
  );
}