import { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import { formatRelative, formatDate, isOverdue } from '../../utils/dateFormatter';
import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [hover, setHover] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);
  const navigate = useNavigate();

  return (
    <div
      className={`task-card ${task.status === 'completed' ? 'done' : ''} ${overdue ? 'overdue' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        title="Toggle complete"
      >
        {task.status === 'completed' && '✓'}
      </button>

      {/* Content */}
      <div className="task-content" onClick={() => navigate(`/tasks/${task.id}`)}>
        <p className={`task-title ${task.status === 'completed' ? 'strikethrough' : ''}`}>
          {task.title}
        </p>
        <div className="task-meta">
          <PriorityBadge priority={task.priority} />
          <span className="task-category-tag">{task.category}</span>
          {task.dueDate && (
            <span className={`task-due ${overdue ? 'overdue-text' : ''}`}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
          <span className="task-created">{formatRelative(task.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={`task-actions ${hover ? 'visible' : ''}`}>
        <button className="task-btn edit" onClick={() => onEdit(task)} title="Edit">✏️</button>
        <button className="task-btn delete" onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
}
