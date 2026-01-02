
import { GoogleGenAI, Type } from "@google/genai";
import { LEBANON_CHURCHES } from "../data/mockData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartResponse = async (userInput: string) => {
  const systemInstruction = `
    You are an expert guide for Christian life in Lebanon. 
    You have access to a database of major churches and mass times.
    Your goal is to help users find the right mass time based on their natural language queries.
    
    Current database includes: ${JSON.stringify(LEBANON_CHURCHES)}
    
    If the user asks for a specific city, rite, or time, look through the database.
    If you find matches, mention them specifically.
    If you don't find a specific match, suggest similar churches or explain that Lebanon has many parishes and they should check the local bishopric for smaller villages.
    
    Keep responses friendly, helpful, and spiritually respectful. 
    Use cultural context (e.g., mention if it's a historic site like Harissa).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant is currently unavailable. Please use the manual filters below.";
  }
};
