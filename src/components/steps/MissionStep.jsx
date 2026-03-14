import React from 'react';
import { motion } from 'framer-motion';
import GlowingButton from '../GlowingButton';

const MissionStep = ({ onNext }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-gray-700/50 bg-gray-800/20 rounded-full px-5 py-2 text-xs text-gray-400 tracking-widest uppercase mb-10"
      >
        Our Mission
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-[1.15] mb-8 max-w-3xl"
      >
        To help gym guys like <span className="text-[#ff5a1f]">you</span> finally build the physique they've always <span className="text-[#ff5a1f]">wanted</span> — with AI precision.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8 font-light leading-relaxed"
      >
        Stop wasting months on random workouts. BodyMax AI scans your body, identifies your weak points, and builds you a precise plan to reach your ideal physique.
      </motion.p>

      <GlowingButton text="Continue →" onClick={onNext} />
    </motion.div>
  );
};

export default MissionStep;