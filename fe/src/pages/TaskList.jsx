import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/ui/TaskCard';
import TaskInput from '../components/ui/TaskInput';
import FilterBar from '../components/ui/FilterBar';
import Modal from '../components/ui/Modal';
import { useTasks } from '../hooks/useTasks';
import { useFilter } from '../hooks/useFilter';
import { CATEGORIES } from '../data/categories';

export default function TaskList() {
  const { category: urlCategory } = useParams();
  const activeCategory = urlCategory || 'all';
  const categoryMeta = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const { filtered, activeCount, add, toggle, remove, update } = useTasks(activeCategory);
  const { searchQuery, setSearch, priority, setPriority } = useFilter();
  const [editTask, setEditTask] = useState(null);

  const handleAdd = (title, prio, cat) => {
    const finalCategory = urlCategory || cat;
    add(title, prio, finalCategory);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span style={{ marginRight: 8 }}>{categoryMeta.icon}</span>
            {categoryMeta.label}
          </h1>
          <p className="page-subtitle">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </div>

      <TaskInput onAdd={handleAdd} />

      <div className="search-row">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <select
          className="task-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <FilterBar />

      <div className="task-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No tasks found</p>
            <p className="empty-sub">Try a different filter or add a new task above.</p>
          </div>
        ) : (
          filtered.map((t) => (
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
