import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from "../../lib/supabase";

const ResetPassword = ({ onComplete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Supabase automatically picks up the access_token from the URL hash
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        if (onComplete) onComplete();
        else window.location.href = '/login'; // Fallback
      }, 3000);

    } catch (err) {
      setErrorMsg(err.message || "Failed to update password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] bg-[#0a0a0a] border border-white/5 rounded-[1.2rem] p-7 shadow-2xl relative overflow-hidden"
      >
        {!isSuccess ? (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-4 border border-[#E71B25]/20">
                <Lock className="w-5 h-5 text-[#E71B25]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Set New Password</h1>
              <p className="text-gray-400 text-xs mt-2">Enter your new secure access credentials.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-500 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type="password" required placeholder="••••••••" 
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#111] border border-white/5 text-white placeholder-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#E71B25]/40 transition-all"
                  />
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={isSubmitting}
                className="w-full py-3 bg-[#E71B25] hover:bg-[#c91720] rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-lg font-bold">Success!</h2>
            <p className="text-gray-400 text-xs mt-2">Password updated. Redirecting to login...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;