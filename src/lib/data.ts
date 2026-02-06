export type Blog = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
};

export const blogs: Blog[] = [
    {
        id: "1",
        title: "The Future of Web Design in 2026",
        excerpt: "Exploring the rise of immersive 3D experiences, AI-driven layouts, and hyper-personalized content.",
        content: `
      <h2>The Shift to Immersive Experiences</h2>
      <p>Web design is no longer just about information; it's about experience. In 2026, we are seeing a massive shift towards...</p>
      <p>Spatial interfaces and scroll-based storytelling are becoming the norm rather than the exception.</p>
      <h2>AI-Driven Personalization</h2>
      <p>Imagine a website that adapts its layout based on your reading habits. That's not science fiction anymore...</p>
    `,
        author: "Alex Rivers",
        date: "Feb 06, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        category: "Design",
    },
    {
        id: "2",
        title: "Mastering Next.js 15: What's New?",
        excerpt: "A deep dive into the latest features of Next.js 15 including partial prerendering and compiler optimizations.",
        content: "Content about Next.js 15...",
        author: "Sarah Code",
        date: "Feb 04, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop",
        category: "Development",
    },
    {
        id: "3",
        title: "The Psychology of Dark Mode",
        excerpt: "Why do users prefer dark interfaces? Understanding the user experience benefits and design challenges.",
        content: "Content about Dark Mode...",
        author: "Mike Creative",
        date: "Jan 28, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        category: "UX",
    },
    {
        id: "4",
        title: "Building Scalable Systems with Micro-frontends",
        excerpt: "Breaking down the monolith: When and how to implement micro-frontends in your enterprise application.",
        content: "Content about Micro-frontends...",
        author: "David Architect",
        date: "Jan 15, 2026",
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop",
        category: "Architecture",
    },
    {
        id: "5",
        title: "CSS Variables: The Unsung Heroes",
        excerpt: "Leveraging CSS custom properties for dynamic theming and maintainable codebases.",
        content: "Content about CSS Variables...",
        author: "Emma Style",
        date: "Jan 10, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2670&auto=format&fit=crop",
        category: "Development",
    },
];
