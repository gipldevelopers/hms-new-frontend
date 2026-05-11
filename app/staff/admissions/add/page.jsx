"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Check, User, ClipboardList, 
  ChevronLeft, ChevronDown, Calendar, Clock,
  CheckCircle2, X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Button } from "@/components/ui/button";
import { FormDatePicker } from "@/components/ui/form-date-picker";

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ value, onChange, options, placeholder, required, className }) {
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          className={cn(
            "w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-left flex items-center justify-between outline-none focus:border-primary transition-all",
            !value && "text-muted-foreground",
            value && "text-foreground",
            className
          )}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] border-border shadow-none rounded-lg p-1 z-[500]">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors",
              value === opt.value ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {opt.label}
            {value === opt.value && <Check className="w-4 h-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- CUSTOM DATE PICKER COMPONENT ---

// --- CUSTOM TIME PICKER COMPONENT ---
function CustomTimePicker({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialHour = value ? parseInt(value.split(':')[0]) : 8;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = value?.includes('PM') ? 'PM' : 'AM';

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];

  const formatTime = (h, m, p) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;

  const handleSelect = (h, m, p) => {
    setHour(h); setMinute(m); setPeriod(p);
    onChange(formatTime(h, m, p));
  };

  return (
    <DropdownMenu open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          disabled={disabled}
          className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-left flex items-center gap-3 outline-none focus:border-primary transition-all disabled:opacity-50"
        >
          <Clock className="w-4 h-4 text-primary/50" />
          {value || "Select Time"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-0 border-border bg-card shadow-none z-[600]">
        <div className="flex h-[200px]">
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {hours.map((h) => (
              <button key={h} type="button" className={cn("w-full py-2 text-[12px] font-bold transition-all", hour === h ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(h, minute, period)}>
                {h.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {minutes.map((m) => (
              <button key={m} type="button" className={cn("w-full py-2 text-[12px] font-bold transition-all", minute === parseInt(m) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(hour, parseInt(m), period)}>
                {m}
              </button>
            ))}
          </div>
          <div className="w-16 flex flex-col py-1">
            {["AM", "PM"].map((p) => (
              <button key={p} type="button" className={cn("w-full flex-1 text-[11px] font-bold transition-all", period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(hour, minute, p)}>
                {p}
              </button>
            ))}
            <button type="button" className="h-10 border-t border-border bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10" onClick={() => setIsOpen(false)}>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function AddAdmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientContact: "",
    patientEmail: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    departmentId: "",
    wardId: "",
    bedId: "",
    doctorId: "",
    admissionDate: new Date(),
    admissionTime: format(new Date(), "hh:mm a"),
    status: "In Progress",
    reason: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };
      
      const infraRes = await fetch("/api/wards/overview", { headers });
      const infraData = await infraRes.json();
      const depts = Array.isArray(infraData) ? infraData : [];
      setDepartments(depts);

      const userRes = await fetch("/api/users?role=DOCTOR", { headers });
      const userData = await userRes.json();
      if (userData.success) setDoctors(userData.data);
    } catch (e) {
      toast.error("Failed to load infrastructure data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle URL pre-selection
  useEffect(() => {
    if (departments.length > 0) {
      const deptId = searchParams.get("departmentId");
      const wardId = searchParams.get("wardId");
      const bedId = searchParams.get("bedId");

      if (deptId) {
        const dept = departments.find(d => d.id === deptId);
        if (dept) {
          setWards(dept.wards || []);
          setFormData(prev => ({ ...prev, departmentId: deptId }));
          
          if (wardId) {
            const ward = dept.wards?.find(w => w.id === wardId);
            if (ward) {
              setBeds(ward.beds?.filter(b => b.status?.toUpperCase() === 'AVAILABLE' || b.id === bedId) || []);
              setFormData(prev => ({ ...prev, wardId: wardId }));
              
              if (bedId) {
                setFormData(prev => ({ ...prev, bedId: bedId }));
              }
            }
          }
        }
      }
    }
  }, [departments, searchParams]);

  const handleDeptChange = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    setFormData(prev => ({ ...prev, departmentId: deptId, wardId: "", bedId: "" }));
    setWards(dept ? dept.wards : []);
    setBeds(dept?.wards.flatMap(w => w.beds).filter(b => b.status?.toUpperCase() === 'AVAILABLE') || []);
  };

  const handleWardChange = (wardId) => {
    const ward = wards.find(w => w.id === wardId);
    setFormData(prev => ({ ...prev, wardId, bedId: "" }));
    setBeds(ward ? ward.beds.filter(b => b.status?.toUpperCase() === 'AVAILABLE') : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      
      const combinedDateTime = new Date(formData.admissionDate);
      const [timePart, ampm] = formData.admissionTime.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      combinedDateTime.setHours(hours, minutes);

      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          admissionDate: combinedDateTime.toISOString()
        })
      });

      if (res.ok) {
        toast.success("New admission registered");
        router.push("/staff/admissions");
      } else {
        const data = await res.json();
        toast.error(data.error || "Admission failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-[20px] bg-background min-h-screen flex flex-col font-sans gap-[20px]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">New Clinical Admission</h1>
        <button 
          onClick={() => router.back()}
          className="h-[44px] px-6 border border-border bg-card rounded-lg text-[13px] font-bold text-muted-foreground flex items-center gap-3 hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-none">
          <div className="p-5 space-y-12">
            
            {/* Patient Information Section */}
            <div className="space-y-6">
              <h2 className="text-[16px] font-bold text-foreground tracking-wider">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Patient Full Name</label>
                  <input required placeholder="Enter patient's full name" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Age</label>
                  <input required type="number" placeholder="e.g. 45" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.patientAge} onChange={(e) => setFormData({...formData, patientAge: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Gender</label>
                  <CustomSelect 
                    value={formData.patientGender}
                    onChange={(val) => setFormData({...formData, patientGender: val})}
                    placeholder="Select Gender"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Contact Number</label>
                  <input required placeholder="+1 (000) 000-0000" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.patientContact} onChange={(e) => setFormData({...formData, patientContact: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Email Address (Optional)</label>
                  <input type="email" placeholder="patient@email.com" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.patientEmail} onChange={(e) => setFormData({...formData, patientEmail: e.target.value})} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Emergency Contact Name</label>
                  <input placeholder="Name of relative" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.emergencyContactName} onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Emergency Contact Phone</label>
                  <input placeholder="+1 (000) 000-0000" className="w-full h-[48px] px-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground" value={formData.emergencyContactPhone} onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Admission Details Section */}
            <div className="space-y-6">
              <h2 className="text-[16px] font-bold text-foreground tracking-wider">Admission Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Department</label>
                  <CustomSelect 
                    value={formData.departmentId}
                    onChange={handleDeptChange}
                    placeholder="e.g. ICU, General Ward, Cardiology"
                    options={departments.filter(d => d.active).map(d => ({ label: d.name, value: d.id }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Assigned Doctor</label>
                  <CustomSelect 
                    value={formData.doctorId}
                    onChange={(val) => setFormData({...formData, doctorId: val})}
                    placeholder="Select Doctor"
                    options={doctors.map(doc => ({ label: doc.name, value: doc.id }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-2">
                    <label className="text-[12px] font-bold text-muted-foreground ml-1">Admission Date & Time</label>
                    <FormDatePicker 
                      value={formData.admissionDate}
                      onChange={(date) => setFormData({...formData, admissionDate: date})}
                      placeholder="Select Date"
                      variant="muted"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-end">
                    <CustomTimePicker 
                      value={formData.admissionTime}
                      onChange={(time) => setFormData({...formData, admissionTime: time})}
                    />
                  </div>
                </div>

                {/* Ward and Bed - placed logically below as they are not in the screenshot but required */}
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Select Ward</label>
                  <CustomSelect 
                    value={formData.wardId}
                    onChange={handleWardChange}
                    placeholder="Select Ward"
                    options={wards.map(w => ({ label: w.name, value: w.id }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Available Bed</label>
                  <CustomSelect 
                    value={formData.bedId}
                    onChange={(val) => setFormData({...formData, bedId: val})}
                    placeholder="Select Bed"
                    options={beds.map(b => ({ label: b.label, value: b.id }))}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Reason for Admission & Notes</label>
                  <textarea placeholder="Enter diagnosis, symptoms, or special instructions here..." className="w-full min-h-[120px] p-4 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all shadow-none resize-none placeholder:text-muted-foreground" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-muted/30 border-t border-border flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.back()} className="h-[48px] px-8 bg-transparent border border-border rounded-lg text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all shadow-none">Cancel</button>
            <button type="submit" disabled={loading} className="h-[48px] px-10 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-none"><Check className="w-4 h-4" />{loading ? "Registering..." : "Finalize Admission"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
