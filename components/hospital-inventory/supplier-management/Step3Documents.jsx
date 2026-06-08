"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Eye, Trash2, Upload, FileText, CheckCircle2, X, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Step3Documents({ data, onChange, onComplete, onBack }) {
  const [docs, setDocs] = useState({
    gst: data.gst || { name: "gst registration Certificate.pdf", size: "2.4 MB", uploaded: true, fileObj: null },
    pan: data.pan || { name: "Pan Card Copy.pdf", size: "1.1 MB", uploaded: true, fileObj: null },
    drug: data.drug || { name: "", size: "", uploaded: false, fileObj: null },
    additional: data.additional || []
  });

  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFileType, setPreviewFileType] = useState("");

  const gstInputRef = useRef(null);
  const panInputRef = useRef(null);
  const drugInputRef = useRef(null);
  const additionalInputRef = useRef(null);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateDocsState = (updated) => {
    setDocs(updated);
    if (onChange) onChange(updated);
  };

  const handleFileUpload = (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const updated = {
        ...docs,
        [type]: { name: file.name, size: sizeStr, uploaded: true, fileObj: file }
      };
      updateDocsState(updated);
      toast.success(`${file.name} uploaded successfully!`);
    }
  };

  const handleDelete = (type) => {
    const updated = {
      ...docs,
      [type]: { name: "", size: "", uploaded: false, fileObj: null }
    };
    updateDocsState(updated);
    toast.info(`Removed document reference.`);
  };

  const handleAdditionalUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const updated = {
        ...docs,
        additional: [...docs.additional, { name: file.name, size: sizeStr, type: "additional", fileObj: file }]
      };
      updateDocsState(updated);
      toast.success(`${file.name} added to additional documents!`);
    }
  };

  const handleRemoveAdditional = (index) => {
    const list = [...docs.additional];
    list.splice(index, 1);
    updateDocsState({ ...docs, additional: list });
    toast.info("Removed additional document.");
  };

  const triggerPreview = (doc, type) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (doc.fileObj) {
      try {
        const url = URL.createObjectURL(doc.fileObj);
        setPreviewUrl(url);
        setPreviewFileType(doc.fileObj.type);
      } catch (err) {
        console.error("Error creating Object URL", err);
        setPreviewUrl(null);
        setPreviewFileType("");
      }
    } else {
      setPreviewUrl(null);
      setPreviewFileType("");
    }
    setPreviewFile({ ...doc, type });
  };

  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPreviewFileType("");
    setPreviewFile(null);
  };

  // Calculate uploaded count
  const uploadedCount = [docs.gst.uploaded, docs.pan.uploaded, docs.drug.uploaded].filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docs.gst.uploaded || !docs.pan.uploaded || !docs.drug.uploaded) {
      toast.error("Please upload all required documents to proceed.");
      return;
    }
    if (onComplete) onComplete(docs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      
      {/* Hidden File Inputs */}
      <input type="file" ref={gstInputRef} onChange={(e) => handleFileUpload("gst", e)} className="hidden" />
      <input type="file" ref={panInputRef} onChange={(e) => handleFileUpload("pan", e)} className="hidden" />
      <input type="file" ref={drugInputRef} onChange={(e) => handleFileUpload("drug", e)} className="hidden" />
      <input type="file" ref={additionalInputRef} onChange={handleAdditionalUpload} className="hidden" />

      {/* Required Documents Header & List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Required Documents
          </h3>
          <span className="text-[12px] font-bold text-[#2E37A4] bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-full">
            {uploadedCount} of 3 uploaded
          </span>
        </div>

        <div className="space-y-3">
          
          {/* 1. GST Registration Certificate */}
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center text-[#2E37A4]">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-extrabold text-slate-850 dark:text-white">
                    GST Registration Certificate
                  </span>
                  <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E2FBE9] border border-[#B7F4C7] text-[#0F8A5F]">
                    Required
                  </span>
                </div>
                {docs.gst.uploaded ? (
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    {docs.gst.name} • {docs.gst.size}
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-slate-450 dark:text-slate-400 mt-1">
                    PDF, JPEG or PNG up to 10MB
                  </p>
                )}
              </div>
            </div>
            
            <div>
              {docs.gst.uploaded ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerPreview(docs.gst, "gst")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    title="View file"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete("gst")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => gstInputRef.current.click()}
                  className="flex items-center gap-1.5 h-9 px-3.5 rounded-[5px] border border-[#2E37A4] text-[#2E37A4] text-[12px] font-bold hover:bg-indigo-50/50 cursor-pointer"
                >
                  <Upload size={14} /> Upload
                </button>
              )}
            </div>
          </div>

          {/* 2. PAN Card copy */}
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center text-[#2E37A4]">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-extrabold text-slate-850 dark:text-white">
                    PAN Card copy
                  </span>
                  <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E2FBE9] border border-[#B7F4C7] text-[#0F8A5F]">
                    Required
                  </span>
                </div>
                {docs.pan.uploaded ? (
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    {docs.pan.name} • {docs.pan.size}
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-slate-450 dark:text-slate-400 mt-1">
                    PDF, JPEG or PNG up to 10MB
                  </p>
                )}
              </div>
            </div>
            
            <div>
              {docs.pan.uploaded ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerPreview(docs.pan, "pan")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    title="View file"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete("pan")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => panInputRef.current.click()}
                  className="flex items-center gap-1.5 h-9 px-3.5 rounded-[5px] border border-[#2E37A4] text-[#2E37A4] text-[12px] font-bold hover:bg-indigo-50/50 cursor-pointer"
                >
                  <Upload size={14} /> Upload
                </button>
              )}
            </div>
          </div>

          {/* 3. Drug License */}
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center text-[#2E37A4]">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-extrabold text-slate-850 dark:text-white">
                    Drug License
                  </span>
                  <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#FFF2E6] border border-[#FFE0C2] text-[#E67E22]">
                    Required
                  </span>
                </div>
                {docs.drug.uploaded ? (
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    {docs.drug.name} • {docs.drug.size}
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    PDF, JPEG or PNG up to 10MB
                  </p>
                )}
              </div>
            </div>
            
            <div>
              {docs.drug.uploaded ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerPreview(docs.drug, "drug")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    title="View file"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete("drug")}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => drugInputRef.current.click()}
                  className="flex items-center gap-1.5 h-9 px-3.5 rounded-[5px] border border-[#2E37A4] text-[#2E37A4] text-[12px] font-bold hover:bg-indigo-50/50 cursor-pointer"
                >
                  <Upload size={14} /> Upload
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Additional Documents (Optional) */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
          Additional Documents (Optional)
        </h3>
        
        <div
          onClick={() => additionalInputRef.current.click()}
          className="border-2 border-dashed border-[#e2e8f0] dark:border-[#334155] rounded-[5px] p-8 text-center bg-white dark:bg-[#0A0F1D] hover:bg-slate-50/50 dark:hover:bg-[#0A0F1D]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#2E37A4]">
            <Upload size={20} className="text-[#2E37A4]" />
          </div>
          <span className="text-[13px] font-extrabold text-slate-850 dark:text-slate-200 mt-1">
            Click to upload or drag and drop
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Prescriptions, ID Proofs, Previous records (Max 10MB each)
          </span>
          <button
            type="button"
            className="mt-3.5 h-9 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-slate-800 text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50/50 transition cursor-pointer shadow-none"
          >
            Browse Files
          </button>
        </div>

        {/* List of uploaded additional docs with View & Trash Actions */}
        {docs.additional.length > 0 && (
          <div className="mt-4 space-y-2">
            {docs.additional.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/40 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-250">
                    {file.name} ({file.size})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => triggerPreview(file, "additional")}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    title="View file"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditional(idx)}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider & Bottom Actions */}
      <div className="border-t border-[#e2e8f0] dark:border-[#334155] pt-4 flex justify-between items-center">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="h-10 px-4 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onComplete(docs)}
            className="h-10 px-5 rounded-[5px] border border-[#2E37A4] text-[12px] font-bold text-[#2E37A4] hover:bg-slate-50 transition cursor-pointer shadow-none"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition cursor-pointer shadow-none"
          >
            Add Supplier
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-[750px] h-[85vh] rounded-[8px] border border-[#e2e8f0] dark:border-[#334155] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Title bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] dark:border-[#334155] bg-slate-50 dark:bg-[#101935]">
              <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                <FileText className="text-[#2E37A4] shrink-0" size={18} />
                <span className="text-[14px] font-bold text-slate-800 dark:text-white truncate">
                  Document Preview — {previewFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClosePreview}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Viewer Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-150/40 dark:bg-[#0A0F1D]/30 flex justify-center items-start">
              
              {/* Check if there is an actual uploaded file reference for previewing */}
              {previewUrl ? (
                <div className="w-full h-full min-h-[560px] flex items-center justify-center bg-white dark:bg-[#0c1222] p-4 rounded border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  {previewFileType.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      className="max-w-full max-h-[540px] object-contain rounded"
                      alt={previewFile.name}
                    />
                  ) : previewFileType === "application/pdf" ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full min-h-[540px] border-none rounded"
                      title={previewFile.name}
                    />
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <FileText size={64} className="mx-auto text-slate-400 stroke-[1.2]" />
                      <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">
                        Preview not supported for this file type ({previewFileType || "unknown"})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Please click the "Download File" button below to access its contents.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Simulated Visual Document Fallbacks */
                <div className="w-full max-w-[620px] bg-white dark:bg-[#0c1222] p-8 rounded border border-slate-250 dark:border-slate-800 shadow-md text-slate-800 dark:text-slate-100 font-sans min-h-[680px] flex flex-col justify-between relative overflow-hidden select-none">
                  
                  {/* Visual mock: GST Certificate */}
                  {previewFile.type === "gst" && (
                    <div className="space-y-6">
                      <div className="text-center border-b-2 border-emerald-600 pb-4">
                        <p className="text-[12px] font-bold text-emerald-700 uppercase tracking-widest">Government of India</p>
                        <h4 className="text-[16px] font-black text-slate-900 dark:text-white uppercase mt-1">Form GST REG-06</h4>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Registration Certificate</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[12px] py-2">
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Registration Number</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">07AAAAA1111A1Z1</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Legal Name</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">PharmaCorp Global Private Limited</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Principal Address of Business</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">Plot 12, Sourcing Valley Phase III, Industrial Area, Okhla, New Delhi - 110020, India</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Date of Liability</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">April 12, 2018</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Period of Validity</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">From 12/04/2018 to Perpetual</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Constitution of Business</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">Private Limited Company</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Approving Authority</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">Delhi Ward 74 Officer</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-12 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400">
                          <p>System Generated Certificate</p>
                          <p>No Signature Required under IT Act</p>
                        </div>
                        <div className="text-center relative">
                          <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/40 absolute -top-8 -left-4 flex items-center justify-center text-emerald-500/20 font-black text-[9px] rotate-12">
                            APPROVED
                          </div>
                          <div className="border-t border-slate-300 dark:border-slate-700 w-32 pt-1 mt-4">
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Superintendent</p>
                            <p className="text-[9px] font-bold text-slate-400">GST Ward 74</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual mock: PAN Card Copy */}
                  {previewFile.type === "pan" && (
                    <div className="h-full flex flex-col justify-center items-center py-10">
                      <div className="w-full max-w-[450px] bg-gradient-to-br from-teal-800 to-indigo-900 text-white rounded-lg p-5 shadow-lg border border-teal-600 relative overflow-hidden font-sans aspect-[1.58]">
                        
                        <div className="flex justify-between items-start border-b border-teal-500/30 pb-2">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-teal-300">INCOME TAX DEPARTMENT</p>
                            <p className="text-[11px] font-bold text-white uppercase">GOVT. OF INDIA</p>
                          </div>
                          <span className="text-[13px] font-extrabold bg-white/10 px-2.5 py-0.5 rounded text-white tracking-widest uppercase">PAN CARD</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-5 text-[11px]">
                          <div>
                            <p className="text-teal-300 text-[8px] uppercase font-bold tracking-wider">Name</p>
                            <p className="font-extrabold text-[12px] uppercase mt-0.5">PHARMACORP GLOBAL PRIVATE LTD</p>
                          </div>
                          <div>
                            <p className="text-teal-300 text-[8px] uppercase font-bold tracking-wider">Permanent Account Number</p>
                            <p className="font-extrabold text-[14px] uppercase tracking-wider text-amber-300 mt-0.5">ABCDE1234F</p>
                          </div>
                          <div>
                            <p className="text-teal-300 text-[8px] uppercase font-bold tracking-wider">Parent/Founder Name</p>
                            <p className="font-semibold uppercase mt-0.5">STEVENSON GROUP CORP</p>
                          </div>
                          <div>
                            <p className="text-teal-300 text-[8px] uppercase font-bold tracking-wider">Date of Incorporation</p>
                            <p className="font-semibold mt-0.5">12/04/2018</p>
                          </div>
                        </div>

                        <div className="absolute right-6 bottom-4 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/5 font-extrabold text-[9px] rotate-45 select-none pointer-events-none">
                          INDIA
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual mock: Drug License */}
                  {previewFile.type === "drug" && (
                    <div className="space-y-6">
                      <div className="text-center border-b-2 border-amber-600 pb-4">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">DRUGS CONTROL DEPARTMENT</p>
                        <h4 className="text-[15px] font-black text-slate-900 dark:text-white uppercase mt-1">FORM 20-B</h4>
                        <p className="text-[10px] font-semibold text-slate-500">License to sell, stock or exhibit for sale by wholesale of drugs</p>
                      </div>

                      <div className="space-y-4 text-[12px]">
                        <p className="leading-relaxed">
                          1. <strong>M/S PHARMACORP GLOBAL PRIVATE LIMITED</strong> is hereby licensed to sell, stock or exhibit for sale or distribute by wholesale, drugs other than those specified in Schedules C, C(1) and X on the premises situated at:
                        </p>
                        <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 font-medium">
                          Plot 12, Sourcing Valley Phase III, Industrial Area, Okhla, New Delhi - 110020, India
                        </p>
                        <p>
                          2. The license shall be in force from <strong>01/01/2026</strong> to <strong>31/12/2030</strong>.
                        </p>
                        <p>
                          3. License No: <strong className="text-amber-600 font-extrabold text-[13px] tracking-wider ml-1">DL-12345/2026</strong>
                        </p>
                      </div>

                      <div className="flex justify-between items-end pt-16 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400">
                          <p>Licensing Authority: Delhi Division</p>
                          <p>Verified Compliant under WHO Guidelines</p>
                        </div>
                        <div className="text-center relative">
                          <div className="w-14 h-14 rounded-full border border-dashed border-amber-500/50 absolute -top-8 -left-4 flex items-center justify-center text-amber-500/20 font-black text-[9px] -rotate-12">
                            VERIFIED
                          </div>
                          <div className="border-t border-slate-300 dark:border-slate-700 w-32 pt-1 mt-4">
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Licensing Authority</p>
                            <p className="text-[9px] font-bold text-slate-400">Drug Controller Office</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual mock: Additional/Other Document */}
                  {previewFile.type === "additional" && (
                    <div className="space-y-6 flex flex-col justify-between h-full min-h-[580px]">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#2E37A4]">
                            <FileText size={22} />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-slate-800 dark:text-white">
                              {previewFile.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-bold">
                              Additional Sourcing Document Profile
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
                          
                          <div className="py-6 flex items-center justify-center">
                            <ShieldCheck size={72} className="text-[#2E37A4] stroke-[1.2]" />
                          </div>
                          
                          <p className="text-center text-[12px] font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
                            This file has been successfully uploaded, secure-scanned for virus indicators, and registered under this vendor sourcing profile.
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-150 dark:border-slate-800 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                        <span>Secure File Repository HMS</span>
                        <span>ID Reference: {Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Modal Bottom control buttons */}
            <div className="px-5 py-4 border-t border-[#e2e8f0] dark:border-[#334155] bg-slate-50 dark:bg-[#101935] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (previewUrl) {
                    // Create temporary link and download actual file
                    const a = document.createElement("a");
                    a.href = previewUrl;
                    a.download = previewFile.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    toast.success(`Downloading ${previewFile.name}...`);
                  } else {
                    toast.success(`Downloading mock ${previewFile.name}...`);
                  }
                }}
                className="h-10 px-4 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer shadow-none"
              >
                <Download size={14} /> Download File
              </button>
              <button
                type="button"
                onClick={handleClosePreview}
                className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition cursor-pointer shadow-none"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </form>
  );
}
export default Step3Documents;
