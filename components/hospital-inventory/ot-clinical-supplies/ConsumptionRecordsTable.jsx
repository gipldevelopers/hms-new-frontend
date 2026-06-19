"use client";

import React from "react";
import { Search, ListFilter, MoreVertical, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConsumptionRecordsTable({ records, searchValue, setSearchValue, onDelete }) {
  // Filter records based on search
  const filteredRecords = records.filter(rec =>
    rec.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    rec.batch.toLowerCase().includes(searchValue.toLowerCase()) ||
    rec.usedBy.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-[20px]">

      {/* Table Element Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden shadow-none">
        {/* Table Filter / Header */}
        <div className="p-5 border-b border-[#e2e8f0] dark:border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
              Consumption Records
            </h2>
            <span className="text-slate-350 dark:text-slate-650 font-normal">|</span>
            <span className="text-[12.5px] font-bold text-slate-400 dark:text-slate-500">
              Displaying {filteredRecords.length} results
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2E37A4]"
              />
            </div>
            <button className="text-slate-450 hover:text-slate-650 dark:hover:text-slate-300 transition cursor-pointer outline-none">
              <ListFilter size={18} />
            </button>
            <button className="text-slate-450 hover:text-slate-650 dark:hover:text-slate-300 transition cursor-pointer outline-none">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-b border-[#e2e8f0] dark:border-[#334155] text-slate-450 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Batch No.</th>
                <th className="px-6 py-4">Used Qty</th>
                <th className="px-6 py-4">Remaining Stock</th>
                <th className="px-6 py-4">Used By</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155] text-slate-700 dark:text-slate-250 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-450 dark:text-slate-500 font-bold">
                    No consumption records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/45 dark:hover:bg-white/5 transition-colors">
                    {/* Item details */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 dark:text-white text-[13px]">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {item.ref}
                        </span>
                      </div>
                    </td>

                    {/* Batch No */}
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-400 font-bold">
                      {item.batch}
                    </td>

                    {/* Used Qty */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                      {item.usedQty} {item.unit}
                    </td>

                    {/* Remaining Stock */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 dark:text-white">
                          {item.remainingStock.toLocaleString("en-US")}
                        </span>
                        <span className={cn(
                          "text-[9.5px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-[3px]",
                          item.stockStatus === "STABLE"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        )}>
                          {item.stockStatus}
                        </span>
                      </div>
                    </td>

                    {/* Used By */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {/* Circle Avatar */}
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-white/10 flex items-center justify-center overflow-hidden">
                          <User size={13} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {item.usedBy}
                          </span>
                          {item.usedById && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {item.usedById}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-[4px] text-[10px] font-black border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400 uppercase tracking-wide">
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this consumption record?")) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[4px] transition-colors text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ConsumptionRecordsTable;
