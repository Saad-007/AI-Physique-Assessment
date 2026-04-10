import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import InstallPrompt from '../InstallPrompt';

const SuccessPage = ({ assessmentData = {}, onGoToDashboard }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    // PWA DETECTION STATE
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        setIsStandalone(checkStandalone);

        if (!checkStandalone) {
            localStorage.setItem('pendingAccountCreation', 'true');
        }
    }, []);

    // Helper to upload either a File object or a Base64 string
    const uploadImageToSupabase = async (fileOrBase64, userId, fileNamePrefix) => {
        if (!fileOrBase64) return null;

        try {
            const fileName = `${userId}/${fileNamePrefix}_${Date.now()}`;
            let fileToUpload = fileOrBase64;

            // If it's a base64 string (often happens after a page reload when files are lost)
            if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image')) {
                // Convert base64 to Blob
                const res = await fetch(fileOrBase64);
                fileToUpload = await res.blob();
            } else if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('blob:')) {
                // We cannot upload a dead blob URL. 
                console.warn("Dead blob URL detected. Cannot upload.");
                return null;
            }

            const { error: uploadError } = await supabase.storage
                .from('user_photos')
                .upload(`${fileName}.jpg`, fileToUpload, { 
                    cacheControl: '3600', 
                    upsert: true,
                    contentType: 'image/jpeg' 
                });

            if (!uploadError) {
                const { data: urlData } = supabase.storage.from('user_photos').getPublicUrl(`${fileName}.jpg`);
                return urlData.publicUrl;
            }
        } catch (err) {
            console.error(`Failed to upload ${fileNamePrefix}:`, err);
        }
        return null;
    };

