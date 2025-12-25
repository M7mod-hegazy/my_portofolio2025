import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Search, Github, Globe, Star, Image as ImageIcon, Trash2, X, Edit2, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { ParallaxCard } from "@/components/ui/parallax-card";

interface ProjectDB {
    _id?: string;
    title: string;
    description: string;
    images: string[];
    technologies: string[];
    category: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
}

const CATEGORIES = ["Web App", "Mobile App", "Website", "Design", "Other"];
const TECH_SUGGESTIONS = ["React", "Node.js", "TypeScript", "Next.js", "TailwindCSS", "MongoDB", "PostgreSQL", "Docker", "AWS", "Framer Motion", "Three.js", "Python", "Django", "FastAPI"];

export const ProjectsAdmin = () => {
    const [projects, setProjects] = useState<ProjectDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectDB | null>(null);
    const [search, setSearch] = useState("");
    const [techInput, setTechInput] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            if (json.success) {
                setProjects(json.data);
            }
        } catch (err) {
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        try {
            const method = editingProject._id ? 'PUT' : 'POST';
            const url = editingProject._id ? `/api/projects/${editingProject._id}` : '/api/projects';
            const { _id, ...payload } = editingProject;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(`Project ${editingProject._id ? 'updated' : 'created'}`);
                fetchProjects();
                setIsDialogOpen(false);
                setEditingProject(null);
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving project");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This cannot be undone.")) return;
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            toast.success("Project deleted");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const openNewProject = () => {
        setEditingProject({
            title: "",
            description: "",
            images: [],
            technologies: [],
            category: "Web App"
        });
        setIsDialogOpen(true);
    };

    const openEditProject = (project: ProjectDB) => {
        setEditingProject({ ...project });
        setIsDialogOpen(true);
    };

    const addTech = (tech: string) => {
        if (editingProject && !editingProject.technologies.includes(tech)) {
            setEditingProject({
                ...editingProject,
                technologies: [...editingProject.technologies, tech]
            });
        }
        setTechInput("");
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Toolbar */}
            <GlassPanel className="p-4 flex flex-col sm:flex-row justify-between gap-4 sticky top-0 z-20">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                    <Input
                        placeholder="Search projects by name or description..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 bg-black/40 border-white/10 text-white focus:border-cyan-500/50 transition-all"
                    />
                </div>
                <NeonButton onClick={openNewProject} icon={<Plus size={16} />} className="shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    Add Project
                </NeonButton>
            </GlassPanel>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-white space-y-4">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                        <p className="text-cyan-400 animate-pulse">Initializing Project Matrix...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                        {filteredProjects.map(project => (
                            <ParallaxCard key={project._id} className="h-full">
                                <div className="h-full flex flex-col bg-[#0a0a16] rounded-xl border border-white/10 overflow-hidden relative group">
                                    {/* Image Preview */}
                                    <div className="aspect-video relative overflow-hidden bg-black">
                                        {project.images[0] ? (
                                            <img
                                                src={project.images[0]}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                                onError={(e) => e.currentTarget.src = "https://placehold.co/600x400/1a1a1a/cccccc?text=No+Image"}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700 bg-grid-white/[0.05]">
                                                <ImageIcon className="w-12 h-12 opacity-50" />
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <NeonButton size="sm" onClick={() => openEditProject(project)} variant="secondary" icon={<Edit2 size={14} />}>
                                                Edit
                                            </NeonButton>
                                            <NeonButton size="sm" onClick={() => project._id && handleDelete(project._id)} variant="danger" icon={<Trash2 size={14} />} />
                                        </div>

                                        {project.featured && (
                                            <div className="absolute top-3 right-3 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                                <Star className="w-3 h-3 fill-yellow-200" /> Featured
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/50">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                                            <span className="text-[10px] uppercase tracking-wider text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-500/5">
                                                {project.category}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm line-clamp-2 h-10 leading-relaxed">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="text-[10px] text-gray-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded transition-colors hover:bg-white/10 hover:text-white">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 4 && (
                                                <span className="text-[10px] text-gray-500 px-1 py-0.5">+ {project.technologies.length - 4}</span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 flex gap-4 text-gray-400 border-t border-white/5">
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-cyan-400 transition-colors">
                                                    <Globe className="w-3 h-3" /> Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-purple-400 transition-colors">
                                                    <Github className="w-3 h-3" /> Code
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ParallaxCard>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#050510]/95 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {editingProject?._id ? <Edit2 className="text-cyan-400" /> : <Sparkles className="text-purple-400" />}
                            {editingProject?._id ? "Edit Project" : "New Neural Construct"}
                        </DialogTitle>
                    </DialogHeader>

                    {editingProject && (
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Project Title</Label>
                                    <Input
                                        value={editingProject.title}
                                        onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        placeholder="Project Name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Category</Label>
                                    <select
                                        value={editingProject.category}
                                        onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm focus:border-cyan-500/50 text-white outline-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#050510]">{c}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Description</Label>
                                    <Textarea
                                        value={editingProject.description}
                                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                        className="bg-black/40 border-white/10 min-h-[150px] focus:border-cyan-500/50 resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <Switch
                                        checked={editingProject.featured}
                                        onCheckedChange={c => setEditingProject({ ...editingProject, featured: c })}
                                    />
                                    <Label>Feature on Homepage</Label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Tech Stack</Label>
                                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-black/20 rounded-lg min-h-[50px] border border-white/5">
                                        {editingProject.technologies.map(tech => (
                                            <span key={tech} className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs flex items-center gap-1 border border-cyan-500/20">
                                                {tech}
                                                <X
                                                    size={12}
                                                    className="cursor-pointer hover:text-white"
                                                    onClick={() => setEditingProject({
                                                        ...editingProject,
                                                        technologies: editingProject.technologies.filter(t => t !== tech)
                                                    })}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={techInput}
                                            onChange={e => setTechInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (techInput) addTech(techInput);
                                                }
                                            }}
                                            placeholder="Type and press Enter, or select below..."
                                            className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        />
                                        {techInput && (
                                            <div className="absolute top-full left-0 right-0 bg-[#1a1a2e] border border-white/10 rounded-b-md z-50 max-h-[150px] overflow-y-auto">
                                                {TECH_SUGGESTIONS
                                                    .filter(t => t.toLowerCase().includes(techInput.toLowerCase()) && !editingProject.technologies.includes(t))
                                                    .map(t => (
                                                        <div
                                                            key={t}
                                                            className="p-2 hover:bg-white/10 cursor-pointer text-sm"
                                                            onClick={() => addTech(t)}
                                                        >
                                                            {t}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Links</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                value={editingProject.liveUrl || ""}
                                                onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                                                className="bg-black/40 border-white/10 pl-9 focus:border-cyan-500/50"
                                                placeholder="Live URL"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                value={editingProject.githubUrl || ""}
                                                onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                                                className="bg-black/40 border-white/10 pl-9 focus:border-cyan-500/50"
                                                placeholder="GitHub URL"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Images (URLs)</Label>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                        {editingProject.images.map((img, idx) => (
                                            <div key={idx} className="flex gap-2 group">
                                                <Input
                                                    value={img}
                                                    onChange={e => {
                                                        const newImages = [...editingProject.images];
                                                        newImages[idx] = e.target.value;
                                                        setEditingProject({ ...editingProject, images: newImages });
                                                    }}
                                                    className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                                />
                                                <NeonButton type="button" variant="ghost" size="sm" onClick={() => {
                                                    const newImages = editingProject.images.filter((_, i) => i !== idx);
                                                    setEditingProject({ ...editingProject, images: newImages });
                                                }} className="hover:bg-red-500/20 hover:text-red-400 p-2">
                                                    <X className="w-4 h-4" />
                                                </NeonButton>
                                            </div>
                                        ))}
                                        <NeonButton
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingProject({ ...editingProject, images: [...editingProject.images, ""] })}
                                            className="w-full border-dashed border-white/20 hover:bg-white/5 text-gray-400"
                                            icon={<Plus size={14} />}
                                        >
                                            Add Image URL
                                        </NeonButton>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 mt-auto">
                                    <NeonButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">Cancel</NeonButton>
                                    <NeonButton type="submit" icon={<Edit2 size={16} />}>
                                        Save Project
                                    </NeonButton>
                                </div>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

