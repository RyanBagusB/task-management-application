const projectService = require('../services/projectService');
const InvariantError = require('../exceptions/InvariantError');

class ProjectController {
  async postProject(req, res, next) {
    try {
      const { name, description } = req.body;
      const createdBy = req.decoded.id;
      const projectId = await projectService.addProject({ name, description, createdBy });

      res.status(201).json({
        status: 'success',
        message: 'Proyek berhasil ditambahkan',
        data: { projectId },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);

      res.status(200).json({
        status: 'success',
        data: { project },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProjectsByUserId(req, res, next) {
    try {
      const { id } = req.decoded;
      const projects = await projectService.getAllProjectsByUserId(id);

      res.json({
        status: 'success',
        data: { projects },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = req.decoded.id;

      const updatedProjectId = await projectService.updateProject(id, { name, description, userId });

      res.status(200).json({
        status: 'success',
        message: 'Proyek berhasil diperbarui',
        data: { updatedProjectId },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;

      await projectService.deleteProject(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Proyek berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
