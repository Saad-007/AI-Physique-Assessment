import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Sparkles } from 'lucide-react';
import { IoIosArrowRoundBack } from "react-icons/io"; // <--- 1. IMPORT ADD KAREIN
const UpgradedBodyModal = ({ isOpen, onGetPlan,onClose }) => {
  // Timer State (Starts at 7:47)
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
          {/* Hide Scrollbar */}
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[1000] bg-[#050505] overflow-y-auto hide-scrollbar flex flex-col items-center pb-28"
          >
            <div className="absolute top-6 left-4 z-[110]">
            <motion.button 
              whileTap={{ x: -2 }} 
              onClick={onClose} 
              className="p-2 rounded-full bg-black/40 border border-white/[0.05] backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg"
            >
              <IoIosArrowRoundBack className="w-6 h-6 text-gray-300 hover:text-white" strokeWidth={1.5} />
            </motion.button>
          </div>
            
            {/* 1. TOP HEADER, SUMMARY, AND BANNER */}
            <div className="w-full max-w-[540px] px-4 pt-10 pb-6 flex flex-col items-center text-center">
              
              {/* Elegant Bold (Not Black) */}
              <h1 className="text-white text-[32px] md:text-[38px] font-bold tracking-tight leading-[1.1] mb-3">
                Your Body, Upgraded.
              </h1>
              
              {/* Normal, clean summary text */}
              <p className="text-gray-400 text-[13.5px] md:text-[15px] font-normal leading-relaxed text-balance px-2 mb-6">
                See how small improvements and following a clear, proven plan add up to a massive transformation.
              </p>

              {/* Purple Timer Banner */}
              <div className="bg-[#8A53C6] w-full py-3 rounded-2xl shadow-[0_4px_20px_rgba(138,83,198,0.3)] flex justify-center items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/60" />
                <span className="text-white text-[12px] md:text-[13px] font-semibold uppercase tracking-widest">
                  -50% Discount Reserved For 7:47
                  
                  {/* {formattedTime} */}
                </span>
              </div>

            </div>

            {/* 2. THE IMAGE CONTAINER WITH COMPACT POINTS ON TOP */}
            <div className="w-full max-w-[540px] px-2 md:px-4 flex-1 flex flex-col">
              {/* Image Container - NO BORDERS */}
              <div className="relative w-full h-[580px] md:h-[650px] rounded-[2rem] overflow-hidden flex shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black">
                
                {/* Left Side: Before */}
                <div className="flex-1 relative flex flex-col">
                  {/* Left RAW Image Background */}
                  <img src="/Today3.png" alt="Before" className="absolute inset-0 w-full h-full object-cover object-bottom" />
                  
                  {/* Dark Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent z-10" />
                  
                  {/* Overlaid COMPACT Points at the Top */}
                  <div className="relative z-20 pt-6 px-2.5 md:px-3 flex flex-col items-center w-full">
                    <h3 className="text-white font-semibold text-[15px] md:text-[16px] mb-4 tracking-wide uppercase drop-shadow-md">
                      Before
                    </h3>
                    
                    {/* Points: No Borders, Clean Font */}
                    <div className="flex flex-col gap-1.5 w-full">
                      {[
                        "1 year... no progress",
                        "Guessing... don't know what to do",
                        "Feeling invisible next to other guys",
                        "No one looks twice"
                      ].map((text, i) => (
                        <div key={i} className="bg-black/50 backdrop-blur-md rounded-lg py-1.5 px-2 flex items-center gap-2 w-full">
                          <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E71B25] shrink-0" strokeWidth={2.5} />
                          {/* Elegant, normal weight font */}
                          <span className="text-gray-200 text-[10px] md:text-[11px] font-normal leading-tight">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aesthetic Center Line Overlay */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/60 z-30" />

                {/* Right Side: After */}
                <div className="flex-1 relative flex flex-col">
                  {/* Right RAW Image Background */}
                  <img src="/Future1.png" alt="After" className="absolute inset-0 w-full h-full object-cover object-bottom" />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent z-10" />

                  {/* Overlaid COMPACT Points at the Top */}
                  <div className="relative z-20 pt-6 px-2.5 md:px-3 flex flex-col items-center w-full">
                    <h3 className="text-white font-semibold text-[14px] md:text-[15px] mb-4 tracking-wide flex items-center justify-center gap-1 uppercase drop-shadow-md w-full text-center">
                      After <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                    </h3>
                    
                    {/* Points: No Borders, Clean Font */}
                    <div className="flex flex-col gap-1.5 w-full">
                      {[
                        "12 weeks -> visible results",
                        "Exact, personalized, proven plan",
                        "Jacked, defined... impossible to ignore",
                        "Dream body achieved"
                      ].map((text, i) => (
                        <div key={i} className="bg-black/50 backdrop-blur-md rounded-lg py-1.5 px-2 flex items-center gap-2 w-full">
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#4CA75B] shrink-0" strokeWidth={3} />
                          {/* Medium weight for the 'After' section to show progression without being overly bold */}
                          <span className="text-white text-[10px] md:text-[11px] font-medium leading-tight">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. FLOATING 'GET MY PLAN' BUTTON (#E71B25 Color) */}
            <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetPlan}
                className="w-full max-w-[460px] bg-[#E71B25] hover:bg-[#d41820] text-white py-4 md:py-[18px] rounded-[1.25rem] font-bold text-[17px] md:text-[18px] tracking-widest uppercase transition-colors shadow-[0_15px_30px_rgba(231,27,37,0.4)] pointer-events-auto"
              >
                Get My Plan
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradedBodyModal;