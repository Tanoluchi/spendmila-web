"use client"

import React, { type PropsWithChildren } from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "./toaster"

export function CustomProvider(props: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {props.children}
      <Toaster />
    </ThemeProvider>
  )
}
