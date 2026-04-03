import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Yahan props mein assessmentData receive karein
const SuccessPage = ({ assessmentData = {},onGoToDashboard }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

 const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            // 1. CREATE USER ACCOUNT
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
                // Destructure to separate actual files from the rest of the JSON data
                const { 
                  photos, 
                  photoFiles, 
                  dreamPhysiqueFile, 
                  dreamPhysiquePreview, 
                  ...cleanAssessmentData 
                } = assessmentData;
                
                // Ensure planDuration exists on cleanAssessmentData
                if (!cleanAssessmentData.planDuration) {
                    cleanAssessmentData.planDuration = selectedPlan || "12-Week";
                }

                let permanentPhotoUrls = {}; 
                let finalGoalImageUrl = null;

                // ==========================================
                // 2A. UPLOAD THE 3 BODY PHOTOS
                // ==========================================
                if (photoFiles) {
                    for (const key of [1, 2, 3]) {
                        const file = photoFiles[key];
                        if (file) {
                            const fileExt = file.name.split('.').pop();
                            const filePath = `${authData.user.id}/photo_${key}_${Date.now()}.${fileExt}`;

                            const { error: uploadError } = await supabase.storage
                                .from('user_photos')
                                .upload(filePath, file, { cacheControl: '3600', upsert: true });

                            if (!uploadError) {
                                const { data: urlData } = supabase.storage
                                    .from('user_photos')
                                    .getPublicUrl(filePath);
                                permanentPhotoUrls[key] = urlData.publicUrl;
                            }
                        }
                    }
                }

                // ==========================================
                // 2B. UPLOAD THE DREAM PHYSIQUE GOAL PHOTO
                // ==========================================
                if (dreamPhysiqueFile) {
                    const file = dreamPhysiqueFile;
                    const fileExt = file.name.split('.').pop();
                    const filePath = `${authData.user.id}/goal_${Date.now()}.${fileExt}`;
                    
                    const { error: uploadError } = await supabase.storage
                        .from('user_photos') 
                        .upload(filePath, file, { cacheControl: '3600', upsert: true });

                    if (!uploadError) {
                        const { data: urlData } = supabase.storage
                            .from('user_photos')
                            .getPublicUrl(filePath);
                        finalGoalImageUrl = urlData.publicUrl;
                    }
                } else if (assessmentData.dreamPhysiqueImage && typeof assessmentData.dreamPhysiqueImage === 'string') {
                    finalGoalImageUrl = assessmentData.dreamPhysiqueImage;
                }

                // ==========================================
                // 3. PREPARE CLEAN DATA & SAVE TO DB
                // ==========================================
                cleanAssessmentData.photos = Object.keys(permanentPhotoUrls).length > 0 ? permanentPhotoUrls : null;
                cleanAssessmentData.dreamPhysiqueImage = finalGoalImageUrl;

                // Save everything to 'profiles' table
                const { error: dbError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            full_name: formData.name,
                            email: formData.email,
                            assessment_data: cleanAssessmentData,
                        }
                    ]);

                if (dbError) {
                    console.error("Database save error:", dbError);
                }

                // 🔴 REMOVED: The AI fetch call from here. 
                // The Dashboard will handle AI generation automatically with the loading screen!
            }

            // Immediately show success!
            setIsSubmitting(false);
            setIsSuccess(true);

        } catch (err) {
            console.error(err);
            setErrorMsg("An unexpected error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E71B25] mix-blend-screen filter blur-[150px] opacity-10 rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[400px] bg-[#0c0c0c] border border-white/[0.08] rounded-[1.5rem] p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        /* ==========================================
                           ACCOUNT CREATION FORM
                           ========================================== */
                        <motion.div
                            key="form-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        >
                            <div className="flex flex-col items-center text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
                                    className="w-14 h-14 bg-[#E71B25]/10 rounded-full flex items-center justify-center mb-4"
                                >
                                    <CheckCircle2 className="w-7 h-7 text-[#E71B25]" strokeWidth={2.5} />
                                </motion.div>

                                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Payment Confirmed</h1>
                                <p className="text-[#888] text-[13px] leading-relaxed px-2">
                                    Your journey begins here. Create an account to access your personalized AI protocol.
                                </p>
                            </div>

                            {errorMsg && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span className="text-red-500 text-[11px] font-medium leading-tight">{errorMsg}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-[#555]" />
                                        </div>
                                        <input
                                            type="text" required placeholder="John Doe" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#141414] border border-white/5 text-white placeholder-[#555] text-[13px] rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 text-[#555]" />
                                        </div>
                                        <input
                                            type="email" required placeholder="john@example.com" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#141414] border border-white/5 text-white placeholder-[#555] text-[13px] rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mb-2">
                                    <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider ml-1">Create Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="w-4 h-4 text-[#555]" />
                                        </div>
                                        <input
                                            type="password" required placeholder="••••••••" minLength="6" disabled={isSubmitting}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-[#141414] border border-white/5 text-white placeholder-[#555] text-[13px] rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-[#E71B25]/50 focus:ring-1 focus:ring-[#E71B25]/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    type="submit" disabled={isSubmitting}
                                    className={`w-full py-3 rounded-lg font-bold text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-1 shadow-[0_4px_14px_rgba(231,27,37,0.2)] border ${isSubmitting
                                            ? 'bg-[#E71B25]/50 text-white/70 border-transparent cursor-not-allowed'
                                            : 'bg-[#E71B25] hover:bg-[#c91720] text-white border-[#E71B25]/20'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving Data...</>
                                    ) : (
                                        <>Create Account <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </motion.button>
                            </form>

                            <p className="text-center text-[#555] text-[10px] mt-5 px-4 leading-relaxed">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </motion.div>
                    ) : (
                        /* ==========================================
                           SUCCESS VIEW (GO TO DASHBOARD)
                           ========================================== */
                        <motion.div
                            key="success-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                            className="flex flex-col items-center text-center py-6"
                        >
                            <div className="w-24 h-24 bg-[#E71B25]/10 border-[4px] border-[#E71B25]/20 rounded-full flex items-center justify-center mb-6 relative">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-[#E71B25]" strokeWidth={2.5} />
                                </motion.div>
                                <div className="absolute inset-0 rounded-full border border-[#E71B25]/30 animate-ping opacity-50"></div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Account Created!</h2>
                            <p className="text-[#888] text-[13px] leading-relaxed mb-8 px-2">
                                Your profile is ready. Your AI-guided BodyMax protocol is waiting for you inside.
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

export default SuccessPage;