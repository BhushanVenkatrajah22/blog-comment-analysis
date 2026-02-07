"use client";

import { useEffect } from "react";
import { trackRead } from "@/lib/gamification";

export default function BlogTracker({ blogId, userId }: { blogId: string; userId: string }) {
    useEffect(() => {
        if (userId) {
            trackRead(blogId, userId);
        }
    }, [blogId, userId]);

    return null;
}
