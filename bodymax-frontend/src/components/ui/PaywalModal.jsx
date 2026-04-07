import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, X, Lock, Sparkles, Zap, Target, Timer, Star, User } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
// WHOP KA OFFICIAL PACKAGE
import { WhopCheckoutEmbed } from "@whop/checkout/react";

// ==========================================
// MAP CONFIGURATION
// ==========================================
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
const markers = [
  { coordinates: [-122.4194, 37.7749], color: "#3b82f6" },
  { coordinates: [-74.006, 40.7128], color: "#f59e0b" },
  { coordinates: [-0.1278, 51.5074], color: "#ef4444" },
  { coordinates: [139.6917, 35.6895], color: "#3b82f6" },
  { coordinates: [151.2093, -33.8688], color: "#f59e0b" },
  { coordinates: [-46.6333, -23.5505], color: "#ef4444" },
  { coordinates: [18.4232, -33.9249], color: "#3b82f6" },
  { coordinates: [72.8777, 19.076], color: "#f59e0b" },
  { coordinates: [2.3522, 48.8566], color: "#3b82f6" },
  { coordinates: [13.4050, 52.5200], color: "#f59e0b" },
];

const CommunityMap = () => (
  <div className="w-full aspect-[2/1] flex items-center justify-center bg-[#1c1c1e]/40 rounded-xl pointer-events-none overflow-hidden">
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 110, center: [0, 20] }}
      width={800} height={400} style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) => geographies.map((geo) => (
          <Geography
            key={geo.rsmKey} geography={geo} fill="#2C2C2E" stroke="#1c1c1e" strokeWidth={0.5}
            style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
          />
        ))}
      </Geographies>
      {markers.map(({ coordinates, color }, i) => (
        <Marker key={i} coordinates={coordinates}>
          <circle r={6} fill={color} opacity={0.3} className="animate-ping" />
          <circle r={3} fill={color} />
        </Marker>
      ))}
    </ComposableMap>
  </div>
);

const GuaranteeSeal = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#D4AF37" />
    <circle cx="50" cy="50" r="40" fill="#FFF" fillOpacity="0.1" />
    <circle cx="50" cy="50" r="44" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
    <text x="50" y="33" textAnchor="middle" fill="#5F4A14" fontSize="10" fontWeight="bold">MONEY BACK</text>
    <text x="50" y="60" textAnchor="middle" fill="#5F4A14" fontSize="28" fontWeight="black">30</text>
    <text x="50" y="73" textAnchor="middle" fill="#5F4A14" fontSize="11" fontWeight="bold">DAYS</text>
    <text x="50" y="85" textAnchor="middle" fill="#5F4A14" fontSize="8" fontWeight="bold" letterSpacing="1.5">GUARANTEE</text>
  </svg>
);

