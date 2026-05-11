"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronDown,
  Check,
  Ambulance,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const emergencyPatients = [
  {
    uhid: "T-01",
    name: "Elena Rodriguez",
    mobile: "+1 (555) 012-3456",
    arrivalMode: "Ambulance",
    priority: "CRITICAL",
    date: "Oct 24, 2023 09:41 AM",
    status: "Emergency",
  },
  {
    uhid: "T-10",
    name: "Michael Chen",
    mobile: "+1 (555) 098-7654",
    arrivalMode: "Walk-In",
    priority: "URGENT",
    date: "Oct 24, 2023 09:45 AM",
    status: "Incomplete",
  },
  {
    uhid: "T-10",
    name: "Sarah Jenkins",
    mobile: "+1 (555) 246-1357",
    arrivalMode: "Referral",
    priority: "STABLE",
    date: "Oct 24, 2023 10:12 AM",
    status: "Complete",
  },
  {
    uhid: "T-10",
    name: "James Wilson",
    mobile: "+1 (555) 789-1234",
    arrivalMode: "Ambulance",
    priority: "CRITICAL",
    date: "Oct 24, 2023 10:25 AM",
    status: "Emergency",
  },
  {
    uhid: "T-10",
    name: "Anita Patel",
    mobile: "+1 (555) 321-6540",
    arrivalMode: "Walk-In",
    priority: "STABLE",
    date: "Oct 24, 2023 11:05 AM",
    status: "Complete",
  },
  {
    uhid: "T-10",
    name: "Sarah Jenkins",
    mobile: "+1 (555) 246-1357",
    arrivalMode: "Referral",
    priority: "URGENT",
    date: "Oct 24, 2023 10:12 AM",
    status: "Complete",
  },
  {
    uhid: "T-10",
    name: "James Wilson",
    mobile: "+1 (555) 789-1234",
    arrivalMode: "Ambulance",
    priority: "CRITICAL",
    date: "Oct 24, 2023 10:25 AM",
    status: "Emergency",
  },
  {
    uhid: "T-10",
    name: "Anita Patel",
    mobile: "+1 (555) 321-6540",
    arrivalMode: "Walk-In",
    priority: "STABLE",
    date: "Oct 24, 2023 11:05 AM",
    status: "Complete",
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
      className={cn(
        "px-2.5 py-1 rounded-[5px] text-[11px] font-bold",
        styles[status]
      )}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    CRITICAL: "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20",
    URGENT: "bg-[#FFF9F2] text-[#D97706] border-[#D97706]/20",
    STABLE: "bg-[#E6F9F1] text-[#00A389] border-[#00A389]/20",
  };

  const labels = {
    CRITICAL: "CRITICAL (RED)",
    URGENT: "URGENT (YELLOW)",
    STABLE: "STABLE (GREEN)",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-[4px] text-[10px] font-bold border",
        styles[priority]
      )}
    >
      {labels[priority]}
    </span>
  );
};

const ArrivalIcon = ({ mode }) => {
  if (mode === "Ambulance") return <Ambulance className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Walk-In") return <User className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Referral") return <Building2 className="w-4 h-4 text-muted-foreground" />;
  return null;
};

export default function EmergencyRegistration() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Emergency Patient Registration
        </h1>
        <button
          onClick={() => router.push("/reception/emergency-registration/new")}
          className="flex items-center gap-2 bg-[#3B4CB8] text-white px-4 h-11 rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          New Registration
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-[5px] shadow-none flex flex-col overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-3 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/60">
          <div className="relative w-full md:w-[220px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none min-w-[80px] justify-between">
                  All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[120px] border-border bg-card shadow-xl rounded-[5px] p-1">
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer bg-primary/5 text-primary font-bold">All</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none min-w-[80px] justify-between">
                  All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[120px] border-border bg-card shadow-xl rounded-[5px] p-1">
                <DropdownMenuItem className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer bg-primary/5 text-primary font-bold">All</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Container - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PATIENT NAME</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">MOBILE</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ARRIVAL MODE</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TRIAGE PRIORITY</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">REGISTRATION DATE</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">STATUS</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground text-center uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {emergencyPatients.map((patient, index) => (
                <tr key={index} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">{patient.name}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.mobile}</td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                      <ArrivalIcon mode={patient.arrivalMode} />
                      {patient.arrivalMode}
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <PriorityBadge priority={patient.priority} />
                  </td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.date}</td>
                  <td className="px-5 py-5">
                    <StatusPill status={patient.status} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => {
                          if (patient.status === "Incomplete") {
                            router.push(`/reception/emergency-registration/${patient.uhid}/edit`);
                          } else {
                            router.push(`/reception/emergency-registration/${patient.uhid}`);
                          }
                        }}
                        className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-border/60">
          {emergencyPatients.map((patient, index) => (
            <div 
              key={index} 
              className="p-4 space-y-4 hover:bg-muted/5 transition-colors active:bg-muted/10 cursor-pointer"
              onClick={() => {
                if (patient.status === "Incomplete") {
                  router.push(`/reception/emergency-registration/${patient.uhid}/edit`);
                } else {
                  router.push(`/reception/emergency-registration/${patient.uhid}`);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge priority={patient.priority} />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">{patient.name}</h3>
                </div>
                <button className="p-2 bg-muted/50 rounded-full shrink-0">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Arrival Mode</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                    <ArrivalIcon mode={patient.arrivalMode} />
                    {patient.arrivalMode}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Mobile</p>
                  <p className="text-[13px] font-bold text-foreground">{patient.mobile}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status</p>
                  <div><StatusPill status={patient.status} /></div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Reg. Date</p>
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
