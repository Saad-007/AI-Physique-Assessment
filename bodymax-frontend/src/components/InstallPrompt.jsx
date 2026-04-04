import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // 1. Detect if the user is on an iOS device (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Check if the app is ALREADY installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      // Optional: Auto-show iOS prompt after a few seconds
      // setTimeout(() => setShowIOSPrompt(true), 5000); 
    }

    // 2. Listen for the native Install Prompt (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome's default mini-infobar from appearing
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to show the install button
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the native install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstallable(false); // Hide button after install
      } else {
        console.log('User dismissed the install prompt');
      }
      // We can only use the prompt once, so clear it
      setDeferredPrompt(null);
    }
  };

  // If app is already installed or cannot be installed, render nothing
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* THE INSTALL BUTTON (Visible on Android / Desktop OR triggering iOS Instructions) */}
      <button 
        onClick={() => isIOS ? setShowIOSPrompt(true) : handleInstallClick()}
        className="flex items-center gap-2 bg-[#E71B25]/10 hover:bg-[#E71B25]/20 text-[#E71B25] px-4 py-2 rounded-xl border border-[#E71B25]/30 transition-all text-[11px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(231,27,37,0.15)]"
      >
        <Download className="w-4 h-4" /> Install Neural App
      </button>

      {/* iOS SPECIFIC INSTRUCTION POPUP */}
      <AnimatePresence>
        {showIOSPrompt && isIOS && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#111]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[9999]"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[13px] font-black text-white uppercase tracking-wider mb-1">Install BodyMax App</h3>
                <p className="text-[10px] text-gray-400 font-medium">Add to your home screen for full-screen native experience.</p>
              </div>
              <button onClick={() => setShowIOSPrompt(false)} className="p-1.5 bg-white/[0.05] rounded-full text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Share className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-gray-300 font-medium">1. Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.</span>
              </div>
              <div className="w-px h-3 bg-white/[0.1] ml-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-500/10 text-gray-400 flex items-center justify-center border border-white/[0.1]">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-gray-300 font-medium">2. Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;