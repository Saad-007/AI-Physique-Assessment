import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// Refined Animated Counter
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

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 120, damping: 20 }
  }
};

const SocialProofStep = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full px-4 max-w-md mx-auto"
    >
      {/* Refined Header with Lucide Icon */}
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center justify-center gap-3 tracking-tight"
      >
        <Users className="w-6 h-6 text-[#ff5a1f]" />
        You're in good company
      </motion.h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 w-full mb-10"
      >
        {/* --- Card 1: 200K Users --- */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, borderColor: "rgba(255,90,31,0.3)" }}
          className="bg-[#0a0a0a] border border-gray-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle hover glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff5a1f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff5a1f] to-[#e04a15] tracking-tighter mb-2 relative z-10">
            <AnimatedCounter end={200} suffix="K" />
          </div>
          <p className="text-gray-400 text-sm md:text-[15px] font-medium text-balance relative z-10">
            men already building their dream physique
          </p>
        </motion.div>

        {/* --- Card 2: 91% Success --- */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, borderColor: "rgba(255,90,31,0.3)" }}
          className="bg-[#0a0a0a] border border-gray-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff5a1f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <TrendingUp className="w-6 h-6 text-[#ff5a1f]/50 absolute top-4 right-4" />

          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff5a1f] to-[#e04a15] tracking-tighter mb-2 relative z-10">
            <AnimatedCounter end={91} suffix="%" duration={1200} />
          </div>
          <p className="text-gray-400 text-sm md:text-[15px] font-medium text-balance mb-5 relative z-10">
            see a visible physique change in 12 weeks
          </p>
          
          {/* Refined Disclaimer */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-gray-800/50 text-[11px] text-gray-500 font-semibold tracking-wide relative z-10">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            *Based on 82,000+ BodyMax users
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full flex justify-center"
      >
        <MagneticButton text="Start My Assessment →" onClick={onNext} />
      </motion.div>

    </motion.div>
  );
};

export default SocialProofStep;