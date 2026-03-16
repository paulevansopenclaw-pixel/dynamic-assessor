import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-display tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-hard-sm";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground border-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground border-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground border-foreground",
    success: "border-transparent bg-safety-green text-white border-foreground",
    warning: "border-transparent bg-safety-amber text-black border-foreground",
    outline: "text-foreground border-foreground bg-background",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  )
}

export { Badge }
