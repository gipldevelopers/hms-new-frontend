"use client";

import React from "react";

export function ReportsFinancialTransactions() {
  const transactionData = [
    {
      id: "#INV-2020",
      patient: "James Smith",
      department: "Surgery",
      amount: "₹12,450",
      payment: "Insurance",
      insuranceStatus: "Approved",
      status: "Paid"
    },
    {
      id: "#INV-2021",
      patient: "Maria Garcia",
      department: "Consultation",
      amount: "₹3,200",
      payment: "Self-Pay",
      insuranceStatus: "Pending",
      status: "Unpaid"
    },
    {
      id: "#INV-2022",
      patient: "Ravi Patel",
      department: "Radiology",
      amount: "₹5,100",
      payment: "Insurance",
      insuranceStatus: "Denied",
      status: "Unpaid"
    },
    {
      id: "#INV-2023",
      patient: "Aisha Khan",
      department: "Physiotherapy",
      amount: "₹7,800",
      payment: "Insurance",
      insuranceStatus: "Approved",
      status: "Paid"
    }
  ];

  return (
    <div className="space-y-[20px] font-sans">
      {/* Financial Transaction Registry Table Card */}
      <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="px-6 py-4 border-b border-border flex items-center">
          <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-white">
            Financial Transaction
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Bill ID
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Insurance
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white dark:bg-[#101935]/20">
              {transactionData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Bill ID (Blue Link) */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                    {row.id}
                  </td>
                  {/* Patient Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700 dark:text-slate-200 font-semibold">
                    {row.patient}
                  </td>
                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.department}
                  </td>
                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700 dark:text-slate-200 font-extrabold">
                    {row.amount}
                  </td>
                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.payment}
                  </td>
                  {/* Insurance badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.insuranceStatus === "Approved" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        Approved
                      </span>
                    ) : row.insuranceStatus === "Pending" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/20 text-[#D97706] dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F1] dark:bg-red-950/40 text-[#EF4444] dark:text-red-400 border border-red-100 dark:border-red-900/30">
                        Denied
                      </span>
                    )}
                  </td>
                  {/* Status badge */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    {row.status === "Paid" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/20 text-[#D97706] dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                        Unpaid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
