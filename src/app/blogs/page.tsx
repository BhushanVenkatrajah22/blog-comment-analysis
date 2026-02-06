"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import BlogCard from "@/components/ui/BlogCard";
import { blogs } from "@/lib/data";
import { Suspense } from "react";

function BlogsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryFilter = searchParams.get("category");

    const filteredBlogs = categoryFilter
        ? blogs.filter(blog => blog.category.toLowerCase() === categoryFilter.toLowerCase())
        : blogs;

    const sortedBlogs = [...filteredBlogs].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="container mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-16"
            >
                <div className="inline-block mb-4 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                    {categoryFilter ? `Category: ${categoryFilter}` : "The Journal"}
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 leading-tight">
                    {categoryFilter ? categoryFilter : "Latest"} <br /> {categoryFilter ? "Collection." : "Insights."}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    {categoryFilter
                        ? `Exploring the latest trends and deep dives in ${categoryFilter}.`
                        : "Exploring the intersection of design, technology, and strategy. Deep dives into the future of digital experiences."}
                </p>
                {categoryFilter && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => router.push("/blogs")}
                        className="mt-6 text-sm font-bold text-primary hover:underline flex items-center gap-2"
                    >
                        Clear Filter
                    </motion.button>
                )}
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {sortedBlogs.map((blog, index) => (
                    <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
            </div>
            {sortedBlogs.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-2xl font-bold text-muted-foreground">No blogs found in this category.</p>
                </div>
            )}
        </div>
    );
}

export default function BlogsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] rounded-full" />
            </div>

            <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Loading...</div>}>
                <BlogsContent />
            </Suspense>
        </div>
    );
}
