"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Trash2, Pencil } from "lucide-react";
import { Blog } from "@/lib/data";
import { deleteBlog } from "@/lib/actions";
import { useState } from "react";

interface BlogCardProps {
    blog: Blog;
    index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper to check if it's a mock blog
    const isMock = blog.id.length <= 2 && !isNaN(Number(blog.id));

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
            setIsDeleting(true);
            const result = await deleteBlog(blog.id);
            if (result.error) {
                alert(result.error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-primary/10 transition-shadow duration-300 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary border border-primary/20">
                    {blog.category}
                </div>

                {!isMock && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <Link href={`/edit-blog/${blog.id}`}>
                            <button
                                className="p-2 bg-primary/10 hover:bg-primary/20 text-primary backdrop-blur-sm rounded-xl border border-primary/20 transition-all group/edit"
                                title="Edit Story"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 backdrop-blur-sm rounded-xl border border-red-500/20 transition-all group/delete"
                            title="Delete Story"
                        >
                            <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                    {blog.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {(Array.isArray(blog.tags) ? blog.tags : (blog.tags as string).split(",")).slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted rounded text-muted-foreground">
                            {tag.trim()}
                        </span>
                    ))}
                </div>

                <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </motion.div>
    );
}
