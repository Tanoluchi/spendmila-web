import * as React from "react"

export interface FieldProps {
  label?: React.ReactNode
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
  required?: boolean
  invalid?: boolean
  children: React.ReactNode
  className?: string
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { 
      label, 
      children, 
      helperText, 
      errorText, 
      optionalText, 
      required = false,
      invalid = false,
      className = "",
      ...rest 
    } = props
    
    return (
      <div ref={ref} className={`mb-4 ${className}`} {...rest}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required ? (
              <span className="text-red-500 ml-1">*</span>
            ) : optionalText ? (
              <span className="text-gray-400 text-xs ml-1">{optionalText}</span>
            ) : null}
          </label>
        )}
        <div className={invalid ? "ring-1 ring-red-500 rounded-md" : ""}>
          {children}
        </div>
        {helperText && !invalid && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        {errorText && invalid && (
          <p className="mt-1 text-sm text-red-500">{errorText}</p>
        )}
      </div>
    )
  }
)
