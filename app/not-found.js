"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen w-screen bg-[#F8F9FC] dark:bg-[#0A0F1D] flex flex-col items-center p-6 font-sans relative overflow-hidden">
      
      {/* ── IMMERSIVE ANIMATED BACKGROUND ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[180px]" 
        />
        
        {/* Full Screen Grid */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]" 
          style={{ 
            backgroundImage: `linear-gradient(#2E37A4 1.5px, transparent 1.5px), linear-gradient(90deg, #2E37A4 1.5px, transparent 1.5px)`,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* ── TOP LOGO ── */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-12 z-20"
      >
        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-[#E7E8EB] dark:border-white/10 shadow-sm">
          <Image src="/favicon.ico" width={24} height={24} alt="Logo" className="object-contain" />
          <span className="text-[14px] font-black text-primary tracking-tighter uppercase">GVoice HMS</span>
        </div>
      </motion.div>

      {/* ── CENTERED HERO SECTION ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center max-w-4xl w-full">
        <div className="relative mb-4">
          {/* Main 404 Text */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.2 
            }}
            className="text-[120px] sm:text-[220px] md:text-[280px] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-blue-500 to-indigo-400 leading-none select-none tracking-tighter"
          >
            404
          </motion.h1>

          {/* Floating Blur Effect */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-[130px] sm:text-[240px] md:text-[300px] font-black text-primary leading-none blur-[40px]">404</h1>
          </motion.div>
        </div>

        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 px-6"
        >
          <h2 className="text-[24px] md:text-[36px] font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Page Not Found
          </h2>
          <p className="text-[14px] md:text-[16px] font-bold text-slate-500 dark:text-slate-400 max-w-[550px] mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </motion.div>

        {/* Immersive Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 w-full px-6"
        >
          <Link 
            href="/" 
            className="flex items-center justify-center gap-3 h-[58px] px-8 bg-primary text-white rounded-[5px] text-[14px] font-black uppercase tracking-widest transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 group sm:min-w-[240px]"
          >
            <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-3 h-[58px] px-8 bg-white dark:bg-white/5 backdrop-blur-xl border-2 border-[#E7E8EB] dark:border-white/10 text-slate-800 dark:text-white rounded-[5px] text-[14px] font-black uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] sm:min-w-[240px]"
          >
            <RotateCcw className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </div>

    </div>
  );
}
