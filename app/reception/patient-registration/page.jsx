"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronDown,
  Check,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const patients = [
  {
    uhid: "T-01",
    name: "Sarah Jenkins",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Complete",
  },
  {
    uhid: "T-02",
    name: "Michael Chen",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Incomplete",
  },
  {
    uhid: "T-03",
    name: "Elena Rodriguez",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Emergency",
  },
  {
    uhid: "T-04",
    name: "James Wilson",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Complete",
  },
  {
    uhid: "T-05",
    name: "Anita Patel",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Complete",
  },
  {
    uhid: "T-06",
    name: "David Thompson",
    mobile: "+1 (555) 012-3456",
    genderAge: "Female • 32 yrs",
    date: "Oct 24, 2023 09:41 AM",
    status: "Incomplete",
  },
];

const StatusPill = ({ status }) => {
  const styles = {
    Complete: "bg-[#E6F9F1] text-[#00A389]",
    Incomplete: "bg-[#FEFCE8] text-[#A16207]",
    Emergency: "bg-[#FFF2F2] text-[#E11D48]",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-[5px] text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function PatientRegistration() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Patient Registration
        </h1>
        <button
          onClick={() => router.push("/reception/patient-registration/new")}
          className="flex items-center gap-2 bg-primary text-white px-4 h-11 rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          New Registration
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-[5px] shadow-none flex flex-col">
        {/* Filters and Search Bar */}
        <div className="p-3 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/60">
          <div className="relative w-full md:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search patients by UHID, name, or mobile..."
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                  All Status
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[140px] border-border bg-card shadow-xl rounded-[5px] p-1"
              >
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  Complete
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  Incomplete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                  Last 30 Days
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px] border-border bg-card shadow-xl rounded-[5px] p-1"
              >
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  Last 30 Days
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                  Last 7 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Container - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Uhid
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Gender / Age
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground text-center uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {patients.map((patient, index) => (
                <tr key={index} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">
                    {patient.uhid}
                  </td>
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">
                    {patient.name}
                  </td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">
                    {patient.mobile}
                  </td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">
                    {patient.genderAge}
                  </td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">
                    {patient.date}
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill status={patient.status} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (patient.status === "Incomplete") {
                            router.push(`/reception/patient-registration/${patient.uhid}/edit`);
                          } else {
                            router.push(`/reception/patient-registration/${patient.uhid}`);
                          }
                        }}
                        className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground transition-all group/eye"
                        title={
                          patient.status === "Incomplete"
                            ? "Continue Registration"
                            : "View Details"
                        }
                      >
                        <Eye className="w-4 h-4 group-hover/eye:text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View - Only visible on small screens */}
        <div className="md:hidden divide-y divide-border/60">
          {patients.map((patient, index) => (
            <div 
              key={index} 
              className="p-4 space-y-4 hover:bg-muted/5 transition-colors active:bg-muted/10"
              onClick={() => {
                if (patient.status === "Incomplete") {
                  router.push(`/reception/patient-registration/${patient.uhid}/edit`);
                } else {
                  router.push(`/reception/patient-registration/${patient.uhid}`);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-[4px] uppercase">
                      {patient.uhid}
                    </span>
                    <StatusPill status={patient.status} />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    {patient.name}
                  </h3>
                </div>
                <button className="p-2 bg-muted/50 rounded-full">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Mobile</p>
                  <p className="text-[13px] font-bold text-foreground">{patient.mobile}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Gender/Age</p>
                  <p className="text-[13px] font-bold text-foreground">{patient.genderAge}</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Reg. Date</p>
                  <p className="text-[13px] font-medium text-foreground">{patient.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
