"use client";

import React, { useState } from "react";
import { 
  Trash2, 
  Clock, 
  Plus,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OpdTimings() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Cardiology", startTime: "09:00 AM", endTime: "05:00 PM", slotDuration: 15, maxPatients: 8, status: true },
    { id: 2, name: "Neurology", startTime: "10:00 AM", endTime: "04:00 PM", slotDuration: 45, maxPatients: 6, status: true },
    { id: 3, name: "Orthopedics", startTime: "09:00 AM", endTime: "06:00 PM", slotDuration: 15, maxPatients: 10, status: true },
    { id: 4, name: "Pediatrics", startTime: "08:00 AM", endTime: "02:00 PM", slotDuration: 10, maxPatients: 12, status: true },
    { id: 5, name: "General Medicine", startTime: "09:00 AM", endTime: "08:00 PM", slotDuration: 15, maxPatients: 15, status: true },
    { id: 6, name: "Dermatology", startTime: "11:00 AM", endTime: "03:00 PM", slotDuration: 10, maxPatients: 8, status: false },
  ]);

  const toggleStatus = (id) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, status: !dept.status } : dept
    ));
  };

  const removeDept = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* General Settings Card */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 shadow-none">
        <h2 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">General Opd Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Default Start Time</label>
            <input 
              type="text" 
              placeholder="09:00 AM"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Default End Time</label>
            <input 
              type="text" 
              placeholder="05:00 PM"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Break Time Duration (minutes)</label>
            <input 
              type="number" 
              defaultValue="60"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Break Start Time</label>
            <input 
              type="text" 
              placeholder="01:00 PM"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400">Break End Time</label>
            <input 
              type="text" 
              placeholder="02:00 PM"
              className="w-full h-11 px-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div 
            className="w-10 h-5 rounded-full bg-gray-200 dark:bg-white/10 relative cursor-pointer transition-colors"
            onClick={() => {}}
          >
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all" />
          </div>
          <span className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">Enable Sunday Opd</span>
        </div>
      </div>

      {/* Department-wise Settings Card */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden">
        <div className="p-5 border-b border-[#E7E8EB] dark:border-white/10">
          <h2 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Department-wise Timings</h2>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FA] dark:bg-[#151D36]">
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Department</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Start Time</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">End Time</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Slot Duration (min)</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Max Patients/slot</th>
                <th className="px-4 sm:px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Status</th>
                <th className="px-4 sm:px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{dept.name}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <input 
                      type="text" 
                      defaultValue={dept.startTime}
                      className="w-24 h-9 px-3 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary shadow-none"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <input 
                      type="text" 
                      defaultValue={dept.endTime}
                      className="w-24 h-9 px-3 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary shadow-none"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <input 
                      type="number" 
                      defaultValue={dept.slotDuration}
                      className="w-16 h-9 px-3 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary shadow-none"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <input 
                      type="number" 
                      defaultValue={dept.maxPatients}
                      className="w-16 h-9 px-3 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary shadow-none"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <div 
                      className={cn(
                        "w-10 h-5 rounded-full relative cursor-pointer transition-colors mx-auto",
                        dept.status ? "bg-primary" : "bg-gray-200 dark:bg-white/10"
                      )}
                      onClick={() => toggleStatus(dept.id)}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                        dept.status ? "right-0.5" : "left-0.5"
                      )} />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <button 
                      onClick={() => removeDept(dept.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
