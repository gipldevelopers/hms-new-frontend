"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff, ChevronRight, CheckCircle2, Zap, Globe, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing recovery token.");
      router.push("/auth/login");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passcode mismatch detected.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        toast.success("Security credentials updated successfully.");
      } else {
        toast.error(result.message || "Registry update failure.");
      }
    } catch (err) {
      toast.error("Infrastructure connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-[24px] font-bold text-[#1e293b] dark:text-white leading-tight mb-4">Credentials Updated.</h2>
        <p className="text-[14px] font-semibold text-gray-500 leading-relaxed mb-10">
          Your institutional access token has been reconfigured. You can now synchronize with the main node.
        </p>
        <Link 
          href="/auth/login" 
          className="inline-flex items-center justify-center w-full h-[54px] rounded-[5px] bg-[#2E37A4] text-white text-[14px] font-bold tracking-[1.5px] transition-all hover:bg-[#252c84]"
        >
          Proceed to Login <ChevronRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-left">
        <h2 className="text-[26px] font-bold text-[#1e293b] dark:text-white leading-tight">Reconfigure <br/>Access Passcode.</h2>
        <p className="text-[14px] font-semibold text-gray-500 mt-3 leading-relaxed">
          Establish new security credentials for your institutional account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#1e293b] dark:text-gray-300 pl-1">
            New Passcode
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-[17px] h-[17px] stroke-[2]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={cn(
                "w-full h-[52px] pl-11 pr-11 bg-[#F8F9FC] dark:bg-white/[0.03] border border-[#E7E8EB] dark:border-white/10 rounded-[5px]",
                "text-[14px] font-bold text-[#1e293b] dark:text-white outline-none transition-all duration-300 shadow-none",
                "focus:border-[#2E37A4] focus:bg-white transition-all"
              )}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#1e293b] dark:text-gray-300 pl-1">
            Confirm Passcode
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <ShieldCheck className="w-[17px] h-[17px] stroke-[2]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className={cn(
                "w-full h-[52px] pl-11 pr-11 bg-[#F8F9FC] dark:bg-white/[0.03] border border-[#E7E8EB] dark:border-white/10 rounded-[5px]",
                "text-[14px] font-bold text-[#1e293b] dark:text-white outline-none transition-all duration-300 shadow-none",
                "focus:border-[#2E37A4] focus:bg-white transition-all"
              )}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-[54px] rounded-[5px] bg-[#2E37A4] text-white text-[14px] font-bold tracking-[1.5px] transition-all duration-300 hover:bg-[#252c84] disabled:opacity-50 border border-[#2E37A4]/10"
        >
          {isLoading ? (
            <div className="h-6 w-6 animate-spin border-[3px] border-white/20 border-t-white rounded-full mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              Update Credentials <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full bg-[#F8F9FC] dark:bg-[#0A0F1D] font-sans selection:bg-[#2E37A4]/20 overflow-hidden">
      
      {/* ── LEFT PANEL – BRANDING ── */}
      <div className="relative hidden xl:flex w-[55%] flex-col justify-between p-12 overflow-hidden bg-[#2E37A4]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#3D49C9] rounded-full blur-[120px] opacity-40"
           />
           <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
           />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-white/10 p-2.5 rounded-[5px] border border-white/20 backdrop-blur-xl">
                  <Image src="/favicon.ico" width={32} height={32} alt="Logo" className="brightness-0 invert" />
               </div>
               <div>
                  <h2 className="text-white text-[22px] font-black tracking-tighter italic">GVoice HMS</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <p className="text-white/50 text-[9px] font-bold tracking-[3px]">Next-Gen Healthcare OS</p>
                  </div>
               </div>
            </div>

            <div className="max-w-[90%]">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <p className="text-white/60 font-black text-[12px] tracking-[5px] mb-4">Security Hardening</p>
                  <h1 className="text-white text-[56px] font-bold leading-[1] mb-6 tracking-tighter">
                    Credentials <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-100">Bypass.</span>
                  </h1>
                  <p className="text-white/70 text-[18px] leading-relaxed font-medium mb-10 max-w-[600px]">
                    Resetting your passcode ensures institutional security integrity. Choose a strong, unique token.
                  </p>
               </motion.div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-8">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                     <Lock className="w-5 h-5 text-blue-200" />
                  </div>
                  <p className="text-white/80 text-[14px] font-bold">SHA-256 Encrypted Storage</p>
               </div>
            </div>
        </div>
      </div>

      {/* ── RIGHT PANEL – RESET PASSWORD ── */}
      <div className="relative flex-1 h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#0A0F1D]">
        <div className="min-h-full flex flex-col items-center justify-center p-6 py-16 md:p-12">
          <div className="w-full max-w-[420px]">
          
          <Link href="/auth/login" className="flex items-center gap-2 text-gray-400 hover:text-[#2E37A4] transition-colors font-bold text-[11px] uppercase tracking-widest mb-10 group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Abort Reconfiguration
          </Link>

          <Suspense fallback={<div className="text-center p-10 font-bold text-gray-400">Synchronizing Identity Tokens...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-12 w-full flex justify-between items-center text-[10px] font-bold text-gray-400 border-t border-gray-100 dark:border-white/5 pt-6">
             <p>© 2026 Gohil Infotech</p>
             <div className="flex items-center gap-6">
                <a href="#" className="hover:text-[#2E37A4]">Security Policy</a>
                <a href="#" className="hover:text-[#2E37A4]">System Logs</a>
             </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
