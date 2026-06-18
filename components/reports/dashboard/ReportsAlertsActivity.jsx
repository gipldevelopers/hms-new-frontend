"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Beaker, Ambulance, Bell, Clock, CreditCard } from "lucide-react";

export function ReportsAlertsActivity({ alerts = [], recentActivity = [], actionsNeeded = [] }) {
  // If no data provided yet, fallback to an empty array so map doesn't crash
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] font-sans">
      {/* Column 1: Critical Alert */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
            Critical Alerts
          </h3>
          <button className="px-3 py-1 border border-border rounded-lg text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            View all
          </button>
        </div>

        <div className="p-5 flex flex-col space-y-3.5">
          {alerts.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-4">No critical alerts</div>
          )}
          {alerts.map((alert, i) => (
            <div key={alert.id || i} className={`p-3 rounded-lg flex items-start gap-3 border ${alert.type === 'Critical' ? 'bg-[#FFF5F5] dark:bg-red-950/20 border-red-100/50 dark:border-red-900/20' : 'bg-[#FFFBEB] dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/20'}`}>
              {alert.type === 'Critical' ? (
                <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-1.5">
                <span className={`text-[12px] font-bold ${alert.type === 'Critical' ? 'text-[#EF4444]' : 'text-[#D97706]'}`}>{alert.type || 'Alert'}</span>
                <p className={`text-[11px] font-medium leading-normal ${alert.type === 'Critical' ? 'text-[#7F1D1D] dark:text-red-300/80' : 'text-[#78350F] dark:text-amber-300/80'}`}>
                  {alert.message}
                </p>
                <button className={`text-[10px] font-extrabold self-start hover:underline tracking-wider mt-1 ${alert.type === 'Critical' ? 'text-[#EF4444]' : 'text-[#D97706]'}`}>
                  ACKNOWLEDGE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Action Needed */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
            Action Needed
          </h3>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {actionsNeeded.length === 0 && (
             <div className="px-5 py-6 text-center text-sm text-gray-500">No pending actions</div>
          )}
          {actionsNeeded.map((action, i) => (
             <div key={action.id || i} className="px-5 py-4 flex items-start gap-3.5">
                <div className="w-9 h-9 bg-[#EEF2FF] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#4F46E5] dark:text-[#818CF8]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">{action.title}</span>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                    {action.description}
                  </p>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Column 3: Recent Activity */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
            Recent Activity
          </h3>
          <button className="px-3 py-1 border border-border rounded-lg text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            View all
          </button>
        </div>

        <div className="p-5 flex flex-col space-y-4">
          {recentActivity.length === 0 && (
             <div className="text-center text-sm text-gray-500 py-4">No recent activity</div>
          )}
          {recentActivity.map((act, i) => (
            <div key={act.id || i} className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">{act.title}</span>
                  <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{act.description}</span>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">
                {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
