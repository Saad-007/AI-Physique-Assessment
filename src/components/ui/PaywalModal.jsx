import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, X, Lock, Sparkles, Zap } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
// WHOP OFFICIAL PACKAGE IMPORT KAREIN
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

// ==========================================
// PIXEL-PERFECT PRICING DATA WITH REAL IDs
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
    // WAQAS SE ASAL PLAN ID (plan_xxxx) MANG KAR YAHAN DALAIN:
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
    // WAQAS SE ASAL PLAN ID (plan_xxxx) MANG KAR YAHAN DALAIN:
    planId: 'plan_IKQC0xVZiDswT', 
    badge: { text: 'MOST POPULAR', style: 'bg-[#FF4A2B] text-white left-0 -top-3.5 rounded-lg rounded-bl-none px-3 py-1' }
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
    // WAQAS SE ASAL PLAN ID (plan_xxxx) MANG KAR YAHAN DALAIN:
    planId: 'plan_kflTr1LhnYkps', 
    badge: { text: 'BEST VALUE', style: 'bg-gradient-to-r from-[#FCE18D] to-[#F1C40F] text-black right-4 md:right-6 -top-3.5 rounded-md px-3 py-1 shadow-[0_0_10px_rgba(241,196,15,0.4)]' }
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const PaywallModal = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 47);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // EMBED STATE
  const [selectedPlan, setSelectedPlan] = useState('12-weeks'); 

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex items-start justify-center bg-[#050505]/95 backdrop-blur-xl overflow-y-auto hide-scrollbar px-4 py-8 md:py-12"
          >
            <button 
              onClick={onClose}
              className="fixed top-5 right-5 p-2 bg-white/5 hover:bg-white/15 rounded-full transition-colors border border-white/5 z-50 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[440px] flex flex-col items-center mt-2 mb-12"
            >
              
              {/* ==========================================
                  SECTION 1: ARROW-SHAPED PRICING CARDS
                  ========================================== */}
              <div className="flex flex-col items-center text-center w-full mb-6">
                <h1 className="text-[28px] md:text-[34px] font-bold text-white leading-[1.1] tracking-tight mb-8 drop-shadow-md">
                  Get Started with <br />Special Pricing
                </h1>
                
                <div className="w-full flex flex-col gap-5">
                  {pricingPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative w-full rounded-2xl cursor-pointer transition-all duration-200 border-[1.5px] overflow-visible flex h-[105px] md:h-[115px] ${
                          isSelected 
                            ? 'border-[#FF4A2B] bg-[#120a09] shadow-[0_0_20px_rgba(255,74,43,0.15)]' 
                            : 'border-[#2C2C2E] bg-[#161618] hover:border-[#3C3C3E]'
                        }`}
                      >
                        {/* FLOATING BADGE */}
                        {plan.badge && (
                          <div className={`absolute text-[10px] font-bold tracking-wider z-30 ${plan.badge.style}`}>
                            {plan.badge.text}
                          </div>
                        )}

                        {/* LEFT CONTENT */}
                        <div className="flex flex-1 items-center pl-4 pr-1 py-3 h-full z-20">
                          <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 mr-3 md:mr-4 transition-colors ${isSelected ? 'border-[#FF4A2B]' : 'border-[#4A4A4C]'}`}>
                            {isSelected && <div className="w-3 h-3 bg-[#FF4A2B] rounded-full" />}
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

                        {/* RIGHT PANEL */}
                        <div className="absolute right-[4px] top-[4px] bottom-[4px] w-[110px] md:w-[130px] overflow-hidden rounded-[0.8rem] z-10 pointer-events-none">
                          <div 
                            className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-[#FF4A2B]' : 'bg-[#222224]'}`}
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

              {/* ==========================================
                  CHECKOUT ACTION & WHOP OFFICIAL EMBED SDK
                  ========================================== */}
              <div className="w-full flex flex-col items-center mb-12">
                {!isCheckoutOpen ? (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCheckoutOpen(true)} // Button click pe embed form khulega
                      className="w-full max-w-[420px] bg-[#FF4A2B] hover:bg-[#ff3333] text-white py-4 rounded-2xl font-bold text-[15px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,74,43,0.3)] border border-[#FF4A2B]/20"
                    >
                      <div className="relative flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" strokeWidth={2} />
                        <div className="absolute left-[3px] top-[4px] w-[5px] h-[3px] bg-[#FFD700] rounded-[1px] opacity-70" />
                      </div>
                      Proceed to Checkout
                    </motion.button>
                    
                    <div className="mt-4 flex items-center gap-1.5 text-gray-500">
                      <Lock className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
                    </div>
                  </>
                ) : (
                  /* --- WHOP OFFICIAL REACT EMBED --- */
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="w-full max-w-[420px] rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_rgba(231,27,37,0.3)] border border-white/10"
                  >
                    <WhopCheckoutEmbed 
                      planId={pricingPlans.find(plan => plan.id === selectedPlan)?.planId} 
                      theme="dark" 
                      hidePrice={false} 
                      onComplete={() => {
                        console.log("Payment 100% Successful for:", selectedPlan);
                        // Redirect logic here...
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* ==========================================
                  SECTION 3: UPGRADED BODY COMPARISON
                  ========================================== */}
              <div className="w-full flex flex-col items-center text-center mb-12">
                <h2 className="text-white text-[26px] font-bold tracking-tight leading-[1.1] mb-3">Your Body, Upgraded.</h2>
                <p className="text-gray-400 text-[13px] font-normal leading-relaxed px-2 mb-6">See how small improvements and following a clear, proven plan add up to a massive transformation.</p>

                <div className="bg-[#8A53C6] w-full py-2.5 rounded-xl shadow-[0_4px_20px_rgba(138,83,198,0.2)] flex justify-center items-center gap-2 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-white text-[11px] font-semibold uppercase tracking-widest">
                    Discount Reserved For 7:47
                    {/* {formattedTime} */}
                  </span>
                </div>

                <div className="w-full h-[540px] rounded-[1.5rem] overflow-hidden flex shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black relative">
                  <div className="flex-1 relative flex flex-col">
                    <img src="/Today3.png" alt="Before" className="absolute inset-0 w-full h-full object-cover object-bottom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent z-10" />
                    <div className="relative z-20 pt-5 px-2 flex flex-col items-center w-full">
                      <h3 className="text-white font-semibold text-[14px] mb-3 uppercase drop-shadow-md">Before</h3>
                      <div className="flex flex-col gap-1.5 w-full">
                        {[ "1 year... no progress", "Guessing... don't know what to do", "Feeling invisible", "No one looks twice" ].map((text, i) => (
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
                        {[ "12 weeks -> visible results", "Exact, proven plan", "Jacked, defined...", "Dream body achieved" ].map((text, i) => (
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