const mongoose = require('mongoose');
const Task = require('../models/Task');
const { getMondayAndSunday } = require('../utils/dateHelper');

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, date, time, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Valid date is required (YYYY-MM-DD)'
      });
    }

    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be Low, Medium, or High'
      });
    }

    if (status && !['In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be In Progress or Completed'
      });
    }

    if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Valid time is required (HH:mm in 24-hour format)'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      date: date.trim(),
      time: time ? time.trim() : '',
      priority: priority || 'Medium',
      status: status || 'In Progress'
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with optional filters
 * @route   GET /api/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const { search, priority, status, startDate, endDate, sortBy = 'date', order = 'asc' } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    if (status && ['In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };
    if (sortBy !== 'createdAt') {
      sort.createdAt = 1;
    }

    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, priority, status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const updates = {};
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'Date must be in YYYY-MM-DD format'
        });
      }
      updates.date = date.trim();
    }

    if (time !== undefined) {
      if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Valid time is required (HH:mm in 24-hour format)'
        });
      }
      updates.time = time.trim();
    }

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Priority must be Low, Medium, or High'
        });
      }
      updates.priority = priority;
    }

    if (status !== undefined) {
      if (!['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be In Progress or Completed'
        });
      }
      updates.status = status;
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or set task status (In Progress <-> Completed)
 * @route   PATCH /api/tasks/:id/status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (status !== undefined) {
      if (!['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be In Progress or Completed'
        });
      }
      task.status = status;
    } else {
      // Toggle
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: task._id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search tasks by title and description
 * @route   GET /api/tasks/search
 */
const searchTasks = async (req, res, next) => {
  try {
    const query = (req.query.q || req.query.query || '').trim();

    if (!query) {
      // If query is empty, return all tasks sorted by date
      const tasks = await Task.find().sort({ date: 1 });
      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const tasks = await Task.find({
      $or: [{ title: searchRegex }, { description: searchRegex }]
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Group tasks by week (Monday to Sunday) with Open & Completed metrics
 * @route   GET /api/tasks/weekly-summary
 */
const getWeeklySummary = async (req, res, next) => {
  try {
    const { search, priority, status } = req.query;

    const filter = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    if (status && ['In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ date: 1, time: 1, createdAt: 1 });

    // Group tasks by week
    const weekMap = new Map();

    for (const task of tasks) {
      const { weekStart, weekEnd, weekLabel, weekKey } = getMondayAndSunday(task.date);

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekKey,
          weekStart,
          weekEnd,
          weekLabel,
          totalTasks: 0,
          openCount: 0,
          completedCount: 0,
          tasks: []
        });
      }

      const weekGroup = weekMap.get(weekKey);
      weekGroup.totalTasks += 1;
      if (task.status === 'Completed') {
        weekGroup.completedCount += 1;
      } else {
        weekGroup.openCount += 1; // 'In Progress' is Open
      }
      weekGroup.tasks.push(task);
    }

    // Convert map to array and sort chronologically by weekStart
    const weeks = Array.from(weekMap.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    res.status(200).json({
      success: true,
      count: weeks.length,
      data: weeks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  searchTasks,
  getWeeklySummary
};
