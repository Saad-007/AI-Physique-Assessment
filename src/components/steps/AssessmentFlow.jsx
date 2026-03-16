import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Flame, Dumbbell, Zap, Trophy, 
  Activity, Target, Clock, Image as ImageIcon, Scale, Check, 
  Frown, Meh, Smile, Heart, Lightbulb, CameraOff, XCircle, X, 
  Search, Brain, ShieldAlert, AlertCircle, Camera, Upload, 
  Home, CheckCircle, HelpCircle, CheckSquare, Square, Sparkles, Scan, TrendingUp, ShieldCheck, Star
} from 'lucide-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { MagneticButton } from '../ui/MagneticButton';
import PaywallModal from '../ui/PaywalModal';

// ==========================================
// ADVANCED ANIMATED COUNTER
// ==========================================
const AnimatedCounter = ({ end, suffix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

// ==========================================
// ULTRA-PREMIUM SLIDER
// ==========================================
const CustomSlider = ({ label, min, max, value, onChange, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col w-full mb-8 group relative z-10">
      <span className="text-gray-400 text-sm md:text-[15px] font-semibold mb-2 tracking-wide">{label}</span>
      <div className="text-center mb-5">
        <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] tracking-tighter uppercase leading-none drop-shadow-[0_0_20px_rgba(231,27,37,0.3)]">
          {value} <span className="text-3xl md:text-4xl text-[#E71B25]/80">{unit}</span>
        </span>
      </div>
      <div className="relative w-full flex items-center mb-3">
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none z-10 relative
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
            [&::-webkit-slider-thumb]:bg-[#050505] [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#E71B25] 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_25px_rgba(231,27,37,0.8)]
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
          style={{ background: `linear-gradient(to right, #E71B25 0%, #E71B25 ${percentage}%, rgba(255,255,255,0.05) ${percentage}%, rgba(255,255,255,0.05) 100%)` }}
        />
      </div>
      <div className="flex justify-between w-full text-gray-500 text-[11px] font-bold tracking-[0.1em] uppercase">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
};

// ==========================================
// SEPARATE COMPONENT: REVIEW STEP
// ==========================================
const ReviewStep = ({ review, onNext }) => {
  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto relative z-10 text-left">
      <div className="fixed bottom-0 left-0 right-0 h-[45vh] bg-gradient-to-t from-[#E71B25]/20 via-[#E71B25]/5 to-transparent pointer-events-none z-[-1]" />

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex gap-1 mb-4 pt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-[#F5B02B] fill-[#F5B02B] drop-shadow-sm" />
        ))}
      </motion.div>
      
      <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[26px] md:text-3xl font-bold text-white mb-5 leading-[1.25] tracking-tight">
        {review.title}
      </motion.h2>
      
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-300 text-[15px] md:text-base font-medium leading-relaxed mb-4">
        {review.text}
      </motion.p>
      
      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white font-semibold text-sm mb-8">
        {review.author}
      </motion.p>
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="relative w-full aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl mb-10 border border-white/10">
        <img src={review.image} alt="Transformation progress" className="w-full h-full object-cover" />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-white/10 whitespace-nowrap">
          <span className="text-white font-bold text-sm tracking-wide">{review.progress}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full flex justify-center mt-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-2xl font-bold text-[17px] shadow-[0_10px_30px_rgba(231,27,37,0.2)] transition-colors"
        >
          Sounds good
        </motion.button>
      </motion.div>
    </div>
  );
};

