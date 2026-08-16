import React, { useState, useEffect } from 'react';
import { Info, Globe, X, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import PlatformSelection from './components/PlatformSelection';
import InfoView from './components/InfoView';
import SettingsView from './components/SettingsView';
import RulesModal from './components/RulesModal';
import ParticlesBackground from './components/ParticlesBackground';
import { ViewState, Platform } from './types';
import { translations, Language } from './utils/translations';
import { audioManager } from './utils/audioManager';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('splash');
  const [activeTab, setActiveTab] = useState<'info' | 'conditions' | 'platform'>('platform');
  const [lang, setLang] = useState<Language>('ar');
  const [userId, setUserId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('greenbet');
  const [selectedGame, setSelectedGame] = useState<string>('wild_west');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const rawT = translations[lang];
  
  const processTranslations = (obj: any, p: Platform): any => {
    const platformName = p === 'megapari' ? 'Megapari' : 'WINWIN';
    const newT: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        newT[key] = obj[key].replace(/1xBet|WINWIN/gi, platformName);
      } else {
        newT[key] = obj[key];
      }
    }
    return newT;
  };

  const t = processTranslations(rawT, selectedPlatform);
  const isArabic = lang === 'ar';

  useEffect(() => {
    const initAudio = () => {
        audioManager.resume();
        document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, []);

  const handleSplashComplete = () => {
    setView('platform_selection');
    setActiveTab('platform');
  };

  const handlePlatformSelect = (p: Platform) => {
    setSelectedPlatform(p);
    setView('settings');
    setActiveTab('conditions');
  };

  const handleConditionsSubmit = (id: string, game?: string) => {
    setUserId(id);
    if (game) setSelectedGame(game);
    setView('info');
    setActiveTab('info');
  };

  const handleResetToRules = () => {
    setView('settings');
    setActiveTab('conditions');
  };

  const handleBack = () => {
    audioManager.playClick();
    if (view === 'settings') {
      setView('platform_selection');
      setActiveTab('platform');
    } else if (view === 'info') {
      setView('platform_selection');
      setActiveTab('platform');
    }
  };
  
  const toggleLanguage = (l: Language) => {
      audioManager.playClick();
      setLang(l);
      setIsLangMenuOpen(false);
  }

  const renderContent = () => {
    if (view === 'platform_selection') {
      return <PlatformSelection onSelect={handlePlatformSelect} t={t} />;
    }

    switch (activeTab) {
      case 'info':
        return <InfoView lang={lang} t={t} userId={userId} platform={selectedPlatform} selectedGame={selectedGame} onResetToRules={handleResetToRules} />;
      case 'conditions':
        return <SettingsView onComplete={handleConditionsSubmit} lang={lang} t={t} platform={selectedPlatform} />;
      default:
        return <InfoView lang={lang} t={t} userId={userId} platform={selectedPlatform} selectedGame={selectedGame} onResetToRules={handleResetToRules} />;
    }
  };

  return (
    <div dir="ltr" className={isArabic ? 'font-arabic' : 'font-sans'}>
      <ParticlesBackground />
      {view === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div 
        className={`fixed inset-0 bg-transparent text-white flex flex-col transition-opacity duration-1000 ${view === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <header className="px-6 py-4 flex items-center justify-between border-b border-green-500/10 bg-black/40 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            {view !== 'platform_selection' && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 hover:text-green-500 transition-all group active:scale-90"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-green-500 transition-colors" />
              </button>
            )}
            <div className="flex items-center">
              <span className="text-xl font-display font-black tracking-wider text-white select-none">
                SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 drop-shadow-[0_0_12px_rgba(139,207,0,0.4)]">BET</span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                  backgroundImage: 'linear-gradient(#8bcf00 1px, transparent 1px), linear-gradient(90deg, #8bcf00 1px, transparent 1px)', 
                  backgroundSize: '40px 40px'
              }} 
            />
            <div className="h-full w-full max-w-lg mx-auto relative z-10">
                {renderContent()}
            </div>
        </main>

        {showInfoModal && <RulesModal onClose={() => { audioManager.playClick(); setShowInfoModal(false); }} lang={lang} t={t} />}
      </div>
    </div>
  );
};

export default App;