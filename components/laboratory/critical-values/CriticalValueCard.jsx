"use client";
import React, { useState } from "react";
import {
  User,
  Bed,
  Stethoscope,
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CriticalValueCard({ item, onUpdate, onAcknowledge }) {
  // Card 1 (Potassium) should start with the log drawer expanded by default to match screenshot
  const [isLogOpen, setIsLogOpen] = useState(item.id === "cv-1" && !item.wardNotified);
  const [nurseName, setNurseName] = useState("");
  const [logTime, setLogTime] = useState("10:45 AM");

  const isAcknowledged = item.status === "acknowledged";
  const hasNotified = item.wardNotified;

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!nurseName.trim()) return;
    
    onUpdate({
      ...item,
      wardNotified: true,
      notifiedNurse: nurseName,
      notifiedTime: logTime
    });
    setIsLogOpen(false);
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge(item);
    } else {
      const nurse = item.notifiedNurse || "Nurse Clara";
      const time = item.notifiedTime || "09:45 AM";

      onUpdate({
        ...item,
        status: "acknowledged",
        acknowledgedBy: nurse,
        acknowledgedTime: time
      });
    }
  };

  return (
    <div className="bg-card text-card-foreground p-[20px] rounded-[5px] border border-border flex flex-col gap-[20px] shadow-none w-full transition-all">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px] w-full">
        {/* Left Header */}
        <div className="flex items-center gap-[12px] flex-wrap">
          <span className="text-[16px] font-bold text-foreground leading-none select-none">
            {item.testName}
          </span>
          <span className="text-[16px] font-bold text-red-600 dark:text-red-400 leading-none select-none">
            {item.value}
          </span>
          <span className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20 text-[11px] font-bold px-[8px] py-[2px] rounded-[5px] inline-flex items-center gap-1 shrink-0 select-none shadow-none">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
            <span>CRITICAL</span>
          </span>
        </div>

        {/* Right Header */}
        <div className="text-left sm:text-right shrink-0 select-none">
          <span className="block text-[13px] font-bold text-foreground leading-normal">
            {item.time}
          </span>
          <span className="block text-[12px] text-muted-foreground font-semibold">
            Reported by Tech: {item.reportedBy}
          </span>
        </div>
      </div>

      {/* Subtitle / Ref Range */}
      <div className="-mt-[10px] select-none">
        <span className="text-[12px] text-muted-foreground font-semibold">
          Ref Range: {item.refRange}
        </span>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-border/60" />

      {/* Demographics Row (Exactly Matching the Screenshot Grid Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-[12px] gap-x-[20px] py-[4px] select-none text-[13px]">
        {/* Left Columns (Patient & Bed details) - spans 7 columns */}
        <div className="md:col-span-7 flex flex-col gap-[10px]">
          {/* Patient Details Row */}
          <div className="flex items-center gap-[8px] text-foreground">
            <User size={15} className="text-muted-foreground/60 shrink-0" />
            <span className="font-bold text-foreground">{item.patientName}</span>
            <span className="text-muted-foreground/30 font-normal">|</span>
            <span className="text-muted-foreground font-semibold">{item.uhid}</span>
          </div>
          {/* Bed & Attending Doctor Row */}
          <div className="flex items-center gap-[8px] text-foreground flex-wrap">
            <Bed size={15} className="text-muted-foreground/60 shrink-0" />
            <span className="font-bold text-foreground">{item.bedLabel}</span>
            <span className="text-muted-foreground/30 font-normal">|</span>
            <Stethoscope size={15} className="text-muted-foreground/60 shrink-0" />
            <span className="text-muted-foreground font-semibold">{item.attendingDoctor}</span>
          </div>
        </div>

        {/* Right Columns (Order & Department details) - spans 5 columns */}
        <div className="md:col-span-5 flex flex-col gap-[10px] md:pl-[20px]">
          {/* Order Row */}
          <div className="flex items-center gap-[8px] text-muted-foreground font-semibold">
            <span className="text-muted-foreground/60 font-semibold text-[14px]">#</span>
            <span>
              Order: <strong className="text-foreground font-semibold">{item.orderNo}</strong>
            </span>
          </div>
          {/* Department Row */}
          <div className="flex items-center gap-[8px] text-muted-foreground font-semibold">
            <FlaskConical size={15} className="text-muted-foreground/60 shrink-0" />
            <span>
              Dept: <strong className="text-foreground font-semibold">{item.department}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-border/60" />

      {/* Card Footer status block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-[15px] w-full mt-[2px]">
        {/* Left Side Status */}
        <div>
          {isAcknowledged ? (
            <div className="flex flex-col gap-1 select-none text-left">
              <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 text-[12px] font-bold px-[8px] py-[2.5px] rounded-[5px] inline-flex items-center gap-1.5 w-fit shadow-none">
                <CheckCircle2 size={13} className="stroke-[2.5]" />
                <span>Acknowledged</span>
              </div>
              <span className="text-[11.5px] text-muted-foreground font-semibold pl-0.5">
                By {item.acknowledgedBy} at {item.acknowledgedTime}, Today
              </span>
            </div>
          ) : hasNotified ? (
            <div className="flex items-center gap-2 select-none">
              <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 text-[12.5px] font-bold px-[8px] py-[2.5px] rounded-[5px] inline-flex items-center gap-1.5 shadow-none">
                <CheckCircle2 size={13} className="stroke-[2.5]" />
                <span>Ward Notified</span>
              </div>
              <span className="text-[12px] text-muted-foreground font-semibold">
                ({item.notifiedNurse} at {item.notifiedTime})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 select-none">
              <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[12.5px] font-bold text-amber-600 dark:text-amber-400">
                Ward Notified: No
              </span>
            </div>
          )}
        </div>

        {/* Right Side Buttons */}
        {!isAcknowledged && (
          <div className="flex items-center gap-3">
            {!hasNotified && (
              <button
                onClick={() => setIsLogOpen(!isLogOpen)}
                className={cn(
                  "h-10 px-4 bg-card hover:bg-muted/10 text-foreground border border-border font-bold text-[12.5px] rounded-[5px] transition-colors cursor-pointer shadow-none outline-none",
                  isLogOpen && "bg-muted/20 border-primary text-primary"
                )}
              >
                Notified Ward
              </button>
            )}
            <button
              onClick={handleAcknowledge}
              className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none"
            >
              Acknowledge
            </button>
          </div>
        )}
      </div>

      {/* Log Ward Notification Drawer */}
      <AnimatePresence>
        {isLogOpen && !isAcknowledged && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSaveLog}
              className="border border-border bg-card rounded-[5px] p-[20px] flex flex-col gap-[15px] mt-[10px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-foreground">
                  Log Ward Notification
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="p-1 hover:bg-muted/10 rounded-[5px] text-muted-foreground hover:text-foreground border border-border cursor-pointer transition-colors shadow-none outline-none"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Horizontal form on desktop, wrapping gracefully on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-[15px] w-full">
                {/* Spoke with (Name) */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                  <label className="text-[12.5px] font-bold text-foreground select-none">
                    Spoke with (Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nurse Sarah"
                    value={nurseName}
                    onChange={(e) => setNurseName(e.target.value)}
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1.5 w-full sm:w-[150px] shrink-0">
                  <label className="text-[12.5px] font-bold text-foreground select-none">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      required
                      value={logTime}
                      onChange={(e) => setLogTime(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground outline-none focus:border-primary transition-all shadow-none"
                    />
                    <Clock
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 sm:ml-auto pt-2 sm:pt-0 shrink-0 h-10">
                  <button
                    type="button"
                    onClick={() => setIsLogOpen(false)}
                    className="h-10 px-4 bg-card border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-[12.5px] rounded-[5px] hover:bg-red-500/5 transition-colors cursor-pointer shadow-none outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none"
                  >
                    Save Log
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
