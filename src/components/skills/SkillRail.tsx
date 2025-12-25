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

export const SkillRail = ({ category, skills }: SkillRailProps) => {
    // 1. Ensure we have enough items to fill a reasonable screen width
    // If we have few items, repeat them until we have at least 10
    let baseList = [...skills];
    while (baseList.length < 10) {
        baseList = [...baseList, ...skills];
    }

    // 2. Render TWO exact copies of this base list.
    // The CSS animation translates -50%.
    // This moves Set 1 completely out of view, landing exactly on the start of Set 2.
    // Since Set 2 is identical to Set 1, the loop is seamless.
    const displaySkills = [...baseList, ...baseList];

    return (
        <div className="w-full relative overflow-hidden group">
            {/* GRADIENT FADE EDGES */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10 pointer-events-none" />

            {/* THE RAIL TRACK */}
            <div className="flex py-6 relative z-20">
                <div
                    className="flex gap-4 animate-marquee pause-on-hover px-4"
                    style={{ animationDuration: `${Math.max(40, baseList.length * 6)}s` }} // Auto-adjust speed based on content length
                >
                    {displaySkills.map((skill, index) => (
                        <div
                            key={`${skill._id}-${index}`}
                            className="flex-shrink-0 w-[240px]" // Fixed width for consistency
                        >
                            <SkillCard skill={skill} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
