import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import type { Task } from '../types';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import Layout from '../components/Layout';
import { Sun, Moon, Search,Bell,LayoutDashboard,Plus,Sparkles} from 'lucide-react';

type FilterType = 'all' | Task['status'];

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const { user} = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const newTask = await createTask(data);
      setTasks([newTask, ...tasks]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingTask) return;
    try {
      const updated = await updateTask(editingTask._id, data);
      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
      setEditingTask(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  const completionPct = tasks.length===0 ? 0 : Math.round((counts.completed/tasks.length)*100);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => filter === 'all' || t.status === filter)
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  const filterPills: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const hour = new Date().getHours();
  const greeting = hour <12 ? 'morning' : hour <17 ? 'afternoon' : 'evening';

  const radius = 20;
  const circumference = 2* Math.PI*radius;
  const strokeDashoffset = circumference - (completionPct/100)*circumference;

  return (
    <Layout>
      {/* TOP HEADER — Screenshot 1 style */}
      <header className="h-20 px-8 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Good {greeting}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="25" cy="25" r={radius} fill="none"
                stroke="url(#ring-grad)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-[9px] font-bold text-slate-700 dark:text-white">{completionPct}%</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Bell with red dot */}
          <button className="p-2.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800" />
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterPills.map((pill) => (
              <button
                key={pill.key}
                onClick={() => setFilter(pill.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                  ${filter === pill.key
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                {pill.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${filter === pill.key ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {counts[pill.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Task Input Panel — Screenshot 1 style with AI Breakdown */}
          <div className="mb-8 p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                <Sparkles size={14} /> AI Breakdown
              </button>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="text-indigo-500" size={20} />
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <TaskForm
              onSubmit={editingTask ? handleUpdate : handleCreate}
              initialData={editingTask}
              onCancel={editingTask ? () => setEditingTask(null) : undefined}
            />
          </div>

          {/* Task Feed */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                Loading your workspace...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No tasks found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                  {tasks.length === 0
                    ? "You're all caught up! Create a new task above to get started."
                    : "No tasks match your current filters or search criteria."}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={setEditingTask} onDelete={handleDelete} />
              ))
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;