import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';

const BodyMaxFunnel = () => {
  const [step, setStep] = useState(1);

  return (
    // Added a subtle radial gradient background for depth
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-[#050505] to-[#050505] flex flex-col items-center justify-center p-6 font-sans text-white overflow-hidden">
      
      {/* Container to restrict max width and keep content centered */}
      <div className="max-w-4xl w-full flex flex-col items-center justify-center relative min-h-[600px]">
        
        {/* AnimatePresence handles the unmounting/mounting animations smoothly */}
        <AnimatePresence mode="wait">
          {step === 1 && <LandingStep key="step1" onNext={() => setStep(2)} />}
          {step === 2 && <MissionStep key="step2" onNext={() => setStep(3)} />}
          {step === 3 && <ComparisonStep key="step3" onNext={() => console.log("Init AI Flow")} />}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BodyMaxFunnel;