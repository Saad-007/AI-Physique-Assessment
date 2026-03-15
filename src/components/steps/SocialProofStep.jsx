import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, BrainCircuit, Dumbbell, Cpu } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// --- Highly Performant Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.2 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: -30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 150, damping: 20 }
  }
};

const HowItWorksStep = ({ onNext }) => {
  const steps = [
    {
      icon: ScanFace,
      title: "Biometric AI Scan",
      desc: "Upload 3 photos. Our neural network maps your current muscle mass, body fat, and structural symmetry."
    },
    {
      icon: BrainCircuit,
      title: "Gap Analysis Engine",
      desc: "The AI compares your current metrics against your chosen 'Dream Physique' to identify exact weak points."
    },
    {
      icon: Dumbbell,
      title: "Hyper-Optimised Protocol",
      desc: "A custom 12-week training and macro plan is generated to fix your deficiencies and force rapid growth."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20, filter: "blur(12px)", scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full px-4 max-w-2xl mx-auto transform-gpu will-change-[opacity,transform,filter]"
    >
      {/* High-Tech Header Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} 
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/30 text-[#E71B25] text-[10px] font-black tracking-[0.25em] uppercase mb-6 shadow-[0_0_20px_rgba(231,27,37,0.15)]"
      >
        <Cpu className="w-3.5 h-3.5 animate-pulse" /> System Architecture
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        className="text-4xl md:text-[3.25rem] font-black uppercase tracking-tighter leading-none mb-14 text-center text-white drop-shadow-lg text-balance"
      >
        How BodyMax <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] drop-shadow-[0_0_20px_rgba(231,27,37,0.3)]">Works</span>
      </motion.h2>

      {/* The Glowing Vertical Timeline */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="relative w-full flex flex-col gap-10 mb-14 pl-2 md:pl-0"
      >
        {/* The Cybernetic Connecting Line */}
        <div className="absolute left-[36px] md:left-[42px] top-6 bottom-10 w-[3px] bg-gray-800/60 rounded-full z-0 overflow-hidden">
          {/* Base Red Line loading down */}
          <motion.div 
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            className="w-full bg-gradient-to-b from-[#E71B25] to-[#ff4747] rounded-full shadow-[0_0_15px_#E71B25]"
          />
          {/* Shooting Data Particle */}
          <motion.div 
            animate={{ y: ["-10%", "110%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 }}
            className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white to-transparent blur-[2px] opacity-80"
          />
        </div>

        {steps.map((step, i) => (
          <motion.div key={i} variants={stepVariants} className="relative z-10 flex items-start gap-6 md:gap-10 group transform-gpu will-change-transform">
            
            {/* Timeline Node */}
            <div className="relative shrink-0">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-16 h-16 md:w-[84px] md:h-[84px] bg-[#050505] border-[2px] border-[#E71B25]/50 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_20px_rgba(231,27,37,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-[#E71B25] group-hover:shadow-[0_0_30px_rgba(231,27,37,0.5)] transition-all duration-300 relative z-10 overflow-hidden"
              >
                {/* Node Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E71B25]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <step.icon className="w-7 h-7 md:w-9 md:h-9 text-gray-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-white transition-colors duration-300 relative z-10" strokeWidth={2} />
              </motion.div>
              
              {/* Step Number Ping */}
              <div className="absolute -bottom-2 -right-2 bg-[#E71B25] text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-[2.5px] border-[#050505] shadow-[0_0_10px_#E71B25] z-20">
                {i + 1}
                <div className="absolute inset-0 rounded-full border border-[#E71B25] animate-ping opacity-50" />
              </div>
            </div>

            {/* Cyber-Glass Content Card */}
            <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-[1.25rem] p-6 md:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:bg-[#110505]/80 group-hover:border-[#E71B25]/40 group-hover:shadow-[0_10px_30px_rgba(231,27,37,0.15)] transition-all duration-400 relative overflow-hidden">
              {/* Card Sweep Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E71B25]/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              
              <h3 className="text-[17px] md:text-[22px] font-black text-white uppercase tracking-tight mb-2.5 group-hover:text-[#E71B25] transition-colors duration-300 drop-shadow-sm">
                {step.title}
              </h3>
              <p className="text-gray-400 text-[14px] md:text-[15px] font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Button Entrance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 20 }} 
        className="w-full flex justify-center"
      >
        <MagneticButton text="Initialize Assessment →" onClick={onNext} />
      </motion.div>

    </motion.div>
  );
};

export default HowItWorksStep;
