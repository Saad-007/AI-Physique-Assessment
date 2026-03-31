import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// --- Highly Performant Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", damping: 15, stiffness: 100 }
  }
};

const MissionStep = ({ onNext }) => {
  const words = ["To", "help", "gym", "guys", "like"];

  return (
    <motion.div 
      className="flex flex-col items-center text-center w-full px-4 md:px-8 max-w-4xl mx-auto transform-gpu will-change-[opacity,transform]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* 1. Refined Premium Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -3, 0] }} 
        transition={{ 
          opacity: { delay: 0.1, duration: 0.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
        }}
        // PERFORMANCE FIX: Added transform-gpu to stop the floating animation from lagging
        className="border border-gray-800/80 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full px-4 py-1.5 text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-2 shadow-xl cursor-default transform-gpu"
      >
        {/* COLOR FIX: text-[#E71B25] */}
        <Target className="w-3.5 h-3.5 text-[#E71B25]" strokeWidth={2.5} />
        Our Mission
      </motion.div>
      
      {/* 2. Staggered Word Reveal Heading */}
      <motion.h1 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-8 text-balance text-white relative z-10"
      >
        {words.map((word, index) => (
          <motion.span 
            key={index} 
            variants={wordVariants} 
            // PERFORMANCE FIX: Critical for mobile blur animations
            className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]"
          >
            {word}
          </motion.span>
        ))}
        
        {/* "YOU" with SVG Draw Animation */}
        {/* COLOR FIX: text-[#E71B25] and corresponding RGB shadow */}
        <motion.span 
          variants={wordVariants} 
          className="inline-block relative mr-2.5 md:mr-4 text-[#E71B25] drop-shadow-[0_0_15px_rgba(231,27,37,0.2)] transform-gpu will-change-[opacity,transform,filter]"
        >
          you
          <motion.svg 
            className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 overflow-visible" 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M0,10 Q50,20 100,5" 
              fill="transparent" 
              stroke="#E71B25" // COLOR FIX: stroke changed to red
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.span>

        <br className="hidden md:block" />
        
        {/* PERFORMANCE FIX: Added hardware acceleration classes to all remaining spans */}
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">finally</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">build</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">the</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">physique</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">they've</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4 transform-gpu will-change-[opacity,transform,filter]">always</motion.span>
        
        {/* Updated Gradient Text for "WANTED" */}
        {/* COLOR FIX: gradient from-[#E71B25] to-[#C6161F] */}
        <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] transform-gpu will-change-[opacity,transform,filter]">
          wanted
        </motion.span>
        
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 text-gray-500 transform-gpu will-change-[opacity,transform,filter]">—</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 transform-gpu will-change-[opacity,transform,filter]">with</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 transform-gpu will-change-[opacity,transform,filter]">AI</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 transform-gpu will-change-[opacity,transform,filter]">precision.</motion.span>
      </motion.h1>
      
      {/* 3. Tighter, Scaled-Down Paragraph */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        // PERFORMANCE FIX
        className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 font-medium leading-relaxed text-balance transform-gpu will-change-[opacity,transform]"
      >
        Stop wasting months on random workouts. BodyMax AI scans your physical metrics, identifies your weak points, and engineers a precise, data-driven plan to reach your ideal physique.
      </motion.p>

      {/* 4. Button Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 20 }}
        // PERFORMANCE FIX
        className="w-full flex justify-center transform-gpu will-change-[opacity,transform]"
      >
        <MagneticButton text="Continue →" onClick={onNext} />
      </motion.div>
      
    </motion.div>
  );
};

export default MissionStep;