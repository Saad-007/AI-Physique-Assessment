import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedButton = ({ text, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
      // PERFORMANCE FIX: Added hardware acceleration wrapper
      className="relative mt-10 w-full sm:w-auto flex justify-center group transform-gpu will-change-[opacity,transform]"
    >
      {/* COLOR FIX & PERFORMANCE: Changed to #E71B25 and offloaded blur to GPU */}
      <div className="absolute inset-0 bg-[#E71B25] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform-gpu will-change-opacity"></div>
      
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        // COLOR FIX: Changed bg to #E71B25 and added hover state for depth
        className="relative overflow-hidden w-full sm:w-auto px-16 py-4 bg-[#E71B25] hover:bg-[#C6161F] text-white font-black text-lg uppercase tracking-wide rounded-xl shadow-lg transition-colors duration-300 transform-gpu will-change-transform"
      >
        <span className="relative z-10 flex items-center gap-2">
          {text} 
          {/* PERFORMANCE FIX: Isolated the infinite loop to the GPU */}
          <motion.span 
            animate={{ x: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="transform-gpu will-change-transform"
          >
            →
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  );
};