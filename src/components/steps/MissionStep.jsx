import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

// --- Animation Variants ---
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
      className="flex flex-col items-center text-center w-full px-4 md:px-8 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* 1. Refined Premium Badge (Matches Landing Step) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -3, 0] }} 
        transition={{ 
          opacity: { delay: 0.1, duration: 0.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
        }}
        className="border border-gray-800/80 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full px-4 py-1.5 text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-2 shadow-xl cursor-default"
      >
        <Target className="w-3.5 h-3.5 text-[#ff5a1f]" strokeWidth={2.5} />
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
          <motion.span key={index} variants={wordVariants} className="inline-block mr-2.5 md:mr-4">
            {word}
          </motion.span>
        ))}
        
        {/* "YOU" with SVG Draw Animation */}
        <motion.span variants={wordVariants} className="inline-block relative mr-2.5 md:mr-4 text-[#ff5a1f] drop-shadow-[0_0_15px_rgba(255,90,31,0.2)]">
          you
          <motion.svg 
            className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 overflow-visible" 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M0,10 Q50,20 100,5" 
              fill="transparent" 
              stroke="#ff5a1f" 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.span>

        <br className="hidden md:block" />
        
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">finally</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">build</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">the</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">physique</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">they've</motion.span>
        <motion.span variants={wordVariants} className="inline-block mr-2.5 md:mr-4">always</motion.span>
        
        {/* Updated Gradient Text for "WANTED" */}
        <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#ff5a1f] to-[#e04a15]">
          wanted
        </motion.span>
        
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 text-gray-500">—</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4">with</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">AI</motion.span>
        <motion.span variants={wordVariants} className="inline-block ml-2.5 md:ml-4">precision.</motion.span>
      </motion.h1>
      
      {/* 3. Tighter, Scaled-Down Paragraph */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 font-medium leading-relaxed text-balance"
      >
        Stop wasting months on random workouts. BodyMax AI scans your physical metrics, identifies your weak points, and engineers a precise, data-driven plan to reach your ideal physique.
      </motion.p>

      {/* 4. Button Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full flex justify-center"
      >
        <MagneticButton text="Continue →" onClick={onNext} />
      </motion.div>
      
    </motion.div>
  );
};

export default MissionStep;