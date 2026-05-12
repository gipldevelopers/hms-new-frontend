"use client";

import React from "react";
import { 
  Search, 
  ArrowRight, 
  HeartPulse, 
  Stethoscope, 
  Bone, 
  Ear, 
  Smile, 
  Brain,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BookAppointmentStep1() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = React.useState("General Med");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showResults, setShowResults] = React.useState(true); // Defaulting to true to show the UI from image

  const departments = [
    { name: "Cardiology", icon: HeartPulse },
    { name: "Dental", icon: Smile },
    { name: "ENT", icon: Ear },
    { name: "ENT", icon: Ear },
    { name: "Orthopedic", icon: Bone },
    { name: "Neurology", icon: Brain },
    { name: "General Med", icon: Stethoscope },
    { name: "ENT", icon: Ear },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">
          Book Appointment: Step 1
        </h1>
      </div>

      {/* Main Content Area - Vertical Stack */}
      <div className="flex flex-col gap-5 w-full">
        
        {/* Section 1: Select Department */}
        <div className="bg-card border border-border rounded-[5px] p-6 space-y-5 shadow-none">
          <h2 className="text-[14px] font-bold text-foreground">Select Department</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept, i) => (
              <button
                key={i}
                onClick={() => setSelectedDept(dept.name)}
                className={cn(
                  "flex flex-col items-center justify-center py-8 px-4 gap-3 rounded-[5px] border transition-all relative shadow-none outline-none group",
                  selectedDept === dept.name && i === 6
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <dept.icon className={cn(
                  "w-6 h-6",
                  selectedDept === dept.name && i === 6 ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-[13px] font-medium transition-all",
                  selectedDept === dept.name && i === 6 ? "text-primary" : "text-foreground/60"
                )}>
                  {dept.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Select Patient */}
        <div className="bg-card border border-border rounded-[5px] p-6 space-y-5 shadow-none">
          <h2 className="text-[14px] font-bold text-foreground">Select Patient</h2>
          
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search by Mobile Number..."
                  className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="px-8 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:bg-primary/90 transition-all shadow-none h-11"
              >
                Search
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-muted-foreground/40 tracking-tight">Search Results</p>
              <button 
                onClick={() => router.push("/reception/patient-registration/new")}
                className="text-[12px] font-bold text-primary hover:underline"
              >
                Register New Patient
              </button>
            </div>

            {/* Result List */}
            <div className="space-y-3">
              {showResults ? (
                <div className="p-4 border border-border bg-card rounded-[5px] relative overflow-hidden group cursor-pointer transition-all border-l-[3px] border-l-primary">
                  <div className="flex justify-between items-start text-left">
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-bold text-foreground">Ramesh Kumar</h4>
                      <p className="text-[12px] font-medium text-muted-foreground">45 Yrs • Male • 9876543210</p>
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground/60">UHID: 102938</span>
                  </div>
                </div>
              ) : (
                <div className="h-32 border border-border border-dashed rounded-[5px] flex items-center justify-center bg-muted/20">
                  <p className="text-[12px] text-muted-foreground italic">Search to find a patient</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button 
            onClick={() => router.back()}
            className="h-11 px-8 border border-destructive text-destructive hover:bg-destructive/5 rounded-[5px] text-[13px] font-bold transition-all shadow-none"
          >
            Cancel
          </button>
          <button 
            onClick={() => router.push("/reception/opd-appointments/book/select-doctor")}
            className="h-11 px-8 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-none"
          >
            Next: Select Doctor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

