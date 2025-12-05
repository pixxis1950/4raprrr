import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorParams, Post } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogPost = async (params: GeneratorParams): Promise<Partial<Post>> => {
  const modelId = "gemini-2.5-flash"; // Optimized for speed/quality balance
  
  const systemInstruction = `
    You are a veteran hip-hop journalist and editor for a high-energy rap culture blog called 4RAP.CZ.
    Your style is authentic, knowledgeable, and engaging. You use slang appropriately but keep it readable.
    You strictly adhere to facts.
    
    You are generating a blog post structure. 
    The 'content' field must be formatted in clean Markdown.
    Use H2 (##) for section headers.
    Include a list of key tracks or albums if relevant.
    Language: Czech (Čeština).
  `;

  const prompt = `
    Topic: ${params.topic}
    Category: ${params.category}
    Tone: ${params.tone}
    
    Write a complete blog post.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy, uppercase headline" },
            excerpt: { type: Type.STRING, description: "Short, punchy summary (max 2 sentences)" },
            content: { type: Type.STRING, description: "Full blog post in Markdown format" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "5 relevant tags" 
            },
            suggestedImageQuery: { type: Type.STRING, description: "A search query to find a relevant image for this post" }
          },
          required: ["title", "excerpt", "content", "tags", "suggestedImageQuery"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        date: new Date().toISOString().split('T')[0],
        author: "AI GEN",
        category: params.category,
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        // Use a placeholder image based on the query, pseudo-randomized
        imageUrl: `https://picsum.photos/seed/${data.suggestedImageQuery.replace(/\s/g, '')}/800/600`
      };
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};