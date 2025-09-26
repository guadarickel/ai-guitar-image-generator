import { GoogleGenAI } from "@google/genai";

// The API key is injected by the Vite build process from GitHub Secrets.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This error will be more prominent during local development if the .env file is missing.
  // In production, the build will fail if the secret is not set.
  throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please create a .env file for local development or set a secret for production builds.");
}
const ai = new GoogleGenAI({ apiKey });

export const generateGuitarImages = async (description: string): Promise<string[]> => {
  try {
    const prompt = `Professional, high-resolution studio photograph of a ${description}. The guitar should be the main subject, centered, and shown in its entirety. The background should be a clean, solid light grey or white to emphasize the instrument's details. No text, watermarks, or other objects. Realistic lighting.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 3,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => img.image.imageBytes);
    }
    return [];
  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate images. Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating images.");
  }
};