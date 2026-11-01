const TaskService = require('./task.service');
const { successResponse } = require('../../helpers/responseHelper');
const { HTTP_STATUS } = require('../../constants/httpStatus');
const { MESSAGES } = require('../../constants/messages');

class TaskController {
  static async getAll(req, res) {
    const tasks = await TaskService.getAllTasks(req.userId);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.TASKS_FOUND,
      data: tasks,
    });
  }

  static async getById(req, res) {
    const task = await TaskService.getTaskById(req.params.id, req.userId);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.TASK_FOUND,
      data: task,
    });
  }

  static async create(req, res) {
    const task = await TaskService.createTask(req.userId, req.body);
    return successResponse(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: MESSAGES.TASK_CREATED,
      data: task,
    });
  }

  static async update(req, res) {
    const task = await TaskService.updateTask(req.params.id, req.userId, req.body);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.TASK_UPDATED,
      data: task,
    });
  }

  static async delete(req, res) {
    await TaskService.deleteTask(req.params.id, req.userId);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.TASK_DELETED,
      data: null,
    });
  }
}

module.exports = TaskController;
