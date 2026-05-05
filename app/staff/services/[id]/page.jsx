"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Activity, MessageSquare, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_SERVICES = [
  {
    id: 1,
    patientName: "John Smith",
    age: "50 yrs • Male",
    bed: "W1-B12",
    uhid: "UHID-839211",
    admissionDate: "12 Oct 2023",
    doctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Myocardial Infarction",
    requestType: "Lab Pickup",
    requestDescription: "Blood sample needs to be collected for CBC test. Patient is currently fasting. Please prioritize as results are needed before noon rounds.",
    priority: "Normal",
    time: "10:45 AM, Today",
    prefTime: "11:00 AM (ASAP)",
    dept: "Laboratory",
    status: "Pending"
  },
  {
    id: 2,
    patientName: "Sarah Jenkins",
    age: "60 yrs • Female",
    bed: "W3-B04",
    uhid: "UHID-839212",
    admissionDate: "14 Oct 2023",
    doctor: "Dr. Sarah Jenkins",
    diagnosis: "Chronic Heart Failure",
    requestType: "X-ray",
    requestDescription: "Chest PA view needed for routine recovery check.",
    priority: "Urgent",
    time: "10:30 AM, Today",
    prefTime: "11:00 AM (ASAP)",
    dept: "Radiology",
    status: "Accepted"
  },
  {
    id: 3,
    patientName: "Michael Chang",
    age: "55 yrs • Male",
    bed: "W1-B08",
    uhid: "UHID-839213",
    admissionDate: "15 Oct 2023",
    doctor: "Dr. Aris Thorne",
    diagnosis: "Acute Stroke",
    requestType: "Housekeeping",
    requestDescription: "Bed spill cleanup in room W1-B08 immediately.",
    priority: "Urgent",
    time: "10:15 AM, Today",
    prefTime: "10:30 AM (ASAP)",
    dept: "Facilities",
    status: "Pending"
  }
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = parseInt(params.id, 10) || 1;
  const service = INITIAL_SERVICES.find((s) => s.id === id) || INITIAL_SERVICES[0];

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 ">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-[5px] border border-transparent flex items-center gap-2 text-foreground font-bold text-[13px] shadow-none  transition-all"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to services
        </button>
      </div>

      {/* ── Patient Profile Info Card ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex flex-col md:flex-row items-center gap-5 shadow-none ">
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=60"
            alt="Patient"
            className="w-16 h-16 rounded-full border border-[#E7E8EB] dark:border-white/10 object-cover shrink-0 "
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">
                {service.patientName}
              </h2>
              <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-[10px] px-2 py-0.5 rounded-[5px] leading-tight ">
                CRITICAL
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              {service.age}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 w-full border-t md:border-t-0 md:border-l border-[#E7E8EB] dark:border-white/10 pt-5 md:pt-0 md:pl-5">
          <div>
            <p className="text-[11px] font-bold text-gray-400 leading-tight">UHID</p>
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1">{service.uhid}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 leading-tight">BED NO.</p>
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1">{service.bed}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 leading-tight">ADMISSION DATE</p>
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1">{service.admissionDate}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 leading-tight">ATTENDING DOCTOR</p>
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1 leading-snug">{service.doctor}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 leading-tight">DIAGNOSIS</p>
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1 leading-tight">{service.diagnosis}</p>
          </div>
        </div>
      </div>

      {/* ── Request Details Card (Card 2) ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-none ">
        <div>
          <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-tight">
            {service.requestType}
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mt-1">
            Requested on {service.time}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "rounded-[5px] font-bold px-3 py-1 text-[11px]  tracking-wide",
            service.status === "Pending" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
            service.status === "Accepted" && "bg-blue-500/10 text-blue-600 border border-blue-500/20",
            service.status === "Completed" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
          )}>
            • {service.status.toUpperCase()}
          </span>

          <span className={cn(
            "rounded-[5px] font-bold px-3 py-1 text-[11px]  tracking-wide flex items-center gap-1.5",
            service.priority === "Urgent" && "bg-red-500/10 text-red-600 border border-red-500/20",
            service.priority === "Normal" && "bg-muted text-muted-foreground border border-border"
          )}>
            <Clock className="w-3.5 h-3.5" />
            {service.priority}
          </span>
        </div>
      </div>

      {/* ── Request Information Card (Card 3) ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex flex-col space-y-5 shadow-none ">
        <div>
          <h4 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
            Request Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#E7E8EB] dark:border-white/10 pt-5">
          <div>
            <p className="text-[11px] font-bold text-gray-400">ASSIGNED DEPARTMENT</p>
            <div className="flex items-center gap-2 mt-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-none">
                {service.dept}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400">PREFERRED TIME</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-none">
                {service.prefTime}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E7E8EB] dark:border-white/10 pt-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Description & Notes</p>
          <div className="mt-3 p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium leading-relaxed text-[#1e293b] dark:text-white/80">
            {service.requestDescription}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex justify-end items-center gap-3 ">
        <button
          onClick={() => alert(`Contacting ${service.dept} department...`)}
          className="h-11 px-5 border border-primary hover:bg-primary/5 text-primary rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none  bg-white dark:bg-[#101935]"
        >
          <MessageSquare className="w-4 h-4" /> Contact Department
        </button>
        <button
          onClick={() => alert("Re-request submitted successfully!")}
          className="h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none "
        >
          <Repeat className="w-4 h-4" /> Re-request
        </button>
      </div>

    </div>
  );
}
