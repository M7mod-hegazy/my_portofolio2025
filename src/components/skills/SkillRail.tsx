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
}

export const SkillRail = ({ category, skills, isMobile = false }: SkillRailProps & { isMobile?: boolean }) => {
    // 1. Ensure we have enough items to fill a reasonable screen width
    // If we have few items, repeat them until we have at least 10 (or 6 for mobile)
    let baseList = [...skills];
    const minItems = isMobile ? 6 : 10;
    while (baseList.length < minItems) {
        baseList = [...baseList, ...skills];
    }

    // 2. Render TWO exact copies of this base list.
    const displaySkills = [...baseList, ...baseList];

    return (
        <div className="w-full relative overflow-hidden group">
            {/* GRADIENT FADE EDGES */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10 pointer-events-none" />

            {/* THE RAIL TRACK */}
            <div className={cn("flex relative z-20", isMobile ? "py-3" : "py-6")}>
                <div
                    className="flex gap-3 md:gap-4 animate-marquee pause-on-hover px-4"
                    style={{ animationDuration: `${Math.max(isMobile ? 25 : 40, baseList.length * (isMobile ? 4 : 6))}s` }}
                >
                    {displaySkills.map((skill, index) => (
                        <div
                            key={`${skill._id}-${index}`}
                            className={cn("flex-shrink-0", isMobile ? "w-[160px]" : "w-[240px]")}
                        >
                            <SkillCard skill={skill} index={index} isMobile={isMobile} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
