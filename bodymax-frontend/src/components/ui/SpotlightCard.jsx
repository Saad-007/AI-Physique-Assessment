import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const SpotlightCard = ({ children, className = '', isPremium = false }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl p-8 md:p-10 transition-colors duration-500 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${isPremium ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)'}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  );
};