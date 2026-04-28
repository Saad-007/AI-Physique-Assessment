import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactGA from 'react-ga4'; // 🔴 ADDED: Google Analytics Import

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
import { supabase } from './lib/supabase';
import QuickAdFlow from './components/steps/QuickAdFlow';

const EXPIRATION_TIME = 60 * 60 * 1000; 

// 🔴 ADDED: Initialize Google Analytics outside the component so it runs once
// Replace "G-XXXXXXXXXX" with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-M3423551QG"; 
ReactGA.initialize(GA_MEASUREMENT_ID);

const BodyMaxFunnel = () => {

  // ==========================================
  // 1. SMART STEP INITIALIZATION & TIMEOUT LOGIC
  // ==========================================
  const [step, setStep] = useState(() => {
    if (typeof window !== 'undefined') {



      // 🔴 1. NAYA RULE: Check for Marketing Quick Mode URL
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('mode') === 'quick') {
         return 100; // '100' is the magic number for our ad funnel
      }
      // Rule A: Password reset
      if (window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')) return 11;
      
      // Rule B: Check if User is already Logged In (Cookies/Session)
      const sbToken = localStorage.getItem('sb-qdqlwfchjasdzyopcqby-auth-token'); 
      if (sbToken) {
         return 10; // Seedha Dashboard
      }

      // Rule C: Standalone Mode (PWA) Checks
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      
      // THE iOS FIX: Check for Android (hasAccount) OR iPhone (Fresh Sandbox)
      const hasAccount = localStorage.getItem('accountCreated') === 'true';
      const isFreshSandbox = !localStorage.getItem('currentFunnelStep') && !localStorage.getItem('lastActiveTime');
      
      // Agar App Home Screen se open hui hai (PWA mode) 
      if (isStandalone && (hasAccount || isFreshSandbox)) {
         return 9; // 9 = Login Page
      }

      // Agar PWA handoff ke beech mein Android par PWA add karta hai (Legacy Fallback)
      const needsAccount = localStorage.getItem('pendingAccountCreation') === 'true';
      if (isStandalone && needsAccount && localStorage.getItem('savedAssessmentData')) return 8;

      // Rule D: Expiration Logic
      const lastActiveTime = localStorage.getItem('lastActiveTime');
      const isExpired = lastActiveTime && (Date.now() - parseInt(lastActiveTime, 10) > EXPIRATION_TIME);

      if (isExpired) {
        localStorage.removeItem('currentFunnelStep');
        localStorage.removeItem('draftFormData');
        localStorage.removeItem('assessmentCurrentIndex');
        localStorage.removeItem('pendingAccountCreation');
        return 1;
      }

      // Resume from where they left off
      const savedStep = localStorage.getItem('currentFunnelStep');
      if (savedStep) return parseInt(savedStep, 10);
    }
    return 1;
  });

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

  // 🔴 ADDED: Google Analytics Page View Tracker
  // Jab bhi 'step' change hoga, ye block GA4 ko batayega ke naya page open hua hai
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track Funnel Steps in Google Analytics
    let stepName = `Step ${step}`;
    if (step === 1) stepName = "Landing Page";
    if (step === 5) stepName = "Assessment Flow";
    if (step === 7) stepName = "Paywall Modal";
    if (step === 8) stepName = "Success/Checkout";
    if (step === 9) stepName = "Login Page";
    if (step === 10) stepName = "Dashboard";

    ReactGA.send({ hitType: "pageview", page: `/step-${step}`, title: stepName });
    
  }, [step]);

  useEffect(() => {
    if (!isInitializing) {
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
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:32px_32px]"></div>
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[150vw] h-[150vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(231,27,37,0.05)_0%,transparent_60%)]"></div>
      </div>

      <div className={`w-full flex-1 flex flex-col items-center relative z-10 ${step >= 5 ? 'p-0' : 'py-12 md:py-20'}`}>
        <AnimatePresence mode="wait">


          {/* 🔴 NAYA STEP: Marketing Ad Quick Flow */}
         {step === 100 && (
            <motion.div key="s100" {...pageTransition} className="w-full">
              <QuickAdFlow 
                onUnlockFull={(quickScanScores) => {
                  // Jab user "Unlock Full Report" dabaye
                  // 1. Agar humein photo/scores ko form data mein save karna hai toh kar lein
                  setFormData({ ...formData, quickScanScores: quickScanScores });
                  
                  // 2. User ko Step 5 (AssessmentFlow) par bhej dein jahan wo baqi Age, Weight wagara dalega
                  setStep(5);
                }} 
              />
            </motion.div>
          )}
         {step === 1 && (
            <motion.div key="s1" {...pageTransition} className="w-full">
              <LandingStep 
                onNext={() => {
                  ReactGA.event({ category: "Funnel", action: "onboarding_started" });
                  setStep(2);
                }} 
                onLoginClick={() => setStep(9)} 
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...pageTransition} className="w-full">
              <MissionStep onNext={() => setStep(3)} onBack={() => setStep(1)} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...pageTransition} className="w-full">
              <ComparisonStep onNext={() => setStep(4)} onBack={() => setStep(2)} />
            </motion.div>
          )}

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
                onComplete={() => {
                  ReactGA.event({ category: "Funnel", action: "onboarding_completed" });
                  setStep(6);
                }} 
              />
            </motion.div>
          )}
          
          {step === 6 && (
            <motion.div key="s6" {...pageTransition} className="w-full min-h-[100dvh] flex items-center justify-center">
              <AnalyzingStep 
                formData={formData} 
                onComplete={() => {
                  ReactGA.event({ category: "Funnel", action: "paywall_viewed" });
                  setStep(7);
                }} 
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
                  // 🔴 WAQAS REQUIREMENT: Event 4
                  ReactGA.event({ category: "Funnel", action: "purchase_completed" });
                  
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