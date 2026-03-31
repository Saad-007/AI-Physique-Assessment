import React from 'react';
import { motion } from 'framer-motion';

const GlowingButton = ({ text, onClick }) => {
  return (
    // PERFORMANCE FIX: Added transform-gpu and grouped for hover effects
    <div className="relative mt-8 w-full sm:w-auto flex justify-center group transform-gpu will-change-[opacity,transform]">
      {/* COLOR FIX & AESTHETIC UPGRADE: Changed to #E71B25 and added dynamic hover glow */}
      <div className="absolute inset-0 bg-[#E71B25] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 transform-gpu will-change-opacity"></div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        // COLOR FIX: Changed bg to #E71B25 and hover to #C6161F
        className="relative w-full sm:w-auto px-16 py-4 bg-[#E71B25] text-white font-bold text-lg rounded-xl transition-colors hover:bg-[#C6161F] shadow-lg transform-gpu will-change-transform"
      >
        {text}
      </motion.button>
    </div>
  );
};

export default GlowingButton;