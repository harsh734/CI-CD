import { taskApi } from '../api/taskApi';

const wrap = (fn) => async (...args) => {
  try { return await fn(...args); }
  catch (e) { throw new Error(e?.response?.data?.message || e.message); }
};

export const taskService = {
  fetchAll:   wrap(taskApi.getAll),
  fetchById:  wrap(taskApi.getById),
  createTask: wrap(taskApi.create),
  updateTask: (id, data) => wrap(() => taskApi.update(id, data))(),
  deleteTask: (id)       => wrap(() => taskApi.remove(id))(),
};
