import { useState, useEffect } from "react"
import { Menu, X, Home, User, Briefcase, Award, Settings, Mail, Map, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "about", label: "About", icon: User, path: "/#about" },
  { id: "journey", label: "Journey", icon: Map, path: "/#journey" },
  { id: "skills", label: "Arsenal", icon: Zap, path: "/#skills" },
  { id: "projects", label: "Projects", icon: Briefcase, path: "/#projects" },
  { id: "certifications", label: "Certifications", icon: Award, path: "/#certifications" },
  { id: "contact", label: "Contact", icon: Mail, path: "/#contact" },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { currentTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id)
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (path: string, sectionId: string) => {


    if (window.location.pathname !== "/") {
      window.location.href = path;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Logo */}
      <div className="fixed top-6 left-6 z-50 hidden md:block">
        <button
          onClick={() => scrollToSection('/', 'home')}
          className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-3 rounded-full border border-primary/40 shadow-lg group-hover:shadow-xl group-hover:border-primary/60 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Mohamed Hegazy Logo"
                className="w-10 h-10 object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            </div>
          </div>

        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block transition-all duration-500">
        <div
          className="glass-card px-6 py-3 transition-all duration-500"
          style={{
            borderColor: `${currentTheme.primary}40`,
            backgroundColor: `rgba(0, 0, 0, 0.6)`,
          }}
        >
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.path, item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
                    activeSection === item.id
                      ? "text-white font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                  style={
                    activeSection === item.id
                      ? {
                        backgroundColor: item.id === "skills" ? "rgba(239, 68, 68, 0.2)" : `${currentTheme.primary}20`,
                        color: item.id === "skills" ? "#ef4444" : currentTheme.primary,
                        boxShadow: item.id === "skills" ? "0 0 15px rgba(239, 68, 68, 0.4)" : `0 0 15px ${currentTheme.primary}40`,
                      }
                      : {}
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Thumb Menu) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="glass-card p-2 flex justify-between items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.path, item.id)}
                className={cn(
                  "relative p-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center",
                  isActive ? (item.id === "skills" ? "text-red-500" : "text-primary") : "text-gray-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 relative z-10", isActive && "scale-110")} />
                {/* Optional: Label for active item or just icon */}
                {/* <span className="text-[10px] mt-1">{item.label}</span> */}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}