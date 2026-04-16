"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft,
  Save,
  Database,
  Info,
  ChevronRight,
  Plus,
  Trash2,
  Table,
  Mail,
  Calendar as CalendarIcon,
  Clock,
  FileUp,
  ChevronDown,
  CheckSquare,
  Hash,
  Type,
  Check,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/super-admin/branches/BranchComponents";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- CUSTOM CALENDAR COMPONENT ---
function CustomCalendar({ selectedDate, onSelect, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  const days = [];
  const startDay = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  
  // Padding for start of month
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  };

  return (
    <div className="p-3 w-[260px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 px-1">
        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-bold text-[#1e293b] dark:text-white capitalize">{monthName}, {year}</span>
        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <span key={d} className="text-[10px] font-bold text-gray-400 text-center py-1">{d}</span>
        ))}
        {days.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day ? (
              <button
                type="button"
                onClick={() => { onSelect(day); onClose(); }}
                className={cn(
                  "w-8 h-8 rounded-[6px] text-[12px] font-semibold transition-all hover:bg-[#F4F5FB] dark:hover:bg-white/5",
                  isSameDay(day, selectedDate) ? "bg-[#2D3A8C] text-white hover:bg-[#2D3A8C]" : "text-[#1e293b] dark:text-gray-300",
                  isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "text-[#2D3A8C] font-bold"
                )}
              >
                {day.getDate()}
              </button>
            ) : <span />}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-white/5 px-1">
        <button type="button" onClick={() => { onSelect(null); onClose(); }} className="text-[11px] font-bold text-gray-400 hover:text-red-500">Clear</button>
        <button type="button" onClick={() => { onSelect(new Date()); onClose(); }} className="text-[11px] font-bold text-[#2D3A8C]">Today</button>
      </div>
    </div>
  );
}

