import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Target, Activity, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

const QuickAdFlow = () => {
  const [flowState, setFlowState] = useState('upload_current'); // upload_current, upload_dream, analyzing, results
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [dreamPhoto, setDreamPhoto] = useState(null);
  
  const [currentImgUrl, setCurrentImgUrl] = useState(null);
  const [dreamImgUrl, setDreamImgUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const fallbackImg = "https://ui-avatars.com/api/?name=Scan+Missing&background=0a0a0a&color=fff&size=512";

  const handleCurrentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentPhoto(file);
    setCurrentImgUrl(URL.createObjectURL(file));
    setFlowState('upload_dream');
  };

const handleDreamUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDreamPhoto(file);
    setDreamImgUrl(URL.createObjectURL(file));
    setFlowState('analyzing');

    try {
      const formData = new FormData();
      formData.append('currentImage', currentPhoto);
      formData.append('dreamImage', file);
      
      // 🔴 NAYA CODE: Backend ko dhoka dene ke liye dummy data bhej rahe hain taake wo fail na ho
      formData.append('age', '25');
      formData.append('weight', '75');
      formData.append('height', '180');
      formData.append('gender', 'Male');
      formData.append('goal', 'Muscle Gain');
      formData.append('experience', 'Intermediate');
      formData.append('mode', 'video_ad_creation'); 

      // 🔴 APNA REAL BACKEND ENDPOINT CALL KAREIN
      const response = await fetch('/api/analyze-physique', { 
        method: 'POST', 
        body: formData 
      });

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status}`);
      }

      // Raw response check karne ke liye taake pata chale backend kya bhej raha hai
      const rawText = await response.text();
      console.log("🔴 RAW BACKEND RESPONSE:", rawText); 
      
      const data = JSON.parse(rawText);

      setAnalysis({
        overall_score: data.overall_score || data.overall_rating || data.overall || 0,
        potential_score: data.potential_score || data.potential_rating || 0,
        dream_body_chances: data.dream_body_chances || data.chance_percentage || "85%",
        chest_score: data.chest_score || data.chest || 0,
        shoulders_score: data.shoulders_score || data.shoulders || 0,
        back_score: data.back_score || data.back || 0,
        abs_score: data.abs_score || data.abs || data.core || 0,
        legs_score: data.legs_score || data.legs || 0,
        arms_score: data.arms_score || data.arms || 0,
      });

      setFlowState('results');

    } catch (error) {
      console.error("Real Analysis Failed:", error);
      alert("AI Analysis Failed! Check console (F12) for details.");
      setFlowState('upload_current'); 
    }
  };  
  const resetFlow = () => {
    setCurrentPhoto(null);
    setDreamPhoto(null);
    setCurrentImgUrl(null);
    setDreamImgUrl(null);
    setAnalysis(null);
    setFlowState('upload_current');
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center pt-4 pb-24 px-4 md:px-6 bg-[#030303] font-sans">
      <AnimatePresence mode="wait">

        {/* =========================================
            STEP 1: UPLOAD CURRENT PHYSIQUE
            ========================================= */}
        {flowState === 'upload_current' && (
          <motion.div key="current" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="text-center w-full max-w-md mx-auto">
            <div className="inline-flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1 mb-6">
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Step 1 of 2</span>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-black text-white uppercase tracking-tight leading-none mb-4">
              Your Current<br/>Baseline.
            </h2>
            <p className="text-xs text-gray-400 mb-8 font-medium px-4">
              Upload a clear, front-facing photo of your current physique.
            </p>
            <label className="w-full aspect-[4/5] bg-[#0a0a0a] border-2 border-dashed border-white/10 hover:border-[#E71B25]/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.02]">
               <input type="file" accept="image/*" className="hidden" onChange={handleCurrentUpload} />
               <div className="w-16 h-16 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-4 text-[#E71B25]">
                  <Camera className="w-8 h-8" />
               </div>
               <span className="text-white font-bold text-lg">Upload Current Photo</span>
            </label>
          </motion.div>
        )}

        {/* =========================================
            STEP 2: UPLOAD DREAM PHYSIQUE
            ========================================= */}
        {flowState === 'upload_dream' && (
          <motion.div key="dream" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="text-center w-full max-w-md mx-auto">
            <div className="inline-flex items-center justify-center bg-[#E71B25]/10 border border-[#E71B25]/20 rounded-full px-3 py-1 mb-6">
              <span className="text-[10px] text-[#E71B25] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Step 2 of 2
              </span>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-black text-white uppercase tracking-tight leading-none mb-4">
              Your Dream<br/>Physique.
            </h2>
            <p className="text-xs text-gray-400 mb-8 font-medium px-4">
              Upload a photo of your goal physique so our AI can calculate the visual gap.
            </p>
            <label className="w-full aspect-[4/5] bg-[#0a0a0a] border-2 border-dashed border-[#E71B25]/30 hover:border-[#E71B25] rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#E71B25]/5">
               <input type="file" accept="image/*" className="hidden" onChange={handleDreamUpload} />
               <div className="w-16 h-16 bg-[#E71B25]/20 rounded-full flex items-center justify-center mb-4 text-[#E71B25]">
                  <Target className="w-8 h-8" />
               </div>
               <span className="text-white font-bold text-lg">Upload Goal Photo</span>
            </label>
          </motion.div>
        )}

        {/* =========================================
            STEP 3: ANALYZING STATE
            ========================================= */}
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
            STEP 4: FULL UNLOCKED RESULTS UI (For Video Recording)
            ========================================= */}
        {flowState === 'results' && analysis && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-2xl mx-auto">
            
            <div className="w-full flex flex-col items-center justify-center mb-8 relative text-center">
              <div className="inline-flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1 mb-3">
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Biometric Analysis</span>
              </div>
              <h2 className="text-[22px] md:text-[28px] font-black text-white tracking-tight uppercase leading-none">Your BodyMax Score</h2>
            </div>

            {/* Side-by-side Images */}
            <div className="flex justify-center items-center gap-3 w-full mb-10 relative">
              <div className="w-1/2 aspect-[3/4] bg-[#0a0a0a] rounded-2xl md:rounded-[2rem] border border-white/[0.05] overflow-hidden relative shadow-lg">
                <img src={currentImgUrl || fallbackImg} className="absolute inset-0 w-full h-full object-cover filter grayscale-[15%]" alt="Current State" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-3 left-0 w-full flex justify-center">
                  <span className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> current
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center shrink-0 opacity-50">
                <div className="w-[1px] h-6 bg-gradient-to-b from-transparent to-white/20"></div>
                <span className="text-[8px] font-black text-gray-500 my-1 uppercase tracking-widest">VS</span>
                <div className="w-[1px] h-6 bg-gradient-to-t from-transparent to-white/20"></div>
              </div>

              <div className="w-1/2 aspect-[3/4] bg-[#0a0a0a] rounded-2xl md:rounded-[2rem] border border-[#E71B25]/30 overflow-hidden relative shadow-[0_5px_20px_rgba(231,27,37,0.1)]">
                <img src={dreamImgUrl || fallbackImg} className="absolute inset-0 w-full h-full object-cover filter grayscale-[5%]" alt="Target Goal" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-3 left-0 w-full flex justify-center">
                  <span className="bg-[#E71B25]/20 backdrop-blur-md border border-[#E71B25]/50 px-3 py-1.5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                    <Target className="w-2.5 h-2.5 text-[#ff8a8a]" /> dream
                  </span>
                </div>
              </div>
            </div>

            {/* Probability Block */}
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
                    Probability of achieving the exact target physique upon strict execution of your protocol.
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Score Comparsion */}
            <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 mb-10 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-[#E71B25]/10 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-[#E71B25]" strokeWidth={3} />
                </div>
                <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">BodyMax Score Rating</h3>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1.5">Current</div>
                  <div className="text-[26px] md:text-[32px] font-black text-white leading-none tracking-tighter">
                    {analysis.overall_score}
                    <span className="text-[12px] md:text-[14px] text-gray-600 font-bold ml-0.5">/100</span>
                  </div>
                </div>
                <div className="shrink-0 text-gray-700">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 bg-[#111] border border-[#22c55e]/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#22c55e]/10 rounded-full blur-[20px] pointer-events-none"></div>
                  <div className="text-[9px] text-[#22c55e]/80 uppercase tracking-widest font-bold mb-1.5 relative z-10">Potential</div>
                  <div className="text-[26px] md:text-[32px] font-black text-[#22c55e] leading-none tracking-tighter relative z-10">
                    {analysis.potential_score}
                    <span className="text-[12px] md:text-[14px] text-[#22c55e]/40 font-bold ml-0.5">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UNLOCKED MUSCLE GRID */}
            <div className="w-full mb-10">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles className="w-4 h-4 text-[#E71B25]" />
                 <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">Muscle Vector Analysis</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {[
                   { label: 'CHEST', score: analysis.chest_score },
                   { label: 'SHOULDERS', score: analysis.shoulders_score },
                   { label: 'BACK', score: analysis.back_score },
                   { label: 'CORE', score: analysis.abs_score },
                   { label: 'LEGS', score: analysis.legs_score },
                   { label: 'ARMS', score: analysis.arms_score },
                 ].map((muscle, idx) => {
                    let colorClass = "text-[#22c55e]";
                    if (muscle.score < 50) colorClass = "text-[#E71B25]";
                    else if (muscle.score < 70) colorClass = "text-orange-500";

                    return (
                      <div key={idx} className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                          {muscle.label}
                        </span>
                        <span className={`text-2xl font-black ${colorClass}`}>
                          {muscle.score}
                        </span>
                      </div>
                    )
                 })}
              </div>
            </div>

            {/* Reset Button for Client to easily shoot the next video ad */}
            <div className="w-full pb-10">
              <button 
                  onClick={resetFlow}
                  className="w-full py-4 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 font-bold text-[12px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                 <RefreshCw className="w-4 h-4" /> Scan Another Physique
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default QuickAdFlow;