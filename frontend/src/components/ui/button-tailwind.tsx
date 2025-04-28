import * as React from "react"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "link" | "subtle"
  colorPalette?: "gray" | "blue" | "red" | "green" | "yellow" | "purple" | "indigo" | "teal"
  loading?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      children,
      variant = "solid",
      colorPalette = "gray",
      loading = false,
      size = "md",
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...rest
    } = props

    // Base styles
    let baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    // Size styles
    const sizeStyles = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    }
    
    // Color and variant styles
    const colorStyles: Record<string, Record<string, string>> = {
      solid: {
        gray: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
        red: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600",
        green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500",
        purple: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
        indigo: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600",
        teal: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600",
      },
      outline: {
        gray: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        blue: "border border-blue-300 bg-transparent hover:bg-blue-50 text-blue-700 focus:ring-blue-500 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20",
        red: "border border-red-300 bg-transparent hover:bg-red-50 text-red-700 focus:ring-red-500 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20",
        green: "border border-green-300 bg-transparent hover:bg-green-50 text-green-700 focus:ring-green-500 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20",
        yellow: "border border-yellow-300 bg-transparent hover:bg-yellow-50 text-yellow-700 focus:ring-yellow-500 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-900/20",
        purple: "border border-purple-300 bg-transparent hover:bg-purple-50 text-purple-700 focus:ring-purple-500 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20",
        indigo: "border border-indigo-300 bg-transparent hover:bg-indigo-50 text-indigo-700 focus:ring-indigo-500 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/20",
        teal: "border border-teal-300 bg-transparent hover:bg-teal-50 text-teal-700 focus:ring-teal-500 dark:border-teal-600 dark:text-teal-300 dark:hover:bg-teal-900/20",
      },
      ghost: {
        gray: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
        blue: "bg-transparent hover:bg-blue-100 text-blue-700 focus:ring-blue-500 dark:text-blue-300 dark:hover:bg-blue-900/20",
        red: "bg-transparent hover:bg-red-100 text-red-700 focus:ring-red-500 dark:text-red-300 dark:hover:bg-red-900/20",
        green: "bg-transparent hover:bg-green-100 text-green-700 focus:ring-green-500 dark:text-green-300 dark:hover:bg-green-900/20",
        yellow: "bg-transparent hover:bg-yellow-100 text-yellow-700 focus:ring-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-900/20",
        purple: "bg-transparent hover:bg-purple-100 text-purple-700 focus:ring-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/20",
        indigo: "bg-transparent hover:bg-indigo-100 text-indigo-700 focus:ring-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-900/20",
        teal: "bg-transparent hover:bg-teal-100 text-teal-700 focus:ring-teal-500 dark:text-teal-300 dark:hover:bg-teal-900/20",
      },
      subtle: {
        gray: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
        blue: "bg-blue-100 hover:bg-blue-200 text-blue-800 focus:ring-blue-500 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 dark:text-blue-200",
        red: "bg-red-100 hover:bg-red-200 text-red-800 focus:ring-red-500 dark:bg-red-900/30 dark:hover:bg-red-900/40 dark:text-red-200",
        green: "bg-green-100 hover:bg-green-200 text-green-800 focus:ring-green-500 dark:bg-green-900/30 dark:hover:bg-green-900/40 dark:text-green-200",
        yellow: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 focus:ring-yellow-500 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/40 dark:text-yellow-200",
        purple: "bg-purple-100 hover:bg-purple-200 text-purple-800 focus:ring-purple-500 dark:bg-purple-900/30 dark:hover:bg-purple-900/40 dark:text-purple-200",
        indigo: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 focus:ring-indigo-500 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40 dark:text-indigo-200",
        teal: "bg-teal-100 hover:bg-teal-200 text-teal-800 focus:ring-teal-500 dark:bg-teal-900/30 dark:hover:bg-teal-900/40 dark:text-teal-200",
      },
      link: {
        gray: "bg-transparent underline text-gray-700 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:text-gray-100",
        blue: "bg-transparent underline text-blue-700 hover:text-blue-900 focus:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-100",
        red: "bg-transparent underline text-red-700 hover:text-red-900 focus:ring-red-500 dark:text-red-300 dark:hover:text-red-100",
        green: "bg-transparent underline text-green-700 hover:text-green-900 focus:ring-green-500 dark:text-green-300 dark:hover:text-green-100",
        yellow: "bg-transparent underline text-yellow-700 hover:text-yellow-900 focus:ring-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-100",
        purple: "bg-transparent underline text-purple-700 hover:text-purple-900 focus:ring-purple-500 dark:text-purple-300 dark:hover:text-purple-100",
        indigo: "bg-transparent underline text-indigo-700 hover:text-indigo-900 focus:ring-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-100",
        teal: "bg-transparent underline text-teal-700 hover:text-teal-900 focus:ring-teal-500 dark:text-teal-300 dark:hover:text-teal-100",
      },
    }

    // Disabled styles
    const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none"
    
    // Width styles
    const widthStyles = fullWidth ? "w-full" : ""

    // Combine all styles
    const buttonStyles = [
      baseStyles,
      sizeStyles[size],
      colorStyles[variant][colorPalette],
      (disabled || loading) ? disabledStyles : "",
      widthStyles,
      className
    ].join(" ")

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonStyles}
        {...rest}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
