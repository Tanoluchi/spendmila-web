import * as React from "react"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  description?: string
  size?: "sm" | "md" | "lg"
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const { 
      label, 
      description,
      size = "md", 
      className = "", 
      disabled = false,
      ...rest 
    } = props

    // Size styles
    const sizeStyles = {
      sm: "h-4 w-7 after:h-3 after:w-3",
      md: "h-5 w-9 after:h-4 after:w-4",
      lg: "h-6 w-11 after:h-5 after:w-5",
    }

    return (
      <label className={`inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            disabled={disabled}
            {...rest}
          />
          <div
            className={`${sizeStyles[size]} bg-gray-300 dark:bg-gray-600 rounded-full peer 
              after:content-[''] after:absolute after:bg-white after:rounded-full after:transition-all after:left-0.5 after:top-0.5
              peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 ${className}`}
          />
        </div>
        {(label || description) && (
          <div className="ml-2">
            {label && <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</div>}
            {description && <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>}
          </div>
        )}
      </label>
    )
  }
)
