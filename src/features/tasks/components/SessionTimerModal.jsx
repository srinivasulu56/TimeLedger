import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle2, X, Terminal } from "lucide-react";
import PauseReasonModal from "./PauseReasonModal";
import SessionReviewModal from "./SessionReviewModal";

export default function SessionTimerModal({
  session,
  onClose,
  onCompleteFull,
  onCarryForward,
}) {
  const totalSeconds = session.plannedDuration * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Pause tracking state
  const [isPauseReasonModalOpen, setIsPauseReasonModalOpen] = useState(false);
  const [pauseLogs, setPauseLogs] = useState(session.pauseLogs || []);
  const pauseStartTimeRef = useRef(null);

  const timerRef = useRef(null);

  const secondsElapsed = totalSeconds - secondsLeft;
  const actualMinutesWorked = Math.max(1, Math.round(secondsElapsed / 60));

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsReviewOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handlePauseClick = () => {
    setIsRunning(false);
    pauseStartTimeRef.current = Date.now();
    setIsPauseReasonModalOpen(true);
  };

  const handleResumeFromModal = (reasonData) => {
    setPauseLogs((prev) => [
      ...prev,
      { ...reasonData, timestamp: new Date().toISOString() },
    ]);
    setIsPauseReasonModalOpen(false);
    pauseStartTimeRef.current = null;
    setIsRunning(true);
  };

  const getPauseDurationInMinutes = () => {
    if (!pauseStartTimeRef.current) return 0;
    const diffInMs = Date.now() - pauseStartTimeRef.current;
    return Math.max(1, Math.round(diffInMs / (1000 * 60)));
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // SVG Radial Ring Properties
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (secondsLeft / totalSeconds) * 100;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-sm rounded-lg border border-slate-800 bg-[#0A0A0A] p-6 shadow-2xl text-center flex flex-col justify-between"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Session Header */}
          <div>
            <span className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase">
              SESSION_#{session.order}
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-100 uppercase tracking-tight">
              {session.topic || `SESSION_${session.order}`}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              PLANNED_DURATION: {session.plannedDuration}m
            </p>
          </div>

          {/* Clock */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-slate-900"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold font-mono text-slate-100 tracking-wider">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">
                [{isRunning ? "FOCUSING" : "PAUSED"}]
              </span>
            </div>
          </div>

          {/* Pause Counter Badge */}
          {pauseLogs.length > 0 && (
            <div className="mb-3 inline-flex items-center justify-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-400">
              ⚠️ PAUSED_{pauseLogs.length}_TIMES
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-emerald-400" />
                {secondsLeft === totalSeconds ? "START_FOCUS" : "RESUME"}
              </button>
            ) : (
              <button
                onClick={handlePauseClick}
                className="flex-1 flex items-center justify-center gap-1.5 rounded border border-amber-500/40 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                <Pause className="w-3.5 h-3.5 fill-amber-400" />
                PAUSE
              </button>
            )}

            <button
              onClick={() => {
                setIsRunning(false);
                setIsReviewOpen(true);
              }}
              className="flex items-center gap-1 rounded border border-slate-800 bg-black px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              FINISH
            </button>
          </div>
        </motion.div>

        {/* Modals */}
        {isPauseReasonModalOpen && (
          <PauseReasonModal
            pauseDurationMins={getPauseDurationInMinutes()}
            onResumeSession={handleResumeFromModal}
          />
        )}

        {isReviewOpen && (
          <SessionReviewModal
            session={session}
            actualMinutesWorked={actualMinutesWorked}
            pauseLogs={pauseLogs}
            onCompleteFull={onCompleteFull}
            onCarryForward={onCarryForward}
          />
        )}
      </div>
    </AnimatePresence>
  );
}