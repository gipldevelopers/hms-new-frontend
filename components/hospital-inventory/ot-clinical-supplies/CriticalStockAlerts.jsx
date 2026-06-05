"use client";

import React from "react";
import Link from "next/link";

export function CriticalStockAlerts({ onGeneratePO }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col justify-between">
      <div>
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
          Critical Stock Alerts
        </h2>
        <p className="text-[12px] text-slate-450 dark:text-slate-500 mt-1">
          Items requiring immediate re-ordering.
        </p>
        
        {/* Alert List */}
        <div className="mt-5 space-y-3">
          {/* Alert 1 */}
          <div className="flex justify-between items-center p-3 rounded-[5px] bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20">
            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Latex Gloves (Medium)
            </span>
            <span className="text-[12px] font-extrabold text-red-600 dark:text-red-400">
              Only 4 Boxes left
            </span>
          </div>

          {/* Alert 2 */}
          <div className="flex justify-between items-center p-3 rounded-[5px] bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20">
            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Sterile Drape Kits
            </span>
            <span className="text-[12px] font-extrabold text-red-600 dark:text-red-400">
              8 units remaining
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Link
          href="/hospital-inventory/purchase/add"
          className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer flex items-center justify-center decoration-none"
        >
          Generate PO
        </Link>
      </div>
    </div>
  );
}

export default CriticalStockAlerts;
