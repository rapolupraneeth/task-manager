import { useState, useEffect } from 'react';
import {
  DndContext,  DragOverlay, PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent,DragOverEvent,DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTasks, updateTask } from '../api/taskApi';
import type { Task } from '../types';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, AlertTriangle } from 'lucide-react';

// ─── Priority bar color ───────────────────────────────────────────────────────
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

const isOverdue = (dueDate?: string, status?: Task['status']) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

// ─── Sortable Kanban Card ─────────────────────────────────────────────────────
const KanbanCard = ({ task, isDragging = false }: { task: Task; isDragging?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex rounded-xl overflow-hidden border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <div className={`w-1.5 flex-shrink-0 ${priorityBar[task.priority]}`} />
      <div className="flex-1 p-3">
        <p className={`text-sm font-medium text-slate-800 dark:text-white mb-1 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between flex-wrap gap-1.5 mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[task.status]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs font-mono ${overdue ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
              {overdue && <AlertTriangle size={10} />}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Drag Overlay Card (shown while dragging) ─────────────────────────────────
const DragCard = ({ task }: { task: Task }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <div className="flex rounded-xl overflow-hidden border border-indigo-400 bg-white dark:bg-slate-800 shadow-2xl rotate-2 cursor-grabbing w-64">
      <div className={`w-1.5 flex-shrink-0 ${priorityBar[task.priority]}`} />
      <div className="flex-1 p-3">
        <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">{task.title}</p>
        {task.dueDate && (
          <span className={`text-xs font-mono ${overdue ? 'text-red-500' : 'text-slate-400'}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────
interface ColumnProps {
  id: Task['status'];
  title: string;
  tasks: Task[];
  color: string;
  count: number;
}

const Column = ({ id, title, tasks, color, count }: ColumnProps) => {
  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-sm" id={id}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{count}</span>
      </div>

      <div
        className={`flex-1 min-h-[500px] rounded-2xl p-3 border border-slate-200/50 dark:border-slate-800/50 bg-slate-100/60 dark:bg-slate-900/40 space-y-2.5 transition-colors`}
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task._id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-600 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Kanban Page ─────────────────────────────────────────────────────────
const columns: { id: Task['status']; title: string; color: string }[] = [
  { id: 'pending', title: 'Pending', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-400' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-400' },
];

const Kanban = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { theme, toggleTheme } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status: Task['status']) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column we're dragging over
    const overColumn = columns.find((c) => c.id === overId);
    const activeTaskItem = tasks.find((t) => t._id === activeId);
    const overTaskItem = tasks.find((t) => t._id === overId);

    if (!activeTaskItem) return;

    // If dragging over a column directly
    if (overColumn && activeTaskItem.status !== overColumn.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === activeId ? { ...t, status: overColumn.id } : t
        )
      );
      return;
    }

    // If dragging over another task (in a different column)
    if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === activeId ? { ...t, status: overTaskItem.status } : t
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t._id === activeId);
    if (!activeTaskItem) return;

    // Determine final status
    const overColumn = columns.find((c) => c.id === overId);
    const overTask = tasks.find((t) => t._id === overId);
    const finalStatus = overColumn?.id ?? overTask?.status ?? activeTaskItem.status;

    // Only call API if status actually changed
    if (finalStatus !== activeTaskItem.status) {
      try {
        const updated = await updateTask(activeId, { status: finalStatus });
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      } catch (err) {
        // Revert on API failure
        fetchTasks();
      }
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Kanban Board</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Drag tasks between columns to update their status</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((col) => {
                const colTasks = getTasksByStatus(col.id);
                return (
                  <Column
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    color={col.color}
                    tasks={colTasks}
                    count={colTasks.length}
                  />
                );
              })}
            </div>
            <DragOverlay>
              {activeTask ? <DragCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </Layout>
  );
};

export default Kanban;