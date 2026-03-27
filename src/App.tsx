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
  Search,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { cn } from './lib/utils';
import { translations, Language } from './translations';
import { generateHealthInsight, generateIncomeIdea, generateSpeech } from './services/gemini';
import { Toaster, toast } from 'sonner';

// --- Components ---

const Avatar = ({ onClick }: { onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gradient-to-br from-purple-200 to-pink-200 active:scale-95 transition-transform"
  >
    <img 
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
      alt="Avatar"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
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
    className="space-y-8 pb-24"
  >
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-medium">{t.welcome}</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sarah 👋</h2>
        </div>
        <Avatar onClick={() => toast.info(t.profileSettings)} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setScreen('health')}
          className="glass-card p-5 bg-gradient-to-br from-pink-500 to-rose-400 text-white border-none shadow-pink-200/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Today</span>
          </div>
          <p className="text-2xl font-black">92%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.healthStatus}</p>
        </div>
        <div 
          onClick={() => setScreen('income')}
          className="glass-card p-5 bg-gradient-to-br from-amber-500 to-orange-400 text-white border-none shadow-amber-200/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Coins size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Goal</span>
          </div>
          <p className="text-2xl font-black">$450</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.incomeStatus}</p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.twinInsights}</h3>
      <div className="space-y-3">
        <button 
          onClick={() => setScreen('health')}
          className="w-full glass-card p-5 flex items-center gap-4 hover:bg-white transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">{t.healthInsight}</h4>
            <p className="text-xs text-slate-500">{t.healthDesc}</p>
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => setScreen('income')}
          className="w-full glass-card p-5 flex items-center gap-4 hover:bg-white transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">{t.incomeTip}</h4>
            <p className="text-xs text-slate-500">{t.incomeDesc}</p>
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>

    <section className="glass-card p-6 bg-slate-900 text-white border-none relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight">Ready to grow?</h3>
          <p className="text-slate-400 text-xs">Explore new opportunities and wellness guides tailored for you.</p>
        </div>
        <button 
          onClick={() => setScreen('income')}
          className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
        >
          {t.explore}
        </button>
      </div>
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
    </section>
  </motion.div>
);

