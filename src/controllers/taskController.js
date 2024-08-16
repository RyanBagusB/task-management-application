const projectService = require('../services/projectService');
const taskService = require('../services/taskService');
const userService = require('../services/userService');

class TaskController {
  async postTask(req, res, next) {
    try {
      const { name, description, assignedTo, projectId, dueTo, status } = req.body;
      const userId = req.decoded.id;

      const project = await projectService.getProjectById(projectId);
      await userService.getUserById(assignedTo);

      projectService.verifyProjectCredential(userId, project.createdBy._id);

      const taskId = await taskService.addTask(project, req.body);

      res.status(201).json({
        status: 'success',
        message: 'Tugas berhasil ditambahkan',
        data: { taskId },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);

      res.status(200).json({
        status: 'success',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id: taskId } = req.params;
      const userId = req.decoded.id;

      const task = await taskService.getTaskById(taskId);
      const projectOwnerId = task.projectId.createdBy;

      projectService.verifyProjectCredential(userId, projectOwnerId);

      const updatedTaskId = await taskService.updateTask(task, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Tugas berhasil diperbarui',
        data: { taskId: updatedTaskId },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req, res, next) {
    try {
      const { id: taskId } = req.params;
      const { status } = req.body;
      const userId = req.decoded.id;

      const task = await taskService.getTaskById(taskId);
      const projectOwnerId = task.projectId.createdBy;
      const assignedTo = task.assignedTo._id.toString();

      taskService.verifyTaskCredential(userId, projectOwnerId, assignedTo);

      const updatedTaskId = await taskService.updateTaskStatus(task, status);

      res.status(200).json({
        status: 'success',
        message: 'Status tugas berhasil diperbarui',
        data: { taskId: updatedTaskId },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id: taskId } = req.params;
      const userId = req.decoded.id;

      const task = await taskService.getTaskById(taskId);
      const project = await projectService.getProjectById(task.projectId._id);

      projectService.verifyProjectCredential(userId, project.createdBy._id);

      await taskService.deleteTask(task, project);

      res.status(200).json({
        status: 'success',
        message: 'Tugas berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
