import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  Trash2, 
  Camera, 
  HelpCircle,
  Palette, 
  Sliders, 
  Shirt, 
  Briefcase, 
  Sparkle, 
  Maximize2,
  Bookmark,
  Heart,
  Calendar,
  Layers,
  Zap
} from "lucide-react";
import { StylingAnalysis, OutfitOption } from "./types";
import FlatLayCanvas from "./components/FlatLayCanvas";

// Preset items that users can click to instantly experience the Bento Grid Virtual Stylist
const PRESET_ITEMS = [
  {
    id: "emerald-skirt",
    name: "Emerald Green Satin Pleated Skirt",
    category: "Skirt",
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23122c22'/><circle cx='200' cy='200' r='100' fill='%231b4d3e' opacity='0.7'/><path d='M120 120 L280 120 L300 320 L100 320 Z' fill='%23194537' stroke='%23348c6f' stroke-width='3'/><path d='M140 120 L140 320 M170 120 L180 320 M200 120 L200 320 M230 120 L220 320 M260 120 L260 320' stroke='%23123329' stroke-width='2' opacity='0.5'/></svg>",
    analysis: {
      detectedItem: {
        name: "Emerald Green Satin Pleated Skirt",
        category: "Skirt",
        vibes: ["Romantic Modernist", "Effortless Luxe", "Sartorial Contrast"],
        fabricAndTexture: "High-shine silk satin with dense accordion micro-pleating and fluid midi length drape.",
        colors: [
          { name: "Forest Emerald", hex: "#1B4D3E", role: "primary" },
          { name: "Oyster Lustre", hex: "#E8E6E0", role: "neutral" },
          { name: "Golden Amber", hex: "#C5A059", role: "accent" }
        ]
      },
      outfits: [
        {
          type: "Casual",
          title: "Sunday Farmer's Market Casual Luxe",
          vibe: "Warm tones meet relaxed fluid proportions.",
          description: "An oversized heavy-knit oatmeal sweater contrasts beautifully with the fluid, pleated silk skirt. Sleek minimal leather sneakers add effortless ground chic.",
          items: [
            {
              id: "cream-knit",
              name: "Oversized Cream Heavy-Knit Sweater",
              category: "top",
              colorHex: "#E8E6E1",
              colorName: "Alabaster Oatmeal",
              description: "The chunky, heavy texture of the cotton-wool blend grounds the silky elegance of the skirt.",
              iconName: "Shirt",
              imagePrompt: "Cozy thick-threaded cream oversized wool sweater folded next to satin"
            },
            {
              id: "white-sneakers",
              name: "Minimal White Leather Low-Top Trainers",
              category: "shoes",
              colorHex: "#FFFFFF",
              colorName: "Chalk White",
              description: "Provides an athletic, youthful counterweight to the evening feeling of satin.",
              iconName: "Footprints",
              imagePrompt: "Luxury Italian white leather tennis sneakers with a beige rubber sole"
            },
            {
              id: "canvas-tote",
              name: "Structured Canvas Utility Tote Bag",
              category: "bag",
              colorHex: "#DCD9CE",
              colorName: "Raw Flax",
              description: "Adds storage convenience while keeping the overall palette organic and down-to-earth.",
              iconName: "ShoppingBag",
              imagePrompt: "Heavy raw structured cotton canvas tote handbag flatlay"
            },
            {
              id: "amber-shades",
              name: "Acetate Amber Rectangular Sunglasses",
              category: "accessory",
              colorHex: "#C5A059",
              colorName: "Honey Amber",
              description: "Creates an intelligent, high-contrast point of warm golden elegance at eye-level.",
              iconName: "Glasses",
              imagePrompt: "Glossy tortoise amber shell colored luxury designer sunglasses"
            }
          ],
          stylingTips: [
            "French-tuck the front corner of the chunky knit into the waistband to define your silhouette.",
            "Roll up the sweater sleeves loosely and stack thin golden minimalist bands."
          ],
          hairAndBeauty: "A relaxed low bun with soft tendrils framing the face, accompanied by hydrated, dewy skin."
        },
        {
          type: "Business",
          title: "Creative Agency Executive Office",
          vibe: "Structured tailoring balances fluid movement.",
          description: "A customized charcoal-wool boxy blazer defines the shoulder profile, while an oyster silk camisole keeps the collar feel feminine and professional.",
          items: [
            {
              id: "tailored-blazer",
              name: "Charcoal Structured Oversized Wool Blazer",
              category: "outerwear",
              colorHex: "#35363A",
              colorName: "Rich Charcoal",
              description: "Sharp shoulder pads and masculine tailoring anchor the flowing skirt for professional authority.",
              iconName: "Briefcase",
              imagePrompt: "Structured thick charcoal grey wool blazer with horn buttons flatlay"
            },
            {
              id: "silk-cami",
              name: "Tucked Mulberry Silk Camisole",
              category: "top",
              colorHex: "#EEEBE5",
              colorName: "Oyster Pearl",
              description: "Ensures a polished luster line underneath the lapels of the blazer.",
              iconName: "Shirt",
              imagePrompt: "Delicate shell grey satin camisole top folded elegantly"
            },
            {
              id: "leather-loafers",
              name: "Nappa Leather Pointed-Toe Loafers",
              category: "shoes",
              colorHex: "#1C1C1E",
              colorName: "Obsidian Black",
              description: "Adds a sleek modern architectural footnote. Polishes the hemline.",
              iconName: "Footprints",
              imagePrompt: "Polished black luxury dress loafers pointing upward"
            },
            {
              id: "totem-necklace",
              name: "Sculptural Brass Collar Choker",
              category: "accessory",
              colorHex: "#BFA56E",
              colorName: "Antiquated Gold",
              description: "An statement neckware piece that frames the face with confidence and minimal weight.",
              iconName: "Gem",
              imagePrompt: "Polished organic abstract thick gold ring jewelry flat lay"
            }
          ],
          stylingTips: [
            "Keep the blazer completely open to let the pleated skirt's vertical lines elongate your look.",
            "Throw your work documents in a structured leather attache case."
          ],
          hairAndBeauty: "A sleek, center-parted mid-ponytail and an exquisite terracotta lip stain."
        },
        {
          type: "Night Out",
          title: "Nocturnal Gallery Opening VIP",
          vibe: "High drama, jewel tones, and sheer textures.",
          description: "A sheer black asymmetric lace bodysuit matches the skirt's rich green underlay. Complete with gold chain stiletto sandals.",
          items: [
            {
              id: "sheer-bodysuit",
              name: "Asymmetrical Sheer Corded Lace Bodysuit",
              category: "top",
              colorHex: "#111111",
              colorName: "Sable Black",
              description: "Delicate mesh and structured floral outline frame the shoulders with romantic darkness.",
              iconName: "Shirt",
              imagePrompt: "Exquisite patterned dark lace evening bodysuit top flat"
            },
            {
              id: "chain-stilettos",
              name: "Metallic Gold Cage Chain Stilettos",
              category: "shoes",
              colorHex: "#D4AF37",
              colorName: "Liquid Gold",
              description: "Draws eye-catching luxury down to the feet, complementing the green and black pairing.",
              iconName: "Footprints",
              imagePrompt: "Luxury ankle wrap gold chain high heel sandal shoes"
            },
            {
              id: "suede-clutch",
              name: "Architectural Suede Envelope Clutch",
              category: "bag",
              colorHex: "#1A2521",
              colorName: "Deep Forest",
              description: "Echoes the skirt's emerald base in a soft matte texture.",
              iconName: "ShoppingBag",
              imagePrompt: "Hard shell angular clutch bag made of fine forest green velvet"
            },
            {
              id: "drop-earrings",
              name: "Malachite Drop Chandelier Earrings",
              category: "accessory",
              colorHex: "#1B4D3E",
              colorName: "Malachite Swirl",
              description: "Adds mesmerizing weightless shimmer near the shoulders.",
              iconName: "Gem",
              imagePrompt: "Pair of fine green stone and gold chandelier jewelry earrings"
            }
          ],
          stylingTips: [
            "Use a high-waisted wide leather corset belt to define the skirt waistband tightly.",
            "Drape a textured velvet bomber jacket over your shoulders instead of wearing it."
          ],
          hairAndBeauty: "Gothic Hollywood waves with a rich, dark Burgundy lipstick and deep chocolate nails."
        }
      ]
    }
  },
  {
    id: "mustard-blazer",
    name: "Goldenrod Velvet Double-Breasted Blazer",
    category: "Blazer",
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%236e4f16'/><circle cx='200' cy='200' r='110' fill='%23926e25' opacity='0.6'/><path d='M130 110 L270 110 L290 310 L110 310 Z' fill='%23aa8028' stroke='%23f4c45b' stroke-width='4'/><path d='M150 110 L170 310 M250 110 L230 310' stroke='%23705315' stroke-width='2'/><circle cx='170' cy='180' r='6' fill='%23ffebaa'/><circle cx='230' cy='180' r='6' fill='%23ffebaa'/><circle cx='165' cy='230' r='6' fill='%23ffebaa'/><circle cx='235' cy='230' r='6' fill='%23ffebaa'/></svg>",
    analysis: {
      detectedItem: {
        name: "Goldenrod Velvet Double-Breasted Blazer",
        category: "Blazer",
        vibes: ["Academic Retro", "Eclectic Intellectual", "Aesthetic Warmth"],
        fabricAndTexture: "Lustrous heavy cotton velvet pile with wide structured peak lapels and tortoiseshell buttons.",
        colors: [
          { name: "Vintage Mustard", hex: "#AA8028", role: "primary" },
          { name: "Cacao Brown", hex: "#422817", role: "secondary" },
          { name: "Cream Wool", hex: "#F3EFE9", role: "neutral" }
        ]
      },
      outfits: [
        {
          type: "Casual",
          title: "Art Gallery Afternoon Stroll",
          vibe: "Ivy League tailored meet off-duty denim.",
          description: "Laidback luxury: combine the golden fleece blazer with dynamic light-wash denim trousers, vintage brown leather loafers, and a comfortable knit tank.",
          items: [
            {
              id: "denim-trousers",
              name: "Wide-Leg Mid-Wash Denim Jeans",
              category: "top",
              colorHex: "#7796B8",
              colorName: "Bleached Indigo",
              description: "Relaxed vintage wash structures down the high fashion glare of velvet.",
              iconName: "Shirt",
              imagePrompt: "Light wash premium denim high rise straight trousers laid flat"
            },
            {
              id: "ribbed-tank",
              name: "Cream Ribbed Cotton Tank Top",
              category: "top",
              colorHex: "#F3EFE9",
              colorName: "Oatmeal Milk",
              description: "A highly breathing, structured baselayer that feels light and effortlessly simple.",
              iconName: "Shirt",
              imagePrompt: "Ivory white fitted fine knit tank top laid out flat"
            },
            {
              id: "retro-sneakers",
              name: "Leather Heritage Earth-Tone Trainers",
              category: "shoes",
              colorHex: "#8B5A2B",
              colorName: "Cognac Tan",
              description: "Provides easy comfort and echoes the golden blazer's warm notes.",
              iconName: "Footprints",
              imagePrompt: "Retro brown and cream leather gum sole trainers"
            },
            {
              id: "vintage-watch",
              name: "Art-Deco Square Gold Watch",
              category: "accessory",
              colorHex: "#AA8028",
              colorName: "Polished Brass",
              description: "Frames the wrist with elegant literary style.",
              iconName: "Gem",
              imagePrompt: "Vintage luxury square gold face wristwatch with leather strap"
            }
          ],
          stylingTips: [
            "Push the blazer sleeves up to your elbows loosely to reveal a watch and dynamic bangles.",
            "Slip a small leather bound sketchbook in the oversized side pocket."
          ],
          hairAndBeauty: "Hair in a messy claw-clip with a natural peach tint lip balm and amber brown eyeliner."
        },
        {
          type: "Business",
          title: "Creative Boardroom Panel Presentation",
          vibe: "Bold sartorial warmth with crisp contrast.",
          description: "Look sharp yet endlessly warm. Pair the mustard velvet blazer with heavy pleated brown trousers, a crisp white poplin shirt, and structured dark office accessories.",
          items: [
            {
              id: "brown-pants",
              name: "High-Waisted Espresso Pleated Trouser",
              category: "top",
              colorHex: "#422817",
              colorName: "Espresso Brown",
              description: "Densely woven formal trousers that ground the golden sheen of the blazer with office-appropriate weight.",
              iconName: "Shirt",
              imagePrompt: "Dark chocolate tailored wool pleated mens style trousers"
            },
            {
              id: "crisp-poplin",
              name: "White Over-Engineered Poplin Buttondown",
              category: "top",
              colorHex: "#FFFFFF",
              colorName: "Starch White",
              description: "A sharp, highly ironed structured collar that cuts a modern crisp frame under the lapels.",
              iconName: "Shirt",
              imagePrompt: "Classic white tailored cotton formal button up shirt folded"
            },
            {
              id: "oxford-loafers",
              name: "Spazzolato Burgundy Leather Loafers",
              category: "shoes",
              colorHex: "#5E1914",
              colorName: "Oxblood Red",
              description: "Infuses a complementary deep cherry layer for sophisticated boardroom design.",
              iconName: "Footprints",
              imagePrompt: "Burgundy high shine luxury leather horsebit loafer shoes"
            },
            {
              id: "glasses",
              name: "Classic Tortoise Shell Optical Frame",
              category: "accessory",
              colorHex: "#3A2E2B",
              colorName: "Warm Tortoise",
              description: "Injects instant design-focused intelligence to your workspace silhouette.",
              iconName: "Glasses",
              imagePrompt: "Sleek round acetate tortoiseshell eyeglass frame flatlay"
            }
          ],
          stylingTips: [
            "Tuck the shirt tightly and buckle with a thin brown belt featuring a gold buckle.",
            "Let the blazer buttons stay open to allow relaxed hip mobility."
          ],
          hairAndBeauty: "A sharp, straight middle part slicked down, paired with a dusty rose lip matte and matte complexion."
        },
        {
          type: "Night Out",
          title: "Velvet VIP Lounge Evening",
          vibe: "High contrast, dark metallic nightwear.",
          description: "A dangerous, sleek contrast: Pair the golden jacket with a liquid silk black slip dress, sheer black knee socks, and sharp metallic accessories.",
          items: [
            {
              id: "silk-slip",
              name: "Black Liquid Charmeuse Midi Slip Dress",
              category: "top",
              colorHex: "#111111",
              colorName: "Nocturnal Black",
              description: "Adds a fluid, glistening column under the chunky structured blazer.",
              iconName: "Shirt",
              imagePrompt: "Luxury satin bias cut black midi silk dress flatlay"
            },
            {
              id: "pointed-heels",
              name: "Patent Leather Pointed-Toe Slingbacks",
              category: "shoes",
              colorHex: "#1E1E24",
              colorName: "High Gloss Black",
              description: "Catches glimmers from the club lighting while maintaining architectural lines.",
              iconName: "Footprints",
              imagePrompt: "Glossy black patent leather kitten heels slingback shoes"
            },
            {
              id: "gold-earrings",
              name: "Chunk Molten Gold Statement Earrings",
              category: "accessory",
              colorHex: "#D4AF37",
              colorName: "Yellow Gold",
              description: "Draws out the velvet’s golden glow with heavy luxury shine.",
              iconName: "Gem",
              imagePrompt: "Draped luxury heavy gold earrings jewelry accessory flat"
            },
            {
              id: "micro-bag",
              name: "Metallic Hardcase Evening Clutch",
              category: "bag",
              colorHex: "#F2E3C6",
              colorName: "Florentine Gold",
              description: "Holds the essentials with a sleek jewelry-like finish.",
              iconName: "ShoppingBag",
              imagePrompt: "Tiny hard shell gold evening handbag clutch box flat"
            }
          ],
          stylingTips: [
            "Wear the blazer lazily draped over your shoulders and allow the silk slip straps to feature.",
            "Stack solid gold geometric bangles on a single forearm."
          ],
          hairAndBeauty: "Tousled textured beach waves or dark bold smokey-eye shadow and dark nude lips."
        }
      ]
    }
  }
];

