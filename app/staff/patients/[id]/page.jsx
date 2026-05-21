"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  AlertCircle, 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  Clock,
  ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import PatientSummary from "@/components/staff/patient-details/PatientSummary";
import VitalsHistory from "@/components/staff/patient-details/VitalsHistory";
import NursingTasks from "@/components/staff/patient-details/NursingTasks";
import LabReports from "@/components/staff/patient-details/LabReports";
import MedicationMAR from "@/components/staff/patient-details/MedicationMAR";
import DoctorOrders from "@/components/staff/patient-details/DoctorOrders";
import NursingNotes from "@/components/staff/patient-details/NursingNotes";
import { useSearchParams } from "next/navigation";
import { useEffect, use } from "react";

export default function PatientDetailsPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "Summary";
  
  const [activeTab, setActiveTab] = useState(currentTab);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/patients/${resolvedParams.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPatient(data);
      } catch (e) {
        console.error("Error fetching patient", e);
      } finally {
        setLoading(false);
      }
    };
    if (resolvedParams.id) fetchPatient();
  }, [resolvedParams.id]);

  const tabs = ["Summary", "Vitals", "Medication", "Tasks", "Lab Results", "Doctor Orders", "Notes"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return <PatientSummary />;
      case "Vitals":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-foreground leading-none">Vitals History</h2>
              <button 
                onClick={() => router.push(`/staff/vitals/${resolvedParams.id}`)}
                className="bg-primary text-primary-foreground px-6 h-[40px] rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Vitals
              </button>
            </div>
            <VitalsHistory patientId={resolvedParams.id} />
          </div>
        );
      case "Medication":
        return <MedicationMAR />;
      case "Tasks":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-foreground leading-none">Nursing Tasks</h2>
              <button 
                onClick={() => router.push("/staff/tasks")}
                className="bg-primary text-primary-foreground px-6 h-[40px] rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Tasks
              </button>
            </div>
            <NursingTasks patientId={resolvedParams.id} />
          </div>
        );
      case "Lab Results":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-foreground leading-none">Laboratory Reports</h2>
            </div>
            <LabReports />
          </div>
        );
      case "Doctor Orders":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-foreground leading-none">Doctor Orders</h2>
              <button className="bg-primary text-primary-foreground px-6 h-[40px] rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-none">
                <Plus className="w-4 h-4" />
                Raise Request
              </button>
            </div>
            <DoctorOrders />
          </div>
        );
      case "Notes":
        return <NursingNotes />;
      default:
        return (
          <div className="bg-card p-12 rounded-lg border border-border flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-[16px] font-bold text-foreground mb-1">{activeTab} Section</h3>
            <p className="text-[13px] text-muted-foreground font-medium">This clinical module is currently being optimized.</p>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }
  
  if (!patient) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground font-medium">Patient not found</p></div>;
  }

  const latestAdmission = patient.admissions?.[0] || {};
  const bedName = latestAdmission.bed?.label || "N/A";
  const doctorName = latestAdmission.doctor?.name || "Unassigned";
  const diagnosis = latestAdmission.reason || "N/A";
  const admissionDate = latestAdmission.createdAt ? new Date(latestAdmission.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A";
  const patientStatus = latestAdmission.status || "Completed";
  const uhid = `UHID-${patient.id.toString().substring(0, 6).toUpperCase()}`;

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen flex flex-col space-y-[15px] md:space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* Top Allergy Alert - Separate Box */}
      <div className="bg-destructive/10 px-4 md:px-6 py-3 md:py-4 rounded-lg flex items-center gap-3 border-l-4 border-l-destructive shadow-none">
         <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
         <p className="text-[11px] md:text-[13px] font-bold text-destructive uppercase tracking-tight">
           ALLERGIES: <span className="font-medium normal-case ml-2 text-destructive/80">Penicillin, Sulfa Drugs</span>
         </p>
      </div>

      {/* Patient Header Box */}
      <div className="bg-card p-4 md:p-6 rounded-lg border border-border shadow-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8">
          {/* Avatar Section */}
          <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden border-2 border-border shrink-0 shadow-none bg-primary/10 flex items-center justify-center">
             <span className="text-primary font-bold text-[32px]">{patient.name?.charAt(0) || 'U'}</span>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4 md:space-y-6 w-full">
            {/* Top Line: Name, Age, Status */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 md:gap-4 text-center sm:text-left">
              <h2 className="text-[18px] md:text-[22px] font-bold text-foreground leading-none tracking-tight">{patient.name}</h2>
              <span className="text-[12px] md:text-[13px] font-medium text-muted-foreground leading-none">{patient.age ? `${patient.age} yrs` : 'Unknown Age'} • {patient.gender || 'Unknown Gender'}</span>
              <span className={cn("px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center", patientStatus === "In Progress" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>{patientStatus}</span>
            </div>

            {/* Bottom Section: Metadata Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-5 gap-x-4 md:gap-8">
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">UHID</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{uhid}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">BED NO.</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{bedName}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">ADMISSION DATE</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{admissionDate}</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">ATTENDING DOCTOR</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground leading-tight">{doctorName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">DIAGNOSIS</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground leading-tight truncate">{diagnosis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Action */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="relative group/tabs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-4 md:px-5 py-2.5 rounded-lg text-[12px] md:text-[13px] font-bold transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Subtle scroll indicator for mobile */}
          <div className="absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>

      </div>

      {/* Dashboard Content */}
      <div className="w-full">
        {renderTabContent()}
      </div>
    </div>
  );
}
