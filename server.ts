import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits so client base64 uploads are processed successfully
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint to analyze uploaded piece and return 3 outfit profiles
app.post("/api/stylist/analyze", async (req, res) => {
  try {
    const { image, mimeType, userPreferences } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({ error: "Missing image data or mimeType." });
    }

    // Strip out base64 header if present (e.g. "data:image/jpeg;base64,")
    let base64Data = image;
    if (image.includes("base64,")) {
      base64Data = image.split("base64,")[1];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Analyze this uploaded fashion item and design exactly 3 complete, highly styled outfit options (Casual, Business, Night Out) that feature this item as the core piece.
      
      Requirements for the outfits:
      1. For each outfit option, formulate a list of 4 additional coordinating pieces (such as tops, shoes, bags, accessories, or outerwear) that complete the "flat-lay" arrangement.
      2. Ensure each outfit item specifies a perfect color palette choice with an exact Hex Code match, descriptive color name, visual design detail description, and appropriate icon mapping.
      3. Focus on creative, high-fashion combinations, styling rules, and beauty/makeup styling guidance.
      
      Additional user styling preferences and constraints to follow strictly:
      "${userPreferences || "None provided. Give creative fashion-forward styling suggestions that bring out the best in the piece."}"`,
    };

    // System instruction to guide style persona and ensure reliable structure
    const systemInstruction = `You are a world-class fashion director and virtual wardrobe stylist.
    You analyze uploaded clothing items with meticulous precision, identifying their style profile, silhouette, fabric textures, and exact color palettes.
    You build exceptionally balanced, gorgeous, style-conscious outfits for three distinct occasions: 'Casual', 'Business', and 'Night Out'.
    You must output your complete analysis and outfit catalog as structured JSON conforming strictly to the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItem: {
              type: Type.OBJECT,
              properties: {
                name: { 
                  type: Type.STRING, 
                  description: "Specific descriptive name of the uploaded clothing item, e.g. 'Mustard Yellow Bohemian Pleated Skirt'" 
                },
                category: { 
                  type: Type.STRING, 
                  description: "Standard wardrobe category, e.g., Skirt, Top, Blazer, Dress, Trouser" 
                },
                vibes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 vibe tags, e.g. ['Parisian Chic', 'Boho Eclectic', 'Academic Minimalist']"
                },
                fabricAndTexture: { 
                  type: Type.STRING, 
                  description: "Perceived textile profile, e.g. 'Crepe crepe de chine with gentle vertical ribbing'" 
                },
                colors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Descriptive name of the color, e.g., 'Soft Marigold'" },
                      hex: { type: Type.STRING, description: "Hex Code starting with #, e.g. #EAA135" },
                      role: { type: Type.STRING, description: "Color utility: 'primary', 'secondary', 'accent', 'neutral'" }
                    },
                    required: ["name", "hex", "role"]
                  }
                }
              },
              required: ["name", "category", "vibes", "fabricAndTexture", "colors"]
            },
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { 
                    type: Type.STRING, 
                    description: "Must be: 'Casual' or 'Business' or 'Night Out'" 
                  },
                  title: { 
                    type: Type.STRING, 
                    description: "High-fashion title for this specific curated look, e.g. 'Sartorial Office Elegance' or 'Sunday Farmers Market Chic'" 
                  },
                  vibe: { 
                    type: Type.STRING, 
                    description: "One-sentence style descriptor of this outfit's core look, e.g. 'Warm tones meets relaxed tailored proportions.'" 
                  },
                  description: { 
                    type: Type.STRING, 
                    description: "A professional styling explanation of how these pieces balance and enhance the uploaded item." 
                  },
                  items: {
                    type: Type.ARRAY,
                    description: "Curated additional accompanying wardrobe elements that form the flat-lay setup",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: "A simple unique slug ID, e.g. 'cream-knit', 'black-clutch'" },
                        name: { type: Type.STRING, description: "Descriptive name of item, e.g., 'Structured Linen Cream Vest'" },
                        category: { 
                          type: Type.STRING, 
                          description: "Allowed values: 'top', 'shoes', 'accessory', 'outerwear', 'bag'" 
                        },
                        colorHex: { type: Type.STRING, description: "Color Match hex code starting with #" },
                        colorName: { type: Type.STRING, description: "Name of recommended hue, e.g. 'Muted Oatmeal'" },
                        description: { type: Type.STRING, description: "Why this item fits this styling, e.g. 'An oversized silhouette counters the fitted shape of the base skirt.'" },
                        iconName: { 
                          type: Type.STRING, 
                          description: "Allowed values: Shirt, Footprints, Sparkles, Briefcase, Glasses, Gem, ShoppingBag" 
                        },
                        imagePrompt: { 
                          type: Type.STRING, 
                          description: "Meticulous photographic flat-lay prompt of this concrete item laid down on a smooth sand backdrop, for rendering" 
                        }
                      },
                      required: ["id", "name", "category", "colorHex", "colorName", "description", "iconName", "imagePrompt"]
                    }
                  },
                  stylingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 key stylist suggestions, e.g., wearing cuffs rolled, tucking style"
                  },
                  hairAndBeauty: { 
                    type: Type.STRING, 
                    description: "Suggested complementary makeup, nail, or hairstyle look, e.g., 'A slicked low Bun with a cherry red lip'" 
                  }
                },
                required: ["type", "title", "vibe", "description", "items", "stylingTips", "hairAndBeauty"]
              }
            }
          },
          required: ["detectedItem", "outfits"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis Error Details:", error);
    res.status(500).json({
      error: error.message || "An error occurred during Gemini analysis.",
    });
  }
});

