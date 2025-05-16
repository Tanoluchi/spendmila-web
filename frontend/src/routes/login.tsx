import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from 'react';
import { cn } from "@/lib/utils"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { emailPattern, passwordRules } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (!form.formState.isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <img src="/assets/images/logo.png" alt="SpendMila Logo" className="w-20 h-20" />
          <h1 className="text-3xl font-bold text-purple-dark dark:text-purple">Welcome to SpendMila</h1>
          <p className="text-muted-foreground text-center dark:text-gray-300">
            Sign in to manage your finances with your feline friend
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: "Email is required",
                pattern: emailPattern,
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="your@email.com"
                        className={cn(
                          "pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                          error && "border-destructive ring-destructive"
                        )}
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage>
                    {error ? "Invalid email or password" : undefined}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={passwordRules()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={cn(
                          "pl-10 pr-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                          error && "border-destructive ring-destructive"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <RouterLink 
                to="/recover-password" 
                className="text-sm text-purple hover:text-purple-dark dark:text-purple"
              >
                Forgot Password?
              </RouterLink>
            </div>

            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="w-full bg-purple hover:bg-purple-dark dark:bg-purple-dark dark:hover:bg-purple"
            >
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="text-center text-sm text-gray-700 dark:text-gray-200">
              <RouterLink 
                to="/signup" 
                className="hover:text-purple-dark dark:hover:text-purple-dark"
              >
                Don't have an account? <span className="text-purple hover:text-purple-dark font-semibold dark:text-purple">Sign Up</span>
              </RouterLink>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
