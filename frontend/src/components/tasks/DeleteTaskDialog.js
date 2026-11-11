import React from "react"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"

export function DeleteTaskDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  taskTitle,
}) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-danger" />
            </div>
            <DialogTitle>Delete Task</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
            {taskTitle && <p className="text-text-primary font-medium mt-2">"{taskTitle}"</p>}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
