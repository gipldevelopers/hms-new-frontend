"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Calendar,
  Fingerprint,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StaffAttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [rosterToday, setRosterToday] = useState(null);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
        if (!userJson.success) throw new Error("Unauthorized");

        const userData = userJson.data;
        setUser(userData);
        setBranchId(userData.branchId);

        await fetchData(userData.branchId, userData.id);
      } catch (err) {
        toast.error("Session expired or registry error.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchData = async (bid, sid) => {
    try {
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch Today's Roster
      const rosterRes = await fetch(`/api/shifts/roster?branchId=${bid}&startDate=${today}&endDate=${today}`, { headers });
      const rosters = await rosterRes.json();
      const myRoster = rosters.find(r => r.staffId === sid);
      setRosterToday(myRoster);

      // 2. Fetch Attendance History (includes today)
      const attendanceRes = await fetch(`/api/attendance/${bid}/staff/${sid}`, { headers });
      const attendanceJson = await attendanceRes.json();
      if (attendanceJson.success) {
        const logs = attendanceJson.data;
        setHistory(logs);
        const todayLog = logs.find(l => new Date(l.date).toISOString().split('T')[0] === today);
        setAttendanceToday(todayLog);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const handleCheckIn = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authtoken");
      
      let location = { lat: null, lng: null };
      try {
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
        });
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        console.warn("Location access denied");
      }

      const res = await fetch(`/api/attendance/${branchId}/check-in`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          staffId: user.id,
          staffName: user.name,
          rosterId: rosterToday?.id,
          date: new Date(),
          latitude: location.lat,
          longitude: location.lng,
          deviceInfo: navigator.userAgent,
          status: "PRESENT"
        })
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Bio-matrix verification successful.");
        fetchData(branchId, user.id);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      toast.error(err.message || "Registry synchronization failure.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/attendance/${branchId}/${attendanceToday.id}/check-out`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Duty cycle complete.");
        fetchData(branchId, user.id);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      toast.error(err.message || "Registry synchronization failure.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F9FC] dark:bg-[#0A0F1D]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Synchronizing Bio-Matrix Registry...</p>
      </div>
    );
  }

  const isCheckedIn = attendanceToday?.checkIn && !attendanceToday?.checkOut;
  const isCheckedOut = attendanceToday?.checkOut;

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Attendance Registry</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 h-[44px] px-5 rounded-[5px] flex items-center gap-3 shadow-none">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-[14px] font-bold text-[#1e293b] dark:text-white tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Check-In Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-10 flex flex-col items-center text-center shadow-none relative overflow-hidden">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all border-4",
              isCheckedIn ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-primary/5 border-primary/10 text-primary"
            )}>
              <Fingerprint className="w-10 h-10" />
            </div>

            <h2 className="text-[22px] font-bold text-[#1e293b] dark:text-white mb-2">
              {isCheckedIn ? "Duty In Progress" : isCheckedOut ? "Duty Cycle Complete" : "Ready for Duty"}
            </h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8 max-w-sm font-medium">
              {rosterToday 
                ? `Active Shift: ${rosterToday.startTime} - ${rosterToday.endTime} (${rosterToday.department})`
                : "No active shift scheduled for today."}
            </p>

            <div className="flex gap-4 w-full max-w-xs">
              {!attendanceToday?.checkIn ? (
                <button
                  disabled={submitting}
                  onClick={handleCheckIn}
                  className="flex-1 bg-primary text-white h-[48px] rounded-[5px] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all uppercase tracking-widest border border-primary"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Check In
                </button>
              ) : !attendanceToday?.checkOut ? (
                <button
                  disabled={submitting}
                  onClick={handleCheckOut}
                  className="flex-1 bg-red-500 text-white h-[48px] rounded-[5px] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50 transition-all uppercase tracking-widest border border-red-600"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Check Out
                </button>
              ) : (
                <div className="flex-1 bg-emerald-50 text-emerald-600 h-[48px] rounded-[5px] font-bold text-[13px] flex items-center justify-center gap-2 border border-emerald-100 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>

            {attendanceToday && (
              <div className="mt-10 grid grid-cols-2 gap-10 w-full border-t border-[#E7E8EB] dark:border-white/10 pt-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Check In Time</p>
                  <p className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">
                    {attendanceToday.checkIn ? new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Check Out Time</p>
                  <p className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">
                    {attendanceToday.checkOut ? new Date(attendanceToday.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-5 flex items-center gap-4 shadow-none">
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-[5px] border border-amber-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Geofence</p>
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">Main Hospital Campus</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-5 flex items-center gap-4 shadow-none">
              <div className="p-2.5 bg-blue-50 text-blue-500 rounded-[5px] border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registry Identity</p>
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white truncate max-w-[150px]">Verified Device</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] h-full flex flex-col overflow-hidden shadow-none">
            <div className="p-5 border-b border-[#E7E8EB] dark:border-white/10 flex justify-between items-center bg-[#F8F9FC] dark:bg-[#1e293b]/50">
              <h3 className="text-[12px] font-bold text-[#1e293b] dark:text-white uppercase tracking-widest">Recent Logs</h3>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {history.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center opacity-40">
                  <Clock className="w-8 h-8 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Records</p>
                </div>
              ) : (
                history.map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-[5px] border border-transparent hover:border-[#E7E8EB] dark:hover:border-white/10 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all group">
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", log.checkOut ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                      <div className="w-[1px] h-full bg-[#E7E8EB] dark:bg-white/10 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                          {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </p>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-[3px] border",
                          log.checkOut ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {log.checkOut ? "Complete" : "Active"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 tabular-nums">
                        {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                        {log.checkOut && ` - ${new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogOut(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function ShieldCheck(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