const HealthScreen = ({ t, lang }: { t: any, lang: Language }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string, content: React.ReactNode } | null>(null);

  const handleAsk = async (textToAsk?: string) => {
    const query = textToAsk || input;
    if (!query) return;
    setLoading(true);
    setResponse(null);
    setAudioUrl(null);
    try {
      const res = await generateHealthInsight(query, lang);
      setResponse(res);
      
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
      toast.error(lang === 'en' ? "Speech recognition is not supported in this browser." : "التعرف على الكلام غير مدعوم في هذا المتصفح.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info(t.listening);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(lang === 'en' ? `Speech error: ${event.error}` : `خطأ في الصوت: ${event.error}`);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleAsk(transcript);
    };

    recognition.start();
  };

  const showBreathing = () => {
    setModalContent({
      title: t.breathing,
      content: (
        <div className="space-y-6 text-center py-8">
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-pink-100 rounded-full mx-auto flex items-center justify-center text-pink-500"
          >
            <Wind size={48} />
          </motion.div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">Inhale... Exhale...</h4>
            <p className="text-slate-500 text-sm">Follow the circle. Breathe in for 4 seconds, hold for 4, and breathe out for 4.</p>
          </div>
          <button 
            onClick={() => setModalContent(null)}
            className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200"
          >
            I feel better
          </button>
        </div>
      )
    });
  };

  const showStressRelief = () => {
    setModalContent({
      title: t.stressRelief,
      content: (
        <div className="space-y-4">
          {[
            "Listen to your favorite music for 10 minutes.",
            "Write down three things you are grateful for.",
            "Take a 5-minute walk without your phone.",
            "Drink a warm cup of herbal tea.",
            "Stretch your neck and shoulders gently."
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl">
              <CheckCircle2 className="text-orange-500 shrink-0 mt-0.5" size={18} />
              <p className="text-slate-700 text-sm font-medium">{tip}</p>
            </div>
          ))}
        </div>
      )
    });
  };

  const showClinics = () => {
    setModalContent({
      title: t.nearbyClinics,
      content: (
        <div className="space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400" 
              alt="Map"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl text-center space-y-2">
                <Hospital className="mx-auto text-primary" size={32} />
                <p className="text-xs font-bold text-slate-800">Searching for clinics near you...</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 glass-card flex justify-between items-center">
              <div>
                <h5 className="font-bold text-slate-800 text-sm">City General Hospital</h5>
                <p className="text-[10px] text-slate-400">0.8 miles away • Open 24/7</p>
              </div>
              <button className="p-2 bg-primary/10 text-primary rounded-lg"><ExternalLink size={16} /></button>
            </div>
            <div className="p-4 glass-card flex justify-between items-center">
              <div>
                <h5 className="font-bold text-slate-800 text-sm">Women's Wellness Center</h5>
                <p className="text-[10px] text-slate-400">1.2 miles away • Closes at 8 PM</p>
              </div>
              <button className="p-2 bg-primary/10 text-primary rounded-lg"><ExternalLink size={16} /></button>
            </div>
          </div>
        </div>
      )
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.health}: <span className="text-slate-400 font-medium text-lg">I'm here to listen</span></h2>
        <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">{t.voiceModeActive}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-5 relative overflow-hidden bg-gradient-to-br from-white to-pink-50/30">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">{t.whatsOnYourMind}</h3>
              <p className="text-[10px] text-slate-400">Share your feelings, health concerns, or just talk.</p>
            </div>
            <Avatar onClick={() => toast.info(t.profileSettings)} />
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
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-0.5 items-center"
                    >
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-pink-400 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
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
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
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
            { icon: Wind, label: t.breathing, color: "text-blue-500", bg: "bg-blue-50", action: showBreathing },
            { icon: Smile, label: t.stressRelief, color: "text-orange-500", bg: "bg-orange-50", action: showStressRelief },
            { icon: Hospital, label: t.nearbyClinics, color: "text-purple-500", bg: "bg-purple-50", action: showClinics }
          ].map((tip, i) => (
            <button 
              key={i} 
              onClick={tip.action}
              className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white transition-all active:scale-95"
            >
              <div className={cn("p-2 rounded-xl", tip.bg, tip.color)}>
                <tip.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{tip.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!modalContent} 
        onClose={() => setModalContent(null)} 
        title={modalContent?.title || ""}
      >
        {modalContent?.content}
      </Modal>
    </motion.div>
  );
};

const IncomeScreen = ({ t, lang }: { t: any, lang: Language }) => {
  const [skills, setSkills] = useState("");
  const [idea, setIdea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const handleGenerate = async () => {
    if (!skills) return;
    setLoading(true);
    setIdea(null);
    setAudioUrl(null);
    try {
      const res = await generateIncomeIdea(skills, lang);
      setIdea(res);

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
                <button 
                  onClick={() => setIsLearnMoreOpen(true)}
                  className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform"
                >
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
          <button 
            key={i} 
            onClick={() => toast.success(`Exploring ${card.label}...`)}
            className="space-y-2 group text-left active:scale-95 transition-transform"
          >
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
              <img src={card.img} alt={card.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="text-[10px] font-bold text-slate-600 text-center">{card.label}</p>
          </button>
        ))}
      </div>

      <Modal 
        isOpen={isLearnMoreOpen} 
        onClose={() => setIsLearnMoreOpen(false)} 
        title="Business Guide"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">How to get started:</h4>
            <ol className="space-y-3">
              {[
                "Research your local market demand.",
                "Create a simple business plan and budget.",
                "Register your business if required.",
                "Start small and gather feedback from customers.",
                "Use social media to promote your services."
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-[10px]">{i+1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <button 
            onClick={() => setIsLearnMoreOpen(false)}
            className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200"
          >
            Got it!
          </button>
        </div>
      </Modal>
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
            <div 
              onClick={() => {
                setScreen('dashboard');
                toast.success("Welcome back to NAARI Dashboard");
              }}
              className="w-10 h-10 naari-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 cursor-pointer active:scale-90 transition-transform"
            >
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">NAARI AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const nextLang = lang === 'en' ? 'ar' : 'en';
                toggleLang();
                toast.success(translations[nextLang].languageChanged);
              }}
              className="w-10 h-10 glass-card flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <Globe size={20} />
            </button>
            <button 
              onClick={() => toast.info(t.noNotifications)}
              className="w-10 h-10 glass-card flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {screen === 'dashboard' && <Dashboard t={t} setScreen={setScreen} />}
            {screen === 'health' && <HealthScreen t={t} lang={lang} />}
            {screen === 'income' && <IncomeScreen t={t} lang={lang} />}
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
        
        <Toaster position="top-center" expand={false} richColors />
      </div>
    </div>
  );
}