export default function App() {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Custom styling text guidelines
  const [userPreferences, setUserPreferences] = useState<string>("");
  
  // Overall analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StylingAnalysis | null>(null);

  // Active outfit scenario tab ("Casual" | "Business" | "Night Out")
  const [selectedOutfitTab, setSelectedOutfitTab] = useState<"Casual" | "Business" | "Night Out">("Casual");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set preset directly to save time and showcase amazing outfits right away
  const handleSelectPreset = (presetId: string) => {
    setImageFile(null);
    const preset = PRESET_ITEMS.find(p => p.id === presetId);
    if (preset) {
      setActivePreset(preset.id);
      setImagePreview(preset.image);
      setAnalysisResult(preset.analysis as unknown as StylingAnalysis);
      setAnalysisError(null);
      setSelectedOutfitTab("Casual");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActivePreset(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setActivePreset(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setUserPreferences("");
  };

  const handleTriggerAnalysis = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      // Find mimeType from image representation
      let mimeType = "image/jpeg";
      if (imagePreview.startsWith("data:")) {
        const parts = imagePreview.split(",");
        const match = parts[0].match(/:(.*?);/);
        if (match) mimeType = match[1];
      }

      const response = await fetch("/api/stylist/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imagePreview,
          mimeType: mimeType,
          userPreferences: userPreferences,
        }),
      });

      const data = await response.json();
      if (response.ok && data.detectedItem) {
        setAnalysisResult(data as StylingAnalysis);
        setSelectedOutfitTab("Casual");
      } else {
        throw new Error(data.error || "Gemini could not categorize this item. Please ensure it's a clear photo of an outfit.");
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisError(
        err.message || "An unexpected issue occurred while analyzing with Gemini. Please try a different photo, or feel free to experience the Virtual Studio with one of our luxury presets below!"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentOutfit = analysisResult?.outfits.find(o => o.type === selectedOutfitTab);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col selection:bg-neutral-800 selection:text-white" id="virtual-stylist-app">
      {/* Header Area */}
      <header className="flex justify-between items-center px-6 lg:px-12 py-5 bg-white border-b border-[#E5E5E1] sticky top-0 z-40" id="app-header">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-display font-black text-sm uppercase italic tracking-tighter">Vs</span>
          </div>
          <div>
            <h1 className="font-display font-medium text-lg uppercase tracking-tight text-neutral-950">V-Style AI</h1>
            <p className="text-[9.5px] font-mono tracking-widest text-[#717171] uppercase">Studio Virtual Stylist</p>
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-xs font-mono font-bold uppercase tracking-widest text-[#717171]" id="nav-links">
          <span className="text-black border-b border-black pb-0.5">Workspace</span>
          <span className="opacity-40 cursor-not-allowed">My Wardrobe</span>
          <span className="opacity-40 cursor-not-allowed">Collections</span>
        </div>

        <div className="flex items-center gap-3">
          {imagePreview && (
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-[#E5E5E1] text-[#717171] hover:text-black hover:border-black rounded-full text-[11px] font-mono uppercase tracking-wider transition-all"
              id="clear-btn"
            >
              Reset Studio
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-[11px] font-bold rounded-full uppercase tracking-wider transition-all flex items-center gap-2"
            id="header-upload-btn"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Garment
          </button>
        </div>
      </header>

      {/* Styled File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Main Content Areas - Bento Grid Viewport */}
      <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-5" id="bento-container">
        
        {/* BENTO CARD 1: Upload / Active Garment Frame (col-span-4) */}
        <section 
          className="md:col-span-4 bg-white rounded-3xl border border-[#E5E5E1] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group min-h-[480px]"
          id="bento-card-upload"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#717171]">Workspace Source</span>
                <h3 className="text-xl font-serif font-semibold italic text-neutral-800 leading-tight">
                  {analysisResult?.detectedItem?.name || "Target Garment"}
                </h3>
              </div>
              <div className="px-2.5 py-1 bg-[#FAF9F6] border border-[#E5E5E1] rounded-md text-[9px] font-mono text-neutral-500 uppercase">
                {activePreset ? `PRESET: ${activePreset}` : "CUSTOM"}
              </div>
            </div>

            {/* Main Picture Box with elegant border/shadow */}
            <div className="bg-[#FAF9F6] border border-[#E5E5E1] rounded-2xl h-[280px] relative overflow-hidden flex items-center justify-center transition-all p-4">
              {imagePreview ? (
                <div className="w-full h-full relative group">
                  <img
                    src={imagePreview}
                    alt="Target garment inside workspace"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Absolute subtle watermark grid lines */}
                  <div className="absolute inset-0 border border-neutral-300/20 rounded-xl pointer-events-none" />
                </div>
              ) : (
                /* Beautiful Drag-and-drop / Upload placeholder */
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-[#E5E5E1] hover:border-[#1A1A1A] rounded-xl flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all bg-white hover:bg-neutral-50/70"
                >
                  <div className="w-14 h-14 bg-[#FAF9F6] border border-[#E5E5E1] rounded-2xl flex items-center justify-center mb-4 text-[#717171] group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Bring Your Wardrobe</h4>
                  <p className="text-[11px] text-[#717171] max-w-xs mt-1 leading-relaxed">
                    Upload a flat photo, mockup, or take a picture of any item (skirt, jacket, blazer, dress) to style coordinates.
                  </p>
                  <span className="inline-block mt-4 text-[10px] bg-neutral-900 text-white font-mono px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
                    Choose Image File
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info text / Previews below garment */}
          <div className="mt-6 pt-5 border-t border-[#E5E5E1] flex flex-col gap-2.5">
            {analysisResult?.detectedItem?.fabricAndTexture ? (
              <div className="text-xs font-serif italic text-neutral-600">
                <span className="font-mono font-bold text-[9.5px] uppercase tracking-wider text-[#717171] block not-italic">Textile Descriptor</span>
                "{analysisResult.detectedItem.fabricAndTexture}"
              </div>
            ) : (
              <p className="text-[11px] text-[#717171] italic text-center">
                “A true styling companion knows your textures before recommending complementary pairings.”
              </p>
            )}
          </div>
        </section>

        {/* BENTO CONTAINER FOR STYLING PARAMETERS & RESULTS */}
        <section className="md:col-span-8 grid grid-cols-1 md:grid-cols-8 gap-5" id="bento-right-blocks">
          
          {/* BENTO CARD 2: Prompt / Custom Directives (col-span-4) */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-[#E5E5E1] p-5 flex flex-col justify-between shadow-sm" id="bento-card-parameters">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-[#717171]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Aesthetic Directives</h3>
              </div>
              <p className="text-[11px] text-[#717171] leading-relaxed mb-4">
                Suggest particular moods, dress codes, seasonal preferences, or color pairings for Gemini.
              </p>

              <textarea
                value={userPreferences}
                onChange={(e) => setUserPreferences(e.target.value)}
                placeholder="e.g., 'Creative Minimalist. Prioritize gold accessories, avoid high heels, prefer retro styling rules.'"
                rows={4}
                className="w-full text-xs p-3.5 bg-[#FAF9F6] border border-[#E5E5E1] focus:border-black focus:ring-1 focus:ring-black outline-none rounded-2xl resize-none font-sans leading-relaxed"
                id="preferences-textarea"
              />
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between gap-3">
              <span className="text-[10px] text-[#717171] italic">
                {imagePreview ? "Ready to weave styles." : "Waiting for base garment."}
              </span>

              {imagePreview && (
                <button
                  onClick={handleTriggerAnalysis}
                  disabled={isAnalyzing}
                  className="px-5 py-3 bg-[#1A1A1A] text-white hover:bg-black font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                  id="spark-ai-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Weave Style Guides
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* BENTO CARD 3: AI Color & Hue Analysis (col-span-4) */}
          <div className="md:col-span-4 bg-[#1A1A1A] rounded-3xl p-6 text-white flex flex-col justify-between shadow-md" id="bento-card-colorflow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Dominant Color Swatches</h3>
                </div>
                <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#717171] bg-white/10 px-2 py-0.5 rounded">HEX CODES</span>
              </div>

              {analysisResult?.detectedItem?.colors ? (
                <div className="grid grid-cols-1 gap-3">
                  {analysisResult.detectedItem.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-7 h-7 rounded-lg border border-white/20 inline-block shadow-sm shrink-0" 
                          style={{ backgroundColor: color.hex }} 
                        />
                        <div>
                          <p className="text-xs font-medium text-white">{color.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono uppercase font-bold">{color.hex}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-neutral-300">
                        {color.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  <div className="w-12 h-12 bg-white/5 border border-neutral-800 rounded-full flex items-center justify-center m-auto mb-3">
                    <Palette className="w-5 h-5" />
                  </div>
                  <p className="text-xs max-w-[200px] m-auto leading-relaxed">
                    AI color balance analyzer will outline hex swatches once processed.
                  </p>
                </div>
              )}
            </div>

            {/* Vibe Tags at bottom of color card */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap gap-1.5">
              {analysisResult?.detectedItem?.vibes ? (
                analysisResult.detectedItem.vibes.map((v, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white/10 text-white rounded-full text-[9px] font-mono uppercase tracking-wider">
                    🍀 {v}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2.5 py-1 bg-white/5 text-neutral-600 rounded-full text-[9.5px] font-mono uppercase">Vibe Outline</span>
                  <span className="px-2.5 py-1 bg-white/5 text-neutral-600 rounded-full text-[9.5px] font-mono uppercase">Silhouette</span>
                </>
              )}
            </div>
          </div>

          {/* BENTO CARD 4: Quick Play / Presets Selection (col-span-full / col-span-8) */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-[#E5E5E1] p-6 shadow-sm flex flex-col justify-between" id="bento-card-presets-catalog">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#717171]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#717171]">Stylist Demo Catalogue</h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Select to test immediately</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESET_ITEMS.map((item) => {
                const isActive = activePreset === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id)}
                    className={`border rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer select-none transition-all ${
                      isActive 
                        ? "border-[#1A1A1A] bg-[#FAF9F6] ring-1 ring-[#1A1A1A]" 
                        : "border-[#E5E5E1] hover:border-[#1A1A1A] bg-white"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl border border-neutral-300/40 overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center p-0.5">
                      <img 
                        src={item.image} 
                        alt="Preset thumbnail" 
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">{item.category}</p>
                      <h4 className="text-sm font-semibold text-neutral-900 mt-0.5 leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-1 text-emerald-600 text-[10px] mt-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Style coordinates loaded</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* COMPREHENSIVE STYLE ERROR NOTICE BOX */}
        {analysisError && (
          <div className="col-span-full bg-amber-50 border border-amber-200 p-5 rounded-3xl text-sm text-amber-900 leading-relaxed max-w-4xl mx-auto w-full my-3" id="error-notice-block">
            <h4 className="font-bold flex items-center gap-2 text-amber-950 mb-1">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
              Developer API Reminder
            </h4>
            <p className="text-xs text-amber-800">
              {analysisError}
            </p>
          </div>
        )}

        {/* BENTO ROW: Curated Outfit Coordinates (Col span full) */}
        {analysisResult && (
          <section className="col-span-full mt-6 bg-white border border-[#E5E5E1] rounded-3xl p-6 lg:p-10 shadow-sm flex flex-col gap-8" id="outfit-coordinates-section">
            
            {/* Header with Occasion Selector Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E1] pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#717171]">Curated Coordinates Blueprint</span>
                <h3 className="text-2xl font-serif font-light italic text-neutral-900 mt-1">
                  Three Curated Life Scenarios
                </h3>
              </div>

              {/* Occasion Tabs */}
              <div className="flex bg-[#FAF9F6] border border-[#E5E5E1] rounded-xl p-1 shadow-inner self-start md:self-auto" id="scenario-selector-tabs">
                {(["Casual", "Business", "Night Out"] as const).map((tab) => {
                  const isActive = selectedOutfitTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedOutfitTab(tab)}
                      className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        isActive 
                          ? "bg-[#1A1A1A] text-white shadow" 
                          : "text-[#717171] hover:text-black"
                      }`}
                    >
                      {tab === "Casual" ? "01. Casual Luxe" : tab === "Business" ? "02. Modern Office" : "03. Twilight Gala"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Outfit Dashboard Details */}
            {currentOutfit ? (
              <div className="space-y-8" id="active-outfit-panel">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left half: Outfit Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                        {currentOutfit.type} Coordination Look
                      </span>
                      <h4 className="text-xl lg:text-3xl font-serif text-neutral-900 font-semibold leading-relaxed">
                        “{currentOutfit.title}”
                      </h4>
                      <p className="text-sm text-neutral-500 font-medium italic mt-2 leading-relaxed">
                        Vibe: {currentOutfit.vibe}
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] border border-[#E5E5E1] rounded-2xl p-5 font-serif italic text-neutral-700 leading-relaxed text-sm lg:text-base">
                      "{currentOutfit.description}"
                    </div>

                    {/* Styling Tips & Notes bento columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
                        <h5 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#717171] flex items-center gap-1.5 mb-3">
                          <Check className="w-4 h-4 text-emerald-500" />
                          Styling Tips
                        </h5>
                        <ul className="space-y-2 text-xs text-neutral-600 list-disc list-inside leading-relaxed">
                          {currentOutfit.stylingTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
                        <h5 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#717171] flex items-center gap-1.5 mb-3">
                          <Sparkle className="w-4 h-4 text-amber-500" />
                          Hair & Beauty Notes
                        </h5>
                        <p className="text-xs text-neutral-600 leading-relaxed font-serif italic">
                          "{currentOutfit.hairAndBeauty}"
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Right half: Stylist Coordination Stats */}
                  <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E5E5E1] p-5 rounded-2xl space-y-4 shadow-inner">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#717171] border-b border-[#E5E5E1] pb-2.5">
                      Garment Elements Checklist
                    </h5>
                    <div className="space-y-2.5">
                      {currentOutfit.items.map((it) => (
                        <div key={it.id} className="bg-white border border-[#E8E8E6] px-4 py-3 rounded-xl flex justify-between items-center gap-3 shadow-xs">
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shadow-inner"
                              style={{ backgroundColor: it.colorHex }}
                            />
                            <div>
                              <p className="text-xs font-semibold text-neutral-900">{it.name}</p>
                              <p className="text-[9.5px] font-mono text-[#717171] uppercase font-medium">{it.colorName}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase bg-neutral-100 text-[#717171] px-2 py-0.5 rounded font-bold shrink-0">
                            {it.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Flat Lay Visualizer Canvas Section */}
                <div className="border-t border-[#E5E5E1] pt-8">
                  <div className="mb-4">
                    <h5 className="text-xs font-display font-medium uppercase tracking-widest text-neutral-500">
                      Visual Representation
                    </h5>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Toggle either the Interactive Blueprint Canvas or request a full AI Photo render designed by Imagen.
                    </p>
                  </div>

                  <FlatLayCanvas
                    outfit={currentOutfit}
                    uploadedImage={imagePreview}
                    uploadedItemName={analysisResult.detectedItem.name}
                    uploadedItemCategory={analysisResult.detectedItem.category}
                    baseItemColors={analysisResult.detectedItem.colors}
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400">
                Please select a valid tab to display coordination outfits.
              </div>
            )}

          </section>
        )}

      </main>

      {/* Styled Footer Block fitting design style */}
      <footer className="px-6 lg:px-12 py-5 bg-white border-t border-[#E5E5E1] flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto text-xs" id="app-footer">
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono font-bold uppercase tracking-widest text-[#717171] text-[10px]">
          <span>Style Confidence: <span className="text-black">98%</span></span>
          <span>Analytic Pipeline: <span className="text-black">Gemini 3.5 Flash</span></span>
          <span>Render Engine: <span className="text-black">Imagen 3.0</span></span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase font-bold text-[#717171]">
          <span>Sync to Calendar Integration</span>
          <div className="w-10 h-5 bg-neutral-900 rounded-full relative cursor-pointer shadow-sm">
            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
          </div>
        </div>
      </footer>
    </div>
  );
}
