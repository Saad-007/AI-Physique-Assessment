import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, X, MoreVertical } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    // Detect if the user is on an iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIOS(true);
    }

    // Listen for the native Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the native 1-click install prompt for Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowManualPrompt(false);
      }
    } else {
      // Agar native prompt available nahi hai (like iOS ya unsupported browser), toh Manual Instructions dikhayein
      setShowManualPrompt(true);
    }
  };

  return (
    <>
      {/* 🔴 THE PERMANENT BIG INSTALL BUTTON */}
      <button 
        onClick={handleInstallClick}
        className="w-full flex items-center justify-center gap-2 bg-[#E71B25] hover:bg-[#C6161F] text-white px-6 py-4 rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-[0_10px_30px_rgba(231,27,37,0.3)] transition-all transform-gpu hover:scale-[1.02]"
      >
        <Download className="w-5 h-5" /> Install App
      </button>

      {/* 🔴 MANUAL INSTRUCTION POPUP (Agar Auto-Install block ho) */}
      <AnimatePresence>
        {showManualPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#111]/95 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[9999]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[15px] font-black text-white uppercase tracking-wider mb-1">Add to Home Screen</h3>
                <p className="text-[11px] text-gray-400 font-medium">Follow these steps to install the app natively.</p>
              </div>
              <button onClick={() => setShowManualPrompt(false)} className="p-2 bg-white/[0.05] rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-black/60 border border-white/[0.05] rounded-2xl p-5 flex flex-col gap-4">
              {isIOS ? (
                // --- iOS (iPhone) INSTRUCTIONS ---
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <Share className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] text-gray-300 font-medium leading-snug">1. Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.</span>
                  </div>
                  <div className="w-px h-4 bg-white/[0.1] ml-5"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-400 flex items-center justify-center border border-white/[0.1] shrink-0">
                      <PlusSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] text-gray-300 font-medium leading-snug">2. Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.</span>
                  </div>
                </>
              ) : (
                // --- ANDROID / CHROME FALLBACK INSTRUCTIONS ---
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-400 flex items-center justify-center border border-white/[0.1] shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] text-gray-300 font-medium leading-snug">1. Tap the <strong className="text-white">3-Dots Menu</strong> in your browser's top corner.</span>
                  </div>
                  <div className="w-px h-4 bg-white/[0.1] ml-5"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] text-gray-300 font-medium leading-snug">2. Select <strong className="text-white">"Install App"</strong> or <strong className="text-white">"Add to Home Screen"</strong>.</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;