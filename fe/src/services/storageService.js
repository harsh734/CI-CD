const KEY = 'todo_tasks';

export const storageService = {
  save:  (tasks) => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {} },
  load:  ()      => { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; } },
  clear: ()      => localStorage.removeItem(KEY),
};