// Endpoint to generate a flat-lay image for a given outfit
app.post("/api/stylist/generate-image", async (req, res) => {
  try {
    const { outfitTitle, outfitVibe, elementsList, baseItemDescription, baseItemColors } = req.body;

    if (!outfitTitle || !elementsList) {
      return res.status(400).json({ error: "Missing outfit configuration parameters." });
    }

    // Design a beautiful flat-lay prompt
    const elementsPromptString = elementsList
      .map((item: any) => `- A ${item.colorName} ${item.name} (${item.category})`)
      .join("\n");

    const colorSchemeString = baseItemColors 
      ? baseItemColors.map((c: any) => c.name).join(", ") 
      : "complementing colors";

    const finalPrompt = `A high-end studio fashion flat-lay photograph of a perfectly styled outfit for "${outfitTitle}". 
    The outfit is curated around this base item: ${baseItemDescription}. 
    
    The flat-lay layout contains the following items arranged elegantly on a clean, solid neutral limestone studio backdrop:
    ${elementsPromptString}
    - The core uploaded item: ${baseItemDescription}
    
    Arrangement Style: Organized catalog portrait styling, clean flat-lay, designer mood board perspective. Crisp professional overhead studio lighting, minimal shadows, aesthetic and high fashion catalog. No models, clothing articles are elegantly folded, laid completely flat. Color theme features ${colorSchemeString}.`;

    console.log("Generating flat-lay with prompt:", finalPrompt);

    // Call Imagen-based generation
    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
    });

    if (response?.generatedImages?.[0]?.image?.imageBytes) {
      const base64Bytes = response.generatedImages[0].image.imageBytes;
      return res.json({ image: `data:image/jpeg;base64,${base64Bytes}` });
    } else {
      throw new Error("No image data returned from Gemini generation.");
    }
  } catch (error: any) {
    console.error("Image Generation Error Details:", error);
    // Return friendly error response
    res.status(500).json({
      error: error.message || "Imagen generation failed. This might require additional API settings.",
    });
  }
});

// Serve frontend assets
if (process.env.NODE_ENV !== "production") {
  const startVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started in development on http://localhost:${PORT}`);
    });
  };
  startVite();
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in production on port ${PORT}`);
  });
}
