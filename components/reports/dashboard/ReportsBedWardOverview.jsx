"use client";

import React from "react";

export function ReportsBedWardOverview({ wardOverview = [] }) {
  const totalBeds = wardOverview.reduce((sum, w) => sum + w.total, 0);
  const totalOccupied = wardOverview.reduce((sum, w) => sum + w.occupied, 0);
  const totalAvailable = totalBeds - totalOccupied;
  const overallOccupancy = totalBeds ? ((totalOccupied / totalBeds) * 100).toFixed(1) : 0;

  return (
    <div className="bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20 md:h-[350px] h-auto p-5 justify-between">
      <div>
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
          Bed & Ward Overview
        </h3>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-3 gap-3 my-4 md:my-10">
        {/* Total Beds */}
        <div className="p-3 bg-[#F4F6F9] dark:bg-[#1E293B]/40 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-400">
            Total Beds
          </span>
          <h4 className="text-[20px] font-bold text-[#1e293b] dark:text-white mt-1">
            {totalBeds}
          </h4>
        </div>

        {/* Occupied */}
        <div className="p-3 bg-[#EBFBF8] dark:bg-teal-950/20 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-[#0F766E] dark:text-teal-400">
            Occupied
          </span>
          <h4 className="text-[20px] font-bold text-[#0F766E] dark:text-teal-400 mt-1">
            {totalOccupied}
          </h4>
        </div>

        {/* Available */}
        <div className="p-3 bg-[#ECFDF5] dark:bg-emerald-950/20 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-[#047857] dark:text-emerald-400">
            Available
          </span>
          <h4 className="text-[20px] font-bold text-[#047857] dark:text-emerald-400 mt-1">
            {totalAvailable}
          </h4>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 flex-1 flex flex-col justify-end">
        {wardOverview.slice(0, 2).map((ward, index) => (
          <div key={ward.id || index} className="space-y-1.5">
            <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
              <span>{ward.name}</span>
              <span className="font-bold text-gray-500 dark:text-slate-400">
                {ward.occupied}/{ward.total} ({ward.total ? ((ward.occupied / ward.total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${index === 0 ? 'bg-[#EF4444]' : 'bg-[#0D9488]'}`}
                style={{ width: `${ward.total ? ((ward.occupied / ward.total) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
        ))}

        {/* Overall Occupancy */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
            <span>Overall Occupancy</span>
            <span className="font-bold text-gray-500 dark:text-slate-400">
              {overallOccupancy}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B82F6] rounded-full"
              style={{ width: `${overallOccupancy}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
