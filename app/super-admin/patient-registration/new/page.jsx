"use client";

import React from "react";
import {
  ChevronRight,
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  UploadCloud,
  X,
  Search,
  LayoutGrid,
  UserRound,
  Activity,
  CalendarDays,
  Wallet,
  FileText,
  Bell,
  BarChart3,
  Settings,
  MessageSquare,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormInput, FormSelect, FormDatePicker, SuccessModal } from "@/app/reception/patient-registration/new/page";

export default function SuperAdminNewRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [branches, setBranches] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  
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
  
  const [errors, setErrors] = React.useState({});
  const [registeredUhid, setRegisteredUhid] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [draftId, setDraftId] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setBranches(json.data);
          if (json.data.length > 0) {
            setSelectedBranch(json.data[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  React.useEffect(() => {
    fetchBranches();
  }, []);

  const updateForm = (key, value) => {
    setErrors(prev => ({ ...prev, [key]: "" }));
    
    // Auto-formatting for specific fields
    let formattedValue = value;
    if (key === "pan") {
      formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 10);
    } else if (key === "passport") {
      formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 8);
    } else if (key === "aadhaar") {
      formattedValue = value.replace(/\D/g, "").substring(0, 12);
    } else if (key === "mobile") {
      formattedValue = value.replace(/\D/g, "").substring(0, 10);
    } else if (key === "pincode") {
      formattedValue = value.replace(/\D/g, "").substring(0, 6);
    }

    setFormData((prev) => ({ ...prev, [key]: formattedValue }));
  };

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
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Invalid mobile (10 digits)";
      if (!formData.gender) newErrors.gender = "Gender is required";
    } else if (step === 2) {
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode (6 digits)";
    } else if (step === 3) {
      if (formData.aadhaar && !/^[2-9]{1}[0-9]{11}$/.test(formData.aadhaar)) {
        newErrors.aadhaar = "Invalid Aadhaar (12 digits, starts 2-9)";
      }
      if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
        newErrors.pan = "Invalid PAN (e.g. ABCDE1234F)";
      }
      if (formData.passport && !/^[A-Z]{1}[0-9]{7}$/.test(formData.passport)) {
        newErrors.passport = "Invalid Passport (A0000000)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async (silent = false, overrideData = null) => {
    if (!selectedBranch) {
      if (!silent) alert("Please select a branch first");
      return false;
    }
    try {
      if (!silent) setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
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
          branchId: selectedBranch.id,
          contact: dataToSave.mobile,
          status: "Draft"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!draftId) setDraftId(data.id);
        return true;
      } else {
        const err = await response.json();
        console.error("Save draft failed:", err);
        if (!silent) alert(err.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      if (!silent) setIsSubmitting(false);
    }
    return false;
  };

  const handleConfirm = async () => {
    if (!selectedBranch) {
        alert("Please select a branch first");
        return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
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
          branchId: selectedBranch.id,
          contact: formData.mobile,
          status: "Complete"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegisteredUhid(`#${data.id.substring(0, 5).toUpperCase()}`);
        setShowSuccessModal(true);
      } else {
        const err = await response.json();
        alert(err.error || "Failed to register patient");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">
          New Patient Registration (Super Admin)
        </h1>
        <button 
          onClick={() => router.push("/super-admin/patient-registration")}
          className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
        <div className="bg-card border border-border rounded-[5px] p-6 h-full min-h-[500px]">
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
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={cn(
                  "text-[14px] transition-all",
                  currentStep === step.id ? "text-foreground font-bold" : "text-muted-foreground"
                )}>
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
                {currentStep === 1 && "Please enter the patient's primary details."}
                {currentStep === 2 && "Please enter the patient's residential address."}
                {currentStep === 3 && "Provide valid identification documents."}
                {currentStep === 4 && "Please review the details before confirming registration."}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-muted-foreground">Branch:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 px-4 bg-background border border-border rounded-[5px] text-[12px] font-bold text-foreground flex items-center gap-2 outline-none focus:border-primary transition-all">
                    <Building2 className="w-4 h-4 text-primary" />
                    {selectedBranch ? selectedBranch.name : "Select Branch"}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] border-border p-1">
                  {branches.map((branch) => (
                    <DropdownMenuItem
                      key={branch.id}
                      onClick={() => setSelectedBranch(branch)}
                      className={cn(
                        "text-[12px] font-medium h-9 px-3 cursor-pointer rounded-[3px]",
                        selectedBranch?.id === branch.id && "bg-primary/5 text-primary font-bold"
                      )}
                    >
                      {branch.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    required
                    error={errors.firstName}
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                  <FormInput
                    label="Last Name"
                    required
                    error={errors.lastName}
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Gender"
                    required
                    error={errors.gender}
                    placeholder="Select"
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
                    value={formData.dob}
                    onChange={(date) => updateForm("dob", date)}
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
                    label="Email Address"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
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
                  <FormInput label="City" required error={errors.city} placeholder="Enter city" value={formData.city} onChange={(e) => updateForm("city", e.target.value)} />
                  <FormInput label="State" required error={errors.state} placeholder="Enter state" value={formData.state} onChange={(e) => updateForm("state", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Pincode" required maxLength={6} error={errors.pincode} placeholder="Enter pincode" value={formData.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
                  <FormInput label="Country" required error={errors.country} placeholder="Enter country" value={formData.country} onChange={(e) => updateForm("country", e.target.value)} />
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
                    <p className="text-[14px] font-bold text-foreground">Upload ID Proof</p>
                    <p className="text-[12px] text-muted-foreground">Aadhaar, PAN, or Passport (Max 5MB)</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-6 h-10 border border-border bg-white rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none disabled:opacity-50">
                    {uploading ? "Uploading..." : formData.idProofUrl ? "Change File" : "Browse Files"}
                  </button>
                  {uploading && (
                    <div className="w-full max-w-[300px] mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                  {formData.idProofUrl && !uploading && (
                    <p className="text-[11px] text-primary font-medium mt-2">File uploaded: {formData.idProofUrl.split('/').pop()}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Aadhaar" maxLength={12} error={errors.aadhaar} value={formData.aadhaar} onChange={(e) => updateForm("aadhaar", e.target.value)} />
                  <FormInput label="PAN" maxLength={10} error={errors.pan} value={formData.pan} onChange={(e) => updateForm("pan", e.target.value)} />
                  <FormInput label="Passport" maxLength={8} error={errors.passport} value={formData.passport} onChange={(e) => updateForm("passport", e.target.value)} />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-6 relative">
                  <h3 className="text-[15px] font-bold text-foreground">Patient Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">Full Name</p>
                      <p className="text-[14px] font-bold text-foreground">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">Gender / Age</p>
                      <p className="text-[14px] font-bold text-foreground">{formData.gender} / {formData.age} Years</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] text-muted-foreground font-medium">Mobile</p>
                      <p className="text-[14px] font-bold text-foreground">{formData.mobile}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-6 space-y-3">
                  <h3 className="text-[15px] font-bold text-foreground">Address</h3>
                  <p className="text-[14px] font-bold text-foreground">{formData.address}, {formData.city}, {formData.state}, {formData.pincode}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto p-6 border-t border-border/60 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 1) setCurrentStep(currentStep - 1);
                else router.push("/super-admin/patient-registration");
              }}
              className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => handleSaveDraft()} disabled={isSubmitting} className="px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none disabled:opacity-50">
                Save Draft
              </button>
              <button
                onClick={async () => {
                  if (currentStep < 4) {
                    if (!validateStep(currentStep)) return;
                    const saved = await handleSaveDraft(true);
                    if (saved) setCurrentStep(currentStep + 1);
                  } else {
                    handleConfirm();
                  }
                }}
                disabled={isSubmitting}
                className="px-8 h-11 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : currentStep === 4 ? "Complete Registration" : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); router.push("/super-admin/patient-registration"); }} uhid={registeredUhid} />
    </div>
  );
}
