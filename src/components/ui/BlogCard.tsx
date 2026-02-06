"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Blog } from "@/lib/data";

interface BlogCardProps {
    blog: Blog;
    index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
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
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary border border-primary/20">
                    {blog.category}
                </div>
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
                    {blog.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted rounded text-muted-foreground">
                            {tag}
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