// ==========================================
// THE DATA ENGINE
// ==========================================
const assessmentData = [
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW OLD ARE YOU?", subtitle: "Select your age range for a more accurate analysis", type: "single", id: "age", options: [{ label: "Under 18", icon: User }, { label: "18 – 22", icon: Flame }, { label: "23 – 27", icon: Dumbbell }, { label: "28 – 35", icon: Zap }, { label: "36+", icon: Trophy }] },
  { phase: "PHASE 1 — GETTING STARTED", title: "WHAT'S YOUR HEIGHT & WEIGHT?", subtitle: "Used to calculate your ideal physique targets", type: "sliders", id: "metrics" },
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW LONG HAVE YOU BEEN TRAINING?", subtitle: "Be honest — the AI needs this for accurate baselines.", type: "single", id: "experience", options: [{ label: "Just starting out", icon: Target }, { label: "Less than 1 year", icon: Clock }, { label: "1–3 years", icon: Activity }, { label: "3–5 years", icon: Flame }, { label: "5+ years (serious lifter)", icon: Trophy }] },
  
  { 
    phase: "PHASE 2 — IDENTITY", 
    title: "WHICH BEST DESCRIBES YOUR BODY RIGHT NOW?", 
    subtitle: "Be honest — the AI needs this to give you accurate results", 
    type: "single", 
    layout: "grid-image", 
    id: "currentBody", 
    options: [
      { label: "Muscular & built", img: "/Muscular.png" }, 
      { label: "Skinny — need size", img: "/skinny.png" }, 
      { label: "Average — not great", img: "/Average.png" }, 
      { label: "Overweight — need to cut", img: "/Overweight.png" }, 
    ] 
  },
  
  // --- REVIEW 1 ---
  { type: "review", review: { title: `"I didn't realize how much better my body could actually look..."`, text: "I had been going to the gym for a while but my physique still looked the same & pretty average. When I scanned my body, it showed me that my body fat was hiding my muscle definition and that my shoulders and chest needed more focus. Once I followed the personalized plan BODY MAX AI gave me, the difference started showing way faster than I expected.", author: "– Daniel, 27 • Los Angeles", progress: "10 weeks progress", image: "/review1.jpg" } },

  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHEN YOU LOOK IN THE MIRROR SHIRTLESS, HOW DO YOU FEEL?", subtitle: "This reveals your current confidence gap", type: "single", layout: "grid-5", id: "selfPerception1", options: [{ label: "Disappointed", icon: Frown }, { label: "Not happy", icon: Frown }, { label: "Okay-ish", icon: Meh }, { label: "Pretty good", icon: Smile }, { label: "Love it", icon: Heart }], infoBox: { icon: Lightbulb, title: "Did you know?", text: "87% of guys who've been training for 1+ year still feel dissatisfied. The problem isn't effort — it's direction." } },
  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHAT'S THE FIRST THING THAT BOTHERS YOU?", type: "single", id: "selfPerception2", options: [{ label: "My arms look too small", icon: Dumbbell }, { label: "My belly fat / love handles", icon: Activity }, { label: "My shoulders aren't wide enough", icon: Target }, { label: "Lack of muscle definition", icon: Search }, { label: "My back looks flat", icon: User }, { label: "My legs are too skinny", icon: Flame }] },
  { type: "interstitial", icon: Frown, title: "We Get It.", subtitle: "You're putting in the work. You train. But the mirror doesn't show what you expected. That's not your fault — it's because nobody showed you exactly what to fix.\n\nThe next questions will expose your real weak points.", buttonText: "Show Me My Weak Points →" },
  { phase: "PHASE 3 — PAIN POINTS", title: "WHICH OF THESE HIT CLOSE TO HOME?", subtitle: "Choose all that apply — be brutally honest", type: "multiple", id: "painPoints", options: [{ label: "Training for months but look the same", icon: Activity }, { label: "Other guys build muscle faster", icon: Users }, { label: "I look small in clothes", icon: User }, { label: "Don't look impressive shirtless", icon: ShieldAlert }, { label: "Avoid taking photos", icon: CameraOff }, { label: "Nothing sticks", icon: XCircle }] },
  
  // --- REVIEW 2 ---
  { type: "review", review: { title: `"2 years of guessing. 11 weeks of actually knowing."`, text: "Winging it at the gym for 2 years with nothing to show for it. BodyMax scanned my body, showed me exactly what was holding me back — in 5 minutes. 11 weeks later: visible abs, broader shoulders, real definition for the first time. I finally have a plan I actually trust. My dream physique doesn't feel impossible anymore. It feels close.", author: "– Ryan, 24 • London", progress: "11 weeks progress", image: "/review2.jpg" } },

  { phase: "PHASE 3 — PAIN POINTS", title: "SEEING AN ELITE PHYSIQUE, WHAT DO YOU FEEL?", subtitle: "This reveals your motivation type", type: "single", id: "motivationTrigger", options: [{ label: "Jealous — I want that", icon: Flame }, { label: "Defeated — feel like I'll never get there", icon: Frown }, { label: "Inspired to work harder", icon: Target }, { label: "Nothing — not focused on comparisons", icon: Meh }] },
  { phase: "PHASE 3 — PAIN POINTS", title: "EVER AVOIDED A SITUATION BECAUSE OF YOUR BODY?", subtitle: "e.g. beach, pool, taking your shirt off", type: "single", id: "avoidance", options: [{ label: "Yes, often — I feel self-conscious", icon: Frown }, { label: "Sometimes — it crosses my mind", icon: Meh }, { label: "Rarely — I'm fairly comfortable", icon: Smile }, { label: "Never — I'm confident", icon: Heart }] },
  
  { 
    type: "comparison", 
    title: "The Hard Truth", 
    subtitle: "Most guys train for years without identifying their single biggest weak point. That one weak point is the difference between an average physique and an elite one.", 
    buttonText: "Find My Weak Point →",
    imgAverage: "/Average.png", 
    imgElite: "/Muscular.png"   
  },
  
  { 
    phase: "PHASE 4 — YOUR DREAM", 
    title: "WHICH PHYSIQUE DO YOU WANT THE MOST?", 
    subtitle: "Choose the body type that makes you think \"I want that\"", 
    type: "single", 
    layout: "grid-image", 
    id: "dreamPhysique", 
    options: [
      { label: "Aesthetic V-Taper", img: "/V-shape.jpg" }, 
      { label: "Lean & Shredded", img: "/Lean.jpg" }, 
      { label: "Classic Bodybuilder", img: "/Classic.jpg" }, 
      { label: "Athletic Build", img: "/Atheletic.jpg" },
      { label: "Calisthenics", img: "/Calisthenics.jpg" }, 
      { label: "Big & Massive", img: "/Big-massive.jpg" }
    ] 
  },
  
  // --- REVIEW 3 ---
  { type: "review", review: { title: `"I was lean. I just didn't know what to build."`, text: "I thought being skinny meant I was close. I wasn't, I just had no idea which muscles were actually lagging. BodyMax told me in minutes. Shoulders, arms, upper chest, all underdeveloped. Followed the plan exactly. 8 weeks later my arms are bigger, my shoulders are wider and people are actually noticing. This is the first time training has felt intentional.", author: "– Jake, 21 • California", progress: "8 weeks progress", image: "/review3.jpg" } },

  { phase: "PHASE 4 — PERSONALISATION", title: "WHAT'S YOUR #1 PHYSIQUE STRUGGLE?", subtitle: "The AI will prioritise fixing this first", type: "single", id: "mainStruggle", options: [{ label: "Losing body fat / getting lean", icon: Flame }, { label: "Building more muscle mass", icon: Dumbbell }, { label: "Improving symmetry & proportions", icon: Scale }, { label: "Building wider shoulders / V-taper", icon: Target }, { label: "Breaking through a plateau", icon: Activity }] },
  { phase: "PHASE 5 — PERSONALISATION", title: "TRAINING SCHEDULE & LOCATION?", subtitle: "Your plan will be built around your schedule", type: "mixed-training", id: "trainingSetup" },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW WOULD YOU DESCRIBE YOUR CURRENT DIET?", type: "single", id: "diet", options: [{ label: "I eat well, track macros", icon: CheckCircle }, { label: "Random — I eat whatever", icon: Activity }, { label: "Healthy but not optimised for muscle", icon: HelpCircle }, { label: "Mostly junk food / takeaways", icon: AlertCircle }, { label: "I have no idea what I'm doing", icon: XCircle }] },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW'S YOUR SLEEP & STRESS?", subtitle: "Average sleep per night", type: "single", id: "sleep", options: [{ label: "Less than 5 hours", icon: AlertCircle }, { label: "5–6 hours", icon: Clock }, { label: "7–8 hours", icon: CheckCircle }, { label: "8+ hours", icon: Heart }] },
  
  // --- REVIEW 4 ---
  { type: "review", review: { title: `"I didn't think this was possible for my body type."`, text: "I'd written myself off. Overweight, no idea where to start, tried everything and stayed the same. BodyMax scanned me and was brutally honest, high body fat, weak shoulders, obese. Finally something told me the truth AND gave me the exact plan to fix it. I went from embarrassed to take my shirt off to looking like a completely different person.", author: "– Marcus, 31 • Melbourne", progress: "6 months progress", image: "/review4.jpg" } },

  { phase: "PHASE 5 — MINDSET", title: "HOW MOTIVATED ARE YOU RIGHT NOW?", subtitle: "The AI calibrates your plan intensity based on this", type: "single", layout: "grid-5", id: "motivationLevel", options: [{ label: "Low", icon: Frown }, { label: "Okay", icon: Meh }, { label: "Good", icon: Dumbbell }, { label: "High", icon: Flame }, { label: "Obsessed", icon: Zap }], infoBox: { icon: Flame, title: "Fact:", text: "The most motivated guys using BodyMax AI see results 3x faster." } },
  { phase: "PHASE 5 — COMMITMENT", title: "ARE YOU WILLING TO COMMIT TO 12 WEEKS?", subtitle: "This determines whether we build an aggressive or moderate plan", type: "single", id: "commitment", options: [{ label: "Absolutely — ready to go all in", icon: Flame }, { label: "Yes — I'll follow the plan consistently", icon: CheckCircle }, { label: "Maybe — depends on what it asks", icon: HelpCircle }, { label: "I'll try but not sure", icon: Activity }] },
  
  // --- EXACT SCREENSHOT REPLICA: BEFORE & AFTER COMPARISON ---
  { 
    type: "before-after-comparison",
    before: {
      title: "Before BodyMax",
      points: [
        "Feel invisible next to other guys",
        "Soft, undefined, underwhelming",
        "Shirt stays on at the beach",
        "No one looks twice",
        "Stuck in the same body for years"
      ],
      image: "/Before.png"
    },
    after: {
      title: "After BodyMax",
      points: [
        "Jacked, defined, impossible to ignore",
        "The guy other men envy",
        "Shirt comes off with confidence",
        "Dream body — actually achieved",
        "Walk into any room and own it"
      ],
      image: "/After.png"
    }
  },

  { type: "social-proof" },
  { type: "scan-interstitial" },
  { type: "upload-3" },
  
  { 
    phase: "AI SCAN", 
    title: "WHAT'S YOUR DREAM PHYSIQUE?", 
    subtitle: "Choose a preset or upload a photo of your goal body", 
    type: "upload-goal", 
    options: [
      { label: "Aesthetic V-Taper", img: "/V-shape.jpg" }, 
      { label: "Lean & Shredded", img: "/Lean.jpg" }, 
      { label: "Athletic Build", img: "/Atheletic.jpg" }, 
      { label: "Classic Bodybuilder", img: "/Classic.jpg" }, 
      { label: "Calisthenics", img: "/Calisthenics.jpg" }, 
      { label: "Big & Massive", img: "/Big-massive.jpg" }
    ] 
  },
  
  // --- NEW: RESULTS PROJECTION (BEFORE PAYWALL) ---
  { type: "results-projection" }
];

