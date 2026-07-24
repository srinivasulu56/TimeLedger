import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckSquare, Trash2, Sparkles, X, Terminal } from "lucide-react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";
import PageTransition from "../../../shared/components/PageTransition";

export default function TasksPage() {
  const { tasks, addTask } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1 Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [preferredSessionMins, setPreferredSessionMins] = useState(45);

  // Step 2 Form State
  const [subtasks, setSubtasks] = useState([]);

  const calculatedTotalMinutes = estimatedHours * 60;
  const calculatedSessionCount = Math.ceil(
    calculatedTotalMinutes / preferredSessionMins
  );

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (step === 1) {
      const initialSubtasks = Array.from(
        { length: calculatedSessionCount },
        (_, i) => `${title} - Part ${i + 1}`
      );
      setSubtasks(initialSubtasks);
      setStep(2);
    }
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, `${title} - Part ${subtasks.length + 1}`]);
  };

  const handleRemoveSubtask = (index) => {
    if (subtasks.length <= 1) return;
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const taskId = crypto.randomUUID();

    const generatedSessions = subtasks.map((topic, index) => ({
      id: crypto.randomUUID(),
      taskId: taskId,
      order: index + 1,
      topic: topic.trim() || `Session ${index + 1}`,
      plannedDuration: Number(preferredSessionMins),
      actualDuration: null,
      status: "planned",
      isCarryover: false,
    }));

    const newTask = {
      id: taskId,
      title: title.trim(),
      category: category,
      estimatedMinutes: calculatedTotalMinutes,
      sessionDuration: Number(preferredSessionMins),
      createdAt: new Date().toISOString(),
    };

    addTask(newTask, generatedSessions);

    // Reset & Close
    setTitle("");
    setStep(1);
    setIsModalOpen(false);
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6 font-mono">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" /> Task Plans
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tasks.length} ACTIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Structured focus sequences divided into execution intervals.
            </p>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> CREATE_TASK_PLAN
          </button>
        </div>

        {/* Task Cards Grid */}
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 bg-[#0A0A0A] p-12 text-center">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">// NO_ACTIVE_PLANS</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Initialize a plan to decompose targets into focus blocks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* 🔮 Cyberpunk Creation Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative w-full max-w-lg rounded-lg border border-slate-800 bg-[#0A0A0A] p-6 shadow-2xl text-left flex flex-col justify-between max-h-[90vh] overflow-y-auto"
              >
                {/* Custom scrollbar hide wrapper */}
                <div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      STEP_{step}_OF_2
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                    {step === 1 ? "DEFINE_PARAMETERS" : "CUSTOMIZE_SUBTASKS"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {step === 1
                      ? "Set target output hours and interval lengths."
                      : "Refine block topics or add/remove focus steps."}
                  </p>
                </div>

                {step === 1 ? (
                  <form onSubmit={handleNextStep} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        TASK_TITLE
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Build Authentication Engine"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded border border-slate-800 bg-black p-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          CATEGORY
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded border border-slate-800 bg-black p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                        >
                          <option value="Development">Development</option>
                          <option value="Design">Design</option>
                          <option value="Research">Research</option>
                          <option value="Writing">Writing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          ESTIMATED_HOURS
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={estimatedHours}
                          onChange={(e) => setEstimatedHours(e.target.value)}
                          className="w-full rounded border border-slate-800 bg-black p-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        PREFERRED_INTERVAL
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[25, 45, 60].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setPreferredSessionMins(mins)}
                            className={`rounded border p-2 text-xs font-bold transition-all ${
                              preferredSessionMins === mins
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                : "border-slate-800 bg-black text-slate-500 hover:bg-slate-900"
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded border border-slate-800 bg-black p-3 text-xs text-slate-400 flex items-center justify-between">
                      <span>ESTIMATED_BLOCKS:</span>
                      <strong className="text-emerald-400 text-sm">
                        {calculatedSessionCount} BLOCKS
                      </strong>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      CONFIGURE_TOPICS →
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleFinalSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {subtasks.map((topic, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-2 min-w-[65px] text-center">
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            required
                            value={topic}
                            onChange={(e) => handleSubtaskChange(index, e.target.value)}
                            className="flex-1 rounded border border-slate-800 bg-black px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-all"
                          />
                          {subtasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSubtask(index)}
                              className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="w-full py-2 rounded border border-dashed border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-900 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD_BLOCK
                    </button>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded border border-slate-800 bg-black px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900"
                      >
                        ← BACK
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> INITIALIZE_PLAN
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}