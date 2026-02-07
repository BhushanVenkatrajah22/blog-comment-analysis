"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSentiment, generateSummary, askAboutArticle } from "./gemini";
import { blogs as mockBlogs } from "./data";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(prevState: any, formData: FormData) {
    const validatedFields = signupSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: { email: ["Email already in use"] } };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true };
    } catch (err) {
        console.error("Signup error:", err);
        return { error: { message: "Something went wrong. Please try again." } };
    }
}

export async function getBlogSummary(id: string, content: string) {
    console.log("[getBlogSummary] Called for blog ID:", id);
    try {
        // Only attempt DB lookups for non-mock blogs
        const isMock = id.length <= 2 && !isNaN(Number(id));

        if (!isMock) {
            const blog = await prisma.blog.findUnique({
                where: { id },
                select: { summary: true }
            });

            if (blog?.summary) {
                console.log("[getBlogSummary] Using cached summary from database");
                return { success: true, summary: blog.summary };
            }

            console.log("[getBlogSummary] Generating new summary via Gemini API");
            const summary = await generateSummary(content);

            await prisma.blog.update({
                where: { id },
                data: { summary }
            });

            return { success: true, summary };
        }

        // For mock blogs, just generate (no persistence)
        console.log("[getBlogSummary] Generating summary for mock blog");
        const summary = await generateSummary(content);
        return { success: true, summary };
    } catch (err) {
        console.error("[getBlogSummary] Error:", err);
        if (err instanceof Error) {
            console.error("[getBlogSummary] Error message:", err.message);
        }
        return { success: false, error: "Cloud not fetch summary" };
    }
}

export async function askQuestion(id: string, question: string) {
    console.log("[askQuestion] Called for blog ID:", id, "Question:", question);
    try {
        const isMock = id.length <= 2 && !isNaN(Number(id));
        let content = "";

        if (isMock) {
            content = mockBlogs.find(b => b.id === id)?.content || "";
        } else {
            const blog = await prisma.blog.findUnique({
                where: { id },
                select: { content: true }
            });
            content = blog?.content || "";
        }

        if (!content) {
            console.error("[askQuestion] Article content not found");
            return { error: "Article content not found" };
        }

        console.log("[askQuestion] Calling Gemini API...");
        const answer = await askAboutArticle(content, question);
        console.log("[askQuestion] Answer received");
        return { success: true, answer };
    } catch (err) {
        console.error("[askQuestion] Error:", err);
        if (err instanceof Error) {
            console.error("[askQuestion] Error message:", err.message);
        }
        return { error: "Failed to process question" };
    }
}

export async function addComment(blogId: string, userId: string | null, content: string) {
    if (!content.trim()) return { error: "Comment cannot be empty" };

    const sentiment = await getSentiment(content);

    try {
        // 1. Validate User (Handle Stale Sessions)
        let finalUserId = userId;
        if (userId) {
            const userExists = await prisma.user.findUnique({ where: { id: userId } });
            if (!userExists) {
                console.warn(`[addComment] User ${userId} not found in DB. Commenting as Guest.`);
                finalUserId = null;
            }
        }

        // 2. Ensure Blog Exists (Persist Mock Blog)
        const dbBlog = await prisma.blog.findUnique({ where: { id: blogId } });

        if (!dbBlog) {
            console.log(`[addComment] Blog ${blogId} not found in DB. Searching mock data...`);
            const mockBlog = mockBlogs.find(b => b.id === blogId);

            if (mockBlog) {
                console.log(`[addComment] Found mock blog: ${mockBlog.title}. Creating in DB...`);
                await prisma.blog.create({
                    data: {
                        id: mockBlog.id,
                        title: mockBlog.title,
                        excerpt: mockBlog.excerpt,
                        content: mockBlog.content,
                        author: mockBlog.author,
                        authorRole: mockBlog.authorRole,
                        date: mockBlog.date,
                        timestamp: BigInt(mockBlog.timestamp),
                        readTime: mockBlog.readTime,
                        image: mockBlog.image,
                        category: mockBlog.category,
                        tags: mockBlog.tags.join(", "),
                    }
                });
                console.log(`[addComment] Mock blog ${blogId} persisted successfully.`);
            } else {
                return { error: "Blog post not found." };
            }
        }

        // 3. Create Comment
        const comment = await prisma.comment.create({
            data: {
                content,
                blogId,
                userId: finalUserId,
                sentiment,
            },
            include: {
                user: true,
            },
        });

        revalidatePath(`/blogs/${blogId}`);
        return { success: true, comment };
    } catch (err) {
        console.error("Error adding comment:", err);
        // @ts-ignore
        if (err.meta) console.error("Prisma Error Meta:", err.meta);
        // @ts-ignore
        if (err.code) console.error("Prisma Error Code:", err.code);

        return { error: "Failed to add comment. Please try again." };
    }
}

