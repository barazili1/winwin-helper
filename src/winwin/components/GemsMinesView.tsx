import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gem, Sparkles, Loader2, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';
import { getStoredFlag } from '../utils/storage';

interface GemsMinesViewProps {
  lang: Language;
  t: any;
  userId?: string;
  onRequireRegistration?: () => void;
}

const GemsMinesView: React.FC<GemsMinesViewProps> = ({ lang, t, userId, onRequireRegistration }) => {
  const [selectedGemCount, setSelectedGemCount] = useState<number>(5);
  const [revealedGems, setRevealedGems] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [predictionDone, setPredictionDone] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(98.5);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSelectedGemCount(val);
    audioManager.playSoftClick();
  };

  const handleQuickSelect = (count: number) => {
    setSelectedGemCount(count);
    audioManager.playClick();
  };

  const handleGetPrediction = () => {
    audioManager.playClick();

    setIsCalculating(true);
    setPredictionDone(false);
    setRevealedGems([]);

    // Generate random confidence score between 96.5% and 99.8%
    const randomConf = (Math.random() * (99.8 - 96.5) + 96.5).toFixed(1);
    setConfidence(parseFloat(randomConf));

    // Simulate futuristic AI calculation
    setTimeout(() => {
      // Pick `selectedGemCount` unique random indices out of 0..24
      const allIndices = Array.from({ length: 25 }, (_, i) => i);
      
      // Shuffle
      for (let i = allIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
      }

      const pickedGems = allIndices.slice(0, selectedGemCount);
      setRevealedGems(pickedGems);
      setIsCalculating(false);
      setPredictionDone(true);
      audioManager.playResult();
    }, 1400);
  };

  const progressPercentage = Math.round((selectedGemCount / 24) * 100);

  return (
    <div className="flex flex-col items-center justify-between h-full py-4 px-4 overflow-y-auto custom-scrollbar relative">
      
      {/* Main 5x5 Mines Grid */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center my-auto">
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] p-3 rounded-3xl bg-zinc-950/90 border border-green-500/30 shadow-[0_0_35px_rgba(139,207,0,0.15)] backdrop-blur-xl">
          
          {/* Scanning Beam Animation on calculation */}
          {isCalculating && (
            <div className="absolute inset-0 z-30 pointer-events-none rounded-3xl overflow-hidden">
              <div className="w-full h-12 bg-gradient-to-b from-green-500/30 via-green-400/20 to-transparent blur-md animate-[scan_1.2s_ease-in-out_infinite]" />
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full aspect-square">
            {Array.from({ length: 25 }).map((_, index) => {
              const isGem = revealedGems.includes(index);
              
              return (
                <div
                  key={index}
                  className={`relative w-full aspect-square rounded-xl transition-all duration-300 flex items-center justify-center border overflow-hidden ${
                    isGem
                      ? 'bg-gradient-to-br from-green-500/25 via-emerald-950/80 to-green-950/90 border-green-400 shadow-[0_0_15px_rgba(139,207,0,0.4)]'
                      : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700/80'
                  }`}
                >
                  {/* Subtle Grid Corner Accents */}
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white/10 rounded-full" />

                  <AnimatePresence mode="wait">
                    {isGem ? (
                      <motion.div
                        key="gem-icon"
                        initial={{ scale: 0, rotate: -30, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="w-full h-full flex items-center justify-center p-2"
                      >
                        {/* Glow halo */}
                        <div className="absolute inset-0 bg-green-500/15 blur-sm rounded-full pointer-events-none" />
                        <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 drop-shadow-[0_0_10px_rgba(139,207,0,0.8)] stroke-[2.2] shrink-0" />
                      </motion.div>
                    ) : (
                      <div key="cell-num" className="text-zinc-700 font-mono text-[9px] font-bold select-none opacity-40">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Status Indicator */}
        <div className="h-6 mt-2 flex items-center justify-center">
          {isCalculating && (
            <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              جاري فك تشفير خوارزمية المناجم...
            </span>
          )}
          {predictionDone && !isCalculating && (
            <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(139,207,0,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              تم التوقع بنجاح: {revealedGems.length} جواهر
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls Area: Progress Bar + Slider + Button */}
      <div className="w-full max-w-md mx-auto pt-2 pb-1">
        
        {/* Progress Bar & Slider Selector Box */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 shadow-xl mb-3 backdrop-blur-md">
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-green-400" />
              اختر عدد الجواهر المطلوبة:
            </span>
            <span className="text-sm font-mono font-black text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-lg border border-green-500/30">
              {selectedGemCount} {selectedGemCount === 1 ? 'جوهرة' : 'جواهر'}
            </span>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="relative w-full h-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden mb-3 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-green-600 via-green-400 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(139,207,0,0.6)] transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* HTML Range Input Slider */}
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={selectedGemCount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500 focus:outline-none"
          />

          {/* Quick Select Buttons */}
          <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-zinc-900">
            <span className="text-[10px] text-zinc-500 font-bold ml-1">اختيار سريع:</span>
            {[1, 3, 5, 7, 10, 15].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleQuickSelect(count)}
                className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  selectedGemCount === count
                    ? 'bg-green-500 text-black border-green-400 shadow-[0_0_10px_rgba(139,207,0,0.4)]'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {count}
              </button>
            ))}
          </div>

        </div>

        {/* White "الحصول علي التوقع" Button */}
        <button
          type="button"
          onClick={handleGetPrediction}
          disabled={isCalculating}
          className="w-full py-4 rounded-xl bg-white hover:bg-zinc-100 text-black font-black text-base tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 font-display cursor-pointer"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 text-black animate-spin" />
              <span>جاري التوقع...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-black fill-black" />
              <span>الحصول علي التوقع</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default GemsMinesView;
