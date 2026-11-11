import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
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

export function CreateTaskForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "Medium",
    status: "In Progress",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      priority: "Medium",
      status: "In Progress",
    })
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Add a new task to keep track of your work</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={150}
              required
            />
            <p className="text-xs text-text-secondary mt-1">
              {formData.title.length}/150 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={1000}
              rows={3}
            />
            <p className="text-xs text-text-secondary mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="mb-2 block">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={today}
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="mb-2 block">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="mb-2 block">
                Priority
              </Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger id="priority">
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
              <Label htmlFor="status" className="mb-2 block">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading || !formData.title || !formData.date || !formData.time} className="gap-2">
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
