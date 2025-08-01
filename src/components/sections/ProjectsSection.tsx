import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react"
import { projectCategories } from "@/lib/portfolio-data"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [galleryProject, setGalleryProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?type=project');
        const data = await res.json();
        if (data.success) {
          setCategories(["All", ...data.data.map((cat) => cat.name)]);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setVisibleProjects(6); // Reset on category change
  }, [activeCategory]);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  const projectsToShow = filteredProjects.slice(0, visibleProjects);

  const handleLoadMore = () => {
    setVisibleProjects(prev => prev + 6);
  };

  return (
    <section id="projects" className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              My <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A showcase of my recent work, featuring web applications, mobile apps, 
              and creative experiments.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "glass"}
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="flex overflow-x-auto space-x-8 pb-4">
            {filteredProjects.map((project) => (
              <Card 
                key={project._id} 
                className="glass-card overflow-hidden group hover:shadow-glow transition-all duration-300 flex-shrink-0 w-80"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.images && project.images[0] ? project.images[0] : "/api/placeholder/400/250"}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {project.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    {project.liveUrl && (
                      <Button size="icon" variant="glass" className="rounded-full" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="icon" variant="glass" className="rounded-full" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                        </a>
                    </Button>
                    )}
                    <Button size="icon" variant="glass" className="rounded-full" onClick={() => setGalleryProject(project)}>
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {galleryProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-background rounded-lg shadow-lg max-w-4xl w-full p-6">
            <Button size="icon" variant="destructive" className="absolute top-4 right-4 z-10" onClick={() => setGalleryProject(null)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold mb-4">{galleryProject.title}</h2>
            
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {galleryProject.images.map((img: string, idx: number) => (
                  <div className="flex-shrink-0 w-full" key={idx}>
                    <img src={img} alt={`${galleryProject.title} - image ${idx + 1}`} className="w-full h-96 object-contain rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <Button size="icon" variant="ghost" className="absolute left-8 top-1/2 -translate-y-1/2" onClick={scrollPrev}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button size="icon" variant="ghost" className="absolute right-8 top-1/2 -translate-y-1/2" onClick={scrollNext}>
              <ChevronRight className="w-6 h-6" />
            </Button>
            
            <div className="mt-4">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {galleryProject.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {galleryProject.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}