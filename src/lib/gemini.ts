import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Extracts data from a prescription/document image.
 */
export async function extractPrescriptionInfo(imageDataUrl: string) {
  // Convert Data URL to base64 string
  const base64Data = imageDataUrl.split(',')[1];
  const mimeType = imageDataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

  const prompt = `You are an expert medical AI assistant.
Please analyze this prescription, medical bill, or healthcare document.
Extract the following key information and format it strictly as a JSON object (do not include markdown formatting like \`\`\`json):
{
  "patientName": "Extracted name or 'Unknown'",
  "condition": "Proposed diagnosis or main condition based on the document",
  "medications": ["Med 1", "Med 2"],
  "exercises": [
    {
      "name": "Exercise Name",
      "description": "Brief description of how to perform it properly.",
      "duration": "e.g., 3 sets of 10, or 5 minutes"
    }
  ],
  "summary": "A brief, professional 2-sentence summary of the evaluation."
}
Based on the identified condition and medications, recommend 3 specific physical rehabilitation exercises appropriate for the patient. Make sure they are generic enough to be safe but tailored to the likely condition.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        { role: 'user', parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType,
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    // Safety parse
    const data = JSON.parse(response.text.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim());
    return data;
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
}

/**
 * Analyzes posture from a webcam snapshot during session.
 */
export async function analyzePosture(imageDataUrl: string, exerciseName: string) {
  const base64Data = imageDataUrl.split(',')[1];
  const mimeType = imageDataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

  const prompt = `You are an AI physical therapy assistant monitoring a patient in real-time.
The patient is supposed to be performing: "${exerciseName}".
Look at the provided image.
Is their posture correct? What is one short, actionable piece of advice or feedback to fix their posture or encourage them?
Provide ONLY the short feedback text, no more than 1 sentence. Make it sound like a helpful coach. Example: "Straighten your back a bit more." or "Looks great, keep it up!"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using pro for better vision reasoning
      contents: [
        { role: 'user', parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType,
              }
            }
          ]
        }
      ]
    });
    return response.text?.trim() || "Keep up the good work.";
  } catch (error) {
    console.warn("Posture analysis failed, falling back.", error);
    return null;
  }
}
