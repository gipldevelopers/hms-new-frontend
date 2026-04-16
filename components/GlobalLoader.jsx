"use client";

import React from "react";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0A0F1D]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo Container */}
        <div className="relative">
          {/* External Spinner */}
          <div className="w-24 h-24 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          
          {/* Sonar Ripple Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full animate-ping duration-1000"></div>
          </div>

          {/* Logo with Heartbeat Pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl shadow-primary/20 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5 animate-pulse">
               <img 
                 src="/favicon.ico" 
                 alt="Logo" 
                 className="w-10 h-10 object-contain scale-110"
               />
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center">
          <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight flex items-center gap-2">
            GVoice HMS
          </h2>
          <div className="flex gap-1 mt-3">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RootContent({ children }) {
  const [isAppLoading, setIsAppLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isAppLoading && <GlobalLoader />}
      <div className={isAppLoading ? "invisible h-0" : "contents"}>
        {children}
      </div>
    </>
  );
}
