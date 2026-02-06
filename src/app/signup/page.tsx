"use client";

import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, UserPlus, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signup } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Record<string, string[]>>({});
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError({});

        const result = await signup(null, formData);

        if (result?.error) {
            if ("message" in result.error) {
                setError({ general: [result.error.message as string] });
            } else {
                setError(result.error as Record<string, string[]>);
            }
            setIsLoading(false);
        } else if (result?.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="container max-w-[450px] px-6"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            NovaBlog
                        </span>
                    </Link>
                    <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
                    <p className="text-sm text-muted-foreground">Start your storytelling career today.</p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-50" />

                    {success ? (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold italic">Welcome aboard!</h2>
                            <p className="text-muted-foreground">Your account has been created. Redirecting to login...</p>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-6 relative z-10">
                            <button
                                type="button"
                                disabled={isLoading}
                                className="w-full py-4 bg-background border border-border hover:border-primary/50 text-foreground font-bold rounded-2xl flex items-center justify-center gap-3 transition-all group"
                            >
                                <div className="p-1 bg-white rounded-md">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                    </svg>
                                </div>
                                Sign up with Google
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-4 text-muted-foreground font-bold tracking-widest">Or create with email</span>
                                </div>
                            </div>

                            {error.general && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error.general[0]}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Alex Rivers"
                                            className="w-full bg-background/50 border border-border px-11 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-inner"
                                        />
                                    </div>
                                    {error.name && <p className="text-[10px] text-red-500 font-bold ml-1">{error.name[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            className="w-full bg-background/50 border border-border px-11 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-inner"
                                        />
                                    </div>
                                    {error.email && <p className="text-[10px] text-red-500 font-bold ml-1">{error.email[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-background/50 border border-border px-11 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-inner"
                                        />
                                    </div>
                                    {error.password && <p className="text-[10px] text-red-500 font-bold ml-1">{error.password[0]}</p>}
                                </div>
                                <button
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Establish Citizenship
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-center pt-4 border-t border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    Already a resident?{" "}
                                    <Link href="/login" className="text-primary font-black hover:text-primary/80 transition-all">
                                        Log back in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
