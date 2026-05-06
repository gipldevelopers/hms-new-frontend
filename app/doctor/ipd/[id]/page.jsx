"use client";

import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  AlertTriangle, 
  Printer, 
  Plus, 
  Heart, 
  Activity, 
  Thermometer, 
  Wind,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PATIENT_DATA = {
  name: "James Wilson",
  ageGender: "62 yrs • Male",
  status: "CRITICAL",
  uhid: "UHID-839211",
  bedNo: "ICU-04",
  admissionDate: "12 Oct 2023",
  attendingDoctor: "Dr. Sarah Jenkins",
  diagnosis: "Acute Myocardial Infarction",
  allergies: "Penicillin, Sulfa Drugs",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
};

const VITALS = [
  { label: "Heart Rate", value: "112", unit: "bpm", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  { label: "Blood Pressure", value: "145/90", unit: "mmHg", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Temperature", value: "38.5", unit: "°C", icon: Thermometer, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { label: "SPO2", value: "94", unit: "%", icon: Wind, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
];

const PROGRESS_NOTES = [
  { 
    author: "Dr. Sarah Well", 
    text: "Patient is responding well to IV antibiotics. Fever has subsided. Chest X-ray scheduled for tomorrow morning.",
    time: "Today, 09:30 AM" 
  },
  { 
    author: "Nurse Jane Doe", 
    text: "Patient complained of mild discomfort while breathing. Administered oxygen at 2L/min as SOS. Oxygen saturation improved to 98%.",
    time: "Yesterday, 08:00 PM" 
  },
];

const MEDICATIONS = [
  { name: "Ceftriaxone", dose: "1g IV - Every 12 hours" },
  { name: "Azithromycin", dose: "500mg Oral - Once daily" },
  { name: "Paracetamol", dose: "650mg Oral - PRN for fever" },
];

const CARE_DIET = [
  { text: "Regular diet, increase fluid intake", icon: CheckCircle2, color: "text-blue-500" },
  { text: "Ambulate with assistance", icon: CheckCircle2, color: "text-blue-500" },
  { text: "Allergic to Penicillin", icon: AlertCircle, color: "text-orange-500" },
];

const VITALS_HISTORY = [
  { 
    id: 1,
    date: "Today", 
    time: "10:45 AM", 
    bp: "120/80", 
    hr: "88", 
    spo2: "98%", 
    temp: "37.2 °C", 
    resp: "22", 
    pain: "4", 
    recordedBy: "Sarah Jenkins, RN",
    notes: true 
  },
  { 
    id: 2,
    date: "Today", 
    time: "06:00 AM", 
    bp: "120/80", 
    hr: "72", 
    spo2: "99%", 
    temp: "36.8 °C", 
    resp: "16", 
    pain: "2", 
    recordedBy: "Sarah Jenkins, RN" 
  },
  { 
    id: 3,
    date: "Yesterday", 
    time: "10:00 PM", 
    bp: "118/76", 
    hr: "68", 
    spo2: "99%", 
    temp: "36.9 °C", 
    resp: "14", 
    pain: "0", 
    recordedBy: "Mike Ross, RN" 
  },
  { 
    id: 4,
    date: "Yesterday", 
    time: "02:00 PM", 
    bp: "135/88", 
    hr: "75", 
    spo2: "97%", 
    temp: "37.1 °C", 
    resp: "18", 
    pain: "1", 
    recordedBy: "Mike Ross, RN" 
  },
  { 
    id: 5,
    date: "Yesterday", 
    time: "06:00 AM", 
    bp: "122/82", 
    hr: "70", 
    spo2: "98%", 
    temp: "36.7 °C", 
    resp: "16", 
    pain: "0", 
    recordedBy: "Sarah Jenkins, RN" 
  },
];

const LAB_RESULTS = [
  { 
    id: 1, 
    name: "Complete Blood Count (CBC)", 
    date: "Oct 13, 2023", 
    status: "Final", 
    statusColor: "text-emerald-500", 
    dotColor: "bg-emerald-500", 
    flag: "Abnormal", 
    flagColor: "text-rose-500" 
  },
  { 
    id: 2, 
    name: "Chest X-Ray (PA View)", 
    date: "Oct 12, 2023", 
    status: "Final", 
    statusColor: "text-emerald-500", 
    dotColor: "bg-emerald-500" 
  },
  { 
    id: 3, 
    name: "Basic Metabolic Panel", 
    date: "Oct 12, 2023", 
    status: "Final", 
    statusColor: "text-emerald-500", 
    dotColor: "bg-emerald-500" 
  },
  { 
    id: 4, 
    name: "Sputum Culture", 
    date: "Oct 12, 2023", 
    status: "Pending", 
    statusColor: "text-amber-500", 
    dotColor: "bg-amber-500" 
  },
];

const CLINICAL_NOTES = [
  {
    id: 1,
    type: "PROGRESS NOTE",
    author: "Dr. Sarah Well",
    role: "(Attending)",
    date: "Today, 09:30 AM",
    content: "Patient is responding well to IV antibiotics. Fever has subsided. Chest X-ray scheduled for tomorrow morning. Plan: Continue current antibiotic regimen."
  },
  {
    id: 2,
    type: "NURSING NOTE",
    author: "Jane Doe",
    role: "(RN)",
    date: "Yesterday, 08:00 PM",
    content: "Patient complained of mild discomfort while breathing. Administered oxygen at 2L/min as SOS. Oxygen saturation improved to 98%. Informed attending on-call."
  },
  {
    id: 3,
    type: "ADMISSION NOTE",
    author: "Dr. Mike Ross",
    role: "(Resident)",
    date: "Oct 12, 2023, 11:45 AM",
    content: "45yo male presenting with high fever, productive cough, and shortness of breath for 3 days. Exam reveals crepitations in right lower lobe. Admitted for IV antibiotics and close monitoring."
  }
];

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] p-1 rounded-[5px] shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-[#F8F9FC] dark:hover:bg-white/5"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PatientChartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const patientId = params.id;
  const activeTab = searchParams.get("tab") || "Summary";
  const [search, setSearch] = useState("");

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const tabs = ["Summary", "Vitals", "Lab Results", "Notes"];

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Back Navigation ── */}
      <div className="flex items-center gap-2">
        <Link 
          href="/doctor/ipd" 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A1C23] dark:text-white" />
        </Link>
        <span className="text-[14px] font-bold text-[#5E6C84] dark:text-slate-400">Back to Patients</span>
      </div>

      {/* ── Allergy Banner ── */}
      <div className="bg-[#FFF5F5] dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 p-4 rounded-[5px] flex items-center gap-3">
        <div className="w-10 h-10 bg-white dark:bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-[14px] font-bold text-rose-600 tracking-tight">ALLERGIES:</span>
          <span className="text-[14px] font-medium text-rose-500">{PATIENT_DATA.allergies}</span>
        </div>
      </div>

      {/* ── Patient Header Card ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none flex flex-col lg:flex-row gap-8">
        {/* Profile Info */}
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="w-20 h-20 rounded-[5px] overflow-hidden bg-gray-100 dark:bg-white/10 border border-[#E7E8EB] dark:border-white/10 relative">
            <img 
              src={PATIENT_DATA.avatar} 
              alt={PATIENT_DATA.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#1A1C23] dark:text-white leading-none">
                {PATIENT_DATA.name}
              </h1>
              <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full border border-rose-100 dark:border-rose-500/20">
                {PATIENT_DATA.status}
              </span>
            </div>
            <p className="text-[14px] text-[#5E6C84] dark:text-slate-400 font-medium">{PATIENT_DATA.ageGender}</p>
            <div className="mt-2">
              <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider">UHID</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white tracking-tight">{PATIENT_DATA.uhid}</p>
            </div>
          </div>
        </div>

        {/* Divider for Desktop */}
        <div className="hidden lg:block w-[1px] bg-[#E7E8EB] dark:bg-white/10 self-stretch" />

        {/* Info Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
          <InfoItem label="Bed No." value={PATIENT_DATA.bedNo} />
          <InfoItem label="Admission Date." value={PATIENT_DATA.admissionDate} />
          <InfoItem label="Attending Doctor" value={PATIENT_DATA.attendingDoctor} />
          <InfoItem label="Diagnosis" value={PATIENT_DATA.diagnosis} />
        </div>
      </div>

      {/* ── Section Title & Action Buttons ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-[18px] font-bold text-[#1A1C23] dark:text-white tracking-tight">
          {activeTab === "Summary" ? "Patient Profile" : activeTab}
        </h2>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none">
            <Printer className="w-4 h-4" />
            Print Chart
          </button>
          <Link 
            href={`/doctor/ipd/${patientId}/notes/add`}
            className="h-10 px-4 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </Link>
        </div>
      </div>

      {/* ── Custom Tabs ── */}
      <div className="flex items-center gap-2 bg-[#EEF0F8] dark:bg-white/5 p-1 rounded-[5px] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-[5px] text-[13px] font-bold transition-all",
              activeTab === tab
                ? "bg-[#2D3A8C] text-white"
                : "text-[#5E6C84] dark:text-slate-400 hover:text-[#2D3A8C] dark:hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "Summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
          {/* Left Column (8/12) */}
          <div className="lg:col-span-8 space-y-[20px]">
            {/* Latest Vitals */}
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Latest Vitals</h3>
                <span className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-500">Recorded 2 hours ago</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VITALS.map((vital, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 p-4 rounded-[5px] shadow-none flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <vital.icon className={cn("w-4 h-4", vital.color)} />
                      <span className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider">{vital.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[20px] font-bold text-[#1A1C23] dark:text-white leading-none">{vital.value}</span>
                      <span className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-500">{vital.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Progress Notes */}
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none">
              <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-6">Recent Progress Notes</h3>
              <div className="space-y-6">
                {PROGRESS_NOTES.map((note, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-[#2D3A8C]">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{note.author}</p>
                      <p className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.time}
                      </p>
                    </div>
                    <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 leading-relaxed font-medium">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4/12) */}
          <div className="lg:col-span-4 space-y-[20px]">
            {/* Active Medications */}
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Active Medications</h3>
                <Plus className="w-4 h-4 text-[#5E6C84] cursor-pointer" />
              </div>
              <div className="space-y-3">
                {MEDICATIONS.map((med, idx) => (
                  <div key={idx} className="bg-[#F8F9FC] dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 p-4 rounded-[5px]">
                    <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white mb-1">{med.name}</p>
                    <p className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-400">{med.dose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Care & Diet */}
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none">
              <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-5">Care & Diet</h3>
              <div className="space-y-3">
                {CARE_DIET.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", item.color)} />
                    <p className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400 leading-snug">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Vitals" && (
        <div className="space-y-[20px]">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-3.5 rounded-[5px] shadow-none">
            <div className="relative flex-1 max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3">
              <CustomSelect
                value="All"
                onChange={() => {}}
                placeholder="All"
                options={[{ label: "All", value: "All" }]}
                minWidth="70px"
              />
              <CustomSelect
                value="All"
                onChange={() => {}}
                placeholder="All"
                options={[{ label: "All", value: "All" }]}
                minWidth="70px"
              />
            </div>
          </div>

          {/* Vitals History Table */}
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-white/[0.02] border-b border-[#E7E8EB] dark:border-white/10 text-[11px] font-bold text-[#5E6C84] dark:text-slate-400">
                  <th className="px-6 py-5">Date & Time</th>
                  <th className="px-6 py-5">BP (mmHg)</th>
                  <th className="px-6 py-5">HR</th>
                  <th className="px-6 py-5">SpO2</th>
                  <th className="px-6 py-5">Temp</th>
                  <th className="px-6 py-5">Resp</th>
                  <th className="px-6 py-5">Pain</th>
                  <th className="px-6 py-5">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                {VITALS_HISTORY.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{entry.date}</span>
                        <span className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-500">{entry.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.bp}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.hr}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.spo2}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.temp}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.resp}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                      {entry.pain}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{entry.recordedBy}</span>
                        {entry.notes && (
                          <span className="text-[11px] font-bold text-primary cursor-pointer hover:underline">Notes attached</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Lab Results" && (
        <div className="space-y-[20px]">
          {LAB_RESULTS.map((result) => (
            <div key={result.id} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex items-center justify-between gap-4 shadow-none">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-[5px] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white leading-none">
                    {result.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-400">
                      Ordered: {result.date}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", result.dotColor)} />
                      <span className={cn("text-[12px] font-bold", result.statusColor)}>
                        {result.status}
                      </span>
                    </div>
                    {result.flag && (
                      <span className={cn("text-[12px] font-bold", result.flagColor)}>
                        Flag: {result.flag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Link 
                href={`/doctor/ipd/${patientId}/lab/${result.id}`}
                className="h-9 px-5 bg-white dark:bg-[#101935] border border-[#2D3A8C] text-[#2D3A8C] dark:text-primary-foreground rounded-[5px] text-[12px] font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none outline-none"
              >
                View Result
              </Link>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Notes" && (
        <div className="space-y-[20px]">
          {CLINICAL_NOTES.map((note) => (
            <div key={note.id} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none overflow-hidden">
              {/* Note Header */}
              <div className="p-5 border-b border-[#E7E8EB] dark:border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#F1F2F4] dark:bg-white/5 text-[#5E6C84] text-[10px] font-bold rounded-[3px] tracking-wider uppercase">
                    {note.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#1A1C23] dark:text-white">
                      {note.author}
                    </span>
                    <span className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-400">
                      {note.role}
                    </span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-500">
                  {note.date}
                </span>
              </div>
              
              {/* Note Content */}
              <div className="p-5">
                <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>

              <div className="p-4 border-t border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC] dark:bg-white/[0.01] flex justify-end gap-3">
                <Link 
                  href={`/doctor/ipd/${patientId}/notes/${note.id}/edit`}
                  className="h-9 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[#1A1C23] dark:text-white rounded-[5px] text-[12px] font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none outline-none"
                >
                  Edit Note
                </Link>
                <Link 
                  href={`/doctor/ipd/${patientId}/notes/${note.id}/history`}
                  className="h-9 px-5 bg-[#2D3A8C] text-white rounded-[5px] text-[12px] font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-none outline-none"
                >
                  View History
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Placeholder for other tabs ── */}
      {activeTab !== "Summary" && activeTab !== "Vitals" && activeTab !== "Lab Results" && activeTab !== "Notes" && (
        <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-12 rounded-[5px] flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-300" />
           </div>
           <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white">{activeTab} Details</h3>
           <p className="text-[14px] text-[#5E6C84] dark:text-slate-400 mt-2">Comprehensive {activeTab.toLowerCase()} data for the patient will be displayed here.</p>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-tight">{value}</p>
    </div>
  );
}
