import { GoogleGenerativeAI } from "@google/generative-ai";

async function runTest() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in environment.");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'hello test'");
            const response = await result.response;
            console.log(`SUCCESS [${modelName}]: ${response.text()}`);
            break; // Stop at first success
        } catch (error: any) {
            console.error(`FAILED [${modelName}]:`, error.message);
            if (error.response) {
                console.error("Status:", error.status);
                console.error("Data:", JSON.stringify(error.errorDetails, null, 2));
            }
        }
    }
}

runTest();
