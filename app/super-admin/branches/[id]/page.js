"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, MapPin, Phone, Mail, 
  ArrowLeft, Bed, Users, LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const token = localStorage.getItem("token");
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
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-gray-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">Branch Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Core Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 text-center">
            <div className="w-24 h-24 bg-[#F0F2FF] dark:bg-[#1e293b] rounded-[12px] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10 mx-auto mb-4">
              <Building2 className="w-12 h-12 text-[#2D3A8C]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1e293b] dark:text-white">{branch.name}</h2>
            <p className="text-gray-400 text-[14px] mt-1">Branch Code: {branch.code}</p>
            <div className={cn(
              "mt-4 inline-block px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider",
              branch.isActive ? "bg-[#E7F9ED] text-[#2ECC71]" : "bg-gray-100 text-gray-400"
            )}>
              {branch.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 space-y-5">
            <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2D3A8C] mt-0.5" />
                <div>
                  <p className="text-[12px] text-gray-400 uppercase font-bold tracking-wider">Address</p>
                  <p className="text-[14px] text-[#1e293b] dark:text-gray-300 mt-0.5">{branch.address}, {branch.city}, {branch.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2D3A8C]" />
                <div>
                  <p className="text-[12px] text-gray-400 uppercase font-bold tracking-wider">Phone</p>
                  <p className="text-[14px] text-[#1e293b] dark:text-gray-300 mt-0.5">{branch.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2D3A8C]" />
                <div>
                  <p className="text-[12px] text-gray-400 uppercase font-bold tracking-wider">Email</p>
                  <p className="text-[14px] text-[#1e293b] dark:text-gray-300 mt-0.5">{branch.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Admin Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Occupancy", value: "-", icon: Bed, color: "indigo" },
              { label: "Total Staff", value: "-", icon: Users, color: "emerald" },
              { label: "Departments", value: "-", icon: LayoutGrid, color: "blue" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-[24px] font-bold text-[#1e293b] dark:text-white mt-1">{item.value}</p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-[10px] flex items-center justify-center bg-gray-50 dark:bg-slate-800"
                )}>
                  <item.icon className="w-6 h-6 text-[#2D3A8C]" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-8 text-center py-20">
             <div className="max-w-[400px] mx-auto">
                <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Admin Module Pending</h3>
                <p className="text-gray-400 mt-2 text-[14px]">
                  Extended branch metrics and administrative controls will be available once the Branch Admin module is fully implemented.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-[10px] border border-dashed border-gray-200 dark:border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Branch Manager</p>
                      <p className="text-[14px] font-bold text-gray-400 mt-1">-</p>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-[10px] border border-dashed border-gray-200 dark:border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Monthly Revenue</p>
                      <p className="text-[14px] font-bold text-gray-400 mt-1">₹-</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
