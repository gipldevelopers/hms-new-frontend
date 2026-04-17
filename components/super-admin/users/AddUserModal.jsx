import React, { useState, useEffect } from "react";
import { X, ChevronDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE = "/api";

export function AddUserModal({ isOpen, onClose, onSuccess, editingUser, branches = [], selectedBranchId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    branchId: "",
    status: "Active",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        role: editingUser.role || "",
        branchId: editingUser.branchId || "",
        status: editingUser.status || "Active",
        password: "", 
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        branchId: selectedBranchId || "",
        status: "Active",
        password: "",
      });
    }
  }, [editingUser, isOpen, selectedBranchId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingUser 
        ? `${API_BASE}/users/${editingUser.id}` 
        : `${API_BASE}/users`;
      
      const method = editingUser ? "PUT" : "POST";
      
      const payload = { ...formData };
      if (!payload.password && editingUser) delete payload.password;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || (editingUser ? "Personnel record updated" : "New user provisioned successfully"));
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Credential orchestration failed");
      }
    } catch (error) {
      console.error("Submit user error:", error);
      toast.error("Cloud synchronization error. Check network integrity.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "BRANCH_ADMIN", label: "Branch Admin" },
    { value: "DOCTOR", label: "Doctor" },
    { value: "STAFF", label: "Staff" },
    { value: "RECEPTION", label: "Receptionist" },
    { value: "PHARMACY", label: "Pharmacist" },
    { value: "LABORATORY", label: "Laboratory Tech" },
    { value: "RADIOLOGY", label: "Radiologist" },
    { value: "FINANCE", label: "Finance" },
    { value: "REPORTS", label: "Reports & Mgmt" },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[680px] rounded-[16px] overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white uppercase tracking-tight leading-none">
              {editingUser ? "Modify Personnel Credentials" : "Provision New Access Node"}
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase opacity-60">System Security Registry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">01</span>
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Identity & Assignment</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* User Name */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Legal Name*</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. John Deo"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Access Tier*</label>
                <div className="relative">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">System Identifier (Email)*</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff.name@gvoice.hms"
                  required
                  className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              {/* hospital - Now Branch ID */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1 uppercase tracking-wider">Deployment Location*</label>
                <div className="relative">
                  <select 
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-4 rounded-[8px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="">Select Target Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50 dark:border-white/5">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 h-[48px] bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 text-gray-500 font-bold text-[12px] rounded-[8px] uppercase tracking-widest transition-all hover:bg-gray-50"
            >
              Terminate
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-10 h-[48px] rounded-[8px] font-bold text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-none disabled:opacity-50"
            >
              {loading ? "Synchronizing..." : (editingUser ? "Update Matrix" : "Deploy User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
