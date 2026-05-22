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
        toast.error("Session expired. Please login again.");
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
        toast.success("Attendance recorded successfully.");
        fetchData(branchId, user.id);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save attendance.");
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
        toast.success("Shift finished.");
        fetchData(branchId, user.id);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Loading attendance...</p>
      </div>
    );
  }

  const isCheckedIn = attendanceToday?.checkIn && !attendanceToday?.checkOut;
  const isCheckedOut = attendanceToday?.checkOut;

  return (
    <div className="p-6 bg-background min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-[20px] font-bold text-foreground leading-tight">My Attendance</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border h-[44px] px-5 rounded-lg flex items-center gap-3 shadow-none">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-[14px] font-bold text-foreground tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Check-In Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-10 flex flex-col items-center text-center shadow-none relative overflow-hidden">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all border-4",
              isCheckedIn ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-primary/5 border-primary/10 text-primary"
            )}>
              <Fingerprint className="w-10 h-10" />
            </div>

            <h2 className="text-[22px] font-bold text-foreground mb-2">
              {isCheckedIn ? "Shift Started" : isCheckedOut ? "Shift Finished" : "Ready to Start"}
            </h2>
            <p className="text-[13px] text-muted-foreground mb-8 max-w-sm font-medium">
              {rosterToday
                ? `Active Shift: ${rosterToday.startTime} - ${rosterToday.endTime} (${rosterToday.department})`
                : "No active shift scheduled for today."}
            </p>

            <div className="flex gap-4 w-full max-w-xs">
              {!attendanceToday?.checkIn ? (
                <button
                  disabled={submitting}
                  onClick={handleCheckIn}
                  className="flex-1 bg-primary text-primary-foreground h-[48px] rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-none"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Check In
                </button>
              ) : !attendanceToday?.checkOut ? (
                <button
                  disabled={submitting}
                  onClick={handleCheckOut}
                  className="flex-1 bg-destructive text-destructive-foreground h-[48px] rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-destructive/90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-none"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Check Out
                </button>
              ) : (
                <div className="flex-1 bg-emerald-500/10 text-emerald-600 h-[48px] rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 border border-emerald-500/20 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>

            {attendanceToday && (
              <div className="mt-10 grid grid-cols-2 gap-10 w-full border-t border-border pt-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Check In Time</p>
                  <p className="text-[18px] font-bold text-foreground leading-none">
                    {attendanceToday.checkIn ? new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Check Out Time</p>
                  <p className="text-[18px] font-bold text-foreground leading-none">
                    {attendanceToday.checkOut ? new Date(attendanceToday.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 shadow-none">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg border border-amber-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Work Location</p>
                <p className="text-[13px] font-bold text-foreground">Main Hospital Campus</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 shadow-none">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Device Status</p>
                <p className="text-[13px] font-bold text-foreground truncate max-w-[150px]">Verified Device</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Column */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg h-full flex flex-col overflow-hidden shadow-none">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/50">
              <h3 className="text-[12px] font-bold text-foreground uppercase tracking-widest">Recent Records</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {history.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center opacity-40">
                  <Clock className="w-8 h-8 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">No Records</p>
                </div>
              ) : (
                history.map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted transition-all group">
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", log.checkOut ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                      <div className="w-[1px] h-full bg-border rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-[13px] font-bold text-foreground">
                          {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </p>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-[3px] border",
                          log.checkOut ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}>
                          {log.checkOut ? "Complete" : "Active"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-bold mt-1 tabular-nums">
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
