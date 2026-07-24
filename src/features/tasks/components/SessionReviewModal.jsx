import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-md rounded-lg border border-slate-800 bg-[#0A0A0A] p-6 shadow-2xl text-left"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase">
            [SESSION_FINISHED]
          </span>
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            WORKED: <strong className="text-slate-100">{actualMinutesWorked}m</strong>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-tight">
          COMPLETION_REVIEW
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Topic: <span className="text-slate-200 font-semibold">{session.topic || `Session ${session.order}`}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Option Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              DID_YOU_COMPLETE_THIS_BLOCK?
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsSubtaskFinished(true)}
                className={`rounded border p-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSubtaskFinished
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : "border-slate-800 bg-black text-slate-500 hover:bg-slate-900"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> YES_FINISHED
              </button>

              <button
                type="button"
                onClick={() => setIsSubtaskFinished(false)}
                className={`rounded border p-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !isSubtaskFinished
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                    : "border-slate-800 bg-black text-slate-500 hover:bg-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" /> NEED_MORE_TIME
              </button>
            </div>
          </div>

          {/* Carryover Input */}
          {!isSubtaskFinished && (
            <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
              <label className="block text-xs font-bold text-amber-400">
                ADDITIONAL_MINUTES_NEEDED:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={remainingMinutes}
                  onChange={(e) => setRemainingMinutes(e.target.value)}
                  className="w-full rounded border border-amber-500/40 bg-black p-2 text-xs font-bold text-slate-100 outline-none focus:border-amber-400"
                />
                <span className="text-xs font-bold text-amber-400">MINS</span>
              </div>
              <p className="text-[10px] text-amber-500/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-inserts carryover session.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all uppercase"
          >
            {isSubtaskFinished ? (
              <>MARK_COMPLETED ✨</>
            ) : (
              <>GENERATE_CARRYOVER_BLOCK ⚡</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}