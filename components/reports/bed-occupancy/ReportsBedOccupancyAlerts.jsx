"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Beaker, Ambulance, Bell, Clock, CreditCard } from "lucide-react";

export function ReportsBedOccupancyAlerts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] font-sans">
      {/* Column 1: Critical Alert */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
            Critical Alert
          </h3>
          <button className="px-3 py-1 border border-border rounded-lg text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            View all
          </button>
        </div>

        <div className="p-5 flex flex-col space-y-3.5">
          {/* Item 1 */}
          <div className="p-3 bg-[#FFF5F5] dark:bg-red-950/20 rounded-lg flex items-start gap-3 border border-red-100/50 dark:border-red-900/20">
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[#EF4444]">Critical Patient Alert</span>
              <p className="text-[11px] text-[#7F1D1D] dark:text-red-300/80 font-medium leading-normal">
                Room 302: SpO2 levels dropping below 85%.
              </p>
              <button className="text-[10px] font-extrabold text-[#EF4444] self-start hover:underline tracking-wider mt-1">
                ACKNOWLEDGE
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3 bg-[#FFFBEB] dark:bg-amber-950/20 rounded-lg flex items-start gap-3 border border-amber-100/50 dark:border-amber-900/20">
            <Beaker className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[#D97706]">Lab Result Pending</span>
              <p className="text-[11px] text-[#78350F] dark:text-amber-300/80 font-medium leading-normal">
                MRI Results for Patient #8829 are now ready for review.
              </p>
              <button className="text-[10px] font-extrabold text-[#D97706] self-start hover:underline tracking-wider mt-1">
                VIEW RESULTS
              </button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3 bg-[#EFF6FF] dark:bg-blue-950/20 rounded-lg flex items-start gap-3 border border-blue-100/50 dark:border-blue-900/20">
            <Ambulance className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold text-[#3B82F6]">Emergency Arrival</span>
              <p className="text-[11px] text-[#1E3A8A] dark:text-blue-300/80 font-medium leading-normal">
                Ambulance #14 arriving in 4 minutes with trauma case.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="p-3 bg-[#F8FAFC] dark:bg-slate-900/40 rounded-lg flex items-start gap-3 border border-slate-100 dark:border-slate-800/40">
            <Bell className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold text-[#475569] dark:text-slate-300">Follow-up Reminder</span>
              <p className="text-[11px] text-[#334155] dark:text-slate-400 font-medium leading-normal">
                Send discharge summaries for Ward 2C patients.
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="p-3 bg-[#FFF5F5] dark:bg-red-950/20 rounded-lg flex items-start gap-3 border border-red-100/50 dark:border-red-900/20">
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[#EF4444]">Critical Patient Alert</span>
              <p className="text-[11px] text-[#7F1D1D] dark:text-red-300/80 font-medium leading-normal">
                Room 302: SpO2 levels dropping below 85%.
              </p>
              <button className="text-[10px] font-extrabold text-[#EF4444] self-start hover:underline tracking-wider mt-1">
                ACKNOWLEDGE
              </button>
            </div>
          </div>
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
          {/* Action 1 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EEF2FF] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#4F46E5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Dr. Sarah Smith Delayed</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                Cardiology OPD is running 30 mins behind schedule.
              </p>
            </div>
          </div>

          {/* Action 2 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#FFF1F1] dark:bg-red-950/40 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#FF5C5C] dark:text-[#FCA5A5]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Emergency Alert</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                Trauma case arriving in 5 mins. Prep Room 1.
              </p>
            </div>
          </div>

          {/* Action 3 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-[#3F51B5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Payment Pending</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                3 patients checked out without completing pharmacy payment.
              </p>
            </div>
          </div>

          {/* Action 4 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-[#3F51B5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Payment Completed</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                25 patients successfully completed their pharmacy payments.
              </p>
            </div>
          </div>

          {/* Action 5 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-[#3F51B5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Payment Declined</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                2 patients faced issues with their payment methods.
              </p>
            </div>
          </div>

          {/* Action 6 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-[#3F51B5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Payment In Process</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                7 patients are currently processing their payments.
              </p>
            </div>
          </div>

          {/* Action 7 */}
          <div className="px-5 py-4 flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-[#3F51B5] dark:text-[#818CF8]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">Payment In Process</span>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                7 patients are currently processing their payments.
              </p>
            </div>
          </div>
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
          {/* Act 1 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">New user created</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">John Doe</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">2 minutes ago</span>
          </div>

          {/* Act 2 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">User updated</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Jane Smith</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">5 minutes ago</span>
          </div>

          {/* Act 3 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">User deleted</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Alice Johnson</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">10 minutes ago</span>
          </div>

          {/* Act 4 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">Password changed</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Bob Brown</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">15 minutes ago</span>
          </div>

          {/* Act 5 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">Profile picture updated</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Charlie Green</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">20 minutes ago</span>
          </div>

          {/* Act 6 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">Profile picture updated</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Charlie Green</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">20 minutes ago</span>
          </div>

          {/* Act 7 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">Profile picture updated</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Charlie Green</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">20 minutes ago</span>
          </div>

          {/* Act 8 */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">Profile picture updated</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Charlie Green</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">20 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
