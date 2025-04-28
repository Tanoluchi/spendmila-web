import * as React from "react"
import { X } from "lucide-react"

interface DialogRootProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: { open: boolean }) => void
  size?: { base: string; md: string }
  placement?: string
}

export const DialogRoot: React.FC<DialogRootProps> = ({
  children,
  open,
  onOpenChange,
  size = { base: "xs", md: "md" },
  placement = "center",
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange({ open: false })}
      />
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-${size.md} mx-4 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export const DialogTrigger: React.FC<{
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}> = ({ children, onClick }) => {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}

export const DialogContent: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  )
}

export const DialogHeader: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      {children}
    </div>
  )
}

export const DialogTitle: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  )
}

export const DialogDescription: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {children}
    </p>
  )
}

export const DialogBody: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="px-6 py-4">
      {children}
    </div>
  )
}

export const DialogFooter: React.FC<{
  children: React.ReactNode
  gap?: number
}> = ({ children, gap = 2 }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-${gap}`}>
      {children}
    </div>
  )
}

export const DialogCloseTrigger: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <button 
      className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      aria-label="Close"
    >
      {children || <X className="h-4 w-4" />}
    </button>
  )
}

export const DialogActionTrigger: React.FC<{
  children: React.ReactNode
  asChild?: boolean
}> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}
