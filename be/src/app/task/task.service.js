const TaskModel = require('./task.model');

const notFound = () => {
  const error = new Error('Task not found');
  error.statusCode = 404;
  return error;
};

class TaskService {
  static async getAllTasks(userId) {
    return TaskModel.findAll(userId);
  }

  static async getTaskById(id, userId) {
    const task = await TaskModel.findById(id, userId);
    if (!task) throw notFound();
    return task;
  }

  static async createTask(userId, data) {
    return TaskModel.create(userId, data);
  }

  static async updateTask(id, userId, data) {
    await this.getTaskById(id, userId);
    return TaskModel.update(id, userId, data);
  }

  static async deleteTask(id, userId) {
    const task = await TaskModel.delete(id, userId);
    if (!task) throw notFound();
    return task;
  }
}

module.exports = TaskService;
