# Task Manager Frontend

A modern React-based task management application with real-time updates, filtering, and weekly planning views.

## Features

- **Create Tasks**: Add new tasks with title, description, date, time, and priority
- **List View**: Display all tasks with quick actions (toggle status, edit, delete)
- **Weekly View**: Group tasks by week with open/completed counts and statistics
- **Filtering**: Search tasks and filter by priority, status, or date range
- **Edit Tasks**: Update task details via modal dialog
- **Status Toggle**: Mark tasks as complete or in-progress
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Components

- `TaskForm`: Create new tasks with validation
- `TaskList`: Display tasks in list format with expandable details
- `TaskItem`: Individual task card with inline actions
- `TaskFilters`: Search and filter controls
- `WeeklySummary`: Weekly grouping with statistics
- `EditTaskModal`: Modal for editing task details
- `api.js`: Centralized API service for backend communication

## API Integration

The frontend connects to the backend API at `/api/tasks` with the following endpoints:

- `GET /api/tasks` - Get all tasks with optional filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Toggle task status
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/weekly-summary` - Get tasks grouped by week

## Running the Application

```bash
npm install
npm start
```

The app runs on `http://localhost:3000` by default.

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Environment

The frontend proxies API requests to `http://127.0.0.1:5000` (see `package.json` proxy field).
