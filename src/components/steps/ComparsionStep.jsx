import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Frown, Trophy } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const badCardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -5, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const goodCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

const ComparisonStep = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.5 }}
      // Tighter max-width (max-w-4xl instead of 5xl) for premium density
      className="flex flex-col items-center w-full px-4 max-w-4xl mx-auto"
    >
      {/* Scaled-down, balanced title */}
      <motion.h2 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-center text-balance text-white"
      >
        Two types of guys at the gym
      </motion.h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full mb-10 items-stretch perspective-1000"
      >
        
        {/* --- THE BAD CARD --- */}
        <motion.div 
          variants={badCardVariants}
          // Tighter padding (p-8 instead of p-12) and refined border radius
          className="bg-[#080808] border border-gray-800/60 rounded-2xl p-6 md:p-8 flex flex-col hover:border-gray-700 transition-colors duration-300 shadow-xl"
        >
          {/* Crisper, smaller header */}
          <h3 className="font-bold mb-6 flex items-center justify-center gap-2.5 text-gray-500 text-lg md:text-xl border-b border-gray-800/50 pb-5">
            <Frown className="w-5 h-5 text-orange-500/60 grayscale" strokeWidth={2.5} /> 
            Without BodyMax
          </h3>
          <motion.ul variants={listContainerVariants} className="space-y-5 text-sm md:text-[15px] text-gray-400 font-medium flex-1">
            {["Guessing what to train", "Don't know weak points", "Random workouts", "Slow progress", "Feel stuck for years"].map((text, i) => (
              <motion.li key={i} variants={listItemVariants} className="flex gap-3.5 items-center">
                <X className="w-4 h-4 text-red-500/70 shrink-0" strokeWidth={3} /> 
                <span className="leading-tight">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* --- THE GOOD CARD --- */}
        <motion.div 
          variants={goodCardVariants}
          whileHover={{ scale: 1.01, translateY: -3 }}
          className="relative bg-gradient-to-b from-[#0a120a] to-[#040804] border border-green-900/50 rounded-2xl p-6 md:p-8 flex flex-col shadow-[0_0_30px_rgba(34,197,94,0.05)] hover:shadow-[0_0_50px_rgba(34,197,94,0.1)] transition-all duration-500 overflow-hidden"
        >
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-green-400/80 to-transparent"
          ></motion.div>
          
          <h3 className="font-bold mb-6 flex items-center justify-center gap-2.5 text-white text-lg md:text-xl border-b border-green-900/30 pb-5 relative z-10">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Trophy className="w-5 h-5 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" strokeWidth={2.5} />
            </motion.div>
            With BodyMax
          </h3>
          <motion.ul variants={listContainerVariants} className="space-y-5 text-sm md:text-[15px] text-gray-200 font-semibold flex-1 relative z-10">
            {["Exact BodyMax Score", "Weak points exposed", "Personalised plan", "Fast visible results", "Dream physique achieved"].map((text, i) => (
              <motion.li key={i} variants={listItemVariants} className="flex gap-3.5 items-center">
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="bg-green-500 rounded-full p-0.5 shadow-[0_0_10px_rgba(34,197,94,0.4)] shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} /> 
                </motion.div>
                <span className="leading-tight drop-shadow-sm">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      >
        <MagneticButton text="I want to be on the right →" onClick={onNext} />
      </motion.div>
      
    </motion.div>
  );
};

export default ComparisonStep;