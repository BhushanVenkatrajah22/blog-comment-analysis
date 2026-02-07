import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, Pencil } from "lucide-react";
import { blogs as mockBlogs } from "@/lib/data";
import BlogCard from "@/components/ui/BlogCard";
import BlogComments from "@/components/ui/BlogComments";
import DeleteBlogButton from "@/components/ui/DeleteBlogButton";
import { getBlogById, getAllBlogs, getBlogSummary } from "@/lib/actions";
import ArticleChat from "@/components/ui/ArticleChat";
import { Sparkles } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { id } = await params;
    const blog = await getBlogById(id) as any;

    if (!blog) {
        notFound();
    }

    const allBlogs = await getAllBlogs();
    const relatedBlogs = allBlogs
        .filter((b) => b.id !== id && b.category === blog.category)
        .slice(0, 2);

    const summaryResult = await getBlogSummary(id, blog.content);
    const summary = summaryResult.success ? summaryResult.summary : null;

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[70vh] min-h-[500px] w-full">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 pb-20 pt-32 bg-gradient-to-t from-background to-transparent">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-sm font-medium text-white/80 hover:text-primary mb-8 transition-colors backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Explorations
                        </Link>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {blog.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white leading-[1.1] tracking-tight max-w-4xl drop-shadow-2xl">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-white/90">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-none">{blog.author}</p>
                                    <p className="text-xs opacity-70">{blog.authorRole}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20 hidden sm:block" />
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar className="w-4 h-4" />
                                <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{blog.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-6 max-w-7xl mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Left Sidebar / Meta */}
                <aside className="lg:col-span-3 lg:block hidden">
                    <div className="sticky top-32 space-y-12">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Share this story</h4>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <button key={i} className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                        <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Top Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag: string) => (
                                    <Link key={tag} href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors underline-offset-4 hover:underline">#{tag.trim()}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Article Body */}
                <div className="lg:col-span-6">
                    {summary && (
                        <div className="mb-12 p-8 bg-primary/5 border border-primary/20 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                Smart TL;DR
                            </h3>
                            <p className="text-xl font-medium text-foreground/90 leading-relaxed italic">
                                "{summary}"
                            </p>
                        </div>
                    )}

                    <div
                        className="prose prose-invert prose-primary max-w-none 
              prose-headings:font-extrabold prose-headings:tracking-tight
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:text-lg
              prose-pre:bg-card prose-pre:border prose-pre:border-border
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
              prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <div className="mt-16 pt-16 border-t border-border">
                        <div className="flex items-center gap-6 p-8 bg-card rounded-3xl border border-border relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border-2 border-primary/30">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">{blog.author}</h4>
                                <p className="text-primary text-sm font-semibold mb-3">{blog.authorRole}</p>
                                <p className="text-muted-foreground text-sm">Passionate about pushing the boundaries of technology and design. Sharing insights from years of experience in the industry.</p>
                            </div>
                        </div>
                    </div>

                    <BlogComments blogId={blog.id} initialComments={blog.comments} />
                </div>

                {/* Right / Newsletter / CTA */}
                <aside className="lg:col-span-3 space-y-12">
                    <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl" />
                        <h3 className="text-2xl font-bold mb-4 relative z-10">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm mb-6 relative z-10">Get the best of NovaBlog delivered to your inbox every week.</p>
                        <input type="email" placeholder="Email address" className="w-full bg-background border border-border px-4 py-3 rounded-xl mb-4 text-sm focus:border-primary outline-none transition-colors" />
                        <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Subscribe</button>
                    </div>

                    {/* Story Management for non-mock blogs */}
                    {!(blog.id.length <= 2 && !isNaN(Number(blog.id))) && (
                        <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 mt-8">
                            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Story Management</h4>
                            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Update your story or permanently remove it from the platform.</p>
                            <div className="flex flex-col gap-3">
                                <Link href={`/edit-blog/${blog.id}`}>
                                    <button className="w-full py-3 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2">
                                        <Pencil className="w-4 h-4" /> Edit Story
                                    </button>
                                </Link>
                                <DeleteBlogButton id={blog.id} />
                            </div>
                        </div>
                    )}

                    {relatedBlogs.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">More from {blog.category}</h4>
                            <div className="grid gap-6">
                                {relatedBlogs.map(b => (
                                    <Link key={b.id} href={`/blogs/${b.id}`} className="group block">
                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                                            <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h5 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">{b.title}</h5>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

            </div>
            <ArticleChat blogId={blog.id} />
        </article>
    );
}
