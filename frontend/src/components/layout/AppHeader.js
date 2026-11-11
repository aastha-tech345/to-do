import React from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function AppHeader() {
  return (
    <header className="fixed top-0 left-[220px] right-0 h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search tasks... (Ctrl + K)"
            className="pl-10 pr-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button className="relative hover:bg-background p-2 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-background p-2 rounded-lg transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-danger">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