// --- CUSTOM TIME PICKER COMPONENT ---
function CustomTimePicker({ selectedTime, onSelect, onClose }) {
  const [hour, setHour] = useState(selectedTime ? parseInt(selectedTime.split(':')[0]) : 12);
  const [minute, setMinute] = useState(selectedTime ? parseInt(selectedTime.split(':')[1]) : 0);
  const [period, setPeriod] = useState(selectedTime?.includes('PM') ? 'PM' : 'AM');

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (h, m, p) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm} ${p}`;
  };

  useEffect(() => {
    onSelect(formatTime(hour, minute, period));
  }, [hour, minute, period]);

  return (
    <div className="flex bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-48 overflow-y-auto border-r border-gray-100 dark:border-white/5 custom-scrollbar">
        {hours.map(h => (
          <button 
            key={h} 
            type="button"
            onClick={() => setHour(h)}
            className={cn(
              "w-full py-2.5 text-[13px] font-bold transition-all",
              hour === h ? "bg-[#2D3A8C] text-white" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {h.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
      <div className="w-16 h-48 overflow-y-auto border-r border-gray-100 dark:border-white/5 custom-scrollbar">
        {minutes.map(m => (
          <button 
            key={m} 
            type="button"
            onClick={() => setMinute(m)}
            className={cn(
              "w-full py-2.5 text-[13px] font-bold transition-all",
              minute === m ? "bg-[#2D3A8C] text-white" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {m.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
      <div className="w-16 flex flex-col pt-2">
        {['AM', 'PM'].map(p => (
          <button 
            key={p} 
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              "flex-1 mx-2 my-1 rounded-[5px] text-[11px] font-bold transition-all",
              period === p ? "bg-[#2D3A8C] text-white" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {p}
          </button>
        ))}
        <button 
          type="button"
          onClick={onClose}
          className="mt-auto p-2 text-[#2D3A8C] hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <Check className="w-4 h-4 mx-auto" />
        </button>
      </div>
    </div>
  );
}

export default function FillMasterDataPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [openPicker, setOpenPicker] = useState(null); // { id, type }

  const getTargetId = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  };

  const schemaId = getTargetId();

  useEffect(() => {
    setIsMounted(true);
    if (schemaId) {
      fetchSchemaAndRecords();
    }
  }, [schemaId]);

  const fetchSchemaAndRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5050/api/master-data/${schemaId}`);
      if (!res.ok) throw new Error("Schema not found");
      const data = await res.json();
      setSchema(data);
      setRecords(data.records || []);
      
      const initial = {};
      data.fields.forEach(f => {
        initial[f.label] = f.type === 'checkbox' ? [] : "";
      });
      setFormData(initial);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (label, value) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleCheckboxChange = (label, option, checked) => {
    const currentValues = formData[label] || [];
    let nextValues = [];
    if (checked) {
      nextValues = [...currentValues, option];
    } else {
      nextValues = currentValues.filter(v => v !== option);
    }
    handleInputChange(label, nextValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const field of schema.fields) {
      const val = formData[field.label];
      if (field.required && (!val || (Array.isArray(val) && val.length === 0))) {
        toast.error(`${field.label} is required`);
        return;
      }
      if (field.type === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) {
        toast.error(`Invalid email in ${field.label}`);
        return;
      }
    }

    setSaving(true);
    try {
      const dataToSave = { ...formData };
      Object.keys(dataToSave).forEach(key => {
        if (Array.isArray(dataToSave[key])) {
          dataToSave[key] = dataToSave[key].join(", ");
        }
      });

      const res = await fetch(`http://localhost:5050/api/master-data/${schemaId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      });
      if (!res.ok) throw new Error("Failed to save record");
      
      toast.success("Record added successfully!");
      fetchSchemaAndRecords();
      const reset = {};
      schema.fields.forEach(f => reset[f.label] = f.type === 'checkbox' ? [] : "");
      setFormData(reset);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    try {
      const res = await fetch(`http://localhost:5050/api/master-data/records/${recordToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Record removed");
        setIsDeleteModalOpen(false);
        fetchSchemaAndRecords();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (!isMounted) return null;

  const renderField = (field) => {
    const commonClass = "w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[6px] text-[13px] font-semibold focus:ring-1 focus:ring-[#2D3A8C] outline-none placeholder:text-gray-300 transition-all flex items-center justify-between shadow-sm hover:border-[#2D3A8C]/30";
    const inputClass = "w-full h-full bg-transparent border-none outline-none focus:ring-0 p-0 text-[13px] font-semibold text-[#1e293b] dark:text-white placeholder:text-gray-300";

    switch (field.type) {
      case 'select':
        const opts = (field.options || "").split("\n").filter(o => o.trim() !== "");
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(commonClass, "cursor-pointer group")}>
              <span className={cn("truncate", !formData[field.label] && "text-gray-400 font-medium")}>
                {formData[field.label] || "Select option..."}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#2D3A8C] transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px] max-h-[250px] overflow-y-auto dark:bg-[#101935] dark:border-white/10 p-1 shadow-2xl">
              {opts.map((opt, i) => (
                <DropdownMenuItem 
                  key={i} 
                  className="px-3 py-2 text-[13px] font-medium cursor-pointer flex justify-between items-center rounded-[5px]"
                  onClick={() => handleInputChange(field.label, opt.trim())}
                >
                  {opt.trim()}
                  {formData[field.label] === opt.trim() && <Check className="w-3.5 h-3.5 text-[#2D3A8C]" />}
                </DropdownMenuItem>
              ))}
              {opts.length === 0 && <div className="p-3 text-center text-gray-400 text-[11px]">No options defined</div>}
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case 'checkbox':
        const cbOptions = (field.options || "").split("\n").filter(o => o.trim() !== "");
        return (
          <div className="space-y-3 p-4 bg-[#F8F9FC] dark:bg-[#1e293b]/30 border border-[#E7E8EB] dark:border-white/10 rounded-[8px]">
            {cbOptions.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#2D3A8C] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  checked={(formData[field.label] || []).includes(opt.trim())}
                  onChange={(e) => handleCheckboxChange(field.label, opt.trim(), e.target.checked)}
                />
                <span className="text-[13px] font-medium text-[#1e293b] dark:text-gray-300 group-hover:text-[#2D3A8C] transition-colors">{opt.trim()}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <div className="relative group">
            <button 
              type="button"
              onClick={() => setOpenPicker(openPicker?.id === field.id ? null : { id: field.id, type: 'date' })}
              className={cn(commonClass, "group")}
            >
              <span className={cn(!formData[field.label] && "text-gray-400 font-medium")}>
                {formData[field.label] ? new Date(formData[field.label]).toLocaleDateString() : "dd-mm-yyyy"}
              </span>
              <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-[#2D3A8C] transition-colors" />
            </button>
            {openPicker?.id === field.id && openPicker?.type === 'date' && (
              <div className="absolute top-12 left-0 z-[100]">
                <CustomCalendar 
                  selectedDate={formData[field.label] ? new Date(formData[field.label]) : null}
                  onSelect={(date) => handleInputChange(field.label, date ? date.toISOString() : "")}
                  onClose={() => setOpenPicker(null)}
                />
              </div>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="relative group">
            <button 
              type="button"
              onClick={() => setOpenPicker(openPicker?.id === field.id ? null : { id: field.id, type: 'time' })}
              className={cn(commonClass, "group")}
            >
              <span className={cn(!formData[field.label] && "text-gray-400 font-medium")}>
                {formData[field.label] || "--:--"}
              </span>
              <Clock className="w-4 h-4 text-gray-400 group-hover:text-[#2D3A8C] transition-colors" />
            </button>
            {openPicker?.id === field.id && openPicker?.type === 'time' && (
              <div className="absolute top-12 left-0 z-[100]">
                <CustomTimePicker 
                   selectedTime={formData[field.label]}
                   onSelect={(time) => handleInputChange(field.label, time)}
                   onClose={() => setOpenPicker(null)}
                />
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="relative group">
            <input 
              type="file" 
              id={`file-${field.id}`}
              className="hidden"
              onChange={(e) => handleInputChange(field.label, e.target.files[0]?.name || "")}
            />
            <label 
              htmlFor={`file-${field.id}`}
              className={cn(commonClass, "cursor-pointer group/file")}
            >
              <span className="truncate max-w-[80%] text-gray-500 font-medium">
                {formData[field.label] || field.placeholder || "Choose file to upload..."}
              </span>
              <FileUp className="w-4 h-4 text-gray-400 group-hover/file:text-[#2D3A8C] transition-all" />
            </label>
          </div>
        );

      case 'email':
        return (
          <div className={cn(commonClass, "relative group")}>
             <input 
              type="email" 
              placeholder={field.placeholder || "example@domain.com"}
              className={inputClass}
              required={field.required}
              value={formData[field.label] || ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
            />
            <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#2D3A8C] transition-colors" />
          </div>
        );

      case 'number':
        return (
          <div className={cn(commonClass, "relative group")}>
             <input 
              type="number" 
              placeholder={field.placeholder || "0"}
              className={cn(inputClass, "font-mono")}
              required={field.required}
              value={formData[field.label] || ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
            />
            <Hash className="w-4 h-4 text-gray-400 group-focus-within:text-[#2D3A8C] transition-colors" />
          </div>
        );

      default:
        return (
          <div className={cn(commonClass, "relative group")}>
            <input 
              type="text" 
              placeholder={field.placeholder || `Enter ${field.label}...`}
              className={inputClass}
              required={field.required}
              value={formData[field.label] || ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
            />
            <Type className="w-4 h-4 text-gray-400 group-focus-within:text-[#2D3A8C] transition-colors" />
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans pb-20">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <Link 
            href="/super-admin/configurations/master-data"
            className="w-10 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 bg-white dark:bg-[#101935]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
             <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">
               Fill Master Data: {schema?.name || "Loading..."}
             </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#101935] p-6 rounded-[10px] border border-[#E7E8EB] dark:border-white/10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
              <Plus className="w-5 h-5 text-[#2D3A8C]" />
              <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">Add New Entry</h3>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-400 text-[12px] font-bold uppercase tracking-widest animate-pulse">Fetching Schema...</div>
            ) : (
              <div className="space-y-6">
                {schema?.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
                
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#2D3A8C] text-white h-12 rounded-[6px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#1e2775] transition-all disabled:opacity-50 mt-4 shadow-lg shadow-[#2D3A8C]/10"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Record"}
                </button>
              </div>
            )}
          </form>

          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-[10px] border border-blue-100 dark:border-blue-900/20 flex gap-4">
             <Info className="w-5 h-5 text-blue-500 shrink-0" />
             <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
               Data filled here will be available globally for todos, forms, and clinical modules using the <strong>{schema?.code}</strong> identifier.
             </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
           <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] overflow-hidden shadow-sm">
             <div className="p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border-b border-[#E7E8EB] dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Table className="w-4 h-4 text-gray-400" />
                   <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">Existing Data Entries</h3>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#101935]">
                     <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">#</th>
                     {schema?.fields.slice(0, 3).map(f => (
                       <th key={f.id} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</th>
                     ))}
                     <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {records.map((record, index) => (
                     <tr key={record.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                       <td className="px-6 py-4 text-[12px] font-bold text-gray-300 group-hover:text-[#2D3A8C] transition-colors">{index + 1}</td>
                       {schema?.fields.slice(0, 3).map(f => (
                         <td key={f.id} className="px-6 py-4 text-[13px] font-semibold text-[#1e293b] dark:text-white truncate max-w-[200px]">{record.data[f.label] || <span className="text-gray-200">N/A</span>}</td>
                       ))}
                       <td className="px-6 py-4">
                         <div className="flex justify-end">
                            <button 
                              onClick={() => handleDeleteClick(record)}
                              className="w-8 h-8 rounded-[5px] flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border border-transparent hover:border-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {records.length === 0 && !loading && (
                     <tr>
                       <td colSpan={10} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <Database className="w-10 h-10 text-gray-100" />
                             <p className="text-gray-400 text-[13px] font-medium tracking-wide">No records entries yet for this master file.</p>
                          </div>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteRecord}
        itemName="this data record"
        title="Delete Record?"
      />
    </div>
  );
}
