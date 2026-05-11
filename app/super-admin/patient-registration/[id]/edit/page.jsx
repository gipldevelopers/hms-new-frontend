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
import { useRouter, useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormInput, FormSelect, FormDatePicker, SuccessModal } from "@/app/reception/patient-registration/new/page";

export default function SuperAdminEditRegistration() {
  const router = useRouter();
  const { id } = useParams();
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
        if (json.success) setBranches(json.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
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
        
        // Find and set the branch
        if (result.branchId) {
            // We might need to wait for branches to load or find it later
            // For now, let's just store the ID and match it when branches are available
            setPatientBranchId(result.branchId);
        }
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };

  const [patientBranchId, setPatientBranchId] = React.useState(null);

  React.useEffect(() => {
    fetchBranches();
    if (id) fetchPatient();
  }, [id]);

  React.useEffect(() => {
    if (branches.length > 0 && patientBranchId) {
        const branch = branches.find(b => b.id === patientBranchId);
        if (branch) setSelectedBranch(branch);
    }
  }, [branches, patientBranchId]);

  const updateForm = (key, value) => {
    setErrors(prev => ({ ...prev, [key]: "" }));
    
    let formattedValue = value;
    if (key === "pan") formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 10);
    else if (key === "passport") formattedValue = value.toUpperCase().replace(/\s/g, "").substring(0, 8);
    else if (key === "aadhaar") formattedValue = value.replace(/\D/g, "").substring(0, 12);
    else if (key === "mobile") formattedValue = value.replace(/\D/g, "").substring(0, 10);
    else if (key === "pincode") formattedValue = value.replace(/\D/g, "").substring(0, 6);

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
          handleSaveDraft(true, { ...formData, idProofUrl: fileUrl }); 
        }
      }
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
    } else if (step === 2) {
      if (!formData.address) newErrors.address = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async (silent = false, overrideData = null) => {
    if (!selectedBranch) {
        if (!silent) alert("Please select a branch");
        return false;
    }
    try {
      if (!silent) setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const dataToSave = overrideData || formData;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
        method: "PATCH",
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

      if (response.ok) return true;
      else {
        let errData = {};
        try { errData = await response.json(); } catch (e) { errData = { error: "Unknown server error" }; }
        console.error("Save draft failed:", errData);
        if (!silent) alert(errData.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      if (!silent) setIsSubmitting(false);
    }
    return false;
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
        method: "PATCH",
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
      if (response.ok) setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">Edit Registration (Super Admin)</h1>
        <button onClick={() => router.push("/super-admin/patient-registration")} className="flex items-center gap-2 px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
        <div className="bg-card border border-border rounded-[5px] p-6 h-full min-h-[500px]">
          <h2 className="text-[14px] font-bold text-foreground mb-6">Steps</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentStep(s)}>
                    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-all", currentStep >= s ? "bg-primary border-primary text-white" : "bg-white border-border text-muted-foreground")}>
                        {currentStep > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    <span className={cn("text-[14px]", currentStep === s ? "text-foreground font-bold" : "text-muted-foreground")}>Step {s}</span>
                </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-[5px] flex flex-col min-h-[600px]">
          <div className="p-6 flex items-center justify-between border-b border-border/60">
            <h2 className="text-[18px] font-bold text-foreground">Step {currentStep}</h2>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-muted-foreground">Branch:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 px-4 bg-background border border-border rounded-[5px] text-[12px] font-bold text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    {selectedBranch ? selectedBranch.name : "Select Branch"}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] border-border p-1">
                  {branches.map(b => (
                    <DropdownMenuItem key={b.id} onClick={() => setSelectedBranch(b)} className={cn("text-[12px] h-9 px-3 rounded-[3px]", selectedBranch?.id === b.id && "bg-primary/5 text-primary font-bold")}>
                      {b.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-6">
                    <FormInput label="First Name" required error={errors.firstName} value={formData.firstName} onChange={e => updateForm("firstName", e.target.value)} />
                    <FormInput label="Last Name" required error={errors.lastName} value={formData.lastName} onChange={e => updateForm("lastName", e.target.value)} />
                    <FormSelect label="Gender" required error={errors.gender} value={formData.gender} onChange={v => updateForm("gender", v)} options={[{label: "Male", value: "male"}, {label: "Female", value: "female"}]} />
                    <FormInput label="Mobile" required error={errors.mobile} value={formData.mobile} onChange={e => updateForm("mobile", e.target.value)} />
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-6">
                    <FormInput label="Address" required error={errors.address} value={formData.address} onChange={e => updateForm("address", e.target.value)} />
                    <div className="grid grid-cols-2 gap-6">
                        <FormInput label="City" value={formData.city} onChange={e => updateForm("city", e.target.value)} />
                        <FormInput label="Pincode" value={formData.pincode} onChange={e => updateForm("pincode", e.target.value)} />
                    </div>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-border rounded-[5px] p-10 flex flex-col items-center gap-4">
                        <UploadCloud className="w-10 h-10 text-primary" />
                        <button onClick={() => fileInputRef.current?.click()} className="px-6 h-10 border border-border rounded-[5px] text-[12px] font-bold">Browse Files</button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        {uploading && <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width:`${uploadProgress}%`}}/></div>}
                        {formData.idProofUrl && <p className="text-[11px] text-primary">File uploaded: {formData.idProofUrl.split('/').pop()}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <FormInput label="Aadhaar" maxLength={12} value={formData.aadhaar} onChange={e => updateForm("aadhaar", e.target.value)} />
                        <FormInput label="PAN" maxLength={10} value={formData.pan} onChange={e => updateForm("pan", e.target.value)} />
                        <FormInput label="Passport" maxLength={8} value={formData.passport} onChange={e => updateForm("passport", e.target.value)} />
                    </div>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-6">
                    <div className="bg-muted/30 p-6 rounded-[5px] space-y-4">
                        <h3 className="font-bold">Patient Details</h3>
                        <p>{formData.firstName} {formData.lastName} ({formData.gender})</p>
                        <p>{formData.mobile}</p>
                    </div>
                </div>
            )}
          </div>

          <div className="mt-auto p-6 border-t border-border/60 flex items-center justify-between">
            <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} className="px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold">Back</button>
            <div className="flex gap-3">
                <button onClick={() => handleSaveDraft()} disabled={isSubmitting} className="px-6 h-11 border border-border rounded-[5px] text-[13px] font-bold">Save Draft</button>
                <button onClick={() => currentStep === 4 ? handleConfirm() : (validateStep(currentStep) && setCurrentStep(currentStep + 1))} disabled={isSubmitting} className="px-8 h-11 bg-primary text-white rounded-[5px] text-[13px] font-bold">
                    {currentStep === 4 ? "Complete" : "Save & Next"}
                </button>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); router.push("/super-admin/patient-registration"); }} uhid={`UHID-${id.substring(0,5)}`} />
    </div>
  );
}
