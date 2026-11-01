import { NavLink } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { CATEGORIES } from '../../data/categories';

const linkFor = (id) => (id === 'all' ? '/tasks' : `/tasks/category/${id}`);

export default function Sidebar() {
  const { items } = useTasks();

  const getCount = (id) =>
    id === 'all' ? items.length : items.filter((t) => t.category === id).length;

  return (
    <aside className="sidebar">
      <p className="sidebar-heading">Categories</p>
      <ul className="sidebar-list">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <NavLink
              to={linkFor(cat.id)}
              end={cat.id === 'all'}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              style={{ '--cat-color': cat.color }}
            >
              <span className="sidebar-icon">{cat.icon}</span>
              <span className="sidebar-label">{cat.label}</span>
              <span className="sidebar-count">{getCount(cat.id)}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-divider" />

      <p className="sidebar-heading">Quick Stats</p>
      <div className="sidebar-stats">
        {[
          { label: 'Total',  value: items.length,                                       color: '#6366f1' },
          { label: 'Active', value: items.filter((t) => t.status === 'active').length,    color: '#f59e0b' },
          { label: 'Done',   value: items.filter((t) => t.status === 'completed').length, color: '#10b981' },
        ].map((s) => (
          <div key={s.label} className="stat-mini" style={{ '--stat-color': s.color }}>
            <span className="stat-mini-value">{s.value}</span>
            <span className="stat-mini-label">{s.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
