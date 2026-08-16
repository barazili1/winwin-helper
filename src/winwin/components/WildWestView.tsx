import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles, Loader2, RefreshCw, Play, ShieldAlert, Award } from 'lucide-react';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';
import { getStoredFlag } from '../utils/storage';

interface WildWestViewProps {
  lang: Language;
  t: any;
  userId?: string;
  onRequireRegistration?: () => void;
}

const WildWestView: React.FC<WildWestViewProps> = ({ lang, t, userId, onRequireRegistration }) => {
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [predictionDone, setPredictionDone] = useState<boolean>(false);

  const handleStart = () => {
    audioManager.playClick();

    setIsCalculating(true);
    setPredictionDone(false);
    setWinningIndex(null);

    // AI Prediction calculation delay
    setTimeout(() => {
      // Pick random cell 0 or 1
      const randomIndex = Math.floor(Math.random() * 2);
      setWinningIndex(randomIndex);
      setIsCalculating(false);
      setPredictionDone(true);
      audioManager.playResult();
    }, 1000);
  };

  const handleReset = () => {
    audioManager.playClick();
    setWinningIndex(null);
    setPredictionDone(false);
    setIsCalculating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 px-4 overflow-y-auto custom-scrollbar relative">
      
      {/* Blurred Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="https://i.pinimg.com/736x/08/0e/9d/080e9d1f482c3724ffcc4363a0fcfba3.jpg"
          alt="Wild West Background"
          className="w-full h-full object-cover blur-sm scale-105 opacity-50 brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-black/50 to-zinc-950/80" />
      </div>

      {/* Title / Badge Header */}
      <div className="w-full max-w-md mx-auto mb-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md">
          <img 
            src="https://img.icons8.com/3d-fluency/180/treasure-chest.png" 
            alt="Treasure Logo" 
            className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" 
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-black text-amber-400 text-xs tracking-wider uppercase">
            WILD WEST GOLD
          </span>
        </div>
      </div>

      {/* Main Single Row - 2 Boxes Side-by-Side (Width 150px, Height 50px strictly) */}
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-md relative z-10">
        
        {/* Two Boxes Container */}
        <div className="flex items-center justify-center gap-4 dir-ltr py-4">
          {[0, 1].map((index) => {
            const isTreasure = winningIndex === index;

            return (
              <div
                key={index}
                style={{ width: '150px', height: '50px' }}
                className={`relative shrink-0 rounded-2xl transition-all duration-300 flex items-center justify-center border overflow-hidden ${
                  isTreasure
                    ? 'bg-gradient-to-r from-amber-900/90 via-yellow-950/90 to-amber-900/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-[1.02]'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Fixed Corner Accent */}
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/10 rounded-full" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/10 rounded-full" />

                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    </motion.div>
                  ) : isTreasure ? (
                    <motion.div
                      key="treasure-found"
                      initial={{ scale: 0, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 18 }}
                      className="flex items-center justify-center w-full h-full px-2"
                    >
                      {/* Glow Halo */}
                      <div className="absolute inset-0 bg-amber-500/25 blur-md rounded-full pointer-events-none" />
                      
                      {/* Treasure Chest Image */}
                      <div className="relative flex items-center justify-center h-full">
                        <img
                          src="https://img.icons8.com/3d-fluency/180/treasure-chest.png"
                          alt="Treasure Chest"
                          className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(245,158,11,1)] relative z-10"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <div key="cell-placeholder" className="flex items-center justify-center text-zinc-600 font-mono text-xs font-bold select-none">
                      #{index + 1}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Prediction Status Badge */}
        <div className="h-8 mt-2 flex items-center justify-center">
          {isCalculating && (
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              جاري فك التشفير وتحديد مكان الكنز...
            </span>
          )}
          {predictionDone && !isCalculating && winningIndex !== null && (
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              تم التوقع: الكنز في الصندوق رقم #{winningIndex + 1}
            </span>
          )}
        </div>

      </div>

      {/* Bottom Action Buttons: بدأ (Start) + اعاده بدأ (Reset) */}
      <div className="w-full max-w-md mx-auto pt-4 pb-2 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Start Button (بدأ) */}
          <button
            type="button"
            onClick={handleStart}
            disabled={isCalculating}
            className="py-4 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-base tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 font-display cursor-pointer"
          >
            {isCalculating ? (
              <Loader2 className="w-5 h-5 text-black animate-spin" />
            ) : (
              <Play className="w-5 h-5 text-black fill-black" />
            )}
            <span>بدأ</span>
          </button>

          {/* Reset Button (اعاده بدأ) */}
          <button
            type="button"
            onClick={handleReset}
            disabled={isCalculating}
            className="py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-black text-base tracking-wide transition-all flex items-center justify-center gap-2 border border-zinc-700/80 shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:scale-100 font-display cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-zinc-400" />
            <span>اعاده بدأ</span>
          </button>

        </div>
      </div>

    </div>
  );
};

export default WildWestView;
