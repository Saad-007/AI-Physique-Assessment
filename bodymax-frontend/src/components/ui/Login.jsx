import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Fingerprint, CheckCircle2 } from 'lucide-react';
import {supabase} from "../../lib/supabase"
const LoginPage = ({onGoToDashboard}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Naya State: Login successful hone ke baad form ko hide karne ke liye
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // ==========================================
      // REAL SUPABASE LOGIN LOGIC
      // ==========================================
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMsg("Invalid email or password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Agar login theek ho jaye toh form hide karein aur success screen dikhayen
      setIsSubmitting(false);
      setIsSuccess(true);
      
    } catch (err) {
      setErrorMsg("System error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#E71B25] selection:text-white">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E71B25] mix-blend-screen filter blur-[150px] opacity-[0.08] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px] bg-[#0c0c0c] border border-white/[0.08] rounded-[1.5rem] p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            /* ==========================================
               STEP 1: LOGIN FORM VIEW
               ========================================== */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            >
              {/* LOGIN HEADER */}
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
                  className="w-14 h-14 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-4 border border-[#E71B25]/20"
                >
                  <Fingerprint className="w-6 h-6 text-[#E71B25]" strokeWidth={2} />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">System Access</h1>
                <p className="text-[#888] text-[13px] leading-relaxed px-2">
                  Welcome back. Authenticate to access your AI protocol.
                </p>
              </div>

              {/* ERROR MESSAGE ALERT */}
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-red-500 text-[11px] font-medium leading-tight">{errorMsg}</span>
                </motion.div>
              )}

              {/* LOGIN FORM */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-[#555]" />
                    </div>
                    <input 
                      type="email" required placeholder="john@example.com" disabled={isSubmitting}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#141414] border border-white/5 text-white placeholder-[#444] text-[13px] rounded-lg pl-10 pr-3 py-3.5 focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-2">
                  <div className="flex justify-between items-center ml-1 pr-1">
                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Password</label>
                    <a href="#" className="text-[10px] text-[#888] hover:text-[#E71B25] transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-[#555]" />
                    </div>
                    <input 
                      type="password" required placeholder="••••••••" disabled={isSubmitting}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-[#141414] border border-white/5 text-white placeholder-[#444] text-[13px] rounded-lg pl-10 pr-3 py-3.5 focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}} 
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}} 
                  type="submit" disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-lg font-bold text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_14px_rgba(231,27,37,0.2)] border ${
                    isSubmitting 
                    ? 'bg-[#E71B25]/50 text-white/70 border-transparent cursor-not-allowed' 
                    : 'bg-[#E71B25] hover:bg-[#c91720] text-white border-[#E71B25]/20'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                  ) : (
                    <>Initialize Dashboard <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-[11px] text-[#666]">
                  Not in the system yet?{' '}
                  <a href="/" className="text-white hover:text-[#E71B25] font-semibold transition-colors">
                    Start Assessment
                  </a>
                </p>
              </div>
            </motion.div>
          ) : (
            /* ==========================================
               STEP 2: SUCCESS VIEW (GO TO DASHBOARD)
               ========================================== */
            <motion.div 
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center text-center py-6"
            >
              <div className="w-24 h-24 bg-[#139E46]/10 border-[4px] border-[#139E46]/20 rounded-full flex items-center justify-center mb-6 relative">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-[#139E46]" strokeWidth={2.5} />
                </motion.div>
                {/* Ping animation effect on success */}
                <div className="absolute inset-0 rounded-full border border-[#139E46]/30 animate-ping opacity-50"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Authentication Complete</h2>
              <p className="text-[#888] text-[13px] leading-relaxed mb-8 px-2">
                Your credentials have been verified. Your personalized AI protocol is loaded.
              </p>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onGoToDashboard}
                className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-bold text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;