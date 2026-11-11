import React from "react"
import { Filter, Search, RotateCcw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function TaskFilters({ filters, onFiltersChange }) {
  const handleClear = () => {
    onFiltersChange({
      search: "",
      priority: "",
      status: "",
    })
  }

  const hasActiveFilters = filters.search || filters.priority || filters.status

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Find tasks quickly with filters</CardDescription>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input
              placeholder="Search by title or description"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Priority */}
          <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
