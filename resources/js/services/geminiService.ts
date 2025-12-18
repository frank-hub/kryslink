import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client. Direct access to process.env.API_KEY is required.
const ai = new GoogleGenAI({ apiKey:'AIzaSyC4JyidwjZ9UvB5fPve4oO-pX_MO-7KQ2A' });

export const generateAIResponse = async (userMessage: string, context?: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are "Daktari AI", a helpful and knowledgeable pharmaceutical assistant for MediConnect Kenya.

      Your goal is to assist Pharmacists and Hospital Administrators in finding medicines, understanding generic alternatives, and navigating regulatory requirements in Kenya (PPB/KRA).

      Key traits:
      - Professional yet approachable.
      - Knowledgeable about Kenyan pharmaceutical brands and generics.
      - Helpful with bulk ordering queries.

      Current Context (User is browsing): ${context || 'General inquiry'}

      If asked about medical advice, strictly disclaim that you are an AI for procurement assistance, not a doctor.
      Keep responses concise (under 100 words unless detailed explanation needed).
    `;

    // Always use ai.models.generateContent and select the appropriate model for general text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again.";
  }
};
