"use client";

import React from "react";
import { ArrowLeft, Pencil, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// Mock data (replace with API call later)
const patients = [
  { uhid: "T-01", name: "Sarah Jenkins", mobile: "+1 (555) 012-3456", genderAge: "Female • 32 yrs", status: "Complete" },
  { uhid: "T-02", name: "Michael Chen", mobile: "+1 (555) 012-3456", genderAge: "Female • 32 yrs", status: "Incomplete" },
  { uhid: "T-03", name: "Elena Rodriguez", mobile: "+1 (555) 012-3456", genderAge: "Female • 32 yrs", status: "Emergency" },
];

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const patient = patients.find(p => p.uhid === id) || patients[0];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">Patient Information</h1>
        <button 
          onClick={() => router.push("/reception/patient-registration")}
          className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="bg-card border border-border rounded-[5px] flex flex-col min-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-[18px] font-bold text-foreground leading-none">Patient Overview</h2>
            <p className="text-[13px] text-muted-foreground">Complete details for patient: {patient?.uhid}</p>
          </div>
          <button 
            onClick={() => router.push(`/reception/patient-registration/${id}/edit`)}
            className="flex items-center justify-center gap-2 px-3 py-1.5 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none w-full sm:w-auto"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="space-y-5">
            {/* Patient Details Section */}
            <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-5 sm:p-6 space-y-6 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-foreground">Demographic Details</h3>
                <span className="px-2.5 py-1 bg-[#E6F9F1] text-[#00A389] rounded-[5px] text-[11px] font-bold shrink-0">
                  Profile Complete
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">Full Name</p>
                  <p className="text-[14px] font-bold text-foreground">{patient?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">Gender / Age</p>
                  <p className="text-[14px] font-bold text-foreground">{patient?.genderAge}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">Blood Group</p>
                  <p className="text-[14px] font-bold text-foreground">O+</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">Mobile Number</p>
                  <p className="text-[14px] font-bold text-foreground">{patient?.mobile}</p>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                  <p className="text-[14px] font-bold text-foreground">patient@example.com</p>
                </div>
              </div>
            </div>

            {/* Address Details Section */}
            <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-3">
              <h3 className="text-[15px] font-bold text-foreground">Address Details</h3>
              <p className="text-[14px] font-bold text-foreground leading-relaxed">
                123 Main Street, Apt 4B, New York, NY, 10001, USA
              </p>
            </div>

            {/* Identity Section */}
            <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-6">
              <h3 className="text-[15px] font-bold text-foreground">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium">Aadhaar Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-foreground">XXXX-XXXX-1234</p>
                    <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium">Passport Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-foreground">XXXX-XXXX-1234</p>
                    <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] text-muted-foreground font-medium">PAN Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-foreground">XXXX-XXXX-1234</p>
                    <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
