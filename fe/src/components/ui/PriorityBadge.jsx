import { getPriorityConfig } from '../../utils/priorityHelper';

export default function PriorityBadge({ priority }) {
  const cfg = getPriorityConfig(priority);
  return (
    <span
      className="priority-badge"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  );
}
