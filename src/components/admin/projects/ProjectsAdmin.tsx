import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { AdminLoader } from "../AdminLoader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
    Plus, Search, Github, Globe, Star, Image as ImageIcon, Trash2, X, Edit2, Sparkles,
    Upload, Eye, Loader2, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, MoreVertical
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectDB {
    _id?: string;
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

const CATEGORIES = ["All", "Web App", "Mobile App", "Website", "Design", "Other"];
const STATUS_OPTIONS = ["All Status", "Active", "In Progress", "Completed", "Archived"];
const TECH_SUGGESTIONS = ["React", "Node.js", "TypeScript", "Next.js", "TailwindCSS", "MongoDB", "PostgreSQL", "Docker", "AWS", "Framer Motion", "Three.js", "Python", "Django", "FastAPI"];

export const ProjectsAdmin = () => {
    // Data State
    const [projects, setProjects] = useState<ProjectDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Grid/List View
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter State
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectDB | null>(null);
    const [techInput, setTechInput] = useState("");

    // Drag-and-drop / Image Upload State
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    // Filter Logic
    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesStatus = selectedStatus === "All Status" || (p.status || "Active") === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, selectedStatus]);

    // CRUD Operations
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

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
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
            longDescription: "",
            images: [],
            technologies: [],
            features: [],
            category: "Web App",
            status: "Active"
        });
        setTechInput("");
        setIsDialogOpen(true);
    };

    const openEditProject = (project: ProjectDB, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingProject({ ...project });
        setTechInput("");
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

    // ─── Image Upload Logic ──────────────────────────────────────────
    const uploadFiles = useCallback(async (files: File[]) => {
        if (!editingProject || files.length === 0) return;

        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            toast.error("Only image files are allowed");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        imageFiles.forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const result = await res.json();
                const newUrls: string[] = result.data.map((item: any) => item.url);
                setEditingProject(prev => prev ? {
                    ...prev,
                    images: [...prev.images, ...newUrls]
                } : prev);
                toast.success(`${newUrls.length} image(s) uploaded`);
            } else {
                const err = await res.json();
                toast.error(err.error || "Upload failed");
            }
        } catch (err) {
            toast.error("Upload error");
        } finally {
            setIsUploading(false);
        }
    }, [editingProject]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    }, [uploadFiles]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    }, [uploadFiles]);

    const removeImage = (index: number) => {
        if (!editingProject) return;
        setEditingProject({
            ...editingProject,
            images: editingProject.images.filter((_, i) => i !== index)
        });
    };

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* ═══ Header & Controls ═══ */}
            <div className="flex flex-col gap-4 sticky top-0 z-30 pt-4 bg-[#030014]/80 backdrop-blur-md pb-4 border-b border-white/5 -mx-4 px-4 md:px-6">

                {/* Top Row: Title & Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Project Command
                        </h1>
                        <p className="text-sm text-gray-400">Manage neural constructs and portfolios</p>
                    </div>
                    <NeonButton onClick={openNewProject} icon={<Plus size={16} />} className="shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        Create
                    </NeonButton>
                </div>

                {/* Bottom Row: Filters & Search */}
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                        <Input
                            placeholder="Search projects by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 bg-black/40 border-white/10 text-white focus:border-cyan-500/50 transition-all h-10"
                        />
                    </div>

                    {/* Filters Wrapper */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {/* Category Filter */}
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 gap-1">
                            {CATEGORIES.slice(0, 4).map(cat => ( // Show first few, use dropdown for more if needed
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Status Dropdown */}
                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="bg-black/40 border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-cyan-500/50 outline-none hover:bg-white/5 cursor-pointer"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#050510]">{s}</option>)}
                        </select>

                        {/* View Toggle */}
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                                <LayoutGrid size={16} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Content Area ═══ */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
                {isLoading ? (
                    <AdminLoader />
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-white/40 space-y-4 border border-dashed border-white/10 rounded-2xl m-4">
                        <Filter className="w-12 h-12 opacity-20" />
                        <p className="text-lg">No projects match your query</p>
                        <button onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedStatus("All Status"); }} className="text-cyan-400 hover:underline text-sm">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
                        <AnimatePresence>
                            {paginatedProjects.map(project => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    viewMode={viewMode}
                                    onEdit={(e) => openEditProject(project, e)}
                                    onDelete={(e) => project._id && handleDelete(project._id, e)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ═══ Pagination Footer ═══ */}
            <div className="p-4 bg-[#030014]/90 backdrop-blur-xl border-t border-white/10 z-30 flex justify-between items-center -mx-4 px-4 md:-mx-6 md:px-6 sticky bottom-0">
                <p className="text-xs text-gray-500 hidden sm:block">
                    Showing {paginatedProjects.length} of {filteredProjects.length} projects
                </p>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft size={18} className="text-cyan-400" />
                    </button>

                    <span className="text-sm font-mono text-white/80 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                        {currentPage} <span className="text-white/30">/</span> {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight size={18} className="text-cyan-400" />
                    </button>
                </div>
            </div>

            {/* ═══ Edit/Create Dialog ═══ */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingProject(null); }}>
                <DialogContent className="bg-[#050510]/95 border-white/10 text-white max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden backdrop-blur-xl z-[60]">
                    <div className="p-6 pb-0 border-b border-white/5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {editingProject?._id ? <Edit2 className="text-cyan-400 w-5 h-5" /> : <Sparkles className="text-purple-400 w-5 h-5" />}
                                {editingProject?._id ? "Edit Project" : "New Neural Construct"}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[calc(90vh-80px)] px-6 py-6">
                        {editingProject && (
                            <form onSubmit={handleSave} className="space-y-8">

                                {/* ─── Section 1: Core Info ─── */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c} className="bg-[#050510]">{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Short Description</Label>
                                    <Textarea
                                        value={editingProject.description}
                                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                        className="bg-black/40 border-white/10 min-h-[80px] focus:border-cyan-500/50 resize-none"
                                        placeholder="Brief project summary..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Long Description</Label>
                                    <Textarea
                                        value={editingProject.longDescription || ""}
                                        onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                                        className="bg-black/40 border-white/10 min-h-[100px] focus:border-cyan-500/50 resize-none"
                                        placeholder="Detailed project description for the detail view..."
                                    />
                                </div>

                                {/* ─── Section 2: Drag & Drop Image Upload ─── */}
                                <div className="space-y-3 p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Project Images
                                        {editingProject.images.length > 0 && (
                                            <span className="text-white/40 text-[10px] font-normal ml-1">({editingProject.images.length})</span>
                                        )}
                                    </Label>

                                    {/* Drop Zone */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                        className={`
                                        relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
                                        ${isDragOver
                                                ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                                                : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                                            }
                                        ${isUploading ? "pointer-events-none opacity-60" : ""}
                                    `}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                        />

                                        <div className="flex flex-col items-center justify-center py-8 md:py-10 px-4 text-center">
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                                                    <p className="text-sm text-cyan-400 font-medium">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={`
                                                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                                                    ${isDragOver
                                                            ? "bg-cyan-500/20 text-cyan-400 scale-110"
                                                            : "bg-white/5 text-white/30"
                                                        }
                                                `}>
                                                        <Upload className="w-7 h-7" />
                                                    </div>
                                                    <p className="text-sm text-white/60 mb-1">
                                                        {isDragOver ? (
                                                            <span className="text-cyan-400 font-medium">Release to upload</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-cyan-400 font-medium">Click to browse</span>
                                                                {" "}or drag and drop
                                                            </>
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-white/30">PNG, JPG, WEBP up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Preview Grid */}
                                    {editingProject.images.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                                            {editingProject.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group/img aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/30"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Project image ${idx + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                                                        onError={(e) => e.currentTarget.src = "https://placehold.co/200x200/1a1a1a/555?text=Error"}
                                                    />

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5">
                                                        {/* Preview Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }}
                                                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Index Badge */}
                                                    {idx === 0 && (
                                                        <div className="absolute top-1 left-1 bg-cyan-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            COVER
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Manual URL Entry */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Or paste image URL..."
                                            className="bg-black/40 border-white/10 focus:border-cyan-500/50 text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = (e.target as HTMLInputElement).value.trim();
                                                    if (val) {
                                                        setEditingProject({
                                                            ...editingProject,
                                                            images: [...editingProject.images, val]
                                                        });
                                                        (e.target as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* ─── Section 3: Tech Stack ─── */}
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
                                        {editingProject.technologies.length === 0 && (
                                            <span className="text-white/20 text-xs">No technologies added yet</span>
                                        )}
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

                                {/* ─── Section 4: Links & Metadata ─── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    <Input
                                        value={editingProject.team || ""}
                                        onChange={e => setEditingProject({ ...editingProject, team: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        placeholder="Team / Solo"
                                    />
                                    <Input
                                        value={editingProject.date || ""}
                                        onChange={e => setEditingProject({ ...editingProject, date: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        placeholder="Date (e.g. 2024)"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Switch
                                            checked={editingProject.featured}
                                            onCheckedChange={c => setEditingProject({ ...editingProject, featured: c })}
                                        />
                                        <Label>Feature on Homepage</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <select
                                            value={editingProject.status || "Active"}
                                            onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm focus:border-cyan-500/50 text-white outline-none"
                                        >
                                            <option value="Active" className="bg-[#050510]">Active</option>
                                            <option value="In Progress" className="bg-[#050510]">In Progress</option>
                                            <option value="Completed" className="bg-[#050510]">Completed</option>
                                            <option value="Archived" className="bg-[#050510]">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ─── Actions ─── */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                    <NeonButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">Cancel</NeonButton>
                                    <NeonButton type="submit" icon={<Edit2 size={16} />}>
                                        {editingProject?._id ? "Update Project" : "Create Project"}
                                    </NeonButton>
                                </div>
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Image Preview Lightbox */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="bg-black/95 border-white/10 max-w-5xl w-full p-0 overflow-hidden outline-none">
                    <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] bg-black">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        )}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─── Sub-Components ──────────────────────────────────────────────────

function ProjectCard({ project, viewMode, onEdit, onDelete }: { project: ProjectDB, viewMode: 'grid' | 'list', onEdit: (e: any) => void, onDelete: (e: any) => void }) {
    if (viewMode === 'list') {
        return (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all hover:border-cyan-500/30 group">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-black shrink-0 relative">
                    {project.images[0] ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>
                <div className="flex-1 min-w-0" onClick={onEdit} role="button" tabIndex={0}>
                    <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{project.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-xs text-gray-500">{project.status || "Active"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <NeonButton size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={onEdit} className="hidden sm:flex">Edit</NeonButton>
                    <NeonButton size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={onDelete} className="hidden sm:flex" />

                    {/* Mobile Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="sm:hidden p-2 text-gray-400 hover:text-white">
                            <MoreVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={onEdit}>Edit Project</DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-red-400">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex flex-col bg-[#0a0a16] rounded-xl border border-white/10 overflow-hidden relative group hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
        >
            {/* Image Preview */}
            <div className="aspect-video relative overflow-hidden bg-black group" onClick={onEdit}>
                {project.images[0] ? (
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => e.currentTarget.src = "https://placehold.co/600x400/1a1a1a/cccccc?text=No+Image"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 bg-grid-white/[0.05]">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                )}

                {/* Image Count Badge */}
                {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 z-10 pointer-events-none">
                        <ImageIcon className="w-3 h-3" />
                        {project.images.length}
                    </div>
                )}

                {/* Desktop Overlay Actions - Using opacity for hover effect but pointer-events to manage clicks */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3 backdrop-blur-sm z-20 pointer-events-none group-hover:pointer-events-auto">
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onEdit(e); }} variant="secondary" icon={<Edit2 size={14} />}>
                        Edit
                    </NeonButton>
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onDelete(e); }} variant="danger" icon={<Trash2 size={14} />} />
                </div>

                {/* Mobile: Always visible edit icons */}
                <div className="absolute top-2 right-2 flex gap-2 md:hidden z-30">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg hover:bg-cyan-500/20 active:scale-95 transition-all"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-red-400 border border-white/10 shadow-lg hover:bg-red-500/20 active:scale-95 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {project.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.3)] z-10 pointer-events-none">
                        <Star className="w-3 h-3 fill-yellow-200" /> Featured
                    </div>
                )}
            </div>

            {/* Content - Clickable to edit */}
            <div className="p-4 md:p-5 flex-1 flex flex-col space-y-3 md:space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/50 cursor-pointer" onClick={onEdit}>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-500/5 shrink-0">
                        {project.category}
                    </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[10px] text-gray-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded transition-colors hover:bg-white/10 hover:text-white">
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span className="text-[10px] text-gray-500 px-1 py-0.5">+ {project.technologies.length - 4}</span>
                    )}
                </div>

                <div className="mt-auto pt-3 md:pt-4 flex gap-4 text-gray-400 border-t border-white/5">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs hover:text-cyan-400 transition-colors z-20">
                            <Globe className="w-3 h-3" /> Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs hover:text-purple-400 transition-colors z-20">
                            <Github className="w-3 h-3" /> Code
                        </a>
                    )}
                    {project.status && (
                        <span className="ml-auto text-[10px] text-gray-500 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                            {project.status}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
