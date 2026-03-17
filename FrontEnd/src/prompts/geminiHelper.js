import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getChatbotReply(messages, currentProblemId) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return "Error: API key is missing. Please check your .env file.";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const systemInstruction = `You are Clyric, a LeetCode-style DSA hint assistant.
RULES:
1. The user is working on problem ID: ${currentProblemId || 'Unknown'}. Use this context.
2. ONLY answer DSA, algorithms, data structures, complexity, debugging logic, and interview-style questions.
3. If the user asks about anything unrelated (general chat, jokes, essays, unrelated coding), politely refuse and say: "I’m here to help only with DSA problems, hints, approaches, and interview-style guidance."
4. DO NOT give full code solutions immediately. Prefer hint-first guidance.
5. Provide hints, intuition, edge cases, or time/space complexity clues step-by-step.
6. Format your responses cleanly using Markdown. Use short paragraphs, bullet points, and bold text for headers like **Hint**, **Common Mistake**, or **Complexity Clue**.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemInstruction
        });

        // Convert our React UI history into the exact format the SDK expects
        const formattedHistory = messages.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const result = await model.generateContent({
            contents: formattedHistory,
            generationConfig: {
                temperature: 0.2 // Keeps answers analytical and focused
            }
        });

        return result.response.text();

    } catch (error) {
        console.error("Gemini SDK Error:", error);
        return `Connection error: ${error.message}. Please check your console.`;
    }
}