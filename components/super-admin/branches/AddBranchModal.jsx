import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function AddBranchModal({ isOpen, onClose, onSuccess, editingBranch }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "Gujarat",
    isActive: true,
  });

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
        isActive: editingBranch.isActive ?? true,
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
        isActive: true,
      });
    }
  }, [editingBranch, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success(editingBranch ? "Branch updated successfully" : "Branch created successfully");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[720px] rounded-[12px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center">
          <h2 className="text-[24px] font-bold text-[#3F51B5]">{editingBranch ? "Edit Branch" : "Add Branch"}</h2>
          <button 
            onClick={onClose}
            className="group p-1 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-red-400 group-hover:text-red-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            
            {/* Hospital Name */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter hospital name"
                required
                className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
              />
            </div>

            {/* Branch Code */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                Branch Code <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter Number"
                required
                className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                Email<span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                Contact Number<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter Contact"
                required
                className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">
              Address<span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
              className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {/* City */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                City<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                required
                className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 placeholder:text-[#94A3B8] outline-none focus:border-[#3F51B5] transition-all bg-[#F8FAFC]/30"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-[#1e293b]">
                State<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full h-[52px] px-5 rounded-[12px] border border-[#E2E8F0] text-[15px] text-gray-700 outline-none focus:border-[#3F51B5] appearance-none bg-[#F8FAFC]/30 transition-all"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-4">
            <label className="text-[16px] font-semibold text-[#1e293b]">
              Status<span className="text-red-500">*</span>
            </label>
            <button 
              type="button" 
              onClick={toggleStatus}
              className={`h-[26px] w-[50px] ${formData.isActive ? "bg-[#52C41A]" : "bg-gray-300"} rounded-full relative transition-colors`}
            >
              <div className={`absolute ${formData.isActive ? "right-1" : "left-1"} top-[3px] w-5 h-5 bg-white rounded-full shadow-sm transition-all`}></div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-5 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="w-[140px] h-[52px] rounded-[12px] border border-red-400 text-red-500 font-bold text-[16px] hover:bg-red-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-[200px] h-[52px] rounded-[12px] bg-[#3F51B5] text-white font-bold text-[16px] hover:bg-[#334295] transition-all shadow-md shadow-indigo-100"
            >
              {editingBranch ? "Update Branch" : "Add Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}