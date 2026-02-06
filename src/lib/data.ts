export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  timestamp: number; // For sorting
  readTime: string;
  image: string;
  category: string;
  tags: string[];
};

const categories = ["Design", "Development", "UX", "Security", "Architecture", "AI", "Cloud", "Soft Skills"];
const authors = [
  { name: "Alex Rivers", role: "Senior UI Designer" },
  { name: "Sarah Code", role: "Full Stack Developer" },
  { name: "Mike Creative", role: "UX Strategist" },
  { name: "David Architect", role: "System Architect" },
  { name: "Emma Style", role: "CSS Evangelist" },
  { name: "Liam Crypt", role: "Security Researcher" }
];

const images = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  "https://images.unsplash.com/photo-1555099962-4199c345e5dd",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
];

const titles = [
  "Exploring the Future of {} in 2026",
  "Mastering {} for Modern Apps",
  "The Hidden Secrets of {}",
  "Why {} is Changing Everything",
  "A Deep Dive into {}",
  "How {} Impacted the Web"
];

function generateBlogs(count: number): Blog[] {
  const generated: Blog[] = [];
  const now = new Date("2026-02-06").getTime();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i <= count; i++) {
    const cat = categories[i % categories.length];
    const auth = authors[i % authors.length];
    const imgBase = images[i % images.length];
    const titleBase = titles[i % titles.length];

    // Spread dates over the last few months
    const timestamp = now - (i * 2 * dayInMs) - (Math.random() * dayInMs);
    const dateObj = new Date(timestamp);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' });

    generated.push({
      id: i.toString(),
      title: titleBase.replace("{}", cat) + ` (Part ${Math.ceil(i / titles.length)})`,
      excerpt: `An in-depth look at how ${cat} is evolving in the modern digital landscape. We explore techniques, tools, and the mental models required to succeed.`,
      content: `<p>This is a comprehensive guide to ${cat}.</p><h3>Key Takeaways</h3><ul><li>Efficiency is key</li><li>User focus drives success</li><li>Iterate constantly</li></ul><blockquote>"The best way to predict the future is to create it." - Peter Drucker</blockquote><p>In the year 2026, we see ${cat} taking center stage in the engineering world.</p>`,
      author: auth.name,
      authorRole: auth.role,
      date: dateStr,
      timestamp: timestamp,
      readTime: `${5 + (i % 10)} min read`,
      image: `${imgBase}?q=80&w=2670&auto=format&fit=crop`,
      category: cat,
      tags: [cat, "Insights", "2026"]
    });
  }
  return generated;
}

export const blogs: Blog[] = generateBlogs(50);
