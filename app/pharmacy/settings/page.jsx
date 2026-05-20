"use client";

import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Save,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PharmacyProfileSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    critical: true,
    followup: true,
    discharge: false
  });

  return (
    <div className="flex flex-col gap-[20px] p-[20px] min-h-screen bg-background font-sans">
      {/* Header & Success Alert */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[20px] font-bold text-foreground leading-none">My Profile</h1>
          <p className="text-[13px] font-medium text-muted-foreground">Contact admin to update profile details</p>
        </div>
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#dcfce7] border border-[#22c55e]/20 rounded-[5px] w-full lg:w-auto shadow-none transition-all">
          <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
          <span className="text-[12px] font-bold text-[#15803d]">Password updated successfully</span>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-card border border-border rounded-[5px] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12 shadow-none">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[3px] border-border p-1 bg-card">
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-[28px] sm:text-[36px] font-bold text-muted-foreground border border-border">
              SJ
            </div>
          </div>
          <div className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-none">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground ml-1">Full Name</label>
            <input 
              type="text" 
              readOnly 
              value="Dr. Sarah Jenkins" 
              className="w-full h-11 px-4 bg-muted/30 border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none cursor-not-allowed shadow-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground ml-1">Employee ID</label>
            <input 
              type="text" 
              readOnly 
              value="DOC-8492" 
              className="w-full h-11 px-4 bg-muted/30 border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none cursor-not-allowed shadow-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground ml-1">Designation</label>
            <input 
              type="text" 
              readOnly 
              value="Senior Consultant" 
              className="w-full h-11 px-4 bg-muted/30 border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none cursor-not-allowed shadow-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground ml-1">Department</label>
            <input 
              type="text" 
              readOnly 
              value="Cardiology" 
              className="w-full h-11 px-4 bg-muted/30 border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none cursor-not-allowed shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        
        {/* Change Password Card */}
        <div className="bg-card border border-border rounded-[5px] flex flex-col shadow-none overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Change Password
            </h2>
          </div>
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  value="........"
                  readOnly
                  className="w-full h-11 pl-4 pr-11 bg-background border border-destructive/30 rounded-[5px] text-[14px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                />
                <button 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-destructive mt-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Current password is incorrect</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full h-11 pl-4 pr-11 bg-background border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                />
                <button 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full h-11 pl-4 pr-11 bg-background border border-border rounded-[5px] text-[14px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                />
                <button 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button className="w-full h-11 bg-primary text-primary-foreground rounded-[5px] text-[13px] font-bold hover:opacity-95 transition-all shadow-none mt-2">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Preferences Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] flex flex-col shadow-none overflow-hidden h-fit">
          <div className="p-5 border-b border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2e37a4]" />
              Notification Preferences
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-none">Critical Lab/Radiology Alerts</h4>
                <p className="text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] leading-relaxed">Receive immediate alerts for critical test results</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, critical: !notifications.critical})}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300 shadow-none shrink-0",
                  notifications.critical ? "bg-[#2e37a4]" : "bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-[#334155]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                  notifications.critical ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-none">Follow-up Reminders</h4>
                <p className="text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] leading-relaxed">Daily digest of patient follow-up appointments</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, followup: !notifications.followup})}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300 shadow-none shrink-0",
                  notifications.followup ? "bg-[#2e37a4]" : "bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-[#334155]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                  notifications.followup ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-none">Pending Discharge Reminders</h4>
                <p className="text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] leading-relaxed">Alerts when discharge summaries are pending</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, discharge: !notifications.discharge})}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300 shadow-none shrink-0",
                  notifications.discharge ? "bg-[#2e37a4]" : "bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-[#334155]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                  notifications.discharge ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <button className="w-full h-11 border border-[#2e37a4] text-[#2e37a4] rounded-[5px] text-[13px] font-bold hover:bg-[#2e37a4]/5 transition-all shadow-none mt-4 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
