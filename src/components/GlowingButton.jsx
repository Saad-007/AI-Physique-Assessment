import React from 'react';
import { motion } from 'framer-motion';

const GlowingButton = ({ text, onClick }) => {
  return (
    <div className="relative mt-8 w-full sm:w-auto flex justify-center">
      {/* Exact ambient glow from the image */}
      <div className="absolute inset-0 bg-[#ff5a1f] rounded-xl blur-xl opacity-20"></div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative w-full sm:w-auto px-16 py-4 bg-[#ff5a1f] text-white font-bold text-lg rounded-xl transition-colors hover:bg-[#e04a15] shadow-lg"
      >
        {text}
      </motion.button>
    </div>
  );
};

export default GlowingButton;