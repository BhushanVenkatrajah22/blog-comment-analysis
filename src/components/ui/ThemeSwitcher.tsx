"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: "midnight", name: "Midnight", icon: <Moon className="w-4 h-4" /> },
        { id: "paper", name: "Paper", icon: <Sun className="w-4 h-4" /> },
        { id: "cyber", name: "Cyber", icon: <Terminal className="w-4 h-4" /> },
    ] as const;

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border border-border"
                aria-label="Switch Theme"
            >
                {theme === "midnight" && <Moon className="w-5 h-5" />}
                {theme === "paper" && <Sun className="w-5 h-5" />}
                {theme === "cyber" && <Terminal className="w-5 h-5" />}
            </motion.button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 py-1 bg-popover border border-border rounded-xl shadow-xl z-50"
                    >
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center gap-3 w-full px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10",
                                    theme === t.id ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {t.icon}
                                {t.name}
                            </button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}
