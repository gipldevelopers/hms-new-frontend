"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  User, 
  Clock, 
  MapPin, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomCalendar } from "@/components/ui/custom-calendar";

export default function BranchAttendanceLogsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [openPicker, setOpenPicker] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setOpenPicker(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) {
          router.push("/login");
          return;
        }

        const userRes = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userJson = await userRes.json();
        
        const bid = userJson.data.role === "BRANCH_ADMIN" 
          ? userJson.data.branchId 
          : localStorage.getItem("activeBranchId");

        if (!bid) {
          toast.error("Branch context not established.");
          return;
        }

        setBranchId(bid);
        await fetchLogs(bid, dateRange.start, dateRange.end);
      } catch (err) {
        toast.error("Handshake failure with branch registry.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchLogs = async (bid, start, end) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/attendance/${bid}?startDate=${start}&endDate=${end}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
      }
    } catch (err) {
      toast.error("Failed to retrieve attendance matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (type, date) => {
    const dateStr = date ? date.toISOString().split('T')[0] : "";
    const newRange = { ...dateRange, [type === 'from' ? 'start' : 'end']: dateStr };
    setDateRange(newRange);
    setOpenPicker(null);
    if (branchId && newRange.start && newRange.end) {
      fetchLogs(branchId, newRange.start, newRange.end);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.staffName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!branchId && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FC] dark:bg-[#0A0F1D]">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Awaiting Branch Authorization...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-[25px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Attendance Matrix</h1>
        
        <div className="flex items-center gap-3">
          {/* Unified Date Range Picker */}
          <div className="relative flex items-center bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] group h-[48px] shadow-none" ref={pickerRef}>
            <div className="pl-4 pr-2 py-3 border-r border-[#E7E8EB] dark:border-white/10 shrink-0">
              <Calendar className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-center px-1">
              <button 
                onClick={() => setOpenPicker(openPicker === 'from' ? null : 'from')} 
                className={cn(
                  "px-4 py-2 text-[12px] font-bold transition-all text-left min-w-[110px] whitespace-nowrap", 
                  dateRange.start ? "text-[#1e293b] dark:text-white" : "text-gray-400"
                )}
              >
                {dateRange.start ? dateRange.start : "start date"}
              </button>
              <div className="h-4 border-r border-gray-100 dark:border-white/10 mx-1 shrink-0" />
              <button 
                onClick={() => setOpenPicker(openPicker === 'to' ? null : 'to')} 
                className={cn(
                  "px-4 py-2 text-[12px] font-bold transition-all text-left min-w-[110px] whitespace-nowrap", 
                  dateRange.end ? "text-[#1e293b] dark:text-white" : "text-gray-400"
                )}
              >
                {dateRange.end ? dateRange.end : "end date"}
              </button>
            </div>

            <AnimatePresence>
              {openPicker === 'from' && (
                <div className="absolute top-[110%] right-0 z-[200]">
                  <CustomCalendar 
                    selectedDate={dateRange.start ? new Date(dateRange.start) : null}
                    onSelect={(date) => handleDateSelect('from', date)}
                    onClose={() => setOpenPicker(null)}
                  />
                </div>
              )}
              {openPicker === 'to' && (
                <div className="absolute top-[110%] right-0 z-[200]">
                  <CustomCalendar 
                    selectedDate={dateRange.end ? new Date(dateRange.end) : null}
                    onSelect={(date) => handleDateSelect('to', date)}
                    onClose={() => setOpenPicker(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none">
            <Download className="w-4.5 h-4.5" />
            Export Records
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search personnel by name or registry ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-medium focus:border-primary transition-all font-semibold outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="h-11 px-5 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none shadow-none min-w-[200px]">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="flex-1 text-left">Filter by criteria</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#1e293b]/50">
                <th className="px-8 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Personnel</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Shift Context</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Check In</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Check Out</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Status</th>
                <th className="px-8 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Synchronizing Branch Vault...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center text-gray-400 font-bold text-[12px] opacity-60">
                    Registry records empty for selected range.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[5px] bg-primary/5 text-primary flex items-center justify-center text-[10px] font-black border border-primary/10">
                          {log.staffName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">{log.staffName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Personnel Verified</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      {log.roster ? (
                        <div>
                          <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{log.roster.startTime} - {log.roster.endTime}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{log.roster.department}</p>
                        </div>
                      ) : (
                        <span className="text-[12px] text-gray-400 font-bold italic opacity-50">Manual Entry</span>
                      )}
                    </td>
                    <td className="px-8 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                          {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">
                        {new Date(log.checkIn).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-3">
                      {log.checkOut ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                              {new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold mt-1">
                            {new Date(log.checkOut).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[12px] font-bold text-amber-600 uppercase tracking-tighter">Active Duty</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-3">
                      <span className={cn(
                        "inline-flex px-3 py-1 rounded-[5px] text-[11px] font-bold uppercase tracking-widest leading-none items-center justify-center border",
                        log.status === 'PRESENT' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      )}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-8 py-3 text-right">
                      {log.latitude ? (
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1.5 text-primary">
                             <MapPin className="w-4 h-4" />
                             <span className="text-[13px] font-bold">Verified Location</span>
                           </div>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Campus Geofence Locked</p>
                        </div>
                      ) : (
                        <span className="text-[12px] text-gray-400 font-bold italic opacity-50">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
