"use client";

import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Hotel,
  Bed,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Sparkles,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StatCard = ({ title, value, subValue, icon: Icon, iconBg, iconColor, badge, badgeBg, badgeText }) => (
  <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between h-[135px] transition-all">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-[5px] ${iconBg} dark:bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] flex items-center gap-1", badgeBg, badgeText)}>
        {badge}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold text-[#1e293b] dark:text-white leading-none">{value}</h3>
        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{subValue}</span>
      </div>
    </div>
  </div>
);

export default function BedWardOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(0);

  const stats = [
    { 
      title: "Total Beds", 
      value: "320", 
      subValue: "Across 12 depts", 
      icon: LayoutGrid, 
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      badge: "All Wards",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-600"
    },
    { 
      title: "Occupied", 
      value: "236", 
      subValue: "73.8% occupancy", 
      icon: Hotel, 
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      badge: "+12 Today",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-600"
    },
    { 
      title: "Available", 
      value: "84", 
      subValue: "26.2% capacity", 
      icon: CheckCircle2, 
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      badge: "-8 Today",
      badgeBg: "bg-red-100",
      badgeText: "text-red-600"
    },
    { 
      title: "Reserved", 
      value: "24", 
      subValue: "Pre-surgical", 
      icon: Clock, 
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      badge: "+5 Scheduled",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-600"
    }
  ];

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Emergency & Trauma",
      status: "Active",
      wards: [{ name: "ER-Main-South", code: "WD-ERS-01" }],
      beds: [{ label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" }]
    },
    {
      id: 2,
      name: "Emergency & Trauma",
      status: "Active",
      wards: [{ name: "ER-Main-South", code: "WD-ERS-01" }],
      beds: [{ label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" }]
    },
    {
      id: 3,
      name: "Intensive Care (ICU)",
      status: "Active",
      wards: [
        { name: "ER-Main-South", code: "WD-ERS-01" },
        { name: "ER-Main-South", code: "WD-ERS-01" },
        { name: "ER-Main-South", code: "WD-ERS-01" }
      ],
      beds: [
        { label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" },
        { label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" },
        { label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" }
      ]
    },
    {
      id: 4,
      name: "Intensive Care (ICU)",
      status: "Inactive",
      wards: [{ name: "ER-Main-South", code: "WD-ERS-01" }],
      beds: [{ label: "e.g. Bed 101", equipmentId: "e.g. EQ-102" }]
    }
  ]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const addField = (deptIdx, type) => {
    const newDepts = [...departments];
    if (type === 'ward') {
      newDepts[deptIdx].wards.push({ name: "", code: "" });
    } else {
      newDepts[deptIdx].beds.push({ label: "", equipmentId: "" });
    }
    setDepartments(newDepts);
  };

  const removeField = (deptIdx, fieldIdx, type) => {
    const newDepts = [...departments];
    if (type === 'ward') {
      newDepts[deptIdx].wards.splice(fieldIdx, 1);
    } else {
      newDepts[deptIdx].beds.splice(fieldIdx, 1);
    }
    setDepartments(newDepts);
  };

  const addDepartment = () => {
    const newDept = {
      id: departments.length + 1,
      name: "New Department",
      status: "Active",
      wards: [{ name: "", code: "" }],
      beds: [{ label: "", equipmentId: "" }]
    };
    setDepartments([...departments, newDept]);
    setActiveAccordion(departments.length);
  };

  const removeDepartment = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-[10px]">
        <h1 className="text-[18px] md:text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight">Bed & Ward Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#1E293B] p-4 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white px-1">Departments</h2>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 sm:flex-none h-[40px] px-4 rounded-[5px] bg-white dark:bg-[#1E293B] border border-[#E7E8EB] dark:border-white/10 text-[12px] font-bold text-[#64748B] dark:text-white flex items-center justify-between gap-2 hover:bg-gray-50 transition-all outline-none">
                  All <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-[#1E293B] border-[#E7E8EB] dark:border-white/10 p-1 rounded-[5px]">
                <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">All Wards</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 sm:flex-none h-[40px] px-4 rounded-[5px] bg-white dark:bg-[#1E293B] border border-[#E7E8EB] dark:border-white/10 text-[12px] font-bold text-[#64748B] dark:text-white flex items-center justify-between gap-2 hover:bg-gray-50 transition-all outline-none">
                  All <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-[#1E293B] border-[#E7E8EB] dark:border-white/10 p-1 rounded-[5px]">
                <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">All Beds</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button 
            onClick={addDepartment}
            className="bg-primary text-white px-5 h-[40px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {departments.map((dept, idx) => (
          <div 
            key={dept.id}
            className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none h-fit"
          >
            {/* Accordion Header */}
            <div 
              className={cn(
                "px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors duration-300",
                "bg-primary text-white"
              )}
              onClick={() => toggleAccordion(idx)}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-[14px] font-bold">Department {dept.id}: {dept.name}</h3>
              </div>
              
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <span className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                  dept.status === "Active" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                )}>
                  {dept.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => removeDepartment(dept.id)}
                    className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors">
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors">
                    {activeAccordion === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            <AnimatePresence>
              {activeAccordion === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-8 bg-white dark:bg-[#101935]">
                    
                    {/* Wards Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <h4 className="text-[11px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">Wards Configuration</h4>
                        <button 
                          onClick={() => addField(idx, 'ward')}
                          className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Ward
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {dept.wards.map((ward, wIdx) => (
                          <div key={wIdx} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                            <div className="flex-1 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ward Name <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                defaultValue={ward.name}
                                placeholder="Enter Ward Name"
                                className="w-full h-10 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[3px] text-[13px] font-medium text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ward Code <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                defaultValue={ward.code}
                                placeholder="Enter Ward Code"
                                className="w-full h-10 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[3px] text-[13px] font-medium text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
                              />
                            </div>
                            <button 
                              onClick={() => removeField(idx, wIdx, 'ward')}
                              className="h-10 w-10 shrink-0 border border-[#E7E8EB] dark:border-white/10 rounded-[3px] flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Beds Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <h4 className="text-[11px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">Bed Inventory</h4>
                        <button 
                          onClick={() => addField(idx, 'bed')}
                          className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bed
                        </button>
                      </div>

                      <div className="space-y-4">
                        {dept.beds.map((bed, bIdx) => (
                          <div key={bIdx} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                            <div className="flex-1 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bed Label <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                defaultValue={bed.label}
                                placeholder="Enter Bed Label"
                                className="w-full h-10 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[3px] text-[13px] font-medium text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Equipment ID <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                defaultValue={bed.equipmentId}
                                placeholder="Enter Equipment ID"
                                className="w-full h-10 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[3px] text-[13px] font-medium text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
                              />
                            </div>
                            <button 
                              onClick={() => removeField(idx, bIdx, 'bed')}
                              className="h-10 w-10 shrink-0 border border-[#E7E8EB] dark:border-white/10 rounded-[3px] flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-50">
                      <button className="px-6 h-10 rounded-[3px] text-[12px] font-bold text-gray-500 hover:bg-gray-50 transition-all border border-[#E7E8EB]">
                        Discard
                      </button>
                      <button className="px-6 h-10 rounded-[3px] text-[12px] font-bold text-white bg-primary hover:opacity-90 transition-all">
                        Save Changes
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
