import React from 'react';
import { motion } from 'framer-motion';

const GlowingButton = ({ text, onClick }) => {
  return (
    <motion.div 
      className="relative group mt-8 w-full md:w-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-orange-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="relative w-full md:w-auto px-12 py-4 bg-[#ff5a1f] hover:bg-[#e04a15] text-white font-bold text-lg rounded-xl transition-colors duration-300 shadow-[0_0_40px_rgba(255,90,31,0.3)]"
      >
        {text}
      </motion.button>
    </motion.div>
  );
};

export default GlowingButton;