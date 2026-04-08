import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingStep from './components/steps/LandingStep';
import MissionStep from './components/steps/MissionStep';
import ComparisonStep from './components/steps/ComparsionStep';
import SocialProofStep from './components/steps/SocialProofStep';
import AssessmentFlow from './components/steps/AssessmentFlow';
// 🔴 NAYA IMPORT YAHAN HAI
import AnalyzingStep from './components/steps/AnalyzingStep'; 
import PaywallModal from './components/ui/PaywalModal';
import SuccessPage from './components/ui/SuccessPage';
import Dashboard from './components/steps/Dashboard';
import LoginPage from './components/ui/Login';

const BodyMaxFunnel = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({});
  const [isInitializing, setIsInitializing] = useState(true);

  // PWA MAGIC ROUTING LOGIC
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const needsAccount = localStorage.getItem('pendingAccountCreation') === 'true';

    if (isStandalone && needsAccount) {
      const savedData = localStorage.getItem('savedAssessmentData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      setStep(8); // Step 8 is now SuccessPage
    }
    
    setIsInitializing(false);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }, 
    transition: { duration: 0.35, ease: "easeOut" }
  };

  if (isInitializing) return <div className="min-h-screen bg-[#030303]"></div>;

  return (
    <div
      className={`relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#E71B25] selection:text-white ${step >= 5 ? 'py-0' : 'py-12 md:py-20'}`}
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[600px] max-h-[600px] bg-[#E71B25] rounded-full opacity-[0.04] pointer-events-none z-0 blur-[100px] md:blur-[150px] transform-gpu will-change-transform"></div>

      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10">
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
            <motion.div key="s5" {...pageTransition} className="w-full min-h-screen">
              <AssessmentFlow
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(4)}
                onComplete={() => setStep(6)} // 🔴 Assessment ke baad Step 6 (Analyzing) par jaye
              />
            </motion.div>
          )}
          
          {/* 🔴 NEW STEP 6: ANALYZING SCREEN IMPORTED */}
          {step === 6 && (
            <motion.div key="s6" {...pageTransition} className="w-full min-h-screen flex items-center justify-center">
              <AnalyzingStep 
                formData={formData} 
                onComplete={() => setStep(7)} // 🔴 Analyze hone ke baad Step 7 (Paywall) par jaye
              />
            </motion.div>
          )}

          {/* 🔴 PAYWALL (Now Step 7) */}
          {step === 7 && (
            <motion.div key="s7" {...pageTransition} className="w-full min-h-screen flex items-center justify-center">
              <PaywallModal
                isOpen={true}
                formData={formData} 
                onClose={() => setStep(5)} 
                onSuccess={(plan) => {
                  const updatedFormData = { ...formData, planDuration: plan };
                  setFormData(updatedFormData);
                  
                  localStorage.setItem('pendingAccountCreation', 'true');
                  localStorage.setItem('savedAssessmentData', JSON.stringify(updatedFormData));
                  
                  setStep(8); // Go to SuccessPage
                }} 
              />
            </motion.div>
          )}

          {/* 🔴 SUCCESS PAGE (Now Step 8) */}
          {step === 8 && (
            <motion.div key="s8" {...pageTransition} className="w-full min-h-screen">
              <SuccessPage 
                assessmentData={formData}
                selectedPlan={formData.planDuration}
                onGoToDashboard={() => {
                   localStorage.removeItem('pendingAccountCreation');
                   localStorage.removeItem('savedAssessmentData');
                   setStep(10); // Go to Dashboard
                }}
              />
            </motion.div>
          )}

          {/* 🔴 LOGIN PAGE (Now Step 9) */}
          {step === 9 && (
            <motion.div key="s9" {...pageTransition} className="w-full min-h-screen">
              <LoginPage onGoToDashboard={() => setStep(10)} />
            </motion.div>
          )}
          
          {/* 🔴 DASHBOARD (Now Step 10) */}
          {step === 10 && (
            <motion.div key="s10" {...pageTransition} className="w-full min-h-screen">
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BodyMaxFunnel;