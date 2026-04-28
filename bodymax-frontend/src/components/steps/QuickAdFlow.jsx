import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
// Agar aapke paas Upload/Image compression ka koi helper function hai toh wo import kar lein

const QuickAdFlow = ({ onUnlockFull }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scores, setScores] = useState(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Temporary local preview
    const previewUrl = URL.createObjectURL(file);
    setPhotoUrl(previewUrl);
    setIsAnalyzing(true);

    try {
        // 🔴 YAHAN APNA BACKEND CALL LIKHEIN
        // Yeh call sirf base image score mangayega AI se, kyunke Age/Weight abhi missing hai.
        const formData = new FormData();
        formData.append('image', file);
        formData.append('mode', 'quick_scan'); // Backend ko batane ke liye ke yeh quick scan hai

        const response = await fetch('/api/analyze-quick', { // Apna API route use karein
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Assume backend wapas aisi object bhej raha hai:
        // { overall: 82, chest: 76, shoulders: 80, arms: 78, legs: 70, core: 75 }
        setScores(data.scores || data); 
    } catch (error) {
        console.error("Quick Scan Failed", error);
        // Fallback or show error
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
      
      {/* 1. Upload State */}
      {!photoUrl && !isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center bg-white/[0.05] border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold text-[#E71B25] uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Instant Biometric Scan
            </span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">
            Discover Your<br/>True Baseline.
          </h2>
          <p className="text-sm text-gray-400 mb-8 font-medium">
            Upload a clear, front-facing photo. Our AI will instantly grade your physique metrics on a professional scale.
          </p>

          <label className="w-full aspect-[4/5] bg-[#0a0a0a] border-2 border-dashed border-white/10 hover:border-[#E71B25]/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.02]">
             <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
             <div className="w-16 h-16 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-4 text-[#E71B25]">
                <Camera className="w-8 h-8" />
             </div>
             <span className="text-white font-bold text-lg">Tap to Upload Photo</span>
             <span className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Secure & Private</span>
          </label>
        </motion.div>
      )}

      {/* 2. Analyzing State */}
      {isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#E71B25] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Scanning Muscle Vectors...</h3>
            <p className="text-sm text-gray-500 mt-2">Running computer vision protocols.</p>
        </motion.div>
      )}

      {/* 3. Results State (The Hook) */}
      {scores && !isAnalyzing && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <h2 className="text-2xl font-black text-center text-white uppercase tracking-tight mb-6">
               Scan Complete.
            </h2>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 mb-8">
               <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall BodyMax</span>
                   <span className="text-2xl font-black text-[#22c55e]">{scores.overall || 78}/100</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Aap yahan loop laga sakte hain mapping ke liye */}
                  <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Chest</span>
                      <span className="text-white font-black text-lg">{scores.chest || 76}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Shoulders</span>
                      <span className="text-white font-black text-lg">{scores.shoulders || 80}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Arms</span>
                      <span className="text-white font-black text-lg">{scores.arms || 79}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Core</span>
                      <span className="text-white font-black text-lg">{scores.core || 81}</span>
                  </div>
               </div>
            </div>

            {/* The Paywall Teaser */}
            <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 text-center overflow-hidden mb-6">
               <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex flex-col items-center justify-center z-10">
                   <Lock className="w-6 h-6 text-[#E71B25] mb-2" />
                   <span className="text-[10px] font-bold text-white uppercase tracking-widest">Analysis Locked</span>
               </div>
               {/* Dummy blurred content behind the lock */}
               <div className="opacity-30 filter blur-sm select-none">
                   <div className="h-4 bg-gray-500 rounded w-3/4 mx-auto mb-3"></div>
                   <div className="h-4 bg-gray-500 rounded w-1/2 mx-auto mb-3"></div>
                   <div className="h-10 bg-gray-600 rounded mt-4"></div>
               </div>
            </div>

            <p className="text-xs text-gray-400 text-center mb-6 font-medium">
               Complete your physical profile (Age, Weight, Goal) to unlock your in-depth metabolic gap analysis and your custom 12-week protocol.
            </p>

            <button 
                onClick={() => onUnlockFull(scores)} // Move to Step 5
                className="w-full py-4 bg-[#E71B25] hover:bg-red-700 text-white font-bold text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
            >
               Unlock Full Report <ArrowRight className="w-4 h-4" />
            </button>
         </motion.div>
      )}

    </div>
  );
};

export default QuickAdFlow;