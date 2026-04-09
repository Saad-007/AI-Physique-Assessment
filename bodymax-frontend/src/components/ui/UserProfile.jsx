import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, ShieldCheck, Calendar, Clock, Crown, Zap, Lock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";

// ==========================================
// PIXEL-PERFECT PRICING DATA 
// ==========================================
const pricingPlans = [
  {
    id: '1-week', title: 'Kickstart Plan', subtitle: 'Test the system, see results', duration: '1 week',
    oldTotal: '$13.98', newTotal: '$6.99', oldDaily: '$2.00', newDaily: '$0.99', planId: 'plan_Ria8do63uXIu3', badge: null
  },
  {
    id: '4-weeks', title: 'Momentum Plan', subtitle: 'Build consistency, feel changes', duration: '4 weeks',
    oldTotal: '$59.98', newTotal: '$29.99', oldDaily: '$2.14', newDaily: '$1.07', planId: 'plan_IKQC0xVZiDswT',
    badge: { text: 'POPULAR', style: 'bg-[#E71B25] text-white left-0 -top-2 rounded-md rounded-bl-none px-2 py-0.5 text-[6.5px]' }
  },
  {
    id: '12-weeks', title: 'Transformation', subtitle: 'Complete body transformation', duration: '12 weeks',
    oldTotal: '$89.98', newTotal: '$44.99', oldDaily: '', newDaily: '$0.53', planId: 'plan_kflTr1LhnYkps',
    badge: { text: 'BEST VALUE', style: 'bg-gradient-to-r from-[#FCE18D] to-[#F1C40F] text-black right-3 -top-2 rounded-md px-2 py-0.5 shadow-sm text-[6.5px]' }
  }
];

