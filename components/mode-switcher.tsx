"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

export function ModeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
    >
        <SunIcon className="hidden [html.dark_&]:block" />
        <MoonIcon className="hidden [html.light_&]:block" />
        <span className="sr-only">Toggle theme</span>
    </Button>
  )
}