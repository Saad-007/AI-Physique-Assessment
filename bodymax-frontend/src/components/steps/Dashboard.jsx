import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Dumbbell, Target, User, LogOut, 
  Cpu, Camera, ChevronRight, Zap, ScanLine, XCircle, 
  Timer, CheckCircle, Apple, Coffee, Moon, TrendingUp, Star, BicepsFlexed,Clock,X,
  Crosshair, Focus, MessageCircle, Droplets, Footprints, Send, PlayCircle, LayoutGrid,
  Flame
} from 'lucide-react';
import { supabase } from '../../lib/supabase'; 

// --- Mini Component: Premium Progress Bar ---
const ProgressBar = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-mono text-white">{value}%</span>
    </div>
    <div className="w-full bg-white/[0.03] rounded-full h-1.5 border border-white/[0.05] overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

// --- Mini Component: Macro Ring ---
const MacroRing = ({ label, value, max, color, hex, icon: Icon }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#222" strokeWidth="6" />
          <motion.circle 
            cx="50%" cy="50%" r="40%" fill="transparent" stroke={hex} strokeWidth="6" strokeLinecap="round"
            strokeDasharray="250" strokeDashoffset={250 - (250 * percentage) / 100}
            initial={{ strokeDashoffset: 250 }} animate={{ strokeDashoffset: 250 - (250 * percentage) / 100 }} transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          {Icon ? <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} mb-0.5`} /> : <span className="text-[12px] md:text-[14px] font-black text-white">{value}</span>}
          {!Icon && <span className="text-[8px] text-gray-500 font-bold -mt-1">g</span>}
        </div>
      </div>
      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${color} text-center`}>{label}</span>
    </div>
  );
};

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiLogIndex, setAiLogIndex] = useState(0);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Protocol initialized. Do you have any questions about your plan or macros today?' }
  ]);

  const aiLogs = [
    "INIT > Establishing secure connection to OpenAI...",
    "FETCH > Retrieving biometric data & dream physique target...",
    "VISION > AI mapping current body to target goal...",
    "RATING > Calculating Gap Analysis & Physique Score...",
    "DIET > Engineering custom nutrition & meal plans...",
    "BUILD > Generating targeted exercise vectors...",
    "DONE > Compiling Personalized BodyMax Protocol..."
  ];

  useEffect(() => {
    if (isAIGenerating) {
      const interval = setInterval(() => {
        setAiLogIndex((prev) => (prev < aiLogs.length - 1 ? prev + 1 : prev));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isAIGenerating]);

  useEffect(() => {
    fetchUserDataAndProtocol();
  }, []);

  const fetchUserDataAndProtocol = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setSession(session);

      const { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error) throw error;
      setProfile(profileData);

      if (profileData.ai_protocol) {
        setProtocol(profileData.ai_protocol);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsAIGenerating(true);
        await generateAndSaveProtocol(profileData.assessment_data, session.user.id);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const generateAndSaveProtocol = async (assessmentData, userId) => {
    try {
      const response = await fetch("http://localhost:5000/api/generate-protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, assessmentData: assessmentData }),
      });
      if (!response.ok) throw new Error("Backend failed to generate protocol");
      const data = await response.json();
      setProtocol(data.protocol);
      setIsAIGenerating(false);
    } catch (error) {
      console.error("AI Generation Failed:", error);
      setIsAIGenerating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if(!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I'm analyzing your request against your target vectors. Stay tuned!" }]);
    }, 1000);
  };

  if (isLoading || isAIGenerating) {
    return (
      <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4">
        <div className="w-full max-w-[340px] bg-[#0a0a0a] border border-white/[0.05] rounded-xl p-5 shadow-2xl font-mono">
          <div className="flex items-center gap-2 mb-4 border-b border-white/[0.05] pb-3">
            <Cpu className="w-3.5 h-3.5 text-[#E71B25] animate-pulse" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">BodyMax Engine v5.0</span>
          </div>
          <div className="space-y-2 h-[100px] flex flex-col justify-end text-[11px]">
            <AnimatePresence mode="popLayout">
              {aiLogs.slice(0, aiLogIndex + 1).map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className={`${i === aiLogIndex ? "text-white" : "text-gray-600"}`}>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  const safeProtocol = protocol || {};
  const analysis = safeProtocol.body_analysis || { score: 0, classification: "Evaluating...", estimated_bf: "--", bmr: 0, tdee: 0, strengths: [], weaknesses: [], vectors: {}, executive_summary: "" };
  const macros = safeProtocol.macros || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const nutrition = safeProtocol.nutrition || { strategy: "Mapping...", meals: [] };
  const workouts = safeProtocol.workouts || [];
  
  const assessment = profile?.assessment_data || {};
  const userName = profile?.full_name?.split(' ')[0] || 'Athlete';
  const userGoal = assessment.goal || "Hypertrophy & Definition";
  const dreamImage = assessment.dreamPhysiqueImage || assessment.customGoalPhoto || null;
  const userDays = assessment.days || 4;

  const tabs = [
    { id: 'overview', label: 'Report', icon: TrendingUp },
    { id: 'photos', label: 'Scans', icon: ScanLine },
    { id: 'protocol', label: 'Workouts', icon: LayoutGrid },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#030303] text-gray-300 font-sans flex overflow-hidden selection:bg-[#E71B25] selection:text-white relative">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[240px] bg-[#050505] border-r border-white/[0.04] h-screen relative z-20 shrink-0">
      <div className="p-6 md:p-8 flex items-center justify-between">
          <img src="/logo.png" alt="BodyMax" className="h-14 md:h-16 w-auto object-contain" />
          <span className="text-[9px] bg-[#E71B25]/10 text-[#E71B25] border border-[#E71B25]/30 px-2 py-0.5 rounded font-mono ml-3">PRO</span>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 mt-2">Neural Hub</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all duration-300 ${
                activeTab === tab.id ? "bg-white/[0.06] text-white shadow-sm border border-white/[0.02]" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#E71B25]" : ""}`} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.02] mb-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[13px] font-bold truncate text-white">{userName}</p>
              <p className="text-[10px] text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-500 hover:text-[#E71B25] hover:bg-[#E71B25]/10 transition-colors text-[11px] font-bold uppercase tracking-wider">
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <div className="md:hidden fixed top-0 inset-x-0 h-20 bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.04] z-40 flex items-center justify-between px-5">
        <div className="flex items-center h-full py-3">
          <img src="/logo.png" alt="BodyMax" className="h-12 w-auto object-contain max-h-full" />
        </div>
        <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center bg-white/[0.05] rounded-full border border-white/[0.05] hover:bg-[#E71B25]/20 hover:border-[#E71B25]/30 transition-colors">
          <LogOut className="w-4 h-4 text-gray-400 hover:text-[#E71B25]" />
        </button>
      </div>

      {/* NATIVE APP BOTTOM TAB BAR (MOBILE ONLY) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-[85px] bg-[#050505]/95 backdrop-blur-2xl border-t border-white/[0.05] z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5"
            >
              {isActive && (
                <motion.div layoutId="mobile-nav-indicator" className="absolute top-0 w-8 h-[3px] bg-[#E71B25] rounded-b-full shadow-[0_0_10px_#E71B25]" />
              )}
              <tab.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-[#E71B25] drop-shadow-[0_0_8px_rgba(231,27,37,0.5)]" : "text-gray-500"}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-bold tracking-widest transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500"}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* MAIN WORKSPACE SCROLL AREA */}
      <main className="flex-1 relative overflow-y-auto pt-24 md:pt-0 pb-[100px] md:pb-0 bg-[#030303] w-full">
        <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10">
          
          <header className="hidden md:flex mb-8 flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[11px] font-mono text-gray-500">
                <span>DASHBOARD</span> <ChevronRight className="w-3 h-3" /> <span className="text-white uppercase">{activeTab}</span>
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">{userName}'s Neural Hub</h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(231,27,37,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E71B25] animate-pulse"></div> Protocol Synced
            </div>
          </header>

          <AnimatePresence mode="wait">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-6">
                
                <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-white/[0.05] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#E71B25] filter blur-[100px] md:blur-[150px] opacity-[0.08] rounded-full pointer-events-none"></div>
                  
                  <div className="relative w-28 h-28 md:w-40 md:h-40 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#222" strokeWidth="8" />
                      <motion.circle 
                        cx="50%" cy="50%" r="45%" fill="transparent" stroke="#E71B25" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="283" strokeDashoffset={283 - (283 * analysis.score) / 100}
                        initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * analysis.score) / 100 }} transition={{ duration: 2 }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center mt-1">
                      <span className="text-3xl md:text-5xl font-black text-white">{analysis.score}</span>
                      <span className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-[-2px]">Physique</span>
                    </div>
                  </div>

                  <div className="text-center md:text-left z-10 flex-1 w-full">
                    <div className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] px-3 py-1 rounded-full mb-3 shadow-inner">
                      <Target className="w-3.5 h-3.5 text-[#E71B25]" />
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest">Target: {userGoal}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 tracking-tight">Gap Analysis Summary</h2>
                    <p className="text-[12px] md:text-[13.5px] text-gray-400 leading-relaxed font-medium">{analysis.executive_summary}</p>
                    
                    <div className="mt-4 md:mt-5 flex items-start gap-2.5 bg-[#E71B25]/5 border border-[#E71B25]/10 rounded-xl p-3.5 md:p-4">
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#E71B25] shrink-0 mt-0.5" />
                      <p className="text-[11px] md:text-[12px] text-gray-300 leading-relaxed"><span className="font-black text-white uppercase tracking-wider">AI Projection:</span> Strictly following this protocol will visibly shift your morphology towards the <span className="text-[#E71B25] font-bold">"{userGoal}"</span> archetype by Week 4.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 md:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4 md:mb-5 border-b border-white/[0.05] pb-3">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest">Daily Action Engine</h3>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-6 md:gap-12">
                    <MacroRing label="Hydration" value={0} max={100} color="text-blue-400" hex="#3b82f6" icon={Droplets} />
                    <MacroRing label="Activity" value={0} max={100} color="text-green-500" hex="#22c55e" icon={Footprints} />
                    <MacroRing label="Recovery" value={0} max={100} color="text-indigo-400" hex="#818cf8" icon={Moon} />
                  </div>
                  <p className="text-center text-[9px] md:text-[10px] font-medium text-gray-500 mt-4 md:mt-5 uppercase tracking-wider">Connect wearable device in settings to automate tracking.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 md:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-3">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <h3 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest">12-Week Roadmap</h3>
                  </div>
                  <div className="relative pl-6 border-l border-white/[0.05] space-y-6 md:space-y-8 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-3 h-3 bg-[#E71B25] rounded-full shadow-[0_0_10px_#E71B25] border-2 border-[#0a0a0a]"></div>
                      <h4 className="text-[13px] font-bold text-white">Weeks 1-4: Neurological Adaptation</h4>
                      <p className="text-[11.5px] md:text-[12.5px] font-medium text-gray-400 mt-1.5 leading-relaxed">Central nervous system adapts to targeted vectors. Initial glycogen supercompensation occurs. Noticeable strength increase.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-3 h-3 bg-white/[0.1] border-2 border-white/[0.2] rounded-full"></div>
                      <h4 className="text-[13px] font-bold text-gray-400">Weeks 5-8: Hypertrophic Shift</h4>
                      <p className="text-[11.5px] md:text-[12.5px] font-medium text-gray-500 mt-1.5 leading-relaxed">Myofibrillar growth begins in the designated weak zones ({analysis.weaknesses?.[0] || 'target areas'}). Body fat drops towards baseline.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-3 h-3 bg-white/[0.1] border-2 border-white/[0.2] rounded-full"></div>
                      <h4 className="text-[13px] font-bold text-gray-400">Weeks 9-12: Aesthetic Solidification</h4>
                      <p className="text-[11.5px] md:text-[12.5px] font-medium text-gray-500 mt-1.5 leading-relaxed">Visual alignment with the '{userGoal}' archetype. Metabolic rate stabilizes at a higher functional threshold.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-5 border-b border-white/[0.05] pb-3">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <h3 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest">Metabolic Profile</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-[#111] p-4 rounded-2xl border border-white/[0.02]">
                        <span className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Est. Body Fat</span>
                        <span className="text-xl md:text-2xl font-black text-white">{analysis.estimated_bf}</span>
                      </div>
                      <div className="bg-[#111] p-4 rounded-2xl border border-white/[0.02]">
                        <span className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Base Burn (BMR)</span>
                        <span className="text-xl md:text-2xl font-black text-white">{analysis.bmr} <span className="text-[10px] md:text-xs text-gray-500">kcal</span></span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#E71B25]/10 to-transparent border-l-[3px] border-[#E71B25] p-4 rounded-r-2xl rounded-l-sm">
                      <span className="text-[9px] md:text-[10px] text-[#E71B25] uppercase font-bold tracking-widest block mb-1">Target Burn (TDEE)</span>
                      <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                        <span className="text-2xl font-black text-white leading-none">{analysis.tdee}</span>
                        <span className="text-[10px] md:text-xs text-gray-400 font-medium">Calories required daily.</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-5 border-b border-white/[0.05] pb-3">
                      <Focus className="w-4 h-4 text-orange-400" />
                      <h3 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest">Vector Alignment</h3>
                    </div>
                    <ProgressBar label="Upper Body Dev." value={analysis.vectors.upper_body || 0} color="bg-blue-500" />
                    <ProgressBar label="Lower Body Dev." value={analysis.vectors.lower_body || 0} color="bg-orange-500" />
                    <ProgressBar label="Core & Posture" value={analysis.vectors.core || 0} color="bg-yellow-500" />
                    <ProgressBar label="Overall Symmetry" value={analysis.vectors.symmetry || 0} color="bg-[#E71B25]" />
                    <div className="mt-6 bg-[#111] p-4 rounded-2xl border border-white/[0.02]">
                      <span className="text-[9px] md:text-[10px] text-[#E71B25] uppercase font-bold tracking-widest block mb-2.5 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5"/> Discrepancy Zones Identified</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.weaknesses?.map((w, i) => (
                          <span key={i} className="text-[10px] font-medium text-gray-300 bg-white/[0.03] border border-[#E71B25]/30 px-2.5 py-1.5 rounded-lg">{w}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: AI SCANS */}
            {activeTab === 'photos' && (
              <motion.div key="photos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 md:p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-2">
                    <div>
                      <h2 className="text-[16px] md:text-[18px] font-bold text-white">Comparative Matrix Scans</h2>
                      <p className="text-[11px] md:text-[12px] font-medium text-gray-500 mt-0.5">GPT-4o analyzing gap to target morphology</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {[
                      { id: 'front', label: 'Front Map', img: assessment?.photos?.[1], isTarget: false },
                      { id: 'side', label: 'Side Map', img: assessment?.photos?.[2], isTarget: false },
                      { id: 'back', label: 'Back Map', img: assessment?.photos?.[3], isTarget: false },
                      { id: 'target', label: `Target: ${userGoal}`, img: dreamImage, isTarget: true } 
                    ].map((card, i) => (
                      <div key={i} className={`group relative aspect-[3/4] bg-[#050505] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] border ${card.isTarget ? "border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.15)]" : "border-white/[0.05]"}`}>
                        {card.img ? (
                          <>
                            {!card.isTarget ? (
                              <>
                                <motion.div animate={{ top: ['-10%', '110%', '-10%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }} className="absolute left-0 right-0 h-[2px] bg-[#E71B25] shadow-[0_0_15px_#E71B25] z-20 pointer-events-none" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-10 pointer-events-none"></div>
                                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                  <span className="bg-black/80 text-[#E71B25] text-[7px] md:text-[8px] font-mono px-1.5 py-0.5 rounded-sm border border-[#E71B25]/30">SCAN: OK</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay z-10 pointer-events-none"></div>
                                <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                                  <span className="bg-green-500/20 text-green-400 text-[7px] md:text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm border border-green-500/50 flex items-center gap-1"><CheckCircle className="w-2 h-2"/> GOAL</span>
                                </div>
                              </>
                            )}
                            <img src={card.img} alt={card.label} className={`w-full h-full object-cover transition-all duration-700 ${card.isTarget ? "opacity-90 group-hover:scale-105" : "opacity-60 group-hover:opacity-100 filter grayscale-[20%] contrast-125"}`} />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-[#0a0a0a]">
                            <Camera className="w-6 h-6 md:w-8 md:h-8 mb-2 opacity-30" strokeWidth={1.5} />
                            <span className="text-[9px] md:text-[10px] font-bold tracking-wide uppercase text-center px-2">No Visual Data</span>
                          </div>
                        )}
                        <div className={`absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-black/80 backdrop-blur-md px-2 py-1 md:px-2.5 rounded-md text-[8px] md:text-[9px] font-bold tracking-widest border z-20 uppercase truncate max-w-[90%] ${card.isTarget ? "text-green-400 border-green-500/30" : "text-gray-300 border-white/10"}`}>
                          {card.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: NUTRITION */}
            {activeTab === 'nutrition' && (
              <motion.div key="nutrition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-6">
                 <div className="bg-gradient-to-r from-[#0a0a0a] to-[#0d0d0d] border border-white/[0.04] rounded-3xl p-5 md:p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <Apple className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <h2 className="text-[14px] md:text-[16px] font-bold text-white">Metabolic Engine</h2>
                    </div>
                    <span className="text-[10px] md:text-[12px] font-mono text-[#E71B25] font-bold bg-[#E71B25]/10 px-2.5 py-1 rounded-md border border-[#E71B25]/20">{macros.calories} Kcal</span>
                  </div>
                  
                  <p className="text-[12px] md:text-[13px] text-gray-400 leading-relaxed font-medium mb-8">
                    <span className="text-white font-bold block mb-1">To achieve the {userGoal}:</span>
                    {nutrition.strategy}
                  </p>
                  
                  <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12 pb-2">
                    <MacroRing label="Protein" value={macros.protein} max={300} color="text-blue-400" hex="#60A5FA" />
                    <MacroRing label="Carbs" value={macros.carbs} max={400} color="text-yellow-500" hex="#EAB308" />
                    <MacroRing label="Fats" value={macros.fats} max={150} color="text-green-500" hex="#22C55E" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {nutrition.meals?.map((meal, idx) => (
                    <div key={idx} className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 hover:border-white/[0.1] transition-colors relative overflow-hidden group shadow-md">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="flex items-center gap-2">
                          {idx === 0 ? <Coffee className="w-4 h-4 text-gray-400" /> : idx === nutrition.meals.length - 1 ? <Moon className="w-4 h-4 text-gray-400" /> : <Utensils className="w-4 h-4 text-gray-400" />}
                          <h3 className="text-[13px] md:text-[14px] font-bold text-gray-200">{meal.name}</h3>
                        </div>
                        <span className="text-[10px] md:text-[12px] font-mono text-white font-bold bg-white/[0.05] px-2 py-1 rounded-md">{meal.cals} kcal</span>
                      </div>
                      <p className="text-[11.5px] md:text-[12.5px] text-gray-400 leading-relaxed font-medium mb-4 min-h-[35px]">{meal.food}</p>
                      
                      <div className="flex gap-2 pt-3 md:pt-4 border-t border-white/[0.02]">
                        <span className="text-[9px] md:text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">P: {meal.p}g</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">C: {meal.c}g</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">F: {meal.f}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ==========================================
                TAB 4: NAYA CREATIVE PROTOCOL (Workouts) 
                ========================================== */}
            {activeTab === 'protocol' && (
               <motion.div key="protocol" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-6">
                 {/* Header Banner */}
                 <div className="bg-gradient-to-r from-[#E71B25]/20 to-transparent border border-[#E71B25]/30 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <BicepsFlexed className="w-4 h-4 md:w-5 md:h-5 text-[#E71B25]" />
                       <h2 className="text-[14px] md:text-[16px] font-black text-white uppercase tracking-wide">Neural Training Modules</h2>
                     </div>
                     <p className="text-[11px] md:text-[12px] text-gray-400 font-medium">Your customized weekly routine aligned with the {userGoal} objective.</p>
                   </div>
                   <div className="flex items-center gap-4 bg-black/40 px-4 py-2.5 rounded-xl border border-white/[0.05]">
                      <div className="text-center">
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-widest">Modules</span>
                        <span className="text-[14px] font-black text-white">{workouts.length}</span>
                      </div>
                      <div className="w-px h-6 bg-white/[0.1]"></div>
                      <div className="text-center">
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-widest">Weekly Vol</span>
                        <span className="text-[14px] font-black text-[#E71B25]">High</span>
                      </div>
                   </div>
                 </div>

                 {/* Grid Layout for Workouts */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                   {workouts.map((workout, idx) => {
                     // Calculate estimated time (roughly 8 mins per exercise + 5 min warmup)
                     const estTime = (workout.exercises?.length || 0) * 8 + 5;
                     
                     return (
                       <motion.div 
                         whileHover={{ y: -4 }}
                         key={idx} 
                         className="group relative bg-[#0a0a0a] border border-white/[0.04] hover:border-[#E71B25]/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(231,27,37,0.15)] flex flex-col"
                       >
                         {/* Accent Line */}
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E71B25] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                         
                         <div className="p-5 md:p-6 flex flex-col h-full z-10">
                           <div className="flex justify-between items-start mb-4">
                             <div className="bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-lg">
                               <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Mod 0{idx + 1}</span>
                             </div>
                             <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/[0.02]">
                               <div className={`w-1.5 h-1.5 rounded-full ${workout.intensity === 'Low' ? 'bg-blue-500' : workout.intensity === 'High' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-[#E71B25] shadow-[0_0_8px_#E71B25]'}`}></div>
                               <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{workout.intensity}</span>
                             </div>
                           </div>

                           <h4 className="text-[16px] md:text-[18px] font-bold text-white leading-tight mb-3 pr-4 group-hover:text-[#E71B25] transition-colors">{workout.title}</h4>
                           
                           <div className="flex flex-wrap gap-1.5 mb-6">
                             {workout.targets?.map((t, i) => (
                               <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-gray-300 bg-white/[0.05] px-2 py-1 rounded-md">{t}</span>
                             ))}
                           </div>

                           <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                             <div className="flex items-center gap-3 text-gray-500">
                               <div className="flex items-center gap-1">
                                 <Clock className="w-3.5 h-3.5" />
                                 <span className="text-[11px] font-bold">{estTime}m</span>
                               </div>
                               <div className="flex items-center gap-1">
                                 <Activity className="w-3.5 h-3.5" />
                                 <span className="text-[11px] font-bold">{workout.exercises?.length || 0} Exs</span>
                               </div>
                             </div>
                             
                             <button 
                               onClick={() => setSelectedWorkout(workout)} 
                               className="text-[11px] flex items-center justify-center gap-1.5 text-[#E71B25] group-hover:bg-[#E71B25] group-hover:text-white transition-all font-bold bg-[#E71B25]/10 px-4 py-2 rounded-xl uppercase tracking-widest"
                             >
                               Initiate <PlayCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                             </button>
                           </div>
                         </div>
                       </motion.div>
                     );
                   })}
                 </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* FLOATING AI COACH BUTTON */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-[#E71B25] hover:bg-[#C6161F] rounded-full shadow-[0_0_20px_rgba(231,27,37,0.5)] flex items-center justify-center z-40 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* AI COACH MODAL */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#0c0c0c] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 md:p-5 border-b border-white/[0.05] flex items-center justify-between bg-[#111] pt-12 md:pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E71B25]/20 border border-[#E71B25]/50 flex items-center justify-center relative">
                    <Cpu className="w-5 h-5 text-[#E71B25]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111]"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[13px] md:text-[14px]">BodyMax AI Coach</h3>
                    <p className="text-[9px] md:text-[10px] text-green-400 font-mono tracking-wide uppercase">Online & Ready</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-full text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-[12px] md:text-[13px] leading-relaxed font-medium ${msg.role === 'user' ? 'bg-[#E71B25] text-white rounded-tr-sm shadow-md' : 'bg-white/[0.05] border border-white/[0.05] text-gray-300 rounded-tl-sm shadow-inner'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] md:text-[9px] text-gray-500 mt-1.5 uppercase tracking-widest font-bold">{msg.role === 'user' ? 'You' : 'AI Engine'}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/[0.05] bg-[#111] pb-8 md:pb-4">
                <form onSubmit={handleChatSubmit} className="relative">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about your plan..." 
                    className="w-full bg-[#050505] border border-white/[0.05] rounded-full py-3.5 pl-5 pr-14 text-[13px] text-white focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 shadow-inner placeholder-gray-600"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E71B25] rounded-full flex items-center justify-center hover:bg-[#C6161F] transition-colors shadow-md">
                    <Send className="w-4 h-4 text-white -ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* ==========================================
          NAYA CREATIVE: EXECUTION HUD MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedWorkout && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedWorkout(null)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-50" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="fixed top-[2%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[96%] md:w-[90%] max-w-3xl h-[94vh] md:max-h-[85vh] bg-[#0a0a0a] border border-white/[0.1] rounded-3xl z-50 flex flex-col shadow-[0_0_50px_rgba(231,27,37,0.15)] overflow-hidden"
            >
              {/* HUD Header */}
              <div className="p-5 md:p-6 border-b border-white/[0.05] bg-[#0f0f0f] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E71B25]/10 rounded-full blur-3xl"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono font-bold text-[#E71B25] uppercase tracking-widest bg-[#E71B25]/10 px-2.5 py-1 rounded-md border border-[#E71B25]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E71B25] animate-pulse"></span> Live Session
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Activity className="w-3 h-3"/> SYNCING BIOMETRICS</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">{selectedWorkout.title}</h2>
                  </div>
                  <button onClick={() => setSelectedWorkout(null)} className="p-2 md:p-2.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-full transition-colors border border-white/5 group">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Sequential Exercise List */}
              <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#0a0a0a] relative">
                {selectedWorkout.exercises ? (
                  <div className="relative">
                    {/* The Connecting Line */}
                    <div className="absolute left-[17px] md:left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#E71B25] via-white/[0.1] to-white/[0.05] z-0"></div>
                    
                    <div className="space-y-6 md:space-y-8 relative z-10">
                      {selectedWorkout.exercises.map((ex, i) => (
                        <div key={i} className="flex gap-4 md:gap-6 group">
                          {/* Sequential Node */}
                          <div className="flex flex-col items-center mt-1 shrink-0">
                            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#111] border-2 border-[#E71B25] flex items-center justify-center text-[12px] md:text-[14px] font-black text-white shadow-[0_0_15px_rgba(231,27,37,0.3)] z-10 transition-transform group-hover:scale-110">
                              {i + 1}
                            </div>
                          </div>
                          
                          {/* Exercise Content Card */}
                          <div className="bg-[#111] border border-white/[0.03] rounded-2xl p-4 md:p-5 w-full hover:bg-white/[0.02] transition-colors shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div>
                                <h4 className="text-[15px] md:text-[17px] font-bold text-white mb-1.5 leading-tight">{ex.name}</h4>
                                <p className="text-[11.5px] md:text-[12.5px] text-gray-400 font-medium leading-relaxed max-w-md">{ex.notes}</p>
                              </div>
                              
                              <div className="flex items-center gap-3 bg-[#050505] px-4 py-3 rounded-xl border border-white/[0.02] shrink-0">
                                <div className="text-center px-2">
                                  <span className="block text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Volume</span>
                                  <span className="text-[13px] md:text-[14px] font-mono font-bold text-white">{ex.sets} <span className="text-gray-500 text-[10px]">x</span> {ex.reps}</span>
                                </div>
                                <div className="w-px h-8 bg-white/[0.08]"></div>
                                <div className="text-center px-2">
                                  <span className="block text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Rest</span>
                                  <span className="text-[13px] md:text-[14px] font-mono font-bold text-[#E71B25] flex items-center justify-center gap-1"><Timer className="w-3.5 h-3.5" strokeWidth={2.5} /> {ex.rest}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-30" strokeWidth={1.5} />
                    <p className="text-gray-400 text-[14px] font-medium">Neural mapping required. Generate protocol first.</p>
                  </div>
                )}
              </div>

              {/* HUD Footer */}
              <div className="p-4 md:p-6 border-t border-white/[0.05] bg-[#0f0f0f] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/[0.05] flex items-center gap-2 flex-1 md:flex-none justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Est. Burn</span>
                      <span className="text-[12px] font-mono font-bold text-white leading-none mt-0.5">320 kcal</span>
                    </div>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/[0.05] flex items-center gap-2 flex-1 md:flex-none justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Duration</span>
                      <span className="text-[12px] font-mono font-bold text-white leading-none mt-0.5">45 min</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => setSelectedWorkout(null)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#E71B25] hover:bg-[#C6161F] text-white px-10 py-4 md:py-3.5 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(231,27,37,0.4)]">
                  End Session <CheckCircle className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;