const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            console.log("1. Starting Signup for:", formData.email);
            
            // 1. CREATE USER ACCOUNT IN SUPABASE AUTH
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setErrorMsg(authError.message);
                setIsSubmitting(false);
                return;
            }

            if (authData.user) {
                // =====================================
                // 🔴 THE FIX: PROTECT IMAGE DATA
                // =====================================
                const savedLocalDataStr = localStorage.getItem('savedAssessmentData');
                const localAssessmentData = savedLocalDataStr ? JSON.parse(savedLocalDataStr) : {};
                
                // We remove the keys from localData that might contain "dead" data
                const localDataClean = { ...localAssessmentData };
                delete localDataClean.dreamPhysiqueFile;
                delete localDataClean.photoFiles;

                // Merge: Props (Fresh data) + Clean Local Data
                const finalAssessmentData = { 
                    ...assessmentData, 
                    ...localDataClean 
                };

                const { 
                  photos, 
                  photoFiles, 
                  dreamPhysiqueFile,
                  dreamPhysiqueImage, 
                  dreamPhysiquePreview,
                  ...cleanAssessmentData 
                } = finalAssessmentData;
                
                let permanentPhotoUrls = { ...(photos || {}) }; 
                
                // 🟢 FIX: Prioritize Existing Image > Preview URL > Null
                let finalGoalImageUrl = dreamPhysiqueImage || dreamPhysiquePreview || null;

                console.log("3. Processing Uploads...");

                // --- UPLOAD CURRENT BODY PHOTOS ---
                if (photoFiles) {
                    for (const key of [1, 2, 3]) {
                        const file = photoFiles[key];
                        // Only upload if it's a real File object with a name
                        if (file && file.name && file.size > 0) {
                            const fileExt = file.name.split('.').pop();
                            const filePath = `${authData.user.id}/photo_${key}_${Date.now()}.${fileExt}`;
                            const { error: upErr } = await supabase.storage.from('user_photos').upload(filePath, file);
                            if (!upErr) {
                                const { data: urlData } = supabase.storage.from('user_photos').getPublicUrl(filePath);
                                permanentPhotoUrls[key] = urlData.publicUrl;
                            }
                        }
                    }
                }

                // --- 🔴 UPLOAD TARGET IMAGE (The one that was returning null) ---
                if (dreamPhysiqueFile && dreamPhysiqueFile.name && dreamPhysiqueFile.size > 0) {
                    const fileExt = dreamPhysiqueFile.name.split('.').pop();
                    const filePath = `${authData.user.id}/goal_${Date.now()}.${fileExt}`;
                    
                    const { error: uploadError } = await supabase.storage
                        .from('user_photos') 
                        .upload(filePath, dreamPhysiqueFile);

                    if (!uploadError) {
                        const { data: urlData } = supabase.storage.from('user_photos').getPublicUrl(filePath);
                        finalGoalImageUrl = urlData.publicUrl;
                    }
                }

                // FINAL PAYLOAD
                const dataToSave = {
                    ...cleanAssessmentData,
                    photos: permanentPhotoUrls, 
                    dreamPhysiqueImage: finalGoalImageUrl, // Guaranteed not to be null if a preview exists
                    planDuration: cleanAssessmentData.planDuration || "12-Week"
                };

                // 2. SAVE TO PROFILES
                const { error: dbError } = await supabase
                    .from('profiles')
                    .upsert([{
                        id: authData.user.id,
                        full_name: formData.name,
                        email: formData.email,
                        assessment_data: dataToSave,
                    }]);

                if (dbError) throw new Error(dbError.message); 
                
                localStorage.removeItem('pendingAccountCreation');
                localStorage.removeItem('savedAssessmentData');
                
                setIsSubmitting(false);
                setIsSuccess(true);
            }
        } catch (err) {
            setErrorMsg(err.message || "Sync failed.");
            setIsSubmitting(false);
        }
    };

    // ... Rest of your component (Browser View and PWA View) remains exactly the same ...
    
    if (!isStandalone) {
        return (
            <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E71B25] mix-blend-screen filter blur-[120px] opacity-[0.05] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-[380px] bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 md:p-8 relative z-10 shadow-2xl flex flex-col items-center text-center"
                >
                    <div className="w-12 h-12 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e]" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-1.5 tracking-tight">Payment Confirmed</h1>
                    <p className="text-gray-400 text-[11px] md:text-[12px] leading-relaxed mb-6 px-2 font-medium">
                        Your payment was successful. To generate your AI protocol and create your account, please install the Native App.
                    </p>

                    <div className="w-full flex justify-center mb-5">
                        <InstallPrompt />
                    </div>

                    <button 
                        onClick={() => setIsStandalone(true)} 
                        className="text-[9px] font-bold text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors border-b border-transparent hover:border-gray-500 pb-0.5"
                    >
                        Continue in browser (Not Recommended)
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E71B25] mix-blend-screen filter blur-[120px] opacity-[0.05] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[380px] bg-[#0a0a0a] border border-white/5 rounded-[1.2rem] p-6 md:p-7 relative z-10 shadow-2xl overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form-view"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                        >
                            <div className="flex flex-col items-center text-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                                    className="w-10 h-10 bg-[#E71B25]/10 border border-[#E71B25]/20 rounded-full flex items-center justify-center mb-3"
                                >
                                    <User className="w-4 h-4 text-[#E71B25]" strokeWidth={2} />
                                </motion.div>

                                <h1 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-1.5 tracking-tight">Create Profile</h1>
                                <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-relaxed px-2">
                                    Secure your account to access your personalized AI protocol.
                                </p>
                            </div>

                            {errorMsg && (
                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-red-500/90 text-[10px] font-medium leading-snug">{errorMsg}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text" required placeholder="John Doe" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                        <input
                                            type="email" required placeholder="john@example.com" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mb-1">
                                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Create Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                        <input
                                            type="password" required placeholder="••••••••" minLength="6" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-[#111] border border-white/5 text-white/90 placeholder-gray-600 text-[12px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E71B25]/40 focus:ring-1 focus:ring-[#E71B25]/40 transition-all disabled:opacity-50 font-medium"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    type="submit" disabled={isSubmitting}
                                    className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 mt-2 shadow-sm ${isSubmitting
                                            ? 'bg-[#E71B25]/50 text-white/70 border border-transparent cursor-not-allowed'
                                            : 'bg-[#E71B25] hover:bg-[#c91720] text-white border border-[#E71B25]/20 shadow-[0_4px_14px_rgba(231,27,37,0.15)]'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Data...</>
                                    ) : (
                                        <>Create Account <ArrowRight className="w-3.5 h-3.5" /></>
                                    )}
                                </motion.button>
                            </form>

                            <p className="text-center text-gray-600 text-[8px] mt-5 px-4 font-medium uppercase tracking-wider leading-relaxed">
                                By continuing, you agree to our Terms & Privacy Policy.
                            </p>
                        </motion.div>
                    ) : (
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

                            <h2 className="text-[18px] md:text-[20px] font-bold text-white/90 mb-2 tracking-tight">Account Secured</h2>
                            <p className="text-gray-400 text-[11px] font-medium leading-relaxed mb-8 px-2">
                                Your profile is ready. Your AI-guided BodyMax protocol is waiting for you inside.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={onGoToDashboard}
                                className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md"
                            >
                                Enter Hub <ArrowRight className="w-3.5 h-3.5" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SuccessPage;