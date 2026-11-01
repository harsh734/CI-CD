import { useTasks } from '../hooks/useTasks';
import ProgressBar from '../components/ui/ProgressBar';
import TaskCard from '../components/ui/TaskCard';
import Modal from '../components/ui/Modal';
import { useState } from 'react';

export default function Dashboard() {
  const {
    items,
    totalCount,
    activeCount,
    completedCount,
    toggle,
    remove,
    update,
  } = useTasks();
  const [editTask, setEditTask] = useState(null);

  const recentActive = items.filter((t) => t.status === 'active').slice(0, 5);
  const recentCompleted = items
    .filter((t) => t.status === 'completed')
    .slice(0, 3);

  const stats = [
    {
      label: 'Total Tasks',
      value: totalCount,
      icon: '📋',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: '⚡',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: '✅',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      label: 'Completion Rate',
      value:
        totalCount > 0
          ? `${Math.round((completedCount / totalCount) * 100)}%`
          : '0%',
      icon: '📈',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    },
  ];
  // HEADER
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Good evening! You have <strong>{activeCount}</strong> tasks
            remaining.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ '--stat-bg': s.bg, '--stat-color': s.color }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="card">
        <h2 className="card-title">Overall Progress</h2>
        <ProgressBar
          value={completedCount}
          max={totalCount}
          label="Tasks Completed"
        />
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h2 className="card-title">Category Breakdown</h2>
        <div className="category-bars">
          {[
            { id: 'work', label: '💼 Work', color: '#3b82f6' },
            { id: 'health', label: '💪 Health', color: '#10b981' },
            { id: 'learning', label: '📚 Learning', color: '#f59e0b' },
            { id: 'personal', label: '🙂 Personal', color: '#ec4899' },
            { id: 'shopping', label: '🛒 Shopping', color: '#8b5cf6' },
          ].map((cat) => {
            const total = items.filter((t) => t.category === cat.id).length;
            const done = items.filter(
              (t) => t.category === cat.id && t.status === 'completed',
            ).length;
            return (
              <div key={cat.id} className="cat-bar-row">
                <span className="cat-bar-label">{cat.label}</span>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width:
                        total > 0
                          ? `${Math.round((done / total) * 100)}%`
                          : '0%',
                      background: cat.color,
                    }}
                  />
                </div>
                <span className="cat-bar-stat">
                  {done}/{total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Active Tasks */}
      <div className="card">
        <h2 className="card-title">🔥 Active Tasks</h2>
        {recentActive.length === 0 ? (
          <p className="empty-text">
            No active tasks — you're all caught up! 🎉
          </p>
        ) : (
          recentActive.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggle}
              onDelete={remove}
              onEdit={setEditTask}
            />
          ))
        )}
      </div>

      {/* Recently Completed */}
      {recentCompleted.length > 0 && (
        <div className="card">
          <h2 className="card-title">✅ Recently Completed</h2>
          {recentCompleted.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggle}
              onDelete={remove}
              onEdit={setEditTask}
            />
          ))}
        </div>
      )}

      {editTask && (
        <Modal
          task={editTask}
          onSave={(data) => update(editTask.id, data)}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
}
