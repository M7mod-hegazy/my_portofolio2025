import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, Sparkles, LayoutDashboard, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code } = useParams();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.12,
    duration: 3 + (i % 4) * 0.5,
    radius: 140 + (i % 3) * 30,
    size: 4 + (i % 3) * 2,
  }));

  const isAdminPath = location.pathname.startsWith("/admin");
  const statusCode = useMemo(() => {
    if (code === "500" || code === "503") return code;
    return "404";
  }, [code]);

  const content = useMemo(() => {
    if (statusCode === "500") {
      return {
        title: "Something Broke on Our Side",
        description: "We hit an internal error. Try reloading the page or continue to a safe route.",
      };
    }
    if (statusCode === "503") {
      return {
        title: "Service Temporarily Unavailable",
        description: "The service is warming up or under maintenance. Please try again in a moment.",
      };
    }
    return {
      title: "Lost in the Digital Void",
      description: "The page you requested does not exist. Use one of the links below to continue.",
    };
  }, [statusCode]);

  const quickLinks = useMemo(() => {
    if (isAdminPath) {
      return [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Settings", href: "/admin/settings", icon: Settings },
        { label: "Live Site", href: "/", icon: Home },
      ];
    }
    return [
      { label: "Home", href: "/", icon: Home },
      { label: "Projects", href: "/#projects", icon: Compass },
      { label: "Contact", href: "/#contact", icon: Sparkles },
    ];
  }, [isAdminPath]);

  const primaryHref = isAdminPath ? "/admin/dashboard" : "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(primaryHref);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/50 px-4 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
          animate={{
            x: mousePos.x - 300,
            y: mousePos.y - 300,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]"
          animate={{
            x: mousePos.x - 200 + 100,
            y: mousePos.y - 200 + 100,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-[2px]"
              animate={{
                boxShadow: [
                  "0 0 30px hsl(271 81% 56% / 0.4)",
                  "0 0 60px hsl(271 81% 56% / 0.6)",
                  "0 0 30px hsl(271 81% 56% / 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                  M
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-8 flex justify-center min-h-[180px] sm:min-h-[240px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: particle.delay,
                  }}
                  style={{
                    width: particle.radius * 2,
                    height: particle.radius * 2,
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{
                      width: particle.size,
                      height: particle.size,
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: particle.delay,
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />
            </motion.div>
            <span className="relative text-[110px] sm:text-[180px] lg:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-pink-500 to-accent leading-none select-none">
              {statusCode}
            </span>
            <motion.span
              className="absolute text-[110px] sm:text-[180px] lg:text-[220px] font-black text-accent/20 leading-none select-none"
              animate={{ x: [0, -3, 3, 0], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {statusCode}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              {content.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              {content.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 w-full"
          >
            {quickLinks.map((link) => (
              <motion.div
                key={link.label}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground min-h-[48px]"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button onClick={handleBack} className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl font-semibold shadow-glow w-full sm:w-auto">
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </Button>
            <Link to={primaryHref} className="w-full sm:w-auto">
              <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl border-white/20 hover:bg-white/10 w-full">
                <Home className="mr-2" size={20} />
                {isAdminPath ? "Admin Dashboard" : "Homepage"}
              </Button>
            </Link>
            {(statusCode === "500" || statusCode === "503") && (
              <Button onClick={() => window.location.reload()} variant="secondary" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl w-full sm:w-auto">
                <RefreshCw className="mr-2" size={18} />
                Retry
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 sm:mt-16"
          >
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
