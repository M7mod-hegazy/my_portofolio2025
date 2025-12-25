import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SkillDeck } from "@/components/skills/SkillDeck";

export const SkillsSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax for background
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const yBg = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section id="skills" ref={containerRef} className="py-24 relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20">

            {/* Cinematic Background */}
            <motion.div
                style={{ y: yBg }}
                className="absolute inset-0 pointer-events-none opacity-20"
            >
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px]" />
            </motion.div>

            <div className="container mx-auto px-6 relative z-10 w-full mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Arsenal</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                        A tactical overview of my technical capabilities. Click on any module to inspect detailed schematics.
                    </p>
                </motion.div>

                {/* The Nexus */}
                <SkillDeck />
            </div>
        </section>
    );
};
