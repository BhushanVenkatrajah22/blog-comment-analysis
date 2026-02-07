"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smile, Meh, Frown, Activity } from "lucide-react";

interface SentimentHeatmapProps {
    positive: number;
    neutral: number;
    negative: number;
    total: number;
}

export default function SentimentHeatmap({ positive, neutral, negative, total }: SentimentHeatmapProps) {

    if (total === 0) return null;

    return (
        <div className="bg-card/50 border border-border rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Community Vibe</h3>
            </div>

            <div className="flex h-3 rounded-full overflow-hidden bg-secondary/50 mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${positive}%` }}
                    className="bg-green-500/80"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${neutral}%` }}
                    className="bg-yellow-500/80"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${negative}%` }}
                    className="bg-red-500/80"
                />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-green-500">{positive}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase opacity-70">Pos</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-yellow-500">{neutral}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase opacity-70">Neu</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-red-500">{negative}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase opacity-70">Neg</span>
                </div>
            </div>
        </div>
    );
}
