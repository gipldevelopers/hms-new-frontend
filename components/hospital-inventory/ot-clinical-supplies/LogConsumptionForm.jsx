"use client";

import React from "react";

export function LogConsumptionForm({
  department,
  setDepartment,
  procedureType,
  setProcedureType,
  date,
  setDate,
  itemName,
  setItemName,
  batch,
  setBatch,
  usedQty,
  setUsedQty,
  onSubmit
}) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none h-full flex flex-col">
      <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white mb-5">
        Log Consumption
      </h2>
      <form onSubmit={onSubmit} className="space-y-4 text-[13px] flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Main Operation Theatre">Main Operation Theatre</option>
              <option value="ICU">ICU</option>
              <option value="Emergency Room">Emergency Room</option>
              <option value="Cardiology Lab">Cardiology Lab</option>
            </select>
          </div>

          {/* Procedure Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Procedure Type
            </label>
            <select
              value={procedureType}
              onChange={(e) => setProcedureType(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="General Surgery">General Surgery</option>
              <option value="Cardiovascular Surgery">Cardiovascular Surgery</option>
              <option value="Orthopedic Surgery">Orthopedic Surgery</option>
              <option value="Neurosurgery">Neurosurgery</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Item Name
            </label>
            <input
              type="text"
              placeholder="Search item..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
            />
          </div>

          {/* Batch */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Batch
            </label>
            <input
              type="text"
              placeholder="e.g. B-2044-X"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
            />
          </div>

          {/* Used Qty */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Used Qty
            </label>
            <input
              type="number"
              placeholder="0"
              value={usedQty || ""}
              onChange={(e) => setUsedQty(parseInt(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 mt-auto">
          <button
            type="submit"
            className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            Log Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default LogConsumptionForm;
