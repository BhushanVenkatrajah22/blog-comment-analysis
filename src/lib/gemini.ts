import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
