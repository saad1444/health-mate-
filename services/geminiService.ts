import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary_en: {
      type: Type.STRING,
      description: "A concise summary of the medical report in English. Focus on key findings.",
    },
    summary_ur: {
      type: Type.STRING,
      description: "A translation of the summary into Roman Urdu. Keep it simple and conversational (e.g., 'Aapki report mein...').",
    },
    abnormalities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of abnormal values found (e.g., 'High Blood Sugar', 'Low Hemoglobin').",
    },
    doctor_questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 important questions the patient should ask their doctor based on this report.",
    },
    diet_advice: {
      type: Type.STRING,
      description: "Brief dietary suggestions based on the findings (in mixed English/Roman Urdu).",
    },
    home_remedies: {
      type: Type.STRING,
      description: "Safe, general home remedies or lifestyle changes (in mixed English/Roman Urdu).",
    },
    disclaimer: {
      type: Type.STRING,
      description: "A safety disclaimer in Roman Urdu stating this is AI and not a doctor replacement.",
    },
  },
  required: ["summary_en", "summary_ur", "abnormalities", "doctor_questions", "diet_advice", "home_remedies", "disclaimer"],
};

export const analyzeMedicalReport = async (base64Image: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are HealthMate, a helpful medical assistant. 
    Analyze the provided image of a medical report. 
    Provide a clear explanation in both English and Roman Urdu.
    Be empathetic and reassuring. 
    If the image is not a medical report, please state that in the summary.
  `;

  // Remove data:image/png;base64, prefix if present
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';')) || 'image/png';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an empathetic medical assistant for Indian/Pakistani families. Use simple language.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text) as AIAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};