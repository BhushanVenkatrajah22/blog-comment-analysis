"use client";

import { useState, useEffect } from "react";
import { User, Send, MessageSquare, Loader2, Smile, Frown, Meh, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { addComment } from "@/lib/actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams

interface BlogCommentsProps {
    blogId: string;
    initialComments: Comment[];
}

export default function BlogComments({ blogId, initialComments }: BlogCommentsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams(); // Added searchParams
    const categoryFilter = searchParams.get("category"); // Added categoryFilter
    const [comments, setComments] = useState<Comment[]>(
        [...initialComments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const userId = (session as any)?.user?.id || null;
            const result = await addComment(blogId, userId, newComment);

            if (result.success) {
                const now = new Date();
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${String(now.getFullYear()).slice(-2)}`;

                const comment: Comment = {
                    id: result.comment!.id,
                    author: session?.user?.name || "Guest",
                    content: newComment,
                    date: dateStr,
                    sentiment: (result.comment as any).sentiment || 'neutral',
                };

                setComments(prev => [comment, ...prev]);
                setNewComment("");
                router.refresh(); // Refresh server components
            } else {
                setError(result.error as string || "Failed to post comment.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 focus-within:border-primary/50 transition-all hover:shadow-primary/10">
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={`Hey ${session?.user?.name?.split(" ")[0] || "there"}, what are your thoughts?`}
                                className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground pt-2 min-h-[100px] text-lg"
                            />
                            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground italic">
                                    {session?.user ? `Signed in as ${session.user.email}` : "Posting as Guest"}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSubmitting || !newComment.trim()}
                                    className={cn(
                                        "px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2",
                                        (isSubmitting || !newComment.trim()) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
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
                    {categoryFilter && ( // Added categoryFilter check and button
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => router.push("/blogs")}
                            className="mt-6 text-sm font-bold text-primary hover:underline flex items-center gap-2"
                        >
                            Clear Filter
                        </motion.button>
                    )}
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border group-hover:border-primary/30 transition-colors overflow-hidden">
                                    <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h5 className="font-bold text-foreground group-hover:text-primary transition-colors">{comment.author}</h5>
                                            {comment.sentiment && (
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                                                    comment.sentiment === 'positive' && "bg-green-500/10 text-green-500 border border-green-500/20",
                                                    comment.sentiment === 'negative' && "bg-red-500/10 text-red-500 border border-red-500/20",
                                                    comment.sentiment === 'neutral' && "bg-muted text-muted-foreground border border-border"
                                                )}>
                                                    {comment.sentiment === 'positive' && <Smile className="w-3 h-3" />}
                                                    {comment.sentiment === 'negative' && <Frown className="w-3 h-3" />}
                                                    {comment.sentiment === 'neutral' && <Meh className="w-3 h-3" />}
                                                    {comment.sentiment}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                                    </div>
                                    <p className="text-foreground/70 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/10 transition-all">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                            Reply
                                        </button>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Share</button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute left-6 top-16 bottom-0 w-px bg-border group-last:hidden h-8" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
