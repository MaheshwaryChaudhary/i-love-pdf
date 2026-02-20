
import { GoogleGenAI } from "@google/genai";

export async function summarizeDocument(text: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize the following PDF text content into key bullet points and a brief overview. Be concise but informative.\n\nContent:\n${text}`,
  });
  return response.text;
}

export async function extractInsights(text: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep analysis of the following document text. Extract the main themes, key dates, important entities (names, organizations), and critical data points. Provide the output in a professional report format.\n\nContent:\n${text}`,
    });
    return response.text;
}

export async function compareDocuments(textA: string, textB: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Compare the following two document contents with high precision. Highlight the key differences, additions, and deletions between Document A and Document B. Provide a structured comparison report identifying semantic changes.\n\nDocument A:\n${textA}\n\nDocument B:\n${textB}`,
    });
    return response.text;
}

export async function fetchLatestPDFNews() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Generate 3 short, professional, and exciting news headlines about the PDF and digital document industry for 2025. Focus on AI, security, and productivity trends. Return exactly a JSON array of strings.",
    config: { 
      responseMimeType: "application/json"
    },
  });
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return ["AI Revolutionizing PDF Accessibility", "New Encryption Standards for 2025 Documents", "SignFlow Launches Real-time Collaboration Suite"];
  }
}
