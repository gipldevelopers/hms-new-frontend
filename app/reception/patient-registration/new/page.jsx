"use client";

import React from "react";
import { 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  UploadCloud, 
  Scan, 
  X, 
  MessageSquare, 
  Calendar,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// --- SIMPLIFIED COMPONENTS ---

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
                value === opt.value && "bg-primary/5 text-primary font-bold",
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

function FormDatePicker({ label, required, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[13px] font-bold text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all flex items-center gap-3 shadow-none text-left">
            <CalendarIcon className="w-4 h-4 text-primary/50" />
            <span className={cn(!value && "text-muted-foreground/60")}>
              {value ? format(new Date(value), "dd/MM/yyyy") : placeholder}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-0 border-none bg-transparent shadow-none z-[600]"
        >
          <CustomCalendar
            selectedDate={value ? new Date(value) : null}
            onSelect={(date) => onChange(date)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SuccessModal({ isOpen, onClose, uhid }) {
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
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[480px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-10 flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#00A389] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[20px] font-bold text-foreground">
              Registration Successful!
            </h2>
            <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
              Patient has been registered successfully. Generated UHID:
            </p>
          </div>

          {/* UHID Box */}
          <div className="w-full bg-[#F1F5F9] dark:bg-white/5 py-3 rounded-[5px] flex items-center justify-center">
            <span className="text-[16px] font-bold text-foreground tracking-wide">
              {uhid}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full pt-2">
            <button className="flex items-center justify-center gap-2 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
              <MessageSquare className="w-4 h-4" />
              Send SMS
            </button>
            <button className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    dob: null,
    state: "",
    country: "",
  });

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">
          New Patient Registration
        </h1>
        <button 
          onClick={() => router.push("/reception/patient-registration")}
          className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
        {/* Mobile Stepper - Only visible on small screens */}
        <div className="lg:hidden flex items-center justify-between bg-card border border-border rounded-[5px] p-3 overflow-x-auto gap-4 no-scrollbar">
          {[
            { id: 1, label: "Basic" },
            { id: 2, label: "Address" },
            { id: 3, label: "Identity" },
            { id: 4, label: "Review" },
          ].map((step) => (
            <div 
              key={step.id} 
              className="flex items-center gap-2 shrink-0"
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all",
                  currentStep === step.id
                    ? "bg-primary border-primary text-white"
                    : currentStep > step.id
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border text-muted-foreground",
                )}
              >
                {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
              </div>
              <span className={cn(
                "text-[12px] font-bold",
                currentStep === step.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
              {step.id < 4 && <div className="w-4 h-[1px] bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Left Sidebar - Steps (Desktop Only) */}
        <div className="hidden lg:block bg-card border border-border rounded-[5px] p-6 h-full min-h-[500px]">
          <h2 className="text-[14px] font-bold text-foreground mb-6">
            Registration Steps
          </h2>
          <div className="space-y-6">
            {[
              { id: 1, label: "Basic Info" },
              { id: 2, label: "Address" },
              { id: 3, label: "Identity" },
              { id: 4, label: "Review" },
            ].map((step) => (
              <div key={step.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-all",
                    currentStep === step.id
                      ? "bg-primary border-primary text-white"
                      : currentStep > step.id
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-border text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[14px] transition-all",
                    currentStep === step.id
                      ? "text-foreground font-bold"
                      : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="bg-card border border-border rounded-[5px] flex flex-col min-h-[600px] overflow-hidden">
          {/* Form Header */}
          <div className="p-6 flex items-center justify-between border-b border-border/60">
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-foreground leading-none">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Address Details"}
                {currentStep === 3 && "Identity Information"}
                {currentStep === 4 && "Final Review"}
              </h2>
              <p className="text-[13px] text-muted-foreground">
                {currentStep === 1 &&
                  "Please enter the patient's primary details."}
                {currentStep === 2 &&
                  "Please enter the patient's residential address."}
                {currentStep === 3 &&
                  "Provide valid identification documents."}
                {currentStep === 4 &&
                  "Please review the details before confirming registration."}
              </p>
            </div>
            {currentStep === 3 ? (
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
                <Scan className="w-4 h-4" />
                Scan Document
              </button>
            ) : (
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all">
                <Search className="w-3.5 h-3.5" />
                Find Existing
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    required
                    placeholder="Enter first name"
                  />
                  <FormInput
                    label="Last Name"
                    required
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    label="Gender"
                    required
                    placeholder="Select gender"
                    value={formData.gender}
                    onChange={(val) => updateForm("gender", val)}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                  />
                  <FormDatePicker
                    label="Date of Birth"
                    required
                    placeholder="DD/MM/YYYY"
                    value={formData.dob}
                    onChange={(date) => updateForm("dob", date)}
                  />
                  <FormInput label="Age" placeholder="Years" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Mobile Number"
                    required
                    placeholder="+1 (000) 000-0000"
                  />
                  <FormInput
                    label="Alternate Number"
                    placeholder="+1 (000) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <FormInput
                      label="Email Address"
                      placeholder="patient@example.com"
                    />
                  </div>
                  <FormSelect
                    label="Marital Status"
                    placeholder="Select"
                    value={formData.maritalStatus}
                    onChange={(val) => updateForm("maritalStatus", val)}
                    options={[
                      { label: "Single", value: "single" },
                      { label: "Married", value: "married" },
                    ]}
                  />
                  <FormSelect
                    label="Blood Group"
                    placeholder="Select"
                    value={formData.bloodGroup}
                    onChange={(val) => updateForm("bloodGroup", val)}
                    options={[
                      { label: "A+", value: "a+" },
                      { label: "B+", value: "b+" },
                      { label: "O+", value: "o+" },
                    ]}
                  />
                </div>

                {/* Duplicate Record Alert */}
                <div className="bg-[#FFF9F2] border border-[#FFE0BD] rounded-[5px] p-5 flex items-start gap-4">
                  <div className="bg-amber-500/10 p-2 rounded-full shrink-0">
                    <Search className="w-4 h-4 text-amber-600 rotate-12" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[14px] font-bold text-foreground leading-none">
                        Possible Duplicate Record
                      </p>
                      <p className="text-[13px] text-muted-foreground leading-normal">
                        A patient with this mobile number already exists in
                        the system.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 h-9 border border-border bg-white rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all">
                        Open Existing Profile
                      </button>
                      <button className="px-4 h-9 border border-border bg-white rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all">
                        Create Duplicate Anyway
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-end gap-2 text-[12px] font-medium text-foreground">
                  <div className="w-4 h-4 bg-primary rounded-[3px] flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  Same as Aadhaar
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full min-h-[100px] px-4 py-3 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none shadow-none placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="City" required placeholder="Enter city" />
                  <FormSelect
                    label="State"
                    required
                    placeholder="Select state"
                    value={formData.state}
                    onChange={(val) => updateForm("state", val)}
                    options={[
                      { label: "California", value: "ca" },
                      { label: "New York", value: "ny" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Pincode / Zip Code"
                    required
                    placeholder="Enter pincode"
                  />
                  <FormSelect
                    label="Country"
                    required
                    placeholder="Select country"
                    value={formData.country}
                    onChange={(val) => updateForm("country", val)}
                    options={[
                      { label: "United States", value: "us" },
                      { label: "India", value: "in" },
                    ]}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-[5px] p-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold text-foreground">
                      Upload ID Proof
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      Drag and drop or click to upload Aadhaar, PAN, or
                      Passport (Max 5MB)
                    </p>
                  </div>
                  <button className="px-6 h-10 border border-border bg-white rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
                    Browse Files
                  </button>
                </div>

                {/* ID Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-foreground">
                      Aadhaar Number
                    </label>
                    <div className="relative flex gap-2">
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-XXXX"
                        className="flex-1 h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] outline-none focus:border-primary transition-all shadow-none"
                      />
                      <button className="px-4 h-11 bg-primary/5 border border-primary/20 text-primary rounded-[5px] text-[12px] font-bold hover:bg-primary/10 transition-all shadow-none">
                        Verify
                      </button>
                    </div>
                  </div>
                  <FormInput label="PAN Number" placeholder="ABCDE1234F" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Passport Number" placeholder="A1234567" />
                </div>

                {/* Success Alert */}
                <div className="bg-[#E6F9F1] border border-[#B3F0D1] rounded-[5px] p-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 bg-[#00A389] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-[#00A389] leading-none">
                      Aadhaar verified successfully
                    </p>
                    <p className="text-[12px] text-[#00A389]/80">
                      Details have been auto-filled using OCR
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                {/* Patient Details Section */}
                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-6 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-foreground">
                      Patient Details
                    </h3>
                    <span className="px-2.5 py-1 bg-[#E6F9F1] text-[#00A389] rounded-[5px] text-[11px] font-bold">
                      Ready to Generate UHID
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Full Name
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        John Doe
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Gender / Age
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        Male / 45 Years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Blood Group
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        O+
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Mobile Number
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        +1 234-567-8901
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Email
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Details Section */}
                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-3">
                  <h3 className="text-[15px] font-bold text-foreground">
                    Address Details
                  </h3>
                  <p className="text-[14px] font-bold text-foreground leading-relaxed">
                    123 Main Street, Apt 4B, New York, NY, 10001, USA
                  </p>
                </div>

                {/* Identity Section */}
                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-6">
                  <h3 className="text-[15px] font-bold text-foreground">
                    Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Aadhaar Number
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold text-foreground">
                          XXXX-XXXX-1234
                        </p>
                        <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Passport Number
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold text-foreground">
                          XXXX-XXXX-1234
                        </p>
                        <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        PAN Number
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold text-foreground">
                          XXXX-XXXX-1234
                        </p>
                        <div className="w-4 h-4 bg-[#E6F9F1] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#00A389] stroke-[4]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto p-6 border-t border-border/60 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 1) setCurrentStep(currentStep - 1);
                else router.push("/reception/patient-registration");
              }}
              className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button className="px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
                Save Draft
              </button>
              <button
                onClick={() => {
                  if (currentStep < 4) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setShowSuccessModal(true);
                  }
                }}
                className="px-6 h-11 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
              >
                {currentStep === 4 ? "Confirm Registration" : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/reception/patient-registration");
        }}
        uhid="UHID-2023-089"
      />
    </div>
  );
}
