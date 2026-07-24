import { useState } from "react";
import { motion } from "framer-motion";
import { Pause, Clock, Check, Play } from "lucide-react";

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
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-md rounded-lg border border-slate-800 bg-[#0A0A0A] p-6 shadow-2xl text-left"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 uppercase">
            <Pause className="w-3 h-3 fill-amber-400" /> [SESSION_PAUSED]
          </span>
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            PAUSED: <strong className="text-amber-300">{pauseDurationMins}m</strong>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-tight">
          PAUSE_DIAGNOSTIC_LOG
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Log interruption telemetry to optimize dynamic sequence flow.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Reason Selector List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {PRESET_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.label;
              return (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.label)}
                  className={`w-full flex items-center justify-between rounded border p-2.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                      : "border-slate-800 bg-black text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                  }`}
                >
                  <span>{reason.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
              OPTIONAL_NOTE:
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g., Quick door knock / urgent call"
              className="w-full rounded border border-slate-800 bg-black p-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-amber-400 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 rounded border border-amber-500/40 bg-amber-500/10 py-3 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all uppercase"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400" /> LOG_REASON_&_RESUME
          </button>
        </form>
      </motion.div>
    </div>
  );
}