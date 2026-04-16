"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck, HeartPulse, ExternalLink, Globe, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (eEmail = email, ePassword = password) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eEmail, password: ePassword }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
        router.push("/super-admin");
      } else {
        setError(result.message || "Credential validation failed. Please try again.");
      }
    } catch (err) {
      setError("Infrastructure connection error. Verify network stability.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const autoFillSuperAdmin = () => {
    const creds = {
      email: "super.developer@gohilinfotech.com",
      password: "super@123",
    };
    setEmail(creds.email);
    setPassword(creds.password);
    handleLogin(creds.email, creds.password);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F9FC] dark:bg-[#0A0F1D] font-sans selection:bg-[#2E37A4]/20 overflow-hidden">
      
      {/* ── LEFT PANEL – IMMERSIVE ANIMATED BRANDING ── */}
      <div className="relative hidden xl:flex w-[60%] flex-col justify-between p-12 overflow-hidden bg-[#2E37A4]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               x: [0, 50, 0],
               y: [0, -30, 0]
             }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#3D49C9] rounded-full blur-[120px] opacity-40"
           />
           <motion.div 
             animate={{ 
               scale: [1, 1.3, 1],
               x: [0, -60, 0],
               y: [0, 40, 0]
             }}
             transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-[#1E256F] rounded-full blur-[100px] opacity-60"
           />
           <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
           />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
               <div className="bg-white/10 p-2.5 rounded-[12px] border border-white/20 backdrop-blur-xl">
                  <Image src="/favicon.ico" width={32} height={32} alt="Logo" className="brightness-0 invert" />
               </div>
               <div>
                  <h2 className="text-white text-[22px] font-black tracking-tighter uppercase italic">GVoice HMS</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <p className="text-white/50 text-[9px] font-bold uppercase tracking-[3px]">Next-Gen Healthcare OS</p>
                  </div>
               </div>
            </div>

            {/* Marketing Centric Copy */}
            <div className="max-w-[90%]">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
               >
                  <p className="text-white/60 font-black text-[12px] uppercase tracking-[5px] mb-4">Revolutionary Management</p>
                  <h1 className="text-white text-[56px] font-bold leading-[1] mb-6 tracking-tighter">
                    Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-100">Clinical Precision.</span>
                  </h1>
                  <p className="text-white/70 text-[18px] leading-relaxed font-medium mb-10 max-w-[600px]">
                    Experience a unified ecosystem that harmonizes patient care, institutional data, and operational blueprints in real-time.
                  </p>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-3 max-w-[550px]">
                     {[
                       { icon: Zap, text: "Instant Data Provisioning", sub: "Global-to-Local scale" },
                       { icon: Globe, text: "Multi-Branch Sync", sub: "Enterprise Architecture" },
                       { icon: CheckCircle2, text: "Regulatory Compliance", sub: "HIPAA & HL7 Standards" },
                       { icon: HeartPulse, text: "Real-time Diagnostics", sub: "Patient-first intelligence" }
                     ].map((f, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-[12px] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default">
                           <div className="w-9 h-9 rounded-[8px] bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <f.icon className="w-4 h-4 text-blue-200" />
                           </div>
                           <div>
                              <p className="text-white font-bold text-[12px]">{f.text}</p>
                              <p className="text-white/40 text-[9px] font-bold uppercase tracking-tight mt-0.5">{f.sub}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>

            {/* Platform Trust */}
            <div className="flex items-center justify-between border-t border-white/10 pt-8">
               <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-[2.5px] border-[#2E37A4] bg-slate-200 overflow-hidden shadow-xl transition-transform hover:-translate-y-1">
                       <img src={`https://i.pravatar.cc/100?u=hms${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-[2.5px] border-[#2E37A4] bg-blue-600 flex items-center justify-center shadow-xl">
                     <p className="text-white text-[9px] font-black">+4k</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">Gohil Infotech</p>
                  <p className="text-white text-[16px] font-black mt-1 leading-none">Trusted By Leading Hospitals</p>
               </div>
            </div>
        </div>
      </div>

      {/* ── RIGHT PANEL – REFINED AUTH ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white dark:bg-[#0A0F1D]">
        <div className="w-full max-w-[400px]">
          
          {/* Mobile Only Header */}
          <div className="xl:hidden flex items-center gap-3 mb-8">
             <div className="bg-[#2E37A4] p-2 rounded-[10px]">
                <Image src="/favicon.ico" width={20} height={20} alt="Logo" className="brightness-0 invert" />
             </div>
             <h2 className="text-[#2E37A4] text-[18px] font-black tracking-tighter uppercase italic">GVoice HMS</h2>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-[26px] font-bold text-[#1e293b] dark:text-white leading-tight">Sign Into <br/>Administrative Node.</h2>
            <p className="text-[14px] font-semibold text-gray-500 mt-3 leading-relaxed">
              Authorized access required for institutional management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1e293b] dark:text-gray-300 uppercase tracking-widest pl-1">
                Access Identifier
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-[17px] h-[17px] stroke-[2]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gvoice.hms"
                  className={cn(
                    "w-full h-[52px] pl-11 pr-4 bg-[#F8F9FC] dark:bg-white/[0.03] border border-[#E7E8EB] dark:border-white/10 rounded-[10px]",
                    "text-[14px] font-bold text-[#1e293b] dark:text-white outline-none transition-all duration-300 shadow-none",
                    "focus:border-[#2E37A4] focus:bg-white transition-all"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-[#1e293b] dark:text-gray-300 uppercase tracking-widest">
                  Passcode / Token
                </label>
                <button type="button" className="text-[10px] font-bold text-[#2E37A4] hover:underline uppercase tracking-tighter">Reset Passcode</button>
              </div>
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
                    "w-full h-[52px] pl-11 pr-11 bg-[#F8F9FC] dark:bg-white/[0.03] border border-[#E7E8EB] dark:border-white/10 rounded-[10px]",
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

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-[10px] bg-red-50 border border-red-100 text-red-600">
                <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                <p className="text-[11px] font-bold leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full h-[54px] rounded-[10px] bg-[#2E37A4] text-white text-[14px] font-bold uppercase tracking-[1.5px] transition-all duration-300 hover:bg-[#252c84] disabled:opacity-50 border border-[#2E37A4]/10"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin border-[3px] border-white/20 border-t-white rounded-full mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Access / Demo */}
          <div className="mt-12 text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-gray-100 dark:bg-white/5" />
              <span className="relative bg-white dark:bg-[#0A0F1D] px-6 text-[9px] font-bold text-gray-400 uppercase tracking-[3px]">
                Demo Sandbox
              </span>
            </div>
            
            <button
              type="button"
              onClick={autoFillSuperAdmin}
              className="w-full h-[50px] flex items-center justify-center gap-3 rounded-[10px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[12px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 transition-all shadow-none group"
            >
              <div className="w-8 h-8 rounded-full bg-[#2E37A4]/5 flex items-center justify-center group-hover:bg-[#2E37A4] group-hover:text-white transition-all duration-300">
                <Zap className="h-4 w-4" />
              </div>
              Bypass to Principal Dashboard
            </button>
          </div>
        </div>

        {/* Global Footer Meta */}
        <div className="absolute bottom-6 w-full px-12 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           <p>© 2026 Gohil Infotech</p>
           <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#2E37A4]">GVoice HMS Platform</a>
              <a href="#" className="hover:text-[#2E37A4]">System Logs</a>
           </div>
        </div>
      </div>
    </div>
  );
}