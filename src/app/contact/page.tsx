"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
    const [focused, setFocused] = useState<string | null>(null);
    const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("submitting");
        // Simulate API call
        setTimeout(() => {
            setFormState("success");
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                    Get in Touch
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="bg-card border border-border p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Office</h4>
                                    <p className="text-muted-foreground">
                                        123 Innovation Drive<br />
                                        Tech Valley, CA 94043
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Email</h4>
                                    <p className="text-muted-foreground">hello@novablog.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Phone</h4>
                                    <p className="text-muted-foreground">+1 (555) 000-0000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-2xl space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <div className="relative">
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                    onFocus={() => setFocused("message")}
                                    onBlur={() => setFocused(null)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={formState !== "idle"}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
                        >
                            <div className="relative z-10 flex items-center gap-2">
                                {formState === "idle" && (
                                    <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                                {formState === "submitting" && "Sending..."}
                                {formState === "success" && "Message Sent!"}
                            </div>
                            {formState === "submitting" && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
