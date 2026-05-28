import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Shirt, 
  Footprints, 
  Sparkles, 
  Briefcase, 
  Glasses, 
  Gem, 
  ShoppingBag, 
  Camera, 
  RefreshCw, 
  Image as ImageIcon,
  BookOpen,
  Info,
  Layers,
  Sparkle
} from "lucide-react";
import { OutfitOption, OutfitItem } from "../types";

// Map icon string names to Lucide icons safely
const iconMap: Record<string, React.ComponentType<any>> = {
  Shirt: Shirt,
  Footprints: Footprints,
  Sparkles: Sparkles,
  Briefcase: Briefcase,
  Glasses: Glasses,
  Gem: Gem,
  ShoppingBag: ShoppingBag,
};

interface FlatLayCanvasProps {
  outfit: OutfitOption;
  uploadedImage: string | null;
  uploadedItemName: string;
  uploadedItemCategory: string;
  baseItemColors: { name: string; hex: string; role: string }[];
}

export default function FlatLayCanvas({
  outfit,
  uploadedImage,
  uploadedItemName,
  uploadedItemCategory,
  baseItemColors,
}: FlatLayCanvasProps) {
  const [activeItem, setActiveItem] = useState<OutfitItem | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"interactive" | "ai">("interactive");

  // Approximate color contrast checks to choose dark or light text
  const getContrastYIQ = (hexcolor: string) => {
    const hex = hexcolor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "text-neutral-900" : "text-white";
  };

  const handleGenerateAiRender = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/stylist/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfitTitle: outfit.title,
          outfitVibe: outfit.vibe,
          elementsList: outfit.items,
          baseItemDescription: `${uploadedItemCategory} named "${uploadedItemName}"`,
          baseItemColors: baseItemColors,
        }),
      });

      const data = await response.json();
      if (response.ok && data.image) {
        setAiImage(data.image);
        setViewMode("ai");
      } else {
        throw new Error(data.error || "Imagen returned an empty result.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        "Could not generate AI photo at this moment. Let's make use of our stunning Interactive Flat-lay Studio instead!"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full" id={`flat-lay-${outfit.type}`}>
      {/* Visual Canvas Board */}
      <div className="flex-1 min-h-[500px] bg-[#EAE8E4] rounded-2xl relative overflow-hidden shadow-inner border border-[#DCDAD5] p-6 flex flex-col justify-between">
        {/* Subtle grid pattern background to mimic a workshop board */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: "radial-gradient(#8C8A84 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} 
        />

        {/* Board Header / Mode Selector */}
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">
              Stylist Canvas Board ({outfit.type})
            </h4>
          </div>

          <div className="flex bg-white/70 backdrop-blur-md border border-neutral-300 rounded-lg p-0.5 shadow-sm text-xs">
            <button
              onClick={() => setViewMode("interactive")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "interactive"
                  ? "bg-[#2B2B2B] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Interactive Board
            </button>
            <button
              onClick={() => {
                if (!aiImage) {
                  handleGenerateAiRender();
                } else {
                  setViewMode("ai");
                }
              }}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "ai"
                  ? "bg-[#2B2B2B] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AI Photo Render
            </button>
          </div>
        </div>

        {/* Main Canvas Zone */}
        <div className="relative flex-1 flex items-center justify-center my-6 min-h-[380px]">
          {viewMode === "interactive" ? (
            /* INTERACTIVE STUDIO BOARD */
            <div className="w-full h-full relative flex items-center justify-center">
              
              {/* Central base64 Polaroid of original garment */}
              <motion.div 
                initial={{ rotate: -4, scale: 0.95 }}
                animate={{ rotate: -2, scale: 1 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                className="w-48 bg-white p-3 pb-6 rounded-sm shadow-xl border border-neutral-200/80 z-20 flex flex-col items-center relative"
                style={{ originY: 0 }}
              >
                {/* Decorative Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600/90 rounded-full shadow-md border-t border-red-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full m-1 opacity-70" />
                </div>

                {uploadedImage ? (
                  <div className="w-full aspect-square bg-[#FAFAFA] rounded overflow-hidden border border-neutral-100 relative group">
                    <img 
                      src={uploadedImage} 
                      alt="Your uploaded item" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white tracking-widest uppercase font-bold">Base Piece</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-neutral-200 rounded flex items-center justify-center">
                    <Camera className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                
                <p className="mt-3 font-mono text-[10px] uppercase font-bold text-neutral-500 text-center tracking-wide truncate w-full">
                  {uploadedItemCategory || "Base Garment"}
                </p>
                <p className="mt-0.5 font-serif text-[11px] text-neutral-800 text-center italic truncate w-full px-1">
                  "{uploadedItemName}"
                </p>
              </motion.div>

              {/* Auxiliary flat-lay items positioned creatively around it */}
              {outfit.items.map((item, idx) => {
                const angle = (idx * 360) / outfit.items.length;
                const radius = 135; // Position cards circularly around the polaroid
                const rad = (angle * Math.PI) / 180;
                const x = Math.round(Math.cos(rad) * radius);
                const y = Math.round(Math.sin(rad) * radius);

                const IconComponent = iconMap[item.iconName] || Shirt;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    whileHover={{ scale: 1.1, zIndex: 30 }}
                    onClick={() => setActiveItem(item)}
                    className={`absolute p-2.5 rounded-xl bg-white shadow-lg border cursor-pointer select-none transition-all flex flex-col items-center w-32 ${
                      activeItem?.id === item.id 
                        ? "border-neutral-800 ring-2 ring-neutral-400/50" 
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {/* Color Swatch Badge with Icon inside */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/20 relative"
                      style={{ backgroundColor: item.colorHex }}
                    >
                      <IconComponent className={`w-5 h-5 ${getContrastYIQ(item.colorHex)}`} />
                    </div>

                    <p className="mt-2 text-[11px] font-bold text-neutral-800 text-center line-clamp-1 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[9px] font-mono tracking-wider font-semibold uppercase text-neutral-400 mt-0.5">
                      {item.category}
                    </p>

                    {/* Styled dot swatch representation of selected color */}
                    <div className="flex items-center gap-1 mt-1.5 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-full">
                      <span 
                        className="w-2 h-2 rounded-full border border-black/10 inline-block" 
                        style={{ backgroundColor: item.colorHex }} 
                      />
                      <span className="text-[8px] font-semibold text-neutral-500 max-w-[60px] truncate">
                        {item.colorName}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* AI GENERATED RENDER PHOTO VIEW */
            <div className="w-full h-full flex flex-col justify-center items-center relative">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-neutral-300 border-t-amber-500 animate-spin" />
                    <Sparkle className="w-6 h-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-800">Weaving Stylist Flat-lay Photo...</h5>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Gemini is generating a studio-quality photograph arranging your {uploadedItemName} alongside matching garments on Limestone.
                    </p>
                  </div>
                </div>
              ) : aiImage ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-[400px] aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-300 relative group"
                >
                  <img
                    src={aiImage}
                    alt={`${outfit.title} flat-lay`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Imagen 3.0 Render</p>
                    <p className="text-[11px] text-white/90 leading-relaxed mt-0.5">Artistic studio presentation of this outfit layout.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center text-center p-6 gap-3">
                  <ImageIcon className="w-12 h-12 text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">No Image Rendered Yet</p>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Request a high-fidelity catalog flat-lay render of these coordinates using AI.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAiRender}
                    className="mt-2 bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 text-white rounded-xl px-4 py-2 text-xs font-bold hover:from-neutral-900 hover:to-black transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Generate AI Render Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Board Help Caption */}
        <div className="relative z-10 border-t border-[#DCDAD5] pt-3 flex items-center gap-2 text-[11px] text-neutral-500 text-center justify-center w-full">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span>
            {viewMode === "interactive" 
              ? "Click any outfit item card surrounding the central polaroid photo to unveil styling details." 
              : "Generate or switch back to the Interactive Board anytime to tweak individual components."}
          </span>
        </div>
      </div>

      {/* Styled Details Panel */}
      <div className="w-full lg:w-[350px] bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          {/* Active selected item of the flat lay */}
          <div className="border-b border-neutral-100 pb-4 mb-4">
            <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-500" />
              Outfit Blueprint Elements
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Perfect garments selected to coordinate beautifully.
            </p>
          </div>

          {activeItem ? (
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Item Header */}
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md border"
                  style={{ backgroundColor: activeItem.colorHex }}
                >
                  {React.createElement(iconMap[activeItem.iconName] || Shirt, {
                    className: `w-6 h-6 ${getContrastYIQ(activeItem.colorHex)}`
                  })}
                </div>
                <div>
                  <h5 className="font-bold text-neutral-900 leading-tight">
                    {activeItem.name}
                  </h5>
                  <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                    {activeItem.category}
                  </p>
                </div>
              </div>

              {/* Color Details Swatch */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Curated Harmonizing Sward</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span 
                    className="w-5 h-5 rounded-md border border-black/10 inline-block shadow-sm" 
                    style={{ backgroundColor: activeItem.colorHex }} 
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{activeItem.colorName}</p>
                    <p className="text-[10.5px] font-mono text-neutral-400 uppercase">{activeItem.colorHex}</p>
                  </div>
                </div>
              </div>

              {/* Stylist Explanation */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 inline-block mb-1">Stylist Rationale</span>
                <p className="text-[13px] text-neutral-600 leading-relaxed font-serif italic text-amber-950/90">
                  "{activeItem.description}"
                </p>
              </div>

              {activeItem.imagePrompt && (
                <div className="text-[11px] bg-amber-50/60 border border-amber-100/80 rounded-lg p-2.5 text-amber-800">
                  <span className="font-bold block mb-0.5">Flat-lay Prompt snippet:</span>
                  <span className="italic">"{activeItem.imagePrompt}"</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="py-12 text-center text-neutral-400 space-y-3 flex flex-col items-center">
              <Shirt className="w-10 h-10 text-neutral-300 stroke-[1.5]" />
              <p className="text-xs leading-relaxed max-w-[200px]">
                Hover or click any coordinating piece on the drawing canvas to read custom design reasons.
              </p>
            </div>
          )}
        </div>

        {/* Action Button & Error message */}
        <div className="mt-6 pt-4 border-t border-neutral-100 space-y-3">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 leading-relaxed"
            >
              {errorMsg}
            </motion.div>
          )}

          {viewMode === "interactive" && (
            <button
              onClick={handleGenerateAiRender}
              disabled={isGenerating}
              className="w-full bg-neutral-950 text-white font-semibold py-3 rounded-xl hover:bg-neutral-900 active:bg-black transition-all shadow-md disabled:opacity-50 text-xs flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  Generating Studio Shot...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Render AI Studio Flat-lay Photo
                </>
              )}
            </button>
          )}

          {viewMode === "ai" && aiImage && (
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = aiImage;
                link.download = `${outfit.title.replace(/\s+/g, "_")}_flat_lay.jpg`;
                link.click();
              }}
              className="w-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 font-semibold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
            >
              Download Studio Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