// --- MODIFIED STAT BLOCK FOR PAYWALL BLUR EFFECT ---
const BlurredScanStatBlock = ({ label, value, delta, isNegative, progress }) => (
  <div className="flex flex-col mb-6">
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="text-[10px] md:text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">{label}</span>
      <div className="w-3.5 h-3.5 rounded-full border border-[#3f3f46] flex items-center justify-center text-[7px] text-[#a1a1aa]">?</div>
    </div>
    <div className="flex items-baseline gap-1.5 mb-2 filter blur-[6px] select-none opacity-80">
      <span className={`text-[30px] md:text-[36px] font-bold leading-none ${isNegative ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>{value}</span>
      <span className={`text-[12px] md:text-[14px] font-bold ${isNegative ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
        {isNegative ? '' : '+'}{delta}
      </span>
    </div>
    <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden filter blur-[2px]">
      <div className={`h-full rounded-full ${isNegative ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

// ==========================================
// PIXEL-PERFECT PRICING DATA 
// ==========================================
const pricingPlans = [
  {
    id: '1-week',
    title: 'Kickstart Plan',
    subtitle: 'Test the system, see results fast',
    duration: '1 week',
    oldTotal: '$13.98',
    newTotal: '$6.99',
    oldDaily: '$2.00',
    newDaily: '$0.99',
    planId: 'plan_Ria8do63uXIu3',
    badge: null
  },
  {
    id: '4-weeks',
    title: 'Momentum Plan',
    subtitle: 'Build consistency, feel the change',
    duration: '4 weeks',
    oldTotal: '$59.98',
    newTotal: '$29.99',
    oldDaily: '$2.14',
    newDaily: '$1.07',
    planId: 'plan_IKQC0xVZiDswT',
    badge: { text: 'MOST POPULAR', style: 'bg-[#E71B25] text-white left-0 -top-3.5 rounded-lg rounded-bl-none px-3 py-1' }
  },
  {
    id: '12-weeks',
    title: 'Transformation Plan',
    subtitle: 'Complete body transformation — best results',
    duration: '12 weeks',
    oldTotal: '$89.98',
    newTotal: '$44.99',
    oldDaily: '',
    newDaily: '$0.53',
    planId: 'plan_kflTr1LhnYkps',
    badge: { text: 'BEST VALUE', style: 'bg-gradient-to-r from-[#FCE18D] to-[#F1C40F] text-black right-4 md:right-6 -top-3.5 rounded-md px-3 py-1 shadow-[0_0_10px_rgba(241,196,15,0.4)]' }
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const PaywallModal = ({ isOpen, onClose ,onSuccess,onCheckout}) => {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 47);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanClick = (planId) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true); 
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style dangerouslySetInnerHTML={{
            __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          {/* URGENCY BAR */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000] bg-gradient-to-b from-[#E71B25] to-[#9e0f16] border-y border-l border-white/20 px-2 py-4 rounded-l-xl shadow-[0_0_25px_rgba(231,27,37,0.5)] flex flex-col items-center pointer-events-none"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse mb-3" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 mb-3 drop-shadow-md">
              50% OFF ENDS IN
            </span>
            <span className="text-[12px] font-mono font-black text-yellow-300 border-t border-white/20 pt-3 [writing-mode:vertical-rl] rotate-180">
              {formattedTime}
            </span>
          </motion.div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 p-2 bg-[#050505]/50 backdrop-blur-md hover:bg-white/15 rounded-full transition-colors border border-white/10 z-[1000] text-gray-400 hover:text-white shadow-lg"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>


          {/* ==========================================
              SCROLLING MAIN CONTENT
              ========================================== */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex items-start justify-center bg-[#050505]/95 backdrop-blur-xl overflow-y-auto hide-scrollbar px-4 py-8 md:py-12"
          >
            
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[440px] flex flex-col items-center mt-2 mb-12"
            >

              {/* ==========================================
                  SECTION 1: TOP HOOK & OFFER
                  ========================================== */}
              <div className="w-full flex flex-col items-center mb-10 px-1">
                
                <div className="bg-[#f05c4a] text-white text-[10px] md:text-[11px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full mb-6">
                  BodyMax Analysis Complete
                </div>

                <h1 className="text-[24px] md:text-[28px] font-black text-white text-center leading-[1.1] tracking-tight mb-4 px-2">
                  BodyMax Analyzed Your Body, Your Dream Physique & Built a Personalized Plan Just for You
                </h1>
                <p className="text-[12px] md:text-[14px] text-[#a1a1aa] text-center leading-relaxed mb-6 px-3 font-medium">
                  Stop guessing in the gym. See your body score & report, discover exactly what's holding your body back, and how to reach your dream physique fast.
                </p>

                <div className="w-full flex rounded-[1.5rem] overflow-hidden mb-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] h-[320px] md:h-[380px]">
                  <div className="flex-1 relative bg-gradient-to-b from-[#6b1e25] to-[#3d1015] border-r border-black/50">
                    <img src="/Today3.png" alt="Before" className="absolute inset-0 w-full h-full object-cover object-top opacity-90 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                    <span className="absolute bottom-4 left-0 w-full text-center text-white text-[13px] md:text-[14px] font-semibold tracking-wide z-10">Before BodyMax</span>
                  </div>
                  
                  <div className="flex-1 relative bg-gradient-to-b from-[#2e7d32] to-[#1b5e20]">
                    <img src="/Future1.png" alt="After" className="absolute inset-0 w-full h-full object-cover object-top opacity-90 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                    <span className="absolute bottom-4 left-0 w-full text-center text-white text-[13px] md:text-[14px] font-semibold tracking-wide z-10">After BodyMax</span>
                  </div>
                </div>

                <div className="w-full bg-[#111] border border-white/5 rounded-[1.5rem] p-6 md:p-7 flex flex-col items-center shadow-lg">
                  <h2 className="text-[20px] md:text-[22px] font-black text-white mb-5 tracking-tight">Start Your Journey Today</h2>
                  
                  <div className="w-full flex flex-col gap-3.5 mb-2">
                    {[
                      "Get your complete Full-Body Score & detailed report.",
                      "Discover exactly what's holding you back.",
                      "Unlock your personalized BodyMax plan made just for YOU.",
                      "Crush your goals and finally achieve your dream physique."
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" strokeWidth={3.5} />
                        <span className="text-[#a1a1aa] text-[13px] md:text-[14px] leading-snug font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* ==========================================
                  NEW: BLURRED CURIOSITY WIDGET
                  ========================================== */}
              <div className="w-full relative mb-12 rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-2xl pt-6">
                
                {/* Top Highlight Stats (Blurred Values) */}
                <div className="w-full flex justify-between px-2 md:px-6 mb-8 border-b border-white/[0.05] pb-6 max-w-2xl">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1 text-center">Body Fat</span>
                    <span className="text-[18px] md:text-[24px] font-black text-white leading-tight filter blur-[6px] select-none opacity-80">22%</span>
                  </div>
                  <div className="w-px bg-white/[0.05] mx-1 md:mx-2"></div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1 text-center">Dream Body</span>
                    <span className="text-[18px] md:text-[24px] font-black text-green-400 leading-tight filter blur-[6px] select-none opacity-80">89%</span>
                  </div>
                  <div className="w-px bg-white/[0.05] mx-1 md:mx-2"></div>
                  <div className="flex flex-col items-center flex-1 w-full max-w-[120px] md:max-w-[150px]">
                    <span className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1 text-center">Best Trait</span>
                    <span className="text-[14px] md:text-[18px] font-black text-blue-400 text-center leading-[1.1] md:leading-tight break-words line-clamp-2 filter blur-[6px] select-none opacity-80">
                      Shoulders
                    </span>
                  </div>
                </div>

                {/* Detailed Muscle Stats Grid (Using Blurred Component) */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4 mb-6 max-w-2xl">
                  <BlurredScanStatBlock label="OVERALL RATING" value={72} delta="INIT" progress={72} isNegative={false} />
                  <BlurredScanStatBlock label="POTENTIAL RATING" value={95} delta="MAX" progress={95} isNegative={false} />
                  <BlurredScanStatBlock label="CHEST" value={54} delta="2.8" progress={54} isNegative={true} />
                  <BlurredScanStatBlock label="SHOULDERS" value={81} delta="1.5" progress={81} isNegative={false} />
                  <BlurredScanStatBlock label="BACK" value={68} delta="2.0" progress={68} isNegative={false} />
                  <BlurredScanStatBlock label="ABS & CORE" value={48} delta="3.2" progress={48} isNegative={true} />
                  <BlurredScanStatBlock label="LEGS" value={70} delta="1.8" progress={70} isNegative={false} />
                  <BlurredScanStatBlock label="ARMS" value={75} delta="2.1" progress={75} isNegative={false} />
                </div>
              </div>


              {/* ==========================================
                  SECTION 2: PRICING CARDS & WHOP CHECKOUT
                  ========================================== */}
              <div className="flex flex-col items-center text-center w-full mb-12">
                <h2 className="text-[20px] md:text-[24px] font-bold text-white leading-[1.1] tracking-tight mb-6">
                  Select Your Plan to Continue
                </h2>

                <div className="w-full flex flex-col gap-5">
                  {pricingPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanClick(plan.id)}
                        className={`relative w-full rounded-2xl cursor-pointer transition-all duration-200 border-[1.5px] overflow-visible flex h-[105px] md:h-[115px] ${isSelected
                            ? 'border-[#E71B25] bg-[#120a09] shadow-[0_0_20px_rgba(231,27,37,0.15)]'
                            : 'border-[#2C2C2E] bg-[#161618] hover:border-[#3C3C3E]'
                          }`}
                      >
                        {plan.badge && (
                          <div className={`absolute text-[10px] font-bold tracking-wider z-30 ${plan.badge.style}`}>
                            {plan.badge.text}
                          </div>
                        )}

                        <div className="flex flex-1 items-center pl-4 pr-1 py-3 h-full z-20">
                          <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 mr-3 md:mr-4 transition-colors ${isSelected ? 'border-[#E71B25]' : 'border-[#4A4A4C]'}`}>
                            {isSelected && <div className="w-3 h-3 bg-[#E71B25] rounded-full" />}
                          </div>

                          <div className="flex flex-col justify-center h-full pt-1">
                            <h3 className="text-white font-bold text-[16px] md:text-[18px] leading-none mb-1.5 text-left">{plan.title}</h3>
                            <p className="text-[#98989A] text-[11px] md:text-[12px] leading-tight pr-2 mb-auto text-left">{plan.subtitle}</p>

                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-white text-[12px] md:text-[13px] font-medium">{plan.duration}</span>
                              <span className="text-[#98989A] text-[12px] md:text-[13px] line-through decoration-[#98989A]">{plan.oldTotal}</span>
                              <span className="text-white text-[12px] md:text-[13px] font-medium">→ {plan.newTotal}</span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute right-[4px] top-[4px] bottom-[4px] w-[110px] md:w-[130px] overflow-hidden rounded-[0.8rem] z-10 pointer-events-none">
                          <div
                            className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-[#E71B25]' : 'bg-[#222224]'}`}
                            style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)' }}
                          />
                          <div className="relative z-20 flex flex-col items-center justify-center h-full w-full pl-4 md:pl-5">
                            {plan.oldDaily && (
                              <span className={`text-[11px] md:text-[12px] line-through decoration-current mb-0.5 ${isSelected ? 'text-white/80' : 'text-[#98989A]'}`}>
                                {plan.oldDaily}
                              </span>
                            )}
                            <span className={`font-bold text-[24px] md:text-[28px] leading-none tracking-tight mb-0.5 ${isSelected ? 'text-white drop-shadow-sm' : 'text-white'}`}>
                              {plan.newDaily}
                            </span>
                            <span className={`text-[10px] md:text-[11px] ${isSelected ? 'text-white/90' : 'text-[#98989A]'}`}>
                              per day
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SMART CHECKOUT ACTION & WHOP EMBED SDK */}
              <div className="w-full flex flex-col items-center mb-12">

                {!isCheckoutOpen && !selectedPlan && (
                  <div className="w-full max-w-[420px] bg-[#1c1c1e] text-gray-400 py-4 rounded-2xl font-bold text-[15px] uppercase tracking-widest flex items-center justify-center border border-white/5 opacity-70">
                    Select a Plan Above
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {isCheckoutOpen && selectedPlan && (
                    <motion.div
                      key="embed-form"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full max-w-[420px] rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_rgba(231,27,37,0.3)] border border-white/10"
                    >
                      <WhopCheckoutEmbed
                        key={selectedPlan}
                        planId={pricingPlans.find(plan => plan.id === selectedPlan)?.planId}
                        theme="dark"
                        hidePrice={false}
                        onComplete={() => {
                          console.log("Payment 100% Successful for:", selectedPlan);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-1.5 text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
                </div>

                {/* 🛠 DEVELOPER HACK: BYPASS PAYMENT FOR TESTING */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const rawPlan = selectedPlan || "12-weeks";
                    let formattedPlan = "12-Week";
                    if (rawPlan === '1-week') formattedPlan = "1-Week";
                    if (rawPlan === '4-weeks') formattedPlan = "4-Week";
                    
                    console.log("Developer Bypass Triggered. Sending Plan:", formattedPlan);

                    if (onCheckout) {
                      onCheckout(formattedPlan);
                    } else if (onSuccess) {
                      onSuccess(formattedPlan);
                    }
                  }}
                  className="mt-6 text-[10px] text-gray-500 uppercase tracking-[0.2em] border-b border-transparent hover:text-white hover:border-white transition-all z-50 cursor-pointer relative"
                >
                  🛠 Dev: Bypass Payment & Proceed
                </button>
              </div>

              {/* ==========================================
                  SECTION 3: UPGRADED BODY COMPARISON
                  ========================================== */}
              <div className="w-full flex flex-col items-center text-center mb-12">
                <h2 className="text-white text-[26px] font-bold tracking-tight leading-[1.1] mb-3">Your Body, Upgraded.</h2>
                <p className="text-gray-400 text-[13px] font-normal leading-relaxed px-2 mb-6">See how small improvements and following a clear, proven plan add up to a massive transformation.</p>

                

                <div className="w-full h-[540px] rounded-[1.5rem] overflow-hidden flex shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black relative">
                  <div className="flex-1 relative flex flex-col">
                    <img src="/Today3.png" alt="Before" className="absolute inset-0 w-full h-full object-cover object-bottom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent z-10" />
                    <div className="relative z-20 pt-5 px-2 flex flex-col items-center w-full">
                      <h3 className="text-white font-semibold text-[14px] mb-3 uppercase drop-shadow-md">Before</h3>
                      <div className="flex flex-col gap-1.5 w-full">
                        {["1 year... no progress", "Guessing... don't know what to do", "Feeling invisible", "No one looks twice"].map((text, i) => (
                          <div key={i} className="bg-black/60 backdrop-blur-md rounded-md py-1.5 px-1.5 flex items-center gap-1.5">
                            <X className="w-3 h-3 text-[#E71B25] shrink-0" strokeWidth={2.5} />
                            <span className="text-gray-200 text-[9px] font-normal leading-tight">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/80 z-30" />
                  <div className="flex-1 relative flex flex-col">
                    <img src="/Future1.png" alt="After" className="absolute inset-0 w-full h-full object-cover object-bottom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent z-10" />
                    <div className="relative z-20 pt-5 px-2 flex flex-col items-center w-full">
                      <h3 className="text-white font-semibold text-[14px] mb-3 flex items-center gap-1 uppercase drop-shadow-md">
                        After <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      </h3>
                      <div className="flex flex-col gap-1.5 w-full">
                        {["12 weeks -> visible results", "Exact, proven plan", "Jacked, defined...", "Dream body achieved"].map((text, i) => (
                          <div key={i} className="bg-black/60 backdrop-blur-md rounded-md py-1.5 px-1.5 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#4CA75B] shrink-0" strokeWidth={3} />
                            <span className="text-white text-[9px] font-medium leading-tight">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


             {/* ==========================================
                  NEW SECTION 3.5: SUCCESS STORY (SINGLE IMAGE)
                  ========================================== */}
              <div className="w-full mb-12 flex flex-col items-center">
                
                {/* Nayi Heading */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-wide">
                    A 5 Star Review About BodyMax
                  </h2>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>

                <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl shadow-2xl relative overflow-hidden group flex flex-col w-full">
                  
                  {/* Decorative background glow */}
                  <div className="absolute top-1/2 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                  {/* Single Premium Image */}
                  <div className="w-full aspect-[4/3] md:aspect-[16/10] relative overflow-hidden bg-black border-b border-white/[0.05]">
                    <img src="/R1.jpg" alt="Success Story" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    
                    {/* Dark gradient from bottom so text is readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
                       <Check className="w-3 h-3 text-[#4CA75B]" strokeWidth={3} />
                       <span className="text-white text-[9px] font-bold uppercase tracking-widest mt-[1px]">Verified Result</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-6 md:p-8 relative z-10 bg-[#0a0a0a]">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-black text-[18px] md:text-[22px] tracking-tight mb-3 leading-snug drop-shadow-md">
                      BodyMax completely rewired my approach to fitness.
                    </h3>

                    {/* Review Text */}
                    <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed font-medium mb-6 drop-shadow-sm">
                      I used to struggle with consistency and felt completely stuck. The AI gave me a clear, step-by-step neural roadmap that actually worked for my genetics. The results speak for themselves—I've never felt stronger, leaner, or more confident.
                    </p>
                    
                    {/* User Info & Line (NAME REMOVED, CHANGED TO ATHLETE) */}
                    <div className="flex items-center justify-between border-t border-white/[0.05] pt-5 mt-auto">
                       <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                           <User className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[13px] font-bold text-white tracking-wide leading-none mb-1">BodyMax Athlete</span>
                           <span className="text-[9px] text-[#4CA75B] font-bold uppercase tracking-widest leading-none">Verified</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="block text-[14px] font-black text-white leading-none mb-1">-14 lbs</span>
                         <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Body Fat Dropped</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  SECTION 4: TRUST & COMMUNITY
                  ========================================== */}
              <div className="w-full flex flex-col gap-4 mb-4">
                <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 w-full text-center">
                  <h1 className="text-[16px] font-bold text-white mb-4 leading-tight">Join the #1 Community for Levelling Up</h1>
                  <CommunityMap />
                </div>

                <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 w-full">
                  <h2 className="text-[15px] font-bold text-white mb-2">100% Money-Back Guarantee</h2>
                  <p className="text-[11px] text-gray-300 mb-4 leading-relaxed font-medium">
                    We guarantee you'll see visible results, or you'll receive a full refund within 30 days. You will need to demonstrate that you have followed the program.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <p className="text-gray-400 text-[10px] pr-4">Find more about limitations in our policy.</p>
                    <GuaranteeSeal />
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;