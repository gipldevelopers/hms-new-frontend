"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ShieldAlert, Home, Zap } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        
        {/* ── LEFT SECTION – INSTITUTIONAL CONTEXT ── */}
        <div className="bg-[#2E37A4] p-12 flex flex-col justify-between relative overflow-hidden">
           {/* Decorative Background */}
           <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mb-32" />
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                 <div className="bg-white/10 p-2 rounded-[5px] border border-white/20 backdrop-blur-xl">
                    <Image src="/favicon.ico" width={24} height={24} alt="Logo" className="brightness-0 invert" />
                 </div>
                 <h2 className="text-white text-[16px] font-black tracking-tighter italic">GVoice HMS</h2>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-white/40 font-black text-[10px] tracking-[5px] mb-4 uppercase">System Exception 404</p>
                <h1 className="text-white text-[48px] font-bold leading-[1.1] mb-6 tracking-tighter">
                  Node <span className="text-blue-300">Unreachable.</span>
                </h1>
                <p className="text-white/70 text-[16px] leading-relaxed font-medium max-w-[350px]">
                  The requested resource index is not registered in our current institutional mapping.
                </p>
              </motion.div>
           </div>

           <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-8 mt-12 md:mt-0">
              <div className="w-10 h-10 rounded-[5px] bg-white/10 flex items-center justify-center border border-white/20">
                 <ShieldAlert className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                 <p className="text-white font-bold text-[12px]">Infrastructure Security</p>
                 <p className="text-white/40 text-[9px] font-bold tracking-tight uppercase">Access logging initialized</p>
              </div>
           </div>
        </div>

        {/* ── RIGHT SECTION – NAVIGATION ── */}
        <div className="p-12 flex flex-col justify-center items-center text-center">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="w-32 h-32 bg-[#F8F9FC] dark:bg-white/[0.03] rounded-full flex items-center justify-center border border-[#E7E8EB] dark:border-white/10 mb-8 relative"
           >
              <Search className="w-10 h-10 text-gray-300" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-10 h-10 bg-white dark:bg-[#101935] rounded-full shadow-lg flex items-center justify-center border border-[#E7E8EB] dark:border-white/10"
              >
                 <Zap className="w-4 h-4 text-primary" />
              </motion.div>
           </motion.div>

           <h2 className="text-[24px] font-bold text-[#1e293b] dark:text-white mb-3">Resource Disconnected.</h2>
           <p className="text-[14px] font-semibold text-gray-500 max-w-[300px] mb-10">
             The path you followed may be deprecated or restricted. Please return to the main operational node.
           </p>

           <div className="grid grid-cols-1 w-full gap-3">
              <Link 
                href="/" 
                className="flex items-center justify-center gap-3 h-[54px] bg-[#2E37A4] text-white rounded-[5px] text-[14px] font-bold tracking-widest hover:bg-[#252c84] transition-all"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-3 h-[54px] bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 text-[#1e293b] dark:text-white rounded-[5px] text-[14px] font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Revert Last Action
              </button>
           </div>

           <div className="mt-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              GVoice HMS Ecosystem &copy; 2026
           </div>
        </div>

      </div>
    </div>
  );
}
