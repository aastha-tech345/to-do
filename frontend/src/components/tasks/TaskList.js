import React from "react"
import { TaskCard } from "./TaskCard"
import { TaskEmptyState } from "./TaskEmptyState"

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  hasFilters,
  onClearFilters,
  onCreateClick,
}) {
  if (tasks.length === 0) {
    return (
      <TaskEmptyState
        onCreateClick={onCreateClick || (() => {})}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="font-semibold text-text-primary">
          My Tasks ({tasks.length})
        </h2>
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
