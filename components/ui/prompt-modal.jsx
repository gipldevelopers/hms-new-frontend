import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PromptModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Add New Item", 
  label = "Enter name", 
  placeholder = "Type here...", 
  initialValue = "",
  confirmText = "Add Item"
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[400px] rounded-[12px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E7E8EB] dark:border-white/10">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-[#F8F9FC] dark:bg-[#1e293b]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-[#F0F2FF] dark:bg-[#101935] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10">
               <Plus className="w-4 h-4 text-[#2D3A8C]" />
            </div>
            <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <input 
              autoFocus
              type="text" 
              placeholder={placeholder}
              className="w-full h-12 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] text-[14px] font-semibold focus:ring-1 focus:ring-primary outline-none placeholder:text-gray-300 transition-all"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-12 text-[13px] font-bold text-gray-500 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 rounded-[8px] transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 h-12 text-[13px] font-bold text-white bg-primary hover:opacity-90 rounded-[8px] transition-all shadow-lg shadow-primary/10"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
