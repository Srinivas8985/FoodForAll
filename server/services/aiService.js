const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini API
// Ideally this should be in .env, but for now we follow user instruction or fallback to env
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAa0EQnqDg6GpcR0QqxhQBb_Xjepvfsmu0";
const ai = new GoogleGenAI({ apiKey });

const generateHungerInsights = async (data) => {
    try {
        const prompt = `
        You are an AI assistant for a food donation platform called "Food For All".
        Analyze the following hunger data and providing actionable insights for NGOs and Admins.
        
        Data:
        ${JSON.stringify(data, null, 2)}
        
        Please provide:
        1. A brief summary of the current hunger situation.
        2. Top 3 critical areas requiring immediate attention.
        3. Specific recommendations for food distribution (types of food, timing, etc.).
        4. Any patterns or anomalies you detect.
        
        Keep the response concise, professional, and formatted in Markdown.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // The new SDK returns object with .text property or nested structure
        // Based on user sample: console.log(response.text);
        return response.text;

    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("Failed to generate AI insights. Please try again later.");
    }
};

module.exports = {
    generateHungerInsights
};
