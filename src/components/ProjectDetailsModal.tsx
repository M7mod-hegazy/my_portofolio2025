import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, X, Layers, Code, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-none h-[90vh] p-0 bg-background/95 backdrop-blur-2xl border-white/20 overflow-hidden shadow-2xl">
        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Visual Side */}
            <div className="relative h-64 lg:h-full bg-black/50 flex items-center justify-center p-4 md:p-8">
              <div className="relative w-full aspect-video lg:aspect-auto lg:h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.liveUrl && (
                      <Button size="sm" variant="secondary" onClick={() => window.open(project.liveUrl, '_blank')}>
                        <Globe className="w-4 h-4 mr-2" /> Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" onClick={() => window.open(project.githubUrl, '_blank')}>
                        <Github className="w-4 h-4 mr-2" /> Source Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Side */}
            <div className="h-full flex flex-col">
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Project Details
                </h3>
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" /> Description
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" /> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Simulated "Behind the Code" Section */}
                  <div className="p-3 md:p-4 rounded-lg bg-secondary/20 border border-white/5 font-mono text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2 border-b border-white/5 pb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2">architecture.json</span>
                    </div>
                    <pre className="text-primary/80 overflow-x-auto">
                      {`{
  "architecture": "Microservices",
  "deployment": "Vercel Edge",
  "database": "PostgreSQL",
  "status": "Production Ready"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
