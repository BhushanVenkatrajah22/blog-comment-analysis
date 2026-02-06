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

export async function addComment(blogId: string, userId: string, content: string) {
    if (!content.trim()) return { error: "Comment cannot be empty" };

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                blogId,
                userId,
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
