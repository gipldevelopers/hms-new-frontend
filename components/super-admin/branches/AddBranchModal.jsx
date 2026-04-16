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
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInfraLocked, setIsInfraLocked] = useState(true);
  const [isConfirmingUnlock, setIsConfirmingUnlock] = useState(false);

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
        dbName: editingBranch.dbName || "",
        dbUser: editingBranch.dbUser || "postgres",
        dbPassword: editingBranch.dbPassword || "",
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
        dbName: "ghms_",
        dbUser: "postgres",
        dbPassword: "",
      });
    }
  }, [editingBranch, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dbName") {
      // Enforce ghms_ prefix
      if (!value.startsWith("ghms_")) {
        setFormData((prev) => ({ ...prev, [name]: "ghms_" + value.replace(/^ghms_/, "") }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
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
        toast.success(editingBranch ? "Branch updated successfully" : "Branch & Database created successfully");
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
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-[720px] rounded-[16px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white">{editingBranch ? "Edit Branch Instance" : "Create New Branch Instance"}</h2>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Institutional Registry & Database Provisioning</p>
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
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">General Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Hospital Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Hospital Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apollo Hospital"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Branch Code */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Branch Code</label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. BR-001"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Official Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@hospital.com"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Contact Number</label>
                <input 
                  type="text" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Physical Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full hospital address..."
                required
                className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Database Infrastructure Section */}
          <div className={cn(
            "p-6 rounded-[12px] border transition-all duration-300 space-y-6 relative overflow-hidden",
            isInfraLocked 
              ? "bg-gray-50/50 dark:bg-white/[0.01] border-gray-100 dark:border-white/5" 
              : "bg-amber-50/30 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20"
          )}>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors",
                  isInfraLocked ? "bg-primary/10 text-primary" : "bg-amber-500 text-white"
                )}>02</span>
                <div className="space-y-0.5">
                  <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Isolated Database Config</h3>
                  {!isInfraLocked && (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 animate-in fade-in slide-in-from-left-2 duration-300">
                      <AlertCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Sensitive Mode Active</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  if (isInfraLocked) {
                    setIsConfirmingUnlock(true);
                  } else {
                    setIsInfraLocked(true);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm",
                  isInfraLocked 
                    ? "bg-white dark:bg-white/5 text-gray-500 hover:text-primary border border-gray-200 dark:border-white/10" 
                    : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                )}
              >
                {isInfraLocked ? <><Lock className="w-3 h-3" /> Unlock Infrastructure</> : <><Unlock className="w-3 h-3" /> Lock & Save Path</>}
              </button>
            </div>

            {/* Custom Security Confirmation Overlay */}
            {isConfirmingUnlock && (
              <div className="absolute inset-0 z-[60] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                <div className="max-w-[320px] text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white uppercase tracking-tight">Security Warning</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Modify these settings only if you are migrating or manually provisioning the database. Incorrect credentials will break branch access.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsConfirmingUnlock(false)}
                      className="flex-1 h-10 rounded-[6px] text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsInfraLocked(false);
                        setIsConfirmingUnlock(false);
                      }}
                      className="flex-1 h-10 rounded-[6px] text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest"
                    >
                      I Understand
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300", isInfraLocked && "opacity-60 grayscale-[0.5] pointer-events-none select-none")}>
              {/* Database Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Database Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="dbName"
                    value={formData.dbName}
                    onChange={handleChange}
                    placeholder="ghms_branch_name"
                    required
                    className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-400 font-bold tracking-tight">ENFORCED PREFIX</span>
                </div>
              </div>

               {/* DB User */}
               <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">DB Username</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    name="dbUser"
                    value={formData.dbUser}
                    onChange={handleChange}
                    placeholder="e.g. postgres"
                    required
                    className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                  />
                  {/* Suggestions Dropdown (Simple visual indicator) */}
                  <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/10 rounded-[6px] shadow-lg py-2 hidden group-focus-within:block z-50">
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({...p, dbUser: 'postgres'}))}
                      className="w-full text-left px-4 py-2 text-[12px] text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors font-bold"
                    >
                      SUGGESTION: postgres
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({...p, dbUser: 'hms_admin'}))}
                      className="w-full text-left px-4 py-2 text-[12px] text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors font-bold"
                    >
                      SUGGESTION: hms_admin
                    </button>
                  </div>
                </div>
              </div>

              {/* DB Password */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">DB Access Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="dbPassword"
                    value={formData.dbPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required={!editingBranch}
                    className="w-full h-[48px] px-4 pr-12 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({...p, dbPassword: 'root'}))}
                    className="text-[10px] font-bold text-gray-400 hover:text-primary px-2 py-1 bg-gray-100 dark:bg-white/5 rounded transition-all"
                  >
                    GENERATE: root
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({...p, dbPassword: 'password123'}))}
                    className="text-[10px] font-bold text-gray-400 hover:text-primary px-2 py-1 bg-gray-100 dark:bg-white/5 rounded transition-all"
                  >
                    GENERATE: standard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-[10px] border border-gray-100 dark:border-white/5">
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
              className="px-8 h-[48px] rounded-[8px] text-gray-500 font-bold text-[13px] hover:text-primary uppercase tracking-widest transition-all"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-10 h-[48px] rounded-[8px] font-bold text-[13px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? "Allocating Infrastructure..." : (editingBranch ? "Update Details" : "Provision Branch")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}