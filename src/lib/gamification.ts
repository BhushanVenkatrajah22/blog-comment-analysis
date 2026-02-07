"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Polls ---

export async function getPoll(blogId: string) {
    try {
        // Find active poll for this blog
        const poll = await prisma.poll.findFirst({
            where: { blogId, active: true },
            include: {
                options: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    }
                }
            }
        });

        if (!poll) return { poll: null };

        // Calculate total votes
        const totalVotes = poll.options.reduce((acc, opt) => acc + opt._count.votes, 0);

        return {
            poll: {
                ...poll,
                totalVotes,
                options: poll.options.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    count: opt._count.votes,
                    percentage: totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0
                }))
            }
        };
    } catch (error) {
        console.error("Error fetching poll:", error);
        return { poll: null };
    }
}

export async function getUserVote(pollId: string, userId: string) {
    try {
        const vote = await prisma.pollVote.findUnique({
            where: {
                pollId_userId: {
                    pollId,
                    userId
                }
            }
        });
        return { votedOptionId: vote?.optionId || null };
    } catch (error) {
        return { votedOptionId: null };
    }
}

export async function votePoll(pollId: string, optionId: string, userId: string, blogId: string) {
    try {
        console.log(`[votePoll] Attempting vote. UserId: ${userId}, PollId: ${pollId}`);
        // Validate User (Stale Session Check)
        const userExists = await prisma.user.findUnique({ where: { id: userId } });

        if (!userExists) {
            console.error(`[votePoll] User ${userId} not found in DB.`);
            return { error: "Session expired. Please sign out and sign in again." };
        }

        // Check if already voted
        const existingVote = await prisma.pollVote.findUnique({
            where: {
                pollId_userId: {
                    pollId,
                    userId
                }
            }
        });

        if (existingVote) {
            // Optimistically allow "re-vote" or just say success to avoid UI annoyance
            return { error: "You have already voted in this poll." };
        }

        await prisma.pollVote.create({
            data: {
                pollId,
                optionId,
                userId
            }
        });

        revalidatePath(`/blogs/${blogId}`);
        return { success: true };
    } catch (error) {
        console.error("Error voting:", error);
        return { error: "Failed to submit vote." };
    }
}

import { blogs as mockBlogs } from "./data";

export async function createDemoPoll(blogId: string) {
    try {
        // 1. Ensure Blog Exists (Persist Mock Blog if needed)
        const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!blogExists) {
            const mockBlog = mockBlogs.find(b => b.id === blogId);
            if (mockBlog) {
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
            } else {
                console.error(`[createDemoPoll] Blog ${blogId} not found in mock data.`);
                return; // Cannot create poll for non-existent blog
            }
        }

        // 2. Check if poll exists
        const existing = await prisma.poll.findFirst({ where: { blogId } });
        if (existing) return;

        // 3. Create active poll
        await prisma.poll.create({
            data: {
                question: "How relevant is this topic to your work?",
                blogId,
                options: {
                    create: [
                        { text: "Extremely relevant" },
                        { text: "Somewhat relevant" },
                        { text: "Just curious" },
                        { text: "Not relevant" }
                    ]
                }
            }
        });
    } catch (error) {
        console.error("Error creating demo poll:", error);
    }
}

// --- Reading History & Badges ---

export async function trackRead(blogId: string, userId: string) {
    try {
        // Ensure user exists before tracking (Stale Session Protection)
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) return { success: false };

        // Ensure Blog Exists (Persist Mock Blog)
        const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!blogExists) {
            const mockBlog = mockBlogs.find(b => b.id === blogId);
            if (mockBlog) {
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
            } else {
                return { success: false };
            }
        }

        // Record read
        await prisma.readingHistory.create({
            data: {
                blogId,
                userId
            }
        });

        // Check for 'Avid Reader' badge (5 reads)
        const readCount = await prisma.readingHistory.count({
            where: { userId }
        });

        if (readCount >= 5) {
            await assignBadge(userId, "avid-reader");
        }

        // Check for 'Scholar' badge (20 reads)
        if (readCount >= 20) {
            await assignBadge(userId, "scholar");
        }

        return { success: true };
    } catch (error) {
        // Ignore unique constraint violations or other minor tracking errors
        console.error("Error tracking read:", error);
        return { success: false };
    }
}

async function assignBadge(userId: string, badgeId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { badges: true }
    });

    if (!user) return;

    const currentBadges = user.badges ? user.badges.split(",") : [];
    if (!currentBadges.includes(badgeId)) {
        const newBadges = [...currentBadges, badgeId].join(",");
        await prisma.user.update({
            where: { id: userId },
            data: { badges: newBadges }
        });
    }
}

export async function getUserBadges(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { badges: true, readingHistory: true }
        });

        if (!user) return { badges: [], readCount: 0 };

        const badgeList = user.badges ? user.badges.split(",").filter(Boolean) : [];
        const readCount = await prisma.readingHistory.count({ where: { userId } });

        return { badges: badgeList, readCount };
    } catch (error) {
        return { badges: [], readCount: 0 };
    }
}

// --- Sentiment Analysis ---

export async function getBlogSentiment(blogId: string) {
    try {
        // Get comments from DB
        const comments = await prisma.comment.findMany({
            where: { blogId },
            select: { sentiment: true }
        });

        if (comments.length === 0) {
            // Return a randomized "mock" sentiment for visual demo
            return {
                positive: 65,
                neutral: 25,
                negative: 10,
                total: 0
            };
        }

        const total = comments.length;
        const positive = comments.filter(c => c.sentiment === 'positive').length;
        const negative = comments.filter(c => c.sentiment === 'negative').length;
        const neutral = comments.filter(c => c.sentiment === 'neutral').length;

        return {
            positive: Math.round((positive / total) * 100),
            neutral: Math.round((neutral / total) * 100),
            negative: Math.round((negative / total) * 100),
            total
        };

    } catch (error) {
        return { positive: 0, neutral: 0, negative: 0, total: 0 };
    }
}
