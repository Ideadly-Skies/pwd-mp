import React from 'react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          className={cn("pl-10", className)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          {icon}
        </div>
      </div>
    )
  }
)

InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }