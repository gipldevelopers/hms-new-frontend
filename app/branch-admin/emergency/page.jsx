"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Trash2, 
  Eye,
  ChevronDown,
  Calendar,
  AlertCircle,
  Clock,
  User,
  Stethoscope,
  MoreVertical,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_PATIENTS = [
  { id: 1, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "In Treatment" },
  { id: 2, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "Waiting" },
  { id: 3, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "In Treatment" },
  { id: 4, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "Waiting" },
  { id: 5, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "In Treatment" },
  { id: 6, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "Waiting" },
  { id: 7, name: "Johnnathan Doe", age: 45, gender: "Male", condition: "Chest Pain", priority: "P1 - CRITICAL", doctor: "Dr. Sarah Wilson", bed: "Bed 04 (ICU)", status: "In Treatment" },
];

function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white dark:bg-[#101935] p-4 sm:p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-between shadow-none transition-all w-full">
      <div className="space-y-1">
        <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center mb-2", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{title}</p>
      </div>
      <p className="text-[28px] font-bold text-[#1A1C23] dark:text-white leading-none">{value}</p>
    </div>
  );
}

export default function EmergencyQueue() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.condition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Patients" value="42" icon={Calendar} colorClass="bg-blue-50 text-blue-500 dark:bg-blue-500/10" />
        <StatCard title="Priority 1" value="04" icon={AlertCircle} colorClass="bg-rose-50 text-rose-500 dark:bg-rose-500/10" />
        <StatCard title="Priority 2" value="12" icon={Clock} colorClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10" />
        <StatCard title="Priority 3" value="02" icon={User} colorClass="bg-sky-50 text-sky-500 dark:bg-sky-500/10" />
        <StatCard title="On-Duty Dr." value="08" icon={Stethoscope} colorClass="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" />
      </div>

      <div className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#1A1C23] dark:text-white">Emergency Queue</h2>
        
        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-none">
          <div className="relative flex-1 md:max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] bg-white dark:bg-[#0B1121] text-[13px] font-medium text-[#5E6C84] dark:text-slate-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <span>All</span>
                <ChevronDown className="w-4 h-4" />
             </div>
             <div className="flex items-center gap-2 px-3 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] bg-white dark:bg-[#0B1121] text-[13px] font-medium text-[#5E6C84] dark:text-slate-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <span>All</span>
                <ChevronDown className="w-4 h-4" />
             </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F8F9FA] dark:bg-[#151D36]">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Patient Info</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Priority</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Dr. Assigned</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Bed. Assigned</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Status</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-[12px] shrink-0">
                          JD
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{patient.name}</p>
                          <p className="text-[11px] text-[#5E6C84] dark:text-slate-500">{patient.age}y • {patient.gender} • {patient.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-100 dark:border-rose-500/20">
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">{patient.doctor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">{patient.bed.split(' ')[0]} {patient.bed.split(' ')[1]}</p>
                        <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none">{patient.bed.split(' ')[2]}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", patient.status === "In Treatment" ? "bg-blue-500" : "bg-[#A0AEC0]")} />
                        <span className={cn("text-[13px] font-medium", patient.status === "In Treatment" ? "text-blue-500" : "text-[#5E6C84] dark:text-slate-400")}>
                          {patient.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/branch-admin/emergency/report/${patient.id}`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all group"
                        >
                          <Eye className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all group">
                          <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
