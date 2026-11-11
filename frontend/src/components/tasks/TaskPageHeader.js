import React from "react"
import { List, Calendar } from "lucide-react"
import { Button } from "../ui/button"

export function TaskPageHeader({ view, onViewChange }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Task Manager</h1>
        <p className="text-text-secondary mt-1">Organize your work and stay productive.</p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onViewChange("list")}
          variant={view === "list" ? "default" : "outline"}
          className="gap-2"
        >
          <List className="w-4 h-4" />
          List View
        </Button>
        <Button
          onClick={() => onViewChange("weekly")}
          variant={view === "weekly" ? "default" : "outline"}
          className="gap-2"
        >
          <Calendar className="w-4 h-4" />
          Weekly View
        </Button>
      </div>
    </div>
  )
}
