"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Edit3, Eye, Activity, Wind, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VitalsHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStaff, setFilterStaff] = useState("All");

  const staffOptions = ["All", "Sarah Jenkins", "Mike Ross"];

  const history = [
    { 
      date: "Today", 
      time: "10:45 AM", 
      bp: "185/115", 
      bpAlert: true,
      hr: "88", 
      spo2: "86%", 
      spo2Alert: true,
      temp: "37.2 °C", 
      resp: "22", 
      pain: "4", 
      recordedBy: "Sarah Jenkins, RN",
      notes: "Notes attached"
    },
    { 
      date: "Today", 
      time: "06:00 AM", 
      bp: "120/80", 
      hr: "72", 
      spo2: "98%", 
      temp: "36.8 °C", 
      resp: "16", 
      pain: "2", 
      recordedBy: "Sarah Jenkins, RN"
    },
    { 
      date: "Yesterday", 
      time: "10:00 PM", 
      bp: "118/76", 
      hr: "68", 
      spo2: "99%", 
      temp: "36.9 °C", 
      resp: "14", 
      pain: "0", 
      recordedBy: "Mike Ross, RN"
    },
    { 
      date: "Yesterday", 
      time: "02:00 PM", 
      bp: "135/88", 
      hr: "75", 
      spo2: "97%", 
      temp: "37.1 °C", 
      resp: "18", 
      pain: "1", 
      recordedBy: "Mike Ross, RN"
    },
    { 
      date: "Yesterday", 
      time: "06:00 AM", 
      bp: "122/82", 
      hr: "70", 
      spo2: "98%", 
      temp: "36.7 °C", 
      resp: "16", 
      pain: "0", 
      recordedBy: "Sarah Jenkins, RN"
    }
  ];

  const filteredHistory = history.filter(row => {
    const matchesSearch = row.recordedBy.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         row.bp.includes(searchQuery) || 
                         row.hr.includes(searchQuery);
    const matchesStaff = filterStaff === "All" || row.recordedBy.includes(filterStaff);
    return matchesSearch && matchesStaff;
  });

  const handleAction = (type, row) => {
    alert(`${type} vitals recorded at ${row.time} by ${row.recordedBy}`);
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search vitals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none w-full sm:w-auto justify-between sm:justify-start">
                {filterStaff === "All" ? "Filter by Staff" : filterStaff}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
              {staffOptions.map((staff) => (
                <DropdownMenuItem
                  key={staff}
                  onClick={() => setFilterStaff(staff)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterStaff === staff
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  {staff === "All" ? "All Staff" : staff}
                  {filterStaff === staff && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card View (Mobile) / Table View (Desktop) */}
      <div className="bg-transparent md:bg-white dark:md:bg-[#101935] md:rounded-[5px] md:border md:border-[#E7E8EB] dark:md:border-white/10 shadow-none overflow-hidden">
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
          {filteredHistory.map((row, i) => (
            <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50 dark:border-white/5">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-0.5">{row.date}</div>
                  <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{row.time}</div>
                </div>
                <div className="flex items-center gap-1">
                   <button 
                     onClick={() => handleAction("Edit", row)}
                     className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400"
                   >
                     <Edit3 className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => handleAction("View", row)}
                     className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-primary"
                   >
                     <Eye className="w-4 h-4" />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Blood Pressure</p>
                  <p className={cn(
                    "text-[14px] font-bold",
                    row.bpAlert ? "text-rose-500" : "text-[#1A1C23] dark:text-white"
                  )}>{row.bp} <span className="text-[10px] text-gray-400 font-medium">mmHg</span></p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Heart Rate</p>
                  <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{row.hr} <span className="text-[10px] text-gray-400 font-medium">bpm</span></p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">SpO2</p>
                  <p className={cn(
                    "text-[14px] font-bold",
                    row.spo2Alert ? "text-rose-500" : "text-[#1A1C23] dark:text-white"
                  )}>{row.spo2}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Temperature</p>
                  <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{row.temp}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recorded By</p>
                  <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white leading-none">{row.recordedBy}</p>
                </div>
                {row.notes && <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-400 text-[9px] font-bold rounded">NOTES</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">DATE & TIME</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">BP (MMHG)</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">HR</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">SPO2</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">TEMP</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">RESP</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">PAIN</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">RECORDED BY</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
              {filteredHistory.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all group">
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-[#1A1C23] dark:text-white mb-0.5">{row.date}</div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase">{row.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    {row.bpAlert ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full border border-rose-100 dark:border-rose-500/20 text-[13px] font-bold">
                        <Activity className="w-3 h-3" /> {row.bp}
                      </div>
                    ) : (
                      <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.bp}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.hr}</span>
                  </td>
                  <td className="px-6 py-5">
                    {row.spo2Alert ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full border border-rose-100 dark:border-rose-500/20 text-[13px] font-bold">
                        <Wind className="w-3 h-3" /> {row.spo2}
                      </div>
                    ) : (
                      <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.spo2}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.temp}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.resp}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.pain}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-[#1A1C23] dark:text-white mb-0.5">{row.recordedBy}</div>
                    {row.notes && (
                      <div className="text-[11px] font-medium text-gray-400">Notes attached</div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleAction("Edit", row)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all text-gray-400 hover:text-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction("View", row)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all text-gray-400 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
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
  );
}
