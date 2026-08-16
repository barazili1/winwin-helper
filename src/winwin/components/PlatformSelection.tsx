
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from '../types';
import { Check, ChevronRight, Binary, Hexagon, Database, Lock, Loader2, Terminal } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

interface PlatformSelectionProps {
  onSelect: (platform: Platform) => void;
  t: any;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ onSelect, t }) => {
  const [selected, setSelected] = useState<Platform>('greenbet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const platforms = [
    {
      id: 'greenbet' as Platform,
      name: 'WINWIN',
      img: 'https://v3.traincdn.com/genfiles/cms/304-1745/desktop/media_asset/c7c7279951bf9b0b5c105f3f40654cda.svg',
      tagline: 'الخادم: ALPHA-7',
      status: 'محسّن',
      latency: '12ms',
      integrity: '99.8%',
      packets: '128.4 KB/s'
    },
    {
      id: 'paripulse' as Platform,
      name: 'Paripulse',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg6-yMiToAplqRqnBnaYACm49Od_26EabD95SDPxqLgg&s=10',
      tagline: 'الخادم: BETA-9',
      status: 'محسّن',
      latency: '10ms',
      integrity: '99.9%',
      packets: '142.1 KB/s'
    }
  ];

  const statusSteps = [
    "جارٍ تحميل خادم المنصة",
    "جارٍ الاتصال بالخادم",
    "ربط السكربت",
    "تم الربط بنجاح"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for(let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (isConnecting) {
      const duration = 4000;
      const interval = 30;
      const totalSteps = duration / interval;
      const stepValue = 100 / totalSteps;

      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepValue;
          
          if (next >= 10 && !activeSteps.includes(0)) setActiveSteps(s => [...s, 0]);
          if (next >= 35 && !activeSteps.includes(1)) setActiveSteps(s => [...s, 1]);
          if (next >= 60 && !activeSteps.includes(2)) setActiveSteps(s => [...s, 2]);
          if (next >= 85 && !activeSteps.includes(3)) setActiveSteps(s => [...s, 3]);

          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      const finishTimer = setTimeout(() => {
        onSelect(selected);
      }, duration + 800);

      return () => {
        clearInterval(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [isConnecting, onSelect, selected, activeSteps]);

  const handleProceed = () => {
    audioManager.playClick();
    setIsConnecting(true);
  };

  const handlePlatformSelect = (id: Platform) => {
    if (!isConnecting) {
      audioManager.playClick();
      setSelected(id);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-6 overflow-y-auto custom-scrollbar relative bg-transparent font-sans">

      {/* Header */}
      <div className="text-center mb-6 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-500/5 border border-green-500/20 mb-2">
           <Binary className="w-2.5 h-2.5 text-green-500 animate-pulse" />
           <span className="text-[9px] font-bold text-green-500 tracking-wider uppercase">مستوى الأمان: بلاتيني</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-1">
          اختيار <span className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">المنصة</span>
        </h2>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">اختر المنصة المستهدفة للجلسة</p>
      </div>

      {/* Node Selection */}
      <div className="space-y-4 relative z-10 mb-6">
        {platforms.map((p, idx) => (
          <button 
            key={p.id}
            onClick={() => handlePlatformSelect(p.id)}
            disabled={isConnecting}
            className={`group relative w-full rounded-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 fill-mode-both overflow-hidden cursor-pointer`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Ambient Backlight Glow */}
            <div className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 ${
              selected === p.id ? 'bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 opacity-100' : 'opacity-0'
            }`} />

            {/* Main Card Surface */}
            <div className={`relative z-10 w-full p-4 rounded-2xl border backdrop-blur-md transition-all duration-500 flex items-center justify-between gap-4 text-right ${
              selected === p.id 
                ? 'bg-zinc-950/90 border-green-500/60 shadow-[0_0_30px_rgba(139,207,0,0.2)]' 
                : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60'
            }`}>
              
              {/* Logo & Info Group */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Logo Box */}
                <div className={`relative w-20 h-20 rounded-xl shrink-0 border flex items-center justify-center p-2.5 transition-all duration-500 ${
                  selected === p.id 
                    ? 'bg-black/90 border-green-500/50 shadow-[0_0_20px_rgba(139,207,0,0.3)] ring-1 ring-green-500/30' 
                    : 'bg-black/50 border-zinc-800/80 opacity-75'
                }`}>
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl pointer-events-none" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-xl font-display font-black tracking-tight transition-colors ${selected === p.id ? 'text-white' : 'text-zinc-400'}`}>
                      {p.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/30 font-mono">
                      ONLINE
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-medium mb-2.5 line-clamp-1">
                    المنصة الرسمية المعتمدة للجلسة الحالية
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[8px] px-2 py-0.5 rounded-md border font-mono tracking-wider transition-colors ${
                      selected === p.id 
                        ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                        : 'border-zinc-800 text-zinc-500 bg-zinc-950/40'
                    }`}>
                      {p.tagline}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-md border font-mono tracking-wider transition-colors ${
                      selected === p.id 
                        ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                        : 'border-zinc-800 text-zinc-500 bg-zinc-950/40'
                    }`}>
                      زمن الاستجابة: {p.latency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selection Checkmark */}
              <div className={`w-9 h-9 rounded-xl border shrink-0 flex items-center justify-center transition-all duration-500 ${
                selected === p.id 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-400 text-black shadow-[0_0_15px_rgba(139,207,0,0.5)] scale-105' 
                  : 'border-zinc-800 text-zinc-700 bg-zinc-950/50'
              }`}>
                {selected === p.id ? <Check className="w-5 h-5 stroke-[3px]" /> : <Lock className="w-4 h-4" />}
              </div>

            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto relative z-10">
        <div className="flex items-center gap-3 mb-4 bg-zinc-950/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
           <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <Database className="w-4 h-4 text-zinc-500" />
           </div>
           <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                 <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">حالة الواجهة</span>
                 <span className="text-[9px] text-green-500 font-bold uppercase">مؤمنة</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-green-500/40 rounded-full animate-pulse"></div>
              </div>
           </div>
        </div>

        <button 
          onClick={handleProceed}
          disabled={isConnecting}
          className="relative w-full h-14 rounded-2xl bg-white text-black font-black font-sans text-lg tracking-wide uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          <span className="font-sans font-black">تسجيل الدخول</span>
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* SIMPLIFIED CONNECTION DIALOG */}
      {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500 p-6">
           <div className="relative w-full max-w-xs flex flex-col items-center">
              
              <div className="w-full bg-zinc-950 border border-green-500/20 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(34,197,94,0.1)] relative overflow-hidden">
                
                <div className="flex items-center justify-center mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-green-500/30 flex items-center justify-center">
                      <Terminal className="w-8 h-8 text-green-500 animate-pulse" />
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   {statusSteps.map((step, i) => (
                     <div 
                       key={i} 
                       className={`flex items-center gap-4 transition-all duration-300 ${
                         activeSteps.includes(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                       }`}
                     >
                       {activeSteps.includes(i) ? (
                         <Check className={`w-4 h-4 ${i === 3 ? 'text-green-500' : 'text-zinc-500'}`} />
                       ) : (
                         <Loader2 className="w-4 h-4 text-zinc-800 animate-spin" />
                       )}
                       <span className={`text-xs font-mono tracking-tight font-medium ${
                         i === 3 && activeSteps.includes(i) ? 'text-green-500 font-bold' : 'text-zinc-400'
                       }`}>
                         {step}
                       </span>
                     </div>
                   ))}
                </div>

                {/* Simplified Progress Bar */}
                <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                   <div 
                     className="absolute h-full bg-green-500 transition-all duration-100 ease-out shadow-[0_0_10px_#22c55e]"
                     style={{ width: `${progress}%` }}
                   />
                </div>
                
                <div className="mt-4 flex justify-between items-center px-1">
                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">تشفير الجلسة</span>
                   <span className="text-[10px] font-mono text-green-500 font-bold">{Math.round(progress)}%</span>
                </div>

              </div>
           </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PlatformSelection;
