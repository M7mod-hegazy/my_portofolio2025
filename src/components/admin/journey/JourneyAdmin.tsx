import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Save, GraduationCap, Briefcase, Code, LayoutTemplate, ChevronUp, ChevronDown, GripVertical, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { IconPicker } from "../shared/IconPicker";
import { MultiSelect } from "../shared/MultiSelect";
import { cn } from "@/lib/utils";

interface JourneyItemDB {
    _id?: string;
    type: 'work' | 'education' | 'project';
    title: string;
    company: string;
    location: string;
    year: string;
    period: string;
    description: string;
    icon: string;
    color: string;
    technologies: string[];
    achievements: string[];
    order: number;
}

const PRESET_COLORS = [
    { name: "Cyan", value: "#06b6d4", class: "bg-cyan-500" },
    { name: "Purple", value: "#a855f7", class: "bg-purple-500" },
    { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
    { name: "Green", value: "#22c55e", class: "bg-green-500" },
    { name: "Orange", value: "#f97316", class: "bg-orange-500" },
    { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
    { name: "Crimson", value: "#ef4444", class: "bg-red-500" },
    { name: "Gold", value: "#eab308", class: "bg-yellow-500" },
];

export const JourneyAdmin = () => {
    const [items, setItems] = useState<JourneyItemDB[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [newAchievement, setNewAchievement] = useState("");

    const [formData, setFormData] = useState<JourneyItemDB>({
        type: 'work',
        title: "",
        company: "",
        location: "",
        year: "",
        period: "",
        description: "",
        icon: "Briefcase",
        color: "#06b6d4",
        technologies: [],
        achievements: [],
        order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [journeyRes, skillsRes] = await Promise.all([
                fetch('/api/journey'),
                fetch('/api/skills')
            ]);
            const journeyJson = await journeyRes.json();
            const skillsJson = await skillsRes.json();
            if (journeyJson.success) setItems(journeyJson.data);
            if (skillsJson.success) setSkills(skillsJson.data);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const method = selectedId ? 'PUT' : 'POST';
            const url = selectedId ? `/api/journey/${selectedId}` : '/api/journey';
            const { _id, ...payload } = formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(`Entry ${selectedId ? 'updated' : 'created'}`);
                fetchData();
                if (!selectedId) handleNew();
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving entry");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/journey/${id}`, { method: 'DELETE' });
            toast.success("Entry deleted");
            fetchData();
            if (selectedId === id) handleNew();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleSelect = (item: JourneyItemDB) => {
        setSelectedId(item._id || null);
        setFormData({
            ...item,
            technologies: item.technologies || [],
            achievements: item.achievements || [],
            icon: item.icon || (item.type === 'education' ? "GraduationCap" : "Briefcase"),
            color: item.color || "#06b6d4"
        });
    };

    const handleNew = () => {
        setSelectedId(null);
        setFormData({
            type: 'work',
            title: "",
            company: "",
            location: "",
            year: "",
            period: "",
            description: "",
            icon: "Briefcase",
            color: "#06b6d4",
            technologies: [],
            achievements: [],
            order: items.length
        });
    };

    // REORDER FUNCTIONS
    const moveItem = async (index: number, direction: 'up' | 'down') => {
        if (isReordering) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        setIsReordering(true);
        const newItems = [...items];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

        // Update local state for immediate feedback
        setItems(newItems);

        // Prepare reorder payload
        const reorderData = newItems.map((item, i) => ({ id: item._id, order: i }));

        try {
            const res = await fetch('/api/journey/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: reorderData })
            });
            const json = await res.json();
            if (!json.success) {
                toast.error("Failed to save order");
                fetchData(); // Revert
            }
        } catch (err) {
            toast.error("Failed to reorder");
            fetchData();
        } finally {
            setIsReordering(false);
        }
    };

    const addAchievement = () => {
        if (!newAchievement.trim()) return;
        setFormData(prev => ({
            ...prev,
            achievements: [...prev.achievements, newAchievement.trim()]
        }));
        setNewAchievement("");
    };

    const removeAchievement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index)
        }));
    };

    const renderIconPreview = (iconName: string) => {
        if (!iconName) return <LucideIcons.Briefcase className="w-5 h-5" />;
        const isUrl = iconName.startsWith("http") || iconName.startsWith("/");
        if (isUrl) return <img src={iconName} className="w-5 h-5 object-contain" alt="" />;
        const isSimple = iconName.startsWith("Si");
        const IconLib = isSimple ? SimpleIcons : LucideIcons;
        // @ts-ignore
        const IconComp = IconLib[iconName] || LucideIcons.Briefcase;
        return <IconComp className="w-5 h-5" />;
    };

    const getLabels = (type: string) => {
        if (type === 'education') return { title: "Degree / Certification", company: "University / Institution", tech: "Relevant Courses / Skills", achievements: "Honors / Activities", icon: "GraduationCap" };
        if (type === 'project') return { title: "Project Name", company: "Association / Client", tech: "Tech Stack", achievements: "Key Features", icon: "Code" };
        return { title: "Job Title", company: "Company Name", tech: "Technologies Used", achievements: "Key Achievements", icon: "Briefcase" };
    };

    const labels = getLabels(formData.type);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
            {/* List Column */}
            <GlassPanel className="flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <LayoutTemplate size={18} className="text-cyan-400" />
                        Timeline ({items.length})
                        {isReordering && <Loader2 size={14} className="animate-spin text-cyan-400" />}
                    </h3>
                    <NeonButton size="sm" onClick={handleNew} variant="secondary" icon={<Plus size={14} />}>
                        New Entry
                    </NeonButton>
                </div>

                {/* Order Instructions */}
                <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 text-xs text-cyan-400 flex items-center gap-2">
                    <GripVertical size={14} />
                    Use arrows to reorder timeline entries on the main page
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {items.length === 0 && (
                        <div className="text-center text-gray-500 py-10 italic">No entries yet. Start your journey!</div>
                    )}
                    {items.map((item, index) => (
                        <div
                            key={item._id}
                            className={cn(
                                "flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border relative group",
                                selectedId === item._id
                                    ? "bg-white/10 border-white/20 shadow-lg"
                                    : "bg-white/5 border-transparent hover:bg-white/10"
                            )}
                            style={{ borderColor: selectedId === item._id ? item.color : undefined }}
                        >
                            {/* Order Controls */}
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                                    disabled={index === 0 || isReordering}
                                    className={cn(
                                        "p-1 rounded transition-all",
                                        index === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20 text-gray-400 hover:text-white"
                                    )}
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                                    disabled={index === items.length - 1 || isReordering}
                                    className={cn(
                                        "p-1 rounded transition-all",
                                        index === items.length - 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20 text-gray-400 hover:text-white"
                                    )}
                                >
                                    <ChevronDown size={14} />
                                </button>
                            </div>

                            {/* Order Number */}
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                                {index + 1}
                            </div>

                            {/* Color Strip */}
                            <div
                                className="w-1 h-12 rounded-full transition-all"
                                style={{ backgroundColor: item.color }}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0" onClick={() => handleSelect(item)}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-black/40 shrink-0" style={{ color: item.color || '#06b6d4' }}>
                                        {renderIconPreview(item.icon || (item.type === 'education' ? 'GraduationCap' : item.type === 'project' ? 'Code' : 'Briefcase'))}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                                        <p className="text-xs text-gray-400 truncate">{item.company} • {item.year}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Type Badge */}
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border shrink-0",
                                item.type === 'education' ? "bg-purple-500/10 border-purple-500/20 text-purple-300" :
                                    item.type === 'work' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" :
                                        "bg-orange-500/10 border-orange-500/20 text-orange-300"
                            )}>
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>
            </GlassPanel>

            {/* Editor Column */}
            <GlassPanel className="p-0 h-full flex flex-col overflow-hidden relative">
                {/* Visual Preview Header */}
                <div className="relative h-32 overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 transition-colors duration-500" style={{ backgroundColor: formData.color }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a16]" />
                    <div className="absolute bottom-4 left-6 flex items-end gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center bg-black/50 border border-white/20 backdrop-blur-md shadow-2xl"
                            style={{ borderColor: formData.color, boxShadow: `0 0 30px ${formData.color}30` }}
                        >
                            <div style={{ color: formData.color }} className="scale-150">
                                {renderIconPreview(formData.icon)}
                            </div>
                        </div>
                        <div className="mb-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-1">
                                {selectedId ? "EDITING MODE" : "CREATION MODE"}
                            </span>
                            <h2 className="text-2xl font-bold text-white leading-none">
                                {formData.title || "Untitled Role"}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Controls Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Entry Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={v => setFormData({
                                    ...formData,
                                    type: v as any,
                                    icon: v === 'education' && formData.icon === 'Briefcase' ? 'GraduationCap' :
                                        v === 'work' && formData.icon === 'GraduationCap' ? 'Briefcase' : formData.icon
                                })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0a16] border-white/10 text-white">
                                    <SelectItem value="work"><div className="flex items-center gap-2"><Briefcase size={14} /> Work Experience</div></SelectItem>
                                    <SelectItem value="education"><div className="flex items-center gap-2"><GraduationCap size={14} /> Education</div></SelectItem>
                                    <SelectItem value="project"><div className="flex items-center gap-2"><Code size={14} /> Project / Other</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Timeline Year</Label>
                            <Input
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                className="bg-white/5 border-white/10 text-white font-mono"
                                placeholder="e.g. 2024"
                            />
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">{labels.title}</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-black/20 border-white/10 text-white text-lg font-bold h-12"
                                    placeholder={`Enter ${labels.title}...`}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">{labels.company}</Label>
                                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">Location / Duration</Label>
                                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="e.g. New York, NY" />
                            </div>
                        </div>
                    </div>

                    {/* Styling Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Visual Style</Label>
                            <span className="text-[10px] text-gray-500">{formData.color}</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-[140px]">
                                <IconPicker value={formData.icon} onChange={icon => setFormData({ ...formData, icon })} />
                            </div>
                            <div className="flex-1 flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                {PRESET_COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setFormData({ ...formData, color: c.value })}
                                        className={cn(
                                            "w-6 h-6 rounded-full transition-all relative flex items-center justify-center",
                                            c.class,
                                            formData.color === c.value ? "scale-110 border-2 border-white" : "opacity-40 hover:opacity-100"
                                        )}
                                        title={c.name}
                                    >
                                        {formData.color === c.value && <span className="text-black text-[10px] font-bold">✓</span>}
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <Input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-8 h-8 p-0 border-0 rounded-md overflow-hidden cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Rich Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">{labels.tech}</Label>
                            <MultiSelect
                                options={skills.map(s => ({ label: s.name, value: s.name, image: s.icon }))}
                                selected={formData.technologies}
                                onChange={(vals) => setFormData({ ...formData, technologies: vals })}
                                placeholder={`Select ${labels.tech.toLowerCase()}...`}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="bg-black/20 border-white/10 text-white min-h-[100px] text-sm leading-relaxed"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">{labels.achievements}</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newAchievement}
                                    onChange={(e) => setNewAchievement(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                                    className="bg-black/20 border-white/10 text-white"
                                    placeholder="Add detail..."
                                />
                                <NeonButton size="sm" onClick={addAchievement} icon={<Plus size={14} />}>Add</NeonButton>
                            </div>
                            <div className="space-y-1">
                                {formData.achievements.map((ach, i) => (
                                    <div key={i} className="group flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: formData.color }} />
                                        <span className="text-sm text-gray-400 flex-1">{ach}</span>
                                        <button onClick={() => removeAchievement(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a16] z-20 shrink-0">
                    <NeonButton onClick={handleSave} className="w-full text-lg font-bold" variant="primary" icon={isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}>
                        {isSaving ? "SAVING..." : selectedId ? "UPDATE MILESTONE" : "CREATE MILESTONE"}
                    </NeonButton>
                    {selectedId && (
                        <button onClick={() => handleDelete(selectedId)} className="w-full mt-2 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest hover:underline">
                            Delete Entry
                        </button>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
