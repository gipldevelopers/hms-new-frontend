"use client";

import React from "react";
import { User, ShieldCheck, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function ProfilePage() {
  const [showSuccess, setShowSuccess] = React.useState(true);
  const [criticalAlerts, setCriticalAlerts] = React.useState(true);
  const [followupReminders, setFollowupReminders] = React.useState(true);
  const [dischargeReminders, setDischargeReminders] = React.useState(false);

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-[24px] font-bold text-foreground leading-tight">My Profile</h1>
          <p className="text-[13px] font-medium text-muted-foreground">Contact admin to update profile details</p>
        </div>
        
        {/* Success Alert */}
        {showSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Password updated successfully</span>
            <button onClick={() => setShowSuccess(false)} className="text-emerald-400 hover:text-emerald-600 ml-2">
              <CheckCircle2 className="w-4 h-4 opacity-0" /> {/* Spacer */}
            </button>
          </div>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-card border border-border rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-none">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted/50 border-2 border-border flex items-center justify-center text-[32px] md:text-[40px] font-bold text-muted-foreground relative">
            SJ
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase">
            Verified
          </span>
        </div>

        {/* Info Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <div className="h-11 px-4 bg-muted/20 border border-border rounded-lg flex items-center text-[13px] font-medium text-foreground cursor-not-allowed">
              Dr. Sarah Jenkins
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Employee ID</label>
            <div className="h-11 px-4 bg-muted/20 border border-border rounded-lg flex items-center text-[13px] font-medium text-foreground cursor-not-allowed">
              DOC-8492
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Designation</label>
            <div className="h-11 px-4 bg-muted/20 border border-border rounded-lg flex items-center text-[13px] font-medium text-foreground cursor-not-allowed">
              Senior Consultant
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
            <div className="h-11 px-4 bg-muted/20 border border-border rounded-lg flex items-center text-[13px] font-medium text-foreground cursor-not-allowed">
              Cardiology
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Change Password Card */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6 md:p-8 space-y-6 shadow-none">
          <h2 className="text-[18px] font-bold text-foreground">Change Password</h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="w-full h-11 pl-4 pr-10 bg-card border border-red-200 dark:border-red-500/30 rounded-lg text-[13px] font-medium outline-none focus:border-red-500 transition-all shadow-none"
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold px-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Current password is incorrect</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  className="w-full h-11 pl-4 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  className="w-full h-11 pl-4 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <button className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:opacity-90 transition-all shadow-none mt-2">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Preferences Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 md:p-8 flex flex-col shadow-none">
          <h2 className="text-[18px] font-bold text-foreground mb-8">Notification Preferences</h2>
          
          <div className="flex-1 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Critical Lab/Radiology Alerts</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Receive immediate alerts for critical test results</p>
              </div>
              <Switch checked={criticalAlerts} onChange={setCriticalAlerts} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Follow-up Reminders</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Daily digest of patient follow-up appointments</p>
              </div>
              <Switch checked={followupReminders} onChange={setFollowupReminders} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Pending Discharge Reminders</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Alerts when discharge summaries are pending</p>
              </div>
              <Switch checked={dischargeReminders} onChange={setDischargeReminders} />
            </div>
          </div>

          <button className="w-full h-11 border border-primary text-primary rounded-lg text-[13px] font-bold hover:bg-primary/5 transition-all shadow-none mt-8">
            Save Preferences
          </button>
        </div>

      </div>

    </div>
  );
}
