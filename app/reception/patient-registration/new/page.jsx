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
import { FormDatePicker } from "@/components/ui/form-date-picker";
export { FormDatePicker };

// --- SIMPLIFIED COMPONENTS ---

export function FormInput({ label, required, error, ...props }) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {error && <span className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
        </label>
      )}
      <input
        {...props}
        className={cn(
          "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none placeholder:text-muted-foreground/60",
          error ? "border-red-500 focus:border-red-600 bg-red-50/50" : "border-border focus:border-primary"
        )}
      />
    </div>
  );
}

export function FormSelect({ label, required, value, onChange, options, placeholder, error }) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {error && <span className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all flex items-center justify-between shadow-none text-left",
            error ? "border-red-500 focus:border-red-600 bg-red-50/50" : "border-border focus:border-primary"
          )}>
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


export function SuccessModal({ isOpen, onClose, uhid }) {
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
    firstName: "",
    lastName: "",
    gender: "",
    dob: null,
    age: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    maritalStatus: "",
    bloodGroup: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    aadhaar: "",
    pan: "",
    passport: "",
    idProofUrl: "",
    status: "Draft"
  });
  const [draftId, setDraftId] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [registeredUhid, setRegisteredUhid] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const updateForm = (key, value) => {
    setErrors(prev => ({ ...prev, [key]: "" }));
    
    // Auto-formatting for specific fields
    let formattedValue = value;
    if (key === "pan") {
      formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 10);
    }
    if (key === "passport") {
      formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 8);
    }
    if (key === "aadhaar") {
      formattedValue = value.replace(/\D/g, "").substring(0, 12);
    }
    if (key === "mobile") {
      formattedValue = value.replace(/\D/g, "").substring(0, 10);
    }
    if (key === "pincode") {
      formattedValue = value.replace(/\D/g, "").substring(0, 6);
    }

    setFormData((prev) => {
      const newData = { ...prev, [key]: formattedValue };
      localStorage.setItem("patient_registration_draft_data", JSON.stringify(newData));
      return newData;
    });
  };

  React.useEffect(() => {
    const savedDraftId = localStorage.getItem("active_patient_draft_id");
    if (savedDraftId) {
      setDraftId(savedDraftId);
      const fetchDraft = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${savedDraftId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const result = await response.json();
            setFormData({
              firstName: result.firstName || "",
              lastName: result.lastName || "",
              gender: result.gender || "",
              dob: result.dob ? new Date(result.dob) : null,
              age: result.age?.toString() || "",
              mobile: result.contact || "",
              alternateMobile: result.alternateMobile || "",
              email: result.email || "",
              maritalStatus: result.maritalStatus || "",
              bloodGroup: result.bloodGroup || "",
              address: result.address || "",
              city: result.city || "",
              state: result.state || "",
              pincode: result.pincode || "",
              country: result.country || "",
              aadhaar: result.aadhaar || "",
              pan: result.pan || "",
              passport: result.passport || "",
              idProofUrl: result.idProofUrl || "",
              status: "Draft"
            });
          }
        } catch (error) {
          console.error("Error fetching draft:", error);
        }
      };
      fetchDraft();
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        if (result.status) {
          const fileUrl = result.data.url;
          updateForm("idProofUrl", fileUrl);
          // Auto-save draft with the new URL immediately
          handleSaveDraft(true, { ...formData, idProofUrl: fileUrl }); 
        } else {
          alert(result.message || "Upload failed");
        }
      } else {
        alert("Upload failed");
      }
      setUploading(false);
    });

    xhr.addEventListener("error", () => {
      alert("Error uploading file");
      setUploading(false);
    });

    xhr.open("POST", "/api/gvoice/file");
    xhr.send(formDataUpload);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Invalid mobile number (10 digits)";
      if (!formData.gender) newErrors.gender = "Gender is required";
    } else if (step === 2) {
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode (6 digits)";
    } else if (step === 3) {
      if (formData.aadhaar && !/^[2-9]{1}[0-9]{11}$/.test(formData.aadhaar)) {
        newErrors.aadhaar = "Invalid Aadhaar (12 digits, cannot start with 0 or 1)";
      }
      if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
        newErrors.pan = "Invalid PAN format (e.g. ABCDE1234F)";
      }
      if (formData.passport && !/^[A-Z]{1}[0-9]{7}$/.test(formData.passport)) {
        newErrors.passport = "Invalid Passport (1 alphabet followed by 7 digits)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async (silent = false, overrideData = null) => {
    try {
      if (!silent) setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const branchId = user?.branchId;

      console.log("Saving draft. Branch ID:", branchId, "User:", user);

      if (!branchId) {
        console.warn("Save draft aborted: No branchId found for user.");
        if (!silent) alert("Your session is missing branch information. Please log out and log in again.");
        else console.error("Critical: Session missing branchId during silent save.");
        return false;
      }

      const url = draftId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/patients/${draftId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/patients`;
      
      const dataToSave = overrideData || formData;
      
      const response = await fetch(url, {
        method: draftId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...dataToSave,
          branchId: branchId,
          contact: dataToSave.mobile,
          status: "Draft"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!draftId) {
          setDraftId(data.id);
          localStorage.setItem("active_patient_draft_id", data.id);
        }
        return true;
      } else {
        let errData = {};
        const responseText = await response.text();
        console.log("Raw server response:", responseText); // CRITICAL DEBUG LOG
        
        try {
          errData = JSON.parse(responseText);
        } catch (e) {
          errData = { error: "Unknown server error", raw: responseText };
        }
        console.error("Save draft failed:", response.status, errData);
        if (!silent) alert(errData.error || errData.message || "Failed to save draft. Check console for details.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!silent) alert("Error connecting to server: " + error.message);
    } finally {
      if (!silent) setIsSubmitting(false);
    }
    return false;
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const branchId = user?.branchId;

      console.log("Confirming registration. Branch ID:", branchId);

      if (!branchId) {
        alert("Your session is missing branch information. Please log out and log in again.");
        setIsSubmitting(false);
        return;
      }

      const url = draftId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/patients/${draftId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/patients`;

      const response = await fetch(url, {
        method: draftId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          branchId: branchId,
          contact: formData.mobile,
          status: "Complete"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegisteredUhid(`#${data.id.substring(0, 5).toUpperCase()}`);
        setShowSuccessModal(true);
        localStorage.removeItem("active_patient_draft_id");
        localStorage.removeItem("patient_registration_draft_data");
      } else {
        let errData = {};
        const responseText = await response.text();
        try {
          errData = JSON.parse(responseText);
        } catch (e) {
          errData = { error: "Unknown server error", raw: responseText };
        }
        console.error("Registration failed:", response.status, errData);
        alert(errData.error || errData.message || "Failed to register patient");
      }
    } catch (error) {
      console.error("Error registering patient:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
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

        <div className="bg-card border border-border rounded-[5px] flex flex-col min-h-[600px] overflow-hidden">
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
          </div>

          <div className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    required
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                  <FormInput
                    label="Last Name"
                    required
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    label="Gender"
                    required
                    error={errors.gender}
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
                    error={errors.dob}
                    placeholder="DD/MM/YYYY"
                    value={formData.dob}
                    onChange={(date) => updateForm("dob", date)}
                  />
                  <FormInput 
                    label="Age" 
                    placeholder="Years" 
                    value={formData.age}
                    onChange={(e) => updateForm("age", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Mobile Number"
                    required
                    maxLength={10}
                    error={errors.mobile}
                    placeholder="+91 99999-99999"
                    value={formData.mobile}
                    onChange={(e) => updateForm("mobile", e.target.value)}
                  />
                  <FormInput
                    label="Alternate Number"
                    placeholder="+91 99999-99999"
                    value={formData.alternateMobile}
                    onChange={(e) => updateForm("alternateMobile", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <FormInput
                      label="Email Address"
                      placeholder="patient@example.com"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
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
                      { label: "A+", value: "A+" },
                      { label: "A-", value: "A-" },
                      { label: "B+", value: "B+" },
                      { label: "B-", value: "B-" },
                      { label: "AB+", value: "AB+" },
                      { label: "AB-", value: "AB-" },
                      { label: "O+", value: "O+" },
                      { label: "O-", value: "O-" },
                    ]}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <FormInput
                    label="Residential Address"
                    required
                    error={errors.address}
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="City" 
                    required 
                    error={errors.city}
                    placeholder="Enter city" 
                    value={formData.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                  />
                  <FormInput
                    label="State"
                    required
                    error={errors.state}
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Pincode / Zip Code"
                    required
                    maxLength={6}
                    placeholder="Enter pincode"
                    error={errors.pincode}
                    value={formData.pincode}
                    onChange={(e) => updateForm("pincode", e.target.value)}
                  />
                  <FormInput
                    label="Country"
                    required
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
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
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 h-10 border border-border bg-white rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : formData.idProofUrl ? "Change File" : "Browse Files"}
                  </button>

                  {uploading && (
                    <div className="w-full max-w-[300px] mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {formData.idProofUrl && !uploading && (
                    <p className="text-[11px] text-primary font-medium mt-2">
                      File uploaded: {formData.idProofUrl.split('/').pop()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Aadhaar Number"
                    placeholder="12-digit number"
                    maxLength={12}
                    error={errors.aadhaar}
                    value={formData.aadhaar}
                    onChange={(e) => updateForm("aadhaar", e.target.value)}
                  />
                  <FormInput 
                    label="PAN Number" 
                    placeholder="ABCDE1234F" 
                    maxLength={10}
                    error={errors.pan}
                    value={formData.pan}
                    onChange={(e) => updateForm("pan", e.target.value)}
                  />
                  <FormInput 
                    label="Passport Number" 
                    placeholder="A1234567" 
                    maxLength={8}
                    error={errors.passport}
                    value={formData.passport}
                    onChange={(e) => updateForm("passport", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
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
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Gender / Age
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        {formData.gender} / {formData.age} Years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Blood Group
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        {formData.bloodGroup}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Mobile Number
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        {formData.mobile}
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">
                        Email
                      </p>
                      <p className="text-[14px] font-bold text-foreground">
                        {formData.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-3">
                  <h3 className="text-[15px] font-bold text-foreground">
                    Address Details
                  </h3>
                  <p className="text-[14px] font-bold text-foreground leading-relaxed">
                    {formData.address}, {formData.city}, {formData.state}, {formData.pincode}, {formData.country}
                  </p>
                </div>
              </div>
            )}
          </div>

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
              <button 
                onClick={() => handleSaveDraft()}
                disabled={isSubmitting}
                className="px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={async () => {
                  if (currentStep < 4) {
                    if (!validateStep(currentStep)) return;
                    const saved = await handleSaveDraft(); // Don't be silent on manual click
                    if (saved) setCurrentStep(currentStep + 1);
                  } else {
                    if (!validateStep(4)) return;
                    handleConfirm();
                  }
                }}
                className={cn(
                  "px-6 h-11 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none flex items-center gap-2",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (currentStep === 4 ? "Confirm Registration" : "Save & Next")}
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
        uhid={registeredUhid}
      />
    </div>
  );
}
