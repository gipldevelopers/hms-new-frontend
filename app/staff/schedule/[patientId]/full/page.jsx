"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft,
  Calendar, CheckCircle2, AlertCircle, ListTodo, Activity, MapPin, Search, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_PATIENTS = [
  { id: 1, name: "James Wilson",    doctor: "Dr. Aris Thorne",   dose: "Acute Myocardial Infarction", status: "1 Overdue"   },
  { id: 2, name: "Maria Lopez",     doctor: "Dr. Sarah Jenkins", dose: "Chronic Heart Failure",       status: "3 Meds Due"  },
  { id: 3, name: "John Smith",      doctor: "Dr. Aris Thorne",   dose: "Pneumonia",                   status: "All Clear"   },
  { id: 4, name: "Anita Bhatt",     doctor: "Dr. Michael Vane",  dose: "Severe Asthma Attack",        status: "1 Due Soon"  },
  { id: 5, name: "Carlos Vega",     doctor: "Dr. Sarah Jenkins", dose: "Acute Stroke",                status: "2 Overdue"   },
  { id: 6, name: "Helen Parker",    doctor: "Dr. Aris Thorne",   dose: "Diabetes Complications",      status: "1 Overdue"   },
  { id: 7, name: "William Johnson", doctor: "Dr. Sarah Jenkins", dose: "Sepsis",                      status: "3 Meds Due"  },
  { id: 8, name: "Nina Patel",      doctor: "Dr. Aris Thorne",   dose: "Appendicitis",                status: "All Clear"   },
  { id: 9, name: "George Brown",    doctor: "Dr. Michael Vane",  dose: "COPD Exacerbation",           status: "1 Due Soon"  },
];

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

