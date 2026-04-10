import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Target, Cpu } from 'lucide-react';

const AnalyzingStep = ({ formData, onComplete }) => {
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  useEffect(() => {
    let isMounted = true;
    
    const animateProgress = async () => {
      // Har step ko load hone mein kitna time lagay (milliseconds)
      const durations = [1000, 1200, 1500, 1200]; 
      
      for (let i = 0; i < 4; i++) {
        if (!isMounted) return;
        
        await new Promise(resolve => {
          let start = Date.now();
          const interval = setInterval(() => {
            let timePassed = Date.now() - start;
            let percent = Math.min((timePassed / durations[i]) * 100, 100);
            
            setProgress(prev => {
              let newProg = [...prev];
              newProg[i] = percent;
              return newProg;
            });
            
            if (percent >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 30);
        });
      }
      
      if (isMounted) {
        // Jab 100% ho jaye toh adha second wait karke aagay bhej do
        setTimeout(() => onComplete(), 500);
      }
    };
    
    animateProgress();
    return () => { isMounted = false; };
  }, [onComplete]);

  // Extracting images securely from formData
  const currentPhoto = formData?.photoPreviewUrls?.[1] || formData?.photos?.[1] || '/Today3.png'; 
  const goalPhoto = formData?.dreamPhysiquePreview || formData?.dreamPhysiqueImage || '/Future1.png';

  return (
    <div className="w-full min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center p-5 relative overflow-hidden font-sans">
      
      {/* Subtle Premium Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#E71B25] rounded-full filter blur-[120px] opacity-[0.07] pointer-events-none"></div>

      {/* System Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] text-[9px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm"
      >
        <Cpu className="w-3 h-3 animate-pulse" /> Neural Processing
      </motion.div>

      {/* Side-by-Side Images Container - Compact & Sleek */}
      <div className="flex justify-center items-center gap-3 md:gap-4 mb-8 w-full max-w-[320px] relative z-10">
        
        {/* Current Photo */}
        <motion.div 
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="w-1/2 aspect-[4/5] bg-[#0a0a0a] rounded-[1.25rem] border border-white/5 shadow-xl overflow-hidden relative"
        >
          <img src={currentPhoto} alt="Current" className="absolute inset-0 w-full h-full object-cover grayscale-[15%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-2.5 left-0 w-full flex justify-center">
            <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md text-[8px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1 border border-white/[0.05]">
              <Camera className="w-2.5 h-2.5 text-gray-400" /> Current
            </span>
          </div>
        </motion.div>

        {/* Sync Indicator (Center) */}
        <div className="flex flex-col items-center justify-center shrink-0 opacity-50">
          <div className="w-[1px] h-6 bg-gradient-to-b from-transparent to-white/20"></div>
          <div className="w-1 h-1 rounded-full bg-white/40 my-1"></div>
          <div className="w-[1px] h-6 bg-gradient-to-t from-transparent to-white/20"></div>
        </div>

        {/* Goal Photo */}
        <motion.div 
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
           className="w-1/2 aspect-[4/5] bg-[#0a0a0a] rounded-[1.25rem] border border-[#E71B25]/20 shadow-[0_5px_20px_rgba(231,27,37,0.08)] overflow-hidden relative"
        >
          <img src={goalPhoto} alt="Goal" className="absolute inset-0 w-full h-full object-cover filter grayscale-[5%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-2.5 left-0 w-full flex justify-center">
            <span className="bg-[#E71B25]/10 backdrop-blur-md px-2.5 py-1 rounded-md text-[8px] font-bold text-white uppercase tracking-widest flex items-center gap-1 border border-[#E71B25]/30">
              <Target className="w-2.5 h-2.5 text-[#ff8a8a]" /> Target
            </span>
          </div>
        </motion.div>

      </div>

      {/* Aesthetic Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-white/90 text-[15px] md:text-[17px] font-medium text-center mb-8 max-w-[280px] leading-relaxed tracking-tight z-10"
      >
        Generating your <strong className="text-white font-bold">BodyMax Report</strong> & personalized plan.
      </motion.h2>

      {/* Compact High-Tech Loading Module */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        className="w-full max-w-[320px] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 md:p-5 flex flex-col gap-4 z-10 shadow-2xl"
      >
        {[
          "Analyzing Current Physique",
          "Processing Dream Target",
          "Generating BodyMax Score",
          "Building Personalized Protocol"
        ].map((text, i) => {
          const isDone = progress[i] === 100;
          const isActive = progress[i] > 0 && progress[i] < 100;
          const isPending = progress[i] === 0;

          return (
            <div key={i} className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-wider font-bold">
                <div className="flex items-center gap-2">
                  {/* Smart Status Dot */}
                  <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-[#22c55e]' : isActive ? 'bg-[#E71B25] animate-pulse shadow-[0_0_8px_#E71B25]' : 'bg-gray-800'}`}></div>
                  <span className={`${isDone ? 'text-gray-400' : isActive ? 'text-white' : 'text-gray-600'} transition-colors duration-300`}>
                    {text}
                  </span>
                </div>
                <span className={`font-mono ${isActive ? 'text-[#E71B25]' : isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                  {Math.floor(progress[i])}%
                </span>
              </div>
              
              {/* Thin, Sleek Progress Bar */}
              <div className="w-full h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ease-out ${isDone ? 'bg-[#22c55e]' : 'bg-[#E71B25] shadow-[0_0_5px_#E71B25]'}`} 
                  style={{ width: `${progress[i]}%`, transitionDuration: '50ms' }}
                ></div>
              </div>
            </div>
          );
        })}
      </motion.div>
      
    </div>
  );
};

export default AnalyzingStep;