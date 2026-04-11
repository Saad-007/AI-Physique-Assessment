import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Frown, Trophy } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { IoIosArrowRoundBack } from "react-icons/io"; // 🔴 Added Icon Import

// --- Mobile-Optimized Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

// Removed Blur and rotateX for mobile performance stability
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

// 🔴 Added onBack prop
const ComparisonStep = ({ onNext, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      // 🔴 Added pt-12 and relative for the back button spacing
      className="flex flex-col items-center w-full px-5 max-w-4xl mx-auto transform-gpu relative pt-12"
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

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-center text-white transform-gpu"
      >
        Two types of guys at the gym
      </motion.h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10 items-stretch"
      >
        
        {/* --- THE BAD CARD --- */}
        <motion.div 
          variants={cardVariants}
          className="bg-[#080808] border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl transform-gpu"
        >
          <h3 className="font-bold mb-6 flex items-center justify-center gap-2.5 text-gray-500 text-lg border-b border-white/5 pb-5">
            <Frown className="w-5 h-5 text-[#E71B25]/50" strokeWidth={2.5} /> 
            Without BodyMax
          </h3>
          <motion.ul variants={listContainerVariants} className="space-y-4 text-[14px] md:text-[15px] text-gray-400 font-medium flex-1">
            {["Guessing what to train", "Don't know weak points", "Random workouts", "Slow progress", "Feel stuck for years"].map((text, i) => (
              <motion.li key={i} variants={listItemVariants} className="flex gap-3 items-center">
                <X className="w-4 h-4 text-[#E71B25]/80 shrink-0" strokeWidth={3} /> 
                <span className="leading-tight">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* --- THE GOOD CARD --- */}
        <motion.div 
          variants={cardVariants}
          className="relative bg-gradient-to-b from-green-950/20 to-black border border-green-500/20 rounded-2xl p-6 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transform-gpu"
        >
          {/* Hardware accelerated scanning line */}
          <motion.div 
            animate={{ y: ["-100%", "500%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent transform-gpu"
          ></motion.div>
          
          <h3 className="font-bold mb-6 flex items-center justify-center gap-2.5 text-white text-lg border-b border-green-500/10 pb-5 relative z-10">
            <Trophy className="w-5 h-5 text-green-400" strokeWidth={2.5} />
            With BodyMax
          </h3>
          <motion.ul variants={listContainerVariants} className="space-y-4 text-[14px] md:text-[15px] text-gray-200 font-semibold flex-1 relative z-10">
            {["Exact BodyMax Score", "Weak points exposed", "Personalised plan", "Fast visible results", "Dream physique achieved"].map((text, i) => (
              <motion.li key={i} variants={listItemVariants} className="flex gap-3 items-center">
                <div className="bg-green-500 rounded-full p-0.5 shrink-0">
                  <Check className="w-3 h-3 text-black" strokeWidth={4} /> 
                </div>
                <span className="leading-tight">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-full flex justify-center transform-gpu"
      >
        <MagneticButton text="I want visibility →" onClick={onNext} />
      </motion.div>
    </motion.div>
  );
};

export default ComparisonStep;