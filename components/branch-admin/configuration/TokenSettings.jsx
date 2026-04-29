"use client";

import React, { useState } from "react";
import { 
  AlertTriangle,
  RotateCcw,
  Ticket,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TokenSettings() {
  const [departmentLimits, setDepartmentLimits] = useState([
    { name: "Cardiology", current: 45, limit: 60 },
    { name: "Neurology", current: 32, limit: 50 },
    { name: "Orthopedics", current: 58, limit: 80 },
    { name: "Pediatrics", current: 72, limit: 100 },
    { name: "General Medicine", current: 95, limit: 120 },
  ]);

  return (
    <div className="space-y-6">
      {/* Token Generation Settings */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 shadow-none">
        <div className="flex items-center gap-2 mb-6">
          <Ticket className="w-5 h-5 text-primary" />
          <h2 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Token Generation Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Token Format</label>
            <input 
              type="text" 
              placeholder="e.g., TKN-{ID}-{DATE}"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Starting Token Number</label>
            <input 
              type="number" 
              defaultValue="1"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Tokens Per Time Slot</label>
            <input 
              type="number" 
              defaultValue="5"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Token Validity (hours)</label>
            <input 
              type="number" 
              defaultValue="2"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { id: 'auto', label: "Auto-Generate Tokens", desc: "Automatically generate tokens for walk-in patients" },
            { id: 'sms', label: "SMS Notifications", desc: "Send token details via SMS to patients" },
            { id: 'screen', label: "Display on Screen", desc: "Show current token on waiting room display" },
            { id: 'transfer', label: "Allow Token Transfer", desc: "Enable patients to transfer tokens to another slot" },
          ].map((item) => (
            <TokenToggleItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Token Reset Settings */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 shadow-none">
        <div className="flex flex-col sm:justify-between sm:flex-row sm:items-center gap-4 mb-6">
          <h2 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Token Reset Settings</h2>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-[5px] text-[12px] font-bold hover:bg-red-50 transition-all shadow-none w-full sm:w-auto">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Tokens
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Auto-Reset Frequency</label>
            <input 
              type="text" 
              placeholder="Daily"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Reset Time</label>
            <input 
              type="text" 
              placeholder="12:00 AM"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-[5px]">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-amber-600">Important Notice</p>
            <p className="text-[12px] text-amber-600/80 leading-relaxed">
              Resetting tokens will clear all current token assignments. This action cannot be undone. Make sure to inform patients before performing a reset.
            </p>
          </div>
        </div>
      </div>

      {/* Department-wise Token Limits */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 shadow-none">
        <h2 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">Department-wise Token Limits</h2>
        
        <div className="space-y-6">
          {departmentLimits.map((dept, idx) => {
            const percentage = Math.round((dept.current / dept.limit) * 100);
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-1/4">
                  <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{dept.name}</p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-medium text-[#5E6C84] dark:text-slate-400">
                    <span>{dept.current} / {dept.limit} tokens</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-20">
                  <input 
                    type="number" 
                    defaultValue={dept.limit}
                    className="w-full h-9 px-3 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary shadow-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TokenToggleItem({ item }) {
  const [checked, setChecked] = useState(true);
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/10 transition-all"
    >
      <div>
        <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{item.label}</p>
        <p className="text-[11px] text-[#5E6C84] dark:text-slate-500">{item.desc}</p>
      </div>
      <div className={cn(
        "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all",
        checked ? "bg-primary border-primary" : "border-gray-300 dark:border-white/20 bg-white dark:bg-transparent"
      )}>
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </div>
  );
}
