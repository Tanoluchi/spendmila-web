"use client"

import { toast } from "../components/ui/toaster"

const useCustomToast = () => {
  const showSuccessToast = (description: string) => {
    toast.success(description);
  }

  const showErrorToast = (description: string) => {
    toast.error(description);
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
