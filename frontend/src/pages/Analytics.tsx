import { useState, useEffect, useMemo } from 'react';
import { getTasks } from '../api/taskApi';
import type { Task } from '../types';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ListTodo, CheckCircle2, Loader2, Zap } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDayKey = (date: Date) => date.toISOString().split('T')[0]; // "2026-06-17"

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

const getLast8Weeks = () => {
  const weeks: Date[][] = [];
  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - 55); // ~8 weeks back

  for (let w = 0; w < 8; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + w * 7 + d);
      week.push(day);
    }
    weeks.push(week);
  }
  return weeks;
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ label, value, icon, iconBg }: StatCardProps) => (
  <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm backdrop-blur-md flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// ─── Main Analytics Page ──────────────────────────────────────────────────────

const Analytics = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  // ── Stat counts ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, inProgress, rate };
  }, [tasks]);

  // ── Weekly velocity: completedAt per day for the last 7 days ─────────────────
  const weeklyVelocity = useMemo(() => {
    const last7 = getLast7Days();
    return last7.map((day) => {
      const key = getDayKey(day);
      const count = tasks.filter((t) => {
        if (!t.completedAt) return false;
        return getDayKey(new Date(t.completedAt)) === key;
      }).length;
      return { day, label: day.toLocaleDateString('en-US', { weekday: 'short' }), count };
    });
  }, [tasks]);

  const maxVelocity = Math.max(...weeklyVelocity.map((d) => d.count), 1);

  // ── Status distribution ───────────────────────────────────────────────────────
  const distribution = useMemo(() => {
    const total = tasks.length || 1;
    return [
      { label: 'Pending', count: tasks.filter((t) => t.status === 'pending').length, color: 'bg-slate-400', textColor: 'text-slate-600 dark:text-slate-400' },
      { label: 'In progress', count: tasks.filter((t) => t.status === 'in-progress').length, color: 'bg-amber-400', textColor: 'text-amber-600 dark:text-amber-400' },
      { label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length, color: 'bg-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-400' },
    ].map((item) => ({ ...item, pct: Math.round((item.count / total) * 100) }));
  }, [tasks]);

  // ── Activity heatmap: tasks created per day for last 8 weeks ─────────────────
  const heatmap = useMemo(() => {
    const weeks = getLast8Weeks();
    const today = getDayKey(new Date());

    return weeks.map((week) =>
      week.map((day) => {
        const key = getDayKey(day);
        const count = tasks.filter((t) => getDayKey(new Date(t.createdAt)) === key).length;
        const isFuture = key > today;
        return { day, key, count, isFuture };
      })
    );
  }, [tasks]);

  const maxHeatmap = Math.max(...heatmap.flat().map((d) => d.count), 1);

  const heatColor = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-slate-100 dark:bg-slate-800/30';
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
    const intensity = count / maxHeatmap;
    if (intensity < 0.25) return 'bg-indigo-200 dark:bg-indigo-900';
    if (intensity < 0.5) return 'bg-indigo-300 dark:bg-indigo-700';
    if (intensity < 0.75) return 'bg-indigo-400 dark:bg-indigo-500';
    return 'bg-indigo-500 dark:bg-indigo-400';
  };

  return (
    <Layout>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real data from your task history</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── 4 Stat Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total tasks"
                value={stats.total}
                icon={<ListTodo size={22} className="text-indigo-500" />}
                iconBg="bg-indigo-50 dark:bg-indigo-500/10"
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                icon={<CheckCircle2 size={22} className="text-emerald-500" />}
                iconBg="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <StatCard
                label="In progress"
                value={stats.inProgress}
                icon={<Loader2 size={22} className="text-amber-500" />}
                iconBg="bg-amber-50 dark:bg-amber-500/10"
              />
              <StatCard
                label="Completion rate"
                value={`${stats.rate}%`}
                icon={<Zap size={22} className="text-purple-500" />}
                iconBg="bg-purple-50 dark:bg-purple-500/10"
              />
            </div>

            {/* ── Weekly Velocity + Distribution ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Weekly Velocity Bar Chart */}
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm backdrop-blur-md">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Weekly Velocity</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Tasks completed per day this week</p>
                <div className="flex items-end gap-2 h-32">
                  {weeklyVelocity.map(({ label, count }, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400">{count > 0 ? count : ''}</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md relative" style={{ height: '80px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-md transition-all duration-700 ease-out"
                          style={{ height: `${(count / maxVelocity) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{label}</span>
                    </div>
                  ))}
                </div>
                {stats.completed === 0 && (
                  <p className="text-center text-xs text-slate-400 mt-4">Complete tasks to see velocity data</p>
                )}
              </div>

              {/* Status Distribution */}
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm backdrop-blur-md">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Distribution</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Task breakdown by status</p>
                <div className="space-y-4">
                  {distribution.map(({ label, count, pct, color, textColor }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {count} · {tasks.length === 0 ? '0' : pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${tasks.length === 0 ? 0 : pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Activity Heatmap ──────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm backdrop-blur-md">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Activity Heatmap</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Tasks created per day — last 8 weeks</p>

              <div className="flex gap-1.5">
                {/* Day labels column */}
                <div className="flex flex-col gap-1.5 pt-6">
                  {DAY_LABELS.map((d) => (
                    <div key={d} className="h-7 flex items-center">
                      <span className="text-[10px] text-slate-400 font-mono w-6">{d}</span>
                    </div>
                  ))}
                </div>

                {/* Week columns */}
                <div className="flex gap-1.5 overflow-x-auto flex-1">
                  {heatmap.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1.5">
                      {/* Month label for first day of each week */}
                      <div className="h-5 flex items-center">
                        {week[0].day.getDate() <= 7 && (
                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {week[0].day.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        )}
                      </div>
                      {week.map(({ key, count, isFuture }) => (
                        <div
                          key={key}
                          title={`${key}: ${count} task${count !== 1 ? 's' : ''}`}
                          className={`w-7 h-7 rounded-md transition-colors ${heatColor(count, isFuture)}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 mt-4 justify-end">
                <span className="text-[10px] text-slate-400 font-mono mr-1">Less</span>
                {['bg-slate-100 dark:bg-slate-800', 'bg-indigo-200 dark:bg-indigo-900', 'bg-indigo-300 dark:bg-indigo-700', 'bg-indigo-400 dark:bg-indigo-500', 'bg-indigo-500 dark:bg-indigo-400'].map((c, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
                ))}
                <span className="text-[10px] text-slate-400 font-mono ml-1">More</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;