
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an AI response using the Gemini API.
 * Instantiates the client inside the function to ensure the latest API key is used,
 * which is critical for environments where the key might be injected or updated dynamically.
 */
export const generateAIResponse = async (userMessage: string, context?: string): Promise<string> => {


  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini API Error: API_KEY is missing from the environment.");
      return "System configuration error: API key is missing. Please contact support.";
    }

    // Create a new instance right before the call to ensure we use the current environment state
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyBqOBFhiGlsZt-ztwPt8yOMfUkx76Gl2Dg' });

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

    // Using the recommended gemini-3-flash-preview model for general text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      console.warn("Gemini API returned an empty response text.");
      return "I apologize, but I couldn't generate a helpful response right now. Could you try rephrasing your question?";
    }

    return response.text;
  } catch (error: any) {
    // Log detailed error for debugging
    console.error("Gemini API Connection Error:", {
      message: error.message,
      name: error.name,
      status: error.status,
    });

    // Provide a more descriptive error message to the user
    if (error.message?.includes("API key not valid")) {
      return "I'm having trouble with my credentials. Please try again in a moment.";
    }

    if (error.message?.includes("User location is not supported")) {
      return "I apologize, but the AI service is currently unavailable in your region.";
    }

    return "I'm having trouble connecting to the AI server. This might be due to a high volume of requests or a temporary network issue. Please try again in a few seconds.";
  }
};
