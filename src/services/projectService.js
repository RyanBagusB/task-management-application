const Project = require('../models/projectModel');
require('../models/taskModel');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const isNotValidId = require('../utils/isNotValidIdUtils');
const AuthenticationError = require('../exceptions/AuthenticationError');

class ProjectService {
  async addProject({ name, description, createdBy }) {
    const project = new Project({ name, description, createdBy });
    const savedProject = await project.save();

    if (!savedProject) {
      throw new InvariantError('Gagal membuat proyek');
    }

    return savedProject._id;
  }

  async getProjectById(id) {
    isNotValidId(id, 'Id proyek tidak valid');
    const project = await Project.findById(id)
      .populate({
        path: 'createdBy',
        select: 'username',
      })
      .populate('tasks');

    if (!project) {
      throw new NotFoundError('Proyek tidak ditemukan');
    }

    return project;
  }

  async updateProject(id, { name, description, userId }) {
    isNotValidId(id, 'Id proyek tidak valid');
    
    const project = await this.getProjectById(id);

    this.verifyProjectCredential(userId, project.createdBy._id);

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedProject) {
      throw new InvariantError('Gagal memperbarui proyek');
    }

    return updatedProject._id;
  }

  async getAllProjectsByUserId(userId) {
    const projects = await Project.find({ createdBy: userId })
      .populate({
        path: 'createdBy',
        select: 'username',
      })
      .populate('tasks');

    return projects || [];
  }

  async deleteProject(id, userId) {
    const project = await this.getProjectById(id);

    this.verifyProjectCredential(userId, project.createdBy._id);

    await Project.findByIdAndDelete(id);

    return { message: 'Proyek berhasil dihapus' };
  }

  verifyProjectCredential(userId, creatorId) {
    if (userId.toString() !== creatorId.toString()) {
      throw new AuthenticationError('Anda tidak memiliki akses terhadap proyek ini');
    }
  }
}

module.exports = new ProjectService();
