import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Check, Target, Activity, ArrowRight, RefreshCw, Sparkles, Upload, TrendingUp, Zap } from 'lucide-react';

const MagneticButton = ({ text, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.02 }} 
    whileTap={{ scale: 0.98 }} 
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 bg-[#E71B25] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(231,27,37,0.3)] transition-all"
  >
    {text}
  </motion.button>
);

const QuickAdFlow = () => {
  const [flowState, setFlowState] = useState('upload_current'); 
  
  const [currentPhotos, setCurrentPhotos] = useState({ 1: null, 2: null, 3: null });
  const [currentImgUrls, setCurrentImgUrls] = useState({ 1: null, 2: null, 3: null });
  const [activeSlot, setActiveSlot] = useState(1); 

  const [dreamPhoto, setDreamPhoto] = useState(null);
  const [dreamImgUrl, setDreamImgUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const goalUploadRef = useRef(null);

  const fallbackImg = "https://ui-avatars.com/api/?name=Scan+Missing&background=0a0a0a&color=fff&size=512";

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleCurrentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentPhotos(prev => ({ ...prev, [activeSlot]: file }));
    setCurrentImgUrls(prev => ({ ...prev, [activeSlot]: URL.createObjectURL(file) }));

    if (activeSlot === 1 && !currentPhotos[2]) setActiveSlot(2);
    else if (activeSlot === 2 && !currentPhotos[3]) setActiveSlot(3);
    
    if (galleryRef.current) galleryRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const confirmCurrentPhotos = () => {
    if (currentPhotos[1] || currentPhotos[2] || currentPhotos[3]) {
      setFlowState('upload_dream');
    }
  };

  const resetCurrentPhotos = () => {
    setCurrentPhotos({ 1: null, 2: null, 3: null });
    setCurrentImgUrls({ 1: null, 2: null, 3: null });
    setActiveSlot(1);
  };

  const handleDreamUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDreamPhoto(file);
    setDreamImgUrl(URL.createObjectURL(file));
    setFlowState('analyzing');

    try {
      const currentImagesBase64 = [];
      for (let i = 1; i <= 3; i++) {
        if (currentPhotos[i]) {
          const base64 = await fileToBase64(currentPhotos[i]);
          currentImagesBase64.push(base64);
        }
      }

      if (currentImagesBase64.length === 0) throw new Error("No current photos uploaded");
      const dreamBase64 = await fileToBase64(file);

      const backendBaseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const backendURL = `${backendBaseURL}/api/analyze-ad`; 

      const response = await fetch(backendURL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentImages: currentImagesBase64, dreamImage: dreamBase64 }) 
      });

      if (!response.ok) throw new Error("Backend API error.");

      const data = await response.json();
      setAnalysis(data); // Saving full data object
      setFlowState('results');

    } catch (error) {
      console.error("Real Analysis Failed:", error);
      alert("AI Analysis Failed! Check console logs.");
      setFlowState('upload_current'); 
    }
  };

  const resetFlow = () => {
    resetCurrentPhotos();
    setDreamPhoto(null);
    setDreamImgUrl(null);
    setAnalysis(null);
    setFlowState('upload_current');
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center pt-8 pb-24 px-4 md:px-6 bg-[#030303] font-sans">
      <AnimatePresence mode="wait">

        {/* STEP 1: UPLOAD 3 CURRENT PHOTOS */}
        {flowState === 'upload_current' && (
          <motion.div key="current" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="inline-flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1 mb-6">
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Step 1 of 2</span>
            </div>
            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-10 text-center tracking-tight leading-tight max-w-sm">
              Upload <span className="text-[#E71B25]">3 photos</span> to get your body analyzed
            </motion.h2>

            <div className="flex flex-row justify-center gap-3 md:gap-4 w-full mb-8">
              {[{ label: "Front photo", img: "/Front.jpeg", num: 1 }, { label: "Side photo", img: "/Side.jpeg", num: 2 }, { label: "Back photo", img: "/Back.jpeg", num: 3 }].map((card, i) => {
                const isUploaded = !!currentPhotos[card.num];
                const displayImg = currentImgUrls[card.num] || card.img;
                const isActive = activeSlot === card.num;

                return (
                  <motion.div key={i} onClick={() => setActiveSlot(card.num)} className="flex flex-col items-center flex-1 cursor-pointer">
                    <div className={`w-full aspect-[2/3] bg-[#111] rounded-xl md:rounded-2xl relative mb-3 overflow-visible border-2 transition-all duration-300 ${isActive ? "border-[#E71B25] shadow-[0_0_15px_rgba(231,27,37,0.3)] scale-105" : isUploaded ? "border-green-500/50" : "border-white/[0.05]"}`}>
                      <img src={displayImg} alt={card.label} className={`w-full h-full object-cover rounded-xl md:rounded-2xl transition-opacity ${isUploaded || isActive ? "opacity-100" : "opacity-40"}`} />
                      <div className={`absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm border-2 border-[#020202] transition-colors ${isUploaded ? "bg-green-500" : isActive ? "bg-[#E71B25]" : "bg-gray-800"}`}>
                        {isUploaded ? <Check className="w-4 h-4 md:w-5 md:h-5 text-black" strokeWidth={4} /> : card.num}
                      </div>
                    </div>
                    <span className={`font-semibold text-[10px] md:text-xs tracking-wide mt-2 transition-colors ${isActive ? "text-[#E71B25]" : "text-gray-400"}`}>{card.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <input type="file" accept="image/png, image/jpeg, image/webp" ref={galleryRef} onChange={handleCurrentUpload} className="hidden" />
            <input type="file" accept="image/*" capture="environment" ref={cameraRef} onChange={handleCurrentUpload} className="hidden" />

            <motion.div className="w-full flex flex-col gap-3.5 mb-6">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => galleryRef.current.click()} className="w-full flex items-center justify-center gap-3 bg-[#111] border border-white/10 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest">
                <ImageIcon className="w-5 h-5" /> Upload from Gallery
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => cameraRef.current.click()} className="w-full flex items-center justify-center gap-3 bg-[#111] border border-white/10 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest">
                <Camera className="w-5 h-5" /> Take a Photo
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {Object.values(currentPhotos).some((v) => v !== null) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full flex flex-col items-center mb-6">
                  <MagneticButton text="Confirm Photos →" onClick={confirmCurrentPhotos} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2: UPLOAD DREAM PHYSIQUE */}
        {flowState === 'upload_dream' && (
          <motion.div key="dream" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center w-full mt-2 max-w-md mx-auto">
            <div className="inline-flex items-center justify-center bg-[#E71B25]/10 border border-[#E71B25]/20 rounded-full px-3 py-1 mb-6">
              <span className="text-[10px] text-[#E71B25] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Step 2 of 2</span>
            </div>
            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-8 text-center tracking-tight leading-tight max-w-sm">
              Upload your <span className="text-[#E71B25]">Dream Goal</span>
            </motion.h2>

            <input type="file" accept="image/png, image/jpeg, image/webp" ref={goalUploadRef} onChange={handleDreamUpload} className="hidden" />
            
            <AnimatePresence mode="wait">
              {!dreamPhoto ? (
                <motion.button onClick={() => goalUploadRef.current.click()} className="flex flex-col items-center justify-center w-full aspect-[3/4] max-w-[280px] border-[1.5px] border-dashed border-[#E71B25]/40 bg-[#E71B25]/5 rounded-[2rem] mb-8 transition-colors hover:bg-[#E71B25]/10">
                  <Upload className="w-8 h-8 text-[#E71B25] mb-3" />
                  <span className="text-white font-bold tracking-wide">Tap to Upload Goal Image</span>
                  <span className="text-gray-500 text-xs mt-1">PNG, JPG, WEBP</span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 3: ANALYZING STATE */}
        {flowState === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center w-full max-w-md mx-auto min-h-[50vh]">
              <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#E71B25] rounded-full border-t-transparent animate-spin"></div>
                  <Activity className="absolute inset-0 m-auto w-8 h-8 text-[#E71B25] animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Calculating Gap...</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">Running AI vision protocols to compare current vs target muscle vectors.</p>
          </motion.div>
        )}

        {/* =========================================
            STEP 4: RESULTS UI (EXACT DASHBOARD MATCH)
            ========================================= */}
        {flowState === 'results' && analysis && (() => {
          
          const muscleScores = [
            { label: 'Chest', score: analysis.chest_score || 0 },
            { label: 'Shoulders', score: analysis.shoulders_score || 0 },
            { label: 'Back', score: analysis.back_score || 0 },
            { label: 'Core', score: analysis.abs_score || 0 },
            { label: 'Legs', score: analysis.legs_score || 0 },
            { label: 'Arms', score: analysis.arms_score || 0 },
          ];

          return (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-2xl mx-auto mt-4">
              
              <div className="w-full flex flex-col items-center justify-center mb-8 relative text-center">
                <div className="inline-flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1 mb-3">
                  <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Biometric Analysis</span>
                </div>
                <h2 className="text-[22px] md:text-[28px] font-black text-white tracking-tight uppercase leading-none">Your BodyMax Score</h2>
                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold mt-2.5">
                  Your Current Physique <span className="text-[#E71B25] mx-1">VS</span> Your Dream Physique
                </p>
              </div>

              {/* SIDE-BY-SIDE PHOTOS */}
              <div className="flex justify-center items-center gap-3 w-full mb-10 relative">
                <div className="w-1/2 aspect-[3/4] bg-[#0a0a0a] rounded-2xl md:rounded-[2rem] border border-white/[0.05] overflow-hidden relative shadow-lg">
                  <img src={currentImgUrls[1] || currentImgUrls[2] || currentImgUrls[3] || fallbackImg} className="absolute inset-0 w-full h-full object-cover filter grayscale-[15%]" alt="Current State" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-0 w-full flex justify-center">
                    <span className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                      Current
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0 opacity-50">
                  <div className="w-[1px] h-6 bg-gradient-to-b from-transparent to-white/20" />
                  <span className="text-[8px] font-black text-gray-500 my-1 uppercase tracking-widest">VS</span>
                  <div className="w-[1px] h-6 bg-gradient-to-t from-transparent to-white/20" />
                </div>

                <div className="w-1/2 aspect-[3/4] bg-[#0a0a0a] rounded-2xl md:rounded-[2rem] border border-[#E71B25]/30 overflow-hidden relative shadow-[0_5px_20px_rgba(231,27,37,0.1)]">
                  <img src={dreamImgUrl || fallbackImg} className="absolute inset-0 w-full h-full object-cover filter grayscale-[5%]" alt="Target Goal" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-0 w-full flex justify-center">
                    <span className="bg-[#E71B25]/20 backdrop-blur-md border border-[#E71B25]/50 px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                      <Target className="w-2.5 h-2.5 text-[#ff8a8a]" /> Dream
                    </span>
                  </div>
                </div>
              </div>

              {/* OVERALL RATING GAP */}
              <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 mb-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-[#E71B25]/10 flex items-center justify-center">
                    <Activity className="w-3 h-3 text-[#E71B25]" strokeWidth={3} />
                  </div>
                  <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">BodyMax Gap</h3>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative">
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1.5">Current Score</div>
                    <div className="text-[26px] md:text-[32px] font-black text-white leading-none tracking-tighter">
                      {analysis.overall_score}
                    </div>
                  </div>
                  <div className="shrink-0 text-gray-700">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 bg-[#111] border border-[#22c55e]/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#22c55e]/10 rounded-full blur-[20px] pointer-events-none" />
                    <div className="text-[9px] text-[#22c55e]/80 uppercase tracking-widest font-bold mb-1.5 relative z-10">Dream Goal</div>
                    <div className="text-[26px] md:text-[32px] font-black text-[#22c55e] leading-none tracking-tighter relative z-10">
                      {analysis.potential_score}
                    </div>
                  </div>
                </div>
              </div>

              {/* MATCH PROBABILITY */}
              <div className="w-full mb-10">
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl border border-green-500/10 p-5 flex items-center gap-4 shadow-lg overflow-hidden relative">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-24 h-24 bg-green-500/10 rounded-full filter blur-[30px] pointer-events-none"></div>
                  <div className="shrink-0 relative z-10">
                    <span className="text-[32px] md:text-[40px] font-black text-[#22c55e] leading-none tracking-tighter">
                      {analysis.dream_body_chances}
                    </span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <p className="text-[11px] md:text-[12px] text-gray-400 leading-relaxed font-medium">
                      Match probability. This is your realistic chance of achieving the exact target physique upon strict execution.
                    </p>
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL MUSCLE SCORES (Exactly like Dashboard) */}
              <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#E71B25]" />
                  <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">
                    Muscle Vector Analysis
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {muscleScores.map((metric, i) => {
                    let ratingTextColor = "text-[#22c55e]";
                    let ratingBgColor   = "bg-[#22c55e]";
                    if (metric.score < 50) {
                      ratingTextColor = "text-[#E71B25]";
                      ratingBgColor   = "bg-[#E71B25]";
                    } else if (metric.score < 70) {
                      ratingTextColor = "text-orange-500";
                      ratingBgColor   = "bg-orange-500";
                    }

                    return (
                      <div key={i} className="bg-[#111] rounded-xl p-3 border border-white/[0.03]">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold block mb-2">
                          {metric.label}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className={`font-black text-[16px] ${ratingTextColor}`}>
                            {metric.score}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-[#222] rounded-full mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.score}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full rounded-full ${ratingBgColor}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Written Summary */}
                {analysis.summary && (
                  <div className="mt-4 bg-[#111] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E71B25] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1.5">AI Assessment</p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">{analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Best Feature (Visible Improvements) */}
                {analysis.visible_improvements && (
                  <div className="mt-3 bg-[#22c55e]/5 border border-[#22c55e]/10 rounded-xl p-3 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" strokeWidth={3} />
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      <span className="text-[#22c55e] font-bold">Best Feature: </span>
                      {analysis.visible_improvements}
                    </p>
                  </div>
                )}

                {/* Weakest Feature (Primary Concern) */}
                {analysis.primary_concern && (
                  <div className="mt-3 bg-[#E71B25]/5 border border-[#E71B25]/10 rounded-xl p-3 flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#E71B25] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      <span className="text-[#E71B25] font-bold">Primary Limiter: </span>
                      {analysis.primary_concern}
                    </p>
                  </div>
                )}

              </div>

              {/* Reset Button */}
              <div className="w-full pb-10">
                <button 
                    onClick={resetFlow}
                    className="w-full py-4 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 font-bold text-[12px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all"
                >
                   <RefreshCw className="w-4 h-4" /> Scan Another Physique
                </button>
              </div>

            </motion.div>
          );
        })()}

      </AnimatePresence>
    </div>
  );
};

export default QuickAdFlow;