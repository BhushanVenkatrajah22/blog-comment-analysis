import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { blogs } from "@/lib/data";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { id } = await params;
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
        notFound();
    }

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 pt-24 bg-gradient-to-t from-background to-transparent">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors backdrop-blur-md bg-background/30 px-3 py-1 rounded-full border border-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
                        </Link>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{blog.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 max-w-3xl mt-12">
                <div
                    className="prose prose-lg dark:prose-invert prose-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <hr className="my-12 border-border" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-secondary/20 p-8 rounded-2xl border border-border">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
                        <p className="text-muted-foreground">Subscribe to get the latest updates directly to your inbox.</p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-all">
                        Subscribe Now
                    </button>
                </div>
            </div>
        </article>
    );
}
