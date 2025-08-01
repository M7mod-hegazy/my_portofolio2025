import { useState, useEffect } from "react"
import { Menu, X, Home, User, Briefcase, Award, Settings, Mail, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "roadmap", label: "Journey", icon: Map },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "contact", label: "Contact", icon: Mail },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Logo */}
      <div className="fixed top-6 left-6 z-50 hidden md:block">
        <button
          onClick={() => scrollToSection('home')}
          className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-3 rounded-full border border-primary/40 shadow-lg group-hover:shadow-xl group-hover:border-primary/60 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Mohamed Hegazy Logo"
                className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </div>
          </div>
          <div className="glass-card px-3 py-2 group-hover:bg-primary/10 transition-all duration-300">
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">Mohamed Hegazy</div>
            <div className="text-xs text-muted-foreground">Electronics & Telecommunications Engineer</div>
          </div>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="glass-card px-6 py-3">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                    activeSection === item.id
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="glass"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 rounded-full"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <div className="fixed top-20 left-6 right-6">
              <div className="glass-card p-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center mb-6 pb-4 border-b border-primary/10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-2 rounded-full border border-primary/40 shadow-md">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8 object-contain filter brightness-0 invert"
                        onError={(e) => {
                          // Fallback if logo doesn't exist
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Mohamed Hegazy</h3>
                      <p className="text-xs text-muted-foreground">Electronics & Telecommunications Engineer</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                          activeSection === item.id
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}