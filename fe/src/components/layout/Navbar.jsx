import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { logout } from '../../redux/authSlice';
import { clearTasks } from '../../redux/tasksSlice';

const initialsFor = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { activeCount } = useTasks();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const links = [
    { to: '/',        label: 'Dashboard', icon: '🏠' },
    { to: '/tasks',   label: 'Tasks',     icon: '✅' },
    { to: '/settings',label: 'Settings',  icon: '⚙️' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✓</span>
        <span className="navbar-title">TaskFlow</span>
      </div>

      <div className="navbar-links">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`navbar-link ${location.pathname === l.to ? 'active' : ''}`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        {activeCount > 0 && (
          <span className="navbar-badge">{activeCount} pending</span>
        )}
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="user-menu" ref={menuRef}>
          <button
            className="user-menu-trigger"
            onClick={() => setMenuOpen((v) => !v)}
            title={user?.name || 'Account'}
          >
            {initialsFor(user?.name)}
          </button>

          {menuOpen && (
            <div className="user-menu-panel">
              <div className="user-menu-info">
                <div className="user-menu-name">{user?.name || 'Account'}</div>
                {user?.email && <div className="user-menu-email">{user.email}</div>}
              </div>
              <button className="user-menu-item danger" onClick={handleLogout}>
                🚪 Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
