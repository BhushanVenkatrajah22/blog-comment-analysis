"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NovaParticles() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#020202]">
            {/* Mesh Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full animate-pulse decoration-3000" />

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl"
                    initial={{
                        width: Math.random() * 300 + 50,
                        height: Math.random() * 300 + 50,
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0,
                    }}
                    animate={{
                        x: [
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                        ],
                        y: [
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                            Math.random() * 100 + "%",
                        ],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
