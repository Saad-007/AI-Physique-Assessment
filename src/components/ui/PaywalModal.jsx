import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, ShieldCheck, Star, CreditCard, X, Zap } from 'lucide-react';
import { MagneticButton } from './MagneticButton'; 

const PaywallModal = ({ isOpen, onClose, onCheckout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505]/98 backdrop-blur-3xl px-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            // COLOR FIX: Updated RGBA shadow to match the red theme (rgba(231,27,37,0.15))
            className="bg-[#0a0a0a] border border-white/[0.05] rounded-[2rem] p-6 md:p-7 w-full max-w-[380px] shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(231,27,37,0.15)] relative overflow-hidden flex flex-col items-center text-center"
          >
            {/* Ambient Top Glow */}
            {/* COLOR FIX: via-[#E71B25]/80 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E71B25]/80 to-transparent blur-[0.5px]"></div>
            {/* COLOR FIX: bg-[#E71B25] */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#E71B25] blur-[40px] opacity-30 rounded-full pointer-events-none"></div>

            {/* Premium Micro-Badge */}
            {/* COLOR FIX: bg-[#E71B25]/10 border-[#E71B25]/20 text-[#E71B25] */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] text-[9px] font-bold tracking-[0.2em] uppercase mb-4">
              <Zap className="w-3 h-3 fill-[#E71B25]" /> Final Step
            </div>

            {/* Floating Lock Icon */}
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-12 h-12 bg-gradient-to-b from-[#E71B25]/20 to-[#E71B25]/5 border border-[#E71B25]/30 rounded-full flex items-center justify-center mb-4 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]"
            >
              <Lock className="w-5 h-5 text-[#E71B25]" strokeWidth={2.5} />
            </motion.div>

            {/* High-Density Headline */}
            <h2 className="text-[22px] md:text-2xl font-black uppercase tracking-tighter mb-2 text-white leading-tight">
              {/* COLOR FIX: from-[#E71B25] to-[#C6161F] */}
              Your AI Report is <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#E71B25] to-[#C6161F]">Ready</span>
            </h2>
            <p className="text-gray-400 text-[13px] mb-5 text-balance leading-relaxed">
              Unlock your exact BodyMax score, weak points analysis, and 12-week transformation plan.
            </p>

            {/* Dense Inset Checklist Box (Success items left green) */}
            <div className="w-full bg-[#030303] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-gray-800/60 rounded-2xl p-4 mb-5 text-left flex flex-col gap-2.5 relative">
              {[
                "Complete physique gap analysis",
                "AI-generated weak point strategy",
                "12-Week personalized protocol",
                "Calculated macro targets"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="bg-green-500/10 rounded-full p-0.5 mt-0.5 shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-500" strokeWidth={3} />
                  </div>
                  <span className="text-[12px] md:text-[13px] text-gray-300 font-semibold leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {/* Tighter Price Display */}
            <div className="flex items-end justify-center gap-2 mb-5">
              <span className="text-gray-500 line-through text-base font-bold mb-1.5">$99</span>
              <span className="text-5xl font-black text-white tracking-tighter leading-none">$29<span className="text-2xl text-gray-300">.99</span></span>
            </div>

            {/* Action Button */}
            <div className="w-full flex justify-center mb-4">
              <MagneticButton 
                text="Unlock My Plan Now →" 
                onClick={onCheckout} 
              />
            </div>

            {/* Micro-Trust Badges */}
            <div className="flex items-center justify-center gap-3 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure</div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <div className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Stripe</div>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <div className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" /> 4.9/5</div>
            </div>

            {/* Crisp, Minimal Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-white hover:bg-white/10 transition-colors rounded-full"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;