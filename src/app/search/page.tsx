"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getAllBlogs } from "@/lib/actions";
import BlogCard from "@/components/ui/BlogCard";
import { Search, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilter = async () => {
            setIsLoading(true);
            const allBlogs = await getAllBlogs();
            const filtered = allBlogs.filter((blog: any) =>
                blog.title.toLowerCase().includes(query.toLowerCase()) ||
                blog.content.toLowerCase().includes(query.toLowerCase()) ||
                blog.category.toLowerCase().includes(query.toLowerCase())
            );
            setBlogs(filtered);
            setIsLoading(false);
        };
        fetchAndFilter();
    }, [query]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Scanning the archives...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                        SEARCH RESULTS
                    </h1>
                    <p className="text-muted-foreground">
                        Showing matches for <span className="text-primary font-bold">"{query}"</span>
                    </p>
                </div>
                <Link href="/blogs">
                    <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Explorations
                    </button>
                </Link>
            </div>

            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <BlogCard key={blog.id} blog={blog} index={index} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-6 bg-secondary/20 rounded-[3rem] border border-border text-center"
                >
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 uppercase">SORRY, THE BLOG YOU SEARCH IS NOT AVAILABLE</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        We couldn't find any matches for "{query}". Try different keywords or explore our trending topics.
                    </p>
                    <Link href="/blogs">
                        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                            Explore All Stories <Sparkles className="w-4 h-4" />
                        </button>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                </div>
            }>
                <SearchResults />
            </Suspense>
        </div>
    );
}
