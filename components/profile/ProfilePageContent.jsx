"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, EyeOff, Eye, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

export default function ProfilePageContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notification states (purely frontend controlled!)
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken") || localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile details");
      }

      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setName(data.data.name || "");
        setEmail(data.data.email || "");
        setDepartment(data.data.department || "");
        setImage(data.data.image || "");
      } else {
        throw new Error(data.message || "Failed to resolve profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);
      setProfileSuccess(false);
      const token = localStorage.getItem("authtoken") || localStorage.getItem("token");

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          department,
          image
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 4000);
        // Refresh session context in state
        if (data.data) {
          setUser(data.data);
        }
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Confirm password does not match");
      return;
    }

    try {
      setPasswordSaving(true);
      const token = localStorage.getItem("authtoken") || localStorage.getItem("token");

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 4000);
      } else {
        setPasswordError(data.message || "Current password is incorrect");
      }
    } catch (err) {
      setPasswordError("Network error: " + err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-[13px] font-medium">Loading profile details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-[18px] font-bold text-foreground">Failed to Load Profile</h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:opacity-90 transition-all"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  const isEditable = user?.role === "BRANCH_ADMIN" || user?.role === "SUPERADMIN";
  const initials = (name || user?.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-[24px] font-bold text-foreground leading-tight">My Profile</h1>
          <p className="text-[13px] font-medium text-muted-foreground">
            {isEditable ? "Customize your profile settings below" : "Contact admin to update profile details"}
          </p>
        </div>
        
        {/* Success / Feedback Alerts */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {passwordSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Password updated successfully</span>
            </div>
          )}
          {profileSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Profile details saved successfully</span>
            </div>
          )}
          {notifSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Notification preferences updated</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-card border border-border rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-none">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          {image ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border overflow-hidden relative">
              <img src={image} alt={name || "Avatar"} className="w-full h-full object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted/50 border-2 border-border flex items-center justify-center text-[32px] md:text-[40px] font-bold text-muted-foreground relative">
              {initials}
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
            </div>
          )}
          <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase">
            {user?.role || "USER"}
          </span>
        </div>

        {/* Info Grid */}
        <div className="flex-1 w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditable}
                placeholder="Full Name"
                className={cn(
                  "w-full h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none transition-all shadow-none focus:border-primary",
                  !isEditable && "bg-muted/20 cursor-not-allowed opacity-80"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditable}
                placeholder="Email Address"
                className={cn(
                  "w-full h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none transition-all shadow-none focus:border-primary",
                  !isEditable && "bg-muted/20 cursor-not-allowed opacity-80"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={!isEditable}
                placeholder="Department"
                className={cn(
                  "w-full h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none transition-all shadow-none focus:border-primary",
                  !isEditable && "bg-muted/20 cursor-not-allowed opacity-80"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Profile Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={!isEditable}
                placeholder="Image URL (e.g. https://domain.com/photo.jpg)"
                className={cn(
                  "w-full h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none transition-all shadow-none focus:border-primary",
                  !isEditable && "bg-muted/20 cursor-not-allowed opacity-80"
                )}
              />
            </div>
          </div>

          {isEditable && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="h-11 px-6 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {profileSaving && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                Save Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Change Password Card */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6 md:p-8 space-y-6 shadow-none flex flex-col justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-foreground">Change Password</h2>
            
            <div className="space-y-5 mt-5">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPass ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={cn(
                      "w-full h-11 pl-4 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none",
                      passwordError && (passwordError.includes("Current") || passwordError.includes("correct")) && "border-red-200 dark:border-red-500/30 focus:border-red-500"
                    )}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground outline-none"
                  >
                    {showCurrentPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-11 pl-4 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground outline-none"
                  >
                    {showNewPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-11 pl-4 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground outline-none"
                  >
                    {showConfirmPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold px-1 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleUpdatePassword}
            disabled={passwordSaving}
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:opacity-90 transition-all shadow-none mt-6 flex items-center justify-center gap-2"
          >
            {passwordSaving && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            Update Password
          </button>
        </div>

        {/* Notification Preferences Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 md:p-8 flex flex-col shadow-none">
          <h2 className="text-[18px] font-bold text-foreground mb-8">Notification Preferences</h2>
          
          <div className="flex-1 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Critical System Alerts</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Receive immediate alerts for critical system events</p>
              </div>
              <Switch checked={criticalAlerts} onChange={setCriticalAlerts} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Activity Reminders</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Daily digest of pending tasks and activities</p>
              </div>
              <Switch checked={reminders} onChange={setReminders} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground">Security Updates</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Alerts when security policies are updated</p>
              </div>
              <Switch checked={updates} onChange={setUpdates} />
            </div>
          </div>

          <button 
            onClick={handleSaveNotifications}
            className="w-full h-11 border border-primary text-primary rounded-lg text-[13px] font-bold hover:bg-primary/5 transition-all shadow-none mt-8"
          >
            Save Preferences
          </button>
        </div>

      </div>

    </div>
  );
}
