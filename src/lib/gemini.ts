import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getSentiment(content: string): Promise<'positive' | 'negative' | 'neutral'> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found. Falling back to keyword analysis.");
        return analyzeSentimentFallback(content);
    }

    try {
        const prompt = `Analyze the sentiment of the following blog comment and respond with ONLY one word: "positive", "negative", or "neutral".
        
        Comment: "${content}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().toLowerCase().trim();

        if (text.includes("positive")) return "positive";
        if (text.includes("negative")) return "negative";
        return "neutral";
    } catch (error) {
        console.error("Gemini Sentiment Error:", error);
        return analyzeSentimentFallback(content);
    }
}

function analyzeSentimentFallback(content: string): 'positive' | 'negative' | 'neutral' {
    const positiveKeywords = ["great", "awesome", "love", "excellent", "good", "nice", "perfect", "fantastic", "interesting", "helpful", "thanks", "thank you", "best"];
    const negativeKeywords = ["bad", "hate", "terrible", "worst", "horrible", "awful", "don't like", "dislike", "useless", "broken", "wrong", "skeptical", "not good"];

    const lowerContent = content.toLowerCase();

    let score = 0;
    positiveKeywords.forEach(word => {
        if (lowerContent.includes(word)) score++;
    });
    negativeKeywords.forEach(word => {
        if (lowerContent.includes(word)) score--;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

export async function generateSummary(content: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        return "Smart TL;DR is currently unavailable. Please check your API configuration.";
    }

    try {
        const cleanContent = content.replace(/<[^>]*>/g, "").slice(0, 10000);
        const prompt = `Provide a concise, engaging summary of the following blog article. 
        The summary MUST be exactly 3 sentences long and capture the key takeaways.
        
        Article: "${cleanContent}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Failed to generate summary. Please try again later.";
    }
}

export async function askAboutArticle(content: string, question: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        return "I'm sorry, I cannot answer questions right now. Please check the API configuration.";
    }

    try {
        const cleanContent = content.replace(/<[^>]*>/g, "").slice(0, 10000);
        const prompt = `You are an AI assistant for NovaBlog. Answer the user's question based ONLY on the provided article content. 
        If the answer is not in the article, politely say you don't know based on the text.
        Keep your response concise but helpful.

        Article Content:
        ${cleanContent}

        User Question: "${question}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I encountered an error while processing your question. Please try again.";
    }
}
