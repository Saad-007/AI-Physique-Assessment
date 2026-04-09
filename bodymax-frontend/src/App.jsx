import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';
import SocialProofStep from './components/steps/SocialProofStep';
import AssessmentFlow from './components/steps/AssessmentFlow';
import AnalyzingStep from './components/steps/AnalyzingStep'; 
import PaywallModal from './components/ui/PaywalModal';
import SuccessPage from './components/ui/SuccessPage';
import Dashboard from './components/steps/Dashboard';
import LoginPage from './components/ui/Login';

const BodyMaxFunnel = () => {
  // 1 se start karein
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({});
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. SCROLL TO TOP ON STEP CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // 2. INITIALIZATION & SESSION CHECK
  useEffect(() => {
    const initApp = async () => {
      // Check for standalone PWA mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      const needsAccount = localStorage.getItem('pendingAccountCreation') === 'true';

      // Agar user ne pay kar diya hai lekin account nahi banaya (PWA context)
      if (isStandalone && needsAccount) {
        const savedData = localStorage.getItem('savedAssessmentData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
          setStep(8); // Seedha SuccessPage par jayein
        }
      }
      
      // Yahan aap check kar sakte hain agar Supabase session exist karta hai toh setStep(10)
      
      setIsInitializing(false);
    };

    initApp();
  }, []);

  // 🔴 OPTIMIZATION: Removed 'scale' property. Scale on large DOM trees causes mobile lag.
  // Using simple opacity and slight Y-axis movement is 10x faster for mobile GPUs.
  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }, 
    transition: { duration: 0.3, ease: "easeOut" } 
  };

  if (isInitializing) return (
    <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center">
        <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-12 h-12 border-2 border-[#E71B25] border-t-transparent rounded-full animate-spin"
        />
    </div>
  );

  return (
    <div
      className="relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#E71B25] selection:text-white"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* 🔴 OPTIMIZATION: Removed blur-[120px] and replaced with CSS radial gradient. 
          This looks exactly the same but completely removes GPU rendering lag on mobile */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[150vw] h-[150vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(231,27,37,0.05)_0%,transparent_60%)]"></div>
      </div>

      <div className={`w-full flex-1 flex flex-col items-center relative z-10 ${step >= 5 ? 'p-0' : 'py-12 md:py-20'}`}>
        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div key="s1" {...pageTransition} className="w-full">
              <LandingStep onNext={() => setStep(2)} onLoginClick={() => setStep(9)} />
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
            <motion.div key="s5" {...pageTransition} className="w-full min-h-[100dvh]">
              <AssessmentFlow
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(4)}
                onComplete={() => setStep(6)} 
              />
            </motion.div>
          )}
          
          {step === 6 && (
            <motion.div key="s6" {...pageTransition} className="w-full min-h-[100dvh] flex items-center justify-center">
              <AnalyzingStep 
                formData={formData} 
                onComplete={() => setStep(7)} 
              />
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="s7" {...pageTransition} className="w-full min-h-[100dvh] flex items-center justify-center p-4">
              <PaywallModal
                isOpen={true}
                formData={formData} 
                onClose={() => setStep(5)} 
                onSuccess={(plan) => {
                  const updatedFormData = { ...formData, planDuration: plan };
                  setFormData(updatedFormData);
                  localStorage.setItem('pendingAccountCreation', 'true');
                  localStorage.setItem('savedAssessmentData', JSON.stringify(updatedFormData));
                  setStep(8); 
                }} 
              />
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="s8" {...pageTransition} className="w-full min-h-[100dvh]">
              <SuccessPage 
                assessmentData={formData}
                selectedPlan={formData.planDuration}
                onGoToDashboard={() => {
                   localStorage.removeItem('pendingAccountCreation');
                   localStorage.removeItem('savedAssessmentData');
                   setStep(10);
                }}
              />
            </motion.div>
          )}

          {step === 9 && (
            <motion.div key="s9" {...pageTransition} className="w-full min-h-[100dvh]">
              <LoginPage onGoToDashboard={() => setStep(10)} />
            </motion.div>
          )}
          
          {step === 10 && (
            <motion.div key="s10" {...pageTransition} className="w-full min-h-[100dvh]">
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BodyMaxFunnel;