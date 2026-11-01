import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks, createTask, updateTask, deleteTask, toggleTask,
} from '../redux/tasksSlice';

export function useTasks(overrideCategory) {
  const dispatch = useDispatch();
  const items   = useSelector((s) => s.tasks.items);
  const status  = useSelector((s) => s.tasks.status);
  const error   = useSelector((s) => s.tasks.error);
  const filter  = useSelector((s) => s.filter);

  const category = overrideCategory ?? filter.category;

  const filtered = items.filter((t) => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (category !== 'all' && category && t.category !== category) return false;
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
    if (filter.searchQuery && !t.title.toLowerCase().includes(filter.searchQuery.toLowerCase())) return false;
    return true;
  });

  return {
    items,
    filtered,
    status,
    error,
    totalCount:     items.length,
    activeCount:    items.filter((t) => t.status === 'active').length,
    completedCount: items.filter((t) => t.status === 'completed').length,
    refresh: ()                                              => dispatch(fetchTasks()),
    add:     (title, priority = 'medium', category = 'work', description = '') =>
      dispatch(createTask({ title, priority, category, description })),
    addFull: (payload)                                       => dispatch(createTask(payload)),
    update:  (id, data)                                      => dispatch(updateTask({ id, ...data })),
    remove:  (id)                                            => dispatch(deleteTask(id)),
    toggle:  (id)                                            => dispatch(toggleTask(id)),
  };
}
