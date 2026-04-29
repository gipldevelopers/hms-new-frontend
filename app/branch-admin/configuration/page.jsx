"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Save,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import OpdTimings from "@/components/branch-admin/configuration/OpdTimings";
import TokenSettings from "@/components/branch-admin/configuration/TokenSettings";

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("Opd Timings");

  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none">
          {activeTab} Configuration
        </h1>
        
        <div className="flex items-center gap-3">
          {activeTab === "Opd Timings" && (
            <button 
              className="h-[40px] px-4 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          )}
          <button 
            className="h-[40px] px-4 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 bg-[#2D3A8C] text-white hover:opacity-90 transition-all shadow-none"
          >
            <Save className="w-4 h-4" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-4 border-b border-[#E7E8EB] dark:border-white/10 overflow-x-auto no-scrollbar">
        {["Opd Timings", "Token Setting"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-1 py-3 text-[13px] font-bold transition-all relative whitespace-nowrap",
              activeTab === tab 
                ? "text-[#2D3A8C] dark:text-primary" 
                : "text-[#5E6C84] dark:text-slate-400 hover:text-[#1A1C23] dark:hover:text-white"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2D3A8C] dark:bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-2">
        {activeTab === "Opd Timings" ? (
          <OpdTimings />
        ) : (
          <TokenSettings />
        )}
      </div>
    </div>
  );
}
