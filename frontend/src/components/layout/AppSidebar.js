import React from "react"
import { CheckCircle2, Zap } from "lucide-react"
import { Button } from "../ui/button"

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-surface border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-text-primary">Task Manager</h1>
            <p className="text-xs text-text-secondary">Plan · Track · Achieve</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-purple-100 text-primary">
          <CheckCircle2 className="w-5 h-5" />
          <span>Tasks</span>
        </button>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary to-purple-600 rounded-xl p-4 text-white text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 fill-current" />
          <h3 className="font-bold text-sm mb-1">Stay Productive!</h3>
          <p className="text-xs mb-3 opacity-90">Small steps make big progress.</p>
          <Button
            size="sm"
            variant="secondary"
            className="w-full bg-white text-primary hover:bg-purple-50"
          >
            Get Started →
          </Button>
        </div>
      </div>
    </aside>
  )
}
