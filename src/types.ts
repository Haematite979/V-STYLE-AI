export interface ColorPaletteItem {
  name: string;
  hex: string;
  role: string; // 'primary' | 'secondary' | 'accent' | 'neutral'
}

export interface DetectedItemInfo {
  name: string;
  category: string;
  vibes: string[];
  fabricAndTexture: string;
  colors: ColorPaletteItem[];
}

export interface OutfitItem {
  id: string; // Unique ID for key matching or coordinate tracking
  name: string;
  category: "top" | "shoes" | "accessory" | "outerwear" | "bag" | "uploaded_item";
  colorHex: string; // Suggested Hex code (e.g., "#2B2B2B")
  colorName: string; // Color name (e.g., "Classic Navy")
  description: string; // Why it works with the outfit
  iconName: "Shirt" | "Footprints" | "Sparkles" | "Briefcase" | "Glasses" | "Gem" | "ShoppingBag" | "Smile" | "Palette" | "User"; // Safe Lucide icon
  imagePrompt?: string; // Prompt used to optionally generate this specific piece OR the entire flat-lay
}

export interface OutfitOption {
  type: "Casual" | "Business" | "Night Out";
  title: string;
  vibe: string;
  description: string;
  items: OutfitItem[]; // Array of style elements for Flat-Lay composition
  stylingTips: string[];
  hairAndBeauty: string;
}

export interface StylingAnalysis {
  detectedItem: DetectedItemInfo;
  outfits: OutfitOption[];
}
