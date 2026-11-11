import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-text-primary hover:bg-background",
        secondary: "border-transparent bg-background text-text-primary hover:bg-background/80",
        destructive: "border-transparent bg-danger/10 text-danger hover:bg-danger/20",
        outline: "text-text-primary",
        success: "border-transparent bg-success/10 text-success hover:bg-success/20",
        warning: "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        info: "border-transparent bg-info/10 text-info hover:bg-info/20",
        high: "border-transparent bg-danger/10 text-danger hover:bg-danger/20",
        medium: "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        low: "border-transparent bg-success/10 text-success hover:bg-success/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
