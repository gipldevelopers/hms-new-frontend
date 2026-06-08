"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal, AlertTriangle, CheckCircle2, Clock, AlertCircle, Info } from "lucide-react";


const PR_QUEUE_DATA = [
  {
    prNumber: "PR-2024-402",
    department: "Anesthesia Department",
    requestedBy: "Dr. James Mercer",
    date: "2024-03-22",
    priority: "Urgent",
    totalItems: 3,
    status: "Pending Admin",
  },
  {
    prNumber: "PR-2024-399",
    department: "Central Pharmacy",
    requestedBy: "Sarah Alvi",
    date: "2024-03-20",
    priority: "Normal",
    totalItems: 15,
    status: "Ordered",
  },
  {
    prNumber: "PR-2024-391",
    department: "Emergency & Trauma",
    requestedBy: "Nurse Head Julia",
    date: "2024-03-19",
    priority: "High",
    totalItems: 8,
    status: "Ordered",
  },
  {
    prNumber: "PR-2024-402",
    department: "Anesthesia Department",
    requestedBy: "Dr. James Mercer",
    date: "2024-03-22",
    priority: "Urgent",
    totalItems: 3,
    status: "Pending Admin",
  },
  {
    prNumber: "PR-2024-391",
    department: "Emergency & Trauma",
    requestedBy: "Nurse Head Julia",
    date: "2024-03-19",
    priority: "High",
    totalItems: 8,
    status: "Ordered",
  },
  {
    prNumber: "PR-2024-402",
    department: "Anesthesia Department",
    requestedBy: "Dr. James Mercer",
    date: "2024-03-22",
    priority: "Urgent",
    totalItems: 3,
    status: "Pending Admin",
  },
  {
    prNumber: "PR-2024-391",
    department: "Emergency & Trauma",
    requestedBy: "Nurse Head Julia",
    date: "2024-03-19",
    priority: "High",
    totalItems: 8,
    status: "Ordered",
  },
  {
    prNumber: "PR-2024-391",
    department: "Emergency & Trauma",
    requestedBy: "Nurse Head Julia",
    date: "2024-03-19",
    priority: "High",
    totalItems: 8,
    status: "Ordered",
  },
  {
    prNumber: "PR-2024-402",
    department: "Anesthesia Department",
    requestedBy: "Dr. James Mercer",
    date: "2024-03-22",
    priority: "Urgent",
    totalItems: 3,
    status: "Pending Admin",
  },
  {
    prNumber: "PR-2024-391",
    department: "Emergency & Trauma",
    requestedBy: "Nurse Head Julia",
    date: "2024-03-19",
    priority: "High",
    totalItems: 8,
    status: "Ordered",
  }
];

export function ApprovalTable({ onViewOrder, onApproveAndPO, onEditOrder }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (idx, e) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === idx ? null : idx);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] py-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col h-full relative">
      {/* Click Away Overlay */}
      {openDropdownId !== null && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col mb-5 px-6">
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white leading-none">
          Purchase Requests Queue
        </h2>

      </div>

      {/* Table Element wrapper */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-t border-b border-[#e2e8f0] dark:border-[#334155]">
              <th className="pl-6 pr-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">PR Number</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Department</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Requested By</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Date</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Total Items</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Approval Status</th>
              <th className="pl-4 pr-6 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {PR_QUEUE_DATA.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                {/* PR Number */}
                <td className="pl-6 pr-4 py-4 font-bold text-slate-800 dark:text-white">
                  {item.prNumber}
                </td>
                {/* Department */}
                <td className="px-4 py-4 text-slate-700 dark:text-slate-300 font-semibold">
                  {item.department}
                </td>
                {/* Requested By */}
                <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-bold text-[12px]">
                  {item.requestedBy}
                </td>
                {/* Date */}
                <td className="px-4 py-4 text-slate-500 dark:text-slate-450 font-semibold text-[12px]">
                  {item.date}
                </td>
                {/* Priority Badge */}
                <td className="px-4 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border inline-flex items-center gap-1",
                    item.priority === "Urgent"
                      ? "bg-red-50/70 text-red-600 border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
                      : item.priority === "High"
                        ? "bg-amber-50/70 text-amber-600 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                        : "bg-blue-50/70 text-blue-600 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                  )}>
                    {item.priority === "Urgent" && <Clock className="w-2.5 h-2.5" />}
                    {item.priority === "High" && <AlertCircle className="w-2.5 h-2.5" />}
                    {item.priority === "Normal" && <Info className="w-2.5 h-2.5" />}
                    {item.priority}
                  </span>
                </td>
                {/* Total Items */}
                <td className="px-4 py-4 text-slate-800 dark:text-white font-extrabold text-center lg:text-left pl-8">
                  {item.totalItems}
                </td>
                {/* Approval Status Badge */}
                <td className="px-4 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border inline-flex items-center gap-1",
                    item.status === "Pending Admin"
                      ? "bg-orange-50/70 text-orange-650 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30"
                      : "bg-emerald-50/70 text-emerald-650 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                  )}>
                    {item.status === "Pending Admin" ? (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    ) : (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    )}
                    {item.status}
                  </span>
                </td>
                {/* Actions Icon with Dropdown Menu */}
                <td className="pl-4 pr-6 py-4 text-right relative">
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown(idx, e)}
                    className="p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors z-20 relative cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {openDropdownId === idx && (
                    <div className={cn(
                      "absolute right-6 w-[140px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[6px] shadow-lg z-20 overflow-hidden text-left",
                      idx >= PR_QUEUE_DATA.length - 2 ? "bottom-full mb-1" : "mt-1"
                    )}>
                      {item.status === "Pending Admin" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              if (onApproveAndPO) {
                                onApproveAndPO(item);
                              }
                            }}
                            className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-[#1e293b] cursor-pointer block"
                          >
                            Approve & PO
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(null)}
                            className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-[#F8F9FC] dark:bg-[#1e293b] border-t border-[#e2e8f0] dark:border-[#334155] cursor-pointer block"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              if (onViewOrder) {
                                onViewOrder(item);
                              }
                            }}
                            className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-[#1e293b] cursor-pointer block"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              if (onEditOrder) {
                                onEditOrder(item);
                              }
                            }}
                            className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-[#1e293b] border-t border-[#e2e8f0] dark:border-[#334155] cursor-pointer block"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(null)}
                            className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-[#1e293b] border-t border-[#e2e8f0] dark:border-[#334155] cursor-pointer block"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovalTable;
