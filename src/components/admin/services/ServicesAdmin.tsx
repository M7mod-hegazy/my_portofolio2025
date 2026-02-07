import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Layers, Plus, Save, Trash2, Loader2, X, ChevronRight, Search,
    ArrowRight, Sparkles, CheckCircle2
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ServiceDB {
    _id?: string;
    title: string;
    description: string;
    icon: string;
}

// Popular service icons
const ICON_CATEGORIES = {
    "Development": ["Code", "Terminal", "Laptop", "Monitor", "Smartphone", "Globe", "Server", "Database", "Cloud", "Cpu"],
    "Design": ["Palette", "PenTool", "Figma", "Layout", "Image", "Layers", "Brush", "Sparkles", "Wand2", "Eye"],
    "Business": ["Briefcase", "TrendingUp", "BarChart3", "PieChart", "Target", "Rocket", "Zap", "Award", "Star", "Crown"],
    "Media": ["Video", "Camera", "Music", "Mic", "Play", "Film", "Radio", "Headphones", "Volume2", "Podcast"],
};

const emptyService: ServiceDB = { title: "", description: "", icon: "Code" };

export const ServicesAdmin = () => {
    const [services, setServices] = useState<ServiceDB[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [iconSearch, setIconSearch] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const json = await res.json();
            if (json.success) {
                setServices(json.data || []);
            }
        } catch (err) {
            toast.error("Failed to fetch services");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedService) return;
        if (!selectedService.title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            const isNew = !selectedService._id;
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? '/api/services' : `/api/services/${selectedService._id}`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: selectedService.title,
                    description: selectedService.description,
                    icon: selectedService.icon,
                })
            });
            const json = await res.json();

            if (json.success) {
                toast.success(isNew ? "Service created" : "Service updated");
                await fetchServices();
                if (isNew) {
                    setSelectedService(json.data);
                }
            } else {
                toast.error(json.error || "Failed to save");
            }
        } catch (err) {
            toast.error("Error saving service");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedService?._id) return;
        if (!confirm("Delete this service?")) return;

        try {
            await fetch(`/api/services/${selectedService._id}`, { method: 'DELETE' });
            toast.success("Service deleted");
            setServices(prev => prev.filter(s => s._id !== selectedService._id));
            setSelectedService(null);
        } catch (err) {
            toast.error("Error deleting service");
        }
    };

    const handleNew = () => {
        setSelectedService({ ...emptyService });
    };

    const handleSelect = (service: ServiceDB) => {
        setSelectedService({ ...service });
    };

    const updateField = (field: keyof ServiceDB, value: string) => {
        if (!selectedService) return;
        setSelectedService({ ...selectedService, [field]: value });
    };

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get all icons matching search
    const getAllIcons = () => {
        const allIcons: string[] = [];
        Object.values(ICON_CATEGORIES).forEach(icons => allIcons.push(...icons));
        if (!iconSearch) return allIcons;
        return allIcons.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase()));
    };

    const renderIcon = (iconName: string, size: number = 20) => {
        // @ts-ignore
        const IconComp = LucideIcons[iconName] || LucideIcons.Zap;
        return <IconComp size={size} />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Left: Services List */}
            <GlassPanel className="lg:col-span-4 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Layers size={18} className="text-purple-400" />
                            Services
                            <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                                {services.length}
                            </span>
                        </h3>
                        <NeonButton size="sm" onClick={handleNew}>
                            <Plus size={14} className="mr-1" /> New
                        </NeonButton>
                    </div>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredServices.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <Layers size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No services yet</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredServices.map(service => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onClick={() => handleSelect(service)}
                                    className={cn(
                                        "p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5",
                                        selectedService?._id === service._id ? "bg-purple-500/10 border-l-2 border-l-purple-500" : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                            {renderIcon(service.icon, 20)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white truncate">{service.title}</h4>
                                            <p className="text-xs text-gray-500 truncate">{service.description}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-600 shrink-0" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </GlassPanel>

            {/* Center: Edit Form */}
            <GlassPanel className="lg:col-span-4 flex flex-col overflow-hidden">
                {selectedService ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold text-white">
                                {selectedService._id ? "Edit Service" : "New Service"}
                            </h3>
                            <div className="flex gap-2">
                                <NeonButton
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600"
                                >
                                    {isSaving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                                    Save
                                </NeonButton>
                                {selectedService._id && (
                                    <NeonButton size="sm" variant="ghost" onClick={handleDelete} className="text-red-400 hover:bg-red-500/20">
                                        <Trash2 size={14} />
                                    </NeonButton>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Title */}
                            <div>
                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Service Title</Label>
                                <Input
                                    value={selectedService.title}
                                    onChange={e => updateField('title', e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="bg-black/30 border-white/10 text-white"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Description</Label>
                                <Textarea
                                    value={selectedService.description}
                                    onChange={e => updateField('description', e.target.value)}
                                    placeholder="Brief description of the service..."
                                    className="bg-black/30 border-white/10 text-white min-h-[120px]"
                                />
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Icon</Label>
                                <div className="relative mb-3">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search icons..."
                                        value={iconSearch}
                                        onChange={e => setIconSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/10">
                                    {getAllIcons().map(icon => (
                                        <motion.button
                                            key={icon}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateField('icon', icon)}
                                            className={cn(
                                                "p-2 rounded-lg border transition-all flex items-center justify-center",
                                                selectedService.icon === icon
                                                    ? "bg-purple-500/30 border-purple-500 text-purple-300"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                            )}
                                            title={icon}
                                        >
                                            {renderIcon(icon, 18)}
                                        </motion.button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Selected: <span className="text-purple-400">{selectedService.icon}</span>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-6">
                        <div>
                            <Layers size={50} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-500 mb-4">Select a service to edit or create a new one</p>
                            <NeonButton onClick={handleNew}>
                                <Plus size={16} className="mr-2" /> Create Service
                            </NeonButton>
                        </div>
                    </div>
                )}
            </GlassPanel>

            {/* Right: Preview */}
            <GlassPanel className="lg:col-span-4 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold text-white">Preview</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {selectedService ? (
                        <div className="space-y-6">
                            {/* Card Preview */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center mb-5 shadow-lg">
                                    {renderIcon(selectedService.icon, 28)}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">
                                    {selectedService.title || "Service Title"}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    {selectedService.description || "Service description goes here..."}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                                    <span>Learn more</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>

                            {/* Expanded Preview */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shrink-0">
                                        {renderIcon(selectedService.icon, 32)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {selectedService.title || "Service Title"}
                                        </h3>
                                        <div className="flex items-center gap-2 text-purple-400 text-sm">
                                            <Sparkles size={14} />
                                            <span>Premium quality guaranteed</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {selectedService.description || "Service description..."}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Custom Solutions", "Modern Tech", "Fast Delivery", "24/7 Support"].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                            <CheckCircle2 size={12} className="text-purple-400" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                            <p>Select a service to see preview</p>
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
