import React from 'react';
import { motion } from 'framer-motion';
import GlowingButton from '../GlowingButton';

// Stagger effect for the list items
const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const ComparisonStep = ({ onNext }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-12"
      >
        Two types of guys at the gym...
      </motion.h2>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center mb-10">
        {/* Bad Card - Slides in from left */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="bg-[#0f0f0f] border border-gray-800/80 rounded-2xl p-8 flex-1 text-left shadow-xl"
        >
          <h3 className="text-center font-bold mb-8 flex items-center justify-center gap-2 text-lg text-gray-300">
            <span className="text-xl">😞</span> Without BodyMax
          </h3>
          <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-5 text-sm md:text-base text-gray-400 font-medium">
            {["Guessing what to train", "Don't know weak points", "Random workouts", "Slow progress", "Feel stuck for years"].map((text, i) => (
              <motion.li key={i} variants={itemVariants} className="flex gap-4 items-center">
                <span className="text-red-500/80 bg-red-500/10 p-1 rounded-full text-xs">✕</span> {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Good Card - Slides in from right */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-b from-[#0a140a] to-[#050a05] border border-green-600/30 rounded-2xl p-8 flex-1 text-left relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.05)]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <h3 className="text-center font-bold mb-8 text-green-400 flex items-center justify-center gap-2 text-lg">
            <span className="text-xl">🏆</span> With BodyMax
          </h3>
          <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-5 text-sm md:text-base text-gray-200 font-medium">
            {["Exact BodyMax Score", "Weak points exposed", "Personalised plan", "Fast visible results", "Dream physique achieved"].map((text, i) => (
              <motion.li key={i} variants={itemVariants} className="flex gap-4 items-center">
                <span className="text-green-400 bg-green-500/10 p-1 rounded-full text-xs">✓</span> {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <GlowingButton text="I want to be on the right →" onClick={onNext} />
    </motion.div>
  );
};

export default ComparisonStep;