"use client";

import React from "react";
import {
  ArrowLeft,
  Pencil,
  Ambulance,
  Zap,
  Printer,
  ArrowLeftRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

export default function EmergencyReviewPage() {
  const router = useRouter();
  const { id } = useParams();

  // Mock data for the view
  const patient = {
    uhid: id,
    name: "John Doe",
    ageGender: "Male / 45 Years",
    mobile: "+1 234-567-8901",
    arrivalMode: "Ambulance (City EMS)",
    complaint: "Suspected Cardiac Arrest, Severe Trauma",
    priority: "RED",
    arrivalTime: "14:24:05",
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/reception/emergency-registration")}
          className="flex items-center gap-2 px-4 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4 sm:p-8 space-y-8">
        {/* Title and Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-[22px] font-bold text-foreground">Final Review</h1>
            <p className="text-[13px] text-muted-foreground">
              Please review the critical details before confirming emergency registration.
            </p>
          </div>
          <button 
            onClick={() => router.push(`/reception/emergency-registration/${id}/edit`)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none w-full sm:w-auto"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Details
          </button>
        </div>

        {/* Patient Details Card */}
        <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-5 sm:p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-foreground">Patient Details</h3>
            <span className="px-2.5 py-1 bg-[#E6F9F1] text-[#00A389] rounded-[5px] text-[11px] font-bold shrink-0">
              Ready to Generate UHID
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-[14px] font-bold text-foreground">{patient.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Approx Age</p>
              <p className="text-[14px] font-bold text-foreground">{patient.ageGender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Mobile Number</p>
              <p className="text-[14px] font-bold text-foreground">{patient.mobile}</p>
            </div>
          </div>
        </div>

        {/* Arrival & Condition Card */}
        <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-5 sm:p-6 space-y-6">
          <h3 className="text-[15px] font-bold text-foreground">Arrival & Condition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Arrival Mode</p>
              <div className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                <Ambulance className="w-4 h-4 text-muted-foreground" />
                {patient.arrivalMode}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Reported Complaint</p>
              <p className="text-[14px] font-bold text-foreground leading-relaxed">{patient.complaint}</p>
            </div>
          </div>
        </div>

        {/* Triage Priority Section */}
        <div className="bg-[#FEF2F2] dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-[5px] p-5 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row items-start gap-4">
             <div className="w-10 h-10 bg-red-600 rounded-[5px] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-white" />
             </div>
             <div className="space-y-1 flex-1">
                <h3 className="text-[15px] font-bold text-red-600">RED - CRITICAL</h3>
                <p className="text-[13px] text-red-600/80 font-medium leading-relaxed">
                  Life-threatening condition. Immediate medical intervention required.
                </p>
             </div>
             <div className="w-full sm:w-auto text-left sm:text-right shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-red-500/10">
                <p className="text-[10px] font-bold text-red-600/50 uppercase tracking-widest">Time of Arrival</p>
                <p className="text-[18px] font-bold text-red-600">{patient.arrivalTime}</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button className="flex items-center justify-center gap-2 px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none w-full sm:w-auto">
            <ArrowLeftRight className="w-4 h-4" />
            Transfer to Ward
          </button>
          <button className="flex items-center justify-center gap-2 px-6 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none w-full sm:w-auto">
            <Printer className="w-4 h-4" />
            Print Registration Slip
          </button>
        </div>
      </div>
    </div>
  );
}
