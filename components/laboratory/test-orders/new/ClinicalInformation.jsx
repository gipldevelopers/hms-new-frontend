"use client";
import React, { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export function ClinicalInformation({ priority, setPriority, value, onChange }) {
  const [options, setOptions] = useState({ doctors: [], departments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function fetchOptions() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/laboratory/clinical-options`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch clinical options");
        if (!alive) return;
        const next = data.data || { doctors: [], departments: [] };
        setOptions(next);
        onChange((prev) => ({
          ...prev,
          doctorId: prev.doctorId || next.doctors?.[0]?.id || "",
          doctorName: prev.doctorName || next.doctors?.[0]?.name || "",
          departmentName: prev.departmentName || next.departments?.[0]?.name || "",
        }));
      } catch {
        if (alive) setOptions({ doctors: [], departments: [] });
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchOptions();
    return () => { alive = false; };
  }, [onChange]);

  const setDoctor = (doctor) => {
    onChange((prev) => ({ ...prev, doctorId: doctor?.id || "", doctorName: doctor?.name || "" }));
  };

  const setDepartment = (departmentName) => {
    onChange((prev) => ({ ...prev, departmentName }));
  };

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-bold text-foreground">Clinical Information</h2>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Referring Doctor</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
                <span className="truncate text-left">{value.doctorName || "Select doctor"}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px] p-1 border-border rounded-lg shadow-none bg-card">
              {options.doctors.length === 0 ? (
                <DropdownMenuItem disabled className="font-bold text-[13px] h-10 px-3 rounded-lg">
                  No doctors found
                </DropdownMenuItem>
              ) : options.doctors.map((doctor) => (
                <DropdownMenuItem
                  key={doctor.id}
                  onClick={() => setDoctor(doctor)}
                  className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {doctor.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Department</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
                <span className="truncate text-left">{value.departmentName || "Select department"}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px] p-1 border-border rounded-lg shadow-none bg-card">
              {options.departments.length === 0 ? (
                <DropdownMenuItem disabled className="font-bold text-[13px] h-10 px-3 rounded-lg">
                  No departments found
                </DropdownMenuItem>
              ) : options.departments.map((department) => (
                <DropdownMenuItem
                  key={department.id}
                  onClick={() => setDepartment(department.name)}
                  className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {department.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Priority</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Normal", value: "Normal" },
            { label: "High", value: "High" },
            { label: "Urgent", value: "Urgent", icon: AlertCircle },
          ].map((item) => {
            const Icon = item.icon;
            const active = priority === item.value;
            const activeClass = item.value === "Urgent"
              ? "bg-rose-500/10 border-rose-500 text-rose-600"
              : item.value === "High"
                ? "bg-amber-500/10 border-amber-500 text-amber-600"
                : "bg-primary/5 border-primary text-primary";
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setPriority(item.value)}
                className={`h-11 rounded-lg border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  active ? activeClass : "bg-background border-border text-foreground hover:bg-muted/50"
                }`}
              >
                {Icon && <Icon size={14} className={active ? "text-rose-600" : "text-muted-foreground"} />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Clinical Notes</label>
        <textarea
          value={value.clinicalNotes}
          onChange={(e) => onChange((prev) => ({ ...prev, clinicalNotes: e.target.value }))}
          placeholder="Reason, indication, or doctor notes..."
          className="w-full min-h-[80px] p-4 bg-background border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
        />
      </div>
    </div>
  );
}
