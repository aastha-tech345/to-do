import React from "react"
import { Trash2, Pencil, Clock, Calendar } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { cn } from "../../lib/utils"

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const priorityVariant = {
    Low: "low",
    Medium: "medium",
    High: "high",
  }[task.priority]

  const statusVariant = {
    "In Progress": "info",
    Completed: "success",
  }[task.status]

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <Card className={cn("p-4 hover:shadow-lg transition-shadow", task.status === "Completed" && "opacity-60")}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={task.status === "Completed"}
            onCheckedChange={() => {
              const newStatus = task.status === "Completed" ? "In Progress" : "Completed"
              onStatusChange(task._id, newStatus)
            }}
            className="mt-1"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-text-primary leading-tight",
                task.status === "Completed" && "line-through text-text-secondary"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task._id)}
                className="h-8 w-8 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Meta information */}
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              {formatDate(task.date)}
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Clock className="h-3 w-3" />
              {task.time}
            </div>
            <Badge variant={priorityVariant} className="text-xs">
              {task.priority}
            </Badge>
            <Badge variant={statusVariant} className="text-xs">
              {task.status}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
