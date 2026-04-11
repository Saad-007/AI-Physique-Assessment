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
import ResetPassword from './components/ui/ResetPassword';

// 🔴 SESSION EXPIRATION TIME (1 Hour in milliseconds)
const EXPIRATION_TIME = 60 * 60 * 1000; 

const BodyMaxFunnel = () => {

  // ==========================================
  // 1. SMART STEP INITIALIZATION & TIMEOUT LOGIC
  // ==========================================
  const [step, setStep] = useState(() => {
    if (typeof window !== 'undefined') {
      // Rule A: Password reset
      if (window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')) return 11;
      
      // Rule B: PWA Handoff
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      const needsAccount = localStorage.getItem('pendingAccountCreation') === 'true';
      if (isStandalone && needsAccount && localStorage.getItem('savedAssessmentData')) return 8;

      // 🔴 Rule C: Check Expiration Time for normal users
      const lastActiveTime = localStorage.getItem('lastActiveTime');
      const isExpired = lastActiveTime && (Date.now() - parseInt(lastActiveTime, 10) > EXPIRATION_TIME);

      if (isExpired) {
        // Agar time poora ho gaya hai toh purana kachra saaf kar dein aur Step 1 se shuru karein
        localStorage.removeItem('currentFunnelStep');
        localStorage.removeItem('draftFormData');
        localStorage.removeItem('assessmentCurrentIndex');
        return 1;
      }

      // Agar time abhi bacha hai, toh jahan chora tha wahi se resume karein
      const savedStep = localStorage.getItem('currentFunnelStep');
      if (savedStep) return parseInt(savedStep, 10);
    }
    return 1;
  }); 

  // ==========================================
  // 2. SMART DATA INITIALIZATION
  // ==========================================
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      const needsAccount = localStorage.getItem('pendingAccountCreation') === 'true';
      
      if (isStandalone && needsAccount) {
        const savedData = localStorage.getItem('savedAssessmentData');
        if (savedData) {
          try { return JSON.parse(savedData); } catch(e) {}
        }
      }
      
      const lastActiveTime = localStorage.getItem('lastActiveTime');
      const isExpired = lastActiveTime && (Date.now() - parseInt(lastActiveTime, 10) > EXPIRATION_TIME);
      
      // Sirf tab purana data wapis do jab wo expire na hua ho
      if (!isExpired) {
        const savedDraftData = localStorage.getItem('draftFormData');
        if (savedDraftData) {
          try { return JSON.parse(savedDraftData); } catch(e) {}
        }
      }
    }
    return {};
  });

  const [isInitializing, setIsInitializing] = useState(false);

  // SCROLL TO TOP ON STEP CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // ==========================================
  // 3. AUTO-SAVE STATE & TIMESTAMP (LOGOUT BUG FIXED)
  // ==========================================
  useEffect(() => {
    if (!isInitializing) {
      // 🔴 THE FIX: Sirf Tab Save karo jab user Funnel (Steps 1 to 7) mein ho.
      // Agar Dashboard (10) ya Login (9) par hai toh memory clear kar do taake logout pr reset ho jaye.
      if (step < 8) {
        localStorage.setItem('currentFunnelStep', step.toString());
        localStorage.setItem('lastActiveTime', Date.now().toString()); 
      } else {
        localStorage.removeItem('currentFunnelStep');
      }
    }
  }, [step, isInitializing]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('draftFormData', JSON.stringify(formData));
      localStorage.setItem('lastActiveTime', Date.now().toString());
    }
  }, [formData]);


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
    <div className="relative min-h-[100dvh] bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden font-sans selection:bg-[#E71B25] selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* CSS radial gradient for zero-lag mobile rendering */}
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
              <MissionStep onNext={() => setStep(3)} onBack={() => setStep(1)} />
            </motion.div>
          )}

        {/* Step 3 */}
          {step === 3 && (
            <motion.div key="s3" {...pageTransition} className="w-full">
              <ComparisonStep onNext={() => setStep(4)} onBack={() => setStep(2)} />
            </motion.div>
          )}

          {/* Step 4 (Social Proof) */}
          {step === 4 && (
            <motion.div key="s4" {...pageTransition} className="w-full">
              <SocialProofStep onNext={() => setStep(5)} onBack={() => setStep(3)} />
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
                  
                  // Marking the handoff variables before moving to Step 8
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
                   // Clear all memory when entering dashboard
                   localStorage.removeItem('pendingAccountCreation');
                   localStorage.removeItem('savedAssessmentData');
                   localStorage.removeItem('currentFunnelStep');
                   localStorage.removeItem('draftFormData');
                   localStorage.removeItem('lastActiveTime');
                   localStorage.removeItem('assessmentCurrentIndex');
                   setStep(10);
                }}
              />
            </motion.div>
          )}

          {step === 9 && (
            <motion.div key="s9" {...pageTransition} className="w-full min-h-[100dvh]">
              <LoginPage onGoToDashboard={() => {
                // Clear memory on login
                localStorage.removeItem('currentFunnelStep');
                localStorage.removeItem('draftFormData');
                localStorage.removeItem('lastActiveTime');
                setStep(10);
              }} />
            </motion.div>
          )}
          
          {step === 10 && (
            <motion.div key="s10" {...pageTransition} className="w-full min-h-[100dvh]">
              <Dashboard />
            </motion.div>
          )}

          {step === 11 && (
            <motion.div key="s11" {...pageTransition} className="w-full min-h-[100dvh]">
              <ResetPassword onComplete={() => setStep(9)} /> 
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default BodyMaxFunnel;