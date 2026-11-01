import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-sub">
          Looks like this task doesn't exist — or it's been deleted. 😅
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">🏠 Go to Dashboard</Link>
          <Link to="/tasks" className="btn btn-secondary">📋 View All Tasks</Link>
        </div>
      </div>
    </div>
  );
}
