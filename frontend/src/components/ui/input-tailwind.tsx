import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { 
      className = "", 
      fullWidth = true,
      ...rest 
    } = props

    return (
      <input
        ref={ref}
        className={`px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:text-gray-200 dark:focus:ring-blue-600 dark:focus:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? 'w-full' : ''} 
          ${className}`}
        {...rest}
      />
    )
  }
)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const { 
      className = "", 
      fullWidth = true,
      ...rest 
    } = props

    return (
      <textarea
        ref={ref}
        className={`px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:text-gray-200 dark:focus:ring-blue-600 dark:focus:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? 'w-full' : ''} 
          ${className}`}
        {...rest}
      />
    )
  }
)

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    const { 
      className = "", 
      fullWidth = true,
      children,
      ...rest 
    } = props

    return (
      <select
        ref={ref}
        className={`px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:text-gray-200 dark:focus:ring-blue-600 dark:focus:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? 'w-full' : ''} 
          ${className}`}
        {...rest}
      >
        {children}
      </select>
    )
  }
)
