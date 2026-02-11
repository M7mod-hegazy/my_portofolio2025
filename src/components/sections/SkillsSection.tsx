import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedFolder, SkillItem, SkillCategory } from "@/components/ui/3d-folder";
import { SkillDeck } from "@/components/skills/SkillDeck";
import { Loader2 } from "lucide-react";
import NeuralBackground from "@/components/ui/flow-field-background";

// Category gradients matching your portfolio style
const categoryGradients: Record<string, string> = {
    Frontend: "linear-gradient(135deg, #00d4ff 0%, #0072ff 100%)",
    Backend: "linear-gradient(135deg, #00c853 0%, #009688 100%)",
    Mobile: "linear-gradient(135deg, #ff6b35 0%, #f7931a 100%)",
    Tools: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
    Other: "linear-gradient(135deg, #607d8b 0%, #455a64 100%)",
    Database: "linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)",
    DevOps: "linear-gradient(135deg, #ff5722 0%, #f4511e 100%)",
    Design: "linear-gradient(135deg, #f50057 0%, #c51162 100%)",
};

// Category priority for ordering
const categoryPriority: Record<string, number> = {
    Frontend: 1,
    Backend: 2,
    Mobile: 3,
    Database: 4,
    DevOps: 5,
    Tools: 6,
    Design: 7,
    Other: 99,
};

interface SkillFromAPI {
    _id: string;
    name: string;
    category: string;
    level: string;
    icon: string;
}

export const SkillsSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [skills, setSkills] = useState<SkillFromAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/skills");
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

    // Group skills by category for mobile 3D folders
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            id: skill._id,
            name: skill.name,
            icon: skill.icon,
            level: skill.level,
        });
        return acc;
    }, {} as Record<string, SkillItem[]>);

    // Sort categories by priority
    const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
        const priorityA = categoryPriority[a] || 99;
        const priorityB = categoryPriority[b] || 99;
        return priorityA - priorityB;
    });

    // Build SkillCategory array
    const skillCategories: SkillCategory[] = sortedCategories.map((category) => ({
        title: category,
        gradient: categoryGradients[category] || categoryGradients.Other,
        skills: groupedSkills[category],
    }));

    return (
        <section
            id="skills"
            ref={containerRef}
            className="py-16 md:py-24 relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20"
        >
            {/* Cinematic Background - Flow Field */}
            <NeuralBackground
                color="#e11d48" // Rose-600 to match Arsenal theme
                trailOpacity={0.2} // Slightly more visible trails
                speed={0.7} // Slower, more tactical feel
                className="opacity-40" // Blends with the dark background
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10 w-full mb-16 md:mb-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tighter">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Arsenal</span>
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                        A tactical overview of my technical capabilities. Click on any module to inspect.
                    </p>
                </motion.div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* MOBILE: 3D Folder Grid (2 columns) */}
                        <div className="md:hidden grid grid-cols-2 gap-3 max-w-md mx-auto pb-24">
                            {skillCategories.map((category, index) => (
                                <motion.div
                                    key={category.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08, duration: 0.4 }}
                                    className="w-full"
                                >
                                    <AnimatedFolder
                                        title={category.title}
                                        skills={category.skills}
                                        gradient={category.gradient}
                                        className="w-full"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* DESKTOP: Original SkillDeck (Tactical Grid) */}
                        <div className="hidden md:block">
                            <SkillDeck />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};
