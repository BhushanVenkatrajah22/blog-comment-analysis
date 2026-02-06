"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Image as ImageIcon, Layout, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { updateBlog, getBlogById } from "@/lib/actions";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditBlogPage() {
    const { id } = useParams() as { id: string };
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            const blog = await getBlogById(id) as any;
            if (blog) {
                setTitle(blog.title);
                // Convert <p> tags back to newline if needed, or just keep as is.
                // Our createBlog stores it with <p> tags.
                // For simplicity, we'll strip markers if they exist or just let the user edit the raw content.
                // But createBlog does: .split("\n").map(p => p.trim() ? `<p>${p}</p>` : "").join("")
                // So let's try to reverse it for a better editing experience.
                const cleanContent = blog.content
                    .replace(/<p>/g, "")
                    .replace(/<\/p>/g, "\n")
                    .trim();
                setContent(cleanContent);
                setImage(blog.image);
            } else {
                setError("Blog not found.");
            }
            setIsLoading(false);
        };
        fetchBlog();
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setIsSaving(true);
        setError("");

        const result = await updateBlog(id, title, content, image);
        if (result.success) {
            router.push(`/blogs/${id}`);
            router.refresh();
        } else {
            setError(result.error || "Failed to update story");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link
                        href={`/blogs/${id}`}
                        className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Story
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                        REFINE YOUR <br /> STORY.
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium">
                        Make your changes below and publish the update.
                    </p>
                </motion.div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
                        {/* Title Input */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/80 ml-2">
                                <Layout className="w-4 h-4" /> Blog Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter a catchy title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                            />
                        </div>

                        {/* Image Upload Input */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/80 ml-2">
                                <ImageIcon className="w-4 h-4" /> Cover Photo
                            </label>

                            {!image ? (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group overflow-hidden relative">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-10 h-10 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <p className="mb-2 text-sm text-foreground font-bold tracking-tight">Click to upload photo</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">PNG, JPG or WebP</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImage(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            ) : (
                                <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        src={image}
                                        alt="Current Cover"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <button
                                            type="button"
                                            onClick={() => setImage("")}
                                            className="px-6 py-2 bg-red-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-xl"
                                        >
                                            Change Photo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Input */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/80 ml-2">
                                <FileText className="w-4 h-4" /> Story Content
                            </label>
                            <textarea
                                placeholder="Write your story here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-lg min-h-[400px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30 leading-relaxed resize-none"
                            />
                        </div>

                        {error && <p className="text-red-500 font-bold text-center animate-pulse">{error}</p>}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-2xl hover:bg-primary/90 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle className="w-8 h-8" />}
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-12 text-center text-muted-foreground/40 text-xs font-black uppercase tracking-[0.3em]">
                    Nova Intelligence Engine • Manual Override Active
                </div>
            </div>
        </div>
    );
}
