import { generateSummary, askAboutArticle } from "./gemini";

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    try {
        // Test summary generation
        console.log("\n1. Testing generateSummary...");
        const summary = await generateSummary("This is a test article about artificial intelligence and machine learning. It discusses how AI is transforming various industries.");
        console.log("Summary result:", summary);

        // Test article question
        console.log("\n2. Testing askAboutArticle...");
        const answer = await askAboutArticle("This is a test article about artificial intelligence and machine learning.", "What is this article about?");
        console.log("Answer result:", answer);

        console.log("\n✅ All tests completed!");
    } catch (error) {
        console.error("❌ Error during testing:", error);
    }
}

testGemini();
