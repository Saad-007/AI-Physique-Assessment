import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, TrendingUp, Clock, Activity, LogIn } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 20 } }
};

// Yahan maine naya prop `onLoginClick` add kiya hai
const LandingStep = ({ onNext, onLoginClick }) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      className="flex flex-col items-center text-center w-full px-4 md:px-8 max-w-4xl mx-auto transform-gpu will-change-[opacity,transform,filter]"
    >
      <motion.div variants={itemVariants} className="mb-6 md:mb-8 flex justify-center transform-gpu will-change-[opacity,transform,filter]">
        <img src="/logo.png" alt="Brand Logo" className="h-20 md:h-28 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="border border-gray-800/80 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full px-4 py-1.5 text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2 shadow-xl cursor-default transform-gpu transition-colors hover:border-[#E71B25]/40">
        <Zap className="w-3.5 h-3.5 text-[#E71B25]" fill="currentColor" /> AI Physique Assessment
      </motion.div>
      
      <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-6 text-balance text-white transform-gpu will-change-[opacity,transform,filter]">
        What's your real <br className="hidden md:block"/>
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] drop-shadow-[0_0_20px_rgba(231,27,37,0.2)]">
          BodyMax
          <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-[#E71B25]/20 rounded-full blur-[2px]"></span>
        </span> Score?
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-gray-400 text-base md:text-lg max-w-lg mb-12 leading-relaxed font-medium text-balance transform-gpu will-change-[opacity,transform,filter]">
        Find out exactly what's holding your physique back — and the fastest path to your dream body.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 md:gap-20 mb-12 w-full transform-gpu will-change-[opacity,transform,filter]">
        {[{ icon: Users, end: 200, suffix: "K+", label: "Gym Guys" }, { icon: TrendingUp, end: 91, suffix: "%", label: "See Results" }, { icon: Clock, end: 12, suffix: " WKS", label: "Avg. Time" }].map((stat, i) => (
          <div key={i} className="flex flex-col items-center group cursor-default">
            <stat.icon className="w-4 h-4 text-gray-600 mb-2 group-hover:text-[#E71B25] transition-colors duration-300" />
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-1">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
            </div>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="w-full flex justify-center transform-gpu will-change-[opacity,transform,filter]">
        <MagneticButton text="Discover My Score →" onClick={onNext} />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] md:text-xs text-gray-500 font-semibold tracking-wide transform-gpu will-change-[opacity,transform,filter]">
        <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse drop-shadow-[0_0_8px_#22c55e]" />
        Free • 2 minutes • Instant AI results
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 transform-gpu will-change-[opacity,transform,filter]">
        {/* Yahan maine a tag ko button se replace kar diya hai */}
        <button 
          onClick={onLoginClick} 
          className="group flex items-center justify-center gap-2 text-[12px] md:text-sm text-gray-500 font-medium hover:text-gray-300 transition-colors duration-300"
        >
          <LogIn className="w-3.5 h-3.5 opacity-70 group-hover:text-[#E71B25] group-hover:opacity-100 transition-all" />
          Already in the system? 
          <span className="text-white border-b border-white/20 pb-[1px] group-hover:border-[#E71B25] group-hover:text-[#E71B25] transition-all duration-300">
            Access your dashboard
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LandingStep;