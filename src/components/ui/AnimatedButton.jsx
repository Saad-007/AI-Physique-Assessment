import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedButton = ({ text, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="relative mt-10 w-full sm:w-auto flex justify-center group"
    >
      <div className="absolute inset-0 bg-[#ff5a1f] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="relative overflow-hidden w-full sm:w-auto px-16 py-4 bg-[#ff5a1f] text-white font-black text-lg uppercase tracking-wide rounded-xl shadow-lg"
      >
        <span className="relative z-10 flex items-center gap-2">
          {text} <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
        </span>
      </motion.button>
    </motion.div>
  );
};