const UserProfile = ({ profile, currentLevel, rankName, streak }) => {
  // Plan Selection States
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Safe fallbacks in case profile data is missing
  const userName = profile?.full_name || 'BodyMax Athlete';
  const userEmail = profile?.email || 'athlete@bodymax.ai';
  
  // Extract Plan Info
  const assessment = profile?.assessment_data || {};
  const activePlan = assessment?.planDuration || "Free Tier";
  
  // Calculate Days Left
  const totalDays = parseInt(activePlan.split('-')[0]) * 7 || 0;
  const daysCompleted = profile?.current_streak || streak || 0; 
  const daysLeft = totalDays > 0 ? Math.max(0, totalDays - daysCompleted) : 0;
  const progressPercentage = totalDays > 0 ? Math.min(100, Math.round((daysCompleted / totalDays) * 100)) : 0;

  const isPro = totalDays > 0;

  // New State to toggle Pricing Section visibility
  const [showPricing, setShowPricing] = useState(!isPro);

  const handleManageSubscription = () => {
    setShowPricing(!showPricing);
  };

  const handlePlanClick = (planId) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-3.5 px-2 pb-12"
    >
      
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <div className="w-full bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-4 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 shadow-inner relative">
          <User className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
          {isPro && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-[#E71B25] p-1 rounded-full border-[2px] border-[#0a0a0a] shadow-sm">
              <Crown className="w-2 h-2 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-[15px] md:text-[17px] font-black text-white/90 tracking-tight leading-none mb-1">
            {userName}
          </h1>
          <div className="flex items-center gap-1.5">
            <Mail className="w-2.5 h-2.5 text-gray-500" />
            <span className="text-[9px] md:text-[10px] font-medium text-gray-400">{userEmail}</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          THREE-COLUMN STATS GRID
          ========================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3">
        
        {/* RANK CARD */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-3.5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500/10 p-1.5 rounded-md border border-blue-500/20">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
            </div>
            <span className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Your Rank</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-[15px] md:text-[18px] font-black text-white/90 leading-none tracking-tight">{rankName}</span>
            <span className="text-[7px] md:text-[8px] font-bold text-blue-500 leading-none">LVL {currentLevel}</span>
          </div>
        </div>

        {/* STREAK CARD */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-3.5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-500/10 p-1.5 rounded-md border border-orange-500/20">
              <Zap className="w-3 h-3 text-orange-500" />
            </div>
            <span className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Current Streak</span>
          </div>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-[16px] md:text-[20px] font-black text-white/90 leading-none tracking-tight">{streak}</span>
            <span className="text-[7px] md:text-[8px] font-bold text-orange-500 uppercase tracking-wider leading-none mb-[1px]">Days 🔥</span>
          </div>
        </div>

        {/* PLAN STATUS CARD */}
        <div className="col-span-2 md:col-span-1 bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-3.5 shadow-sm flex flex-col justify-center relative overflow-hidden">
           {isPro && <div className="absolute top-0 right-0 w-16 h-16 bg-[#E71B25]/5 rounded-full blur-[20px] pointer-events-none"></div>}
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className={`p-1.5 rounded-md border ${isPro ? 'bg-[#E71B25]/10 border-[#E71B25]/20' : 'bg-gray-800/50 border-gray-700'}`}>
              <Calendar className={`w-3 h-3 ${isPro ? 'text-[#E71B25]' : 'text-gray-500'}`} />
            </div>
            <span className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Active Subscription</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10 mt-auto">
            <span className={`text-[15px] md:text-[18px] font-black tracking-tight leading-none ${isPro ? 'text-white/90' : 'text-gray-500'}`}>
              {activePlan}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          SUBSCRIPTION PROGRESS SECTION
          ========================================== */}
      {isPro && (
        <div className="w-full bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-4 shadow-sm relative">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <h3 className="text-[10px] md:text-[12px] font-bold text-white/90 tracking-wide leading-none">Subscription Progress</h3>
            </div>
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-md text-[7px] font-mono text-gray-400 font-bold uppercase tracking-widest leading-none">
              {daysLeft} Days Left
            </span>
          </div>

          <div className="w-full bg-[#111] rounded-full h-1.5 border border-white/5 overflow-hidden mb-2 relative">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-[#E71B25] h-full rounded-full shadow-[0_0_8px_rgba(231,27,37,0.4)] relative"
            >
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/20 blur-[1px] rounded-full"></div>
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Day 1</span>
            <span className="text-[7px] font-bold text-[#E71B25] uppercase tracking-widest">{progressPercentage}% Done</span>
            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Day {totalDays}</span>
          </div>

          {/* MANAGE SUBSCRIPTION BUTTON */}
          <div className="w-full flex justify-end mt-3 pt-3 border-t border-white/[0.03]">
            <button 
              onClick={handleManageSubscription}
              className={`flex items-center gap-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-colors ${showPricing ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {showPricing ? 'Hide Plans' : 'Manage Subscription'}
              {showPricing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          IN-APP PRICING & PLAN WIDGET
          ========================================== */}
      <AnimatePresence>
        {showPricing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-full bg-[#0a0a0a] border border-white/[0.05] rounded-[1rem] p-4 mt-1 shadow-sm">
              <div className="flex flex-col mb-4">
                <h2 className="text-[14px] md:text-[16px] font-bold text-white leading-tight tracking-tight mb-1">
                  {isPro ? "Upgrade / Renew Protocol" : "Select Your Protocol"}
                </h2>
                <p className="text-[9px] md:text-[10px] text-gray-500 font-medium">
                  {isPro ? "Extend your progress or upgrade your current plan." : "Unlock your custom AI protocol and track your daily progress."}
                </p>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                {pricingPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanClick(plan.id)}
                      className={`relative w-full rounded-xl cursor-pointer transition-all duration-200 border overflow-visible flex h-[70px] md:h-[75px] ${
                        isSelected
                          ? 'border-[#E71B25] bg-[#120a09] shadow-[0_0_15px_rgba(231,27,37,0.1)]'
                          : 'border-white/5 bg-[#111] hover:border-white/10'
                      }`}
                    >
                      {plan.badge && (
                        <div className={`absolute text-[6.5px] font-bold tracking-widest z-30 ${plan.badge.style}`}>
                          {plan.badge.text}
                        </div>
                      )}

                      <div className="flex flex-1 items-center pl-3 pr-1 py-2 h-full z-20">
                        <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 mr-2.5 transition-colors ${isSelected ? 'border-[#E71B25]' : 'border-gray-600'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-[#E71B25] rounded-full" />}
                        </div>

                        <div className="flex flex-col justify-center h-full pt-0.5">
                          <h3 className="text-white font-bold text-[12px] md:text-[13px] leading-none mb-1 text-left">{plan.title}</h3>
                          <p className="text-gray-500 text-[8.5px] leading-tight pr-1 mb-auto text-left">{plan.subtitle}</p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-gray-300 text-[8.5px] font-medium">{plan.duration}</span>
                            <span className="text-gray-600 text-[8.5px] line-through">{plan.oldTotal}</span>
                            <span className="text-white text-[8.5px] font-bold">→ {plan.newTotal}</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute right-[3px] top-[3px] bottom-[3px] w-[80px] md:w-[90px] overflow-hidden rounded-[0.6rem] z-10 pointer-events-none">
                        <div
                          className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-[#E71B25]' : 'bg-[#18181b]'}`}
                          style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)' }}
                        />
                        <div className="relative z-20 flex flex-col items-center justify-center h-full w-full pl-2.5 md:pl-3">
                          {plan.oldDaily && (
                            <span className={`text-[8px] line-through decoration-current mb-0.5 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                              {plan.oldDaily}
                            </span>
                          )}
                          <span className={`font-bold text-[16px] md:text-[18px] leading-none tracking-tight mb-0.5 ${isSelected ? 'text-white drop-shadow-sm' : 'text-white/90'}`}>
                            {plan.newDaily}
                          </span>
                          <span className={`text-[7px] ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                            per day
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CHECKOUT WIDGET */}
              <div className="w-full flex flex-col items-center mt-5">
                <AnimatePresence mode="wait">
                  {isCheckoutOpen && selectedPlan && (
                    <motion.div
                      key="embed-form"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full rounded-[0.8rem] overflow-hidden border border-white/5 shadow-lg bg-[#111]"
                    >
                      <WhopCheckoutEmbed
                        key={selectedPlan}
                        planId={pricingPlans.find(plan => plan.id === selectedPlan)?.planId}
                        theme="dark"
                        hidePrice={false}
                        onComplete={() => {
                          console.log("Upgrade Payment Successful!");
                          // Optional: Real app update user subscription in Supabase logic here
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-3 flex items-center gap-1 text-gray-600">
                  <Lock className="w-2.5 h-2.5" />
                  <span className="text-[7px] font-bold uppercase tracking-widest">SSL Encrypted Secure Checkout</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default UserProfile;