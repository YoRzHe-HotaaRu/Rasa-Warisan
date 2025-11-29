import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DelicacyData } from "../types";

// Helper to convert file to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url part if present (e.g., "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const delicacySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Common English name of the food" },
    malayName: { type: Type.STRING, description: "Traditional Malay name" },
    description: { type: Type.STRING, description: "A brief, appetizing description" },
    category: { type: Type.STRING, enum: ['Kuih', 'Main Dish', 'Beverage', 'Dessert', 'Condiment', 'Unknown'] },
    originRegion: { type: Type.STRING, description: "State or region in Malaysia/Nusantara where it is most famous" },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          amount: { type: Type.STRING }
        }
      }
    },
    recipeSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    history: { type: Type.STRING, description: "Cultural significance and historical background" },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Cooking tips or how to choose the best version"
    },
    pairing: { type: Type.STRING, description: "Best drink or side dish to serve with this" },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.STRING },
        fat: { type: Type.STRING },
        carbs: { type: Type.STRING }
      }
    },
    flavorProfile: {
      type: Type.OBJECT,
      description: "Scale of 0-10 for each flavor",
      properties: {
        sweet: { type: Type.NUMBER },
        salty: { type: Type.NUMBER },
        spicy: { type: Type.NUMBER },
        sour: { type: Type.NUMBER },
        bitter: { type: Type.NUMBER }
      }
    },
    confidence: { type: Type.NUMBER, description: "Confidence score 0-100 that this is indeed a Malay delicacy" }
  },
  required: ["name", "malayName", "description", "category", "ingredients", "recipeSteps", "history", "nutrition", "flavorProfile"]
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<DelicacyData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `Analyze this image. It should be a Malaysian traditional delicacy (Kuih, Dish, etc.). 
            Provide detailed information about it. 
            If it is NOT a food item or clearly not related to Malay/Nusantara cuisine, set the category to 'Unknown' and confidence to 0.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: delicacySchema,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as Omit<DelicacyData, 'id' | 'timestamp'>;
    
    return {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
