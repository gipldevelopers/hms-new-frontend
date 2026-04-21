"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const MODULE_MESSAGES = {
  "/auth": [
    { title: "GVoice HMS", subtitle: "Securing your access portal..." },
    { title: "Authenticating", subtitle: "Verifying credentials and permissions..." }
  ],
  "/super-admin": [
    { title: "Super Admin", subtitle: "Arranging administrative controls..." },
    { title: "Global Settings", subtitle: "Loading management workspace..." }
  ],
  "/branch-admin": [
    { title: "Branch Admin", subtitle: "Setting up branch dashboard..." },
    { title: "Local Controls", subtitle: "Preparing administrative panel..." }
  ],
  "/doctor": [
    { title: "Doctor Portal", subtitle: "Arranging patient records..." },
    { title: "Clinical View", subtitle: "Preparing medical workspace..." }
  ],
  "/reception": [
    { title: "Reception", subtitle: "Arranging front-desk controls..." },
    { title: "Patient Queue", subtitle: "Managing registration workspace..." }
  ],
  "/pharmacy": [
    { title: "Pharmacy", subtitle: "Initializing inventory view..." },
    { title: "Medicine Stock", subtitle: "Syncing pharmaceutical records..." }
  ],
  "/laboratory": [
    { title: "Laboratory", subtitle: "Setting up diagnostic view..." },
    { title: "Test Results", subtitle: "Loading lab management module..." }
  ],
  "/finance": [
    { title: "Finance", subtitle: "Generating financial reports..." },
    { title: "Accounts View", subtitle: "Preparing billing dashboard..." }
  ],
  // Fallback for others
  "default": [
    { title: "GVoice HMS", subtitle: "Initializing digital infrastructure..." },
    { title: "Workspace Prep", subtitle: "Preparing your management modules..." },
    { title: "Almost Ready", subtitle: "Finalizing your dashboard session..." }
  ]
};

export function GlobalLoader() {
  const pathname = usePathname();
  const [stepIndex, setStepIndex] = useState(0);

  // Determine current steps based on pathname
  const currentModule = Object.keys(MODULE_MESSAGES).find(key => pathname?.startsWith(key)) || "default";
  const steps = MODULE_MESSAGES[currentModule];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0A0F1D]">
      <div className="flex flex-col items-center gap-8 max-w-md px-6 text-center">
        
        {/* OLD LOGO PULSE ANIMATION (AS REQUESTED) */}
        <div className="relative">
          {/* External Spinner */}
          <div className="w-24 h-24 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          
          {/* Sonar Ripple Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full animate-ping duration-1000"></div>
          </div>

          {/* Logo with Heartbeat Pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white dark:bg-[#1e293b] rounded-[5px] shadow-2xl shadow-primary/20 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5 animate-pulse">
               <img 
                 src="/favicon.ico" 
                 alt="Logo" 
                 className="w-10 h-10 object-contain scale-110"
               />
            </div>
          </div>
        </div>
        
        {/* Dynamic Loading Content */}
        <div className="flex flex-col items-center min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentModule}-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-2"
            >
              <h2 className="text-[22px] font-semibold text-[#1e293b] dark:text-white tracking-tight">
                {steps[stepIndex].title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {steps[stepIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Animated Dots Navigation */}
          <div className="flex gap-2 mt-6">
             {steps.map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ 
                    scale: i === stepIndex ? 1.2 : 1,
                    opacity: i === stepIndex ? 1 : 0.3,
                    backgroundColor: i === stepIndex ? "#3b82f6" : "#94a3b8"
                  }}
                  className="w-1.5 h-1.5 rounded-full" 
                />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ConsoleSwitcher } from "@/components/layout/ConsoleSwitcher";

export function RootContent({ children }) {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isAppLoading && <GlobalLoader />}
      <div className={isAppLoading ? "invisible h-0" : "contents"}>
        {children}
        <ConsoleSwitcher />
      </div>
    </>
  );
}
