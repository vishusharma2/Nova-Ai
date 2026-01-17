import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client for image generation
// The API key should be set as GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate an image using Gemini 2.5 Flash Image model
 * @param {string} prompt - Description of the image to generate
 * @returns {Promise<{success: boolean, imageData?: string, mimeType?: string, error?: string}>}
 */
export const generateImage = async (prompt) => {
  try {
    console.log("🎨 Starting image generation...");
    console.log("🎨 Prompt:", prompt);
    console.log("🎨 API Key available:", !!process.env.GEMINI_API_KEY);

    // Use Gemini 2.5 Flash Image model with responseModalities for IMAGE
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        responseModalities: ["IMAGE", "TEXT"]
      }
    });

    console.log("📦 Response received");
    console.log("📦 Response structure:", JSON.stringify(response, null, 2).substring(0, 500));

    // Check for image in response
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        console.log("📋 Parts count:", candidate.content.parts.length);
        
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            console.log("✅ Found image data!");
            console.log("📷 MimeType:", part.inlineData.mimeType);
            return {
              success: true,
              imageData: part.inlineData.data,
              mimeType: part.inlineData.mimeType || "image/png",
            };
          }
          if (part.text) {
            console.log("📝 Text part found:", part.text.substring(0, 100));
          }
        }
      }
    }

    console.log("❌ No image in response");
    return {
      success: false,
      error: "The model did not return an image. Your API plan may not include image generation.",
    };
  } catch (error) {
    console.error("❌ Image generation error:", error.message);
    console.error("❌ Full error:", error);
    
    return {
      success: false,
      error: error.message || "Failed to generate image",
    };
  }
};

/**
 * Check if a message is requesting image generation
 * @param {string} text - User message
 * @returns {boolean}
 */
export const isImageGenerationRequest = (text) => {
  const lowerText = text.toLowerCase().trim();
  
  const imageKeywords = [
    "generate image",
    "generate an image",
    "create image",
    "create an image",
    "make image",
    "make an image",
    "draw ",
    "draw me",
    "draw a",
    "generate picture",
    "create picture",
    "make picture",
    "generate photo",
    "create photo",
    "image of",
    "picture of",
    "photo of",
    "illustration of",
    "artwork of",
    "painting of",
    "show me an image",
    "show me a picture",
  ];

  const matches = imageKeywords.some(keyword => lowerText.includes(keyword));
  console.log("🔍 Image request check:", { text: lowerText.substring(0, 50), matches });
  return matches;
};

/**
 * Extract the image prompt from user message
 * @param {string} text - User message
 * @returns {string} - Cleaned prompt for image generation
 */
export const extractImagePrompt = (text) => {
  let prompt = text;
  
  // Remove common prefixes
  const prefixesToRemove = [
    /^(please\s+)?generate\s+(an?\s+)?image\s+(of\s+)?/i,
    /^(please\s+)?create\s+(an?\s+)?image\s+(of\s+)?/i,
    /^(please\s+)?make\s+(an?\s+)?image\s+(of\s+)?/i,
    /^(please\s+)?draw\s+(me\s+)?(an?\s+)?/i,
    /^(please\s+)?show\s+me\s+(an?\s+)?(image|picture|photo)\s+(of\s+)?/i,
  ];

  for (const regex of prefixesToRemove) {
    prompt = prompt.replace(regex, "");
  }

  return prompt.trim();
};

export default { generateImage, isImageGenerationRequest, extractImagePrompt };
