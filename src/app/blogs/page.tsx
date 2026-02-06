"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/ui/BlogCard";
import { blogs } from "@/lib/data";

export default function BlogsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-16"
                >
                    <div className="inline-block mb-4 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                        The Journal
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 leading-tight">
                        Latest <br /> Insights.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Exploring the intersection of design, technology, and strategy. Deep dives into the future of digital experiences.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((blog, index) => (
                            <BlogCard key={blog.id} blog={blog} index={index} />
                        ))}
                </div>
            </div>
        </div>
    );
}
