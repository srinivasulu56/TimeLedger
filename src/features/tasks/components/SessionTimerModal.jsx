import { useState, useEffect, useRef } from "react";
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
            setIsReviewOpen(true); // Open review modal when time reaches 0
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

  const progressPercentage =
    ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleFinishClick = () => {
    setIsRunning(false);
    setIsReviewOpen(true); // Trigger completion review
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Active Session #{session.order}
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          {session.topic || `Session ${session.order}`}
        </h2>

        <div className="my-6">
          <div className="text-6xl font-black tracking-tight text-gray-900 font-mono">
            {formatTime(secondsLeft)}
          </div>

          <div className="mt-6 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {pauseLogs.length > 0 && (
          <div className="mb-4 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-100">
            ⚠️ Paused {pauseLogs.length} time
            {pauseLogs.length > 1 ? "s" : ""} this session
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all"
            >
              {secondsLeft === totalSeconds ? "Start Session" : "Resume"}
            </button>
          ) : (
            <button
              onClick={handlePauseClick}
              className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-600 transition-all"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleFinishClick}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Complete
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-medium"
        >
          Exit without saving
        </button>
      </div>

      {/* Pause Reason Modal */}
      {isPauseReasonModalOpen && (
        <PauseReasonModal
          pauseDurationMins={getPauseDurationInMinutes()}
          onResumeSession={handleResumeFromModal}
        />
      )}

      {/* Subtask Completion Review Modal */}
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
  );
}