"use client";

import React from "react";

export function ReportsRunningBills({ bills = [] }) {
  return (
    <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
          Patients with Running Bills
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Ward / Bed
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Current Bill
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bills.map((bill, index) => (
              <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                  {bill.uhid || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-gray-700 dark:text-slate-200">
                  {bill.patientName || bill.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {bill.wardBed || bill.ward}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  ₹{bill.totalAmount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {bill.status === "Discharge Initiated" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF5F5] dark:bg-red-950/40 text-[#EF4444] dark:text-red-400 border border-red-100 dark:border-red-900/30">
                      Discharge Initiated
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                      Active
                    </span>
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
