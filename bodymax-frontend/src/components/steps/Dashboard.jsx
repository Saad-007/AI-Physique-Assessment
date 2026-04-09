import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Dumbbell, Target, User, LogOut,
  Cpu, Camera, ChevronRight, Zap, ScanLine, XCircle, Utensils,
  Timer, CheckCircle, Apple, Coffee, Moon, TrendingUp, Star, BicepsFlexed, Clock, X,
  Crosshair, Focus, MessageCircle, Droplets, Footprints, Send, PlayCircle, LayoutGrid,
  Flame, Lock, Pause, ZapOff, BarChart2, ShieldCheck, Sparkles, Hexagon, Check, Award, BarChart, Crown, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateDailyStreak } from '../../utils/streakUtils';
import { toBlob } from 'html-to-image';
import UserProfile from '../ui/UserProfile';
import PaywallModal from '../ui/PaywalModal';

// --- Mini Component: Premium Progress Bar ---
const ProgressBar = ({ label, value, color, showPercentage = true }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      {showPercentage && <span className="text-[10px] font-mono text-white">{value}%</span>}
    </div>
    <div className="w-full bg-white/[0.03] rounded-full h-1 border border-white/[0.05] overflow-hidden">
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
      <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#222" strokeWidth="4" />
          <motion.circle
            cx="50%" cy="50%" r="40%" fill="transparent" stroke={hex} strokeWidth="4" strokeLinecap="round"
            strokeDasharray="250" strokeDashoffset={250 - (250 * percentage) / 100}
            initial={{ strokeDashoffset: 250 }} animate={{ strokeDashoffset: 250 - (250 * percentage) / 100 }} transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          {Icon ? <Icon className={`w-4 h-4 ${color} mb-0.5`} /> : <span className="text-[11px] font-black text-white">{value}</span>}
          {!Icon && <span className="text-[7px] text-gray-500 font-bold -mt-1">g</span>}
        </div>
      </div>
      <span className={`text-[8px] font-bold uppercase tracking-widest ${color} text-center`}>{label}</span>
    </div>
  );
};

