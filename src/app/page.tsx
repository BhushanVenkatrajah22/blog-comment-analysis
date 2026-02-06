"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import { blogs } from "@/lib/data";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Lightning Fast",
    description: "Built on Next.js 15 for sub-millisecond page loads and instant transitions.",
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

export default function Home() {
  const latestBlogs = blogs.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
              ✨ The Future of Blogging is Here
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Create, Share, <br />
              <span className="text-primary">Inspire.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A modern platform for thinkers and creators. Experience the next generation of digital storytelling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blogs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  Read Blogs <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-lg hover:bg-secondary/80 transition-colors"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why NovaBlog?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the tools you need to build your audience and grow your brand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="mb-4 p-3 bg-background rounded-xl inline-block border border-border">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-2">Latest Insights</h2>
              <p className="text-muted-foreground">Discover the latest trends and stories.</p>
            </motion.div>
            <Link href="/blogs" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-primary font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
