"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  Eye, 
  Calendar, 
  LogOut, 
  Activity, 
  Clock,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "130px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-background border border-border rounded-[5px] flex items-center justify-between gap-3 text-[13px] font-bold outline-none transition-all shadow-none text-foreground w-full sm:w-auto hover:bg-muted focus:border-primary"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[130px] border border-border bg-card p-1 rounded-[5px] shadow-xl z-[100]">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none flex items-center justify-between",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-gray-600 hover:bg-muted"
            )}
          >
            <span>{opt.label}</span>
            {value === opt.value && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [patients, setPatients] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [statsData, setStatsData] = useState({ todayAdmissions: 0, todayDischarges: 0, inProgress: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };

      const params = new URLSearchParams();
      params.append("type", "all");
      if (searchQuery) params.append("search", searchQuery);
      if (wardFilter !== "All") params.append("wardId", wardFilter);
      if (statusFilter !== "All") params.append("status", statusFilter);

      // Fetch Admissions
      const admRes = await fetch(`/api/admissions/overview?${params.toString()}`, { headers });
      const admData = await admRes.json();
      
      const mapped = (Array.isArray(admData) ? admData : []).map(adm => ({
        id: adm.id,
        patientId: adm.patientId,
        name: adm.patient?.name || "Unknown Patient",
        age: `${adm.patient?.age || '??'} / ${adm.patient?.gender || '??'}`,
        bed: adm.bed?.label || "No Bed",
        wardName: adm.ward?.name,
        diagnosis: adm.reason || "No diagnosis provided",
        rawStatus: adm.status || "Pending"
      }));
      setPatients(mapped);

      // Fetch Stats
      const statsRes = await fetch("/api/admissions/stats", { headers });
      const statsJson = await statsRes.json();
      if (statsJson.success || statsJson.todayAdmissions !== undefined) {
        setStatsData(statsJson.data || statsJson);
      }

      // Fetch Wards
      const infraRes = await fetch("/api/wards/overview", { headers });
      const infraData = await infraRes.json();
      setWardsList(Array.isArray(infraData) ? infraData : []);
    } catch (e) {
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, wardFilter, statusFilter]);

  const filteredPatients = patients;

  const stats = [
    { label: "Today's Admissions", value: String(statsData.todayAdmissions || 0).padStart(2, '0'), icon: Calendar, color: "blue" },
    { label: "Today's Discharges", value: String(statsData.todayDischarges || 0).padStart(2, '0'), icon: LogOut, color: "red" },
    { label: "In Progress", value: String(statsData.inProgress || 0).padStart(2, '0'), icon: Activity, color: "emerald" },
    { label: "Pending", value: String(statsData.pending || 0).padStart(2, '0'), icon: Clock, color: "amber" },
  ];

  return (
    <div className="p-[20px] bg-background min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">Patients</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-5 rounded-[5px] border border-border flex items-center justify-between shadow-none">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
                stat.color === "blue" && "bg-primary/10 text-primary",
                stat.color === "red" && "bg-destructive/10 text-destructive",
                stat.color === "emerald" && "bg-emerald-500/10 text-emerald-500",
                stat.color === "amber" && "bg-amber-500/10 text-amber-500",
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1.5 tracking-tight">{stat.label}</p>
                <p className="text-[20px] font-bold text-foreground leading-none">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area (Filter + Table) */}
      <div className="space-y-[20px] flex-1 flex flex-col">
        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-card p-3 rounded-[5px] border border-border shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <CustomSelect
              value={wardFilter}
              onChange={setWardFilter}
              placeholder="Filter by Ward"
              minWidth="140px"
              options={[
                { label: "All Wards", value: "All" },
                ...wardsList.map(w => ({ label: w.name, value: w.name }))
              ]}
            />
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by Status"
              minWidth="140px"
              options={[
                { label: "All Status", value: "All" },
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </div>
        </div>

        {/* Table Area (Desktop) / Card Area (Mobile) */}
        <div className="bg-transparent md:bg-card md:rounded-[5px] md:border md:border-border shadow-none overflow-hidden flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredPatients.map((patient, i) => (
                  <div 
                    key={i} 
                    onClick={() => router.push(`/staff/patients/${patient.patientId}`)}
                    className="bg-card p-5 rounded-[5px] border border-border active:scale-[0.98] transition-all cursor-pointer hover:border-primary/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[16px] font-bold text-foreground mb-1">{patient.name}</h3>
                        <p className="text-[12px] font-medium text-muted-foreground">{patient.age} • Bed: <span className="text-foreground font-bold">{patient.bed}</span></p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-[5px] text-[11px] font-bold border leading-none items-center justify-center inline-flex w-fit",
                        patient.rawStatus === "Pending" && "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
                        patient.rawStatus === "In Progress" && "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                        patient.rawStatus === "Completed" && "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
                        patient.rawStatus === "Pending Discharge" && "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
                      )}>
                        {patient.rawStatus === "In Progress" ? "Admitted" : patient.rawStatus}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-tight mb-1">Diagnosis</p>
                        <p className="text-[13px] text-muted-foreground font-medium line-clamp-1">{patient.diagnosis}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="bg-card border border-border rounded-[5px] p-10 text-center text-muted-foreground font-medium italic text-[13px]">
                    No patients found matching criteria.
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto no-scrollbar flex-1">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Patient Name</th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Age / Gender</th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Bed No</th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Diagnosis</th>
                      <th className="px-8 py-3 text-center text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Status</th>
                      <th className="px-8 py-3 text-right text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPatients.map((patient, i) => (
                      <tr key={i} className="hover:bg-muted/10 transition-all group cursor-pointer" onClick={() => router.push(`/staff/patients/${patient.patientId}`)}>
                        <td className="px-8 py-3">
                          <div className="text-[14px] font-bold text-foreground leading-tight">{patient.name}</div>
                        </td>
                        <td className="px-8 py-3">
                          <div className="text-[14px] text-muted-foreground font-medium">{patient.age}</div>
                        </td>
                        <td className="px-8 py-3">
                          <div className="text-[14px] font-bold text-foreground">{patient.bed}</div>
                        </td>
                        <td className="px-8 py-3">
                          <div className="text-[14px] text-muted-foreground font-medium truncate max-w-[200px]">{patient.diagnosis}</div>
                        </td>
                        <td className="px-8 py-3 text-center">
                          <span className={cn(
                            "px-3 py-1 rounded-[5px] text-[11px] font-bold border leading-none items-center justify-center inline-flex w-fit",
                            patient.rawStatus === "Pending" && "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
                            patient.rawStatus === "In Progress" && "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                            patient.rawStatus === "Completed" && "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
                            patient.rawStatus === "Pending Discharge" && "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
                          )}>
                            {patient.rawStatus === "In Progress" ? "Admitted" : patient.rawStatus}
                          </span>
                        </td>
                        <td className="px-8 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="p-2 hover:bg-muted rounded-[5px] transition-colors"
                            onClick={() => router.push(`/staff/patients/${patient.patientId}`)}
                          >
                            <Eye className="w-5 h-5 text-primary" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center text-[13px] font-medium text-muted-foreground italic">
                          No patients found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
