import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

// Custom styled native select for robust mobile use
const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-14 w-full appearance-none border-2 border-foreground bg-background px-4 py-2 pr-12 text-base font-sans font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground border-l-2 border-foreground bg-muted/20">
          <ChevronDown className="h-5 w-5 opacity-100" />
        </div>
      </div>
    )
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
