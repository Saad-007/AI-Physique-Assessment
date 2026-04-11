import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { IoIosArrowRoundBack } from "react-icons/io"; // 🔴 Added Icon Import

// --- Highly Performant Animation Variants ---
// Removed blur from word reveal as it chokes mobile CPUs during staggered animations
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", damping: 20, stiffness: 120 }
  }
};

// 🔴 Added onBack prop
const MissionStep = ({ onNext, onBack }) => {
  const words = ["To", "help", "gym", "guys", "like"];

  return (
    <motion.div 
      className="flex flex-col items-center text-center w-full px-5 md:px-8 max-w-4xl mx-auto transform-gpu relative pt-12" // 🔴 Added relative & pt-12 for back button spacing
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }} // Removed blur on exit for better mobile performance
      transition={{ duration: 0.3 }}
    >
      
      {/* 🔴 SLEEK BACK BUTTON (Top Left) */}
      <div className="absolute top-0 left-4 md:left-8 z-50">
        <motion.button
          whileTap={{ x: -2 }}
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg opacity-100 block"
        >
          <IoIosArrowRoundBack
            className="w-6 h-6 text-gray-300 hover:text-white"
            strokeWidth={1.5}
          />
        </motion.button>
      </div>

      {/* 1. Refined Premium Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -3, 0] }} 
        transition={{ 
          opacity: { duration: 0.4 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
        }}
        className="border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] md:text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2 shadow-xl transform-gpu will-change-transform"
      >
        <Target className="w-3.5 h-3.5 text-[#E71B25]" strokeWidth={2.5} />
        Our Mission
      </motion.div>
      
      {/* 2. Staggered Word Reveal Heading */}
      <motion.h1 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-8 text-white relative z-10 transform-gpu"
      >
        {words.map((word, index) => (
          <motion.span 
            key={index} 
            variants={wordVariants} 
            className="inline-block mr-2 md:mr-3 transform-gpu will-change-[opacity,transform]"
          >
            {word}
          </motion.span>
        ))}
        
        {/* "YOU" with SVG Draw Animation */}
        <motion.span 
          variants={wordVariants} 
          className="inline-block relative mr-2 md:mr-3 text-[#E71B25] transform-gpu will-change-[opacity,transform]"
        >
          you
          <motion.svg 
            className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 overflow-visible" 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M0,10 Q50,20 100,5" 
              fill="transparent" 
              stroke="#E71B25"
              strokeWidth="6" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.span>

        <br className="hidden md:block" />
        
        {["finally", "build", "the", "physique", "they've", "always"].map((w, i) => (
           <motion.span key={i} variants={wordVariants} className="inline-block mr-2 md:mr-3 transform-gpu will-change-[opacity,transform]">
             {w}
           </motion.span>
        ))}
        
        <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F] transform-gpu">
          wanted
        </motion.span>
        
        <motion.span variants={wordVariants} className="inline-block mx-2 text-gray-700 transform-gpu">—</motion.span>
        <motion.span variants={wordVariants} className="inline-block transform-gpu">with </motion.span>
        <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 transform-gpu">AI </motion.span>
        <motion.span variants={wordVariants} className="inline-block transform-gpu">precision.</motion.span>
      </motion.h1>
      
      {/* 3. Paragraph */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-gray-400 text-sm md:text-lg max-w-2xl mb-10 font-medium leading-relaxed transform-gpu will-change-[opacity,transform]"
      >
        Stop wasting months on random workouts. BodyMax AI scans your physical metrics, identifies your weak points, and engineers a precise, data-driven plan to reach your ideal physique.
      </motion.p>

      {/* 4. Button Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="w-full flex justify-center transform-gpu"
      >
        <MagneticButton text="Continue →" onClick={onNext} />
      </motion.div>
      
    </motion.div>
  );
};

export default MissionStep;