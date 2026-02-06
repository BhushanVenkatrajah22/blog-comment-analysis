"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBlog } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeleteBlogButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
            setIsDeleting(true);
            const result = await deleteBlog(id);
            if (result.success) {
                router.push("/blogs");
                router.refresh();
            } else {
                alert(result.error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {isDeleting ? "Deleting..." : "Delete Story"}
        </button>
    );
}
