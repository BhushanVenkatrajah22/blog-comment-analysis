import json
import random
from datetime import datetime, timedelta

categories = ["Design", "Development", "UX", "Security", "Architecture", "AI", "Cloud", "Soft Skills"]
authors = [
    ("Alex Rivers", "Senior UI Designer"),
    ("Sarah Code", "Full Stack Developer"),
    ("Mike Creative", "UX Strategist"),
    ("David Architect", "System Architect"),
    ("Emma Style", "CSS Evangelist"),
    ("Liam Crypt", "Security Researcher"),
    ("Sophia Dev", "Frontend Engineer"),
    ("Noah Backend", "DevOps Engineer")
]

images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    "https://images.unsplash.com/photo-1555099962-4199c345e5dd",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
]

titles = [
    "Exploring the Future of {} in 2026",
    "Mastering {} for Modern Apps",
    "The Hidden Secrets of {}",
    "Why {} is Changing Everything",
    "A Deep Dive into {}",
    "How {} Impacted the Web",
    "The Evolution of {}",
    "{} Best Practices for Teams",
    "{} vs. The World",
    "{} for Beginners and Experts"
]

blogs = []
start_date = datetime(2026, 2, 6)

for i in range(1, 51):
    category = random.choice(categories)
    author, role = random.choice(authors)
    base_image = random.choice(images)
    image = f"{base_image}?q=80&w=2670&auto=format&fit=crop"
    
    date = start_date - timedelta(days=i*2 + random.randint(0, 5))
    formatted_date = date.strftime("%b %d, %Y")
    
    title = random.choice(titles).format(category)
    if i <= 6: # Keep some of the original titles for consistency
        # Assuming original titles were unique, I'll just append something to distinguish them if needed
        # But user wants 50 so I'll just generate fresh ones.
        pass

    blog = {
        "id": str(i),
        "title": f"{title} #{i}",
        "excerpt": f"Discover how {category.lower()} is shaping the future of industrial technology and creativity in this wide-reaching analysis.",
        "content": f"<p>This is a detailed analysis of {category}.</p><h3>Introduction</h3><p>Content for {category} exploration goes here. We are looking at various aspects including Author's perspective on {category}.</p><blockquote>'Progress is impossible without change.' - George Bernard Shaw</blockquote><p>More content about {category} and its implications in {date.year}.</p>",
        "author": author,
        "authorRole": role,
        "date": formatted_date,
        "readTime": f"{random.randint(4, 15)} min read",
        "image": image,
        "category": category,
        "tags": [category, "Tech", "2026"]
    }
    blogs.append(blog)

# Output as TS constant
with open('blogs_output.json', 'w') as f:
    json.dump(blogs, f, indent=2)
