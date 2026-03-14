import React from 'react';
import { motion } from 'framer-motion';
import GlowingButton from '../GlowingButton';

// Reusable animation variants for smooth fade-ups
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const LandingStep = ({ onNext }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center w-full"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.div variants={fadeInUp} className="border border-gray-700/50 bg-gray-800/20 backdrop-blur-sm rounded-full px-5 py-2 text-xs text-gray-300 tracking-widest uppercase mb-8 flex items-center gap-2 shadow-lg">
        <motion.span 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-orange-500"
        >
          ⚡
        </motion.span> 
        AI Physique Assessment
      </motion.div>
      
      <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight leading-[1.1] mb-6">
        What's your real <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a1f] to-[#ff8c42]">BodyMax</span> Score?
      </motion.h1>
      
      <motion.p variants={fadeInUp} className="text-gray-400 text-lg md:text-xl max-w-xl mb-12 font-light">
        Find out exactly what's holding your physique back — and the fastest path to your dream body.
      </motion.p>

      {/* Staggered Stat Counters */}
      <motion.div variants={fadeInUp} className="flex justify-center gap-8 md:gap-20 mb-6">
        {[
          { value: "200K+", label: "Gym Guys" },
          { value: "91%", label: "See Results" },
          { value: "12 WKS", label: "Avg. Time" }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className="flex flex-col items-center"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <span className="text-3xl md:text-4xl font-bold text-[#ff5a1f]">{stat.value}</span>
            <span className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <GlowingButton text="Discover My Score →" onClick={onNext} />
      
      <motion.div variants={fadeInUp} className="mt-8 flex items-center text-xs text-gray-500 font-medium tracking-wide">
        <span className="text-green-500 mr-2 animate-pulse">●</span> Free • 2 minutes • Instant results
      </motion.div>
    </motion.div>
  );
};

export default LandingStep;