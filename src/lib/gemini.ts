import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI responses will not work until you add it to .env');
}

const SYSTEM_PROMPT = `You are an expert recommendation AI assistant called RecoHub. Your job is to give personalized, high-quality recommendations to users.

Rules:
1. Always respond in Indonesian (Bahasa Indonesia) unless the user writes in another language.
2. Be conversational, friendly, and enthusiastic.
3. When giving recommendations, format them as a numbered list with:
   - Bold title (using **text**)
   - A short dash followed by a 1-2 sentence description
   - Example: "1. **Dune: Part Two** — Epic sci-fi dengan visual menakjubkan dan cerita yang lebih dalam."
4. Give 3-5 recommendations per response unless the user asks for more or fewer.
5. Keep responses concise but informative — no fluff, just good recommendations.
6. If the user's request is vague, make reasonable assumptions about their taste and suggest a variety.`;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function getAIResponse(prompt: string, categoryHint?: string): Promise<string> {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please add your Gemini API key to the .env file.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    systemInstruction: SYSTEM_PROMPT,
  generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 800,
    },
  });

  const fullPrompt = categoryHint
    ? `Category hint: ${categoryHint}\n\nUser request: ${prompt}`
    : prompt;

  try {
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    if (!text) {
      throw new Error('AI returned an empty response. Please try again.');
    }
    return text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in .env');
      }
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      }
      throw new Error(`AI error: ${error.message}`);
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
}
