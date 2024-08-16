const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, taskController.postTask);
router.get('/:id', authMiddleware, taskController.getTaskById);
router.put('/:id', authMiddleware, taskController.updateTask);
router.put('/status/:id', authMiddleware, taskController.updateTaskStatus);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