function CustomSelect({ value, onChange, options, placeholder }) {
  const selected = options.find((o) => o.value === value);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-[120px] shadow-none"
        >
          <span className="truncate flex-1 text-left">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] border border-border bg-card rounded-[var(--radius)] p-1 z-[500] shadow-none">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FullSchedulePage() {
  const params = useParams();
  const router = useRouter();

  const patientId = parseInt(params.patientId, 10) || 1;
  const patient = INITIAL_PATIENTS.find((p) => p.id === patientId) || INITIAL_PATIENTS[0];

  const [search, setSearch] = useState("");
  const [filter1, setFilter1] = useState("All");
  const [filter2, setFilter2] = useState("All");

  // Draggable Scale Line Marker states
  const [markerLeft, setMarkerLeft] = useState(220 + 1.6 * 55);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const relativeX = e.clientX - rect.left + scrollLeft;
    
    // Limits: medication column (220px) to the very end of 17 hourly columns (220 + 17*55)
    const minX = 220;
    const maxX = 220 + 17 * 55;
    const clampedX = Math.max(minX, Math.min(maxX, relativeX));
    setMarkerLeft(clampedX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all flex items-center gap-1 text-foreground font-bold text-[13px] shadow-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to patient details
        </button>
      </div>

      {/* ── Allergies Alert Banner ── */}
      <div className="bg-red-500/10 dark:bg-red-950/20 border border-red-500/20 dark:border-red-500/10 border-l-4 border-l-red-500 p-4 rounded-[var(--radius)] flex items-center gap-3 shadow-none">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-[13px] font-bold text-red-600 leading-none">ALLERGIES:</span>
        <span className="text-[13px] font-medium text-red-500 leading-none">Penicillin, Sulfa Drugs</span>
      </div>

      {/* ── Patient Profile Info Card ── */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-[var(--radius)] flex flex-col md:flex-row items-center gap-5 shadow-none">
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=60"
            alt="Patient"
            className="w-16 h-16 rounded-full border border-border object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-foreground leading-tight">
                {patient.name}
              </h2>
              <span className="bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2 py-0.5 rounded-[var(--radius)] inline-flex">
                CRITICAL
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              62 yrs • Male
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 w-full border-t md:border-t-0 md:border-l border-border pt-5 md:pt-0 md:pl-5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">UHID</p>
            <p className="text-[13px] font-bold text-foreground mt-1">UHID-839211</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">BED NO.</p>
            <p className="text-[13px] font-bold text-foreground mt-1">ICU-04</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">ADMISSION DATE</p>
            <p className="text-[13px] font-bold text-foreground mt-1">12 Oct 2023</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">ATTENDING DOCTOR</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{patient.doctor}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">DIAGNOSIS</p>
            <p className="text-[13px] font-bold text-foreground mt-1 leading-tight">{patient.dose}</p>
          </div>
        </div>
      </div>

      {/* ── Search & Filters Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent w-full">
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-normal focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <CustomSelect
            value={filter1}
            onChange={setFilter1}
            options={[
              { label: "All", value: "All" },
              { label: "Morning", value: "Morning" },
              { label: "Evening", value: "Evening" },
            ]}
            placeholder="All"
          />
          <CustomSelect
            value={filter2}
            onChange={setFilter2}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "Active" },
              { label: "PRN Only", value: "PRN Only" },
            ]}
            placeholder="All"
          />
        </div>
      </div>

      {/* ── Main Schedule Calendar Visual Grid ── */}
      <div className="bg-card text-card-foreground border border-border rounded-[var(--radius)] overflow-hidden flex flex-col shadow-none relative select-none">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="overflow-x-auto no-scrollbar relative w-full select-none select-none"
        >
          <table className="w-full border-collapse min-w-[1250px] relative">
            
            {/* Header Column Slots */}
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="p-4 text-left text-[12px] font-bold text-muted-foreground uppercase tracking-tight w-[220px] shrink-0 border-r border-border">
                  Medication
                </th>
                {TIME_SLOTS.map((slot) => (
                  <th key={slot} className="p-2.5 text-center text-[11px] font-bold text-muted-foreground border-r border-border min-w-[55px]">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body Rows */}
            <tbody className="divide-y divide-border relative">
              
              {/* Row 1: Pan-D Capsule */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-4 border-r border-border">
                  <p className="text-[13px] font-bold text-blue-600 leading-tight">Pan-D Capsule</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-none">1 Cap • OD</p>
                </td>
                {/* 06:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-[var(--radius)] p-1 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    <Check className="w-3.5 h-3.5" /> 06:10
                  </span>
                </td>
                {/* 07:00 to 22:00 */}
                {TIME_SLOTS.slice(1).map((slot) => (
                  <td key={slot} className="p-2 border-r border-border text-center h-[52px]" />
                ))}
              </tr>

              {/* Row 2: Monocef 1g Inj */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-4 border-r border-border">
                  <p className="text-[13px] font-bold text-blue-600 leading-tight">Monocef 1g Inj</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-none">1g • BD (IV)</p>
                </td>
                {/* 06:00, 07:00 */}
                <td className="p-2 border-r border-border text-center h-[52px]" />
                <td className="p-2 border-r border-border text-center h-[52px]" />
                {/* 08:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-[var(--radius)] p-1 px-2.5 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    08:00
                  </span>
                </td>
                {/* 09:00 to 19:00 */}
                {TIME_SLOTS.slice(3, 14).map((slot) => (
                  <td key={slot} className="p-2 border-r border-border text-center h-[52px]" />
                ))}
                {/* 20:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-card border border-border text-foreground rounded-[var(--radius)] p-1 px-2.5 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    20:00
                  </span>
                </td>
                {/* 21:00, 22:00 */}
                <td className="p-2 border-r border-border text-center h-[52px]" />
                <td className="p-2 border-r border-border text-center h-[52px]" />
              </tr>

              {/* Row 3: Novorapid Flexpen */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-4 border-r border-border">
                  <p className="text-[13px] font-bold text-blue-600 leading-tight">Novorapid Flexpen</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-none">SS • TDS (SubQ)</p>
                </td>
                {/* 06:00, 07:00 */}
                <td className="p-2 border-r border-border text-center h-[52px]" />
                <td className="p-2 border-r border-border text-center h-[52px]" />
                {/* 08:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-[var(--radius)] p-1 px-2.5 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    08:00
                  </span>
                </td>
                {/* 09:00 to 12:00 */}
                {TIME_SLOTS.slice(3, 7).map((slot) => (
                  <td key={slot} className="p-2 border-r border-border text-center h-[52px]" />
                ))}
                {/* 13:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-card border border-border text-foreground rounded-[var(--radius)] p-1 px-2.5 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    13:00
                  </span>
                </td>
                {/* 14:00 to 19:00 */}
                {TIME_SLOTS.slice(8, 14).map((slot) => (
                  <td key={slot} className="p-2 border-r border-border text-center h-[52px]" />
                ))}
                {/* 20:00 */}
                <td className="p-2 border-r border-border text-center">
                  <span className="bg-card border border-border text-foreground rounded-[var(--radius)] p-1 px-2.5 text-[11px] font-bold select-none cursor-default inline-flex items-center gap-1 leading-none shadow-none">
                    20:00
                  </span>
                </td>
                {/* 21:00, 22:00 */}
                <td className="p-2 border-r border-border text-center h-[52px]" />
                <td className="p-2 border-r border-border text-center h-[52px]" />
              </tr>

              {/* Row 4: Dolo 650 (PRN) */}
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-4 border-r border-border">
                  <p className="text-[13px] font-bold text-blue-600 leading-tight">Dolo 650 (PRN)</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-none">650mg • SOS</p>
                </td>
                <td colSpan={17} className="p-4 border-r border-border text-left">
                  <span className="text-[13px] font-medium text-muted-foreground italic leading-none pl-4 opacity-75">
                    No fixed schedule. Given 0 times today.
                  </span>
                </td>
              </tr>

            </tbody>
          </table>

          {/* Vertical Current Time Marker Line - PERFECTLY Draggable! */}
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            className="absolute top-0 bottom-0 w-[4px] bg-amber-500 flex flex-col justify-between items-center cursor-col-resize z-[20] hover:bg-amber-600 transition-colors touch-none"
            style={{ left: `${markerLeft}px` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 -mt-1.5 shrink-0" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 -mb-1.5 shrink-0" />
          </div>

        </div>
      </div>

    </div>
  );
}
