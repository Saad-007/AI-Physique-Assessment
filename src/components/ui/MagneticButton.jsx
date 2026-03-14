import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = ({ text, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 }); // The 0.2 controls the "pull" strength
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative mt-8 z-50 flex justify-center w-full md:w-auto cursor-pointer"
    >
      {/* Intense Under-Glow */}
      <div className="absolute inset-0 bg-[#ff5a1f] rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-full md:w-auto px-16 py-4 md:py-5 bg-[#ff5a1f] hover:bg-[#e04a15] text-white font-black text-lg md:text-xl tracking-wide uppercase rounded-xl shadow-2xl transition-colors duration-300 border border-white/10"
      >
        {text}
      </motion.button>
    </motion.div>
  );
};