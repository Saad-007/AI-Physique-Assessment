import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Fingerprint, CheckCircle2, KeyRound, ChevronLeft } from 'lucide-react';
import { supabase } from "../../lib/supabase";

const LoginPage = ({ onGoToDashboard }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // UI States
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // 🔴 New State for Forgot Password
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMsg("Invalid credentials. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        const savedLocalDataStr = localStorage.getItem('savedAssessmentData');
        
        if (savedLocalDataStr) {
          const localAssessmentData = JSON.parse(savedLocalDataStr);
          const { data: profile } = await supabase.from('profiles').select('assessment_data').eq('id', data.user.id).single();
          
          // CRITICAL FIX: Only merge if local storage actually has valuable text data.
          // NEVER overwrite the images.
          const currentDbData = profile?.assessment_data || {};
          
          // Create a safe copy of local data, stripping out ALL image-related fields
          const safeLocalData = { ...localAssessmentData };
          delete safeLocalData.photos;
          delete safeLocalData.photoFiles;
          delete safeLocalData.photoPreviewUrls;
          delete safeLocalData.dreamPhysiqueImage;
          delete safeLocalData.dreamPhysiquePreview;
          delete safeLocalData.safePhotoFilesBase64;
          delete safeLocalData.safeGoalFileBase64;

          // Merge: Database takes priority for images, LocalStorage takes priority for text (if updated)
          const mergedData = { 
            ...currentDbData, 
            ...safeLocalData,
            // Explicitly protect the image URLs from the database
            photos: currentDbData.photos || null,
            dreamPhysiqueImage: currentDbData.dreamPhysiqueImage || null
          };

          await supabase.from('profiles').update({ assessment_data: mergedData }).eq('id', data.user.id);
          
          // Cleanup
          localStorage.removeItem('pendingAccountCreation');
          localStorage.removeItem('savedAssessmentData');
        }
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      
    } catch (err) {
      setErrorMsg("System offline. Please try again later.");
      setIsSubmitting(false);
    }
  };
  // 🔴 NEW: Password Reset Handler (With Strict Email Existence Check)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const targetEmail = formData.email.trim();

    if (!targetEmail) {
      setErrorMsg("Please enter your email address first.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setResetSuccessMsg('');

    try {
      // STEP 1: Manually check if the user actually exists in the 'profiles' table
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', targetEmail)
        .maybeSingle(); // maybeSingle returns null if no user is found, without throwing an error

      // If no user is found in the database, stop and show error immediately
      if (!existingUser) {
        setErrorMsg("No account found. Please input your correct/registered email.");
        setIsSubmitting(false);
        return; 
      }

      // STEP 2: If the user exists, PROCEED to send the reset link
const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
  redirectTo: `${window.location.origin}/reset-password`, 
});

      if (resetError) {
        setErrorMsg("Error: " + resetError.message);
      } else {
        setResetSuccessMsg("A secure reset link has been dispatched to your email.");
      }
      
    } catch (err) {
      setErrorMsg("System error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#E71B25] selection:text-white">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E71B25] mix-blend-screen filter blur-[120px] opacity-[0.05] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[380px] bg-[#0a0a0a] border border-white/5 rounded-[1.2rem] p-6 md:p-7 relative z-10 shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              SUCCESS VIEW (GO TO DASHBOARD)
              ========================================== */}
          {isSuccess ? (
            <motion.div 
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-20 h-20 bg-[#22c55e]/10 border-[2px] border-[#22c55e]/20 rounded-full flex items-center justify-center mb-5 relative">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}>
                  <CheckCircle2 className="w-8 h-8 text-[#22c55e]" strokeWidth={2.5} />
                </motion.div>
                <div className="absolute inset-0 rounded-full border border-[#22c55e]/30 animate-ping opacity-30"></div>
              </div>
              
              <h2 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-2 tracking-tight">Authentication Complete</h2>
              <p className="text-gray-400 text-[11px] font-medium leading-relaxed mb-8 px-2">
                Your credentials have been verified. Your personalized AI protocol is loaded.
              </p>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onGoToDashboard}
                className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ) : 
          
          /* ==========================================
             FORGOT PASSWORD VIEW
             ========================================== */
          isResetMode ? (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            >
               <button 
                  onClick={() => { setIsResetMode(false); setErrorMsg(''); setResetSuccessMsg(''); }}
                  className="flex items-center gap-1 text-[9px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors mb-6 group"
               >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Login
               </button>

              <div className="flex flex-col items-center text-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                  className="w-10 h-10 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-3 border border-[#E71B25]/20"
                >
                  <KeyRound className="w-4 h-4 text-[#E71B25]" strokeWidth={2} />
                </motion.div>
                
                <h1 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-1.5 tracking-tight">System Override</h1>
                <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-relaxed px-2">
                  Enter your email address to receive a secure link to reset your credentials.
                </p>
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-red-500/90 text-[10px] font-medium leading-snug">{errorMsg}</span>
                </motion.div>
              )}

              {resetSuccessMsg && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-2.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                  <span className="text-[#22c55e]/90 text-[10px] font-medium leading-snug">{resetSuccessMsg}</span>
                </motion.div>
              )}

              <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Account Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input 
                      type="email" required placeholder="john@example.com" disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}} 
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}} 
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 mt-2 shadow-sm ${
                    isSubmitting 
                    ? 'bg-[#E71B25]/50 text-white/70 border border-transparent cursor-not-allowed' 
                    : 'bg-[#E71B25] hover:bg-[#c91720] text-white border border-[#E71B25]/20 shadow-[0_4px_14px_rgba(231,27,37,0.15)]'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Dispatching...</>
                  ) : (
                    <>Send Recovery Link <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (

          /* ==========================================
             STEP 1: LOGIN FORM VIEW
             ========================================== */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                  className="w-10 h-10 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-3 border border-[#E71B25]/20"
                >
                  <Fingerprint className="w-4 h-4 text-[#E71B25]" strokeWidth={2} />
                </motion.div>
                
                <h1 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-1.5 tracking-tight">System Access</h1>
                <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-relaxed px-2">
                  Welcome back. Authenticate to access your AI protocol.
                </p>
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-red-500/90 text-[10px] font-medium leading-snug">{errorMsg}</span>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input 
                      type="email" required placeholder="john@example.com" disabled={isSubmitting}
                      value={formData.email} // Important for syncing email between views
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-1">
                  <div className="flex justify-between items-center ml-1 pr-1">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                    <button 
                      type="button" // Prevent form submission
                      onClick={() => { setIsResetMode(true); setErrorMsg(''); }}
                      className="text-[8px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-bold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input 
                      type="password" required placeholder="••••••••" disabled={isSubmitting}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}} 
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}} 
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 mt-2 shadow-sm ${
                    isSubmitting 
                    ? 'bg-[#E71B25]/50 text-white/70 border border-transparent cursor-not-allowed' 
                    : 'bg-[#E71B25] hover:bg-[#c91720] text-white border border-[#E71B25]/20 shadow-[0_4px_14px_rgba(231,27,37,0.15)]'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Authenticating...</>
                  ) : (
                    <>Enter Hub <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                  Not in the system yet?{' '}
                  <a href="/" className="text-white/80 hover:text-white font-black transition-colors border-b border-transparent hover:border-white pb-0.5 ml-1">
                    Start Assessment
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;