const isQuestionStep = (step) => !['interstitial', 'comparison', 'scan-interstitial', 'social-proof', 'upload-3', 'review', 'before-after-comparison', 'results-projection'].includes(step.type);
const TOTAL_QUESTIONS = assessmentData.filter(isQuestionStep).length;

// ==========================================
// THE ENGINE
// ==========================================
const AssessmentFlow = ({ formData, setFormData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showPaywall, setShowPaywall] = useState(false); 

  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const goalUploadRef = useRef(null);

  const currentStep = assessmentData[currentIndex];
  const isLastStep = currentIndex === assessmentData.length - 1;

  const currentQuestionNumber = assessmentData
    .slice(0, currentIndex + 1)
    .filter(isQuestionStep).length;

  const handleNext = () => {
    if (isLastStep) { 
      setShowPaywall(true); 
      return; 
    }
    setDirection(1); setCurrentIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setDirection(-1); setCurrentIndex(prev => prev - 1);
  };

  const handleSelect = (optionLabel) => {
    if (currentStep.type === 'multiple') {
      const currentList = formData[currentStep.id] || [];
      const isAlreadySelected = currentList.includes(optionLabel);
      const newList = isAlreadySelected ? currentList.filter(item => item !== optionLabel) : [...currentList, optionLabel];
      setFormData(prev => ({ ...prev, [currentStep.id]: newList }));
    } else {
      setFormData(prev => ({ ...prev, [currentStep.id]: optionLabel }));
      if (currentStep.type === 'single') setTimeout(() => handleNext(), 350);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const currentPhotos = formData.photos || { 1: null, 2: null, 3: null };
      const newPhotos = { ...currentPhotos };
      
      if (!newPhotos[1]) newPhotos[1] = url;
      else if (!newPhotos[2]) newPhotos[2] = url;
      else newPhotos[3] = url; 

      setFormData(prev => ({ ...prev, photos: newPhotos }));
    }
    e.target.value = null;
  };

  const handleGoalPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, customGoalPhoto: url, goal: "Custom Upload" }));
      setTimeout(() => handleNext(), 400);
    }
    e.target.value = null;
  };

  const slideVariants = {
    enter: (dir) => ({ 
      x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.92, rotateY: dir > 0 ? 15 : -15, filter: "blur(12px)", transformPerspective: 1000
    }),
    center: { 
      x: 0, opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)", transformPerspective: 1000
    },
    exit: (dir) => ({ 
      x: dir < 0 ? -40 : 40, opacity: 0, scale: 0.92, rotateY: dir < 0 ? -15 : 15, filter: "blur(12px)", transformPerspective: 1000
    }) 
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-sans relative overflow-hidden bg-[#020202]">
      
      {/* 🚀 ADVANCED AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-[#E71B25] rounded-full blur-[150px] mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[20%] w-[80vw] h-[80vw] bg-[#C6161F] rounded-full blur-[150px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* TIGHT, HIGH-END HEADER */}
      <div className="w-full max-w-xl mx-auto px-4 pt-8 pb-4 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <motion.button 
            whileTap={{ x: -2 }} onClick={handleBack} 
            className={`p-2 -ml-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <IoIosArrowRoundBack className="w-6 h-6 text-gray-300 hover:text-white" strokeWidth={1.5} />
          </motion.button>
          
          <div className="flex-1 mx-6 h-1.5 bg-[#111] rounded-full overflow-hidden border border-white/[0.05] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#C6161F] via-[#E71B25] to-[#ff4747] relative rounded-full" 
              animate={{ width: `${(currentQuestionNumber / TOTAL_QUESTIONS) * 100}%` }} 
              transition={{ duration: 0.6, ease: "circOut" }} 
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white,0_0_20px_#E71B25]"></div>
            </motion.div>
          </div>
          
          <span className="text-[11px] font-black text-gray-400 tracking-[0.25em] uppercase tabular-nums">
            {currentQuestionNumber} <span className="text-gray-700">/ {TOTAL_QUESTIONS}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 pb-12 flex flex-col justify-center relative z-10 perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full flex flex-col transform-gpu h-full"
          >
            
            {/* --- SEPARATE REVIEW COMPONENT RENDER --- */}
            {currentStep.type === 'review' && (
              <ReviewStep review={currentStep.review} onNext={handleNext} />
            )}

            {/* --- EXACT REPLICA: BEFORE VS AFTER COMPARISON STEP --- */}
            {currentStep.type === 'before-after-comparison' && (
              <div className="flex flex-col items-center w-full mt-2 h-full">
                
                {/* Floating Header Tags with SVG Arrow */}
                <div className="w-full flex justify-between items-end px-6 md:px-10 mb-3 relative z-10">
                   <span className="text-[#E71B25] font-black text-sm md:text-base uppercase tracking-widest">Today</span>
                   
                   {/* Custom Curved SVG Arrow */}
                   <div className="absolute left-1/2 -translate-x-1/2 top-0 mt-1 w-12 md:w-16">
                     <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
                       <path d="M10 30 Q 50 -10 90 30" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
                       <path d="M75 28 L 90 30 L 85 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                     </svg>
                   </div>

                   <span className="text-white font-black text-sm md:text-base uppercase tracking-widest">In 12 Weeks</span>
                </div>

                <div className="flex w-full gap-2 md:gap-4 mb-6 stretch flex-1 min-h-[460px] md:min-h-[520px]">
                  
                  {/* Before Card */}
                  <div className="flex-1 bg-[#242529] rounded-3xl flex flex-col overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/[0.05]">
                    <div className="p-3 md:p-5 flex flex-col z-10 flex-1">
                      <h3 className="text-white font-bold text-[16px] md:text-[18px] mb-3 md:mb-5 tracking-tight">{currentStep.before.title}</h3>
                      <div className="flex flex-col gap-2.5 md:gap-4">
                        {currentStep.before.points.map((point, i) => (
                          <div key={i} className="flex items-start gap-1.5 md:gap-2">
                            <X className="w-4 h-4 md:w-5 md:h-5 text-[#E71B25] shrink-0 mt-0.5" strokeWidth={3} />
                            <span className="text-white text-[11px] md:text-[13px] font-bold leading-snug tracking-wide">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Image fills exact bottom half */}
                    <div className="absolute bottom-0 left-0 right-0 h-[55%]">
                       <div className="absolute inset-0 bg-gradient-to-b from-[#242529] via-[#242529]/60 to-transparent z-10 pointer-events-none" />
                       <img src={currentStep.before.image} className="w-full h-full object-cover object-top" alt="Before" />
                    </div>
                  </div>

                  {/* After Card */}
                  <div className="flex-1 bg-gradient-to-b from-[#139E46] to-[#0A5A26] rounded-3xl flex flex-col overflow-hidden relative shadow-[0_10px_30px_rgba(19,158,70,0.2)]">
                    <div className="p-3 md:p-5 flex flex-col z-10 flex-1">
                      <h3 className="text-white font-bold text-[16px] md:text-[18px] mb-3 md:mb-5 tracking-tight drop-shadow-sm">{currentStep.after.title}</h3>
                      <div className="flex flex-col gap-2.5 md:gap-4">
                        {currentStep.after.points.map((point, i) => (
                          <div key={i} className="flex items-start gap-1.5 md:gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-black shrink-0 mt-0.5" strokeWidth={4} />
                            <span className="text-white text-[11px] md:text-[13px] font-bold leading-snug tracking-wide drop-shadow-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Image fills exact bottom half */}
                    <div className="absolute bottom-0 left-0 right-0 h-[55%]">
                       <div className="absolute inset-0 bg-gradient-to-b from-[#0d8538] via-[#0d8538]/60 to-transparent z-10 pointer-events-none" />
                       <img src={currentStep.after.image} className="w-full h-full object-cover object-top" alt="After" />
                    </div>
                  </div>

                </div>

                {/* Bottom Text */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center px-2 mb-6 md:mb-8">
                  <h2 className="text-[20px] md:text-2xl font-bold text-white leading-tight tracking-tight mb-3">
                    Your Personalized BodyMax<br/>Transformation Plan
                  </h2>
                  <p className="text-gray-400 text-[12px] md:text-[14px] font-medium leading-relaxed max-w-sm mx-auto">
                    Answer a few quick questions so we can analyze your body, identify what's holding you back, and generate a custom plan designed to help you achieve your dream physique faster.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="w-full flex justify-center mt-auto pb-2">
                  <MagneticButton text="Continue" onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- THE NEW RESULTS PROJECTION UI --- */}
            {currentStep.type === 'results-projection' && (
              <div className="flex flex-col items-center w-full mt-2 h-full text-center px-1">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
                  className="text-xl md:text-[22px] font-bold text-white mb-6 tracking-tight"
                >
                  Based on your body scan and<br />answers:
                </motion.h2>

                {/* Unified Green Card matching the image */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="w-full rounded-[1.5rem] overflow-hidden mb-10 shadow-[0_0_40px_rgba(34,197,94,0.15)] flex flex-col"
                >
                   <div className="bg-gradient-to-b from-[#4ade80] to-[#16a34a] p-6 text-center">
                      <p className="text-white text-[18px] md:text-[20px] font-bold leading-tight drop-shadow-sm">
                        you can improve your physique by up to 66% in the next 12 weeks.
                      </p>
                   </div>
                   <div className="bg-[#0f2918] p-5 text-center border-x border-b border-[#16a34a]/30 rounded-b-[1.5rem]">
                      <p className="text-[#a7d0b3] text-[13px] md:text-[14px] font-medium leading-relaxed">
                        There's also a <strong className="text-white font-bold">73%</strong> probability of reaching your dream physique if you consistently follow your personalized BodyMax plan.
                      </p>
                   </div>
                </motion.div>

                {/* Custom Graph Area */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  className="relative w-full aspect-[1.6] max-w-sm mx-auto mb-10 mt-4"
                >
                  {/* SVG Graph */}
                  <svg viewBox="0 0 400 250" className="w-full h-full drop-shadow-[0_0_20px_rgba(74,222,128,0.25)] overflow-visible">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Axes */}
                    <line x1="20" y1="20" x2="20" y2="210" stroke="#333" strokeWidth="1.5" />
                    <line x1="20" y1="210" x2="380" y2="210" stroke="#333" strokeWidth="1.5" />

                    {/* Vertical grid lines mapping to points */}
                    <line x1="80" y1="20" x2="80" y2="210" stroke="#333" strokeWidth="1" />
                    <line x1="170" y1="20" x2="170" y2="210" stroke="#333" strokeWidth="1" />
                    <line x1="260" y1="20" x2="260" y2="210" stroke="#333" strokeWidth="1" />
                    <line x1="350" y1="20" x2="350" y2="210" stroke="#333" strokeWidth="1" />

                    {/* The Smooth Curve */}
                    <path d="M 20 210 C 50 190, 65 180, 80 170 C 120 155, 140 140, 170 125 C 210 105, 230 90, 260 70 C 300 40, 320 25, 350 15" fill="none" stroke="url(#lineGrad)" strokeWidth="6" strokeLinecap="round" />

                    {/* Graph Nodes */}
                    <circle cx="80" cy="170" r="7" fill="#020202" stroke="#4ade80" strokeWidth="4" />
                    <circle cx="170" cy="125" r="7" fill="#020202" stroke="#4ade80" strokeWidth="4" />
                    <circle cx="260" cy="70" r="7" fill="#020202" stroke="#4ade80" strokeWidth="4" />
                    <circle cx="350" cy="15" r="7" fill="#020202" stroke="#4ade80" strokeWidth="4" />

                    {/* X Axis Week Labels */}
                    <text x="80" y="235" fill="#666" fontSize="13" fontWeight="bold" textAnchor="middle">Week 1</text>
                    <text x="170" y="235" fill="#666" fontSize="13" fontWeight="bold" textAnchor="middle">Week 4</text>
                    <text x="260" y="235" fill="#666" fontSize="13" fontWeight="bold" textAnchor="middle">Week 8</text>
                    <text x="350" y="235" fill="#666" fontSize="13" fontWeight="bold" textAnchor="middle">Week 12</text>
                  </svg>

                  {/* HTML Tooltips placed exactly above the nodes */}
                  <div className="absolute top-[68%] left-[20%] -translate-x-1/2 -translate-y-[calc(100%+16px)] z-10">
                    <div className="bg-white text-black font-bold text-[11px] md:text-[12px] px-3.5 py-1.5 md:py-2 rounded-[0.8rem] shadow-lg relative whitespace-nowrap">
                      You will feel it
                      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                  </div>

                  <div className="absolute top-[50%] left-[42.5%] -translate-x-1/2 -translate-y-[calc(100%+16px)] z-10">
                    <div className="bg-white text-black font-bold text-[11px] md:text-[12px] px-3.5 py-1.5 md:py-2 rounded-[0.8rem] shadow-lg relative whitespace-nowrap">
                      You will see it
                      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                  </div>

                  <div className="absolute top-[28%] left-[65%] -translate-x-1/2 -translate-y-[calc(100%+16px)] z-10">
                    <div className="bg-white text-black font-bold text-[11px] md:text-[12px] px-3.5 py-1.5 md:py-2 rounded-[0.8rem] shadow-lg relative whitespace-nowrap">
                      You will start notice it
                      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                  </div>

                  <div className="absolute top-[6%] left-[87.5%] -translate-x-1/2 -translate-y-[calc(100%+16px)] z-10">
                    <div className="bg-white text-black font-bold text-[11px] md:text-[13px] px-4 py-1.5 md:py-2 rounded-[0.8rem] shadow-lg relative whitespace-nowrap">
                      Body Maxxed
                      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="w-full flex justify-center mt-auto pb-2">
                  <MagneticButton text="Continue" onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* COMPACT TYPOGRAPHY */}
            {!['interstitial', 'comparison', 'scan-interstitial', 'social-proof', 'upload-3', 'review', 'before-after-comparison', 'results-projection'].includes(currentStep.type) && (
              <div className="mb-10 text-center md:text-left">
                {currentStep.phase && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/20 mb-4">
                    <div className="w-1.5 h-1.5 bg-[#E71B25] rounded-full animate-pulse shadow-[0_0_8px_#E71B25]" />
                    <span className="text-[9px] font-black tracking-[0.2em] text-[#E71B25] uppercase">{currentStep.phase}</span>
                  </motion.div>
                )}
                {currentStep.title && (
                  <h1 className="text-3xl md:text-[2.75rem] font-black uppercase tracking-tighter leading-[1.1] mb-4 text-white text-balance drop-shadow-md">
                    {currentStep.title}
                  </h1>
                )}
                {currentStep.subtitle && (
                  <p className="text-gray-400 text-sm md:text-base font-medium whitespace-pre-wrap text-balance leading-relaxed">
                    {currentStep.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* --- ADVANCED CYBER-GLASS CARDS (SINGLE / MULTIPLE) --- */}
            {(currentStep.type === 'single' || currentStep.type === 'multiple') && !currentStep.layout && (
              <div className="flex flex-col gap-3.5">
                {currentStep.options.map((option, idx) => {
                  const isSelected = currentStep.type === 'multiple' ? (formData[currentStep.id] || []).includes(option.label) : formData[currentStep.id] === option.label;
                  return (
                    <motion.button 
                      whileHover={{ scale: 1.015, y: -2 }} 
                      whileTap={{ scale: 0.98 }} 
                      key={idx} 
                      onClick={() => handleSelect(option.label)} 
                      className={`group relative flex items-center justify-between p-4 md:p-5 rounded-[1.25rem] transition-all duration-400 text-left overflow-hidden transform-gpu will-change-transform ${
                        isSelected 
                          ? 'border border-[#E71B25] shadow-[0_10px_30px_rgba(231,27,37,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] bg-[#110505]/80 backdrop-blur-xl' 
                          : 'border border-white/[0.04] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg'
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E71B25]/10 to-transparent pointer-events-none" />
                            <motion.div initial={{ x: "-100%" }} animate={{ x: "200%" }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute top-0 bottom-0 w-[1px] bg-[#E71B25]/50 shadow-[0_0_15px_#E71B25]" />
                          </>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div animate={{ scale: isSelected ? 1.2 : 1, color: isSelected ? '#E71B25' : '#888', y: isSelected ? -2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className={`p-2.5 rounded-[0.8rem] transition-all duration-300 ${isSelected ? 'bg-black/50 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-black/20 group-hover:bg-black/40'}`}>
                          <option.icon className="w-5 h-5 drop-shadow-md" strokeWidth={isSelected ? 2.5 : 2} />
                        </motion.div>
                        <span className={`text-[14.5px] md:text-base font-bold tracking-wide transition-colors duration-300 ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-gray-300 group-hover:text-white'}`}>{option.label}</span>
                      </div>

                      <div className="relative z-10 pr-1">
                        {currentStep.type === 'multiple' ? (
                           isSelected ? (
                             <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                               <CheckSquare className="w-6 h-6 text-[#E71B25] drop-shadow-[0_0_8px_rgba(231,27,37,0.5)]" fill="rgba(231,27,37,0.1)" strokeWidth={2.5} />
                             </motion.div>
                           ) : <Square className="w-6 h-6 text-gray-700/50" strokeWidth={1.5} />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-400 ${isSelected ? 'border-[#E71B25] shadow-[0_0_15px_rgba(231,27,37,0.4)] bg-black/50' : 'border-gray-700/50 bg-black/20 group-hover:border-gray-500'}`}>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 20 }} className="w-2.5 h-2.5 rounded-full bg-[#E71B25] shadow-[0_0_8px_#E71B25]" />
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* --- ADVANCED IMAGE GRID (For Current Body / Goal Physique) --- */}
            {currentStep.layout === 'grid-image' && (
              <div className="grid grid-cols-2 gap-3.5">
                {currentStep.options.map((option, idx) => {
                  const isSelected = formData[currentStep.id] === option.label;
                  return (
                    <motion.button 
                      whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => handleSelect(option.label)} 
                      className={`${option.fullWidth ? 'col-span-2 aspect-[21/9]' : 'aspect-square'} relative group rounded-[1.25rem] transition-all duration-400 overflow-hidden transform-gpu will-change-transform border ${
                        isSelected ? 'border-[#E71B25] shadow-[0_10px_30px_rgba(231,27,37,0.3)]' : 'border-white/[0.05] hover:border-white/20 hover:shadow-lg'
                      }`}
                    >
                      {/* The Image Background */}
                      <img src={option.img} alt={option.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      
                      {/* Deep Gradient Overlay so text is readable */}
                      <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-gradient-to-t from-[#E71B25]/80 via-[#110505]/40 to-transparent' : 'bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-transparent group-hover:from-[#050505]/70'}`} />

                      {/* Select Checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="absolute top-3 right-3 bg-green-500 rounded-full p-1 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-20">
                            <Check className="w-4 h-4 text-black" strokeWidth={4} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Label Text at Bottom */}
                      <div className="absolute bottom-4 left-0 right-0 px-3 flex justify-center z-10">
                        <span className={`font-bold leading-tight text-center transition-colors duration-300 ${option.fullWidth ? 'text-[15px] md:text-[17px]' : 'text-[13px] md:text-[14px]'} ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-200 group-hover:text-white'}`}>
                          {option.label}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* --- ADVANCED GRID MIXED & GRID-2 (Icons) --- */}
            {(currentStep.layout === 'grid-mixed' || currentStep.layout === 'grid-2') && currentStep.layout !== 'grid-image' && (
              <div className="grid grid-cols-2 gap-3.5">
                {currentStep.options.map((option, idx) => {
                  const isSelected = formData[currentStep.id] === option.label;
                  return (
                    <motion.button 
                      whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => handleSelect(option.label)} 
                      className={`${option.fullWidth ? 'col-span-2 flex items-center gap-4 p-5' : 'flex flex-col items-center justify-center p-7 text-center'} relative group rounded-[1.25rem] transition-all duration-400 overflow-hidden transform-gpu will-change-transform ${
                        isSelected ? 'border border-[#E71B25] shadow-[0_10px_30px_rgba(231,27,37,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] bg-[#110505]/80 backdrop-blur-xl' : 'border border-white/[0.04] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg'
                      }`}
                    >
                      <AnimatePresence>{isSelected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-b from-[#E71B25]/10 to-transparent pointer-events-none" />}</AnimatePresence>
                      {isSelected && !option.fullWidth && (
                        <motion.div initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="absolute top-3 right-3 bg-[#E71B25] rounded-full p-1 shadow-[0_0_12px_rgba(231,27,37,0.5)]"><Check className="w-3 h-3 text-white" strokeWidth={4} /></motion.div>
                      )}
                      <motion.div animate={{ scale: isSelected ? 1.15 : 1, color: isSelected ? '#E71B25' : '#888', y: isSelected ? -3 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className={`${option.fullWidth ? '' : 'bg-black/30 p-3 rounded-2xl mb-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:bg-black/50 transition-colors'}`}>
                        <option.icon className={`${option.fullWidth ? 'w-6 h-6 drop-shadow-md' : 'w-8 h-8 drop-shadow-lg'}`} strokeWidth={isSelected ? 2.5 : 2} />
                      </motion.div>
                      <span className={`font-bold leading-tight z-10 transition-colors duration-300 ${option.fullWidth ? 'text-[14.5px] md:text-base' : 'text-[13px] md:text-[14px]'} ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-gray-300 group-hover:text-white'}`}>{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* --- ADVANCED GRID 5 (EMOTIONS) --- */}
            {currentStep.layout === 'grid-5' && (
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-5 gap-2 md:gap-3 mb-8">
                  {currentStep.options.map((option, idx) => {
                    const isSelected = formData[currentStep.id] === option.label;
                    return (
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} key={idx} onClick={() => handleSelect(option.label)} 
                        className={`flex flex-col items-center justify-center p-2 rounded-[1.25rem] transition-all duration-400 text-center h-24 md:h-28 relative overflow-hidden transform-gpu will-change-transform ${
                          isSelected ? 'border border-[#E71B25] shadow-[0_8px_15px_rgba(231,27,37,0.2)] bg-[#E71B25]/10' : 'border border-white/[0.04] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-lg'
                        }`}
                      >
                        <motion.div animate={{ scale: isSelected ? 1.3 : 1, color: isSelected ? '#E71B25' : '#888', y: isSelected ? -2 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                          <option.icon className="w-6 h-6 md:w-7 md:h-7 mb-2 drop-shadow-md" strokeWidth={isSelected ? 2.5 : 2} />
                        </motion.div>
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {currentStep.infoBox && (
                  <div className="bg-white/[0.02] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.05] rounded-[1.25rem] p-5 flex gap-4 text-left relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-l-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/5 p-2.5 rounded-xl h-fit border border-yellow-500/20"><currentStep.infoBox.icon className="w-5 h-5 text-yellow-400" /></div>
                    <p className="text-gray-300 text-sm leading-relaxed"><strong className="text-white font-black tracking-wide block mb-1 drop-shadow-sm">{currentStep.infoBox.title}</strong> {currentStep.infoBox.text}</p>
                  </div>
                )}
              </div>
            )}

            {/* --- MULTIPLE CTA & SLIDERS --- */}
            {currentStep.type === 'multiple' && <div className="mt-8 flex justify-center"><MagneticButton text="Continue →" onClick={handleNext} /></div>}
            
            {currentStep.type === 'sliders' && (
              <div className="flex flex-col w-full mt-2">
                <CustomSlider label="Height" min={155} max={210} value={formData.height || 175} unit="CM" onChange={(val) => setFormData(prev => ({ ...prev, height: val }))} />
                <CustomSlider label="Weight" min={45} max={130} value={formData.weight || 75} unit="KG" onChange={(val) => setFormData(prev => ({ ...prev, weight: val }))} />
                <div className="w-full flex justify-center mt-6"><MagneticButton text="Continue →" onClick={handleNext} /></div>
              </div>
            )}

            {/* --- MIXED TRAINING --- */}
            {currentStep.type === 'mixed-training' && (
              <div className="flex flex-col w-full mt-2">
                <CustomSlider label="Days per week" min={2} max={7} value={formData.days || 4} unit=" DAYS" onChange={(val) => setFormData(prev => ({ ...prev, days: val }))} />
                <div className="w-full h-px bg-white/[0.05] my-6"></div>
                <span className="text-gray-400 text-sm font-bold mb-4 tracking-wide">WHERE DO YOU TRAIN?</span>
                <div className="flex flex-col gap-3.5 mb-8">
                  {[{l:"Commercial gym (full equipment)", i:Dumbbell}, {l:"Home gym (limited equipment)", i:Home}, {l:"Both gym and home", i:Activity}].map((opt, i) => (
                    <motion.button 
                      whileHover={{ scale: 1.015, y: -2 }} whileTap={{ scale: 0.98 }} key={i} onClick={() => setFormData(prev => ({ ...prev, location: opt.l }))} 
                      className={`group relative flex items-center gap-4 p-4 md:p-5 rounded-[1.25rem] transition-all duration-400 overflow-hidden transform-gpu will-change-transform ${
                        formData.location === opt.l ? 'border border-[#E71B25] shadow-[0_10px_30px_rgba(231,27,37,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] bg-[#110505]/80 backdrop-blur-xl' : 'border border-white/[0.04] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg'
                      }`}
                    >
                      <motion.div animate={{ scale: formData.location === opt.l ? 1.15 : 1, color: formData.location === opt.l ? '#E71B25' : '#888', y: formData.location === opt.l ? -2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className={`p-2.5 rounded-[0.8rem] transition-all ${formData.location === opt.l ? 'bg-black/50 shadow-inner' : 'bg-black/20 group-hover:bg-black/40'}`}>
                        <opt.i className="w-5 h-5 drop-shadow-md" strokeWidth={formData.location === opt.l ? 2.5 : 2} />
                      </motion.div>
                      <span className={`text-sm md:text-[15px] font-semibold transition-colors duration-300 ${formData.location === opt.l ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-gray-300 group-hover:text-white'}`}>{opt.l}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center"><MagneticButton text="Continue →" onClick={handleNext} /></div>
              </div>
            )}

            {/* --- PREMIUM INTERSTITIAL 1 (WE GET IT) --- */}
            {currentStep.type === 'interstitial' && (
              <div className="flex flex-col items-center w-full mt-2">
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="text-center bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] mb-10 w-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#E71B25]/80 to-transparent blur-[1px]"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#E71B25] blur-[50px] opacity-40 rounded-full pointer-events-none"></div>
                  
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="w-20 h-20 bg-gradient-to-b from-[#E71B25]/20 to-transparent border border-[#E71B25]/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
                    <currentStep.icon className="w-10 h-10 text-[#E71B25] drop-shadow-[0_0_15px_rgba(231,27,37,0.8)]" strokeWidth={2} />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 text-white drop-shadow-md">{currentStep.title}</h2>
                  <div className="text-gray-300 text-[15px] md:text-base leading-relaxed text-balance flex flex-col gap-6 font-medium">
                    {currentStep.subtitle.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        {paragraph.split(/(exactly what to fix\.)/gi).map((part, j) => part.toLowerCase() === "exactly what to fix." ? <span key={j} className="text-transparent bg-clip-text bg-gradient-to-r from-[#E71B25] to-[#ff4747] font-black tracking-wide drop-shadow-[0_0_8px_rgba(231,27,37,0.3)]">{part}</span> : part)}
                      </p>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }} className="w-full flex justify-center">
                  <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- UPGRADED INTERSTITIAL 2 (COMPARISON WITH FULL IMAGES) --- */}
            {currentStep.type === 'comparison' && (
              <div className="flex flex-col items-center w-full mt-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="w-full flex justify-center gap-3 md:gap-5 mb-8"
                >
                  {/* AVERAGE GUY BOX (Full Image Background) */}
                  <div className="flex-1 relative rounded-[1.25rem] overflow-hidden border border-white/[0.05] aspect-[3/4] shadow-lg group transform-gpu">
                    <img src={currentStep.imgAverage} alt="Average Guy" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col items-center text-center z-10">
                      <h3 className="font-black text-gray-400 mb-2 text-sm md:text-base tracking-wide">Average Guy</h3>
                      <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold leading-relaxed">
                        No plan.<br/>Random training.<br/>5 years, same body
                      </p>
                    </div>
                  </div>
                  
                  {/* BODYMAX USER BOX (Full Image Background) */}
                  <div className="flex-1 relative rounded-[1.25rem] overflow-hidden border border-green-500/50 aspect-[3/4] shadow-[0_10px_30px_rgba(34,197,94,0.15)] group transform-gpu">
                    <img src={currentStep.imgElite} alt="BodyMax User" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    
                    {/* Glowing Checkmark */}
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-20">
                      <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col items-center text-center z-10">
                      <h3 className="font-black text-white mb-2 text-sm md:text-base tracking-wide drop-shadow-md">BodyMax User</h3>
                      <p className="text-[9px] md:text-[10px] text-green-400 uppercase tracking-[0.15em] font-bold leading-relaxed drop-shadow-sm">
                        AI-guided.<br/>Precise plan.<br/>12 weeks, new physique
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                {/* The Hard Truth Info Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 mb-10 flex gap-4 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                >
                  <div className="bg-[#E71B25]/10 p-2.5 rounded-full h-fit shrink-0 border border-[#E71B25]/20"><Brain className="w-5 h-5 text-[#E71B25]" /></div>
                  <p className="text-[14.5px] md:text-base text-gray-300 font-medium leading-relaxed">
                    <strong className="text-white font-bold tracking-wide">The hard truth:</strong> {currentStep.subtitle}
                  </p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="w-full flex justify-center">
                  <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- COMPACT SOCIAL PROOF SECTION --- */}
            {currentStep.type === 'social-proof' && (
              <div className="flex flex-col items-center w-full mt-2">
                
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-lg md:text-xl font-bold text-white mb-5 flex items-center justify-center gap-2.5 tracking-wide"
                >
                  <Users className="w-5 h-5 text-[#E71B25]" /> You're in good company
                </motion.h2>

                <div className="flex flex-col gap-4 w-full mb-10 perspective-1000">
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-[#0a0a0a] border border-white/[0.05] rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group transform-gpu"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E71B25]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Users className="absolute -right-4 -bottom-4 w-28 h-28 text-white/[0.02] transition-transform duration-500 group-hover:scale-110 pointer-events-none" />

                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] tracking-tighter leading-none mb-1.5 drop-shadow-[0_0_15px_rgba(231,27,37,0.2)] relative z-10">
                      <AnimatedCounter end={200} suffix="K" />
                    </div>
                    <p className="text-gray-400 text-[13px] md:text-[15px] font-medium relative z-10">
                      men already building their dream physique
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-[#0a0a0a] border border-white/[0.05] rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group transform-gpu"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E71B25]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <TrendingUp className="absolute -right-4 -bottom-4 w-28 h-28 text-white/[0.02] transition-transform duration-500 group-hover:scale-110 pointer-events-none" />

                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] tracking-tighter leading-none mb-1.5 drop-shadow-[0_0_15px_rgba(231,27,37,0.2)] relative z-10">
                      <AnimatedCounter end={91} suffix="%" duration={1200} />
                    </div>
                    <p className="text-gray-400 text-[13px] md:text-[15px] font-medium mb-4 relative z-10">
                      see a visible physique change in 12 weeks
                    </p>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest relative z-10 backdrop-blur-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E71B25]/80" />
                      *Based on 82,000+ BodyMax Users
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="w-full flex justify-center">
                  <MagneticButton text="Start My Assessment →" onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- ULTRA-PREMIUM AI SCAN INTERSTITIAL --- */}
            {currentStep.type === 'scan-interstitial' && (
              <div className="flex flex-col items-center w-full mt-2">
                <div className="relative w-36 h-36 mx-auto mb-10 flex items-center justify-center mt-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-[2px] border-[#E71B25]/40 rounded-full border-dashed" />
                  <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="absolute inset-3 border border-[#E71B25]/30 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-6 bg-[#E71B25]/15 rounded-full blur-xl" />
                  <User className="w-12 h-12 text-[#E71B25] relative z-10 drop-shadow-[0_0_15px_rgba(231,27,37,0.8)]" strokeWidth={1.5} />
                  <div className="absolute inset-0 overflow-hidden rounded-full z-20">
                    <motion.div animate={{ y: ["-20%", "120%", "-20%"] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-full h-[3px] bg-white shadow-[0_0_30px_5px_rgba(231,27,37,0.8)]" />
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-center w-full">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/30 text-[#E71B25] text-[10px] font-black tracking-[0.25em] uppercase mb-6 shadow-[0_0_20px_rgba(231,27,37,0.15)]">
                    <Sparkles className="w-3.5 h-3.5" /> Initializing AI Engine
                  </div>
                  <h2 className="text-4xl md:text-[3.25rem] font-black uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
                    Now for the <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] drop-shadow-[0_0_20px_rgba(231,27,37,0.4)]">AI Scan</span>
                  </h2>
                  <p className="text-gray-400 text-[15px] md:text-base mb-10 text-balance max-w-sm mx-auto leading-relaxed">
                    Upload 3 photos so our neural network can calculate your exact BodyMax Score and map your physical weak points.
                  </p>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } } }} className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-7 md:p-10 w-full text-left mb-10 shadow-[0_30px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
                  <div className="absolute top-12 bottom-10 left-[38px] md:left-[50px] w-[2px] bg-gradient-to-b from-[#E71B25] to-transparent z-0" />
                  <h4 className="text-[11px] text-gray-400 font-black uppercase tracking-[0.25em] mb-8 relative z-10 flex items-center gap-2">
                    <Scan className="w-4 h-4 text-[#E71B25]" strokeWidth={2.5} /> Analysis Parameters:
                  </h4>
                  <div className="flex flex-col gap-6">
                    {[
                      { text: "Body proportions & V-taper", icon: Scale },
                      { text: "Muscle development tracking", icon: Dumbbell },
                      { text: "Estimated body fat mapping", icon: Activity },
                      { text: "Symmetry & balance score", icon: Search },
                      { text: "Gap vs dream physique", icon: Target }
                    ].map((item, i) => (
                      <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } } }} className="flex items-center gap-5 relative z-10">
                        <div className="w-7 h-7 rounded-full bg-[#111] border-[2px] border-[#E71B25]/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(231,27,37,0.2)]">
                          <div className="w-2 h-2 rounded-full bg-[#E71B25] animate-pulse shadow-[0_0_8px_#E71B25]" />
                        </div>
                        <span className="text-[14.5px] md:text-base text-gray-200 font-bold tracking-wide">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring", stiffness: 200 }} className="w-full flex justify-center">
                  <MagneticButton text="Upload My Photos →" onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- NATIVE OS PHOTO UPLOAD STEP --- */}
            {currentStep.type === 'upload-3' && (
              <div className="flex flex-col items-center w-full mt-2">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-10 text-center tracking-tight leading-tight max-w-sm"
                >
                  Upload <span className="text-[#E71B25]">3 photos</span> to get your body analyzed
                </motion.h2>

                {/* The 3 Image Cards Container */}
                <div className="flex flex-row justify-center gap-3 md:gap-5 w-full mb-10 perspective-1000">
                  {[
                    { label: "Front photo", img: "/Front.jpeg", num: 1 },
                    { label: "Side photo", img: "/Side.jpeg", num: 2 },
                    { label: "Back photo", img: "/Back.jpeg", num: 3 }
                  ].map((card, i) => {
                    const displayImg = (formData.photos && formData.photos[card.num]) || card.img;
                    const isUploaded = !!(formData.photos && formData.photos[card.num]);

                    return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                      key={i} 
                      className="flex flex-col items-center flex-1"
                    >
                      <div className={`w-full aspect-[2/3] bg-[#111] rounded-xl md:rounded-2xl relative mb-3 overflow-visible border shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${isUploaded ? 'border-[#E71B25]' : 'border-white/[0.05]'}`}>
                        <img src={displayImg} alt={card.label} className={`w-full h-full object-cover rounded-xl md:rounded-2xl transition-all duration-500 ${isUploaded ? 'opacity-100' : 'opacity-70'}`} />
                        
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg border-2 border-[#020202] shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-colors duration-300 ${isUploaded ? 'bg-green-500' : 'bg-[#E71B25]'}`}>
                          {isUploaded ? <Check className="w-5 h-5 text-black" strokeWidth={4} /> : card.num}
                        </div>
                      </div>
                      <span className="text-white font-semibold text-sm md:text-base tracking-wide mt-2">{card.label}</span>
                    </motion.div>
                  )})}
                </div>

                <div className="flex items-center gap-3 text-sm md:text-base font-medium text-white mb-8 bg-white/[0.03] backdrop-blur-md px-5 py-3 rounded-full border border-white/[0.05] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                  <div className="bg-green-500 rounded-md p-0.5"><Check className="w-4 h-4 text-black" strokeWidth={4} /></div>
                  It's safe, your photos won't be visible to anyone
                </div>

                {/* HIDDEN FILE INPUTS */}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  ref={galleryRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={cameraRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />

                {/* DYNAMIC CONTINUE BUTTON */}
                <AnimatePresence>
                  {formData.photos && Object.values(formData.photos).some(v => v !== null) && (
                    <motion.div initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: "auto", scale: 1 }} className="w-full flex justify-center mb-6">
                      <MagneticButton text="Analyse My Body →" onClick={handleNext} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* UPLOAD ACTION BUTTONS */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="w-full flex flex-col gap-3.5 mb-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => galleryRef.current.click()}
                    className="w-full flex items-center justify-center gap-3 bg-[#E71B25] hover:bg-[#C6161F] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest transition-colors shadow-[0_10px_30px_rgba(231,27,37,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  >
                    <ImageIcon className="w-5 h-5" /> Upload from Gallery
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => cameraRef.current.click()}
                    className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest transition-colors shadow-lg backdrop-blur-md"
                  >
                    <Camera className="w-5 h-5" /> Take a Photo
                  </motion.button>
                </motion.div>
                
                {(!formData.photos || !Object.values(formData.photos).some(v => v !== null)) && (
                  <button onClick={handleNext} className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors pb-0.5 border-b border-transparent hover:border-white">
                    Use demo (skip for now)
                  </button>
                )}
              </div>
            )}

            {/* --- FINAL UPLOAD GOAL STEP --- */}
            {currentStep.type === 'upload-goal' && (
              <div className="flex flex-col gap-4 mt-2">
                
                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  {currentStep.options.map((opt, i) => {
                    const isSelected = formData.goal === opt.label;
                    return (
                      <motion.button 
                        whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.98 }} key={i} 
                        onClick={() => setFormData(prev => ({ ...prev, goal: opt.label }))} 
                        className={`aspect-square relative group rounded-[1.25rem] transition-all duration-400 overflow-hidden transform-gpu will-change-transform border ${
                          isSelected ? 'border-[#E71B25] shadow-[0_10px_30px_rgba(231,27,37,0.3)]' : 'border-white/[0.05] hover:border-white/20 hover:shadow-lg'
                        }`}
                      >
                        {/* The Image Background */}
                        <img src={opt.img} alt={opt.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        
                        {/* Deep Gradient Overlay */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-gradient-to-t from-[#E71B25]/80 via-[#110505]/40 to-transparent' : 'bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-transparent group-hover:from-[#050505]/70'}`} />

                        {/* Select Checkmark */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="absolute top-3 right-3 bg-green-500 rounded-full p-1 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-20">
                              <Check className="w-4 h-4 text-black" strokeWidth={4} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Label Text at Bottom */}
                        <div className="absolute bottom-4 left-0 right-0 px-3 flex justify-center z-10">
                          <span className={`font-bold leading-tight text-center transition-colors duration-300 text-[13px] md:text-[14px] ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-200 group-hover:text-white'}`}>
                            {opt.label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.4em]">
                  <div className="w-12 h-px bg-gray-800"></div> OR <div className="w-12 h-px bg-gray-800"></div>
                </div>
                
                {/* Clickable Custom Upload Box */}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  ref={goalUploadRef} 
                  onChange={handleGoalPhotoUpload} 
                  className="hidden" 
                />
                
                <motion.button 
                  whileHover={{ scale: 1.015 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => goalUploadRef.current.click()}
                  className="flex flex-col items-center justify-center py-10 border-[1.5px] border-dashed border-[#E71B25]/40 bg-[#E71B25]/5 rounded-[1.5rem] hover:border-[#E71B25] transition-colors mb-10 group relative overflow-hidden"
                >
                  <Upload className="w-8 h-8 text-[#E71B25] mb-4 group-hover:-translate-y-2 transition-transform duration-400 drop-shadow-[0_0_10px_rgba(231,27,37,0.5)]" strokeWidth={2.5} />
                  <span className="text-[15px] font-black text-white uppercase tracking-widest mb-1.5 drop-shadow-md">Upload Goal Photo</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Favourite athlete or influencer</span>
                </motion.button>

                <AnimatePresence>
                  {formData.goal && (
                    <motion.div initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: "auto", scale: 1 }} className="w-full flex justify-center mb-6">
                      <MagneticButton text="Compare to My Body →" onClick={handleNext} />
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div> 

      {/* ==========================================
          THE PREMIUM PAYWALL OVERLAY
          ========================================== */}
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onCheckout={() => {
          console.log("Redirecting to Stripe with data:", formData);
          // Add your Stripe checkout redirect logic here!
        }} 
      />

    </div> 
  );
};

export default AssessmentFlow;