import React from 'react';
import { motion } from 'framer-motion';
import { ScanFace, BrainCircuit, Dumbbell, Cpu } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { IoIosArrowRoundBack } from "react-icons/io"; // 🔴 Back Icon Import

// --- Mobile-Optimized Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: -15, scale: 0.98 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 }
  }
};

// 🔴 Added onBack to props
const HowItWorksStep = ({ onNext, onBack }) => { 
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
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      // 🔴 Added pt-12 and relative to give space for the Back button
      className="flex flex-col items-center w-full px-5 max-w-2xl mx-auto transform-gpu relative pt-12" 
    >
      
      {/* 🔴 SLEEK BACK BUTTON (Top Left) */}
      <div className="absolute top-0 left-4 z-50">
        <motion.button
          whileTap={{ x: -2 }}
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg opacity-100 block"
        >
          <IoIosArrowRoundBack
            className="w-6 h-6 text-gray-300 hover:text-white"
            strokeWidth={1.5}
          />
        </motion.button>
      </div>

      {/* High-Tech Header Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] text-[10px] font-black tracking-[0.2em] uppercase mb-6"
      >
        <Cpu className="w-3.5 h-3.5" /> System Architecture
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-[3.25rem] font-black uppercase tracking-tighter leading-tight mb-12 text-center text-white"
      >
        How BodyMax <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F]">Works</span>
      </motion.h2>

      {/* The Glowing Vertical Timeline */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="relative w-full flex flex-col gap-8 mb-12 pl-2 md:pl-0"
      >
        {/* The Cybernetic Connecting Line */}
        <div className="absolute left-[28px] md:left-[34px] top-4 bottom-10 w-[2px] bg-white/5 rounded-full z-0 overflow-hidden">
          <motion.div 
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            className="w-full bg-[#E71B25] shadow-[0_0_10px_#E71B25] transform-gpu"
          />
        </div>

        {steps.map((step, i) => (
          <motion.div key={i} variants={stepVariants} className="relative z-10 flex items-start gap-5 md:gap-8 transform-gpu">
            
            {/* Timeline Node */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0a0a0a] border border-[#E71B25]/40 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
              </div>
              
              {/* Step Number Ping */}
              <div className="absolute -bottom-1 -right-1 bg-[#E71B25] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#030303] z-20">
                {i + 1}
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6 shadow-xl transition-colors duration-300 active:border-[#E71B25]/30">
              <h3 className="text-[16px] md:text-[20px] font-black text-white uppercase tracking-tight mb-1.5">
                {step.title}
              </h3>
              <p className="text-gray-400 text-[13px] md:text-[15px] font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Button Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1, duration: 0.4 }} 
        className="w-full flex justify-center"
      >
        <MagneticButton text="Initialize Assessment →" onClick={onNext} />
      </motion.div>

    </motion.div>
  );
};

export default HowItWorksStep;