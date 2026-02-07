import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillCard } from "./SkillCard";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { SkillRail } from "./SkillRail";

interface Skill {
    _id: string;
    name: string;
    category: string;
    level: string;
    icon: string;
}

export const SkillDeck = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills');
            const json = await res.json();
            if (json.success) {
                setSkills(json.data);
            }
        } catch (err) {
            console.error("Failed to fetch skills", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Smart Sorting Logic
    const categoryPriority: Record<string, number> = {
        "Frontend": 1,
        "Backend": 2,
        "Mobile": 3,
        "Tools": 4,
        "Other": 5
    };

    const levelPriority: Record<string, number> = {
        "Expert": 1,
        "Advanced": 2,
        "Intermediate": 3,
        "Beginner": 4
    };

    const sortedSkills = [...skills].sort((a, b) => {
        // Sort by Category Priority
        const catA = categoryPriority[a.category] || 99;
        const catB = categoryPriority[b.category] || 99;
        if (catA !== catB) return catA - catB;

        // Sort by Level Priority (Highest first)
        const levA = levelPriority[a.level] || 99;
        const levB = levelPriority[b.level] || 99;
        return levA - levB;
    });

    // 2. Filter Logic (Search only, category handled by sections)
    const filteredSkills = sortedSkills;
    // .filter(skill => {
    //     // We only filter by search here, category filtering happens in the render loop or we show all sectors if "All" is selected
    //     return skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    // });

    // 3. Dynamic Grouping
    // Get unique categories from data
    const uniqueCategories = Array.from(new Set(filteredSkills.map(s => s.category)));

    // Sort categories (Known priority first, then others)
    const sortedCategories = uniqueCategories.sort((a, b) => {
        const priorityA = categoryPriority[a] || 99;
        const priorityB = categoryPriority[b] || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return a.localeCompare(b);
    });

    // Group skills by these sorted categories
    const groupedSkills: Record<string, Skill[]> = {};
    sortedCategories.forEach(cat => {
        groupedSkills[cat] = filteredSkills.filter(s => s.category === cat);
    });

    // 4. Mobile State
    const [activeMobileCategory, setActiveMobileCategory] = useState("All");

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center">

            {/* MOBILE VIEW (Tactical Data Grid) */}
            <div className="md:hidden w-full max-w-sm mx-auto pb-32">
                {/* 1. System Header */}
                <div className="flex items-center justify-between mb-6 px-1 border-b border-white/10 pb-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-cyan-500 font-bold tracking-widest uppercase">
                            // SYSTEM.ARSENAL
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">
                            MO.V.2.0.4 :: ONLINE
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-cyan-500/50 rounded-sm" />
                        <div className="w-1 h-3 bg-cyan-500/30 rounded-sm" />
                        <div className="w-1 h-3 bg-cyan-500/10 rounded-sm" />
                    </div>
                </div>

                {/* 2. Tactical Tabs (Sticky) */}
                <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl py-3 -mx-4 px-4 overflow-x-auto no-scrollbar border-b border-white/5 mb-6">
                    <div className="flex gap-2">
                        {["All", ...sortedCategories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveMobileCategory(cat)}
                                className={cn(
                                    "relative px-4 py-2 rounded-md text-[10px] font-mono font-bold whitespace-nowrap transition-all border uppercase tracking-wider",
                                    activeMobileCategory === cat
                                        ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                        : "bg-white/5 text-gray-500 border-white/5 hover:border-white/20"
                                )}
                            >
                                {cat}
                                {/* Active Indicator Dot */}
                                {activeMobileCategory === cat && (
                                    <span className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Skill Blades Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                        {filteredSkills
                            .filter(s => activeMobileCategory === "All" || s.category === activeMobileCategory)
                            .map((skill, index) => (
                                <motion.div
                                    layout
                                    key={skill._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group relative bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between min-h-[110px]"
                                >
                                    {/* Decoration Lines */}
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10 rounded-bl-lg" />

                                    <div className="p-3 flex flex-col h-full relative z-10">

                                        {/* Header: Icon & Tier */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-1.5 bg-white/5 rounded border border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-colors">
                                                <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
                                            </div>
                                            <span className="text-[8px] font-mono text-gray-600 bg-white/5 px-1 rounded uppercase">
                                                {skill.level.slice(0, 3)}
                                            </span>
                                        </div>

                                        {/* Content: Name */}
                                        <h4 className="text-white font-bold text-xs font-mono mb-auto leading-tight pr-2">
                                            {skill.name}
                                        </h4>

                                        {/* Footer: Tech Bar */}
                                        <div className="mt-3">
                                            <div className="flex justify-between text-[8px] text-gray-500 mb-1 font-mono">
                                                <span>PWR</span>
                                                <span className={cn(
                                                    skill.level === "Expert" ? "text-red-400" :
                                                        skill.level === "Advanced" ? "text-amber-400" : "text-blue-400"
                                                )}>{
                                                        skill.level === "Expert" ? "98%" :
                                                            skill.level === "Advanced" ? "85%" : "60%"
                                                    }</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full",
                                                        skill.level === "Expert" ? "bg-red-500" :
                                                            skill.level === "Advanced" ? "bg-amber-500" : "bg-blue-500"
                                                    )}
                                                    style={{ width: skill.level === "Expert" ? "98%" : skill.level === "Advanced" ? "85%" : "60%" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover scan effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <p className="text-[9px] text-gray-600 font-mono">
                        // TOTAL MODULES LOADED: {filteredSkills.length}
                    </p>
                </div>
            </div>

            {/* DESKTOP VIEW (Terminal Style) */}
            <div className="hidden md:block w-full max-w-7xl relative pb-32 space-y-24">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredSkills.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No skills found in the Arsenal.
                    </div>
                ) : (
                    /* MASTER TERMINAL WINDOW */
                    <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl backdrop-blur-sm z-10 relative">

                        {/* TERMINAL HEADER (Sticky) */}
                        <div className="bg-[#1a1a1a] sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5 group/traffic">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition-all" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition-all" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition-all" />
                                </div>
                                <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                                        root@arsenal:~/skills
                                    </span>
                                </div>
                            </div>
                            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase hidden sm:block">
                                BASH // ZSH // V.1.0
                            </div>
                        </div>

                        {/* TERMINAL BODY (Scrollable Content) */}
                        <div className="relative bg-black/40 p-2 sm:p-6 space-y-12">
                            {/* Grid Line overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[side:40px_40px] pointer-events-none" />

                            {sortedCategories.map((category, index) => {
                                const skillsInCategory = groupedSkills[category];
                                if (!skillsInCategory || skillsInCategory.length === 0) return null;

                                return (
                                    <motion.div
                                        id={`sector-${category}`}
                                        key={category}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="relative z-10"
                                    >
                                        {/* CLI PROMPT HEADER */}
                                        <div className="flex flex-col gap-2 mb-4 font-mono text-sm">
                                            <div className="flex items-center gap-2 text-white/50">
                                                <span className="text-green-500">➜</span>
                                                <span className="text-blue-400">~/skills/{category.toLowerCase()}</span>
                                                <span className="text-white/30">$</span>
                                                <span className="text-white">./list-modules</span>
                                            </div>
                                            <div className="text-[10px] text-white/30 pl-6">
                                                {`> FOUND ${skillsInCategory.length} ACTIVE MODULES...`}
                                                <span className="animate-pulse">_</span>
                                            </div>
                                        </div>

                                        {/* RAIL OUTPUT */}
                                        <div className="pl-0 sm:pl-4 border-l-2 border-white/5 ml-1.5">
                                            <SkillRail category={category} skills={skillsInCategory} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* TERMINAL FOOTER PROMPT */}
                            <div className="pt-8 font-mono text-sm flex items-center gap-2 opacity-50">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~/skills</span>
                                <span className="text-white/30">$</span>
                                <span className="animate-pulse bg-white/50 w-2 h-4 block" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

