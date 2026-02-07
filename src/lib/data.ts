export type Comment = {
  id: string;
  author: string;
  content: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

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
  summary?: string;
  comments: Comment[];
};

export const categories = ["Design", "Development", "UX", "Security", "Architecture", "AI", "Cloud", "Soft Skills"];
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

const intros = [
  "In the rapidly evolving landscape of {cat}, staying ahead of the curve is no longer just an advantage—it's a necessity. As we look towards the horizon of 2026, the integration of innovative methodologies is redefining how we approach digital excellence.",
  "The world of {cat} is undergoing a fundamental transformation. From the way teams collaborate to the very tools we use, the boundaries of what's possible are being pushed further every day. In this deep dive, we explore the core drivers of this change.",
  "Understanding the intricacies of {cat} requires more than just a surface-level overview. It demands a rigorous analysis of current trends and a strategic outlook on future developments. Join us as we unpack the complexities of this vital industry pillar."
];

const bodySections = [
  {
    heading: "The Current Landscape",
    content: "The current state of {cat} is marked by unprecedented growth and complexity. Industry leaders are increasingly turning to advanced solutions to manage the growing demands of modern consumers. This shift is characterized by a move towards more modular, scalable, and resilient systems that can adapt to changing market conditions in real-time."
  },
  {
    heading: "Key Challenges and Opportunities",
    content: "Despite the progress, several challenges remain. Integration hurdles, security concerns, and the need for specialized talent continue to be significant roadblocks. However, these challenges also present unique opportunities for innovation. By leveraging emerging technologies and adopting a proactive mindset, organizations can turn these obstacles into competitive advantages."
  },
  {
    heading: "Technical Implementation Strategies",
    content: "When it comes to the technical side of {cat}, a multi-layered approach is often the most effective. This involves not only choosing the right stack but also ensuring that the underlying architecture is robust enough to support long-term growth. Performance optimization, automated testing, and continuous deployment are no longer optional—they are core components of any successful strategy."
  },
  {
    heading: "The Role of Human-Centric Design",
    content: "In our quest for technical efficiency, it's easy to lose sight of the end user. However, {cat} is ultimately about creating value for people. Human-centric design principles should be at the heart of every decision, ensuring that technology serves as an enabler rather than a barrier. This means prioritizing accessibility, inclusivity, and intuitive user experiences at every stage of development."
  },
  {
    heading: "Strategic Outlook for 2026",
    content: "Looking ahead, the future of {cat} is bright. We anticipate a surge in the adoption of AI-driven tools, decentralized architectures, and more sustainable engineering practices. These trends will not only improve the quality of digital products but also create new avenues for creative expression and business growth. The key to success will be agility and a commitment to lifelong learning."
  }
];

const quotes = [
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
  "Technology is best when it brings people together. - Matt Mullenweg",
  "The only way to do great work is to love what you do. - Steve Jobs"
];

const commentAuthors = [
  "Jamie Tech", "Dev Dan", "UX Luna", "Cloud Chris", "Archi Amy",
  "Security Sam", "Soft Skill Sue", "Frontend Frank", "Backend Barb", "Fullstack Fred"
];

const commentContents = [
  "This is a fantastic deep dive! I've been looking for something this detailed about {cat}.",
  "Interesting perspective on {cat}. I hadn't considered the impact of human-centric design in this context.",
  "Great article! The point about modular architectures really resonated with me.",
  "Thanks for sharing these technical strategies. I'll definitely be trying some of these in my next project.",
  "The outlook for 2026 seems spot on. Agility is definitely going to be the key differentiator.",
  "I'm a bit skeptical about the AI integration part, but you make a compelling case for its necessity.",
  "Excellent summary. Do you have any additional resources you'd recommend for learning more about {cat}?",
  "Love the layout and the content. Very professional and insightful.",
  "As someone working in {cat}, I find your analysis very accurate and helpful.",
  "Keep up the great work! Your blogs are always a highlight of my week."
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

    // Use deterministic random values based on index i
    const randomOffset = (i * 1337) % dayInMs;
    const timestamp = now - (i * 2 * dayInMs) - randomOffset;
    const dateObj = new Date(timestamp);

    // Stable date formatting: Jan 01, 26
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateStr = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${String(dateObj.getFullYear()).slice(-2)}`;

    // Assemble dynamic content
    const intro = intros[i % intros.length].replace(/{cat}/g, cat);

    // Deterministic section selection and ordering
    const sections = [...bodySections]
      .map((s, idx) => ({ s, sortKey: (idx + i) % bodySections.length }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(0, 4)
      .map(item => `<h3>${item.s.heading}</h3><p>${item.s.content.replace(/{cat}/g, cat)}</p>`)
      .join("");

    const quote = quotes[i % quotes.length];

    const conclusion = `<p>In conclusion, the journey through the world of ${cat} is an ongoing process of discovery and refinement. By staying curious, embracing change, and focusing on quality, we can build a future that is not only technologically advanced but also deeply meaningful.</p>`;

    const content = `<p>${intro}</p>${sections}<blockquote>"${quote.split(" - ")[0]}" <br/>— <cite>${quote.split(" - ")[1]}</cite></blockquote>${conclusion}`;

    // Estimate read time based on word count (approx 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTimeMinutes = Math.max(5, Math.ceil(wordCount / 180));

    // Generate 10-30 comments deterministically
    const numComments = 10 + (i % 21);
    const blogComments: Comment[] = [];
    for (let j = 0; j < numComments; j++) {
      const cAuth = commentAuthors[(i + j) % commentAuthors.length];
      const cContent = commentContents[(i * j) % commentContents.length].replace(/{cat}/g, cat);
      const cDayOffset = (i + j) % 5;
      const cDateObj = new Date(timestamp + (cDayOffset * dayInMs / 24)); // Comments slightly after post
      const cDateStr = `${months[cDateObj.getMonth()]} ${String(cDateObj.getDate()).padStart(2, '0')}, ${String(cDateObj.getFullYear()).slice(-2)}`;

      const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
      const cSentiment = sentiments[(i * j) % sentiments.length];

      blogComments.push({
        id: `c-${i}-${j}`,
        author: cAuth,
        content: cContent,
        date: cDateStr,
        sentiment: cSentiment
      });
    }

    generated.push({
      id: i.toString(),
      title: titleBase.replace("{}", cat) + (i > titles.length ? ` (Exploration ${Math.ceil(i / titles.length)})` : ""),
      excerpt: `An in-depth look at how ${cat} is evolving in the modern digital landscape. We explore techniques, tools, and the mental models required to succeed.`,
      content: content,
      author: auth.name,
      authorRole: auth.role,
      date: dateStr,
      timestamp: timestamp,
      readTime: `${readTimeMinutes} min read`,
      image: `${imgBase}?q=80&w=2670&auto=format&fit=crop`,
      category: cat,
      tags: [cat, "Insights", "2026", "Tech"],
      comments: blogComments
    });
  }
  return generated;
}

export const blogs: Blog[] = generateBlogs(50);
