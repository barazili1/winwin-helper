import React, { useState } from 'react';
import { Copy, Check, Upload, ArrowRight, Download, User, Smartphone, CreditCard, ShieldCheck, AlertCircle, Loader2, Server, Crown, Send } from 'lucide-react';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';
import UnregisteredModal from './UnregisteredModal';
import { getStoredFlag, setStoredFlag } from '../utils/storage';

interface SettingsViewProps {
  onComplete: (userId: string, game?: string) => void;
  lang: Language;
  t: any;
  platform?: any;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onComplete, lang, t, platform }) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ userId?: boolean; screenshot?: boolean; userIdLength?: boolean; game?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);

  const isParipulse = platform === 'paripulse';
  const platformName = isParipulse ? 'Paripulse' : 'WINWIN';
  const platformSubName = isParipulse ? 'PARIPULSE' : 'PARIPULSE';
  const platformLogo = isParipulse 
    ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg6-yMiToAplqRqnBnaYACm49Od_26EabD95SDPxqLgg&s=10' 
    : 'https://v3.traincdn.com/genfiles/cms/304-1745/desktop/media_asset/c7c7279951bf9b0b5c105f3f40654cda.svg';
  const downloadUrl = isParipulse 
    ? 'https://refpa22168.com/L?tag=d_3638295m_65213c_&site=3638295&ad=65213' 
    : 'https://refpa98980.com/L?tag=d_5876143m_68383c_&site=5876143&ad=68383';
  const registerUrl = isParipulse 
    ? 'https://refpa22168.com/L?tag=d_3638295m_65213c_&site=3638295&ad=65213' 
    : 'https://refpa98980.com/L?tag=d_5876143m_94904c_&site=5876143&ad=94904';
  
  // HUD Modal State
  const [verificationSteps, setVerificationSteps] = useState([
    { label: t.step_validating, status: "pending" },
    { label: t.step_receipt, status: "pending" },
    { label: t.step_server, status: "pending" },
    { label: t.step_analytics, status: "pending" }
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText("Gooo33");
    setCopied(true);
    audioManager.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
      setErrors(prev => ({ ...prev, screenshot: false }));
      audioManager.playSoftClick();
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 15) {
        setUserId(val);
        // Clear errors if length becomes valid (between 10 and 15)
        if (val.length >= 10) {
             setErrors(prev => ({ ...prev, userId: false, userIdLength: false }));
        }
    }
  };

  const startSubmissionSequence = (trimmedId: string, gameChoice: string) => {
    setIsSubmitting(true);
    
    // Verification Animation Sequence
    const updateStep = (index: number, status: string) => {
      setVerificationSteps(prev => 
        prev.map((step, i) => i === index ? { ...step, status } : step)
      );
      audioManager.playScan();
    };

    // Step 1
    updateStep(0, "active");
    setTimeout(() => { updateStep(0, "completed"); updateStep(1, "active"); }, 1500);
    setTimeout(() => { updateStep(1, "completed"); updateStep(2, "active"); }, 3000);
    setTimeout(() => { updateStep(2, "completed"); updateStep(3, "active"); }, 4500);
    setTimeout(() => { 
      updateStep(3, "completed"); 
      setTimeout(() => onComplete(trimmedId, gameChoice), 800);
    }, 5500);
  };

  const validateAndSubmit = () => {
    audioManager.playClick();
    const trimmedId = userId.trim();
    const isLengthValid = trimmedId.length >= 10 && trimmedId.length <= 15;
    
    const newErrors = {
      userId: !trimmedId,
      userIdLength: !isLengthValid,
      game: !selectedGame
    };

    setErrors(newErrors);

    if (!newErrors.userId && !newErrors.userIdLength && !newErrors.game) {
      const ADMIN_ID = '83920192';
      const isAdmin = trimmedId === ADMIN_ID;
      const deviceSeen = getStoredFlag('device_unregistered_shown') || getStoredFlag('unregistered_modal_dismissed');

      if (!deviceSeen && !isAdmin) {
        setShowUnregisteredModal(true);
        return;
      }

      startSubmissionSequence(trimmedId, selectedGame || 'gems');
    } else {
        audioManager.playError();
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-24 overflow-y-auto custom-scrollbar relative">
      
      {/* Premium Header */}
      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 mb-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-zinc-900 border border-green-500/20 shadow-[0_0_25px_rgba(34,197,94,0.1)]">
          <Crown className="w-8 h-8 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        </div>
        <h2 className="text-3xl font-display font-black text-white tracking-tighter mb-2">{t.activation_required}</h2>
        <p className="text-sm text-zinc-500 max-w-[260px] mx-auto leading-relaxed font-medium">{t.complete_steps}</p>
      </div>

      {/* Vertical Process Timeline */}
      <div className="relative">
        {/* Connecting Line - Fixed to left */}
        <div className="absolute left-[15px] top-5 bottom-12 w-[2px] bg-gradient-to-b from-green-500 via-zinc-800 to-zinc-900/0"></div>

        {/* Step 1: Install */}
        <div className="relative pl-12 mb-10 group">
           <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-green-500 flex items-center justify-center z-10 transition-colors shadow-lg">
              <Smartphone className="w-3.5 h-3.5 text-zinc-400 group-hover:text-green-500 transition-colors" />
           </div>
           
           <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-900 transition-colors backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/80 border border-zinc-800 p-1.5 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                       <img 
                         src={platformLogo} 
                         alt={`${platformName} Logo`} 
                         className="w-full h-full object-contain"
                         referrerPolicy="no-referrer"
                       />
                    </div>
                    <div>
                       <h3 className="font-bold font-display text-white text-base">
                         {t.install_app}
                       </h3>
                       <span className="text-[10px] text-green-400 font-mono font-medium">{platformSubName}</span>
                    </div>
                 </div>
                 <span className="text-[10px] bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full border border-green-500/20 uppercase tracking-wide font-display font-bold shrink-0">Official</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{t.install_desc}</p>
              
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClick()}
                className="w-full h-11 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] font-display cursor-pointer"
              >
                 <Download className="w-4 h-4" />
                 <span>{t.install_btn}</span>
              </a>
           </div>
        </div>

        {/* Telegram Subscription Step */}
        <div className="relative pl-12 mb-10 group">
           <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-green-500 flex items-center justify-center z-10 transition-colors shadow-lg">
              <Send className="w-3.5 h-3.5 text-zinc-400 group-hover:text-green-500 transition-colors" />
           </div>

           <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-900 transition-colors backdrop-blur-sm">
              <h3 className="font-bold font-display text-white text-base mb-1 flex items-center gap-2">
                {t.telegram_sub}
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wide font-display">Telegram</span>
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{t.telegram_sub_desc}</p>
              
              <a 
                href="https://t.me/+ykAdr_Jj6ctjZTQ0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClick()}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] font-display cursor-pointer"
              >
                 <Send className="w-4 h-4" />
                 <span>{t.telegram_btn}</span>
              </a>
           </div>
        </div>

        {/* Step 2: Promo Code */}
        <div className="relative pl-12 mb-10 group">
           <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-green-500 flex items-center justify-center z-10 transition-colors shadow-lg">
              <User className="w-3.5 h-3.5 text-zinc-400 group-hover:text-green-500 transition-colors" />
           </div>

           <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-900 transition-colors backdrop-blur-sm">
              <h3 className="font-bold font-display text-white text-base mb-1">{t.registration}</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{t.reg_desc}</p>
              
              {/* Promo Ticket */}
              <div 
                onClick={handleCopy}
                className="relative group/btn cursor-pointer overflow-hidden rounded-xl border border-dashed border-zinc-600 hover:border-green-500 bg-black/40 transition-all p-1"
              >
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex flex-col">
                         <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Promo Code</span>
                         <span className="text-lg font-mono font-black text-white tracking-widest group-hover/btn:text-green-400 transition-colors">Gooo33</span>
                      </div>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400 group-hover/btn:bg-zinc-700 group-hover/btn:text-white'}`}>
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4" />}
                      </div>
                  </div>
              </div>

              {/* Registration Button */}
              <a 
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClick()}
                className="w-full h-11 mt-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] cursor-pointer"
              >
                 <User className="w-4 h-4 text-black" />
                 <span>التسجيل فى منصه {platformName}</span>
              </a>
           </div>
        </div>

        {/* Step 3: Deposit */}
        <div className="relative pl-12 mb-10 group">
           <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-green-500 flex items-center justify-center z-10 transition-colors shadow-lg">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400 group-hover:text-green-500 transition-colors" />
           </div>

           <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-900 transition-colors backdrop-blur-sm">
              <h3 className="font-bold font-display text-white text-base mb-1">{t.activation_deposit}</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{t.min_deposit}</p>
              
              <div className="grid grid-cols-2 gap-3" dir="ltr">
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 p-3 rounded-xl flex flex-col items-center justify-center group/card hover:border-green-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover/card:opacity-40"><span className="text-[40px] leading-none font-black text-white font-display">$</span></div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">USD</span>
                  <span className="text-xl font-bold text-white font-display">$6.00</span>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 p-3 rounded-xl flex flex-col items-center justify-center group/card hover:border-green-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover/card:opacity-40"><span className="text-[40px] leading-none font-black text-white font-display">E</span></div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">EGP</span>
                  <span className="text-xl font-bold text-white font-display">300</span>
                </div>
              </div>
           </div>
        </div>

        {/* Step 4: Verification */}
        <div className="relative pl-12 group">
           <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-green-500 flex items-center justify-center z-10 transition-colors shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 group-hover:text-green-500 transition-colors" />
           </div>

           <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${errors.userId || errors.userIdLength || errors.game ? 'bg-red-500/5 border-red-500/30' : 'bg-green-500/5 border-green-500/20'}`}>
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-bold font-display text-white text-base">{t.verify_account}</h3>
                 {(errors.userId || errors.userIdLength || errors.game) && (
                    <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Required</span>
                    </div>
                 )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-2 uppercase font-bold tracking-wider">
                    {isParipulse 
                      ? (lang === 'ar' ? 'معرف مستخدم Paripulse' : 'Paripulse User ID') 
                      : t.userid_label}
                  </label>
                  <div className="relative">
                      <input 
                        type="tel" 
                        value={userId}
                        onChange={handleUserIdChange}
                        placeholder="ID: 83920192"
                        disabled={isSubmitting}
                        maxLength={15}
                        className={`w-full bg-zinc-900/80 border text-white text-sm px-4 py-3.5 rounded-xl focus:outline-none transition-all placeholder:text-zinc-600 ${errors.userId || errors.userIdLength ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-700/50 focus:border-green-500'}`}
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                  </div>
                  {errors.userIdLength && (
                     <p className="text-[10px] text-red-500 font-mono mt-1.5 ml-1">Must be 10-15 digits</p>
                  )}
                </div>

                {/* Game Selection Cards */}
                <div className="pt-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">اختر اللعبة (مطلوب)</span>
                    {errors.game && (
                      <span className="text-[10px] text-red-500 font-bold animate-pulse">يرجى اختيار لعبة</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full">
                    {/* Card 1: Apple of fortune */}
                    <div 
                      onClick={() => {
                        setSelectedGame('apple');
                        setErrors(prev => ({ ...prev, game: false }));
                        audioManager.playSoftClick();
                      }}
                      className={`relative w-full h-[60px] rounded-xl border cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-zinc-900 shadow-md group transition-all duration-300 p-1 ${
                        selectedGame === 'apple' 
                          ? 'border-green-500 shadow-[0_0_20px_rgba(139,207,0,0.4)] ring-2 ring-green-500/50' 
                          : errors.game ? 'border-red-500/80' : 'border-white hover:border-green-400'
                      }`}
                    >
                      <img 
                        src="https://cdn.phototourl.com/free/2026-07-22-93d4f1d1-8e52-4927-a5b6-3c46cf2c52b7.jpg" 
                        alt="Apple of fortune" 
                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                      
                      <span className="relative z-10 text-white font-black text-[10px] sm:text-xs text-center uppercase tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                        Apple of fortune
                      </span>

                      {selectedGame === 'apple' && (
                        <div className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center font-bold shadow-lg animate-in zoom-in-75">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Card 2: WILD WEST */}
                    <div 
                      onClick={() => {
                        setSelectedGame('wildwest');
                        setErrors(prev => ({ ...prev, game: false }));
                        audioManager.playSoftClick();
                      }}
                      className={`relative w-full h-[60px] rounded-xl border cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-zinc-900 shadow-md group transition-all duration-300 p-1 ${
                        selectedGame === 'wildwest' 
                          ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] ring-2 ring-green-500/50' 
                          : errors.game ? 'border-red-500/80' : 'border-white hover:border-green-400'
                      }`}
                    >
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd49wgwFJiDJelft3h7uY3v4st1oTamjX51-QNaidCdA&s=10" 
                        alt="WILD WEST" 
                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                      
                      <span className="relative z-10 text-white font-black text-[10px] sm:text-xs text-center uppercase tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                        WILD WEST
                      </span>

                      {selectedGame === 'wildwest' && (
                        <div className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center font-bold shadow-lg animate-in zoom-in-75">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Card 3: GEMS MINES */}
                    <div 
                      onClick={() => {
                        setSelectedGame('gems');
                        setErrors(prev => ({ ...prev, game: false }));
                        audioManager.playSoftClick();
                      }}
                      className={`relative w-full h-[60px] rounded-xl border cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-zinc-900 shadow-md group transition-all duration-300 p-1 ${
                        selectedGame === 'gems' 
                          ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] ring-2 ring-green-500/50' 
                          : errors.game ? 'border-red-500/80' : 'border-white hover:border-green-400'
                      }`}
                    >
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxHEXEghwGCyCIeL9KIYPCpmfUeL8MXarHXlv0A61Vg&s=10" 
                        alt="GEMS MINES" 
                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                      
                      <span className="relative z-10 text-white font-black text-[10px] sm:text-xs text-center uppercase tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                        GEMS MINES
                      </span>

                      {selectedGame === 'gems' && (
                        <div className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center font-bold shadow-lg animate-in zoom-in-75">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                  onClick={validateAndSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none active:scale-[0.98] font-display"
                >
                    <span>{t.submit_verification}</span>
                    <ArrowRight className="w-4 h-4" />
               </button>
           </div>
        </div>

      </div>

      {/* HUD Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-xs mx-6">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-green-900/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-dashed border-zinc-800 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative z-10 shadow-2xl shadow-green-900/20">
                 <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20 animate-pulse">
                        <Server className="w-7 h-7 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white tracking-widest uppercase">{t.verifying}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">{t.secure_connection}</p>
                 </div>

                 <div className="space-y-4">
                    {verificationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step.status === 'pending' ? 'bg-zinc-800' : step.status === 'active' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-green-500'}`}></div>
                                <span className={`text-xs font-medium transition-colors ${step.status === 'pending' ? 'text-zinc-600' : step.status === 'active' ? 'text-white' : 'text-zinc-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {step.status === 'active' && <Loader2 className="w-3.5 h-3.5 text-green-500 animate-spin" />}
                            {step.status === 'completed' && <Check className="w-3.5 h-3.5 text-green-500 animate-in zoom-in" />}
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Unregistered Promo Code Warning Modal */}
      <UnregisteredModal
        isOpen={showUnregisteredModal}
        registerUrl={registerUrl}
        platformLogo={platformLogo}
        platformName={platformName}
        onClose={() => {
          setStoredFlag('device_unregistered_shown', 'true');
          setStoredFlag('unregistered_modal_dismissed', 'true');
          const trimmedId = userId.trim();
          if (trimmedId) {
            setStoredFlag(`registered_id_${trimmedId}`, 'true');
          }
          setShowUnregisteredModal(false);
          startSubmissionSequence(trimmedId, selectedGame || 'gems');
        }}
        onRegisterRedirect={() => {
          setStoredFlag('device_unregistered_shown', 'true');
          setStoredFlag('unregistered_modal_dismissed', 'true');
          const trimmedId = userId.trim();
          if (trimmedId) {
            setStoredFlag(`registered_id_${trimmedId}`, 'true');
          }
          setShowUnregisteredModal(false);
          startSubmissionSequence(trimmedId, selectedGame || 'gems');
        }}
      />
    </div>
  );
};

export default SettingsView;
