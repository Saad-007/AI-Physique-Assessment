import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, TrendingUp, Clock, Activity } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

// --- Highly Performant Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 20 }
  }
};

const LandingStep = ({ onNext }) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      // PERFORMANCE FIX: Added transform-gpu and will-change
      className="flex flex-col items-center text-center w-full px-4 md:px-8 max-w-4xl mx-auto transform-gpu will-change-[opacity,transform,filter]"
    >
      {/* 1. Floating Premium Badge */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        // PERFORMANCE FIX: Added transform-gpu
        className="border border-gray-800/80 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full px-4 py-1.5 text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2 shadow-xl cursor-default transform-gpu"
      >
        <Zap className="w-3.5 h-3.5 text-[#ff5a1f]" fill="currentColor" /> 
        AI Physique Assessment
      </motion.div>
      
      {/* 2. Refined, Perfectly Balanced Typography */}
      <motion.h1 
        variants={itemVariants}
        // PERFORMANCE FIX: Added transform-gpu and will-change
        className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-6 text-balance text-white transform-gpu will-change-[opacity,transform,filter]"
      >
        What's your real <br className="hidden md:block"/>
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#ff5a1f] to-[#e04a15] drop-shadow-[0_0_20px_rgba(255,90,31,0.2)]">
          BodyMax
          {/* Subtle underline accent */}
          <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-[#ff5a1f]/20 rounded-full blur-[2px]"></span>
        </span> Score?
      </motion.h1>
      
      {/* 3. Tighter Subtext */}
      <motion.p 
        variants={itemVariants}
        className="text-gray-400 text-base md:text-lg max-w-lg mb-12 leading-relaxed font-medium text-balance transform-gpu will-change-[opacity,transform,filter]"
      >
        Find out exactly what's holding your physique back — and the fastest path to your dream body.
      </motion.p>

      {/* 4. Refined Stat Row with Icons */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-8 md:gap-20 mb-12 w-full transform-gpu will-change-[opacity,transform,filter]"
      >
        {[
          { icon: Users, end: 200, suffix: "K+", label: "Gym Guys" },
          { icon: TrendingUp, end: 91, suffix: "%", label: "See Results" },
          { icon: Clock, end: 12, suffix: " WKS", label: "Avg. Time" }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center group cursor-default">
            {/* Tiny crisp icon above stats */}
            <stat.icon className="w-4 h-4 text-gray-600 mb-2 group-hover:text-[#ff5a1f] transition-colors duration-300" />
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-1">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
            </div>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* 5. Action Button */}
      <motion.div 
        variants={itemVariants} 
        className="w-full flex justify-center transform-gpu will-change-[opacity,transform,filter]"
      >
        <MagneticButton text="Discover My Score →" onClick={onNext} />
      </motion.div>
      
      {/* 6. System Status Footer */}
      <motion.div 
        variants={itemVariants}
        className="mt-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] md:text-xs text-gray-500 font-semibold tracking-wide transform-gpu will-change-[opacity,transform,filter]"
      >
        <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse drop-shadow-[0_0_8px_#22c55e]" />
        Free • 2 minutes • Instant AI results
      </motion.div>
    </motion.div>
  );
};

export default LandingStep;