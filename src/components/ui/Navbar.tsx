"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogs } from "@/lib/data";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs", dropdown: true },
    { name: "Review Blog", href: "#" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    const recentBlogs = [...blogs]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    });

    useEffect(() => {
        setIsOpen(false);
        setShowDropdown(false);
    }, [pathname]);

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border py-4"
                    : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all duration-300">
                        NovaBlog
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => link.dropdown && setShowDropdown(true)}
                            onMouseLeave={() => link.dropdown && setShowDropdown(false)}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary py-2",
                                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown className={cn("w-4 h-4 transition-transform", showDropdown && "rotate-180")} />}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-[24px] left-0 right-0 h-[2px] bg-primary"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            {link.dropdown && (
                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-[300px] bg-card border border-border rounded-2xl shadow-2xl p-4 mt-2 overflow-hidden"
                                        >
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                                                Latest Stories
                                            </div>
                                            <div className="space-y-1">
                                                {recentBlogs.map((blog) => (
                                                    <Link
                                                        key={blog.id}
                                                        href={`/blogs/${blog.id}`}
                                                        className="block p-2 rounded-xl hover:bg-primary/5 transition-colors group/item"
                                                    >
                                                        <p className="text-sm font-bold line-clamp-1 group-hover/item:text-primary transition-colors">
                                                            {blog.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 rounded text-primary font-medium">
                                                                {blog.category}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {blog.date}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <Link
                                                    href="/blogs"
                                                    className="block w-full text-center py-2 bg-secondary/50 hover:bg-secondary rounded-xl text-xs font-bold transition-colors"
                                                >
                                                    View All 50 Posts
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Subscribe
                    </motion.button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b border-border bg-background/95 backdrop-blur-md overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-lg font-medium py-2 transition-colors",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-border my-2" />
                            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
