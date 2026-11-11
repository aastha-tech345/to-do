const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  searchTasks,
  getWeeklySummary
} = require('../controllers/taskController');

// Search tasks (must be before /:id)
router.get('/search', searchTasks);

// Weekly summary & grouping (must be before /:id)
router.get('/weekly-summary', getWeeklySummary);

// Collection routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// Individual task status toggle
router.patch('/:id/status', updateTaskStatus);

// Individual task CRUD routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
