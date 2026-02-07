"use client";

import { Award, BookOpen, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface UserBadgesProps {
    badges: string[];
}

const BADGE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    "avid-reader": {
        label: "Avid Reader",
        icon: <BookOpen className="w-3 h-3" />,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    "scholar": {
        label: "Scholar",
        icon: <Award className="w-3 h-3" />,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    "first-responder": {
        label: "First Responder",
        icon: <Flame className="w-3 h-3" />,
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    }
};

export default function UserBadges({ badges }: UserBadgesProps) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            {badges.map((badgeId, index) => {
                const config = BADGE_CONFIG[badgeId];
                if (!config) return null;

                return (
                    <motion.div
                        key={badgeId}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${config.color}`}
                        title={config.label}
                    >
                        {config.icon}
                        <span className="hidden sm:inline">{config.label}</span>
                    </motion.div>
                );
            })}
        </div>
    );
}
