"use client";

import React from "react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatCurrency = (value) => currency.format(Number(value || 0));

export function PendingPayments({ stats, loading, error }) {
  const totalRevenue = Number(stats?.totalRevenue || 0);
  const pendingPayments = Number(stats?.pendingPayments || 0);
  const pendingPercent = totalRevenue > 0 ? Math.min(100, Math.round((pendingPayments / totalRevenue) * 100)) : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-[224px] shadow-none">
      <div className="px-5 py-4">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white font-inter">
          Pending Payments & Revenue
        </h3>
      </div>

      <div className="border-b border-border w-full"></div>

      <div className="p-5 flex flex-col justify-center h-[calc(100%-60px)]">
        {loading ? (
          <p className="text-[13px] text-gray-500 dark:text-slate-400">Loading revenue summary...</p>
        ) : error ? (
          <p className="text-[13px] text-[#FF3B30]">{error}</p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mb-1">
                Collected Today
              </p>
              <h2 className="text-[28px] font-bold text-[#1e293b] dark:text-white">
                {formatCurrency(stats?.todayCollections)}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-400 dark:text-slate-500 font-medium">
                  Pending Payments
                </span>
                <span className="text-[12px] font-bold text-[#FF3B30]">
                  {formatCurrency(pendingPayments)}
                </span>
              </div>

              <div className="w-full h-2 bg-[#F1F5F9] dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF3B30] rounded-full"
                  style={{ width: `${pendingPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
