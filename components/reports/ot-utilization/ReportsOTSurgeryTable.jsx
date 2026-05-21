"use client";

import React from "react";

export function ReportsOTSurgeryTable() {
  const surgeryData = [
    {
      id: "#ER-2020",
      surgeon: "James Smith",
      room: "OT-1",
      type: "Valve Replacement",
      time: "10:00 AM to 14:00 AM", // Match text in screenshot
      delay: "None",
      status: "In Progress"
    },
    {
      id: "#ER-2020",
      surgeon: "James Smith",
      room: "OT-1",
      type: "Valve Replacement",
      time: "10:00 AM to 14:00 AM",
      delay: "None",
      status: "Delayed"
    },
    {
      id: "#ER-2021",
      surgeon: "Sarah Johnson",
      room: "OT-2",
      type: "Knee Surgery",
      time: "11:00 AM to 15:00 PM",
      delay: "Allergies to Penicillin",
      status: "Emergency"
    },
    {
      id: "#ER-2022",
      surgeon: "Michael Brown",
      room: "OT-3",
      type: "Hip Replacement",
      time: "09:00 AM to 13:00 PM",
      delay: "Diabetes",
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-[20px] font-sans">
      {/* Surgery Operation Table Card */}
      <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="px-6 py-4 border-b border-border flex items-center">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Surgery Operation Table
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Surgery ID
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Surgeon
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  OT Room
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Surgery Type
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Delay
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white dark:bg-[#101935]/20">
              {surgeryData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Surgery ID (Blue Link) */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                    {row.id}
                  </td>
                  {/* Surgeon */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-700 dark:text-slate-200 font-semibold">
                    {row.surgeon}
                  </td>
                  {/* OT Room */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.room}
                  </td>
                  {/* Surgery Type */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.type}
                  </td>
                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.time}
                  </td>
                  {/* Delay */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.delay}
                  </td>
                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    {row.status === "Completed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        Completed
                      </span>
                    ) : row.status === "In Progress" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] dark:bg-indigo-950/40 text-[#4F46E5] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                        In Progress
                      </span>
                    ) : row.status === "Delayed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/20 text-[#D97706] dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                        Delayed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F1] dark:bg-red-950/40 text-[#EF4444] dark:text-red-400 border border-red-100 dark:border-red-900/30">
                        Emergency
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
