import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ListTodo, ArrowRight, Trash2 } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { deleteTask } = useTasks();

  // Safe fallback for sessions array
  const safeSessions = Array.isArray(task?.sessions) ? task.sessions : [];
  
  const completedBlocks = safeSessions.filter(
    (s) => s.status === 'Completed' || s.status === 'completed'
  ).length;
  
  const totalBlocks = safeSessions.length;
  const progressPercent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
      className="group relative rounded-lg border border-slate-800 bg-[#0A0A0A] p-5 shadow-sm hover:border-emerald-500/50 hover:bg-black/80 transition-all cursor-pointer font-mono flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
            {task.category || 'Development'}
          </span>
          <button
            onClick={handleDelete}
            className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete Task Plan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {task.title}
        </h3>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {task.estimated_minutes || task.estimatedMinutes || 0}m est.
          </span>
          <span className="flex items-center gap-1">
            <ListTodo className="w-3.5 h-3.5 text-slate-500" />
            {completedBlocks}/{totalBlocks} Blocks
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="bg-emerald-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>{progressPercent}% COMPLETE</span>
        <span className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          VIEW_DETAILS <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}