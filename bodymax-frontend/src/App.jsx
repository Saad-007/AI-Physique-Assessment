import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';
import SocialProofStep from './components/steps/SocialProofStep';
import AssessmentFlow from './components/steps/AssessmentFlow';
import PaywallModal from './components/ui/PaywalModal';
import SuccessPage from './components/ui/SuccessPage';
import Dashboard from './components/steps/Dashboard';
// import LandingStep from './components/steps/LandingStep';
import LoginPage from './components/ui/Login';
const BodyMaxFunnel = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Smooth universal transition for page turns
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, filter: "blur(5px)" },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  return (
    <div
      className={`relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#E71B25] selection:text-white ${step >= 5 ? 'py-0' : 'py-12 md:py-20'
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
              <LandingStep onNext={() => setStep(2)} 
                onLoginClick={() => setStep(8)}
                />
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
                onBack={() => setStep(4)}
                onComplete={() => setStep(6)} // <--- 🔴 YEH LINE ADD KAREIN
              />
            </motion.div>
          )}
          {/* === STEP 6: DIRECT PAYWALL / CHECKOUT === */}
          {step === 6 && (
            <motion.div key="s6" {...pageTransition} className="w-full min-h-screen flex items-center justify-center">
              <PaywallModal
                isOpen={true}
                onClose={() => setStep(5)}
                onSuccess={() => setStep(7)} // <--- YEH NAYI LINE ADD KAREIN
              />
            </motion.div>
          )}
          {/* === NAYA STEP 7: DIRECT SUCCESS PAGE TEST === */}
          {step === 7 && (
            <motion.div key="s7" {...pageTransition} className="w-full min-h-screen">
              <SuccessPage 
                assessmentData={formData} 
                onGoToDashboard={() => setStep(9)} // <--- YEH PROP ZAROOR PASS KAREIN
              />
            </motion.div>
          )}

          {/* === NAYA STEP 8: LOGIN PAGE === */}
          {step === 8 && (
            <motion.div key="s8" {...pageTransition} className="w-full min-h-screen">
              <LoginPage 
                onGoToDashboard={() => setStep(9)} // <--- YEH PROP ZAROOR PASS KAREIN
              />
            </motion.div>
          )}
          {/* === NAYA STEP 9: PREMIUM DASHBOARD === */}
          {step === 9 && (
            <motion.div key="s9" {...pageTransition} className="w-full min-h-screen">
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default BodyMaxFunnel;