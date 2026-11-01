import { useFilter } from '../../hooks/useFilter';
import { useTasks } from '../../hooks/useTasks';

export default function FilterBar() {
  const { status, setStatus } = useFilter();
  const { completedCount, clearCompleted } = useTasks();

  const tabs = ['all', 'active', 'completed'];

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`filter-tab ${status === t ? 'active' : ''}`}
            onClick={() => setStatus(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          🗑 Clear completed ({completedCount})
        </button>
      )}
    </div>
  );
}
