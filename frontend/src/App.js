import React, { useState, useEffect } from "react"
import { AppSidebar } from "./components/layout/AppSidebar"
import { AppHeader } from "./components/layout/AppHeader"
import { TaskPageHeader } from "./components/tasks/TaskPageHeader"
import { CreateTaskForm } from "./components/tasks/CreateTaskForm"
import { TaskFilters } from "./components/tasks/TaskFilters"
import { TaskList } from "./components/tasks/TaskList"
import { TaskCalendar } from "./components/tasks/TaskCalendar"
import { EditTaskDialog } from "./components/tasks/EditTaskDialog"
import { DeleteTaskDialog } from "./components/tasks/DeleteTaskDialog"
import api from "./services/api"

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState("list")
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
  })
  const [weeklyData, setWeeklyData] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await api.getTasks(filters)
      setTasks(response.data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch weekly summary
  const fetchWeeklySummary = async () => {
    setLoading(true)
    try {
      const response = await api.getWeeklySummary(filters)
      setWeeklyData(response.data)
    } catch (error) {
      console.error("Failed to fetch weekly summary:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load data when filters or view changes
  useEffect(() => {
    if (view === "list") {
      fetchTasks()
    } else {
      fetchWeeklySummary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, view])

  // Create task
  const handleCreateTask = async (data) => {
    try {
      await api.createTask(data)
      if (view === "list") {
        fetchTasks()
      } else {
        fetchWeeklySummary()
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  // Update task
  const handleUpdateTask = async (id, data) => {
    try {
      await api.updateTask(id, data)
      if (view === "list") {
        fetchTasks()
      } else {
        fetchWeeklySummary()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  // Delete task
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return
    try {
      await api.deleteTask(deletingTaskId)
      if (view === "list") {
        fetchTasks()
      } else {
        fetchWeeklySummary()
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setDeletingTaskId(null)
    }
  }

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task)
    setEditDialogOpen(true)
  }

  // Delete task with confirmation
  const handleDeleteClick = (taskId) => {
    setDeletingTaskId(taskId)
    setDeleteDialogOpen(true)
  }

  // Change task status
  const handleStatusChange = async (id, status) => {
    await handleUpdateTask(id, { status })
  }

  const hasActiveFilters = filters.search || filters.priority || filters.status

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader />

      {/* Main Content */}
      <main className="ml-[220px] mt-16 p-8">
        <div className="max-w-7xl">
          {/* Page Header */}
          <TaskPageHeader view={view} onViewChange={setView} />

          {/* Create Task Form */}
          <CreateTaskForm onSubmit={handleCreateTask} loading={loading} />

          {/* Filters */}
          <TaskFilters filters={filters} onFiltersChange={setFilters} />

          {/* Task List or Calendar */}
          {view === "list" ? (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
              hasFilters={hasActiveFilters}
              onClearFilters={() => setFilters({ search: "", priority: "", status: "" })}
            />
          ) : (
            <TaskCalendar
              weeks={weeklyData}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdateTask}
      />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteTask}
        taskTitle={
          deletingTaskId
            ? tasks.find((t) => t._id === deletingTaskId)?.title
            : undefined
        }
      />
    </div>
  )
}

export default App
