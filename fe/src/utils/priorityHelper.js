export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    emoji: '🔴',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.35)',
  },
  medium: {
    label: 'Medium',
    emoji: '🟡',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.35)',
  },
  low: {
    label: 'Low',
    emoji: '🟢',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.35)',
  },
};

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
}
