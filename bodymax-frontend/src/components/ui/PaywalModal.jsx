import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, X, Lock, Sparkles, Zap, Target, Timer, Star, User, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
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
// REUSABLE PRICING & CHECKOUT WIDGET
// ==========================================
const PricingWidget = ({ id, onCheckout, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePlanClick = (planId) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true); 
  };

  return (
    <div id={id} className="flex flex-col items-center text-center w-full mb-12 mt-12 scroll-mt-24">
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
              className={`relative w-full rounded-2xl cursor-pointer transition-all duration-200 border-[1.5px] overflow-visible flex h-[105px] md:h-[115px] ${
                isSelected
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

      <div className="w-full flex flex-col items-center mt-6">
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
              className="w-full max-w-[420px] rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_rgba(231,27,37,0.3)] border border-white/10 mt-6"
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
    </div>
  );
};


// ==========================================
// SWIPEABLE REVIEW CAROUSEL COMPONENT
// ==========================================
const reviewsData = [
  {
    id: 1,
    image: "/R1.jpg",
    title: "BodyMax completely rewired my approach to fitness.",
    text: "I used to struggle with consistency and felt completely stuck. The AI gave me a clear, step-by-step neural roadmap that actually worked for my genetics. The results speak for themselves—I've never felt stronger.",
    loss: "-14 lbs",
    statLabel: "Body Fat Dropped"
  },
  {
    id: 2,
    image: "/review2.jpg",
    title: "I finally see my abs after years of trying.",
    text: "I was doing the wrong workouts for my body type. The custom meal plan and targeted exercises changed everything. In just 8 weeks, the stubborn belly fat is gone and I'm adding solid muscle.",
    loss: "+8 lbs",
    statLabel: "Lean Muscle Gained"
  },
  {
    id: 3,
    image: "/review4.jpg",
    title: "No more guessing when I walk into the gym.",
    text: "The absolute best part is the clarity. I know exactly what to lift, how many reps, and what to eat. Taking the thinking out of it allowed me to just execute. Worth every single penny.",
    loss: "-10%",
    statLabel: "Body Fat %"
  }
];

const ReviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) handleNext();
    else if (info.offset.x > swipeThreshold) handlePrev();
  };

  return (
    <div className="w-full mb-12 flex flex-col items-center overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <h2 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-wide">
          Real BodyMax Results
        </h2>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      </div>

      <div className="relative w-full max-w-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="bg-[#0a0a0a] border border-white/[0.04] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col w-full cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <div className="absolute top-1/2 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Image Section */}
            <div className="w-full aspect-[4/3] md:aspect-[16/10] relative overflow-hidden bg-black border-b border-white/[0.05] pointer-events-none">
              <img src={reviewsData[currentIndex].image} alt="Success Story" className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
                <Check className="w-3 h-3 text-[#4CA75B]" strokeWidth={3} />
                <span className="text-white text-[9px] font-bold uppercase tracking-widest mt-[1px]">Verified Result</span>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6 md:p-8 relative z-10 bg-[#0a0a0a] pointer-events-none">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />)}
              </div>
              <h3 className="text-white font-black text-[18px] md:text-[20px] tracking-tight mb-3 leading-snug drop-shadow-md min-h-[55px]">
                {reviewsData[currentIndex].title}
              </h3>
              <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed font-medium mb-6 drop-shadow-sm min-h-[95px]">
                {reviewsData[currentIndex].text}
              </p>
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
                  <span className="block text-[14px] font-black text-white leading-none mb-1">{reviewsData[currentIndex].loss}</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">{reviewsData[currentIndex].statLabel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls & Dots */}
        <div className="flex items-center justify-between w-full mt-4 px-2">
          <button onClick={handlePrev} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {reviewsData.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-[#E71B25]' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
          <button onClick={handleNext} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center justify-center gap-1 animate-pulse">
             Swipe to see more <ChevronRight className="w-3 h-3 inline" />
          </span>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// MAIN COMPONENT
// ==========================================
const PaywallModal = ({ isOpen, onClose, onSuccess, onCheckout, formData }) => {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 47);

  const scrollToPricing = () => {
    // Scrolls specifically to the BOTTOM pricing section to ensure they see the rest of the page first
    document.getElementById('pricing-section-bottom')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const currentPhoto = formData?.photoPreviewUrls?.[1] || formData?.photos?.[1] || '/Today3.png'; 
  const goalPhoto = formData?.dreamPhysiquePreview || formData?.dreamPhysiqueImage || '/Future1.png';
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
                    <img src="/Today.png" alt="Before" className="absolute inset-0 w-full h-full object-cover object-top opacity-90 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                    <span className="absolute bottom-4 left-0 w-full text-center text-white text-[13px] md:text-[14px] font-semibold tracking-wide z-10">Before BodyMax</span>
                  </div>
                  
                  <div className="flex-1 relative bg-gradient-to-b from-[#2e7d32] to-[#1b5e20]">
                    <img src="/Future.png" alt="After" className="absolute inset-0 w-full h-full object-cover object-top opacity-90 mix-blend-luminosity" />
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
                  FIRST WIDGET INSTANCE (TOP)
                  ========================================== */}
              <PricingWidget id="pricing-section-top" onCheckout={onCheckout} onSuccess={onSuccess} />
                    
              {/* ==========================================
                  NEW: BLURRED CURIOSITY WIDGET
                  ========================================== */}
              <div className="w-full relative mb-12 rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-2xl pt-6 md:pt-8">
                
                {/* --- UPGRADED: UNBLURRED IMAGES SECTION --- */}
                <div className="w-full flex items-center justify-center mb-8 px-4 md:px-6 relative">
                  <div className="relative flex-1 aspect-[3/4] max-w-[160px] md:max-w-[180px] rounded-[1rem] md:rounded-[1.2rem] overflow-hidden border border-white/10 shadow-2xl group bg-[#1c1c1e]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10"></div>
                    <img src={currentPhoto || "/Today3.png"} alt="Current" className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-3 md:bottom-4 left-0 w-full flex flex-col items-center z-20">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-400 shadow-lg">Current</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center z-30 -mx-3 md:-mx-4 bg-[#0a0a0a] rounded-full p-2.5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.9)] relative mt-4">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)] animate-pulse" />
                  </div>

                  <div className="relative flex-1 aspect-[3/4] max-w-[160px] md:max-w-[180px] rounded-[1rem] md:rounded-[1.2rem] overflow-hidden border border-[#22c55e]/40 shadow-[0_0_30px_rgba(34,197,94,0.15)] group bg-[#1c1c1e]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10"></div>
                    <div className="absolute inset-0 bg-[#22c55e]/10 mix-blend-overlay z-10"></div>
                    <img src={goalPhoto || "/Future1.png"} alt="Goal" className="absolute inset-0 w-full h-full object-cover object-top z-0 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-3 md:bottom-4 left-0 w-full flex flex-col items-center z-20">
                      <span className="bg-[#22c55e]/20 backdrop-blur-md border border-[#22c55e]/30 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)]">Goal</span>
                    </div>
                  </div>
                </div>
                
                {/* --- AI PREDICTION BANNER --- */}
                <div className="w-full px-4 md:px-6 mb-8">
                  <div className="w-full bg-gradient-to-r from-[#22c55e]/15 to-transparent border border-[#22c55e]/20 rounded-2xl p-4 md:p-5 flex items-center gap-4 md:gap-5 shadow-[0_0_20px_rgba(34,197,94,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-full bg-[#22c55e]/10 blur-[20px]"></div>
                    <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm border border-[#22c55e]/30 rounded-xl px-4 py-3 shrink-0 shadow-inner relative z-10">
                      <span className="text-[9px] text-[#22c55e] font-bold uppercase tracking-widest mb-1">Probability</span>
                      <span className="text-[24px] md:text-[28px] font-black text-white leading-none tracking-tight drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]">HIGH</span>
                    </div>
                    <p className="text-[12px] md:text-[14px] text-gray-300 leading-relaxed font-medium relative z-10">
                      Chance you can achieve your dream physique in <span className="text-white font-bold border-b border-[#22c55e]/50 pb-[1px]">6 months</span> if you follow your personalized BodyMax plan.
                    </p>
                  </div>
                </div>

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
                    <span className="text-[14px] md:text-[18px] font-black text-blue-400 text-center leading-[1.1] md:leading-tight break-words line-clamp-2 filter blur-[6px] select-none opacity-80">Shoulders</span>
                  </div>
                </div>

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
                  UPGRADED VIRAL SECTION: GENETICS & LIMITERS
                  ========================================== */}
              <div className="w-full max-w-2xl px-4 mb-12 flex flex-col gap-6">

                {/* POSITIVES CARD */}
                <div className="relative bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] border border-white/10 rounded-[1.5rem] p-6 md:p-7 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-40"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#22c55e]/10 p-2.5 rounded-xl border border-[#22c55e]/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                      <Target className="w-5 h-5 text-[#22c55e]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[18px] md:text-[20px] tracking-tight leading-none mb-1">Genetic Advantages</h3>
                      <p className="text-gray-500 text-[10px] md:text-[11px] uppercase tracking-widest font-bold">What's Working For You</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 filter blur-[6px] opacity-70 select-none pointer-events-none pb-2">
                      {[
                        "Wide clavicle shoulder frame",
                        "Narrow waist structure",
                        "Strong lower body foundation",
                        "High V-taper aesthetic potential"
                      ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                          <Check className="w-4 h-4 text-[#22c55e] shrink-0 stroke-[3]" />
                          <span className="text-[13px] md:text-[14px] font-medium text-white/90">{text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-[1px]">Premium Insight</span>
                      </div>
                    </div>
                  </div>
                </div>

               {/* NEGATIVES & IMPACT CARD */}
                <div className="relative bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] border border-white/10 rounded-[1.5rem] p-6 md:p-7 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-40"></div>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="bg-[#ef4444]/10 p-2.5 rounded-xl border border-[#ef4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[18px] md:text-[20px] tracking-tight leading-none mb-1">Physique Limiters</h3>
                      <p className="text-gray-500 text-[10px] md:text-[11px] uppercase tracking-widest font-bold">What's Holding You Back</p>
                    </div>
                  </div>
                  
                  <div className="relative mt-2">
                    {/* Blurred Content Wrap */}
                    <div className="filter blur-[6px] opacity-70 select-none pointer-events-none pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                        {[
                          "Lack of upper chest mass",
                          "Subcutaneous fat hiding definition",
                          "Narrow lateral deltoid width",
                          "Arm volume lagging behind torso"
                        ].map((text, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                            <X className="w-4 h-4 text-[#ef4444] shrink-0 stroke-[3]" />
                            <span className="text-[13px] md:text-[14px] font-medium text-white/80">{text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gradient-to-r from-[#ef4444]/10 to-transparent border border-[#ef4444]/20 rounded-xl p-5 relative">
                        <div className="flex items-start gap-3.5">
                          <Zap className="w-5 h-5 text-[#ef4444] shrink-0 mt-1 fill-[#ef4444]" />
                          <div>
                            <div className="text-[10px] md:text-[11px] text-[#ef4444] font-bold uppercase tracking-widest mb-1.5">Critical AI Impact Analysis</div>
                            <div className="text-[15px] md:text-[17px] font-black text-white leading-snug mb-2">
                              Your chest development is limiting your aesthetic potential by <span className="text-[#ef4444]">27%</span>
                            </div>
                            <div className="text-[12px] md:text-[13px] text-gray-400 font-medium leading-relaxed">
                              Prioritize incline pressing & fly variations for maximum ROI to balance your physique.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dark Fade Overlay & Active Button */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent">
                      <button 
                        onClick={scrollToPricing}
                        className="mt-14 bg-[#E71B25] hover:bg-[#c2141d] text-white w-[90%] md:w-[80%] py-3.5 rounded-xl font-black text-[13px] md:text-[14px] uppercase tracking-wide shadow-[0_10px_30px_rgba(231,27,37,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-white/20"
                      >
                        <Lock className="w-4 h-4" strokeWidth={2.5} />
                        Unlock Full BodyMax Report
                      </button>
                    </div>
                  </div>

                  {/* --- NEW GOOD NEWS SECTION --- */}
                  <div className="mt-6 pt-6 border-t border-white/[0.05] relative z-30">
                    <h3 className="text-[#22c55e] text-[24px] md:text-[28px] font-black uppercase mb-2 leading-none tracking-wide">
                      GOOD NEWS:
                    </h3>
                    <p className="text-white/90 font-medium text-[14px] md:text-[16px] leading-relaxed">
                      by following <span className="text-[#22c55e]">bodymax hyper-personalized plan</span> you'll crush every obstacle in your way, & achieve your dream physique faster than you ever thought possible.
                    </p>
                  </div>
                  
                </div>
              </div>

              {/* ==========================================
                  NEW SECTION: PERSONALIZED PLAN PREVIEW (WITH LOCK)
                  ========================================== */}
              <div className="w-full max-w-2xl px-2 flex flex-col items-center mb-12">
                <h2 className="text-white text-[24px] md:text-[28px] font-black text-center leading-[1.2] mb-3">
                  We've Created<br />
                  A Personalized Plan For You To Achieve Your Dream Physique.
                </h2>
                <p className="text-[#a1a1aa] text-[13px] md:text-[14px] text-center mb-8 px-4 font-medium leading-relaxed">
                  Based on your question answers, your physique photo and your dream physique.
                </p>

                {/* --- ROUGH WORKOUT PLAN --- */}
                <div className="flex items-center justify-center w-full mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent to-[#E71B25]/60 w-1/4"></div>
                  <span className="text-[#a1a1aa] text-[13px] md:text-[15px] font-bold tracking-wide px-4 uppercase">Rough Workout Plan</span>
                  <div className="h-px bg-gradient-to-r from-[#E71B25]/60 to-transparent w-1/4"></div>
                </div>

                <div className="w-full bg-[#111] border border-white/5 rounded-[1rem] overflow-hidden flex flex-col p-1.5 mb-8 shadow-2xl">
                  
                  {/* Week 1 Row (Visible) */}
                  <div className="flex w-full mb-1">
                    <div className="w-6 md:w-8 flex items-center justify-center bg-[#1a1a1a] rounded-l-lg border-r border-black">
                      <span className="text-[9px] md:text-[10px] text-gray-400 font-bold tracking-widest -rotate-90 whitespace-nowrap">WEEK 1</span>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5 p-1 md:p-1.5">
                      {['Push Workout', 'Pull Workout', 'Legs & Abs', 'Rest Day', 'Push Workout', 'Rest Workout', 'Rest Day'].map((workout, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-gray-400 text-[9px] md:text-[10px] mb-1.5">Day {index + 1}</span>
                          <div className="bg-[#222] border border-white/5 rounded-[6px] md:rounded-lg w-full h-[55px] md:h-[65px] flex items-center justify-center text-center p-1 md:p-1.5">
                            <span className="text-[8px] md:text-[10px] text-gray-300 font-medium leading-[1.2]">{workout}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Week 2 Row (Locked) */}
                  <div className="flex w-full relative">
                    <div className="w-6 md:w-8 flex items-center justify-center bg-[#1a1a1a] rounded-l-lg border-r border-black opacity-60">
                      <span className="text-[9px] md:text-[10px] text-gray-500 font-bold tracking-widest -rotate-90 whitespace-nowrap">WEEK 2</span>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5 p-1 md:p-1.5 opacity-30 filter blur-[2px]">
                      {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', '', ''].map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-gray-500 text-[9px] md:text-[10px] mb-1.5">{day}</span>
                          {day && (
                            <div className="bg-[#222] border border-white/5 rounded-[6px] md:rounded-lg w-full h-[55px] md:h-[65px]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Glowing Lock Overlay */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center justify-center z-10 pl-4">
                      <div className="w-[95%] bg-gradient-to-r from-transparent via-[#4a0508]/90 to-transparent py-2 md:py-2.5 flex justify-center items-center gap-2 backdrop-blur-[1px]">
                        <Lock className="w-3.5 h-3.5 text-[#E71B25]" strokeWidth={2.5} />
                        <span className="text-[#E71B25] text-[11px] md:text-[13px] font-bold">More data in the full report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- NUTRITIOUS MEAL PLAN --- */}
                <div className="flex items-center justify-center w-full mb-4 mt-2">
                  <div className="h-px bg-gradient-to-r from-transparent to-[#E71B25]/60 w-1/4"></div>
                  <span className="text-[#a1a1aa] text-[13px] md:text-[15px] font-bold tracking-wide px-4 uppercase">Nutritious Meal Plan</span>
                  <div className="h-px bg-gradient-to-r from-[#E71B25]/60 to-transparent w-1/4"></div>
                </div>

                <div className="w-full bg-[#111] border border-white/5 rounded-[1rem] overflow-hidden flex flex-col p-1.5 mb-10 shadow-2xl">
                  
                  {/* Week 1 Row (Visible) */}
                  <div className="flex w-full mb-1">
                    <div className="w-6 md:w-8 flex items-center justify-center bg-[#1a1a1a] rounded-l-lg border-r border-black">
                      <span className="text-[9px] md:text-[10px] text-gray-400 font-bold tracking-widest -rotate-90 whitespace-nowrap">WEEK 1</span>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5 p-1 md:p-1.5">
                      {['High Protein Meals', 'Pull Workout', 'Balanced Meals', 'Lean Protein Meals', 'Caloric Deficit', 'Muscle Fueling', 'Healthy Fats & Oils'].map((meal, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-gray-400 text-[9px] md:text-[10px] mb-1.5">Day {index + 1}</span>
                          <div className="bg-[#222] border border-white/5 rounded-[6px] md:rounded-lg w-full h-[65px] md:h-[75px] flex items-center justify-center text-center p-1 md:p-1.5">
                            <span className="text-[8px] md:text-[10px] text-gray-300 font-medium leading-[1.2]">{meal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Week 2 Row (Locked) */}
                  <div className="flex w-full relative">
                    <div className="w-6 md:w-8 flex items-center justify-center bg-[#1a1a1a] rounded-l-lg border-r border-black opacity-60">
                      <span className="text-[9px] md:text-[10px] text-gray-500 font-bold tracking-widest -rotate-90 whitespace-nowrap">WEEK 2</span>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1 md:gap-1.5 p-1 md:p-1.5 opacity-30 filter blur-[2px]">
                      {['Fat Burning Recipes', 'Lean Protein Meals', 'Balanced Meals', 'High Protein Meals', 'Healthy Carbs', 'Healthy Greens & Vegetables', 'Greens & Vegetables'].map((meal, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-gray-500 text-[9px] md:text-[10px] mb-1.5">Day {index + 1}</span>
                          <div className="bg-[#222] border border-white/5 rounded-[6px] md:rounded-lg w-full h-[65px] md:h-[75px] flex items-center justify-center text-center p-1 md:p-1.5">
                            <span className="text-[8px] md:text-[10px] text-gray-500 font-medium leading-[1.2]">{meal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Glowing Lock Overlay */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center justify-center z-10 pl-4">
                      <div className="w-[95%] bg-gradient-to-r from-transparent via-[#4a0508]/90 to-transparent py-2 md:py-2.5 flex justify-center items-center gap-2 backdrop-blur-[1px]">
                        <Lock className="w-3.5 h-3.5 text-[#E71B25]" strokeWidth={2.5} />
                        <span className="text-[#E71B25] text-[11px] md:text-[13px] font-bold">More data in the full report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BIG RED CTA BUTTON (Scrolls to pricing) */}
                <button
                  onClick={scrollToPricing}
                  className="w-full bg-[#E71B25] hover:bg-[#c2141d] text-white font-bold text-[18px] md:text-[20px] py-4 md:py-5 rounded-2xl shadow-[0_0_30px_rgba(231,27,37,0.4)] transition-all active:scale-[0.98] mt-2"
                >
                  Get My Personalized Plan
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
                  SECTION 3.5: SWIPEABLE SUCCESS STORIES
                  ========================================== */}
              <ReviewCarousel />

              {/* ==========================================
                  SECTION 4: TRUST & COMMUNITY
                  ========================================== */}
              <div className="w-full flex flex-col gap-4 mb-4 mt-6">
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

              {/* ==========================================
                  SECOND WIDGET INSTANCE (BOTTOM)
                  ========================================== */}
              <PricingWidget id="pricing-section-bottom" onCheckout={onCheckout} onSuccess={onSuccess} />

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;