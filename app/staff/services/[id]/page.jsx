"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Activity, MessageSquare, Repeat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [service, setService] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch service request details
        const res = await fetch(`/api/services/${id}`, { headers });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const svcData = result.data;
            const createdDate = new Date(svcData.createdAt);
            const timeString = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", Today";
            
            setService({
              ...svcData,
              time: timeString,
              prefTime: svcData.priority === "Urgent" ? "Immediate (ASAP)" : "Within 2 Hours"
            });

            // Load associated patient details
            if (svcData.patientId) {
              const patRes = await fetch(`/api/patients/${svcData.patientId}`, { headers });
              if (patRes.ok) {
                const patData = await patRes.json();
                setPatient(patData);
              }
            }
          } else {
            toast.error("Failed to load service request details.");
          }
        } else {
          toast.error("Service request not found in database.");
        }
      } catch (err) {
        console.error("Error loading service details", err);
        toast.error("An error occurred loading service details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 bg-background min-h-screen flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <span className="text-[13px] font-bold text-muted-foreground font-semibold">Loading service details...</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-5 bg-background min-h-screen flex flex-col items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-muted-foreground">Service Request Not Found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center transition-all shadow-none outline-none"
        >
          Go Back
        </button>
      </div>
    );
  }

  const displayPatient = patient;
  const displayService = service;

  const doctorName = displayPatient?.admissions?.[0]?.doctor?.name || 
                     (displayPatient?.admissions?.[0]?.doctor?.firstName && 
                      [displayPatient.admissions[0].doctor.firstName, displayPatient.admissions[0].doctor.lastName].filter(Boolean).join(" ")) || 
                     "Unassigned";
  
  const diagnosis = displayPatient?.admissions?.[0]?.reason || "Not Specified";
  
  const ageGender = displayPatient ? `${displayPatient.age || 'N/A'} yrs • ${displayPatient.gender || 'N/A'}` : "N/A";
  
  const uhid = displayPatient?.id ? `UHID-${displayPatient.id.slice(0, 8).toUpperCase()}` : "N/A";
  
  const admissionDate = displayPatient?.admissions?.[0]?.admissionDate ? 
                        new Date(displayPatient.admissions[0].admissionDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : 
                        "N/A";

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 ">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-lg border border-transparent flex items-center gap-2 text-foreground font-bold text-[13px] shadow-none transition-all"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to services
        </button>
      </div>

      {/* ── Patient Profile Info Card ── */}
      <div className="bg-card border border-border p-5 rounded-lg flex flex-col md:flex-row items-center gap-5 shadow-none ">
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=60"
            alt="Patient"
            className="w-16 h-16 rounded-full border border-border object-cover shrink-0 "
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight">
                {displayService.patientName}
              </h2>
              <span className="bg-destructive/10 text-destructive border border-destructive/20 font-bold text-[10px] px-2 py-0.5 rounded-lg leading-tight ">
                CRITICAL
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              {ageGender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 w-full border-t md:border-t-0 md:border-l border-border pt-5 md:pt-0 md:pl-5">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">UHID</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{uhid}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">BED NO.</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{displayService.bed}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">ADMISSION DATE</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{admissionDate}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">ATTENDING DOCTOR</p>
            <p className="text-[13px] font-bold text-foreground mt-1 leading-snug">{doctorName}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">DIAGNOSIS</p>
            <p className="text-[13px] font-bold text-foreground mt-1 leading-tight">{diagnosis}</p>
          </div>
        </div>
      </div>

      {/* ── Request Details Card (Card 2) ── */}
      <div className="bg-card border border-border p-5 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-none ">
        <div>
          <h3 className="text-[18px] font-bold text-foreground leading-tight">
            {displayService.requestType}
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mt-1">
            Requested on {displayService.time}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "rounded-lg font-bold px-3 py-1 text-[11px] tracking-wide",
            displayService.status === "Pending" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
            displayService.status === "Accepted" && "bg-blue-500/10 text-blue-600 border border-blue-500/20",
            displayService.status === "Completed" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
          )}>
            • {displayService.status.toUpperCase()}
          </span>

          <span className={cn(
            "rounded-lg font-bold px-3 py-1 text-[11px] tracking-wide flex items-center gap-1.5",
            displayService.priority === "Urgent" && "bg-destructive/10 text-destructive border border-destructive/20",
            displayService.priority === "Normal" && "bg-muted text-muted-foreground border border-border"
          )}>
            <Clock className="w-3.5 h-3.5" />
            {displayService.priority}
          </span>
        </div>
      </div>

      {/* ── Request Information Card (Card 3) ── */}
      <div className="bg-card border border-border p-5 rounded-lg flex flex-col space-y-5 shadow-none ">
        <div>
          <h4 className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
            Request Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-5">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">ASSIGNED DEPARTMENT</p>
            <div className="flex items-center gap-2 mt-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-[14px] font-bold text-foreground leading-none">
                {displayService.dept}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">PREFERRED TIME</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-[14px] font-bold text-foreground leading-none">
                {displayService.prefTime}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Description & Notes</p>
          <div className="mt-3 p-4 bg-muted/50 border border-border rounded-lg text-[13px] font-medium leading-relaxed text-foreground">
            {displayService.requestDescription}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex justify-end items-center gap-3 ">
        <button
          onClick={() => alert(`Contacting ${displayService.dept} department...`)}
          className="h-11 px-5 border border-primary hover:bg-primary/5 text-primary rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none bg-card"
        >
          <MessageSquare className="w-4 h-4" /> Contact Department
        </button>
        <button
          onClick={() => alert("Re-request submitted successfully!")}
          className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none "
        >
          <Repeat className="w-4 h-4" /> Re-request
        </button>
      </div>

    </div>
  );
}
