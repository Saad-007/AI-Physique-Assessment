import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';
import SocialProofStep from './components/steps/SocialProofStep';
import AssessmentFlow from './components/steps/AssessmentFlow'; // Imported the new engine

const BodyMaxFunnel = () => {
  const [step, setStep] = useState(1);
  
  // Master state to hold all the user's answers for your AI backend
  const [formData, setFormData] = useState({});

  return (
    <div 
      // Made padding dynamic: The funnel has padding, but the Assessment form takes up the full screen
      className={`relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#ff5a1f] selection:text-white ${
        step === 5 ? 'py-0' : 'py-12 md:py-20'
      }`}
    >
      
      {/* Background Gradients & Textures */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff5a1f] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.04] pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && <LandingStep key="s1" onNext={() => setStep(2)} />}
          {step === 2 && <MissionStep key="s2" onNext={() => setStep(3)} />}
          {step === 3 && <ComparisonStep key="s3" onNext={() => setStep(4)} />}
          {step === 4 && <SocialProofStep key="s4" onNext={() => setStep(5)} />}
          
          {/* Passed formData down so AssessmentFlow can update the master state. 
            When they finish, this formData object goes straight to your MERN backend! 
          */}
          {step === 5 && (
            <AssessmentFlow 
              key="s5" 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default BodyMaxFunnel;