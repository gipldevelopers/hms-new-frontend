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
import { useRouter, useParams } from "next/navigation";
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
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

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

export default function EditAdmissionPage() {
  const router = useRouter();
  const params = useParams();
  const admissionId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    status: "Pending",
    reason: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };
      
      const infraRes = await fetch("/api/wards/overview", { headers });
      const infraData = await infraRes.json();
      setDepartments(Array.isArray(infraData) ? infraData : []);

      const userRes = await fetch("/api/users?role=DOCTOR", { headers });
      const userData = await userRes.json();
      if (userData.success) setDoctors(userData.data);

      const res = await fetch(`/api/admissions/overview?id=${admissionId}`, { headers });
      const data = await res.json();
      const record = Array.isArray(data) ? data.find(r => r.id === admissionId) : data;
      
      if (record) {
        const dateObj = new Date(record.admissionDate);
        setFormData({
          patientName: record.patient?.name || "",
          patientAge: record.patient?.age || "",
          patientGender: record.patient?.gender || "",
          patientContact: record.patient?.contact || "",
          patientEmail: record.patient?.email || "",
          emergencyContactName: record.patient?.emergencyContactName || "",
          emergencyContactPhone: record.patient?.emergencyContactPhone || "",
          departmentId: record.departmentId,
          wardId: record.wardId,
          bedId: record.bedId,
          doctorId: record.doctorId || "",
          admissionDate: dateObj,
          admissionTime: format(dateObj, "hh:mm a"),
          status: record.status,
          reason: record.reason || "",
        });

        const dept = (Array.isArray(infraData) ? infraData : []).find(d => d.id === record.departmentId);
        if (dept) {
          setWards(dept.wards);
          const ward = dept.wards.find(w => w.id === record.wardId);
          if (ward) setBeds(ward.beds.filter(b => b.status === 'AVAILABLE' || b.id === record.bedId));
        }
      }
    } catch (e) {
      toast.error("Failed to load clinical data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeptChange = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    setFormData(prev => ({ ...prev, departmentId: deptId, wardId: "", bedId: "" }));
    setWards(dept ? dept.wards : []);
    setBeds([]);
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

      const res = await fetch(`/api/admissions/${admissionId}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, admissionDate: combinedDateTime.toISOString() })
      });

      if (res.ok) {
        toast.success("Record updated successfully");
        router.push("/staff/admissions");
      } else {
        const data = await res.json();
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${admissionId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Admission record purged");
        router.push("/staff/admissions");
      } else {
        const data = await res.json();
        toast.error(data.error || "Purge failed");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) return <div className="p-6 text-center text-muted-foreground font-bold py-40">Loading patient record...</div>;

  return (
    <div className="p-6 bg-background min-h-screen flex flex-col font-sans gap-5">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">Edit Clinical Admission</h1>
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

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground ml-1">Admission Status</label>
                  <CustomSelect 
                    value={formData.status}
                    onChange={(val) => setFormData({...formData, status: val})}
                    placeholder="Select Status"
                    options={[
                      { label: "Pending", value: "Pending" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "Completed", value: "Completed" },
                    ]}
                  />
                </div>

                {/* Ward and Bed - kept for functionality */}
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
          <div className="p-6 bg-muted/30 border-t border-border flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-[12px] font-bold text-destructive hover:text-destructive/90 transition-colors tracking-wider"
            >
              <Trash2 className="w-4 h-4" />
              Delete Record
            </button>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => router.back()} className="h-[48px] px-8 bg-transparent border border-border rounded-lg text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all shadow-none">Cancel</button>
              <button type="submit" disabled={loading} className="h-[48px] px-10 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-none"><Check className="w-4 h-4" />{loading ? "Updating..." : "Update Record"}</button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-none border border-border"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-[18px] font-bold text-foreground mb-2">Delete Admission Record?</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
                  Are you sure you want to delete this clinical record? <span className="font-bold text-foreground">This action cannot be undone.</span>
                </p>
              </div>

              <div className="flex border-t border-border">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 text-[13px] font-bold text-muted-foreground hover:bg-muted transition-colors border-r border-border"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 text-[13px] font-bold text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
