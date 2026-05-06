"use client";

import React from "react";
import { 
  Bell, 
  Lock, 
  RefreshCw, 
  Activity, 
  ClipboardList, 
  AlertCircle,
  Calendar,
  User,
  Bed as BedIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { useRouter } from "next/navigation";
import PatientSelectionModal from "./PatientSelectionModal";
import { toast } from "sonner";

export default function BedCard({ bed, refresh, deptId, wardId, branchId }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);

  const { 
    id,
    label, 
    status, 
    admissions = [],
  } = bed;

  const currentAdmission = admissions.length > 0 ? admissions[0] : null;
  const patient = currentAdmission?.patient;
  const doctor = currentAdmission?.doctor;

  const handleAssignClick = () => {
    setIsModalOpen(true);
  };

  const handleSelectPatient = async (selectedPatient) => {
    if (!selectedPatient) {
      // New Registration - Navigate to add page
      const params = new URLSearchParams();
      if (id) params.append("bedId", id);
      if (wardId) params.append("wardId", wardId);
      if (deptId) params.append("departmentId", deptId);
      if (branchId) params.append("branchId", branchId);
      
      const baseUrl = branchId ? "/super-admin/admissions/add" : "/staff/admissions/add";
      router.push(`${baseUrl}?${params.toString()}`);
      return;
    }

    const activeAdmission = selectedPatient.admissions?.[0];
    const isTransfer = !!activeAdmission;

    // Assign or Transfer patient
    try {
      setAssigning(true);
      const token = localStorage.getItem("authtoken");
      
      const baseEndpoint = isTransfer ? `/api/admissions/${activeAdmission.id}` : "/api/admissions";
      const endpoint = branchId ? `${baseEndpoint}?branchId=${branchId}` : baseEndpoint;
      const method = isTransfer ? "PATCH" : "POST";

      const payload = {
        patientId: selectedPatient.id,
        branchId,
        patientName: selectedPatient.name,
        patientAge: selectedPatient.age,
        patientGender: selectedPatient.gender,
        patientContact: selectedPatient.contact,
        patientEmail: selectedPatient.email,
        emergencyContactName: selectedPatient.emergencyContactName,
        emergencyContactPhone: selectedPatient.emergencyContactPhone,
        departmentId: deptId,
        wardId: wardId,
        bedId: id,
        status: activeAdmission?.status || "In Progress",
        reason: isTransfer ? `Transferred: ${activeAdmission.reason || ""}` : "Direct Ward Assignment",
        admissionDate: activeAdmission?.admissionDate || new Date()
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(isTransfer 
          ? `Patient ${selectedPatient.name} transferred to Bed ${label}`
          : `Patient ${selectedPatient.name} assigned to Bed ${label}`
        );
        setIsModalOpen(false);
        if (refresh) refresh();
      } else {
        toast.error(result.message || `Failed to ${isTransfer ? 'transfer' : 'assign'} patient`);
      }
    } catch (error) {
      toast.error(`Error during patient ${isTransfer ? 'transfer' : 'assignment'}`);
    } finally {
      setAssigning(false);
    }
  };

  // Base card styles
  const baseClasses = "bg-card rounded-lg border border-border shadow-none h-full flex flex-col overflow-hidden transition-all relative";

  const upperStatus = status?.toUpperCase();

  if (upperStatus === "AVAILABLE" || upperStatus === "VACANT") {
    return (
      <>
        <div className={baseClasses}>
          {assigning && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="p-4 border-b border-border flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[13px] font-bold text-foreground">{label}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <BedIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-foreground">Vacant</p>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">Bed is clean and ready for a<br/>new patient.</p>
            </div>
            <button 
              onClick={handleAssignClick}
              disabled={assigning}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-[11px] font-bold text-foreground hover:bg-muted transition-all disabled:opacity-50"
            >
              Assign Patient
            </button>
          </div>
        </div>

        <PatientSelectionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectPatient}
          bedLabel={label}
          branchId={branchId}
        />
      </>
    );
  }

  if (upperStatus === "CLEANING") {
    return (
      <div className={baseClasses}>
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
          <span className="text-[13px] font-bold text-foreground">{label}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[14px] font-bold text-foreground">Under Cleaning</p>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight">Bed is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  if (upperStatus === "RESERVED") {
    return (
      <div className={baseClasses}>
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-[13px] font-bold text-foreground">{label}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[14px] font-bold text-foreground">Reserved</p>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight">Bed is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  // Occupied Card
  const isCritical = currentAdmission?.status?.toLowerCase() === "critical";

  return (
    <div className={baseClasses}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            !isCritical ? "bg-primary" : "bg-destructive"
          )} />
          <span className="text-[13px] font-bold text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
           <button className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 transition-all hover:bg-destructive/20">
             <Bell className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className={cn(
              "text-[9px] font-bold tracking-widest",
              !isCritical ? "text-primary" : "text-destructive"
            )}>
              {isCritical ? "OCCUPIED (CRITICAL)" : "OCCUPIED (STABLE)"}
            </p>
            <h3 className="text-[16px] font-bold text-foreground leading-tight">{patient?.name || "Unknown Patient"}</h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {patient?.age}y • {patient?.gender} • {currentAdmission?.reason || "General Admission"}
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2.5">
               <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
               <p className="text-[11px] text-muted-foreground font-medium">
                 <span className="font-bold text-foreground">Admitted:</span> {currentAdmission?.admissionDate ? format(new Date(currentAdmission.admissionDate), "dd MMM, hh:mm a") : "N/A"}
               </p>
            </div>
            <div className="flex items-center gap-2.5">
               <User className="w-3.5 h-3.5 text-muted-foreground" />
               <p className="text-[11px] text-muted-foreground font-medium">
                 <span className="font-bold text-foreground">Doctor:</span> {doctor?.name || "Unassigned"}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

