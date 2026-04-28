import React, { useState, useEffect } from "react";
import { X, ChevronDown, Eye, EyeOff, Lock, Unlock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AddBranchModal({ isOpen, onClose, onSuccess, editingBranch }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "Gujarat",
    active: true,
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBranch) {
      setFormData({
        name: editingBranch.name || "",
        code: editingBranch.code || "",
        email: editingBranch.email || "",
        contact: editingBranch.contact || "",
        address: editingBranch.address || "",
        city: editingBranch.city || "",
        state: editingBranch.state || "Gujarat",
        active: editingBranch.active ?? true,
        contactPersonName: editingBranch.contactPersonName || "",
        contactPersonEmail: editingBranch.contactPersonEmail || "",
        contactPersonPhone: editingBranch.contactPersonPhone || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        email: "",
        contact: "",
        address: "",
        city: "",
        state: "Gujarat",
        active: true,
        contactPersonName: "",
        contactPersonEmail: "",
        contactPersonPhone: "",
      });
    }
  }, [editingBranch, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const url = editingBranch 
        ? `/api/branches/${editingBranch.id}`
        : "/api/branches";
      
      const method = editingBranch ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(editingBranch ? "Branch updated successfully" : "Branch created & database auto-provisioned");
        onSuccess();
        onClose();
      } else {
        toast.error(json.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit branch error:", error);
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-[720px] rounded-[5px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">{editingBranch ? "Edit Branch" : "Add New Branch"}</h2>
          </div>
          <button 
            onClick={onClose}
            className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* General Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">01</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Hospital Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Hospital Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apollo Hospital"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Branch Code */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Branch Code</label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. BR-001"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Official Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@hospital.com"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Contact Number</label>
                <input 
                  type="text" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Physical Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full hospital address..."
                required
                className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Contact Person Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">02</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Person Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  placeholder="Contact Person Name"
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Person Phone */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Phone Number</label>
                <input 
                  type="text" 
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Person Email */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Personal Email</label>
                <input 
                  type="email" 
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleChange}
                  placeholder="contact.person@example.com"
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Infrastructure Disclaimer */}
          <div className="p-4 bg-sky-50 dark:bg-sky-500/5 rounded-[5px] border border-sky-100 dark:border-sky-500/20 flex items-start gap-3">
             <AlertCircle className="w-4 h-4 text-sky-500 mt-0.5" />
             <div className="space-y-1">
               <h4 className="text-[11px] font-bold text-sky-600 dark:text-sky-500">Automated Infrastructure</h4>
               <p className="text-[11px] text-sky-700/70 dark:text-sky-400/70 leading-relaxed">System will automatically provision an isolated PostgreSQL database with secure credentials for this branch upon creation.</p>
             </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-[5px] border border-gray-100 dark:border-white/5">
            <div className="space-y-0.5">
              <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">Active Operational Status</span>
              <p className="text-[11px] text-gray-500">Toggle this to temporarily suspend all branch API access</p>
            </div>
            <button 
              type="button" 
              onClick={toggleStatus}
              className={`h-[24px] w-[50px] ${formData.active ? "bg-primary" : "bg-gray-300"} rounded-full relative transition-all duration-300 shadow-sm`}
            >
              <div className={`absolute ${formData.active ? "right-1" : "left-1"} top-[3px] w-[18px] h-[18px] bg-white rounded-full transition-all duration-300`}></div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none disabled:opacity-50"
            >
              {loading ? "Allocating Infrastructure..." : (editingBranch ? "Update Details" : "Create Branch")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
