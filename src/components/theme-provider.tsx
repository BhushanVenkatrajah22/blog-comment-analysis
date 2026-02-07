"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "midnight" | "paper" | "cyber";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("midnight");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem("nova-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply theme to document root
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        localStorage.setItem("nova-theme", theme);

        // cleanup pattern if needed, or handle body classes
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
