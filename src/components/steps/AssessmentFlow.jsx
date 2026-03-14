import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, User, Users, Flame, Dumbbell, Zap, Trophy, 
  Activity, Target, Clock, Image as ImageIcon, Ruler, Weight,
  Scale, Check, Frown, Meh, Smile, Heart, Lightbulb, 
  CameraOff, XCircle, Search, Play, Brain, ShieldAlert,
  AlertCircle, Camera, Upload, Calendar, Home, CheckCircle, HelpCircle,
  BarChart, ArrowRight, X
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// ==========================================
// COMPACT CUSTOM SLIDER 
// ==========================================
const CustomSlider = ({ label, min, max, value, onChange, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col w-full mb-8">
      <span className="text-gray-400 text-[15px] md:text-base font-medium mb-1">{label}</span>
      <div className="text-center mb-6">
        <span className="text-[3.5rem] md:text-7xl font-black text-[#ff5a1f] tracking-tighter uppercase leading-none font-condensed">
          {value} {unit}
        </span>
      </div>
      <div className="relative w-full flex items-center mb-4">
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none z-10 relative
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
            [&::-webkit-slider-thumb]:bg-[#ff5a1f] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_8px_rgba(255,90,31,0.15)]
            [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:bg-[#ff5a1f] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
          style={{ background: `linear-gradient(to right, #ff5a1f 0%, #ff5a1f ${percentage}%, #1f2937 ${percentage}%, #1f2937 100%)` }}
        />
      </div>
      <div className="flex justify-between w-full text-gray-500 text-[13px] font-medium tracking-wide">
        <span>{min}{unit.toLowerCase()}</span><span>{max}{unit.toLowerCase()}</span>
      </div>
    </div>
  );
};

// ==========================================
// THE FULL 18-STEP DATA ENGINE
// ==========================================
const assessmentData = [
  // --- PHASE 1 ---
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW OLD ARE YOU?", subtitle: "Select your age range for a more accurate analysis", type: "single", id: "age", options: [{ label: "Under 18", icon: User }, { label: "18 – 22", icon: Flame }, { label: "23 – 27", icon: Dumbbell }, { label: "28 – 35", icon: Zap }, { label: "36+", icon: Trophy }] },
  { phase: "PHASE 1 — GETTING STARTED", title: "WHAT'S YOUR HEIGHT & WEIGHT?", subtitle: "Used to calculate your ideal physique targets", type: "sliders", id: "metrics" },
  { phase: "PHASE 1 — GETTING STARTED", title: "HOW LONG HAVE YOU BEEN TRAINING?", type: "single", id: "experience", options: [{ label: "Just starting out", icon: Target }, { label: "Less than 1 year", icon: Clock }, { label: "1–3 years", icon: Activity }, { label: "3–5 years", icon: Flame }, { label: "5+ years (serious lifter)", icon: Trophy }] },
  
  // --- PHASE 2 ---
  { phase: "PHASE 2 — IDENTITY", title: "WHICH BEST DESCRIBES YOUR BODY RIGHT NOW?", subtitle: "Be honest — the AI needs this to give you accurate results", type: "single", layout: "grid-mixed", id: "currentBody", options: [{ label: "Muscular & built", icon: Dumbbell }, { label: "Skinny — need size", icon: Activity }, { label: "Average — not great", icon: User }, { label: "Overweight — need to cut", icon: Scale }, { label: "Skinny-fat — low muscle, some fat", icon: Zap, fullWidth: true }] },
  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHEN YOU LOOK IN THE MIRROR SHIRTLESS, HOW DO YOU FEEL?", subtitle: "This reveals your current confidence gap", type: "single", layout: "grid-5", id: "selfPerception1", options: [{ label: "Disappointed", icon: Frown }, { label: "Not happy", icon: Frown }, { label: "Okay-ish", icon: Meh }, { label: "Pretty good", icon: Smile }, { label: "Love it", icon: Heart }], infoBox: { icon: Lightbulb, title: "Did you know?", text: "87% of guys who've been training for 1+ year still feel dissatisfied with how they look. The problem isn't effort — it's direction." } },
  { phase: "PHASE 2 — SELF PERCEPTION", title: "WHAT'S THE FIRST THING YOU NOTICE THAT BOTHERS YOU?", type: "single", id: "selfPerception2", options: [{ label: "My arms look too small", icon: Dumbbell }, { label: "My belly fat / love handles", icon: Activity }, { label: "My shoulders aren't wide enough", icon: Target }, { label: "Lack of muscle definition", icon: Search }, { label: "My back looks flat / underdeveloped", icon: User }, { label: "My legs are too skinny", icon: Flame }] },
  
  // --- INTERSTITIAL ---
  { type: "interstitial", icon: Frown, title: "We Get It.", subtitle: "You're putting in the work. You show up. You train. But the mirror doesn't show what you expected. That's not your fault — it's because nobody showed you exactly what to fix.\n\nThe next questions will expose your real weak points.", buttonText: "Show Me My Weak Points →" },
  
  // --- PHASE 3 ---
  { phase: "PHASE 3 — PAIN POINTS", title: "WHICH OF THESE HIT CLOSE TO HOME?", subtitle: "Choose all that apply — be brutally honest", type: "multiple", id: "painPoints", options: [{ label: "Training for months but look the same", icon: Activity }, { label: "Other guys build muscle faster", icon: Users }, { label: "I look small in clothes", icon: User }, { label: "Don't look impressive shirtless", icon: ShieldAlert }, { label: "Avoid taking photos", icon: CameraOff }, { label: "Nothing sticks", icon: XCircle }] },
  { phase: "PHASE 3 — PAIN POINTS", title: "WHEN YOU SEE A GUY WITH AN ELITE PHYSIQUE, WHAT DO YOU FEEL?", subtitle: "This reveals your motivation type", type: "single", id: "motivationTrigger", options: [{ label: "Jealous — I want that", icon: Flame }, { label: "Defeated — feel like I'll never get there", icon: Frown }, { label: "Inspired to work harder", icon: Target }, { label: "Nothing — not focused on comparisons", icon: Meh }] },
  { phase: "PHASE 3 — PAIN POINTS", title: "HAVE YOU EVER AVOIDED A SITUATION BECAUSE OF YOUR BODY?", subtitle: "e.g. beach, pool, taking your shirt off, photos", type: "single", id: "avoidance", options: [{ label: "Yes, often — I feel self-conscious", icon: Frown }, { label: "Sometimes — it crosses my mind", icon: Meh }, { label: "Rarely — I'm fairly comfortable", icon: Smile }, { label: "Never — I'm confident", icon: Heart }] },
  
  // --- COMPARISON INTERSTITIAL ---
  { type: "comparison", title: "The Hard Truth", subtitle: "Most guys train for years without identifying their single biggest weak point. That one weak point is the difference between an average physique and an elite one.", buttonText: "Find My Weak Point →" },

  // --- PHASE 4 ---
  { phase: "PHASE 4 — YOUR DREAM", title: "WHICH PHYSIQUE DO YOU WANT THE MOST?", subtitle: "Choose the body type that makes you think \"I want that\"", type: "single", layout: "grid-2", id: "dreamPhysique", options: [{ label: "Aesthetic V-Taper (David Laid)", icon: Target }, { label: "Lean & Shredded", icon: Flame }, { label: "Classic Bodybuilder (CBum)", icon: Trophy }, { label: "Athletic Build", icon: Zap }] },
  { phase: "PHASE 4 — PERSONALISATION", title: "WHAT'S YOUR #1 PHYSIQUE STRUGGLE RIGHT NOW?", subtitle: "The AI will prioritise fixing this first", type: "single", id: "mainStruggle", options: [{ label: "Losing body fat / getting lean", icon: Flame }, { label: "Building more muscle mass", icon: Dumbbell }, { label: "Improving symmetry & proportions", icon: Scale }, { label: "Building wider shoulders / V-taper", icon: Target }, { label: "Breaking through a plateau", icon: Activity }] },
  
  // --- PHASE 5 ---
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW MANY DAYS PER WEEK CAN YOU TRAIN?", subtitle: "Where do you train?", type: "mixed-training", id: "trainingSetup" },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW WOULD YOU DESCRIBE YOUR CURRENT DIET?", type: "single", id: "diet", options: [{ label: "I eat well, track macros", icon: CheckCircle }, { label: "Random — I eat whatever", icon: Activity }, { label: "Healthy but not optimised for muscle", icon: HelpCircle }, { label: "Mostly junk food / takeaways", icon: AlertCircle }, { label: "I have no idea what I'm doing", icon: XCircle }] },
  { phase: "PHASE 5 — PERSONALISATION", title: "HOW'S YOUR SLEEP & STRESS?", subtitle: "Average sleep per night", type: "single", id: "sleep", options: [{ label: "Less than 5 hours", icon: AlertCircle }, { label: "5–6 hours", icon: Clock }, { label: "7–8 hours", icon: CheckCircle }, { label: "8+ hours", icon: Heart }] },
  { phase: "PHASE 5 — MINDSET", title: "HOW MOTIVATED ARE YOU TO CHANGE YOUR PHYSIQUE?", subtitle: "The AI calibrates your plan intensity based on this", type: "single", layout: "grid-5", id: "motivationLevel", options: [{ label: "Low", icon: Frown }, { label: "Okay", icon: Meh }, { label: "Good", icon: Dumbbell }, { label: "High", icon: Flame }, { label: "Obsessed", icon: Zap }], infoBox: { icon: Flame, title: "Fact:", text: "The most motivated guys using BodyMax AI see results 3x faster than those who are just 'trying it out.'" } },
  { phase: "PHASE 5 — COMMITMENT", title: "ARE YOU WILLING TO COMMIT TO 12 WEEKS?", subtitle: "This determines whether we build an aggressive or moderate plan", type: "single", id: "commitment", options: [{ label: "Absolutely — ready to go all in", icon: Flame }, { label: "Yes — I'll follow the plan consistently", icon: CheckCircle }, { label: "Maybe — depends on what it asks", icon: HelpCircle }, { label: "I'll try but not sure I can stay consistent", icon: Activity }] },
  
  // --- AI SCAN INTERSTITIAL & UPLOAD ---
  { type: "scan-interstitial" },
  { phase: "AI SCAN", title: "UPLOAD YOUR 3 BODY PHOTOS", subtitle: "Full body, good lighting, neutral pose — front, side, and back", type: "upload-3" },
  { phase: "AI SCAN", title: "WHAT'S YOUR DREAM PHYSIQUE?", subtitle: "Choose a preset or upload a photo of your goal body", type: "upload-goal", layout: "grid-2", options: [{ label: "Aesthetic V-Taper", icon: Target }, { label: "Lean & Shredded", icon: Flame }, { label: "Athletic Build", icon: Zap }, { label: "Classic Bodybuilder", icon: Trophy }, { label: "Calisthenics", icon: Activity }, { label: "Big & Massive", icon: Dumbbell }] }
];


// ==========================================
// THE ENGINE
// ==========================================
const AssessmentFlow = ({ formData, setFormData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const currentStep = assessmentData[currentIndex];
  const isLastStep = currentIndex === assessmentData.length - 1;

  // Handles moving Forward/Back
  const handleNext = () => {
    if (isLastStep) { console.log("SUBMITTING TO AI BACKEND:", formData); return; }
    setDirection(1); setCurrentIndex(prev => prev + 1);
  };
  const handleBack = () => {
    if (currentIndex === 0) return;
    setDirection(-1); setCurrentIndex(prev => prev - 1);
  };

  // Handles Single vs Multiple Selection Logic
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
    enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0, filter: "blur(3px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir) => ({ x: dir < 0 ? -30 : 30, opacity: 0, filter: "blur(3px)" }) // Fix exit dir
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      
      {/* HEADER / PROGRESS BAR */}
      <div className="w-full max-w-xl mx-auto px-4 pt-6 pb-2 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className={`p-1.5 -ml-1.5 rounded-full hover:bg-white/5 transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 mx-5 h-[3px] bg-gray-800 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#ff5a1f]" animate={{ width: `${((currentIndex + 1) / assessmentData.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{currentIndex + 1}/{assessmentData.length}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto px-4 pb-12 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full flex flex-col"
          >
            {/* STANDARD HEADERS */}
            {currentStep.phase && <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#ff5a1f] uppercase mb-3">{currentStep.phase}</h4>}
            {currentStep.title && <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] mb-3 text-white text-balance">{currentStep.title}</h1>}
            {currentStep.subtitle && <p className="text-gray-400 text-sm md:text-[15px] font-medium mb-8 whitespace-pre-wrap text-balance">{currentStep.subtitle}</p>}

            {/* --- SINGLE & MULTIPLE CHOICE LISTS --- */}
            {(currentStep.type === 'single' || currentStep.type === 'multiple') && !currentStep.layout && (
              <div className="flex flex-col gap-2.5">
                {currentStep.options.map((option, idx) => {
                  const isSelected = currentStep.type === 'multiple' ? (formData[currentStep.id] || []).includes(option.label) : formData[currentStep.id] === option.label;
                  return (
                    <button key={idx} onClick={() => handleSelect(option.label)} className={`group flex items-center justify-between p-3.5 md:p-4 rounded-xl border transition-all duration-200 text-left ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_15px_rgba(255,90,31,0.1)]' : 'border-gray-800/80 bg-[#0a0a0a] hover:border-gray-600 hover:bg-[#111]'}`}>
                      <div className="flex items-center gap-3.5">
                        <option.icon className={`w-4 h-4 ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} strokeWidth={2.5} />
                        <span className={`text-[14px] md:text-[15px] font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${isSelected ? 'border-[#ff5a1f]' : 'border-gray-700'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#ff5a1f]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* --- MULTIPLE CHOICE CTA --- */}
            {currentStep.type === 'multiple' && (
              <div className="mt-6 flex justify-center"><MagneticButton text="Continue →" onClick={handleNext} /></div>
            )}

            {/* --- LAYOUTS: GRID-MIXED & GRID-2 & GRID-5 --- */}
            {(currentStep.layout === 'grid-mixed' || currentStep.layout === 'grid-2') && (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map((option, idx) => {
                  const isSelected = formData[currentStep.id] === option.label;
                  return (
                    <button key={idx} onClick={() => handleSelect(option.label)} className={`${option.fullWidth ? 'col-span-2 flex items-center gap-3.5 p-4' : 'flex flex-col items-center justify-center p-6 text-center'} relative group rounded-2xl border transition-all duration-200 ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_15px_rgba(255,90,31,0.1)]' : 'border-gray-800/80 bg-[#0a0a0a] hover:border-gray-600 hover:bg-[#111]'}`}>
                      {isSelected && !option.fullWidth && <div className="absolute top-3 right-3 bg-[#ff5a1f] rounded-full p-0.5"><Check className="w-3.5 h-3.5 text-white" strokeWidth={4} /></div>}
                      <option.icon className={`${option.fullWidth ? 'w-4 h-4' : 'w-8 h-8 mb-3'} ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} />
                      <span className={`text-sm md:text-[15px] font-semibold leading-tight ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-300'}`}>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {currentStep.layout === 'grid-5' && (
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-5 gap-2 md:gap-3 mb-6">
                  {currentStep.options.map((option, idx) => {
                    const isSelected = formData[currentStep.id] === option.label;
                    return (
                      <button key={idx} onClick={() => handleSelect(option.label)} className={`flex flex-col items-center justify-start p-3 md:p-4 rounded-xl border transition-all duration-200 text-center h-24 ${isSelected ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-[0_0_15px_rgba(255,90,31,0.1)]' : 'border-gray-800/80 bg-[#0a0a0a] hover:border-gray-600'}`}>
                        <option.icon className={`w-6 h-6 mb-2 mt-1 ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-500'}`} />
                        <span className={`text-[10px] md:text-xs font-semibold leading-tight ${isSelected ? 'text-[#ff5a1f]' : 'text-gray-400'}`}>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                {currentStep.infoBox && (
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex gap-3 text-left shadow-lg">
                    <currentStep.infoBox.icon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed"><strong className="text-white font-semibold">{currentStep.infoBox.title}</strong> {currentStep.infoBox.text}</p>
                  </div>
                )}
              </div>
            )}

            {/* --- SLIDERS --- */}
            {currentStep.type === 'sliders' && (
              <div className="flex flex-col w-full mt-4">
                <CustomSlider label="Height" min={155} max={210} value={formData.height || 175} unit="CM" onChange={(val) => setFormData(prev => ({ ...prev, height: val }))} />
                <CustomSlider label="Weight" min={45} max={130} value={formData.weight || 75} unit="KG" onChange={(val) => setFormData(prev => ({ ...prev, weight: val }))} />
                <div className="w-full flex justify-center mt-2"><MagneticButton text="Continue →" onClick={handleNext} /></div>
              </div>
            )}

            {/* --- MIXED TRAINING (Slider + Location) --- */}
            {currentStep.type === 'mixed-training' && (
              <div className="flex flex-col w-full mt-4">
                <CustomSlider label="Days per week" min={2} max={7} value={formData.days || 4} unit=" DAYS" onChange={(val) => setFormData(prev => ({ ...prev, days: val }))} />
                <div className="w-full h-px bg-gray-800/50 mb-6"></div>
                <span className="text-gray-400 text-[15px] font-medium mb-3">Where do you train?</span>
                <div className="flex flex-col gap-2.5 mb-8">
                  {[{l:"Commercial gym", i:Dumbbell}, {l:"Home gym", i:Home}, {l:"Both", i:Activity}].map((opt, i) => (
                    <button key={i} onClick={() => setFormData(prev => ({ ...prev, location: opt.l }))} className={`flex items-center gap-3 p-3.5 rounded-xl border ${formData.location === opt.l ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 text-white' : 'border-gray-800 bg-[#0a0a0a] text-gray-400'}`}>
                      <opt.i className="w-4 h-4" /><span className="text-sm font-semibold">{opt.l}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center"><MagneticButton text="Continue →" onClick={handleNext} /></div>
              </div>
            )}

            {/* --- INTERSTITIALS --- */}
            {currentStep.type === 'interstitial' && (
              <div className="text-center bg-[#0a0a0a] border border-gray-800/80 rounded-3xl p-8 md:p-10 shadow-2xl mt-4">
                <div className="w-16 h-16 bg-[#ff5a1f]/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><currentStep.icon className="w-8 h-8 text-[#ff5a1f]" /></div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{currentStep.title}</h2>
                <p className="text-gray-400 text-base leading-relaxed mb-8">{currentStep.subtitle}</p>
                <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
              </div>
            )}

            {currentStep.type === 'comparison' && (
              <div className="w-full flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-[#050505] border border-gray-800 p-6 rounded-2xl text-center"><User className="w-8 h-8 text-gray-500 mx-auto mb-3" /><h3 className="font-bold text-gray-400 mb-2">Average Guy</h3><p className="text-xs text-gray-500">No plan. Random training. 5 years, same body</p></div>
                  <div className="bg-gradient-to-b from-[#0a120a] to-[#040804] border border-green-900/50 p-6 rounded-2xl text-center"><Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" /><h3 className="font-bold text-white mb-2">BodyMax User</h3><p className="text-xs text-green-500/80">AI-guided. Precise plan. 12 weeks, new physique</p></div>
                </div>
                <div className="bg-[#111] border border-gray-800 rounded-xl p-5 mb-8 flex gap-3 text-left"><Brain className="w-6 h-6 text-[#ff5a1f] shrink-0" /><p className="text-sm text-gray-400">{currentStep.subtitle}</p></div>
                <MagneticButton text={currentStep.buttonText} onClick={handleNext} />
              </div>
            )}

            {/* --- UPLOADS --- */}
            {currentStep.type === 'scan-interstitial' && (
              <div className="text-center mt-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><Brain className="w-8 h-8 text-blue-500" /></div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-4 text-white">Now for the AI Scan</h2>
                <p className="text-gray-400 mb-6">Upload 3 photos so our AI can calculate your exact BodyMax Score and identify weak points.</p>
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 text-left mb-8 space-y-3">
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">What the AI analyses:</h4>
                  {["Body proportions & V-taper", "Muscle development", "Estimated body fat", "Symmetry score", "Gap vs dream physique"].map((t, i) => (<div key={i} className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-[#ff5a1f]" />{t}</div>))}
                </div>
                <MagneticButton text="Upload My Photos →" onClick={handleNext} />
              </div>
            )}

            {currentStep.type === 'upload-3' && (
              <div className="flex flex-col gap-4 mt-4">
                {['Front', 'Side', 'Back'].map((side, i) => (
                  <button key={i} className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-700 bg-[#0a0a0a] rounded-2xl hover:border-[#ff5a1f] hover:bg-[#ff5a1f]/5 transition-colors group">
                    <Camera className="w-8 h-8 text-gray-500 mb-2 group-hover:text-[#ff5a1f]" />
                    <span className="text-sm font-semibold text-gray-300">Upload {side}</span>
                  </button>
                ))}
                <div className="text-center text-xs text-gray-500 mt-4 mb-6"><ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> Private & secure — never shared.</div>
                <div className="flex flex-col gap-3">
                  <MagneticButton text="Analyse My Body →" onClick={handleNext} />
                  <button onClick={handleNext} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Use demo (skip for now)</button>
                </div>
              </div>
            )}

            {currentStep.type === 'upload-goal' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {currentStep.options.map((opt, i) => (
                    <button key={i} onClick={() => setFormData(prev => ({ ...prev, goal: opt.label }))} className={`flex flex-col items-center p-4 border rounded-xl ${formData.goal === opt.label ? 'border-[#ff5a1f] bg-[#ff5a1f]/10 text-[#ff5a1f]' : 'border-gray-800 bg-[#0a0a0a] text-gray-400'}`}>
                      <opt.icon className="w-6 h-6 mb-2" /><span className="text-[11px] font-bold uppercase">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-500 mb-2">— OR —</div>
                <button className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#ff5a1f]/50 bg-[#ff5a1f]/5 rounded-2xl hover:border-[#ff5a1f] transition-colors mb-8">
                  <Upload className="w-6 h-6 text-[#ff5a1f] mb-2" /><span className="text-sm font-semibold text-white">Upload Goal Photo</span>
                  <span className="text-xs text-gray-400 mt-1">Favourite athlete or influencer</span>
                </button>
                <MagneticButton text="Compare to My Body →" onClick={handleNext} />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssessmentFlow;