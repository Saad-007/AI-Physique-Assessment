import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { IoIosArrowRoundBack } from "react-icons/io"; // <--- 1. YEH IMPORT ADD KAREIN

// World map topology (lightweight JSON)
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Simulated active community members across the globe matching your colors
const markers = [
  { coordinates: [-122.4194, 37.7749], color: "#3b82f6" }, // SF (Blue)
  { coordinates: [-74.006, 40.7128], color: "#f59e0b" }, // NY (Orange)
  { coordinates: [-0.1278, 51.5074], color: "#ef4444" }, // London (Red)
  { coordinates: [139.6917, 35.6895], color: "#3b82f6" }, // Tokyo (Blue)
  { coordinates: [151.2093, -33.8688], color: "#f59e0b" }, // Sydney (Orange)
  { coordinates: [-46.6333, -23.5505], color: "#ef4444" }, // Sao Paulo (Red)
  { coordinates: [18.4232, -33.9249], color: "#3b82f6" }, // Cape Town (Blue)
  { coordinates: [72.8777, 19.076], color: "#f59e0b" }, // Mumbai (Orange)
  { coordinates: [2.3522, 48.8566], color: "#3b82f6" }, // Paris (Blue)
  { coordinates: [13.4050, 52.5200], color: "#f59e0b" }, // Berlin (Orange)
];

// Custom Map Component
const CommunityMap = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1c1e]/40 rounded-xl pointer-events-none">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 110, center: [0, 20] }}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2C2C2E" // Dark hex-like background color
                stroke="#1c1c1e" // Borders matching the container
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ coordinates, color }, i) => (
          <Marker key={i} coordinates={coordinates}>
            <circle r={6} fill={color} opacity={0.3} className="animate-ping" />
            <circle r={3} fill={color} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

// Gold guarantee seal SVG (Scaled down for minimalism)
const GuaranteeSeal = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#D4AF37" />
    <circle cx="50" cy="50" r="40" fill="#FFF" fillOpacity="0.1" />
    <circle cx="50" cy="50" r="44" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
    <text x="50" y="33" textAnchor="middle" fill="#5F4A14" fontSize="10" fontWeight="bold">MONEY BACK</text>
    <text x="50" y="60" textAnchor="middle" fill="#5F4A14" fontSize="28" fontWeight="black">30</text>
    <text x="50" y="73" textAnchor="middle" fill="#5F4A14" fontSize="11" fontWeight="bold">DAYS</text>
    <text x="50" y="85" textAnchor="middle" fill="#5F4A14" fontSize="8" fontWeight="bold" letterSpacing="1.5">GUARANTEE</text>
  </svg>
);

// Advanced Aesthetic Card Container
const Card = ({ children, className = "" }) => (
  <div className={`bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}>
    {children}
  </div>
);

const TrustUpflowPage = ({ onFinalCheckout,onBack }) => {
  // Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-4 max-w-[480px] mx-auto"
    >
      <div className="w-full flex justify-start mb-4">
        <motion.button 
          whileTap={{ x: -2 }} 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg"
        >
          <IoIosArrowRoundBack className="w-6 h-6 text-gray-300 hover:text-white" strokeWidth={1.5} />
        </motion.button>
      </div>
      <div className="w-full flex flex-col gap-4">
        
        {/* 1. Community Card */}
        <Card className="text-center pb-2">
          <h1 className="text-[18px] md:text-[20px] font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            Join the #1 Community for Levelling Up Your Physique
          </h1>
          
          {/* Map Component instead of Image */}
          <div className="w-full aspect-[2/1] rounded-2xl flex items-center justify-center overflow-hidden mb-2">
            <CommunityMap />
          </div>

        </Card>

        {/* 2. Guarantee Card */}
        <Card className="text-left">
          <h2 className="text-[16px] md:text-[18px] font-bold text-white mb-3 tracking-tight">
            100% Money-Back Guarantee
          </h2>
          <p className="text-[12px] md:text-[13px] text-gray-300 mb-5 leading-relaxed font-medium">
            We are confident in our service quality and its results. So, if you're ready to reach your goals, it's a risk-free offer. We guarantee you'll see visible results, or you'll receive a full refund within 30 days of your purchase. You will need to demonstrate that you have followed the program.
          </p>
          <div className="flex justify-between items-center gap-4 pt-1 border-t border-white/5">
            <p className="text-gray-400 text-[11px] md:text-[12px] leading-relaxed font-medium flex-1 pt-2">
              Find more about the applicable limitations in our money-back guarantee policy.
            </p>
            <div className="flex-shrink-0 pt-2">
              <GuaranteeSeal />
            </div>
          </div>
        </Card>

        {/* 3. Safety Card */}
        <Card className="text-left mb-4">
          <h2 className="text-[16px] md:text-[18px] font-bold text-white mb-2 tracking-tight">
            Your information is safe
          </h2>
          <p className="text-[12px] md:text-[13px] text-gray-400 mb-5 leading-relaxed font-medium">
            We will not sell or share your personal information for any marketing purposes.
          </p>
          <div className="text-[13px] md:text-[14px] text-white font-bold flex items-center gap-1.5 pt-4 border-t border-white/5">
            <span>Need help? Contact us</span>
            <a href="#" className="text-[#3b82f6] hover:text-[#60a5fa] hover:underline transition-colors drop-shadow-sm">
              here
            </a>
          </div>
        </Card>

      </div>

      {/* FINAL CHECKOUT BUTTON (Fixed to bottom) */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinalCheckout}
          className="w-full max-w-[440px] bg-[#E71B25] hover:bg-[#d41820] text-white py-4 md:py-[18px] rounded-[1.25rem] font-bold text-[15px] md:text-[16px] uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(231,27,37,0.3)] pointer-events-auto flex items-center justify-center gap-2.5 border border-[#ff4747]/20"
        >
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
          Proceed to Secure Checkout
        </motion.button>
      </div>
      
    </motion.div>
  );
};

export default TrustUpflowPage;