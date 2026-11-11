const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
      type: String,
      required: [true, 'Due date is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      trim: true
    },
    time: {
      type: String,
      required: [true, 'Time is required (HH:mm)'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Time must be in 24-hour HH:mm format (e.g. 14:30)'
      }
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be either Low, Medium, or High'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: ['In Progress', 'Completed'],
        message: 'Status must be either In Progress or Completed'
      },
      default: 'In Progress'
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for search
taskSchema.index({ title: 'text', description: 'text' });
// Index for weekly sorting and status filtering
taskSchema.index({ date: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
