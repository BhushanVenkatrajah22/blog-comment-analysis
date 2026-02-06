"use client";

import { useState } from "react";
import { User, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "@/lib/data";
import { cn } from "@/lib/utils";

interface BlogCommentsProps {
    initialComments: Comment[];
}

export default function BlogComments({ initialComments }: BlogCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(
        // Sort initial comments newest-first if not already
        [...initialComments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const now = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${String(now.getFullYear()).slice(-2)}`;

        const comment: Comment = {
            id: `new-${Date.now()}`,
            author: "You (Guest)",
            content: newComment,
            date: dateStr,
        };

        // Add to the START of the array (newest first)
        setComments(prev => [comment, ...prev]);
        setNewComment("");
        setIsSubmitting(false);
    };

    return (
        <div className="mt-16 pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-bold tracking-tight">Discussion ({comments.length})</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <MessageSquare className="w-4 h-4" /> Newest First
                </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-16">
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 focus-within:border-primary/50 transition-all">
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts on this exploration?"
                                className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground pt-2 min-h-[100px]"
                            />
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground italic">
                                    Markdown is supported. Be respectful.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSubmitting || !newComment.trim()}
                                    className={cn(
                                        "px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2",
                                        (isSubmitting || !newComment.trim()) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Post Comment
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className="space-y-12">
                <AnimatePresence initial={false}>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                                    <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-foreground">{comment.author}</h5>
                                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                                    </div>
                                    <p className="text-foreground/70 leading-relaxed text-sm">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Reply</button>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Share</button>
                                    </div>
                                </div>
                            </div>
                            {/* Sub-line for visual hierarchy */}
                            <div className="absolute left-6 top-16 bottom-0 w-px bg-border group-last:hidden h-8" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
