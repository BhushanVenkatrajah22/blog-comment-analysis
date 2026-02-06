"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/ui/BlogCard";
import { blogs } from "@/lib/data";

export default function BlogsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                    Our Latest Insights
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Thoughts, tutorials, and stories from the NovaBlog team.
                </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                    <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
            </div>
        </div>
    );
}
