import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, X, Lock, Sparkles } from 'lucide-react';

const PaywallModal = ({ isOpen, onClose, onCheckout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Global Scrollbar Hide for Modal */}
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex items-start justify-center bg-[#050505]/95 backdrop-blur-xl overflow-y-auto hide-scrollbar px-4 py-8 md:py-12"
          >
            {/* Minimal Close Button */}
            <button 
              onClick={onClose}
              className="fixed top-5 right-5 p-2 bg-white/5 hover:bg-white/15 rounded-full transition-colors border border-white/5 z-50 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* THE MAIN CONTAINER - Narrower for better aesthetic */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-[370px] flex flex-col items-center text-center mt-2 mb-10"
            >
              
              {/* COMPACT TOP BADGE */}
              <div className="bg-[#E71B25]/10 border border-[#E71B25]/20 text-[#E71B25] px-3.5 py-1 rounded-full text-[8.5px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5 mb-4 shadow-[0_0_15px_rgba(231,27,37,0.1)]">
                <Sparkles className="w-2.5 h-2.5 fill-[#E71B25]" />
                Analysis Complete
              </div>

              {/* SLEEK HEADINGS - SCALED DOWN */}
              <h1 className="text-[20px] md:text-[22px] font-black text-white leading-[1.2] tracking-tight mb-3 px-4 drop-shadow-md">
                BodyMax Analyzed Your <br />Dream Physique
              </h1>
              
              {/* SMALL SUMMARY TEXT */}
              <p className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed mb-8 px-6 font-medium text-balance opacity-80">
                Stop guessing in the gym. Discover exactly what's holding you back and reach your goals fast.
              </p>

              {/* UNIFIED COMPACT CARD */}
              <div className="w-full bg-[#0D0D0D] rounded-[1.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/[0.06] flex flex-col">
                
                {/* SPLIT SCREEN VISUALS */}
                <div className="w-full flex h-[240px] md:h-[280px] relative border-b border-white/[0.05]">
                  {/* Left Side: Before */}
                  <div className="flex-1 relative bg-[#1A0B0B]">
                    <img src="/Today.png" alt="Present" className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-10" />
                    <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-md">Before</span>
                    </div>
                  </div>

                  {/* Right Side: After */}
                  <div className="flex-1 relative bg-[#0B1A0E]">
                     <img src="/Future.png" alt="Future" className="absolute inset-0 w-full h-full object-cover object-center" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-10" />
                     <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-md">After</span>
                     </div>
                  </div>

                  {/* Aesthetic Center Line */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 z-20" />
                </div>

                {/* ADVANCED CHECKOUT AREA */}
                <div className="p-6 md:p-7 flex flex-col text-left bg-[#111111]">
                  
                  <h3 className="text-white font-bold text-[16px] md:text-[18px] mb-6 text-center tracking-tight opacity-90">
                    Try BodyMax for 7 days
                  </h3>
                  
                  {/* Minimalist Checklist (No Circles, Small Text) */}
                  <div className="flex flex-col gap-3 mb-8 px-1">
                    {[
                      "Full-Body Score & Detailed Report",
                      "Custom 12-Week AI-Guided Protocol",
                      "Unlock your personalized plan",
                      "Crush your goals fast"
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-[16px] h-[16px] text-[#4ade80] shrink-0 mt-[1px]" strokeWidth={3} />
                        <span className="text-gray-300 text-[12px] md:text-[13px] font-medium leading-snug tracking-wide">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sleek Promo Box */}
                  <div className="w-full border border-[#4ade80]/30 bg-[#4ade80]/[0.02] rounded-xl p-3.5 mb-6 flex flex-col gap-0.5">
                    <p className="text-gray-400 text-[12px] font-medium">
                      Promo code <span className="text-[#4ade80] font-bold">MAXXING-95</span> applied
                    </p>
                    <p className="text-[#4ade80] font-black text-[13px] uppercase tracking-wider">
                      You save -95%
                    </p>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex justify-between items-end mb-6 px-1">
                    <span className="text-white font-bold text-[14px]">Total today:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-600 line-through text-[12px] font-bold mb-[1px]">$19.99</span>
                      <span className="text-white font-black text-[28px] md:text-[32px] leading-none tracking-tighter drop-shadow-md">$0.99</span>
                    </div>
                  </div>

                  {/* PREMIUM CHECKOUT BUTTON */}
                  <motion.button 
                    whileHover={{ scale: 1.015 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheckout}
                    className="w-full bg-[#E71B25] hover:bg-[#d41820] text-white py-3.5 rounded-xl font-black text-[14px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(231,27,37,0.25)] border border-[#ff4747]/20"
                  >
                    {/* Clean Two-tone Credit Card */}
                    <div className="relative flex items-center justify-center">
                      <CreditCard className="w-[20px] h-[20px] text-white" strokeWidth={2} />
                      <div className="absolute left-[3px] top-[4px] w-[5px] h-[3px] bg-[#FFD700] rounded-[1px] opacity-70" />
                    </div>
                    Pay Now
                  </motion.button>

                  {/* Secure Footer */}
                  <div className="mt-6 flex flex-col items-center gap-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Lock className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
                    </div>
                    <p className="text-gray-600 text-[9px] leading-relaxed text-center font-medium max-w-[280px]">
                        Bound by Maxxing's{' '}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Privacy</a>,{' '}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Terms</a> and{' '}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Refunds</a>.
                    </p>
                  </div>

                </div>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;