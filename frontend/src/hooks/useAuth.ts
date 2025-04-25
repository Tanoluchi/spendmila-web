import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "@/client"
import { handleError } from "@/utils"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err, (message) => {
        setError(message)
        toast.error(message)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
    try {
      const response = await LoginService.loginAccessToken({
        formData: data,
      })
      localStorage.setItem("access_token", response.access_token)
      return response
    } catch (error) {
      // Si es un error de red (backend no disponible)
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Backend server is not available. Please try again later.')
      }
      // Si es otro tipo de error, lo propagamos
      throw error
    }
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Login successful!')
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      navigate({ to: "/dashboard" })
    },
    onError: (err: Error | ApiError) => {
      const message = err instanceof Error 
        ? err.message 
        : 'Invalid credentials or server error'
      setError(message)
      toast.error(message)
      console.error('Login error:', err)
    },
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    queryClient.removeQueries({ queryKey: ["currentUser"] })
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
