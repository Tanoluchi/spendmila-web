import { useMutation } from "@tanstack/react-query"
import { createFileRoute, redirect, Link as RouterLink } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Mail, Loader2 } from "lucide-react"

import { type ApiError, LoginService } from "@/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { isLoggedIn } from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"

interface FormData {
  email: string
}

export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function RecoverPassword() {
  const { showSuccessToast } = useCustomToast()
  const form = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    })
  }

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showSuccessToast("Password recovery email sent successfully.")
      form.reset()
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (form.formState.isSubmitting) return
    mutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <img src="/assets/images/logo.png" alt="SpendMila Logo" className="w-20 h-20" />
          <h1 className="text-3xl font-bold text-purple-dark dark:text-purple">Password Recovery</h1>
          <p className="text-muted-foreground text-center dark:text-gray-300">
            A password recovery email will be sent to the registered account.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
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
                        className="pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="w-full bg-purple hover:bg-purple-dark dark:bg-purple-dark dark:hover:bg-purple"
            >
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>

            <div className="text-center text-sm text-gray-700 dark:text-gray-200">
              <RouterLink 
                to="/login" 
                className="text-purple hover:text-purple-dark dark:text-purple"
              >
                Back to Login
              </RouterLink>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
