import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';
import SocialProofStep from './components/steps/SocialProofStep';
import AssessmentFlow from './components/steps/AssessmentFlow'; 
import UpgradedBodyModal from './components/steps/UpgradedBodyModal'; 
import TrustUpflowPage from './components/steps/TrustUpflowPage'; 

const BodyMaxFunnel = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showUpgradedModal, setShowUpgradedModal] = useState(false);
  const [resumeAssessment, setResumeAssessment] = useState(false); // <--- NAYA STATE ADD KIYA

  // Smooth universal transition for page turns
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, filter: "blur(5px)" },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  return (
    <div 
      className={`relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#E71B25] selection:text-white ${
        step >= 5 ? 'py-0' : 'py-12 md:py-20'
      }`}
    >
      
      {/* Background Gradients & Textures */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E71B25] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.04] pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="s1" {...pageTransition} className="w-full">
              <LandingStep onNext={() => setStep(2)} />
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div key="s2" {...pageTransition} className="w-full">
              <MissionStep onNext={() => setStep(3)} />
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div key="s3" {...pageTransition} className="w-full">
              <ComparisonStep onNext={() => setStep(4)} />
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div key="s4" {...pageTransition} className="w-full">
              <SocialProofStep onNext={() => setStep(5)} />
            </motion.div>
          )}
          
          {step === 5 && (
            <motion.div key="s5" {...pageTransition} className="w-full min-h-screen">
              <AssessmentFlow 
                formData={formData} 
                setFormData={setFormData} 
                onOpenUpgradedModal={() => setShowUpgradedModal(true)}
                onBack={() => setStep(4)} 
                resumeAssessment={resumeAssessment} // <--- PROPS MEIN PASS KIYA
                setResumeAssessment={setResumeAssessment} // <--- PROPS MEIN PASS KIYA
              />
            </motion.div>
          )}

          {/* STEP 6: The Trust Page */}
          {step === 6 && (
            <motion.div key="s6" {...pageTransition} className="w-full">
              <TrustUpflowPage 
                onFinalCheckout={() => {
                  console.log("FINAL CHECKOUT! Sending user to Stripe with data:", formData);
                }}
                onBack={() => {
                  setResumeAssessment(true); // <--- WAPIS AAKHRI SLIDE PAR BHEJEGA
                  setStep(5);
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* The Upgraded Body Modal (Shows over Step 5) */}
      <UpgradedBodyModal 
        isOpen={showUpgradedModal} 
        onGetPlan={() => {
          setShowUpgradedModal(false);
          setTimeout(() => {
            setStep(6);
          }, 300);
        }} 
        onClose={() => {
          setShowUpgradedModal(false);
          setResumeAssessment(true); // <--- WAPIS AAKHRI SLIDE PAR BHEJEGA
        }}
      />

    </div>
  );
};

export default BodyMaxFunnel;