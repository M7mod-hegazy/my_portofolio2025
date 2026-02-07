import { useRef, useState, createElement, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { cn } from "@/lib/utils";
import { X, ExternalLink, Zap, Clock, GitBranch, ChevronRight, Star, Shield, Layout, Award } from "lucide-react";

interface SkillCardProps {
    skill: {
        _id: string;
        name: string;
        category: string;
        level: string;
        icon: string;
        projectIds?: Array<{ _id: string; title: string; category: string }>;
        certIds?: Array<{ _id: string; title: string; issuer: string }>;
    };
    index: number;
    isMobile?: boolean; // Added isMobile prop
}

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export const SkillCard = ({ skill, index, isMobile = false }: SkillCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Motion - Tilt (Reduced intensity on mobile)
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || isOpen || isMobile) return; // Disable tilt on mobile
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE / width - HALF_ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE / height - HALF_ROTATION_RANGE;
        x.set(mouseY * -1);
        y.set(mouseX);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    // Dynamic Icon Resolution (Lucide vs SimpleIcons vs URL)
    const renderIcon = () => {
        const isUrl = skill.icon.startsWith("http") || skill.icon.startsWith("/");
        if (isUrl) {
            // Check for SVG extension to apply color
            const isSvg = skill.icon.endsWith('.svg');
            return <img src={skill.icon} alt={skill.name} className={cn("object-contain transition-all duration-300", isMobile ? "w-6 h-6" : "w-8 h-8", hovered ? "scale-110" : "grayscale opacity-70")} />
        }

        const isSimpleIcon = skill.icon.startsWith("Si");
        let IconComponent: any;

        if (isSimpleIcon) {
            IconComponent = (SimpleIcons as any)[skill.icon] || SimpleIcons.SiReact;
        } else {
            const source = (LucideIcons as any).icons || LucideIcons;
            IconComponent = (skill.icon !== "Icon" && source[skill.icon]) || source.Box;
        }

        if (!IconComponent) return <LucideIcons.Box className={cn("text-gray-500", isMobile ? "w-6 h-6" : "w-8 h-8")} />;

        return (
            <IconComponent
                size={isMobile ? 24 : 32}
                className={cn(
                    "transition-all duration-300",
                    hovered ? theme.text : "text-gray-500 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                )}
            />
        );
    };

    const getCategoryTheme = (cat: string) => {
        switch (cat) {
            case "Frontend": return {
                border: "group-hover:border-cyan-500/50",
                text: "text-cyan-400",
                bg: "from-cyan-500/20 to-transparent",
                glow: "shadow-cyan-500/40",
                badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
            };
            case "Backend": return {
                border: "group-hover:border-red-500/50",
                text: "text-red-400",
                bg: "from-red-500/20 to-transparent",
                glow: "shadow-red-500/40",
                badge: "bg-red-500/10 text-red-300 border-red-500/20"
            };
            case "Tools": return {
                border: "group-hover:border-amber-500/50",
                text: "text-amber-400",
                bg: "from-amber-500/20 to-transparent",
                glow: "shadow-amber-500/40",
                badge: "bg-amber-500/10 text-amber-300 border-amber-500/20"
            };
            case "Mobile": return {
                border: "group-hover:border-purple-500/50",
                text: "text-purple-400",
                bg: "from-purple-500/20 to-transparent",
                glow: "shadow-purple-500/40",
                badge: "bg-purple-500/10 text-purple-300 border-purple-500/20"
            };
            case "DevOps": return {
                border: "group-hover:border-green-500/50",
                text: "text-green-400",
                bg: "from-green-500/20 to-transparent",
                glow: "shadow-green-500/40",
                badge: "bg-green-500/10 text-green-300 border-green-500/20"
            };
            case "Data": return {
                border: "group-hover:border-blue-500/50",
                text: "text-blue-400",
                bg: "from-blue-500/20 to-transparent",
                glow: "shadow-blue-500/40",
                badge: "bg-blue-500/10 text-blue-300 border-blue-500/20"
            };
            default: return {
                border: "group-hover:border-slate-500/50",
                text: "text-slate-400",
                bg: "from-slate-500/20 to-transparent",
                glow: "shadow-slate-500/40",
                badge: "bg-slate-500/10 text-slate-300 border-slate-500/20"
            };
        }
    };
    const theme = getCategoryTheme(skill.category);

    const masteryLevel = skill.level === "Expert" ? 95 : skill.level === "Advanced" ? 85 : skill.level === "Intermediate" ? 65 : 40;

    // Scroll Animation Variants (Staggered "One by One")
    const cardVariants = {
        hidden: { opacity: 1, y: 0, scale: 1 }, // FORCED VISIBLE for Rail Compatibility
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: 0, // No delay in rail
                duration: 0.5,
                type: "spring" as const,
                bounce: 0.4
            }
        }),
        exit: { opacity: 1, scale: 1 } // No exit animation
    };

    return (
        <>
            {/* CARD TRIGGER */}
            <motion.div
                ref={ref}
                onClick={() => setIsOpen(true)}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d", transform: isMobile ? 'none' : transform }} // Disable tilt transform on mobile
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setHovered(true)}
                className={cn("relative w-full cursor-pointer z-0 group", isMobile ? "h-[100px]" : "h-[120px]")}
            >
                <div
                    className={cn(
                        "relative h-full w-full overflow-hidden rounded-lg border bg-[#0f0f0f] transition-all duration-300 flex items-center p-4 gap-4",
                        "border-white/5 hover:bg-[#161616]",
                        theme.border, // Apply colored border on hover via theme
                        hovered && "shadow-lg shadow-white/5"
                    )}
                >
                    {/* ACTIVE INDICATOR STRIP */}
                    <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                        hovered ? cn("shadow-[0_0_10px_rgba(255,255,255,0.2)]", theme.text.replace('text-', 'bg-')) : "bg-white/10"
                    )} />

                    {/* PROCESS ICON */}
                    <div className={cn(
                        "relative shrink-0 w-14 h-14 flex items-center justify-center rounded bg-[#0a0a0a] border border-white/5 group-hover:scale-105 transition-all duration-300",
                        hovered && theme.border, // Border color on hover
                        hovered && theme.glow.replace('shadow-', 'shadow-lg border-') // Glow
                    )}>
                        {renderIcon()}
                    </div>

                    {/* PROCESS DETAILS */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-mono text-sm font-bold text-gray-200 group-hover:text-white truncate">
                                    {skill.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn("text-[8px] font-mono px-1 rounded bg-white/5 text-gray-500 uppercase", theme.text)}>
                                        PID: {1000 + index * 42}
                                    </span>
                                    <span className="text-[8px] font-mono text-gray-600">
                                        {hovered ? "RUNNING" : "SLEEP"}
                                    </span>
                                </div>
                            </div>
                            <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 group-hover:text-white/70 transition-colors uppercase", theme.text)}>
                                .{skill.category.substring(0, 3).toLowerCase()}
                            </span>
                        </div>

                        {/* LIVE METRICS (REAL DATA) */}
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex justify-between text-[8px] font-mono text-gray-500">
                                    <span>MASTERY</span>
                                    <span>{masteryLevel}%</span>
                                </div>
                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-500", hovered ? "bg-green-500" : "bg-gray-600")}
                                        style={{ width: `${masteryLevel}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex justify-between text-[8px] font-mono text-gray-500">
                                    <span>LEVEL</span>
                                    <span className="uppercase text-[8px]">{skill.level.slice(0, 3)}</span>
                                </div>
                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-500", hovered ? theme.bg.replace("from-", "bg-").replace("/20", "") : "bg-gray-600")}
                                        style={{ width: `${skill.level === "Expert" ? 100 : skill.level === "Advanced" ? 75 : 50}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* DETACHED MAN PAGE MODAL (Fixed Overlay via Portal) */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            {/* BACKDROP */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            {/* MAN PAGE TERMINAL */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                {/* TITLE BAR */}
                                <div className="h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-3">
                                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <span className="ml-2">man {skill.name.toLowerCase()}</span>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* CONTENT */}
                                <div className="p-6 overflow-y-auto font-mono text-sm text-gray-300 space-y-6 custom-scrollbar">
                                    {/* HEADER SECTION */}
                                    <div className="flex gap-6 items-start">
                                        <div className={cn(
                                            "w-24 h-24 shrink-0 rounded bg-black border border-white/10 flex items-center justify-center",
                                            theme.border
                                        )}>
                                            {(() => {
                                                const isUrl = skill.icon.startsWith("http") || skill.icon.startsWith("/");
                                                if (isUrl) {
                                                    return <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain" />
                                                }
                                                const isSimpleIcon = skill.icon.startsWith("Si");
                                                let IconComponent: any;
                                                if (isSimpleIcon) {
                                                    IconComponent = (SimpleIcons as any)[skill.icon] || SimpleIcons.SiReact;
                                                } else {
                                                    const source = (LucideIcons as any).icons || LucideIcons;
                                                    IconComponent = (skill.icon !== "Icon" && source[skill.icon]) || source.Box;
                                                }
                                                if (!IconComponent) return <LucideIcons.Box size={48} className="text-gray-500" />;
                                                return <IconComponent size={48} className={theme.text} />;
                                            })()}
                                        </div>
                                        <div className="space-y-2">
                                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                                {skill.name}
                                                <span className="text-gray-600 ml-2 text-base font-normal">({skill.level})</span>
                                            </h1>
                                            <div className="flex gap-2 text-xs">
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Category: {skill.category}</span>
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">v{1 + (index * 0.1).toFixed(1)}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {(skill.projectIds && skill.projectIds.length > 0) && (
                                                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                                        <Layout size={10} />
                                                        {skill.projectIds.length} Linked Projects
                                                    </div>
                                                )}
                                                {(skill.certIds && skill.certIds.length > 0) && (
                                                    <div className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                        <Award size={10} />
                                                        {skill.certIds.length} Verified Certs
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-500 leading-relaxed text-xs max-w-md pt-2">
                                                Primary execution module for {skill.category} operations.
                                                High-availability configuration with optimized runtime parameters.
                                            </p>
                                        </div>
                                    </div>

                                    {/* DASHBOARD GRID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* REAL Proficiency Graph */}
                                        <div className="p-3 rounded border border-white/5 bg-white/[0.02]">
                                            <div className="text-[10px] text-gray-500 uppercase mb-2">Proficiency Buffer</div>
                                            <div className="flex items-end gap-2 h-16">
                                                {[...Array(10)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "w-full rounded-t-sm transition-all",
                                                            i < (masteryLevel / 10)
                                                                ? theme.text.replace('text-', 'bg-')
                                                                : "bg-white/5"
                                                        )}
                                                        style={{ height: i < (masteryLevel / 10) ? `${40 + Math.random() * 60}%` : "20%" }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-2 text-right font-mono text-xs text-white/70">
                                                {masteryLevel}% OPTIMIZED
                                            </div>
                                        </div>

                                        {/* REAL Stats */}
                                        <div className="p-3 rounded border border-white/5 bg-white/[0.02] space-y-2">
                                            <div className="text-[10px] text-gray-500 uppercase">System Stats</div>
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                                                <span>Uptime</span>
                                                <span className="text-white">99.9%</span>
                                            </div>
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                                                <span>Experience</span>
                                                <span className="text-white">{skill.level}</span>
                                            </div>
                                            <div className="flex justify-between text-xs pb-1">
                                                <span>Complexity</span>
                                                <span className="text-white">O(1)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NEURAL NETWORK (RELATIONS) */}
                                    {(skill.projectIds?.length || 0) > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-[10px] text-cyan-500 uppercase flex items-center gap-2 border-b border-white/5 pb-1">
                                                <Layout size={12} />
                                                <span>Deployed Instances (Projects)</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {skill.projectIds?.map(project => (
                                                    <div key={project._id} className="p-2 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-between group/p">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                                            <span className="text-xs text-gray-300 truncate">{project.title}</span>
                                                        </div>
                                                        <ExternalLink size={10} className="text-gray-600 group-hover/p:text-cyan-400 opacity-0 group-hover/p:opacity-100 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(skill.certIds?.length || 0) > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-[10px] text-purple-500 uppercase flex items-center gap-2 border-b border-white/5 pb-1">
                                                <Shield size={12} />
                                                <span>Security Clearance (Certificates)</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {skill.certIds?.map(cert => (
                                                    <div key={cert._id} className="p-2 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-between group/c">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <Award size={12} className="text-purple-500/50" />
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-xs text-gray-300 truncate">{cert.title}</span>
                                                                <span className="text-[9px] text-gray-600 truncate">{cert.issuer}</span>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={10} className="text-gray-600 group-hover/c:text-purple-400 opacity-0 group-hover/c:opacity-100 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* FOOTER LOGS */}
                                    <div className="space-y-1 pt-4 border-t border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase mb-2">Recent Execution Logs</div>
                                        <div className="font-mono text-[10px] text-gray-600 space-y-0.5">
                                            <div><span className="text-green-500">[SUCCESS]</span> Module {skill.name} initialized.</div>
                                            <div><span className="text-blue-500">[INFO]</span> Mastery Check: PASSED ({masteryLevel}%).</div>
                                            {skill.projectIds && skill.projectIds.length > 0 && (
                                                <div><span className="text-cyan-500">[NETWORK]</span> Linked to {skill.projectIds.length} active projects.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
