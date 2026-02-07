import { getBlogSummary, askQuestion } from "./actions";
import { prisma } from "./prisma";

async function test() {
    console.log("--- Starting AI Assistant Verification ---");

    const blogId = "1"; // Using mock blog ID 1
    const blogContent = "This is a test article about Web Development and React.";

    console.log("\n1. Testing getBlogSummary...");
    const summaryResult = await getBlogSummary(blogId, blogContent);
    console.log("Summary Result:", JSON.stringify(summaryResult, null, 2));

    console.log("\n2. Testing askQuestion...");
    const question = "What is this article about?";
    const questionResult = await askQuestion(blogId, question);
    console.log("Question Result:", JSON.stringify(questionResult, null, 2));

    console.log("\n--- Verification Complete ---");
    process.exit(0);
}

test().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
