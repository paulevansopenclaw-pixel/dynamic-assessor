import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap font-display text-lg tracking-wider uppercase ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px] active:shadow-none border-2 border-transparent";
    
    const variants = {
      default: "bg-primary text-primary-foreground border-foreground shadow-hard hover:shadow-hard-hover hover:-translate-y-[2px]",
      destructive: "bg-destructive text-destructive-foreground border-foreground shadow-hard hover:shadow-hard-hover hover:-translate-y-[2px]",
      outline: "border-foreground bg-background shadow-hard hover:bg-muted hover:-translate-y-[2px] hover:shadow-hard-hover text-foreground",
      secondary: "bg-secondary text-secondary-foreground border-foreground shadow-hard hover:bg-secondary/80 hover:-translate-y-[2px] hover:shadow-hard-hover",
      ghost: "hover:bg-muted hover:text-foreground text-foreground border-transparent active:translate-y-0",
      link: "text-foreground underline-offset-4 hover:underline border-transparent active:translate-y-0",
    };

    const sizes = {
      default: "h-14 px-6 py-2",
      sm: "h-10 px-4 text-base",
      lg: "h-16 px-8 text-xl",
      icon: "h-14 w-14",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
