import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedCounter = ({ end, suffix = "", label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // COLOR FIX & PERFORMANCE: Changed to #E71B25 and added GPU acceleration
        className="text-4xl md:text-5xl lg:text-6xl font-black text-[#E71B25] tracking-tighter transform-gpu will-change-[opacity,transform]"
      >
        {count}{suffix}
      </motion.div>
      
      <motion.span 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
        // PERFORMANCE FIX: GPU acceleration for smooth fade-in
        className="text-[11px] md:text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mt-2 transform-gpu will-change-opacity"
      >
        {label}
      </motion.span>
    </div>
  );
};