import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, X, Lock, Sparkles, Zap } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

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
// MAIN COMPONENT
// ==========================================
// ==========================================
// MAIN COMPONENT
// ==========================================
const PaywallModal = ({ isOpen, onClose, onCheckout }) => {
  // Timer State for the Upgraded section
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 47);

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
            {/* Minimal Close Button */}
            <button 
              onClick={onClose}
              className="fixed top-5 right-5 p-2 bg-white/5 hover:bg-white/15 rounded-full transition-colors border border-white/5 z-50 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[420px] flex flex-col items-center mt-2 mb-12" // Reduced padding bottom since the button is no longer sticky
            >
              
              {/* ==========================================
                  SECTION 1: THE CORE PAYWALL 
                  ========================================== */}
              <div className="flex flex-col items-center text-center w-full mb-12">
                <div className="bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] px-3.5 py-1 rounded-full text-[8.5px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5 mb-4 shadow-[0_0_15px_rgba(231,27,37,0.1)]">
                  <Sparkles className="w-2.5 h-2.5 fill-[#E71B25]" /> Analysis Complete
                </div>

                <h1 className="text-[22px] md:text-[24px] font-black text-white leading-[1.2] tracking-tight mb-3 drop-shadow-md">
                  BodyMax Analyzed Your <br />Dream Physique
                </h1>
                
                <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed mb-8 px-2 font-medium text-balance opacity-80">
                  Stop guessing in the gym. Discover exactly what's holding you back and reach your goals fast.
                </p>

                <div className="w-full bg-[#0D0D0D] rounded-[1.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/[0.06] flex flex-col text-left">
                  {/* Split Image */}
                  <div className="w-full flex h-[240px] relative border-b border-white/[0.05]">
                    <div className="flex-1 relative bg-[#1A0B0B]">
                      <img src="/Today.png" alt="Present" className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-10" />
                      <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center"><span className="text-white font-bold text-[11px] tracking-wide">Before</span></div>
                    </div>
                    <div className="flex-1 relative bg-[#0B1A0E]">
                      <img src="/Future.png" alt="Future" className="absolute inset-0 w-full h-full object-cover object-center" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-10" />
                      <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center"><span className="text-white font-bold text-[11px] tracking-wide">After</span></div>
                    </div>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 z-20" />
                  </div>

                  {/* Offer Details */}
                  <div className="p-6 bg-[#111111]">
                    <h3 className="text-white font-bold text-[16px] mb-5 text-center tracking-tight opacity-90">Try BodyMax for 7 days</h3>
                    
                    <div className="flex flex-col gap-3 mb-6">
                      {[ "Full-Body Score & Detailed Report", "Custom 12-Week AI-Guided Protocol", "Unlock your personalized plan", "Crush your goals fast" ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check className="w-[16px] h-[16px] text-[#4ade80] shrink-0 mt-[1px]" strokeWidth={3} />
                          <span className="text-gray-300 text-[12px] font-medium leading-snug tracking-wide">{text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="w-full border border-[#4ade80]/30 bg-[#4ade80]/[0.02] rounded-xl p-3.5 mb-6 flex flex-col gap-0.5">
                      <p className="text-gray-400 text-[12px] font-medium">Promo code <span className="text-[#4ade80] font-bold">MAXXING-95</span> applied</p>
                      <p className="text-[#4ade80] font-black text-[13px] uppercase tracking-wider">You save -95%</p>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <span className="text-white font-bold text-[14px]">Total today:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-600 line-through text-[12px] font-bold mb-[1px]">$19.99</span>
                        <span className="text-white font-black text-[28px] leading-none tracking-tighter">$0.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  SECTION 2: UPGRADED BODY COMPARISON
                  ========================================== */}
              <div className="w-full flex flex-col items-center text-center mb-12">
                <h2 className="text-white text-[26px] font-bold tracking-tight leading-[1.1] mb-3">Your Body, Upgraded.</h2>
                <p className="text-gray-400 text-[13px] font-normal leading-relaxed px-2 mb-6">See how small improvements and following a clear, proven plan add up to a massive transformation.</p>

                <div className="bg-[#8A53C6] w-full py-2.5 rounded-xl shadow-[0_4px_20px_rgba(138,83,198,0.2)] flex justify-center items-center gap-2 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-white text-[11px] font-semibold uppercase tracking-widest">
                    Discount Reserved For {formattedTime}
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
                  SECTION 3: TRUST & COMMUNITY
                  ========================================== */}
              <div className="w-full flex flex-col gap-4 mb-8">
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

                <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 w-full">
                  <h2 className="text-[15px] font-bold text-white mb-1.5">Your information is safe</h2>
                  <p className="text-[11px] text-gray-400 mb-4">We will not sell your personal info.</p>
                  <div className="text-[12px] text-white font-bold flex items-center gap-1.5 pt-3 border-t border-white/5">
                    <span>Need help? Contact us</span><a href="#" className="text-[#3b82f6] hover:underline">here</a>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  CHECKOUT BUTTON (Now properly stacked at the bottom)
                  ========================================== */}
              <div className="w-full flex flex-col items-center">
                <motion.button 
                  whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full max-w-[420px] bg-[#E71B25] hover:bg-[#d41820] text-white py-4 rounded-2xl font-black text-[15px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(231,27,37,0.3)] border border-[#ff4747]/20"
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
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;