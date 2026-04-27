"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, MapPin, Phone, Mail, 
  ArrowLeft, Bed, Users, LayoutGrid,
  Database, Lock, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/branches/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setBranch(json.data);
        }
      } catch (error) {
        console.error("Fetch branch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 flex justify-center text-gray-400">
        Loading branch details...
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-600">Branch not found</h2>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-indigo-600 font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-gray-500 hover:text-indigo-600 transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">Branch profile</h1>
        </div>

        <button 
          onClick={() => router.push(`/super-admin/branches/${id}/users`)}
          className="flex items-center gap-2.5 px-6 h-[44px] bg-primary text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
        >
          <Users className="w-4 h-4" />
          Access user directory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Core Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 text-center shadow-none">
            <div className="w-24 h-24 bg-[#F0F2FF] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10 mx-auto mb-4">
              <Building2 className="w-12 h-12 text-[#2D3A8C]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1e293b] dark:text-white">{branch.name}</h2>
            <p className="text-gray-400 text-[14px] mt-1 font-medium tracking-tight">Branch code: <span className="font-bold text-[#1e293b] dark:text-gray-200">{branch.code}</span></p>
            <div className={cn(
              "mt-4 inline-block px-4 py-1.5 rounded-[5px] text-[12px] font-bold border",
              branch.active ? "bg-[#E7F9ED] text-[#2ECC71] border-[#2ECC71]/20" : "bg-red-50 text-red-500 border-red-100"
            )}>
              {branch.active ? "Operational" : "Suspended"}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 space-y-5 shadow-none">
            <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              Official contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Physical address</p>
                   <p className="text-[13px] font-medium leading-relaxed">{branch.address}, {branch.city}, {branch.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Contact number</p>
                   <p className="text-[13px] font-medium">{branch.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Registrar email</p>
                   <p className="text-[13px] font-medium">{branch.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Person Information */}
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 space-y-5 border-l-4 border-l-primary shadow-none">
            <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              Contact person
            </h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Users className="w-5 h-5 text-primary" />
                 <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Full name</p>
                   <p className="text-[14px] font-bold text-[#1e293b] dark:text-gray-200">{branch.contactPersonName || "Not assigned"}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Phone className="w-4 h-4 text-primary" />
                 <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Internal contact</p>
                   <p className="text-[13px] font-medium">{branch.contactPersonPhone || "-"}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Mail className="w-4 h-4 text-primary" />
                 <div>
                   <p className="text-[11px] text-gray-400 font-bold mb-0.5">Personal email</p>
                   <p className="text-[13px] font-medium">{branch.contactPersonEmail || "-"}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Infrastructure & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Patient beds", value: "-", icon: Bed, color: "text-indigo-500" },
              { label: "Personnel", value: "-", icon: Users, color: "text-emerald-500" },
              { label: "Modules", value: "All active", icon: LayoutGrid, color: "text-blue-500" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-5 flex items-center justify-between shadow-none">
                <div>
                  <p className="text-[11px] text-gray-400 font-bold mb-1">{item.label}</p>
                  <p className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">{item.value}</p>
                </div>
                <div className="w-10 h-10 rounded-[5px] flex items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] border border-[#E7E8EB] dark:border-white/10">
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
              </div>
            ))}
          </div>

          {/* Database Infrastructure Details */}
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-8 shadow-none relative overflow-hidden">
             <div className="flex items-center gap-3 mb-8 border-b dark:border-white/5 pb-4">
                <div className="p-2 bg-primary/10 rounded-[5px]">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Infrastructure blueprint</h3>
                  <p className="text-[11px] text-gray-500 font-bold">Automated database isolation cluster</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-1">
                      <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2">
                        <LayoutGrid className="w-3 h-3" /> System namespace
                      </p>
                      <code className="text-[15px] font-bold text-gray-800 dark:text-gray-200 block px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-white/5 rounded-[5px] font-mono">
                         {branch.dbName || "ghms_pending_provision"}
                      </code>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2">
                        <Users className="w-3 h-3" /> Data custodian
                      </p>
                      <code className="text-[14px] font-bold text-gray-800 dark:text-gray-300 block px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-white/5 rounded-[5px] font-mono">
                         {branch.dbUser || "postgres"}
                      </code>
                   </div>
                </div>

                <div className="space-y-6 bg-slate-50 dark:bg-transparent p-6 rounded-[5px] border border-dashed border-gray-200 dark:border-white/5">
                   <div className="flex items-center justify-between">
                     <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Security token
                     </p>
                     <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-[5px] font-bold">Auto-generated</span>
                   </div>
                   <div className="relative group">
                     <input 
                       type={showPassword ? "text" : "password"} 
                       readOnly 
                       value={branch.dbPassword || "••••••••••••"} 
                       className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-[5px] px-4 py-3 text-[14px] font-mono font-bold text-primary shadow-none"
                     />
                     <button 
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all"
                     >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                   </div>
                   <p className="text-[10px] text-gray-400 italic">Credentials are encrypted and stored in the root vault. This information is required for forensic data audits.</p>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-8 text-center py-16 shadow-none">
             <div className="max-w-[400px] mx-auto opacity-80">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-[18px] font-bold text-gray-600 dark:text-gray-400">Analytic visualization locked</h3>
                <p className="text-gray-500 mt-3 text-[12px] font-medium leading-relaxed">
                   Comprehensive operational metrics and cross-branch data aggregation will materialize upon full module instantiation and data seeding.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
