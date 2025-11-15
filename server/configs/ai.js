import OpenAI from "openai";

const geminiAI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL:  process.env.GEMINI_BASE_URL
});

export default geminiAI;