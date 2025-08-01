import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const root = document.documentElement
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // Apply theme class
    if (theme === "light") {
      root.classList.add("light")
    } else {
      root.classList.remove("light")
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}