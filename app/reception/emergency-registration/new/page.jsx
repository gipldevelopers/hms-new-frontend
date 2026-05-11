"use client";

import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Ambulance,
  User,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Hotel,
  MessageSquare,
  Printer,
  X,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

function FormInput({ label, required, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[13px] font-bold text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        {...props}
        className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

function FormSelect({ label, required, value, onChange, options, placeholder }) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[13px] font-bold text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all flex items-center justify-between shadow-none text-left">
            <span className={cn(!selected && "text-muted-foreground/60")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] border-border z-[600] p-1 bg-card rounded-[5px] shadow-xl"
        >
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]",
                value === opt.value && "bg-primary/5 text-primary font-bold"
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SuccessModal({ isOpen, onClose }) {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[440px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[18px] font-bold text-[#1A1C23] dark:text-white">
              Registration Successful
            </h2>
            <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 max-w-[300px] mx-auto leading-relaxed">
              The patient has been successfully registered and admitted to the Emergency Ward.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none w-full">
              <Printer className="w-4 h-4" />
              Print Registration Slip
            </button>
            <button className="flex items-center justify-center gap-2 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-[#5E6C84] hover:bg-muted transition-all shadow-none w-full">
              <ArrowLeftRight className="w-4 h-4" />
              Transfer to Ward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickEmergencyRegistration() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    gender: "",
    arrivalMode: "Walk-In",
    priority: "Red",
  });

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/reception/emergency-registration")}
            className="w-10 h-10 flex items-center justify-center border border-border rounded-[5px] text-muted-foreground hover:bg-muted transition-all shadow-none shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-500/10 rounded-[5px] flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
             </div>
             <div>
                <h1 className="text-[18px] font-bold text-foreground leading-none">Quick Emergency Registration</h1>
                <p className="text-[12px] text-muted-foreground mt-1">Rapid intake form for emergency patients</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-8">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormInput label="Patient Name" required placeholder="Unknown / John Doe" />
          <FormInput label="Approx Age" required placeholder="e.g. 45" />
          <FormSelect 
            label="Gender" 
            required 
            placeholder="Select"
            value={formData.gender}
            onChange={(val) => updateForm("gender", val)}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <FormInput label="Mobile Number" placeholder="Optional" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          {/* Arrival Mode */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-foreground">Arrival Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { name: "Walk-In", icon: User },
                { name: "Ambulance", icon: Ambulance },
                { name: "Referral", icon: Building2 },
              ].map((mode) => (
                <div
                  key={mode.name}
                  onClick={() => updateForm("arrivalMode", mode.name)}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-[5px] cursor-pointer transition-all",
                    formData.arrivalMode === mode.name
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    formData.arrivalMode === mode.name ? "border-primary" : "border-border"
                  )}>
                    {formData.arrivalMode === mode.name && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <mode.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="text-[14px] font-bold text-foreground">{mode.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Details & Priority */}
          <div className="space-y-8">
             <FormInput label="Emergency Type" required placeholder="e.g. Cardiac Arrest, Severe Trauma" />
             
             <div className="space-y-4">
                <label className="text-[13px] font-bold text-foreground">Triage Priority <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Red - Critical */}
                  <div 
                    onClick={() => updateForm("priority", "Red")}
                    className={cn(
                      "relative p-6 border rounded-[5px] flex flex-col items-center text-center gap-3 cursor-pointer transition-all",
                      formData.priority === "Red" 
                        ? "bg-red-50 border-red-500 ring-1 ring-red-500" 
                        : "border-border hover:bg-red-50/30"
                    )}
                  >
                    {formData.priority === "Red" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[4]" />
                      </div>
                    )}
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-red-600 leading-none">Red</p>
                      <p className="text-[11px] text-red-600/70 mt-1">Critical / Life Threatening</p>
                    </div>
                  </div>

                  {/* Yellow - Urgent */}
                  <div 
                    onClick={() => updateForm("priority", "Yellow")}
                    className={cn(
                      "relative p-6 border rounded-[5px] flex flex-col items-center text-center gap-3 cursor-pointer transition-all",
                      formData.priority === "Yellow" 
                        ? "bg-amber-50 border-amber-500 ring-1 ring-amber-500" 
                        : "border-border hover:bg-amber-50/30"
                    )}
                  >
                    {formData.priority === "Yellow" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[4]" />
                      </div>
                    )}
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-amber-600 leading-none">Yellow</p>
                      <p className="text-[11px] text-amber-600/70 mt-1">Urgent</p>
                    </div>
                  </div>

                  {/* Green - Stable */}
                  <div 
                    onClick={() => updateForm("priority", "Green")}
                    className={cn(
                      "relative p-6 border rounded-[5px] flex flex-col items-center text-center gap-3 cursor-pointer transition-all",
                      formData.priority === "Green" 
                        ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500" 
                        : "border-border hover:bg-emerald-50/30"
                    )}
                  >
                    {formData.priority === "Green" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[4]" />
                      </div>
                    )}
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-emerald-600 leading-none">Green</p>
                      <p className="text-[11px] text-emerald-600/70 mt-1">Stable / Non-Urgent</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
          <button className="px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            Save Draft
          </button>
          <button 
            onClick={() => setShowSuccessModal(true)}
            className="px-6 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
          >
            Confirm Registration
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/reception/emergency-registration");
        }}
      />
    </div>
  );
}
