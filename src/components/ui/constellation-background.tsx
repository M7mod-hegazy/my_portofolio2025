"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface ConstellationBackgroundProps {
    color?: string;
    particleCount?: number;
    connectionDistance?: number;
}

export const ConstellationBackground = ({
    color = "#c5a059", // Default gold/ochre
    particleCount = 80,
    connectionDistance = 150,
}: ConstellationBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = container.offsetWidth;
        let height = container.offsetHeight;
        let particles: Particle[] = [];
        let animationFrameId: number;

        // Handle resize
        const handleResize = () => {
            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Particle Class
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Adjust count based on screen size
            const count = width < 768 ? particleCount / 2 : particleCount;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            connectParticles();

            animationFrameId = requestAnimationFrame(animate);
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = filterHex(color, opacity * 0.5); // Convert hex to rgba
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Helper to convert hex to rgba
        const filterHex = (hex: string, alpha: number) => {
            let r = 0, g = 0, b = 0;
            // 3 digits
            if (hex.length === 4) {
                r = parseInt("0x" + hex[1] + hex[1]);
                g = parseInt("0x" + hex[2] + hex[2]);
                b = parseInt("0x" + hex[3] + hex[3]);
            }
            // 6 digits
            else if (hex.length === 7) {
                r = parseInt("0x" + hex[1] + hex[2]);
                g = parseInt("0x" + hex[3] + hex[4]);
                b = parseInt("0x" + hex[5] + hex[6]);
            }
            return `rgba(${r},${g},${b},${alpha})`;
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, particleCount, connectionDistance]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="block" />
        </div>
    );
};
