import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

console.log("Using API Key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
    try {
        const systemPrompt = `You are a senior technical interviewer. Generate exactly 5 interview questions for a React position at Easy difficulty. Return ONLY a JSON array of question strings in the format ["Question 1", "Question 2"], no extra text, backticks, or markdown formatting.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt
        });
        console.log("SUCCESS");
        console.log(response.text);
    } catch (e) {
        console.error("GEMINI ERROR:", e);
    }
}

main();
