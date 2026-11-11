import React, { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Card } from "../ui/card"
import { TaskCard } from "./TaskCard"

export function TaskCalendar({
  weeks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [expandedWeek, setExpandedWeek] = useState(null)

  if (weeks.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-text-secondary">No tasks found for any week.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <Card key={week.weekKey} className="overflow-hidden">
          <button
            onClick={() => setExpandedWeek(expandedWeek === week.weekKey ? null : week.weekKey)}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-95 transition-opacity flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1 text-left">
              <h3 className="font-semibold">{week.weekLabel}</h3>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span>Open: <strong>{week.openCount}</strong></span>
              <span>Completed: <strong>{week.completedCount}</strong></span>
              <span className="bg-white/20 px-2 py-1 rounded-full">
                {week.totalTasks} total
              </span>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${
                  expandedWeek === week.weekKey ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>

          {expandedWeek === week.weekKey && (
            <div className="p-6 space-y-4 bg-background/50">
              {week.tasks.length > 0 ? (
                week.tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              ) : (
                <p className="text-center text-text-secondary py-4">
                  No tasks in this week
                </p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