export async function createBlog(title: string, content: string, image: string) {
    if (!title.trim() || !content.trim()) return { error: "Title and content are required" };

    try {
        // Create a simple excerpt from the content
        const excerpt = content.replace(/<[^>]*>/g, "").slice(0, 150) + "...";

        const blog = await prisma.blog.create({
            data: {
                title,
                excerpt,
                content: content.split("\n").map(p => p.trim() ? `<p>${p}</p>` : "").join(""),
                author: "Guest Author",
                authorRole: "Contributor",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' }),
                timestamp: Date.now(),
                readTime: "5 min read",
                image: image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2670&auto=format&fit=crop",
                category: "Insights",
                tags: "Community, New Story",
            },
        });

        revalidatePath("/blogs");
        revalidatePath("/");
        return { success: true, blogId: blog.id };
    } catch (err) {
        console.error("Error creating blog:", err);
        return { error: "Failed to save blog to database." };
    }
}

export async function getRecentBlogs() {
    try {
        const dbBlogs = await prisma.blog.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            take: 10
        });
        const serializedBlogs = dbBlogs.map((b: any) => ({
            ...b,
            timestamp: Number(b.timestamp),
            tags: typeof b.tags === 'string' ? b.tags.split(",").map((t: string) => t.trim()) : b.tags
        }));
        return { success: true, blogs: serializedBlogs };
    } catch (err) {
        console.error("Error fetching recent blogs:", err);
        return { success: true, blogs: [] };
    }
}

export async function getAllBlogs() {
    try {
        const dbBlogs = await prisma.blog.findMany({
            orderBy: {
                timestamp: 'desc'
            }
        });

        const serializedDbBlogs = dbBlogs.map((b: any) => ({
            ...b,
            timestamp: Number(b.timestamp),
            tags: typeof b.tags === 'string' ? b.tags.split(",").map((t: string) => t.trim()) : b.tags
        }));

        // Filter out mock blogs that are already in DB (to avoid duplicates)
        const dbIds = new Set(serializedDbBlogs.map(b => b.id));
        const filteredMockBlogs = mockBlogs.filter(b => !dbIds.has(b.id));

        // Merge DB blogs with remaining mock blogs
        const allBlogs = [...serializedDbBlogs, ...filteredMockBlogs].sort((a, b) => b.timestamp - a.timestamp);
        return allBlogs;
    } catch (err) {
        console.error("Error fetching all blogs:", err);
        return mockBlogs;
    }
}

export async function getBlogById(id: string) {
    try {
        const dbBlog = await prisma.blog.findUnique({
            where: { id },
            include: {
                comments: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (dbBlog) {
            return {
                ...dbBlog,
                timestamp: Number(dbBlog.timestamp),
                tags: typeof dbBlog.tags === 'string' ? dbBlog.tags.split(",").map((t: string) => t.trim()) : dbBlog.tags
            };
        }

        // Fallback to mock data
        const mockBlog = mockBlogs.find(b => b.id === id);
        return mockBlog;
    } catch (err) {
        console.error("Error fetching blog by ID:", err);
        return mockBlogs.find(b => b.id === id);
    }
}

export async function deleteBlog(id: string) {
    try {
        // Prevent deletion of mock blogs (IDs 1-50 are usually strings like "1", "2" etc.)
        if (id.length <= 2 && !isNaN(Number(id))) {
            return { error: "Mock stories cannot be deleted from the database." };
        }

        await prisma.blog.delete({
            where: { id },
        });

        revalidatePath("/blogs");
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Error deleting blog:", err);
        return { error: "Failed to delete blog. It might have already been removed." };
    }
}

export async function updateBlog(id: string, title: string, content: string, image: string) {
    if (!title.trim() || !content.trim()) return { error: "Title and content are required" };

    try {
        // Prevent editing of mock blogs
        if (id.length <= 2 && !isNaN(Number(id))) {
            return { error: "Mock stories cannot be edited." };
        }

        const excerpt = content.replace(/<[^>]*>/g, "").slice(0, 150) + "...";

        await prisma.blog.update({
            where: { id },
            data: {
                title,
                excerpt,
                content: content.split("\n").map(p => p.trim() ? `<p>${p}</p>` : "").join(""),
                image: image || undefined,
            },
        });

        revalidatePath("/blogs");
        revalidatePath(`/blogs/${id}`);
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Error updating blog:", err);
        return { error: "Failed to update blog." };
    }
}
