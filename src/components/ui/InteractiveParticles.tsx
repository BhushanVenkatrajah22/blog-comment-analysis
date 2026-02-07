"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

export default function InteractiveParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Particle settings based on theme
        let particleCount = theme === "cyber" ? 150 : 100;
        let connectionDistance = theme === "paper" ? 120 : 150;
        let mouseDistance = 200;

        const particles: Particle[] = [];

        // Helper to get color based on theme
        const getThemeColor = () => {
            if (theme === "cyber") return { r: 0, g: 255, b: 255 }; // Cyan
            if (theme === "paper") return { r: 50, g: 50, b: 50 }; // Dark Grey
            return { r: 120, g: 100, b: 255 }; // Purple/Blue (Midnight)
        };

        const color = getThemeColor();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const mouse = { x: 0, y: 0 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect particles
                for (let j = index; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    if (theme === 'cyber') {
                        // Repel
                        p.vx += forceDirectionX * force * 0.05;
                        p.vy += forceDirectionY * force * 0.05;
                    } else {
                        // Attract gently
                        p.vx -= forceDirectionX * force * 0.01;
                        p.vy -= forceDirectionY * force * 0.01;
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, [theme]);

    return (
        <div className="fixed inset-0 pointer-events-none -z-10">
            {theme === 'cyber' && <div className="absolute inset-0 bg-[image:var(--grid-pattern)] opacity-20" />}
            {theme === 'paper' && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-multiply" />}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
