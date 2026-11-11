import React from "react"
import { CheckCircle2, Plus } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"

export function TaskEmptyState({
  onCreateClick,
  hasFilters,
  onClearFilters,
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Illustration */}
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary opacity-50" />
          </div>

          {hasFilters ? (
            <>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                No tasks found
              </h3>
              <p className="text-text-secondary mb-6">
                No tasks match your filters.
              </p>
              <Button variant="outline" onClick={onClearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                No tasks found
              </h3>
              <p className="text-text-secondary mb-6">
                Create one to get started!
              </p>
              <Button onClick={onCreateClick} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
