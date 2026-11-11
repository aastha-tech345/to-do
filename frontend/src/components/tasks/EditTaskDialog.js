import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
  loading,
}) {
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        time: task.time,
        priority: task.priority,
        status: task.status,
      })
    }
  }, [task])

  const handleSave = async () => {
    if (task) {
      await onSave(task._id, formData)
      onOpenChange(false)
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="edit-title" className="mb-2 block">
              Title *
            </Label>
            <Input
              id="edit-title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              maxLength={150}
            />
            <p className="text-xs text-text-secondary mt-1">
              {(formData.title || "").length}/150 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="edit-description" className="mb-2 block">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              maxLength={1000}
              rows={3}
            />
            <p className="text-xs text-text-secondary mt-1">
              {(formData.description || "").length}/1000 characters
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date" className="mb-2 block">
                Date *
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-time" className="mb-2 block">
                Time *
              </Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-priority" className="mb-2 block">
                Priority
              </Label>
              <Select
                value={formData.priority || ""}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="edit-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status" className="mb-2 block">
                Status
              </Label>
              <Select
                value={formData.status || ""}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !formData.title}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
