const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, projectController.postProject);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.get('/', authMiddleware, projectController.getAllProjectsByUserId);
router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
