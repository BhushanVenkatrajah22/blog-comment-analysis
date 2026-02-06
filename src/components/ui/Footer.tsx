import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-lg font-bold">NovaBlog</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A modern, high-performance blog platform built for the future of web content.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-background border border-border rounded-full hover:bg-primary/10 hover:border-primary/50 transition-colors">
                                <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </Link>
                            <Link href="#" className="p-2 bg-background border border-border rounded-full hover:bg-primary/10 hover:border-primary/50 transition-colors">
                                <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </Link>
                            <Link href="#" className="p-2 bg-background border border-border rounded-full hover:bg-primary/10 hover:border-primary/50 transition-colors">
                                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} NovaBlog. All rights reserved.</p>
                    <p>Built with Next.js 15 & Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
}
