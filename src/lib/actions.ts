"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

import { getSentiment } from "./gemini";

export async function addComment(blogId: string, userId: string | null, content: string) {
    if (!content.trim()) return { error: "Comment cannot be empty" };

    const sentiment = await getSentiment(content);

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                blogId,
                userId: userId || null,
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
        return { error: "Failed to add comment" };
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
            timestamp: Number(b.timestamp)
        }));
        return { success: true, blogs: serializedBlogs };
    } catch (err) {
        console.error("Error fetching recent blogs:", err);
        return { success: true, blogs: [] };
    }
}

import { blogs as mockBlogs } from "./data";

export async function getAllBlogs() {
    try {
        const dbBlogs = await prisma.blog.findMany({
            orderBy: {
                timestamp: 'desc'
            }
        });

        const serializedDbBlogs = dbBlogs.map((b: any) => ({
            ...b,
            timestamp: Number(b.timestamp)
        }));

        // Merge DB blogs with mock blogs
        const allBlogs = [...serializedDbBlogs, ...mockBlogs].sort((a, b) => b.timestamp - a.timestamp);
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
                timestamp: Number(dbBlog.timestamp)
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
