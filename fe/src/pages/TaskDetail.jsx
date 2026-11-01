import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTasks } from '../hooks/useTasks';
import PriorityBadge from '../components/ui/PriorityBadge';
import Modal from '../components/ui/Modal';
import { formatDateTime, formatRelative, isOverdue } from '../utils/dateFormatter';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tasks = useSelector((s) => s.tasks.items);
  const task  = tasks.find((t) => t.id === id);
  const { toggle, remove, update } = useTasks();
  const [editing, setEditing] = useState(false);

  if (!task) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">Task not found</p>
          <p className="empty-sub">This task may have been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/tasks')}>← Back to Tasks</button>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/tasks')}>← Back to Tasks</button>

      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <button
            className={`task-checkbox large ${task.status === 'completed' ? 'checked' : ''}`}
            onClick={() => toggle(task.id)}
          >
            {task.status === 'completed' && '✓'}
          </button>
          <div className="detail-title-wrap">
            <h1 className={`detail-title ${task.status === 'completed' ? 'strikethrough' : ''}`}>
              {task.title}
            </h1>
            <div className="detail-badges">
              <PriorityBadge priority={task.priority} />
              <span className="task-category-tag">{task.category}</span>
              <span className={`status-badge ${task.status}`}>
                {task.status === 'completed' ? '✅ Completed' : '⚡ Active'}
              </span>
              {overdue && <span className="status-badge overdue">⚠️ Overdue</span>}
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="detail-section">
            <h3 className="detail-section-title">Description</h3>
            <p className="detail-description">{task.description}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="detail-section">
          <h3 className="detail-section-title">Timeline</h3>
          <div className="timeline-grid">
            <div className="timeline-item">
              <span className="timeline-label">Created</span>
              <span className="timeline-value">{formatDateTime(task.createdAt)}</span>
              <span className="timeline-rel">{formatRelative(task.createdAt)}</span>
            </div>
            {task.dueDate && (
              <div className={`timeline-item ${overdue ? 'overdue-text' : ''}`}>
                <span className="timeline-label">Due Date</span>
                <span className="timeline-value">{formatDateTime(task.dueDate)}</span>
                {overdue && task.status !== 'completed' && (
                  <span className="timeline-rel overdue-text">⚠️ Overdue!</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="detail-actions">
          <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Task</button>
          <button
            className="btn btn-secondary"
            onClick={() => toggle(task.id)}
          >
            {task.status === 'completed' ? '↩️ Mark Active' : '✅ Mark Done'}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => { remove(task.id); navigate('/tasks'); }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {editing && (
        <Modal
          task={task}
          onSave={(data) => update(task.id, data)}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
