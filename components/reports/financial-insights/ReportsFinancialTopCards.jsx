"use client";

import React from "react";

export function ReportsFinancialTopCards() {
  return (
    <div className="bg-card border border-border border-l-4 border-l-[#4F46E5] rounded-lg flex flex-col md:flex-row items-stretch md:items-center py-5 shadow-none font-sans overflow-hidden">
      
      {/* Section 1: TODAY REVENUE */}
      <div className="flex-1 px-6 py-2 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
          Today Revenue
        </span>
        <h4 className="text-[24px] font-extrabold text-[#1E293B] dark:text-white mt-2 leading-none">
          ₹142,500
        </h4>
      </div>

      {/* Divider 1 */}
      <div className="hidden md:block w-[1px] h-10 bg-gray-200 dark:bg-slate-700/60 shrink-0"></div>
      <div className="block md:hidden h-[1px] w-full bg-gray-100 dark:bg-slate-800/40"></div>

      {/* Section 2: OUTSTANDING DUES */}
      <div className="flex-1 px-6 py-2 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
          Outstanding Dues
        </span>
        <h4 className="text-[24px] font-extrabold text-[#1E293B] dark:text-white mt-2 leading-none">
          ₹48,000
        </h4>
      </div>

      {/* Divider 2 */}
      <div className="hidden md:block w-[1px] h-10 bg-gray-200 dark:bg-slate-700/60 shrink-0"></div>
      <div className="block md:hidden h-[1px] w-full bg-gray-100 dark:bg-slate-800/40"></div>

      {/* Section 3: PENDING CLAIMS */}
      <div className="flex-1 px-6 py-2 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
          Pending Claims
        </span>
        <h4 className="text-[24px] font-extrabold text-[#1E293B] dark:text-white mt-2 leading-none">
          ₹124,500.00
        </h4>
      </div>

      {/* Divider 3 */}
      <div className="hidden md:block w-[1px] h-10 bg-gray-200 dark:bg-slate-700/60 shrink-0"></div>
      <div className="block md:hidden h-[1px] w-full bg-gray-100 dark:bg-slate-800/40"></div>

      {/* Section 4: Refund Alerts */}
      <div className="flex-1 px-6 py-2 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
          Refund Alerts
        </span>
        <h4 className="text-[24px] font-black text-[#EF4444] mt-2 leading-none">
          3 Pending
        </h4>
      </div>

    </div>
  );
}