// --- Mini Component: Scan Results Stat Block ---
const ScanStatBlock = ({ label, value, delta, isNegative, progress }) => (
  <div className="flex flex-col mb-6">
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="text-[10px] md:text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">{label}</span>
      <div className="w-3.5 h-3.5 rounded-full border border-[#3f3f46] flex items-center justify-center text-[7px] text-[#a1a1aa]">?</div>
    </div>
    <div className="flex items-baseline gap-1.5 mb-2">
      <span className={`text-[36px] md:text-[42px] font-bold leading-none ${isNegative ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>{value}</span>
      <span className={`text-[14px] md:text-[16px] font-bold ${isNegative ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
        {isNegative ? '' : '+'}{delta}
      </span>
    </div>
    <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full rounded-full ${isNegative ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`}
      />
    </div>
  </div>
);

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiLogIndex, setAiLogIndex] = useState(0);
  const scanRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  // GAMIFICATION & PROGRESS STATES
  const [streak, setStreak] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLevelUp, setIsLevelUp] = useState(false);

  const [expandedWeek, setExpandedWeek] = useState(1);

  // EXERCISE TIMER STATES
  const [activeTimerEx, setActiveTimerEx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerTotal, setTimerTotal] = useState(60);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Protocol initialized. Do you have any questions about your plan or macros today?' }
  ]);

  // PAYWALL STATE (For Expiration)
  const [showRenewalPaywall, setShowRenewalPaywall] = useState(false);

  const aiLogs = [
    "INIT > Establishing secure connection to OpenAI...",
    "FETCH > Retrieving biometric data & dream physique target...",
    "VISION > AI mapping current body to target goal...",
    "RATING > Calculating Gap Analysis & Physique Score...",
    "DIET > Engineering custom nutrition & meal plans...",
    "BUILD > Generating targeted exercise vectors...",
    "DONE > Compiling Personalized BodyMax Protocol..."
  ];

  // Dynamic Variables for Workout Logic
  const assessment = profile?.assessment_data || {};
  const safeProtocol = protocol || {};
  const workoutsList = safeProtocol.workouts || [];
  const planDurationText = assessment.planDuration || "Free Tier";
  const maxWeeks = parseInt(planDurationText.split('-')[0]) || 0;
  const workoutsPerWeek = workoutsList.length || 1;
  const programTotalWorkouts = maxWeeks > 0 ? (maxWeeks * workoutsPerWeek) : 0;

  // EXPIRATION LOGIC
  useEffect(() => {
    if (!isLoading && profile) {
      const activePlan = profile?.assessment_data?.planDuration;

      if (!activePlan || activePlan === "Free Tier") {
        setShowRenewalPaywall(true);
      } else {
        const totalPlanDays = parseInt(activePlan.split('-')[0]) * 7 || 0;
        const currentStreakDays = profile?.current_streak || 0;

        if (totalPlanDays > 0 && currentStreakDays >= totalPlanDays) {
          setShowRenewalPaywall(true);
        } else {
          setShowRenewalPaywall(false);
        }
      }
    }
  }, [profile, isLoading, completedWorkouts]);

  let currentWeek = Math.floor(completedWorkouts / workoutsPerWeek) + 1;
  let doneThisWeek = completedWorkouts % workoutsPerWeek;
  if (currentWeek > maxWeeks) { currentWeek = maxWeeks; doneThisWeek = workoutsPerWeek; }

  useEffect(() => {
    setExpandedWeek(currentWeek);
  }, [currentWeek]);

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

  useEffect(() => {
    if (profile) {
      setStreak(profile.current_streak || 0);
    }
  }, [profile]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase.from('user_workout_progress').select('completed_workouts, total_workouts').eq('user_id', session.user.id).maybeSingle();
      if (data) {
        setCompletedWorkouts(data.completed_workouts || 0);
        setTotalWorkouts(data.total_workouts || 3);
      }
    };
    if (session) fetchProgress();
  }, [session]);

  // ==========================================
  // 🔴 TIMER & AUTOMATIC DONE LOGIC
  // ==========================================
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);

      // Timer zero hotay hi automatic exercise ko Done mark kar dein
      if (activeTimerEx !== null && selectedWorkout) {
        const alreadyDone = selectedWorkout.completedExercises || [];
        if (!alreadyDone.includes(activeTimerEx)) {
          setSelectedWorkout(prev => ({
            ...prev,
            completedExercises: [...alreadyDone, activeTimerEx]
          }));
          setToastMessage("✅ Exercise Completed!");
          setTimeout(() => setToastMessage(null), 2500);
        }
      }
      setActiveTimerEx(null);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, activeTimerEx, selectedWorkout]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleTimer = (index, restString) => {
    if (activeTimerEx === index && isTimerActive) {
      setIsTimerActive(false);
    } else {
      if (activeTimerEx !== index) {
        const match = restString.match(/\d+/);
        const time = match ? parseInt(match[0], 10) : 60;
        setTimeLeft(time); // Developer Tip: Change 'time' to 2 seconds for quick testing if needed
        setTimerTotal(time);
      }
      setActiveTimerEx(index);
      setIsTimerActive(true);
    }
  };

  const closeWorkoutModal = () => {
    setSelectedWorkout(null);
    setActiveTimerEx(null);
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleShare = async () => {
    if (!scanRef.current) return;
    setIsSharing(true);

    const currentScore = analysis.overall_rating || analysis.score || 82;
    const potentialScore = analysis.potential_rating || analysis.potential || 95;
    const bodyFat = analysis.body_fat_percentage || "18%";

    const shareText = `🤖 BodyMax AI Physique Scan 🤖\n\n` +
      `📊 OVERALL SCORE: ${currentScore}/100\n` +
      `🔥 GENETIC POTENTIAL: ${potentialScore}/100\n` +
      `💧 BODY FAT: ${bodyFat}\n\n` +
      `Think you can beat my genetics? Get your AI scan here:\n` +
      `🔗 https://ai-physique-assessment.vercel.app`;

    try {
      const blob = await toBlob(scanRef.current, {
        quality: 0.95,
        backgroundColor: '#030303',
        pixelRatio: 2
      });

      if (!blob) throw new Error("Image generation failed");
      const file = new File([blob], 'BodyMax-Scan.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My BodyMax Scan',
          text: shareText,
          files: [file]
        });
      } else {
        try {
          await navigator.clipboard.writeText(shareText);
        } catch (clipErr) {
          console.log("Clipboard copy failed", clipErr);
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BodyMax-Scan.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setToastMessage('📸 Image Saved & Text Copied! Just Paste (Ctrl+V) anywhere.');
        setTimeout(() => setToastMessage(null), 4000);
      }
      setIsSharing(false);
    } catch (err) {
      console.error('Sharing failed', err);
      setIsSharing(false);
      setToastMessage('Failed to generate share image.');
    }
  };

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
      } else if (profileData.assessment_data) {
        setIsLoading(false);
        setIsAIGenerating(true);
        await generateAndSaveProtocol(profileData.assessment_data, session.user.id);
      } else {
        window.location.href = '/assessment';
      }
    } catch (error) {
      console.error("Fetch Data Error:", error);
      setIsLoading(false);
    }
  };

  const generateAndSaveProtocol = async (assessmentData, userId) => {
    try {
      setIsAIGenerating(true);
      const safePayload = { userId: userId, assessmentData: { ...assessmentData, dreamPhysiquePreview: undefined, dreamPhysiqueFile: undefined, photoFiles: undefined } };
      const backendUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "https://ai-physique-assessment.onrender.com";
      const response = await fetch(`${backendUrl}/api/generate-protocol`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(safePayload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Server responded with an error");
      if (!data || !data.protocol) throw new Error("AI generated an empty response. Please try again.");
      await supabase.from('profiles').update({ ai_protocol: data.protocol }).eq('id', userId);
      setProtocol(data.protocol);
      setIsAIGenerating(false);
    } catch (error) {
      console.error("❌ AI Generation Failed:", error);
      alert(`Failed to build protocol: ${error.message}`);
      setIsAIGenerating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I'm analyzing your request against your target vectors. Stay tuned!" }]);
    }, 1000);
  };

  // RPG XP & LEVELING SYSTEM
  const xpPerWorkout = 250;
  const currentXP = completedWorkouts * xpPerWorkout;
  const currentLevel = Math.floor(currentXP / 1000) + 1;
  const xpInCurrentLevel = currentXP % 1000;
  const xpNeeded = 1000;

  const rankBadges = [
    { level: 1, name: "NEURAL INITIATE", icon: User, color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30" },
    { level: 2, name: "IRON APPRENTICE", icon: Activity, color: "text-zinc-300", bg: "bg-zinc-500/10", border: "border-zinc-500/30" },
    { level: 4, name: "KINETIC ADEPT", icon: Dumbbell, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { level: 7, name: "CYBER-ATHLETE", icon: BicepsFlexed, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { level: 10, name: "ELITE VANGUARD", icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { level: 15, name: "APEX PREDATOR", icon: Crown, color: "text-[#E71B25]", bg: "bg-[#E71B25]/10", border: "border-[#E71B25]/30" },
  ];

  const getCurrentBadge = (level) => {
    for (let i = rankBadges.length - 1; i >= 0; i--) {
      if (level >= rankBadges[i].level) return rankBadges[i];
    }
    return rankBadges[0];
  };

  const currentBadge = getCurrentBadge(currentLevel);
  const rankName = currentBadge.name;
  const CurrentRankIcon = currentBadge.icon;

  const weeklyChartData = Array.from({ length: maxWeeks > 0 ? maxWeeks : 4 }, (_, i) => {
    const weekNum = i + 1;
    let done = 0;
    if (completedWorkouts >= weekNum * workoutsPerWeek) {
      done = workoutsPerWeek;
    } else if (completedWorkouts > i * workoutsPerWeek) {
      done = completedWorkouts % workoutsPerWeek;
    }
    return { week: weekNum, done, max: workoutsPerWeek };
  });

  const handleEndSession = async () => {
    if (!session?.user?.id || !selectedWorkout) return;

    // Double Check: Ensure all exercises are actually done before completing
    const isAllDone = selectedWorkout.completedExercises?.length === selectedWorkout.exercises?.length;
    if (!isAllDone) return;

    const currentWorkoutIndex = workoutsList.findIndex(w => w.title === selectedWorkout.title);
    let justUnlocked = false;
    let newCount = completedWorkouts;
    let isWeekComplete = false;
    let leveledUp = false;

    if (currentWorkoutIndex === doneThisWeek && completedWorkouts < programTotalWorkouts) {
      newCount = completedWorkouts + 1;
      setCompletedWorkouts(newCount);
      justUnlocked = true;

      if (newCount % workoutsPerWeek === 0) isWeekComplete = true;

      const newXP = newCount * xpPerWorkout;
      const newCalculatedLevel = Math.floor(newXP / 1000) + 1;
      if (newCalculatedLevel > currentLevel) {
        leveledUp = true;
        setIsLevelUp(true);
      }

      const { data: existingProgress } = await supabase.from('user_workout_progress').select('id').eq('user_id', session.user.id).maybeSingle();
      if (existingProgress) {
        await supabase.from('user_workout_progress').update({ completed_workouts: newCount }).eq('user_id', session.user.id);
      } else {
        await supabase.from('user_workout_progress').insert({ user_id: session.user.id, completed_workouts: newCount, total_workouts: programTotalWorkouts });
      }
    }

    const result = await updateDailyStreak(session.user.id);
    if (result && result.updated) {
      setStreak(result.streak);
    }

    closeWorkoutModal();

    if (leveledUp) {
      setToastMessage(`⚡ LEVEL UP! You are now Level ${currentLevel + 1}.`);
    } else if (isWeekComplete) {
      setToastMessage(`🎉 Week ${currentWeek} Complete! Next phase unlocked.`);
    } else if (justUnlocked) {
      setToastMessage(`✅ +250 XP Acquired. Module Secured.`);
    } else {
      setToastMessage(`⚡ Session Logged. Consistency is key.`);
    }

    setTimeout(() => {
      setToastMessage(null);
      setIsLevelUp(false);
    }, 5000);
  };


  if (isLoading || isAIGenerating) {
    const progressPercentage = Math.round(((aiLogIndex + 1) / aiLogs.length) * 100);

    return (
      <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E71B25] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[360px] bg-[#0a0a0a] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl font-mono relative z-10 overflow-hidden">
          <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-[#E71B25] animate-pulse" />
              <span className="text-[10px] md:text-[11px] text-white font-bold uppercase tracking-[0.2em]">BodyMax Engine</span>
            </div>
            <span className="text-[10px] text-[#E71B25] font-black">{progressPercentage}%</span>
          </div>

          <div className="space-y-3 h-[120px] flex flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)] pb-1">
            <AnimatePresence mode="popLayout">
              {aiLogs.slice(0, aiLogIndex + 1).map((log, i) => {
                const isActive = i === aiLogIndex;
                return (
                  <motion.div
                    layout
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: isActive ? 1 : 0.3, y: 0, scale: 1 }}
                    className="flex items-start gap-2"
                  >
                    <span className={`text-[11px] font-bold mt-[1px] ${isActive ? "text-[#E71B25]" : "text-gray-700"}`}>›</span>
                    <div className={`text-[11px] md:text-[12px] leading-relaxed tracking-wide ${isActive ? "text-white" : "text-gray-500"}`}>
                      {log}
                      {isActive && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="inline-block w-1.5 h-3 bg-[#E71B25] ml-1.5 align-middle"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-6 h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E71B25]/50 to-[#E71B25] shadow-[0_0_10px_#E71B25]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const analysis = safeProtocol.body_analysis || { score: 0, overall_rating: 0, classification: "Evaluating...", estimated_bf: "--", bmr: 0, tdee: 0, strengths: [], weaknesses: [], executive_summary: "" };
  const macros = safeProtocol.macros || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const nutrition = safeProtocol.nutrition || { strategy: "Mapping...", meals: [] };
  const userName = profile?.full_name?.split(' ')[0] || 'Athlete';
  const userGoal = assessment.goal || "Hypertrophy & Definition";
  const dreamImage = assessment.dreamPhysiqueImage || assessment.customGoalPhoto || null;
  const planDurationTitle = planDurationText.replace('-', ' ').toUpperCase();

  const getDefaultRoadmap = (duration) => {
    if (duration === "1-Week") {
      return [
        { phase: "Days 1-3: Initiation", description: "Establishing baseline movement patterns and metabolic priming." },
        { phase: "Days 4-5: Overload", description: "Pushing target muscle groups to stimulate initial adaptation." },
        { phase: "Days 6-7: Assessment", description: "Active recovery and assessing your body's initial biometric response." }
      ];
    } else if (duration === "4-Week") {
      return [
        { phase: "Week 1: Foundation", description: "Neuromuscular adaptation and technique refinement." },
        { phase: "Week 2-3: Progression", description: "Progressive overload applied. Initial metabolic shifts occur." },
        { phase: "Week 4: Realization", description: "Peak intensity week followed by visual and strength realization." }
      ];
    } else {
      return [
        { phase: "Weeks 1-4: Priming", description: "Your central nervous system adapts to targeted vectors. Initial supercompensation occurs." },
        { phase: "Weeks 5-8: Recomposition", description: "Myofibrillar growth begins in your designated weak zones. Body fat drops steadily." },
        { phase: "Weeks 9-12: Integration", description: "Visual alignment with your target archetype is achieved. Metabolic rate stabilizes." }
      ];
    }
  };

  const roadmap = safeProtocol.roadmap || getDefaultRoadmap(planDurationText);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'overview', label: 'Report', icon: TrendingUp },
    { id: 'photos', label: 'Scans', icon: ScanLine },
    { id: 'protocol', label: 'Workouts', icon: LayoutGrid },
    { id: 'analytics', label: 'Telemetry', icon: BarChart2 },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#030303] text-gray-300 font-sans flex overflow-hidden selection:bg-[#E71B25] selection:text-white relative">

      <AnimatePresence>
        {showRenewalPaywall && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <PaywallModal
              isOpen={true}
              onClose={() => { }}
              formData={assessment}
            />
          </div>
        )}
      </AnimatePresence>

      <div className={`w-full flex h-full transition-all duration-500 ${showRenewalPaywall ? 'filter blur-[10px] pointer-events-none scale-[0.98]' : ''}`}>

        {/* MOTIVATION TOAST POPUP */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] backdrop-blur-xl border px-5 py-3.5 rounded-full flex items-center justify-center gap-3 font-bold text-[13px] md:text-[14px] w-[90%] md:w-auto text-center shadow-2xl
                ${isLevelUp ? "bg-[#E71B25]/90 border-white text-white shadow-[0_10px_40px_rgba(231,27,37,0.6)]" : "bg-[#111]/90 border-[#E71B25]/50 text-white shadow-[0_10px_30px_rgba(231,27,37,0.3)]"}
              `}
            >
              {isLevelUp ? <CurrentRankIcon className="w-6 h-6 text-yellow-300 animate-bounce" /> : <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />}
              <span dangerouslySetInnerHTML={{ __html: toastMessage }} />
            </motion.div>
          )}
        </AnimatePresence>

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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all duration-300 ${activeTab === tab.id ? "bg-white/[0.06] text-white shadow-sm border border-white/[0.02]" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#E71B25]" : ""}`} strokeWidth={2.5} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.02] mb-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shrink-0 border border-white/5 relative">
                <CurrentRankIcon className={`w-4 h-4 ${currentBadge.color}`} />
                <div className="absolute -bottom-1 -right-1 bg-[#E71B25] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#050505]">
                  {currentLevel}
                </div>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-[13px] font-bold truncate text-white">{userName}</p>
                <p className={`text-[9px] ${currentBadge.color} font-bold tracking-widest uppercase truncate`}>{rankName}</p>
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
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center ${currentBadge.bg} border ${currentBadge.border} px-2.5 py-1 rounded-lg gap-1.5`}>
              <CurrentRankIcon className={`w-3.5 h-3.5 ${currentBadge.color}`} />
              <span className="text-[11px] font-black text-white">LVL {currentLevel}</span>
            </div>
          </div>
        </div>

        {/* NATIVE APP BOTTOM TAB BAR */}
        <div className="md:hidden fixed bottom-0 inset-x-0 h-[85px] bg-[#050505]/95 backdrop-blur-2xl border-t border-white/[0.05] z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5">
                {isActive && <motion.div layoutId="mobile-nav-indicator" className="absolute top-0 w-8 h-[3px] bg-[#E71B25] rounded-b-full shadow-[0_0_10px_#E71B25]" />}
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
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-gray-500">
                  <span>DASHBOARD</span> <ChevronRight className="w-3 h-3" /> <span className="text-white uppercase">{activeTab}</span>
                </div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">{userName}'s Neural Hub</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black border border-white/[0.1] px-4 py-1.5 rounded-lg shadow-md cursor-default">
                  <CurrentRankIcon className={`w-4 h-4 ${currentBadge.color}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white leading-tight">LVL {currentLevel}</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-tight">{rankName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#E71B25]/10 border border-[#E71B25]/20 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(231,27,37,0.15)]">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`} />
                  <span className="text-[12px] font-black text-white">{streak}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Day Streak</span>
                </div>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {/* TAB 0: USER PROFILE */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <UserProfile profile={profile} currentLevel={currentLevel} rankName={rankName} streak={streak} />
                </motion.div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-5">
                  <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-white/[0.04] rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#E71B25] filter blur-[100px] md:blur-[120px] opacity-[0.06] rounded-full pointer-events-none"></div>

                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 flex items-center justify-center cursor-pointer" onClick={() => setActiveTab('photos')}>
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#222" strokeWidth="6" />
                        <motion.circle
                          cx="50%" cy="50%" r="45%" fill="transparent" stroke="#E71B25" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray="283" strokeDashoffset={283 - (283 * (analysis.overall_rating || analysis.score || 80)) / 100}
                          initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (analysis.overall_rating || analysis.score || 80)) / 100 }} transition={{ duration: 2 }}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center mt-1">
                        <span className="text-2xl md:text-4xl font-black text-white">{analysis.overall_rating || analysis.score || 80}</span>
                        <span className="text-[7px] md:text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-[-2px]">Physique</span>
                      </div>
                    </div>

                    <div className="text-center md:text-left z-10 flex-1 w-full">
                      <div className="inline-flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] px-2.5 py-1 rounded-full mb-3 shadow-inner">
                        <Target className="w-3 h-3 text-[#E71B25]" />
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-300 uppercase tracking-widest">Target: {userGoal}</span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">Gap Analysis Summary</h2>
                      <p className="text-[11px] md:text-[12px] text-gray-400 leading-relaxed font-medium">{analysis.executive_summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/[0.05] pb-2.5">
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                        <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">Metabolic Profile</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#111] p-3 rounded-2xl border border-white/[0.02]">
                          <span className="text-[8px] md:text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Est. Body Fat</span>
                          <span className="text-lg md:text-xl font-black text-white">{analysis.body_fat_percentage || analysis.estimated_bf || "18%"}</span>
                        </div>
                        <div className="bg-[#111] p-3 rounded-2xl border border-white/[0.02]">
                          <span className="text-[8px] md:text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Base Burn (BMR)</span>
                          <span className="text-lg md:text-xl font-black text-white">{analysis.bmr} <span className="text-[9px] text-gray-500">kcal</span></span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#E71B25]/10 to-transparent border-l-[2px] border-[#E71B25] p-3 rounded-r-xl rounded-l-sm">
                        <span className="text-[8px] md:text-[9px] text-[#E71B25] uppercase font-bold tracking-widest block mb-1">Target Burn (TDEE)</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white leading-none">{analysis.tdee}</span>
                          <span className="text-[9px] text-gray-400 font-medium">kcal/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/[0.05] pb-2.5">
                        <Focus className="w-3.5 h-3.5 text-orange-400" />
                        <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">Target Alignment</h3>
                      </div>
                      <ProgressBar label="Chest & Shoulders" value={analysis.chest_score || analysis.vectors?.upper_body || 76} color="bg-blue-500" />
                      <ProgressBar label="Lower Body Dev." value={analysis.legs_score || analysis.vectors?.lower_body || 75} color="bg-orange-500" />
                      <ProgressBar label="Core & Posture" value={analysis.abs_score || analysis.vectors?.core || 81} color="bg-yellow-500" />
                      <ProgressBar label="Back & Symmetry" value={analysis.back_score || analysis.vectors?.symmetry || 78} color="bg-[#E71B25]" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AI SCANS */}
              {activeTab === 'photos' && (() => {
                const muscleScores = [
                  { name: 'chest development', score: analysis.chest_score || 76 },
                  { name: 'shoulder width', score: analysis.shoulders_score || 80 },
                  { name: 'back symmetry', score: analysis.back_score || 78 },
                  { name: 'core definition', score: analysis.abs_score || 81 },
                  { name: 'leg base', score: analysis.legs_score || 75 },
                  { name: 'arm size', score: analysis.arms_score || 79 },
                ];
                const weakestMuscle = muscleScores.reduce((prev, curr) => prev.score < curr.score ? prev : curr);
                const limitingPercentage = 100 - weakestMuscle.score;
                const dynamicLimiterName = analysis.worst_feature || weakestMuscle.name;

                // 🔴 CORRECTION: Define images inside the block to ensure they exist
                const currentImage = assessment?.photos?.[1] || assessment?.photos?.[0] || '/placeholder.jpg';
                const displayDreamImage = assessment?.dreamPhysiqueImage || '/placeholder.jpg';

                return (
                  <motion.div ref={scanRef} key="photos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center w-full max-w-4xl mx-auto pt-2 md:pt-4 pb-20 px-2 md:px-8 bg-[#030303]">

                    <div className="w-full flex flex-col items-center justify-center mb-10 relative text-center pt-4">
                      <h2 className="text-[20px] md:text-[26px] font-black text-white tracking-tight uppercase">Your BodyMax Score</h2>
                      <p className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">Current Physique vs Dream Target</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 w-full">
                      {/* CURRENT STATE IMAGE */}
                      <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-[2rem] border-[2px] border-white/10 overflow-hidden bg-[#0a0a0a] relative group shadow-2xl">
                        <img
                          src={currentImage}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          alt="Current"
                          onError={(e) => { e.target.src = '/placeholder.jpg' }}
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute bottom-4 w-full flex justify-center">
                          <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            <span className="text-[9px] md:text-[11px] font-black text-white tracking-widest uppercase">Current State</span>
                          </div>
                        </div>
                      </div>

                      {/* TARGET GOAL IMAGE */}
                      <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-[2rem] border-[2px] border-[#E71B25]/40 overflow-hidden bg-[#0a0a0a] relative group shadow-2xl">
                        <img
                          src={displayDreamImage}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover filter grayscale-[10%]"
                          alt="Target"
                          onError={(e) => { e.target.src = '/placeholder.jpg' }}
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute bottom-4 w-full flex justify-center">
                          <div className="bg-[#111]/90 backdrop-blur-md border border-[#E71B25]/50 px-4 py-2 rounded-full flex items-center gap-2">
                            <Target className="w-3 h-3 text-[#E71B25]" />
                            <span className="text-[9px] md:text-[11px] font-black text-white tracking-widest uppercase">Target Goal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-w-2xl px-4 mb-10">
                      <div className="w-full bg-[#111] rounded-[1.5rem] p-4 md:p-6 flex flex-row items-center gap-4 md:gap-6 shadow-lg">
                        <div className="flex items-center justify-center shrink-0 pr-4 md:pr-6 border-r border-[#22c55e]/20">
                          <span className="text-[36px] md:text-[48px] font-black text-[#22c55e] leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            {analysis.dream_body_chances || "92%"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] md:text-[14px] text-gray-300 leading-snug md:leading-relaxed font-medium text-left">
                            You have a <span className="text-white font-black">{analysis.dream_body_chances || "92%"} chance</span> of achieving your exact dream physique if you strictly execute your custom BodyMax protocol.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4 mb-12 max-w-2xl">
                      <ScanStatBlock label="CHEST" value={analysis.chest_score || analysis.vectors?.upper_body || 76} delta={analysis.chest_delta?.replace(/[+-]/g, '') || "2.1"} isNegative={(analysis.chest_score || analysis.vectors?.upper_body || 76) < 60} progress={analysis.chest_score || analysis.vectors?.upper_body || 76} />
                      <ScanStatBlock label="SHOULDERS" value={analysis.shoulders_score || analysis.vectors?.upper_body || 80} delta={analysis.shoulders_delta?.replace(/[+-]/g, '') || "3.0"} isNegative={(analysis.shoulders_score || analysis.vectors?.upper_body || 80) < 60} progress={analysis.shoulders_score || analysis.vectors?.upper_body || 80} />
                      <ScanStatBlock label="BACK" value={analysis.back_score || analysis.vectors?.symmetry || 78} delta={analysis.back_delta?.replace(/[+-]/g, '') || "1.8"} isNegative={(analysis.back_score || analysis.vectors?.symmetry || 78) < 60} progress={analysis.back_score || analysis.vectors?.symmetry || 78} />
                      <ScanStatBlock label="ABS & CORE" value={analysis.abs_score || analysis.vectors?.core || 81} delta={analysis.abs_delta?.replace(/[+-]/g, '') || "2.5"} isNegative={(analysis.abs_score || analysis.vectors?.core || 81) < 60} progress={analysis.abs_score || analysis.vectors?.core || 81} />
                      <ScanStatBlock label="LEGS" value={analysis.legs_score || analysis.vectors?.lower_body || 75} delta={analysis.legs_delta?.replace(/[+-]/g, '') || "1.5"} isNegative={(analysis.legs_score || analysis.vectors?.lower_body || 75) < 60} progress={analysis.legs_score || analysis.vectors?.lower_body || 75} />
                      <ScanStatBlock label="ARMS" value={analysis.arms_score || analysis.vectors?.upper_body || 79} delta={analysis.arms_delta?.replace(/[+-]/g, '') || "2.2"} isNegative={(analysis.arms_score || analysis.vectors?.upper_body || 79) < 60} progress={analysis.arms_score || analysis.vectors?.upper_body || 79} />
                    </div>

                    <div className="w-full max-w-2xl px-4 mb-10">
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 md:p-8 mb-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                          <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] shrink-0">
                            <Check className="w-5 h-5" strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">What's Working</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Genetic Advantages</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(Array.isArray(analysis.strengths) && analysis.strengths.length > 0 ? analysis.strengths : ["Wide shoulder frame", "Good waist structure", "Strong leg base", "High V-taper potential"]).map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0"></div>
                              <span className="text-[13px] md:text-[14px] font-medium text-gray-300 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                          <div className="w-8 h-8 rounded-full bg-[#E71B25]/10 flex items-center justify-center text-[#E71B25] shrink-0">
                            <X className="w-5 h-5" strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Holding You Back</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Dream Physique Limiters</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          {(Array.isArray(analysis.weaknesses) && analysis.weaknesses.length > 0 ? analysis.weaknesses : ["Lack of upper chest development", "Higher body fat hiding definition", "Narrow shoulder width", "Weak arm size relative to torso"]).map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E71B25] mt-1.5 shrink-0"></div>
                              <span className="text-[13px] md:text-[14px] font-medium text-gray-400 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#111] border border-[#E71B25]/30 rounded-xl p-4 md:p-6 shadow-lg">
                          <div className="flex flex-row items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#E71B25] flex items-center justify-center shrink-0">
                              <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div>
                              <div className="text-[10px] text-[#E71B25] uppercase tracking-[0.2em] font-bold mb-1">Impact Analysis</div>
                              <div className="text-[12px] md:text-[16px] font-medium text-white leading-snug capitalize">
                                Your <strong className="font-black underline decoration-2 underline-offset-4 decoration-[#E71B25]">{dynamicLimiterName}</strong> is limiting your aesthetic potential by <span className="font-black text-lg md:text-xl text-[#E71B25]">{limitingPercentage}%</span>
                              </div>
                              <div className="text-[12px] md:text-[13px] text-gray-400 font-medium leading-relaxed mt-1">
                                Prioritize incline pressing & fly variations for maximum ROI to balance your physique.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-2xl px-4 mb-12">
                      <div className="bg-[#0a0a0a] border border-[#22c55e]/20 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#22c55e]/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] shrink-0">
                            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Good News</h3>
                        </div>
                        <p className="text-[14px] md:text-[16px] font-medium text-gray-300 leading-relaxed relative z-10">
                          By following your <span className="text-[#22c55e] font-black uppercase tracking-wider">bodymax hyper-personalized plan</span>, you'll crush every obstacle in your way, & achieve your dream physique faster than you ever thought possible.
                        </p>
                      </div>
                    </div>

                    <div className="w-full px-4 mt-auto max-w-2xl pb-4">
                      <button onClick={handleShare} disabled={isSharing} className={`w-full py-5 bg-[#E71B25] hover:bg-[#C6161F] text-white font-black text-[14px] md:text-[16px] uppercase tracking-[0.15em] rounded-2xl shadow-xl transition-colors ${isSharing ? 'opacity-70 cursor-wait' : ''}`}>
                        <span className="flex items-center justify-center gap-2">
                          {isSharing ? 'Extracting Neural Data...' : 'Share Comparison Report'}
                          {!isSharing && <span>→</span>}
                        </span>
                      </button>
                    </div>

                  </motion.div>
                );
              })()}

              {/* TAB 3: WORKOUTS */}
              {activeTab === 'protocol' && (
                <motion.div key="protocol" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-5">

                  <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <BicepsFlexed className="w-3.5 h-3.5 text-[#E71B25]" />
                        <h2 className="text-[11px] md:text-[13px] font-black text-white uppercase tracking-wide">Tactical Training Modules</h2>
                      </div>
                      <p className="text-[9px] md:text-[10px] text-gray-500 font-medium">Surgical-grade routine aligned with {userGoal}.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.03]">
                      <div className="text-center">
                        <span className="block text-[7px] text-gray-500 uppercase font-bold tracking-widest">Wk {currentWeek}/{maxWeeks}</span>
                        <span className="text-[10px] font-black text-green-500">{doneThisWeek} <span className="text-gray-600 text-[8px]">/ {workoutsPerWeek}</span></span>
                      </div>
                      <div className="w-px h-5 bg-white/[0.1]"></div>
                      <div className="text-center">
                        <span className="block text-[7px] text-gray-500 uppercase font-bold tracking-widest">Total Executed</span>
                        <span className="text-[10px] font-black text-[#E71B25]">{completedWorkouts} <span className="text-gray-600 text-[8px]">/ {programTotalWorkouts}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-3">
                    {Array.from({ length: maxWeeks > 0 ? maxWeeks : 4 }).map((_, weekIdx) => {
                      const weekNum = weekIdx + 1;
                      const isExpanded = expandedWeek === weekNum;
                      const isWeekLocked = weekNum > currentWeek;
                      const isWeekCompleted = weekNum < currentWeek;
                      const isWeekActive = weekNum === currentWeek;

                      const weekRoadmap = roadmap[weekIdx] || roadmap[roadmap.length - 1];
                      const phaseTitle = weekRoadmap?.phase?.includes(':') ? weekRoadmap.phase.split(':')[1].trim() : "Execution Phase";

                      return (
                        <div key={weekNum} className={`flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${isWeekActive ? 'border-[#E71B25]/30 bg-[#0a0a0a] shadow-[0_5px_20px_rgba(231,27,37,0.05)]' : 'border-white/[0.04] bg-[#050505]'}`}>

                          <button
                            onClick={() => !isWeekLocked && setExpandedWeek(isExpanded ? null : weekNum)}
                            className={`w-full p-4 md:p-5 flex items-center justify-between text-left transition-colors ${isWeekLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:bg-white/[0.02]'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${isWeekCompleted ? 'bg-green-500/10 border-green-500/20 text-green-500' : isWeekActive ? 'bg-[#E71B25]/10 border-[#E71B25]/30 text-[#E71B25]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                {isWeekCompleted ? <CheckCircle className="w-5 h-5" /> : isWeekLocked ? <Lock className="w-4 h-4" /> : <Zap className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className={`text-[14px] md:text-[16px] font-black uppercase tracking-widest leading-none ${isWeekLocked ? 'text-gray-500' : 'text-white'}`}>Week {weekNum < 10 ? `0${weekNum}` : weekNum}</h3>
                                  {isWeekActive && <span className="text-[8px] bg-[#E71B25] text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Active</span>}
                                </div>
                                <p className="text-[10px] md:text-[11px] text-gray-400 font-medium truncate">{phaseTitle}</p>
                              </div>
                            </div>
                            {!isWeekLocked && (
                              <ChevronRight className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            )}
                          </button>

                          <AnimatePresence>
                            {isExpanded && !isWeekLocked && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/[0.04]"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-b from-transparent to-[#030303]/50">
                                  {workoutsList.map((workout, dayIdx) => {
                                    const absoluteIndex = weekIdx * workoutsPerWeek + dayIdx;
                                    const estTime = (workout.exercises?.length || 0) * 8 + 5;
                                    const isCardCompleted = absoluteIndex < completedWorkouts;
                                    const isCardLocked = absoluteIndex > completedWorkouts;
                                    const isCardActive = absoluteIndex === completedWorkouts;

                                    return (
                                      <motion.div
                                        whileHover={!isCardLocked ? { y: -2, scale: 1.01 } : {}}
                                        key={dayIdx}
                                        className={`group relative overflow-hidden transition-all duration-300 flex flex-col rounded-2xl border
                                              ${isCardLocked ? 'bg-[#050505] border-white/[0.02] grayscale opacity-50 cursor-not-allowed' : ''}
                                              ${isCardCompleted ? 'bg-[#0a0a0a] border-green-500/20 hover:border-green-500/30' : ''}
                                              ${isCardActive ? 'bg-gradient-to-br from-[#111] to-[#050505] border-[#E71B25]/30 shadow-[0_5px_20px_rgba(231,27,37,0.1)] ring-1 ring-[#E71B25]/10' : ''}
                                            `}
                                      >
                                        {isCardActive && <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#E71B25] to-[#E71B25]/20 shadow-[0_0_10px_#E71B25]" />}
                                        {isCardCompleted && <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />}

                                        <div className="p-4 flex flex-col h-full z-10 pl-5">
                                          <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-col">
                                              <span className={`text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-[0.2em] mb-1
                                                        ${isCardActive ? 'text-[#E71B25]' : isCardCompleted ? 'text-green-500' : 'text-gray-500'}
                                                      `}>
                                                Day 0{dayIdx + 1} {isCardCompleted && '✓'}
                                              </span>
                                              <h3 className={`text-[13px] md:text-[15px] font-black uppercase tracking-tight leading-none
                                                        ${isCardLocked ? 'text-gray-600' : 'text-white'}
                                                      `}>{workout.title}</h3>
                                            </div>

                                            {!isCardLocked && (
                                              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md border border-white/[0.05] shrink-0">
                                                <div className={`w-1 h-1 rounded-full ${workout.intensity === 'Low' ? 'bg-blue-500' : workout.intensity === 'High' ? 'bg-orange-500' : 'bg-[#E71B25]'}`}></div>
                                                <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">{workout.intensity}</span>
                                              </div>
                                            )}
                                          </div>

                                          <div className="mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                              {workout.targets?.map((t, i) => (
                                                <span key={i} className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border
                                                          ${isCardLocked ? 'border-white/[0.02] text-gray-600 bg-transparent' :
                                                    isCardActive ? 'border-[#E71B25]/30 text-[#E71B25] bg-[#E71B25]/5' :
                                                      'border-white/[0.05] text-gray-400 bg-white/[0.02]'}
                                                        `}>{t}</span>
                                              ))}
                                            </div>
                                          </div>

                                          <div className="w-full h-px bg-white/[0.05] my-auto"></div>

                                          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                                            <div className="flex gap-3">
                                              <div className="flex flex-col">
                                                <div className={`flex items-center gap-1 text-[9px] font-mono font-bold ${isCardLocked ? 'text-gray-600' : 'text-white'}`}>
                                                  <Clock className="w-2.5 h-2.5 text-gray-500" /> {estTime} MIN
                                                </div>
                                              </div>
                                              <div className="w-px h-4 bg-white/[0.05]"></div>
                                              <div className="flex flex-col">
                                                <div className={`flex items-center gap-1 text-[9px] font-mono font-bold ${isCardLocked ? 'text-gray-600' : 'text-white'}`}>
                                                  <Activity className="w-2.5 h-2.5 text-gray-500" /> {workout.exercises?.length || 0} EXS
                                                </div>
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => {
                                                if (!isCardLocked) {
                                                  // 🔴 MAGIC HERE: If Replaying, mark all exercises as Done already. If new, array is empty.
                                                  const initialCompleted = isCardCompleted ? workout.exercises.map((_, idx) => idx) : [];
                                                  setSelectedWorkout({ ...workout, completedExercises: initialCompleted });
                                                }
                                              }}
                                              disabled={isCardLocked}
                                              className={`relative overflow-hidden group/btn px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all w-full sm:w-auto
                                                     ${isCardLocked ? 'bg-white/5 text-gray-600 cursor-not-allowed' :
                                                  isCardCompleted ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20' :
                                                    'bg-[#E71B25] text-white hover:bg-[#C6161F] hover:shadow-[0_0_15px_rgba(231,27,37,0.3)]'}
                                                   `}
                                            >
                                              <div className="flex items-center justify-center gap-1.5 relative z-10">
                                                {isCardLocked ? (
                                                  <>LOCKED <Lock className="w-2 h-2" /></>
                                                ) : isCardCompleted ? (
                                                  <>REPLAY <PlayCircle className="w-2.5 h-2.5" /></>
                                                ) : (
                                                  <>INITIATE <PlayCircle className="w-2.5 h-2.5" fill="currentColor" /></>
                                                )}
                                              </div>
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
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ... KEEP YOUR TAB 4, TAB 5 AND CHAT COACH CODE HERE UNCHANGED ... */}
              {/* TAB 4: TELEMETRY (ANALYTICS & XP) */}
              {activeTab === 'analytics' && (() => {
                return (
                  <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">

                    {/* TOP ROW: Current Standing & Total Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#E71B25]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#E71B25]/10 transition-colors duration-700"></div>
                        <div className="relative z-10 flex items-center gap-5">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-[#E71B25] flex items-center justify-center bg-black shadow-[0_0_20px_rgba(231,27,37,0.2)] shrink-0">
                            <span className="text-2xl md:text-3xl font-black text-white">{currentLevel}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className="text-[8px] md:text-[9px] font-mono text-[#E71B25] font-bold tracking-[0.2em] uppercase">Current Standing</span>
                                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-none mt-0.5">{rankName}</h2>
                              </div>
                              <CurrentRankIcon className={`w-6 h-6 ${currentBadge.color} opacity-90`} />
                            </div>

                            <div className="mt-3 md:mt-4">
                              <div className="flex justify-between items-end mb-1.5">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">XP to Lvl {currentLevel + 1}</span>
                                <span className="text-[10px] font-mono font-bold text-white">{xpInCurrentLevel} <span className="text-gray-600">/ {xpNeeded}</span></span>
                              </div>
                              <div className="w-full bg-white/[0.03] rounded-full h-1.5 overflow-hidden border border-white/5">
                                <motion.div
                                  initial={{ width: 0 }} animate={{ width: `${(xpInCurrentLevel / xpNeeded) * 100}%` }} transition={{ duration: 1.5 }}
                                  className="bg-gradient-to-r from-orange-500 to-[#E71B25] h-full shadow-[0_0_10px_#E71B25]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* BOTTOM ROW: RANK BADGES (LOCKED & UNLOCKED) */}
                      <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-4 md:p-5 flex flex-col h-[200px] md:h-[240px]">
                        <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-yellow-500" />
                            <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">Physique Evolution</h3>
                          </div>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded">
                            {currentLevel >= 15 ? 6 : currentLevel >= 10 ? 5 : currentLevel >= 7 ? 4 : currentLevel >= 4 ? 3 : currentLevel >= 2 ? 2 : 1} / 6
                          </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {rankBadges.map((badge, i) => {
                            const isUnlocked = currentLevel >= badge.level;

                            return (
                              <div
                                key={i}
                                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all duration-300 ${isUnlocked
                                  ? 'bg-[#111] border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                                  : 'bg-[#050505] border-white/[0.02] opacity-50 grayscale'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isUnlocked ? `${badge.bg} border-white/5 shadow-inner` : 'bg-white/5 border-transparent'
                                    }`}>
                                    <badge.icon className={`w-3.5 h-3.5 ${isUnlocked ? badge.color : 'text-gray-600'}`} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-none mb-0.5 ${isUnlocked ? 'text-white/90' : 'text-gray-500'
                                      }`}>
                                      {badge.name}
                                    </span>
                                    <span className={`text-[7px] font-bold uppercase tracking-widest ${isUnlocked ? 'text-green-500' : 'text-gray-600'
                                      }`}>
                                      {isUnlocked ? 'Form Unlocked' : `Unlocks at LVL ${badge.level}`}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 pl-2">
                                  {isUnlocked ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2.5} />
                                  ) : (
                                    <Lock className="w-3 h-3 text-gray-600" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>


                      <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 flex flex-col justify-center gap-3">
                        <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <Dumbbell className="w-3.5 h-3.5 text-green-400" />
                          </div>
                          <div>
                            <span className="block text-[16px] font-black text-white leading-none">{completedWorkouts}</span>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Total Workouts</span>
                          </div>
                        </div>

                        <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                          </div>
                          <div>
                            <span className="block text-[16px] font-black text-white leading-none">{currentXP}</span>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Total XP Earned</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE ROW: Trajectory & Target Alignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-2.5">
                          <div className="flex items-center gap-1.5">
                            <BarChart className="w-3.5 h-3.5 text-blue-400" />
                            <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">Execution Trajectory</h3>
                          </div>
                          <span className="text-[8px] text-gray-600 font-mono tracking-widest bg-white/[0.03] px-2 py-0.5 rounded-sm">W1-{maxWeeks > 0 ? maxWeeks : 4}</span>
                        </div>

                        <div className="flex items-end justify-between gap-1.5 h-32 md:h-40 mt-auto overflow-x-auto pb-1 scrollbar-hide px-1">
                          {weeklyChartData.map((data, i) => {
                            const heightPct = data.max > 0 ? (data.done / data.max) * 100 : 0;
                            const isCurrent = data.week === currentWeek;
                            const isFullyComplete = heightPct === 100;

                            return (
                              <div key={i} className="flex flex-col items-center flex-1 min-w-[20px] max-w-[32px] group h-full justify-end relative cursor-default">
                                <span className="absolute -top-5 text-[8px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111] px-1.5 py-0.5 rounded border border-white/10 z-10 whitespace-nowrap">
                                  {data.done}/{data.max}
                                </span>
                                <div className="w-full max-w-[16px] bg-white/[0.02] rounded-full h-full relative flex items-end justify-center border border-white/[0.02] group-hover:bg-white/[0.05] transition-colors overflow-hidden">
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPct}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className={`w-full rounded-full transition-colors duration-300
                                      ${isCurrent ? 'bg-gradient-to-t from-[#E71B25]/80 to-[#E71B25] shadow-[0_0_10px_rgba(231,27,37,0.8)]' :
                                        isFullyComplete ? 'bg-gradient-to-t from-green-500/40 to-green-500/80' :
                                          'bg-gradient-to-t from-gray-700/50 to-gray-600'}
                                    `}
                                  />
                                </div>
                                <span className={`text-[7px] md:text-[8px] mt-1.5 font-bold uppercase tracking-wider transition-colors ${isCurrent ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                  W{data.week}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/[0.05] pb-2.5">
                          <Focus className="w-3.5 h-3.5 text-orange-400" />
                          <h3 className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">Target Alignment</h3>
                        </div>
                        <ProgressBar label="Chest & Shoulders" value={analysis.chest_score || analysis.vectors?.upper_body || 76} color="bg-blue-500" />
                        <ProgressBar label="Lower Body Dev." value={analysis.legs_score || analysis.vectors?.lower_body || 75} color="bg-orange-500" />
                        <ProgressBar label="Core & Posture" value={analysis.abs_score || analysis.vectors?.core || 81} color="bg-yellow-500" />
                        <ProgressBar label="Back & Symmetry" value={analysis.back_score || analysis.vectors?.symmetry || 78} color="bg-[#E71B25]" />
                      </div>
                    </div>

                  </motion.div>
                );
              })()}

              {/* TAB 5: NUTRITION */}
              {activeTab === 'nutrition' && (
                <motion.div key="nutrition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:gap-5">
                  <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Apple className="w-4 h-4 text-green-500" />
                        <h2 className="text-[12px] md:text-[14px] font-bold text-white uppercase tracking-widest">Metabolic Engine</h2>
                      </div>
                      <span className="text-[9px] md:text-[10px] font-mono text-[#E71B25] font-bold bg-[#E71B25]/10 px-2 py-0.5 rounded border border-[#E71B25]/20">{macros.calories} Kcal</span>
                    </div>

                    <p className="text-[10px] md:text-[11px] text-gray-400 leading-relaxed font-medium mb-6">
                      <span className="text-white font-bold block mb-0.5">To achieve the {userGoal}:</span>
                      {nutrition.strategy}
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10">
                      <MacroRing label="Protein" value={macros.protein} max={300} color="text-blue-400" hex="#60A5FA" />
                      <MacroRing label="Carbs" value={macros.carbs} max={400} color="text-yellow-500" hex="#EAB308" />
                      <MacroRing label="Fats" value={macros.fats} max={150} color="text-green-500" hex="#22C55E" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {nutrition.meals?.map((meal, idx) => (
                      <div key={idx} className="bg-[#0a0a0a] border border-white/[0.03] rounded-3xl p-5 hover:bg-white/[0.01] transition-colors relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5">
                            {idx === 0 ? <Coffee className="w-3.5 h-3.5 text-gray-500" /> : idx === nutrition.meals.length - 1 ? <Moon className="w-3.5 h-3.5 text-gray-500" /> : <Utensils className="w-3.5 h-3.5 text-gray-500" />}
                            <h3 className="text-[11px] md:text-[12px] font-bold text-gray-200">{meal.name}</h3>
                          </div>
                          <span className="text-[9px] font-mono text-white font-bold bg-white/[0.05] px-1.5 py-0.5 rounded">{meal.cals} kcal</span>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed font-medium mb-3 min-h-[30px] whitespace-pre-line">{meal.food}</p>

                        <div className="flex gap-1.5 pt-3 border-t border-white/[0.02]">
                          <span className="text-[8px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">P: {meal.p}g</span>
                          <span className="text-[8px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">C: {meal.c}g</span>
                          <span className="text-[8px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">F: {meal.f}g</span>
                        </div>
                      </div>
                    ))}
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

        {/* EXECUTION HUD MODAL */}
        <AnimatePresence>
          {selectedWorkout && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeWorkoutModal} className="fixed inset-0 bg-black/90 backdrop-blur-md z-50" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-[2%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[96%] md:w-[90%] max-w-4xl h-[94vh] md:max-h-[85vh] bg-[#050505] border border-white/[0.1] rounded-3xl z-50 flex flex-col shadow-[0_0_50px_rgba(231,27,37,0.15)] overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/[0.05] bg-gradient-to-r from-[#0a0a0a] to-[#111] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E71B25]/10 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="flex items-center gap-1 text-[7px] md:text-[8px] font-mono font-bold text-[#E71B25] uppercase tracking-widest bg-[#E71B25]/10 px-2 py-0.5 rounded border border-[#E71B25]/20">
                          <span className="w-1 h-1 rounded-full bg-[#E71B25] animate-pulse"></span> ACTIVE SESSION
                        </span>
                      </div>
                      <h2 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase">{selectedWorkout.title}</h2>
                    </div>
                    <button onClick={closeWorkoutModal} className="p-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors border border-white/5 group">
                      <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat relative">
                  <div className="absolute inset-0 bg-[#050505]/95 z-0"></div>

                  <div className="p-4 md:p-6 relative z-10">
                    {selectedWorkout.exercises ? (
                      <div className="relative">
                        <div className="absolute left-[15px] md:left-[19px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-[#E71B25] via-[#E71B25]/50 to-transparent z-0 shadow-[0_0_10px_#E71B25]"></div>

                        <div className="space-y-4 md:space-y-5 relative z-10">
                          {selectedWorkout.exercises.map((ex, i) => {
                            // Check if current exercise is completed
                            const isExerciseDone = selectedWorkout.completedExercises?.includes(i);

                            return (
                              <div key={i} className="flex gap-3 md:gap-5 group">

                                {/* Left: Number Ring */}
                                <div className="flex flex-col items-center shrink-0 mt-1">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-[2px] flex items-center justify-center text-[10px] md:text-[12px] font-black z-10 transition-all duration-300
                                    ${isExerciseDone ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-110' : 'bg-[#0a0a0a] border-[#E71B25] text-white shadow-[0_0_15px_rgba(231,27,37,0.3)]'}
                                  `}>
                                    {isExerciseDone ? <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} /> : `0${i + 1}`}
                                  </div>
                                </div>

                                {/* Right: Exercise Data Block */}
                                <div className={`border rounded-2xl p-4 w-full transition-all duration-300 shadow-sm flex flex-col relative overflow-hidden
                                  ${isExerciseDone ? 'bg-[#111]/50 border-[#22c55e]/20 opacity-90 grayscale-[10%]' : 'bg-[#0a0a0a] border-white/[0.05] hover:bg-[#111]'}
                                `}>
                                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white/[0.02] to-transparent"></div>

                                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <h4 className={`text-[13px] md:text-[14px] font-black tracking-wide uppercase transition-colors
                                          ${isExerciseDone ? 'text-[#22c55e]' : 'text-white'}
                                        `}>
                                          {ex.name}
                                        </h4>
                                      </div>

                                      <div className={`flex items-start gap-1.5 p-2 rounded-lg border transition-colors ${isExerciseDone ? 'bg-transparent border-white/[0.05]' : 'bg-[#E71B25]/5 border-[#E71B25]/10'}`}>
                                        <Crosshair className={`w-3 h-3 shrink-0 mt-0.5 ${isExerciseDone ? 'text-gray-500' : 'text-[#E71B25]'}`} />
                                        <p className={`text-[9px] md:text-[10px] font-medium leading-relaxed ${isExerciseDone ? 'text-gray-500' : 'text-gray-400'}`}>{ex.notes}</p>
                                      </div>
                                    </div>

                                    {/* Tactical Stats Blocks */}
                                    <div className="flex items-center gap-1.5 md:flex-col md:w-28 shrink-0">
                                      <div className={`border px-2.5 py-2 rounded-lg w-full flex items-center justify-between transition-colors ${isExerciseDone ? 'bg-transparent border-white/[0.05]' : 'bg-black border-white/[0.05]'}`}>
                                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest">Sets</span>
                                        <span className={`text-[11px] md:text-[12px] font-mono font-black ${isExerciseDone ? 'text-gray-500' : 'text-white'}`}>{ex.sets}</span>
                                      </div>
                                      <div className={`border px-2.5 py-2 rounded-lg w-full flex items-center justify-between transition-colors ${isExerciseDone ? 'bg-transparent border-white/[0.05]' : 'bg-black border-white/[0.05]'}`}>
                                        <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest">Reps</span>
                                        <span className={`text-[11px] md:text-[12px] font-mono font-black ${isExerciseDone ? 'text-gray-500' : 'text-white'}`}>{ex.reps}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Interactive Timer Footer */}
                                  <div className="mt-4 pt-3 border-t border-white/[0.05]">
                                    {activeTimerEx === i ? (
                                      <div className="bg-black/40 rounded-xl p-3 border border-[#E71B25]/30 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#E71B25]/5 animate-pulse pointer-events-none"></div>
                                        <div className="flex items-center justify-between mb-2 relative z-10">
                                          <div className="flex flex-col">
                                            <span className="text-[14px] md:text-[16px] font-black text-[#E71B25] tracking-widest font-mono leading-none mb-1">{formatTime(timeLeft)}</span>
                                            <span className="text-[7px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                              {isTimerActive ? <><div className="w-1 h-1 rounded-full bg-[#E71B25] animate-pulse"></div> ACTIVE</> : <><ZapOff className="w-2 h-2" /> PAUSED</>}
                                            </span>
                                          </div>
                                          <div className="flex gap-1.5">
                                            <button onClick={() => toggleTimer(i, ex.rest)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#E71B25] flex items-center justify-center text-white hover:bg-[#C6161F] transition-colors shadow-[0_0_10px_rgba(231,27,37,0.4)]">
                                              {isTimerActive ? <Pause className="w-4 h-4" fill="currentColor" /> : <PlayCircle className="w-4 h-4" fill="currentColor" />}
                                            </button>
                                            <button onClick={() => { setActiveTimerEx(null); setIsTimerActive(false); }} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/[0.05]">
                                              <X className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden relative z-10">
                                          <div className="bg-[#E71B25] h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#E71B25]" style={{ width: `${(timeLeft / timerTotal) * 100}%` }}></div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[9px] md:text-[10px] font-mono font-bold flex items-center gap-1 bg-black px-2 py-1 rounded border border-white/[0.05] ${isExerciseDone ? 'text-gray-600' : 'text-gray-500'}`}>
                                            <Timer className={`w-3 h-3 ${isExerciseDone ? 'text-gray-600' : 'text-[#E71B25]'}`} /> REST: <span className={isExerciseDone ? 'text-gray-600' : 'text-white'}>{ex.rest}</span>
                                          </span>
                                          {isExerciseDone && (
                                            <span className="hidden md:flex text-[9px] font-black text-green-500 uppercase tracking-[0.2em] items-center gap-1">
                                              <CheckCircle className="w-3 h-3" /> EXERCISE DONE
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {isExerciseDone && (
                                            <span className="md:hidden text-[8px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-1">
                                              <CheckCircle className="w-3 h-3" /> DONE
                                            </span>
                                          )}

                                          {/* 🔴 Restart Timer or Start Timer */}
                                          <button onClick={() => toggleTimer(i, ex.rest)} className={`flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border shadow-sm ${isExerciseDone ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500 hover:text-white' : 'bg-[#E71B25]/10 hover:bg-[#E71B25] text-[#E71B25] hover:text-white border-[#E71B25]/30'}`}>
                                            <PlayCircle className="w-3 h-3" /> {isExerciseDone ? 'Restart Timer' : 'Start Timer'}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-20" strokeWidth={1} />
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">No Neural Data Found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: LOG MODULE BUTTON (Locked if not all exercises are done) */}
                <div className="p-4 md:p-5 border-t border-white/[0.05] bg-[#0a0a0a] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Session Progress</span>
                    <span className="text-[11px] md:text-[13px] font-black text-white">
                      {selectedWorkout.completedExercises?.length || 0} / {selectedWorkout.exercises?.length || 0} Exercises Done
                    </span>
                  </div>

                  <button
                    onClick={handleEndSession}
                    disabled={selectedWorkout.completedExercises?.length !== selectedWorkout.exercises?.length}
                    className={`flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all
                      ${selectedWorkout.completedExercises?.length === selectedWorkout.exercises?.length
                        ? 'bg-[#22c55e] hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-400 cursor-pointer'
                        : 'bg-[#111] text-gray-500 border border-white/5 shadow-none cursor-not-allowed'
                      }
                    `}
                  >
                    {selectedWorkout.completedExercises?.length === selectedWorkout.exercises?.length ? (
                      <>LOG COMPLETE MODULE <CheckCircle className="w-4 h-4" strokeWidth={3} /></>
                    ) : (
                      <>COMPLETE ALL EXERCISES <Lock className="w-3 h-3" /></>
                    )}
                  </button>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;