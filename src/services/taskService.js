const Task = require('../models/taskModel');
const InvariantError = require('../exceptions/InvariantError');
const isNotValidId = require('../utils/isNotValidIdUtils');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class TaskService {
  async addTask(project, { name, description, assignedTo, projectId, dueTo, status }) {
    const task = new Task({
      name,
      description,
      assignedTo,
      projectId,
      dueTo,
      status,
    });

    const savedTask = await task.save();

    if (!savedTask) {
      throw new InvariantError('Gagal menambahkan tugas');
    }

    project.tasks.push(savedTask._id);
    await project.save();

    return savedTask._id;
  }

  async getTaskById(id) {
    isNotValidId(id, 'Id tugas tidak valid');

    const task = await Task.findById(id)
      .populate({
        path: 'assignedTo',
        select: 'username',
      })
      .populate({
        path: 'projectId',
        select: 'createdBy',
      });

    if (!task) {
      throw new NotFoundError('Tugas tidak ditemukan');
    }

    return task;
  }

  async updateTask(task, { name, description, dueTo, status }) {
    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      {
        name: name || task.name,
        description: description || task.description,
        dueTo: dueTo || task.dueTo,
        status: status || task.status,
      },
      { new: true }
    );

    if (!updatedTask) {
      throw new InvariantError('Gagal memperbarui tugas');
    }

    return updatedTask._id;
  }

  async updateTaskStatus(task, status) {
    task.status = status;
    const updatedTask = await task.save();

    if (!updatedTask) {
      throw new InvariantError('Gagal memperbarui status tugas');
    }

    return updatedTask._id;
  }

  verifyTaskCredential(userId, projectOwnerId, assignedTo) {
    if (userId.toString() !== projectOwnerId.toString() && userId.toString() !== assignedTo.toString()) {
      throw new AuthenticationError('Anda tidak memiliki hak untuk memperbarui status tugas ini');
    }
  }

  async deleteTask(task, project) {
    const deletedTask = await Task.findByIdAndDelete(task._id);

    if (!deletedTask) {
      throw new InvariantError('Gagal menghapus tugas');
    }

    project.tasks.pull(task._id);
    await project.save();
  }
}

module.exports = new TaskService();
