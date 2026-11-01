import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../hooks/useTasks';
import { useFilter } from '../hooks/useFilter';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startTour } from '../redux/onboardingSlice';

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { totalCount, activeCount, completedCount, reset } = useTasks();
  const { reset: resetFilters } = useFilter();
  const [confirmed, setConfirmed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReplayTour = () => {
    dispatch(startTour());
    navigate('/');
  };

  const handleReset = () => {
    if (confirmed) {
      reset();
      resetFilters();
      setConfirmed(false);
    } else {
      setConfirmed(true);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your preferences and app data</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="card settings-card">
        <h2 className="card-title">🎨 Appearance</h2>
        <div className="settings-row">
          <div>
            <p className="settings-label">Theme</p>
            <p className="settings-desc">Currently using <strong>{theme}</strong> mode</p>
          </div>
          <button className="btn btn-secondary" onClick={toggle}>
            {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="card settings-card">
        <h2 className="card-title">📊 Data Summary</h2>
        <div className="settings-stats">
          {[
            { label: 'Total Tasks',    value: totalCount,     icon: '📋' },
            { label: 'Active',         value: activeCount,    icon: '⚡' },
            { label: 'Completed',      value: completedCount, icon: '✅' },
            { label: 'Completion',
              value: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '—',
              icon: '📈' },
          ].map((s) => (
            <div key={s.label} className="settings-stat">
              <span className="settings-stat-icon">{s.icon}</span>
              <span className="settings-stat-value">{s.value}</span>
              <span className="settings-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card settings-card">
        <h2 className="card-title">ℹ️ About</h2>
        <div className="about-grid">
          {[
            { label: 'App',       value: 'TaskFlow v1.0.0' },
            { label: 'Frontend',  value: 'React 19 + Vite' },
            { label: 'State',     value: 'Redux Toolkit' },
            { label: 'Backend',   value: 'Node.js + Express (planned)' },
            { label: 'Database',  value: 'PostgreSQL (planned)' },
            { label: 'Storage',   value: 'localStorage (current)' },
          ].map((r) => (
            <div key={r.label} className="about-row">
              <span className="about-label">{r.label}</span>
              <span className="about-value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Tour */}
      <div className="card settings-card">
        <h2 className="card-title">📖 Hướng dẫn sử dụng</h2>
        <div className="settings-row">
          <div>
            <p className="settings-label">Tour hướng dẫn</p>
            <p className="settings-desc">Xem lại các bước làm quen với TaskFlow từ đầu.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleReplayTour}>
            ▶️ Xem lại hướng dẫn
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="card settings-card danger-card">
        <h2 className="card-title">⚠️ Danger Zone</h2>
        <div className="settings-row">
          <div>
            <p className="settings-label">Reset to Default Data</p>
            <p className="settings-desc">Clears all your tasks and restores the original 15 dummy tasks.</p>
          </div>
          <button
            className={`btn ${confirmed ? 'btn-danger' : 'btn-ghost'}`}
            onClick={handleReset}
          >
            {confirmed ? '⚠️ Confirm Reset' : '🔄 Reset Data'}
          </button>
        </div>
        {confirmed && (
          <p className="warning-text">Click again to confirm. This cannot be undone.</p>
        )}
      </div>
    </div>
  );
}
