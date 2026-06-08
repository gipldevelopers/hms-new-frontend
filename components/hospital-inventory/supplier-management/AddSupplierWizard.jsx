"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2PaymentInfo } from "./Step2PaymentInfo";
import { Step3Documents } from "./Step3Documents";
import { toast } from "sonner";

export function AddSupplierWizard({ onSave, onCancel }) {
  const [activeStep, setActiveStep] = useState(1);
  const [supplierData, setSupplierData] = useState({
    // Step 1
    name: "",
    category: "",
    supplierType: "",
    website: "",
    contactPerson: "",
    designation: "",
    phone1: "",
    phone2: "",
    gstNumber: "",
    address: "",
    // Step 2
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    branchName: "",
    paymentType: "",
    taxCategory: "",
    panNumber: "",
    // Step 3
    gst: { name: "gst registration Certificate.pdf", size: "2.4 MB", uploaded: true },
    pan: { name: "Pan Card Copy.pdf", size: "1.1 MB", uploaded: true },
    drug: { name: "", size: "", uploaded: false },
    additional: []
  });

  const handleStepChange = (stepData) => {
    setSupplierData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = (stepData) => {
    const updated = { ...supplierData, ...stepData };
    setSupplierData(updated);
    setActiveStep((prev) => prev + 1);
    toast.success("Progress saved. Proceeding to next step!");
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = (stepData) => {
    const finalData = { ...supplierData, ...stepData };
    setSupplierData(finalData);

    toast.success("Supplier profile created successfully!");
    if (onSave) {
      onSave({
        id: Date.now(),
        name: finalData.name,
        sku: `SUP-2026-${Math.floor(100 + Math.random() * 900)}`,
        category: finalData.category || "Pharmaceuticals",
        contact: finalData.contactPerson,
        phone: finalData.phone1,
        lastOrder: "N/A",
        rating: 5,
        status: "Active",
        email: finalData.website || "N/A",
        address: finalData.address || "N/A"
      });
    }
  };

  const steps = [
    { num: 1, title: "Basic Information", desc: "Please enter the patient's primary details." },
    { num: 2, title: "Payment Information", desc: "Please enter Payment details." },
    { num: 3, title: "Documents", desc: "Upload Required Documents" }
  ];

  const currentStepInfo = steps.find(s => s.num === activeStep);

  return (
    <div className="space-y-[20px] font-sans">
      
      {/* Page Plain Title */}
      <div className="pt-2">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Add Supplier
        </h1>
      </div>

      {/* Grid Layout matching your visual specs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Multi-step Sidebar indicator card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] min-h-[300px]">
          <h2 className="text-[14px] font-bold text-slate-800 dark:text-white mb-6">
            Add Supplier Steps
          </h2>
          <div className="space-y-6">
            {steps.map((step) => {
              const isCompleted = activeStep > step.num;
              const isActive = activeStep === step.num;

              return (
                <div key={step.num} className="flex items-center gap-3.5 group">
                  {/* Step bubble */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border transition-all shrink-0",
                      isCompleted
                        ? "bg-[#2E37A4] border-[#2E37A4] text-white"
                        : isActive
                        ? "border-[#2E37A4] text-[#2E37A4] font-black ring-2 ring-[#2E37A4]/15"
                        : "border-[#e2e8f0] text-slate-400 dark:border-slate-700"
                    )}
                  >
                    {isCompleted ? <Check size={14} className="stroke-[3]" /> : step.num}
                  </div>
                  
                  {/* Step Text Label */}
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-[13px] font-bold transition-all",
                        isActive
                          ? "text-[#2E37A4] dark:text-white"
                          : isCompleted
                          ? "text-slate-750 dark:text-slate-350"
                          : "text-slate-400"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step Form box */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Form Header details inside a clean standalone card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4">
            
            <div>
              <h2 className="text-[18px] font-bold text-slate-800 dark:text-white leading-none">
                {activeStep === 3 ? "Document" : currentStepInfo?.title}
              </h2>
              <p className="text-[12px] text-slate-400 mt-2 font-medium leading-none">
                {currentStepInfo?.desc}
              </p>
            </div>

            <div className="border-t border-[#e2e8f0] dark:border-[#334155] pt-4">
              {activeStep === 1 && (
                <Step1BasicInfo
                  data={supplierData}
                  onChange={handleStepChange}
                  onNext={handleNext}
                  onCancel={onCancel}
                />
              )}

              {activeStep === 2 && (
                <Step2PaymentInfo
                  data={supplierData}
                  onChange={handleStepChange}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {activeStep === 3 && (
                <Step3Documents
                  data={supplierData}
                  onChange={handleStepChange}
                  onComplete={handleComplete}
                  onBack={handleBack}
                />
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
export default AddSupplierWizard;
