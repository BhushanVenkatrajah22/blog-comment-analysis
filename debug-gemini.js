const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = envContent.split('\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        acc[key.trim()] = value;
    }
    return acc;
}, {});

const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log("Testing with API Key ending in:", apiKey.slice(-4));

async function listModels() {
    console.log("Fetching available models via REST API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        let output = "";
        if (data.models) {
            output += "Available Models:\n";
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    output += `- ${m.name}\n`;
                }
            });
        } else {
            output += "No models found in response.\n";
        }
        fs.writeFileSync('gemini-models.txt', output);
        console.log("Written models to gemini-models.txt");
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
