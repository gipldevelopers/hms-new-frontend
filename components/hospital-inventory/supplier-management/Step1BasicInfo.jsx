"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export function Step1BasicInfo({ data, onChange, onNext, onCancel, readOnly }) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    category: data.category || "",
    supplierType: data.supplierType || "",
    website: data.website || "",
    contactPerson: data.contactPerson || "",
    designation: data.designation || "",
    phone1: data.phone1 || "",
    phone2: data.phone2 || "",
    gstNumber: data.gstNumber || "",
    address: data.address || ""
  });

  useEffect(() => {
    setFormData({
      name: data.name || "",
      category: data.category || "",
      supplierType: data.supplierType || "",
      website: data.website || "",
      contactPerson: data.contactPerson || "",
      designation: data.designation || "",
      phone1: data.phone1 || "",
      phone2: data.phone2 || "",
      gstNumber: data.gstNumber || "",
      address: data.address || ""
    });
  }, [data]);

  const handleChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Supplier Details Header */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
          Supplier Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Supplier Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Supplier Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
              disabled={readOnly}
            />
          </div>

          {/* Select Category */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
              disabled={readOnly}
            >
              <option value="">Select Supplier Category</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="Medical Devices">Medical Devices</option>
              <option value="Surgical Supplies">Surgical Supplies</option>
              <option value="PPE & Safety">PPE & Safety</option>
              <option value="Lab Reagents">Lab Reagents</option>
            </select>
          </div>

          {/* Supplier Type */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Supplier Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.supplierType}
              onChange={(e) => handleChange("supplierType", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
              disabled={readOnly}
            >
              <option value="">Select Supplier Type</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Importer">Importer</option>
            </select>
          </div>

          {/* Enter Website */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Enter Website
            </label>
            <input
              type="text"
              placeholder="www.xyx.com"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              disabled={readOnly}
            />
          </div>

        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Contact Person */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full Name"
              value={formData.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
              disabled={readOnly}
            />
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Sales Manager"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
              disabled={readOnly}
            />
          </div>

          {/* Phone Number 1 */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="9876543210"
              value={formData.phone1}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleChange("phone1", val);
              }}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
              disabled={readOnly}
            />
          </div>

          {/* Phone Number 2 */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="9876543210"
              value={formData.phone2}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleChange("phone2", val);
              }}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
              disabled={readOnly}
            />
          </div>

        </div>
      </div>

      {/* GST Number */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
          GST Number
        </label>
        <input
          type="text"
          placeholder="15 Digit GST number"
          value={formData.gstNumber}
          onChange={(e) => {
            const val = e.target.value.toUpperCase().slice(0, 15);
            handleChange("gstNumber", val);
          }}
          className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
          disabled={readOnly}
        />
      </div>

      {/* Enter Full Address */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
          Enter Full Address
        </label>
        <textarea
          rows="3"
          placeholder="Enter full address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full p-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] resize-none"
          disabled={readOnly}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[#e2e8f0] dark:border-[#334155] pt-4 flex justify-between items-center">
        {/* Back Button */}
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-4 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!readOnly && (
            <button
              type="button"
              onClick={() => onNext(formData)}
              className="h-10 px-5 rounded-[5px] border border-[#2E37A4] text-[12px] font-bold text-[#2E37A4] hover:bg-slate-50 transition cursor-pointer shadow-none"
            >
              Save Draft
            </button>
          )}
          <button
            type="submit"
            className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition cursor-pointer shadow-none"
          >
            {readOnly ? "Next" : "Save & Next"}
          </button>
        </div>
      </div>

    </form>
  );
}
export default Step1BasicInfo;
