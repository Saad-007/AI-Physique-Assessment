import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Target } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E71B25] filter blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Side-by-Side Images Container (NO OVERLAP) */}
      <div className="flex justify-center items-center gap-4 md:gap-6 mb-12 w-full max-w-[400px] mt-4 relative z-10">
        
        {/* Current Photo */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-1/2 aspect-[4/5] bg-[#0a0a0a] rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden relative"
        >
          <img src={currentPhoto} alt="Current" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
          <div className="absolute bottom-3 left-0 w-full flex justify-center">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5 border border-white/10 shadow-lg">
              <Camera className="w-3 h-3" /> Current
            </span>
          </div>
        </motion.div>

        {/* Goal Photo */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
           className="w-1/2 aspect-[4/5] bg-[#0a0a0a] rounded-2xl md:rounded-3xl border border-[#E71B25]/30 shadow-[0_10px_40px_rgba(231,27,37,0.15)] overflow-hidden relative"
        >
          <img src={goalPhoto} alt="Goal" className="absolute inset-0 w-full h-full object-cover object-center filter grayscale-[10%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
          <div className="absolute bottom-3 left-0 w-full flex justify-center">
            <span className="bg-[#E71B25]/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border border-[#E71B25]/50 shadow-lg">
              <Target className="w-3 h-3 text-[#ff8a8a]" /> Goal
            </span>
          </div>
        </motion.div>

      </div>

      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="text-white text-[18px] md:text-[22px] font-bold text-center mb-10 max-w-[300px] md:max-w-[340px] leading-snug tracking-tight z-10 drop-shadow-md"
      >
        Generating your Body Max Report & personalized plan to build your dream physique.
      </motion.h2>

      {/* Loading Bars */}
      <div className="w-full max-w-[340px] flex flex-col gap-6 z-10">
        {[
          "Analyzing Your Current Physique",
          "Analyzing Your Dream Physique",
          "Generating BodyMax Score Report",
          "Building Personalized Plan & Program For You"
        ].map((text, i) => (
          <div key={i} className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-end text-white font-medium text-[12px] md:text-[13px]">
              <div className="flex items-start gap-3">
                <span className="font-bold w-3">{i + 1}.</span>
                <span className={progress[i] === 100 ? "text-white" : "text-gray-400"}>{text}</span>
              </div>
              <span className="font-mono font-bold ml-2">{Math.floor(progress[i])}%</span>
            </div>
            <div className="w-full h-[6px] md:h-[8px] bg-[#111] rounded-full overflow-hidden border border-white/[0.05]">
              <div 
                className="h-full bg-[#E71B25] rounded-full transition-all ease-out" 
                style={{ width: `${progress[i]}%`, transitionDuration: '50ms' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzingStep;