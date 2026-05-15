"use client";

import React from "react";

export function PendingPayments() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[6px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden h-[224px]">
      <div className="px-5 py-4">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white font-inter">
          Pending Payments & Revenue
        </h3>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5 flex flex-col justify-center h-[calc(100%-60px)]">
        <div className="mb-4">
          <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mb-1">
            Collected Today
          </p>
          <h2 className="text-[28px] font-bold text-[#1e293b] dark:text-white">
            ₹12,450
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-400 dark:text-slate-500 font-medium">
              Pending Payments
            </span>
            <span className="text-[12px] font-bold text-[#FF3B30]">
              ₹1,240
            </span>
          </div>

          <div className="w-full h-2 bg-[#F1F5F9] dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF3B30] rounded-full"
              style={{ width: '15%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
