import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Flame, Dumbbell, Zap, Trophy, 
  Activity, Target, Clock, Image as ImageIcon, Scale, Check, 
  Frown, Meh, Smile, Heart, Lightbulb, CameraOff, XCircle, 
  Search, Brain, ShieldAlert, AlertCircle, Camera, Upload, 
  Home, CheckCircle, HelpCircle, CheckSquare, Square, Sparkles, Scan
} from 'lucide-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { MagneticButton } from '../ui/MagneticButton';
import PaywallModal from '../ui/PaywalModal'; // Fixed typo here!

// ==========================================
// ULTRA-PREMIUM SLIDER
// ==========================================
const CustomSlider = ({ label, min, max, value, onChange, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col w-full mb-8 group">
      <span className="text-gray-400 text-sm md:text-[15px] font-semibold mb-2 tracking-wide">{label}</span>
      <div className="text-center mb-5">
        <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff5a1f] to-[#e04a15] tracking-tighter uppercase leading-none drop-shadow-[0_0_15px_rgba(255,90,31,0.2)]">
          {value} <span className="text-3xl md:text-4xl text-[#ff5a1f]/80">{unit}</span>
        </span>
      </div>
      <div className="relative w-full flex items-center mb-3">
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none z-10 relative
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-[#ff5a1f] 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,90,31,0.4)]
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
          style={{ background: `linear-gradient(to right, #ff5a1f 0%, #ff5a1f ${percentage}%, #1f2937 ${percentage}%, #1f2937 100%)` }}
        />
      </div>
      <div className="flex justify-between w-full text-gray-500 text-[11px] font-bold tracking-[0.1em] uppercase">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
};

// ==========================================
// THE 21-SCREEN / 18-QUESTION DATA ENGINE
// ==========================================
const assessmentData = [
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW OLD ARE YOU?", subtitle: "Select your age range for a more accurate analysis", type: "single", id: "age", options: [{ label: "Under 18", icon: User }, { label: "18 – 22", icon: Flame }, { label: "23 – 27", icon: Dumbbell }, { label: "28 – 35", icon: Zap }, { label: "36+", icon: Trophy }] },
  { phase: "PHASE 1 — GETTING STARTED", title: "WHAT'S YOUR HEIGHT & WEIGHT?", subtitle: "Used to calculate your ideal physique targets", type: "sliders", id: "metrics" },
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW LONG HAVE YOU BEEN TRAINING?", subtitle: "Be honest — the AI needs this for accurate baselines.", type: "single", id: "experience", options: [{ label: "Just starting out", icon: Target }, { label: "Less than 1 year", icon: Clock }, { label: "1–3 years", icon: Activity }, { label: "3–5 years", icon: Flame }, { label: "5+ years (serious lifter)", icon: Trophy }] },
  { phase: "PHASE 2 — IDENTITY", title: "WHICH BEST DESCRIBES YOUR BODY RIGHT NOW?", subtitle: "Be honest — the AI needs this to give you accurate results", type: "single", layout: "grid-mixed", id: "currentBody", options: [{ label: "Muscular & built", icon: Dumbbell }, { label: "Skinny — need size", icon: Activity }, { label: "Average — not great", icon: User }, { label: "Overweight — need to cut", icon: Scale }, { label: "Skinny-fat — low muscle, some fat", icon: Zap, fullWidth: true }] },
  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHEN YOU LOOK IN THE MIRROR SHIRTLESS, HOW DO YOU FEEL?", subtitle: "This reveals your current confidence gap", type: "single", layout: "grid-5", id: "selfPerception1", options: [{ label: "Disappointed", icon: Frown }, { label: "Not happy", icon: Frown }, { label: "Okay-ish", icon: Meh }, { label: "Pretty good", icon: Smile }, { label: "Love it", icon: Heart }], infoBox: { icon: Lightbulb, title: "Did you know?", text: "87% of guys who've been training for 1+ year still feel dissatisfied. The problem isn't effort — it's direction." } },
  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHAT'S THE FIRST THING THAT BOTHERS YOU?", type: "single", id: "selfPerception2", options: [{ label: "My arms look too small", icon: Dumbbell }, { label: "My belly fat / love handles", icon: Activity }, { label: "My shoulders aren't wide enough", icon: Target }, { label: "Lack of muscle definition", icon: Search }, { label: "My back looks flat", icon: User }, { label: "My legs are too skinny", icon: Flame }] },
  
  { type: "interstitial", icon: Frown, title: "We Get It.", subtitle: "You're putting in the work. You train. But the mirror doesn't show what you expected. That's not your fault — it's because nobody showed you exactly what to fix.\n\nThe next questions will expose your real weak points.", buttonText: "Show Me My Weak Points →" },
  
  { phase: "PHASE 3 — PAIN POINTS", title: "WHICH OF THESE HIT CLOSE TO HOME?", subtitle: "Choose all that apply — be brutally honest", type: "multiple", id: "painPoints", options: [{ label: "Training for months but look the same", icon: Activity }, { label: "Other guys build muscle faster", icon: Users }, { label: "I look small in clothes", icon: User }, { label: "Don't look impressive shirtless", icon: ShieldAlert }, { label: "Avoid taking photos", icon: CameraOff }, { label: "Nothing sticks", icon: XCircle }] },
  { phase: "PHASE 3 — PAIN POINTS", title: "SEEING AN ELITE PHYSIQUE, WHAT DO YOU FEEL?", subtitle: "This reveals your motivation type", type: "single", id: "motivationTrigger", options: [{ label: "Jealous — I want that", icon: Flame }, { label: "Defeated — feel like I'll never get there", icon: Frown }, { label: "Inspired to work harder", icon: Target }, { label: "Nothing — not focused on comparisons", icon: Meh }] },
  { phase: "PHASE 3 — PAIN POINTS", title: "EVER AVOIDED A SITUATION BECAUSE OF YOUR BODY?", subtitle: "e.g. beach, pool, taking your shirt off", type: "single", id: "avoidance", options: [{ label: "Yes, often — I feel self-conscious", icon: Frown }, { label: "Sometimes — it crosses my mind", icon: Meh }, { label: "Rarely — I'm fairly comfortable", icon: Smile }, { label: "Never — I'm confident", icon: Heart }] },
  
  { type: "comparison", title: "The Hard Truth", subtitle: "Most guys train for years without identifying their single biggest weak point. That one weak point is the difference between an average physique and an elite one.", buttonText: "Find My Weak Point →" },
  
  { phase: "PHASE 4 — YOUR DREAM", title: "WHICH PHYSIQUE DO YOU WANT THE MOST?", subtitle: "Choose the body type that makes you think \"I want that\"", type: "single", layout: "grid-2", id: "dreamPhysique", options: [{ label: "Aesthetic V-Taper (David Laid)", icon: Target }, { label: "Lean & Shredded", icon: Flame }, { label: "Classic Bodybuilder (CBum)", icon: Trophy }, { label: "Athletic Build", icon: Zap }] },
  { phase: "PHASE 4 — PERSONALISATION", title: "WHAT'S YOUR #1 PHYSIQUE STRUGGLE?", subtitle: "The AI will prioritise fixing this first", type: "single", id: "mainStruggle", options: [{ label: "Losing body fat / getting lean", icon: Flame }, { label: "Building more muscle mass", icon: Dumbbell }, { label: "Improving symmetry & proportions", icon: Scale }, { label: "Building wider shoulders / V-taper", icon: Target }, { label: "Breaking through a plateau", icon: Activity }] },
  { phase: "PHASE 5 — PERSONALISATION", title: "TRAINING SCHEDULE & LOCATION?", subtitle: "Your plan will be built around your schedule", type: "mixed-training", id: "trainingSetup" },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW WOULD YOU DESCRIBE YOUR CURRENT DIET?", type: "single", id: "diet", options: [{ label: "I eat well, track macros", icon: CheckCircle }, { label: "Random — I eat whatever", icon: Activity }, { label: "Healthy but not optimised for muscle", icon: HelpCircle }, { label: "Mostly junk food / takeaways", icon: AlertCircle }, { label: "I have no idea what I'm doing", icon: XCircle }] },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW'S YOUR SLEEP & STRESS?", subtitle: "Average sleep per night", type: "single", id: "sleep", options: [{ label: "Less than 5 hours", icon: AlertCircle }, { label: "5–6 hours", icon: Clock }, { label: "7–8 hours", icon: CheckCircle }, { label: "8+ hours", icon: Heart }] },
  { phase: "PHASE 5 — MINDSET", title: "HOW MOTIVATED ARE YOU RIGHT NOW?", subtitle: "The AI calibrates your plan intensity based on this", type: "single", layout: "grid-5", id: "motivationLevel", options: [{ label: "Low", icon: Frown }, { label: "Okay", icon: Meh }, { label: "Good", icon: Dumbbell }, { label: "High", icon: Flame }, { label: "Obsessed", icon: Zap }], infoBox: { icon: Flame, title: "Fact:", text: "The most motivated guys using BodyMax AI see results 3x faster." } },
  { phase: "PHASE 5 — COMMITMENT", title: "ARE YOU WILLING TO COMMIT TO 12 WEEKS?", subtitle: "This determines whether we build an aggressive or moderate plan", type: "single", id: "commitment", options: [{ label: "Absolutely — ready to go all in", icon: Flame }, { label: "Yes — I'll follow the plan consistently", icon: CheckCircle }, { label: "Maybe — depends on what it asks", icon: HelpCircle }, { label: "I'll try but not sure", icon: Activity }] },
  
  { type: "scan-interstitial" },
  
  { phase: "AI SCAN", title: "UPLOAD 3 BODY PHOTOS", subtitle: "Full body, good lighting, neutral pose — front, side, back", type: "upload-3" },
  { phase: "AI SCAN", title: "WHAT'S YOUR DREAM PHYSIQUE?", subtitle: "Choose a preset or upload a photo of your goal body", type: "upload-goal", layout: "grid-1", options: [{ label: "Aesthetic V-Taper", icon: Target }, { label: "Lean & Shredded", icon: Flame }, { label: "Athletic Build", icon: Zap }, { label: "Classic Bodybuilder", icon: Trophy }, { label: "Calisthenics", icon: Activity }, { label: "Big & Massive", icon: Dumbbell }] }
];

const isQuestionStep = (step) => !['interstitial', 'comparison', 'scan-interstitial'].includes(step.type);
const TOTAL_QUESTIONS = assessmentData.filter(isQuestionStep).length;

// ==========================================
// THE ENGINE
// ==========================================
const AssessmentFlow = ({ formData, setFormData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showPaywall, setShowPaywall] = useState(false); 

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

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0, scale: 0.98, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (dir) => ({ x: dir < 0 ? -30 : 30, opacity: 0, scale: 0.98, filter: "blur(4px)" }) 
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      
      {/* TIGHT, HIGH-END HEADER */}
      <div className="w-full max-w-lg mx-auto px-4 pt-6 pb-2 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <motion.button 
            whileTap={{ x: -2 }} 
            onClick={handleBack} 
            className={`p-1.5 -ml-1.5 rounded-full hover:bg-white/5 transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <IoIosArrowRoundBack className="w-6 h-6 text-gray-500 hover:text-white transition-colors" strokeWidth={1.5} />
          </motion.button>
          
          <div className="flex-1 mx-5 h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff5a1f] to-[#ff8c42] shadow-[0_0_10px_#ff5a1f]" 
              animate={{ width: `${(currentQuestionNumber / TOTAL_QUESTIONS) * 100}%` }} 
              transition={{ duration: 0.5, ease: "easeOut" }} 
            />
          </div>
          
          <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
            {currentQuestionNumber}/{TOTAL_QUESTIONS}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto px-4 pb-12 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full flex flex-col"
          >
            {/* COMPACT TYPOGRAPHY */}
            {!['interstitial', 'comparison', 'scan-interstitial'].includes(currentStep.type) && (
              <>
                {currentStep.phase && (
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-[#ff5a1f] uppercase mb-3 flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#ff5a1f] rounded-full animate-pulse" />
                    {currentStep.phase}
                  </h4>
                )}
                {currentStep.title && (
                  <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black uppercase tracking-tighter leading-[1.05] mb-3 text-white text-balance">
                    {currentStep.title}
                  </h1>
                )}
                {currentStep.subtitle && (
                  <p className="text-gray-400 text-sm md:text-[15px] font-medium mb-8 whitespace-pre-wrap text-balance leading-relaxed">
                    {currentStep.subtitle}
                  </p>
                )}
              </>
            )}

            {/* --- LIST LAYOUT (SINGLE / MULTIPLE) --- */}
            {(currentStep.type === 'single' || currentStep.type === 'multiple') && !currentStep.layout && (
              <div className="flex flex-col gap-3">
                {currentStep.options.map((option, idx) => {
                  const isSelected = currentStep.type === 'multiple' ? (formData[currentStep.id] || []).includes(option.label) : formData[currentStep.id] === option.label;
                  return (
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => handleSelect(option.label)} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_20px_rgba(255,90,31,0.1)]' : 'border-gray-800/60 bg-[#080808] hover:border-gray-600 hover:bg-[#111]'}`}>
                      <div className="flex items-center gap-4">
                        <option.icon className={`w-5 h-5 ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} strokeWidth={2.5} />
                        <span className={`text-[14px] md:text-[15px] font-semibold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
                      </div>
                      {currentStep.type === 'multiple' ? (
                         isSelected ? <CheckSquare className="w-5 h-5 text-[#ff5a1f]" /> : <Square className="w-5 h-5 text-gray-700" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${isSelected ? 'border-[#ff5a1f]' : 'border-gray-700'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#ff5a1f]" />}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* --- GRID MIXED & GRID-2 --- */}
            {(currentStep.layout === 'grid-mixed' || currentStep.layout === 'grid-2') && (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map((option, idx) => {
                  const isSelected = formData[currentStep.id] === option.label;
                  return (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => handleSelect(option.label)} className={`${option.fullWidth ? 'col-span-2 flex items-center gap-4 p-4' : 'flex flex-col items-center justify-center p-6 text-center'} relative group rounded-2xl border transition-all duration-200 ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_20px_rgba(255,90,31,0.1)]' : 'border-gray-800/60 bg-[#080808] hover:border-gray-600 hover:bg-[#111]'}`}>
                      {isSelected && !option.fullWidth && <div className="absolute top-3 right-3 bg-[#ff5a1f] rounded-full p-0.5 shadow-md"><Check className="w-3.5 h-3.5 text-white" strokeWidth={4} /></div>}
                      <option.icon className={`${option.fullWidth ? 'w-5 h-5' : 'w-8 h-8 mb-3'} ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} strokeWidth={2} />
                      <span className={`text-[13px] md:text-sm font-bold leading-tight ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-400'}`}>{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* --- GRID 5 (Emotions) --- */}
            {currentStep.layout === 'grid-5' && (
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-5 gap-2 md:gap-3 mb-8">
                  {currentStep.options.map((option, idx) => {
                    const isSelected = formData[currentStep.id] === option.label;
                    return (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={idx} onClick={() => handleSelect(option.label)} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 text-center h-24 ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_15px_rgba(255,90,31,0.1)]' : 'border-gray-800/60 bg-[#080808] hover:border-gray-600'}`}>
                        <option.icon className={`w-7 h-7 mb-2 ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} />
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-400'}`}>{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {currentStep.infoBox && (
                  <div className="bg-[#111]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-5 flex gap-4 text-left shadow-xl">
                    <div className="bg-yellow-500/10 p-2 rounded-full h-fit"><currentStep.infoBox.icon className="w-5 h-5 text-yellow-500" /></div>
                    <p className="text-gray-400 text-sm leading-relaxed"><strong className="text-white font-semibold block mb-1">{currentStep.infoBox.title}</strong> {currentStep.infoBox.text}</p>
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
                <div className="w-full flex justify-center mt-4"><MagneticButton text="Continue →" onClick={handleNext} /></div>
              </div>
            )}

            {/* --- MIXED TRAINING --- */}
            {currentStep.type === 'mixed-training' && (
              <div className="flex flex-col w-full mt-2">
                <CustomSlider label="Days per week" min={2} max={7} value={formData.days || 4} unit=" DAYS" onChange={(val) => setFormData(prev => ({ ...prev, days: val }))} />
                <div className="w-full h-px bg-gray-800/40 my-6"></div>
                <span className="text-gray-400 text-sm font-semibold mb-4 tracking-wide">WHERE DO YOU TRAIN?</span>
                <div className="flex flex-col gap-3 mb-8">
                  {[{l:"Commercial gym (full equipment)", i:Dumbbell}, {l:"Home gym (limited equipment)", i:Home}, {l:"Both gym and home", i:Activity}].map((opt, i) => (
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} key={i} onClick={() => setFormData(prev => ({ ...prev, location: opt.l }))} className={`flex items-center gap-4 p-4 rounded-xl border ${formData.location === opt.l ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 text-white shadow-[0_0_15px_rgba(255,90,31,0.1)]' : 'border-gray-800/60 bg-[#080808] text-gray-400 hover:border-gray-600'}`}>
                      <opt.i className={`w-5 h-5 ${formData.location === opt.l ? 'text-[#ff5a1f]' : ''}`} /><span className="text-sm md:text-[15px] font-semibold">{opt.l}</span>
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
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center bg-[#0d0704]/80 backdrop-blur-xl border border-[#ff5a1f]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(255,90,31,0.05)] mb-8 w-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a1f]/40 to-transparent blur-[1px]"></div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <currentStep.icon className="w-12 h-12 text-[#ff5a1f] drop-shadow-[0_0_20px_rgba(255,90,31,0.6)]" strokeWidth={1.5} />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-6 text-[#ff5a1f] drop-shadow-[0_0_10px_rgba(255,90,31,0.3)]">{currentStep.title}</h2>
                  <div className="text-gray-300 text-sm md:text-[15px] leading-relaxed text-balance flex flex-col gap-6 font-medium">
                    {currentStep.subtitle.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        {paragraph.split(/(exactly what to fix\.)/gi).map((part, j) => part.toLowerCase() === "exactly what to fix." ? <span key={j} className="text-[#ff5a1f] font-bold tracking-wide">{part}</span> : part)}
                      </p>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }} className="w-full flex justify-center">
                  <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- PREMIUM INTERSTITIAL 2 (COMPARISON) --- */}
            {currentStep.type === 'comparison' && (
              <div className="flex flex-col items-center w-full mt-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="w-full flex justify-center gap-4 mb-8"
                >
                  <div className="flex-1 bg-[#050505] border border-gray-800 p-6 rounded-2xl text-center shadow-lg">
                    <User className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-400 mb-3">Average Guy</h3>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold leading-relaxed">No plan.<br/>Random training.<br/>5 years, same body</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-b from-[#0a140a] to-[#040804] border border-green-900/60 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                    <Trophy className="w-8 h-8 text-green-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                    <h3 className="font-bold text-white mb-3">BodyMax User</h3>
                    <p className="text-[11px] text-green-500/80 uppercase tracking-widest font-semibold leading-relaxed">AI-guided.<br/>Precise plan.<br/>12 weeks, new physique</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#111] border border-gray-800 rounded-2xl p-6 mb-8 flex gap-4 text-left shadow-xl"
                >
                  <div className="bg-[#ff5a1f]/10 p-2.5 rounded-full h-fit shrink-0"><Brain className="w-5 h-5 text-[#ff5a1f]" /></div>
                  <p className="text-sm md:text-[15px] text-gray-300 font-medium leading-relaxed">
                    <strong className="text-white">The hard truth:</strong> {currentStep.subtitle}
                  </p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="w-full flex justify-center">
                  <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- ULTRA-PREMIUM AI SCAN INTERSTITIAL --- */}
            {currentStep.type === 'scan-interstitial' && (
              <div className="flex flex-col items-center w-full mt-2">
                <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center mt-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-0 border-[1.5px] border-[#ff5a1f]/30 rounded-full border-dashed" />
                  <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-2 border border-[#ff5a1f]/20 rounded-full" />
                  <div className="absolute inset-4 bg-[#ff5a1f]/10 rounded-full blur-xl animate-pulse" />
                  <User className="w-10 h-10 text-[#ff5a1f] relative z-10 opacity-90" strokeWidth={1.5} />
                  <div className="absolute inset-0 overflow-hidden rounded-full z-20">
                    <motion.div animate={{ y: ["-20%", "120%", "-20%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="w-full h-[2px] bg-[#ff5a1f] shadow-[0_0_20px_4px_rgba(255,90,31,0.6)]" />
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-center w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] text-[9px] font-bold tracking-[0.25em] uppercase mb-5 shadow-[0_0_15px_rgba(255,90,31,0.1)]">
                    <Sparkles className="w-3 h-3" /> Initializing AI Engine
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                    Now for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a1f] to-[#ff8c42] drop-shadow-[0_0_15px_rgba(255,90,31,0.3)]">AI Scan</span>
                  </h2>
                  <p className="text-gray-400 text-sm md:text-[15px] mb-8 text-balance max-w-sm mx-auto leading-relaxed">
                    Upload 3 photos so our neural network can calculate your exact BodyMax Score and map your physical weak points.
                  </p>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } } }} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 md:p-8 w-full text-left mb-10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-10 bottom-8 left-[34px] md:left-[42px] w-px bg-gray-800 z-0" />
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-6 relative z-10 flex items-center gap-2">
                    <Scan className="w-3.5 h-3.5 text-[#ff5a1f]" /> Analysis Parameters:
                  </h4>
                  <div className="flex flex-col gap-5">
                    {[
                      { text: "Body proportions & V-taper", icon: Scale },
                      { text: "Muscle development tracking", icon: Dumbbell },
                      { text: "Estimated body fat mapping", icon: Activity },
                      { text: "Symmetry & balance score", icon: Search },
                      { text: "Gap vs dream physique", icon: Target }
                    ].map((item, i) => (
                      <motion.div key={i} variants={{ hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } } }} className="flex items-center gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-[#050505] border-2 border-gray-800 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,90,31,0.05)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-pulse" />
                        </div>
                        <span className="text-[13px] md:text-sm text-gray-300 font-semibold tracking-wide">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring", stiffness: 200 }} className="w-full flex justify-center">
                  <MagneticButton text="Upload My Photos →" onClick={handleNext} />
                </motion.div>
              </div>
            )}

            {/* --- PHOTO UPLOADS --- */}
            {currentStep.type === 'upload-3' && (
              <div className="flex flex-col gap-4 mt-2">
                {['Front', 'Side', 'Back'].map((side, i) => (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={i} className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-700/60 bg-[#080808] rounded-2xl hover:border-[#ff5a1f]/60 hover:bg-[#ff5a1f]/5 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ff5a1f]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Camera className="w-7 h-7 text-gray-600 mb-3 group-hover:text-[#ff5a1f] group-hover:scale-110 transition-all duration-300" />
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Upload {side}</span>
                  </motion.button>
                ))}
                <div className="text-center text-[11px] font-semibold text-gray-500 mt-4 mb-6 uppercase tracking-widest"><ShieldAlert className="w-4 h-4 inline mr-1.5 -mt-0.5 text-green-500/70" /> Private & secure — never shared</div>
                <div className="flex flex-col items-center gap-4">
                  <MagneticButton text="Analyse My Body →" onClick={handleNext} />
                  <button onClick={handleNext} className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">Use demo (skip for now)</button>
                </div>
              </div>
            )}

            {/* --- UPLOAD GOAL --- */}
            {currentStep.type === 'upload-goal' && (
              <div className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {currentStep.options.map((opt, i) => (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={i} onClick={() => setFormData(prev => ({ ...prev, goal: opt.label }))} className={`flex flex-col items-center justify-center p-5 border rounded-2xl transition-all ${formData.goal === opt.label ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_15px_rgba(255,90,31,0.15)]' : 'border-gray-800/60 bg-[#080808] hover:border-gray-600 hover:bg-[#111]'}`}>
                      <opt.icon className={`w-7 h-7 mb-3 ${formData.goal === opt.label ? 'text-[#ff5a1f]' : 'text-gray-500'}`} strokeWidth={2} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${formData.goal === opt.label ? 'text-[#ff5a1f]' : 'text-gray-400'}`}>{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-[0.3em]">
                  <div className="w-10 h-px bg-gray-800"></div> OR <div className="w-10 h-px bg-gray-800"></div>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[#ff5a1f]/40 bg-[#ff5a1f]/5 rounded-2xl hover:border-[#ff5a1f] transition-colors mb-8 group relative overflow-hidden">
                  <Upload className="w-7 h-7 text-[#ff5a1f] mb-3 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider mb-1">Upload Goal Photo</span>
                  <span className="text-xs font-medium text-gray-400">Favourite athlete or influencer</span>
                </motion.button>
                <div className="flex justify-center"><MagneticButton text="Compare to My Body →" onClick={handleNext} /></div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div> 
      {/* ^ THIS CLOSES THE MAIN z-10 QUESTIONS CONTAINER ^ */}


      {/* ==========================================
          THE PREMIUM PAYWALL OVERLAY
          MOVED OUTSIDE TO FIX THE Z-INDEX BUG!
          ========================================== */}
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onCheckout={() => {
          console.log("Redirecting to Stripe with data:", formData);
          // Add your Stripe checkout redirect logic here!
        }} 
      />

    </div> // <-- THIS CLOSES THE ABSOLUTE ROOT WRAPPER
  );
};

export default AssessmentFlow;