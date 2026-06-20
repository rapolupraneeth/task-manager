import type { Task } from '../types';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityBar: Record<Task['priority'], string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

const statusBadge: Record<Task['status'], string> = {
  pending: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
};

const statusLabel: Record<Task['status'], string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const isOverdue = (dueDate?: string, status?: Task['status']) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={`flex rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 shadow-sm transition-opacity ${
        task.status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      <div className={`w-1.5 flex-shrink-0 ${priorityBar[task.priority]}`} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`font-medium text-sm text-slate-800 dark:text-white ${
              task.status === 'completed' ? 'line-through' : ''
            }`}
          >
            {task.title}
          </p>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[task.status]}`}>
            {statusLabel[task.status]}
          </span>

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-xs font-mono ${
                overdue ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {overdue && <AlertTriangle size={12} />}
              {overdue ? 'Overdue ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;