import * as React from "react"

interface TextProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  weight?: "normal" | "medium" | "semibold" | "bold"
  color?: "default" | "muted" | "primary" | "success" | "warning" | "danger"
  align?: "left" | "center" | "right"
  className?: string
  truncate?: boolean
  mb?: number
  mt?: number
}

export const Text: React.FC<TextProps> = ({
  children,
  as: Component = "p",
  size = "md",
  weight = "normal",
  color = "default",
  align = "left",
  className = "",
  truncate = false,
  mb,
  mt,
  ...rest
}) => {
  // Size styles
  const sizeStyles = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }

  // Weight styles
  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }

  // Color styles
  const colorStyles = {
    default: "text-gray-900 dark:text-gray-100",
    muted: "text-gray-500 dark:text-gray-400",
    primary: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  }

  // Alignment styles
  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  // Margin styles
  const marginStyles = [
    mb !== undefined ? `mb-${mb}` : "",
    mt !== undefined ? `mt-${mt}` : "",
  ].filter(Boolean).join(" ")

  // Truncate styles
  const truncateStyles = truncate ? "truncate" : ""

  // Combine all styles
  const textStyles = [
    sizeStyles[size],
    weightStyles[weight],
    colorStyles[color],
    alignStyles[align],
    marginStyles,
    truncateStyles,
    className,
  ].filter(Boolean).join(" ")

  return (
    <Component className={textStyles} {...rest}>
      {children}
    </Component>
  )
}
