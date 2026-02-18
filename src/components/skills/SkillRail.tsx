import { useRef, useEffect, useState } from "react";
import { SkillCard } from "./SkillCard";
import { cn } from "@/lib/utils";

interface Skill {
    _id: string;
    name: string;
    category: string;
    level: string;
    icon: string;
}

interface SkillRailProps {
    category: string;
    skills: Skill[];
    isMobile?: boolean; // Add isMobile to the interface
}

export const SkillRail = ({ category, skills, isMobile = false }: SkillRailProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // 1. Ensure we have enough items for a loop
    let baseList = [...skills];
    const minItems = isMobile ? 6 : 10;
    while (baseList.length < minItems) {
        baseList = [...baseList, ...skills];
    }
    // Render enough copies to scroll smoothly for a while, then reset.
    // Simpler approach: Just duplicate it many times (e.g. 4x) to simulate infinite
    const displaySkills = [...baseList, ...baseList, ...baseList, ...baseList];

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let animationFrameId: number;

        const scroll = () => {
            if (!isPaused) {
                if (el.scrollLeft >= (el.scrollWidth / 2)) {
                    // Reset to near beginning (but invisible jump) if we went too far?
                    // With 4x duplication, we can wrap from 3x to 1x point.
                    el.scrollLeft = el.scrollWidth / 4;
                } else {
                    el.scrollLeft += 0.5; // Speed
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, displaySkills.length]);

    return (
        <div className="w-full relative overflow-hidden group border-y border-white/5 bg-[#050505]">
            {/* TERMINAL BACKGROUND GRID */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* HARD CUT FADE EDGES (No soft gradients) */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0c0c0c] z-10 border-r border-white/10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#0c0c0c] z-10 border-l border-white/10" />

            {/* SCANLINE EFFECT */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000000_3px)] opacity-20 pointer-events-none z-10" />

            {/* THE RAIL TRACK */}
            <div
                ref={scrollRef}
                className={cn(
                    "flex overflow-x-auto scrollbar-hide relative z-20",
                    isMobile ? "py-4 gap-3" : "py-8 gap-6"
                )}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => {
                    // Slight delay to resume after touch
                    setTimeout(() => setIsPaused(false), 1000);
                }}
            >
                <div className="flex gap-3 md:gap-6 px-4 min-w-max">
                    {displaySkills.map((skill, index) => (
                        <div
                            key={`${skill._id}-${index}`}
                            className={cn("flex-shrink-0 snap-center", isMobile ? "w-[160px]" : "w-[240px]")}
                        >
                            <SkillCard skill={skill} index={index} isMobile={isMobile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* STATUS BAR */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500/10 flex items-center justify-end px-2">
                <span className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">
                    {isPaused ? "STATUS: PAUSED" : "STATUS: SCROLLING"}
                </span>
            </div>
        </div>
    );
};
