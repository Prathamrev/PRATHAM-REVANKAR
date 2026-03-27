import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart,
  HeartPulse, 
  Coins, 
  MessageCircle, 
  Wind, 
  Smile, 
  Hospital,
  Mic,
  Volume2,
  VolumeX,
  ArrowRight,
  Globe,
  LayoutDashboard,
  Bell,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from './lib/utils';
import { translations, Language } from './translations';
import { generateHealthInsight, generateIncomeIdea } from './services/gemini';

// --- Components ---

const Avatar = () => (
  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gradient-to-br from-purple-200 to-pink-200">
    <img 
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
      alt="Avatar"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 transition-all duration-300",
      active ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600"
    )}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    {active && <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
  </button>
);

// --- Screens ---

const Dashboard = ({ t, setScreen }: { t: any, setScreen: (s: string) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6 pb-24"
  >
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">{t.welcome},</h1>
        <p className="text-slate-500 font-medium">{t.twinInsights}</p>
      </div>
      <Avatar />
    </div>

    <div className="space-y-4">
      <div className="glass-card p-5 bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-l-4 border-l-purple-400">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <HeartPulse size={20} />
          </div>
          <h3 className="font-bold text-purple-900">{t.healthInsight}</h3>
        </div>
        <p className="text-purple-700/80 text-sm font-medium">{t.healthCheck}</p>
      </div>

      <div className="glass-card p-5 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border-l-4 border-l-amber-400">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Coins size={20} />
          </div>
          <h3 className="font-bold text-amber-900">{t.incomeTip}</h3>
        </div>
        <p className="text-amber-700/80 text-sm font-medium">{t.incomeTipText}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => setScreen('health')}
        className="naari-gradient p-4 rounded-2xl text-white font-bold flex flex-col items-center gap-2 shadow-lg shadow-purple-200 active:scale-95 transition-transform"
      >
        <MessageCircle size={24} />
        <span className="text-xs">{t.askHealth}</span>
      </button>
      <button 
        onClick={() => setScreen('income')}
        className="bg-white p-4 rounded-2xl text-slate-800 font-bold flex flex-col items-center gap-2 shadow-md border border-slate-100 active:scale-95 transition-transform"
      >
        <Sparkles size={24} className="text-amber-500" />
        <span className="text-xs">{t.findIncome}</span>
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {[
        { label: t.healthTipsGiven, val: "980" },
        { label: t.incomeIdeasShared, val: "750" }
      ].map((stat, i) => (
        <div key={i} className="glass-card p-3 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">{stat.label}</p>
          <p className="text-lg font-bold text-slate-800">{stat.val}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const HealthScreen = ({ t, lang }: { t: any, lang: Language }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleAsk = async (textToAsk?: string) => {
    const query = textToAsk || input;
    if (!query) return;
    setLoading(true);
    setResponse(null);
    setAudioUrl(null);
    try {
      const res = await generateHealthInsight(query, lang);
      setResponse(res);
      
      // Generate voice response
      const voiceUrl = await generateSpeech(res, lang);
      if (voiceUrl) {
        setAudioUrl(voiceUrl);
        setIsSpeaking(true);
        const audio = new Audio(voiceUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (e) {
      setResponse("I understand. Try some deep breathing exercises. Consider talking to a friend or taking a short walk.");
    }
    setLoading(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleAsk(transcript);
    };

    recognition.start();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      <h2 className="text-2xl font-bold text-slate-800">{t.health}: <span className="text-slate-400 font-medium text-lg">I'm here to listen</span></h2>

      <div className="space-y-4">
        <div className="glass-card p-5 relative overflow-hidden bg-gradient-to-br from-white to-pink-50/30">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">{t.whatsOnYourMind}</h3>
              <p className="text-[10px] text-slate-400">Share your feelings, health concerns, or just talk.</p>
            </div>
            <Avatar />
          </div>
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'en' ? "I'm feeling a bit down today..." : "أشعر ببعض الإحباط اليوم..."}
              className="w-full bg-slate-50/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button 
                onClick={startListening}
                className={cn(
                  "p-2 rounded-lg shadow-lg active:scale-90 transition-all",
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-primary border border-slate-100"
                )}
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={() => handleAsk()}
                disabled={loading || !input}
                className="p-2 bg-primary text-white rounded-lg shadow-lg active:scale-90 transition-transform disabled:opacity-50"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">
            {lang === 'en' ? "* Voice mode is available for accessibility." : "* وضع الصوت متاح لسهولة الوصول."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center p-4"
            >
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : response ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 border-l-4 border-l-pink-400 bg-pink-50/30"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-bold text-pink-600 uppercase tracking-widest">{t.healthAiResponse}</h4>
                {audioUrl && (
                  <button 
                    onClick={() => {
                      const audio = new Audio(audioUrl);
                      audio.play();
                      setIsSpeaking(true);
                      audio.onended = () => setIsSpeaking(false);
                    }}
                    className={cn(
                      "p-1.5 rounded-full transition-colors",
                      isSpeaking ? "bg-pink-100 text-pink-600" : "text-slate-400 hover:text-pink-500"
                    )}
                  >
                    {isSpeaking ? <Volume2 size={16} className="animate-bounce" /> : <Volume2 size={16} />}
                  </button>
                )}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">"{response}"</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.selfCareTips}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Wind, label: t.breathing, color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Smile, label: t.stressRelief, color: "text-orange-500", bg: "bg-orange-50" },
            { icon: Hospital, label: t.nearbyClinics, color: "text-purple-500", bg: "bg-purple-50" }
          ].map((tip, i) => (
            <button key={i} className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white transition-colors">
              <div className={cn("p-2 rounded-xl", tip.bg, tip.color)}>
                <tip.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{tip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const IncomeScreen = ({ t, lang }: { t: any, lang: Language }) => {
  const [skills, setSkills] = useState("");
  const [idea, setIdea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!skills) return;
    setLoading(true);
    setIdea(null);
    setAudioUrl(null);
    try {
      const res = await generateIncomeIdea(skills, lang);
      setIdea(res);

      // Generate voice response
      const voiceUrl = await generateSpeech(res, lang);
      if (voiceUrl) {
        setAudioUrl(voiceUrl);
        setIsSpeaking(true);
        const audio = new Audio(voiceUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (e) {
      setIdea("Start a home baking business. Sell sweets at local markets.");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      <h2 className="text-2xl font-bold text-slate-800">{t.income}: <span className="text-slate-400 font-medium text-lg">Boost Your Earnings</span></h2>

      <div className="glass-card p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t.skills}</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
            <input 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder={t.placeholderSkills}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !skills}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? t.loading : t.findIncome}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {idea ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-l-4 border-l-amber-500 bg-amber-50/30"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest">{t.naariSuggests}</h4>
              {audioUrl && (
                <button 
                  onClick={() => {
                    const audio = new Audio(audioUrl);
                    audio.play();
                    setIsSpeaking(true);
                    audio.onended = () => setIsSpeaking(false);
                  }}
                  className={cn(
                    "p-1.5 rounded-full transition-colors",
                    isSpeaking ? "bg-amber-100 text-amber-600" : "text-slate-400 hover:text-amber-500"
                  )}
                >
                  {isSpeaking ? <Volume2 size={16} className="animate-bounce" /> : <Volume2 size={16} />}
                </button>
              )}
            </div>
            <p className="text-slate-800 font-bold text-lg leading-snug mb-4">"{idea}"</p>
            <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400" 
                alt="Business Idea"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <button className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  LEARN MORE <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-3">
        {[
          { img: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=150", label: t.createMenu },
          { img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150", label: t.marketGoods },
          { img: "https://images.unsplash.com/photo-1521791136064-7986c2959213?auto=format&fit=crop&q=80&w=150", label: t.connectBuyers }
        ].map((card, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <img src={card.img} alt={card.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="text-[10px] font-bold text-slate-600 text-center">{card.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <div className="min-h-screen gradient-bg flex justify-center p-0 sm:p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl sm:rounded-[3rem] sm:shadow-2xl sm:border-[12px] sm:border-slate-800 overflow-hidden relative flex flex-col h-screen sm:h-[850px]">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 naari-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">NAARI AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLang}
              className="w-10 h-10 glass-card flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <Globe size={20} />
            </button>
            <button className="w-10 h-10 glass-card flex items-center justify-center text-slate-600">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {screen === 'dashboard' && <Dashboard key="dash" t={t} setScreen={setScreen} />}
            {screen === 'health' && <HealthScreen key="health" t={t} lang={lang} />}
            {screen === 'income' && <IncomeScreen key="income" t={t} lang={lang} />}
          </AnimatePresence>
        </main>

        {/* Bottom Nav */}
        <nav className="bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-around items-center safe-area-bottom z-10">
          <NavItem 
            icon={LayoutDashboard} 
            label={t.dashboard} 
            active={screen === 'dashboard'} 
            onClick={() => setScreen('dashboard')} 
          />
          <NavItem 
            icon={Heart} 
            label={t.health} 
            active={screen === 'health'} 
            onClick={() => setScreen('health')} 
          />
          <NavItem 
            icon={Coins} 
            label={t.income} 
            active={screen === 'income'} 
            onClick={() => setScreen('income')} 
          />
        </nav>

        {/* Background Accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
