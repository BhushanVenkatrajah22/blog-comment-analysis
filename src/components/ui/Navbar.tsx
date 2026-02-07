"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogs as mockBlogs } from "@/lib/data";
import { getRecentBlogs } from "@/lib/actions";
import { useSession, signOut } from "next-auth/react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import UserBadges from "@/components/ui/UserBadges";
import { getUserBadges } from "@/lib/gamification";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs", dropdown: true },
    { name: "Add Blog", href: "/add-blog" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dbRecentBlogs, setDbRecentBlogs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const { data: session, status } = useSession();
    const router = useRouter();
    const { scrollY } = useScroll();
    const pathname = usePathname();

    // Debugging useRouter
    useEffect(() => {
        if (!router) console.error("useRouter is null in Navbar");
    }, [router]);

    useEffect(() => {
        const fetchRecent = async () => {
            const result = await getRecentBlogs();
            if (result.success) {
                setDbRecentBlogs(result.blogs);
            }
        };
        fetchRecent();
    }, [pathname]); // Refresh when navigating

    useEffect(() => {
        const fetchBadges = async () => {
            if (session?.user?.id) {
                const { badges } = await getUserBadges(session.user.id);
                setUserBadges(badges);
            }
        };
        if (status === "authenticated") {
            fetchBadges();
        }
    }, [session, status, pathname]);

    const recentBlogs = [...dbRecentBlogs, ...mockBlogs]
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

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

                {/* Search Bar */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a story..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </form>
                </div>

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
                                                    View All {[...dbRecentBlogs, ...mockBlogs].length} Posts
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}

                    <div className="h-6 w-px bg-border mx-2" />

                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        {status === "authenticated" ? (
                            <div className="flex items-center gap-4">
                                <UserBadges badges={userBadges} />
                                <div className="flex flex-col items-end hidden lg:flex">
                                    <span className="text-xs font-bold leading-none">{session.user?.name}</span>
                                    <span className="text-[10px] text-muted-foreground">Resident</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => signOut()}
                                    className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm font-bold hover:bg-secondary/80 transition-colors"
                                >
                                    Sign Out
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <button className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">
                                        Log In
                                    </button>
                                </Link>
                                <Link href="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Join Community
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>
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
                            <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
