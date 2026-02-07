"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { votePoll } from "@/lib/gamification";
import { Loader2, CheckCircle2 } from "lucide-react";

interface PollOption {
    id: string;
    text: string;
    count: number;
    percentage: number;
}

interface PollProps {
    pollId: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVotedOptionId: string | null;
    blogId: string;
    userId: string | undefined; // Added userId
}

export default function PollWidget({ pollId, question, options, totalVotes, userVotedOptionId, blogId, userId }: PollProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [optimisticVoteId, setOptimisticVoteId] = useState<string | null>(userVotedOptionId);

    const handleVote = async (optionId: string) => {
        if (optimisticVoteId) return; // Already voted

        setIsVoting(true);
        setOptimisticVoteId(optionId); // Optimistic UI update

        // Simulate a small network delay for effect
        // await new Promise(resolve => setTimeout(resolve, 500)); 

        if (!userId) {
            setIsVoting(false);
            setOptimisticVoteId(null);
            alert("Please sign in to vote.");
            return;
        }

        const result = await votePoll(pollId, optionId, userId, blogId);

        setIsVoting(false);
        if (result.error) {
            // Revert optimistic update if error
            setOptimisticVoteId(null);
            alert(result.error);
        }
    };

    return (
        <div className="my-12 p-8 rounded-3xl bg-secondary/30 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                    Quick Poll
                </span>
                <h3 className="text-xl font-bold mb-6">{question}</h3>

                <div className="space-y-3">
                    {options.map((option) => {
                        const isSelected = optimisticVoteId === option.id;
                        const showResults = !!optimisticVoteId;

                        return (
                            <button
                                key={option.id}
                                disabled={!!optimisticVoteId || isVoting}
                                onClick={() => handleVote(option.id)}
                                className={`w-full relative overflow-hidden rounded-xl p-4 text-left transition-all border ${isSelected
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 bg-background/50 hover:bg-background/80"
                                    }`}
                            >
                                {/* Progress Bar Background */}
                                {showResults && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${option.percentage}%` }}
                                        className={`absolute top-0 left-0 bottom-0 -z-10 opacity-20 ${isSelected ? "bg-primary" : "bg-muted-foreground"}`}
                                    />
                                )}

                                <div className="flex items-center justify-between relative z-10">
                                    <span className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                                        {option.text}
                                    </span>
                                    {showResults && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{option.percentage}%</span>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 text-center text-xs text-muted-foreground">
                    {totalVotes + (optimisticVoteId && !userVotedOptionId ? 1 : 0)} votes • {optimisticVoteId ? "Thanks for voting!" : "Select an option"}
                </div>
            </div>
        </div>
    );
}
