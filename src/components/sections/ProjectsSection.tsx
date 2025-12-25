import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Zap, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  technologies: string[];
  features?: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  date?: string;
  team?: string;
  status?: string;
  featured?: boolean;
}

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProjects(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeProject]);

  const nextImage = () => {
    if (activeProject?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % activeProject.images.length);
    }
  };

  const prevImage = () => {
    if (activeProject?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + activeProject.images.length) % activeProject.images.length);
    }
  };

  // Get unique categories
  const categories = ["all", ...new Set(projects.map(p => p.category))];

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <section id="projects" className="min-h-screen py-32 bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative min-h-screen py-32 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Selected Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of digital experiences, applications, and experiments showcasing my expertise.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-secondary/30 backdrop-blur-md border border-white/20 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-all duration-300"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border ${selectedCategory === category
                ? "bg-gradient-to-r from-primary to-accent text-white border-primary/60 shadow-lg shadow-primary/40"
                : "bg-secondary/30 text-muted-foreground border-white/20 hover:border-primary/40 hover:text-primary"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Revolutionary Hybrid Design (Option 1 + 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, rotateZ: 2 }}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer perspective"
              style={{ perspective: '1000px' }}
            >
              {/* Gradient Border Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

              {/* Main Card */}
              <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/40 to-secondary/20 backdrop-blur-xl border border-white/20 group-hover:border-primary/60 transition-all flex flex-col shadow-2xl">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Gallery Preview with Parallax */}
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  {project.images && project.images.length > 0 && !brokenImages[project._id] ? (
                    <motion.img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                      whileHover={{ scale: 1.3 }}
                      onError={() => setBrokenImages(prev => ({ ...prev, [project._id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Floating Tech Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {project.technologies.slice(0, 2).map((tech, idx) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/80 text-white backdrop-blur-md border border-white/30 shadow-lg"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>

                  {/* Image Count Badge - Glowing */}
                  {project.images && project.images.length > 1 && (
                    <motion.div
                      className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/30 shadow-lg"
                      animate={{ boxShadow: ['0 0 10px rgba(139, 92, 246, 0.5)', '0 0 20px rgba(139, 92, 246, 0.8)', '0 0 10px rgba(139, 92, 246, 0.5)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {project.images.length} 📸
                    </motion.div>
                  )}

                  {/* Category Badge - Top Right */}
                  <div className="absolute bottom-4 right-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-primary/80 text-white backdrop-blur-md border border-white/30">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col relative z-10">
                  {/* Title with Glow */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack with Scroll */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.1 }}
                          className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/40 font-semibold hover:border-primary/80 transition-all cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs px-3 py-1 rounded-lg bg-white/10 text-muted-foreground border border-white/20 font-semibold">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Date Footer */}
                  <div className="flex items-center justify-between">
                    <motion.span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${project.status === 'Live'
                        ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                        : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                        }`}
                      animate={{
                        boxShadow: project.status === 'Live'
                          ? ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 10px rgba(34, 197, 94, 0.3)']
                          : ['0 0 10px rgba(234, 179, 8, 0.3)', '0 0 20px rgba(234, 179, 8, 0.6)', '0 0 10px rgba(234, 179, 8, 0.3)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ● {project.status || 'In Progress'}
                    </motion.span>
                    <span className="text-xs text-muted-foreground font-semibold">{project.date || '2024'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={!!activeProject} onOpenChange={() => setActiveProject(null)}>
        <DialogContent className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-none h-[90vh] p-0 bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-2xl border-white/30 overflow-hidden shadow-2xl">
          <ScrollArea className="h-full w-full">
            {activeProject && (
              <>
                {/* Image Gallery */}
                <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                  {activeProject.images && activeProject.images.length > 0 ? (
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={activeProject.images[currentImageIndex]}
                      alt={`${activeProject.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />

                  {/* Image Navigation */}
                  {activeProject.images && activeProject.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {activeProject.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentImageIndex
                              ? 'bg-primary w-8'
                              : 'bg-white/30 w-2 hover:bg-white/50'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  {/* Title and Meta */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/80 text-white">
                        {activeProject.category}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${activeProject.status === 'Live'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {activeProject.status || 'In Progress'}
                      </span>
                    </div>
                    <h2 className="text-5xl font-bold mb-4">{activeProject.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {activeProject.longDescription || activeProject.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

                  {/* Project Info Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
                      </div>
                      <p className="font-semibold">{activeProject.date || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Team</p>
                      </div>
                      <p className="font-semibold">{activeProject.team || 'Solo'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Tech</p>
                      </div>
                      <p className="font-semibold">{activeProject.technologies.length} tools</p>
                    </div>
                  </div>

                  {/* Features */}
                  {activeProject.features && activeProject.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4">Key Features</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {activeProject.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.map((tech) => (
                        <span key={tech} className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {activeProject.liveUrl && (
                      <Button
                        asChild
                        className="flex-1 py-6 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50"
                      >
                        <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {activeProject.githubUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 py-6 px-6 rounded-2xl"
                      >
                        <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-5 h-5 mr-2" />
                          Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};