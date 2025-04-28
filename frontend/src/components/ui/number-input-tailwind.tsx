import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  precision = 0,
  className = "",
  placeholder = "",
  disabled = false,
  required = false,
  id,
  name,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(value.toString())

  React.useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    
    const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  const handleBlur = () => {
    let newValue = parseFloat(inputValue)
    
    if (isNaN(newValue)) {
      newValue = 0
    }
    
    if (min !== undefined && newValue < min) {
      newValue = min
    }
    
    if (max !== undefined && newValue > max) {
      newValue = max
    }
    
    const formattedValue = precision > 0 
      ? newValue.toFixed(precision) 
      : newValue.toString()
      
    setInputValue(formattedValue)
    onChange(newValue)
  }

  const increment = () => {
    if (disabled) return
    const newValue = Number((value + step).toFixed(precision))
    if (max !== undefined && newValue > max) return
    onChange(newValue)
  }

  const decrement = () => {
    if (disabled) return
    const newValue = Number((value - step).toFixed(precision))
    if (min !== undefined && newValue < min) return
    onChange(newValue)
  }

  return (
    <div className="relative flex">
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:text-gray-200 dark:focus:ring-blue-600 dark:focus:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          pr-10 ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
      />
      <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300 dark:border-gray-700">
        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className="flex-1 flex items-center justify-center px-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          tabIndex={-1}
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className="flex-1 flex items-center justify-center px-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          tabIndex={-1}
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  )
}
