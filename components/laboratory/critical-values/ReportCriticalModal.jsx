"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, User, Stethoscope, FlaskConical, Beaker, FileText, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function ReportCriticalModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientName: "",
    uhid: "",
    bedLabel: "",
    attendingDoctor: "",
    testName: "",
    value: "",
    refRange: "",
    department: "Biochemistry",
    reportedBy: "Tech. John Doe",
    orderNo: ""
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      patientName: "",
      uhid: "",
      bedLabel: "",
      attendingDoctor: "",
      testName: "",
      value: "",
      refRange: "",
      department: "Biochemistry",
      reportedBy: "Tech. John Doe",
      orderNo: ""
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#090D1A]/40 backdrop-blur-[4px]"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-card w-full max-w-[650px] border border-border rounded-[5px] flex flex-col overflow-hidden shadow-none mx-4 z-10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-border select-none">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-[15px] font-bold text-foreground leading-none">
              Report Critical Lab Value
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-muted/10 rounded-[5px] text-muted-foreground hover:text-foreground border border-border cursor-pointer transition-colors shadow-none outline-none"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-[20px] flex flex-col gap-[15px] max-h-[70vh] overflow-y-auto">
            {/* Demographics section */}
            <div className="space-y-[10px]">
              <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                Patient & Bed Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <User size={13} className="text-muted-foreground/60" />
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <span className="text-[13px] text-muted-foreground/60 font-bold">#</span>
                    Patient UHID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="uhid"
                    required
                    value={formData.uhid}
                    onChange={handleChange}
                    placeholder="e.g., UHID-100293"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <span className="text-[13px] text-muted-foreground/60 font-bold">📍</span>
                    Bed Location / Ward <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bedLabel"
                    required
                    value={formData.bedLabel}
                    onChange={handleChange}
                    placeholder="e.g., ICU / Bed 8"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <Stethoscope size={13} className="text-muted-foreground/60" />
                    Attending Doctor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="attendingDoctor"
                    required
                    value={formData.attendingDoctor}
                    onChange={handleChange}
                    placeholder="e.g., Dr. Emily Chen"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Test Details section */}
            <div className="space-y-[10px]">
              <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                Lab Results & Findings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <FlaskConical size={13} className="text-muted-foreground/60" />
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="testName"
                    required
                    value={formData.testName}
                    onChange={handleChange}
                    placeholder="e.g., Potassium (K+)"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <Beaker size={13} className="text-muted-foreground/60" />
                    Critical Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="value"
                    required
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="e.g., 6.8 mEq/L"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <span className="text-[13px] text-muted-foreground/60 font-bold">📏</span>
                    Reference Range <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="refRange"
                    required
                    value={formData.refRange}
                    onChange={handleChange}
                    placeholder="e.g., 3.5 - 5.1 mEq/L"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <FlaskConical size={13} className="text-muted-foreground/60" />
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground outline-none focus:border-primary transition-all shadow-none cursor-pointer"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Pathology">Pathology</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <FileText size={13} className="text-muted-foreground/60" />
                    Order Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderNo"
                    required
                    value={formData.orderNo}
                    onChange={handleChange}
                    placeholder="e.g., ORD-2023-9041"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 select-none">
                    <User size={13} className="text-muted-foreground/60" />
                    Reported By (Tech) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reportedBy"
                    required
                    value={formData.reportedBy}
                    onChange={handleChange}
                    placeholder="e.g., Tech. John Doe"
                    className="w-full h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-[20px] border-t border-border bg-muted/5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-card border border-border text-foreground font-bold text-[12.5px] rounded-[5px] hover:bg-muted/10 transition-colors cursor-pointer shadow-none outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none flex items-center gap-1.5"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Report Value</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
