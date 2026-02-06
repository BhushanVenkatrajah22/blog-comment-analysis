"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe, Sparkles, TrendingUp, Users, Cpu } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import { blogs, categories } from "@/lib/data";
import NovaParticles from "@/components/ui/NovaParticles";
import { useRef } from "react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Lightning Fast",
    description: "Built on Next.js 16 for sub-millisecond page loads and instant transitions.",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    title: "Secure by Design",
    description: "Enterprise-grade security with modern authentication and data protection.",
  },
  {
    icon: <Globe className="w-6 h-6 text-green-400" />,
    title: "Global Reach",
    description: "Deployed to the edge for low-latency access from anywhere in the world.",
  },
];

const stats = [
  { label: "Active Readers", value: "50k+", icon: <Users className="w-5 h-5" /> },
  { label: "Daily Insights", value: "100+", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "AI Powered", value: "24/7", icon: <Cpu className="w-5 h-5" /> },
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const latestBlogs = blogs.slice(0, 3);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen relative overflow-x-hidden">
      <NovaParticles />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale }}
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide backdrop-blur-xl shadow-2xl shadow-primary/10">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase">Unlocking the Future of Content</span>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
              THE<br />NOVA<br />ERA.
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
              A high-fidelity platform for the digital architect. <br className="hidden md:block" />
              Where complex data meets exquisite design.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/blogs">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  Explore Blogs <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all"
                >
                  Join Nova
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16 border-t border-white/5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="p-2 mb-1 bg-primary/10 rounded-lg text-primary">{stat.icon}</div>
                  <span className="text-3xl font-black text-white leading-none">{stat.value}</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 border border-white/10 rounded-full"
        >
          <div className="w-1 h-3 bg-primary rounded-full" />
        </motion.div>
      </section>

      {/* Categories Cluster Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                Categorized Intelligence
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-tight">
                Browse by <br />
                <span className="text-primary italic">Architecture.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Filter through 50+ deep dives across 8 core disciplines. From AI strategy to UX paradigms, we cover the tech stack of 2026.
              </p>
              <Link href="/blogs" className="inline-flex items-center gap-4 group text-xl font-black">
                See Every Topic
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <ArrowRight className="w-6 h-6 group-hover:text-primary-foreground transition-colors" />
                </div>
              </Link>
            </motion.div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {categories.map((cat: string, i: number) => (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 text-center hover:border-primary/50 group transition-all cursor-pointer shadow-2xl shadow-black/50"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-primary group-hover:scale-110 transition-all">
                      <Zap className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="text-lg font-black block tracking-tight">{cat}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block tracking-widest">Explore</span>
                  </motion.div>
                ))}
              </div>
              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Insights (Horizontal Scroll Mockup) */}
      <section className="py-32 relative bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6 mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter">FEATURED INSIGHTS</h2>
            <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs flex items-center gap-2">
              <span className="w-8 h-px bg-primary" /> Curated for Excellence
            </p>
          </div>
          <Link href="/blogs" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
            All Explorations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary via-primary/90 to-purple-800 p-16 md:p-32 text-center relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)]"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
              READY TO JOIN THE <br className="hidden md:block" /> FUTURE OF BLOGGING?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full px-12 py-6 bg-white text-primary font-black text-xl rounded-2xl hover:bg-white/90 transition-all shadow-2xl">
                  Start Storytelling
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full px-12 py-6 bg-primary-foreground/10 border border-white/20 text-white font-black text-xl rounded-2xl hover:bg-white/10 transition-all">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
