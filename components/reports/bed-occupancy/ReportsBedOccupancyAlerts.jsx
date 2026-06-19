"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Beaker, Ambulance, Bell, Clock, CreditCard } from "lucide-react";

const alertStyles = {
  critical: {
    bg: "bg-[#FFF5F5] dark:bg-red-950/20",
    border: "border-red-100/50 dark:border-red-900/20",
    textColor: "text-[#EF4444]",
    msgColor: "text-[#7F1D1D] dark:text-red-300/80",
    icon: AlertCircle,
    button: "ACKNOWLEDGE"
  },
  lab: {
    bg: "bg-[#FFFBEB] dark:bg-amber-950/20",
    border: "border-amber-100/50 dark:border-amber-900/20",
    textColor: "text-[#D97706]",
    msgColor: "text-[#78350F] dark:text-amber-300/80",
    icon: Beaker,
    button: "VIEW RESULTS"
  },
  emergency: {
    bg: "bg-[#EFF6FF] dark:bg-blue-950/20",
    border: "border-blue-100/50 dark:border-blue-900/20",
    textColor: "text-[#3B82F6]",
    msgColor: "text-[#1E3A8A] dark:text-blue-300/80",
    icon: Ambulance,
    button: null
  },
  reminder: {
    bg: "bg-[#F8FAFC] dark:bg-slate-900/40",
    border: "border-slate-100 dark:border-slate-800/40",
    textColor: "text-[#64748B]",
    msgColor: "text-[#334155] dark:text-slate-400",
    icon: Bell,
    button: null
  }
};

const actionStyles = {
  delay: {
    bg: "bg-[#EEF2FF] dark:bg-indigo-950/40",
    textColor: "text-[#4F46E5] dark:text-[#818CF8]",
    icon: Clock
  },
  emergency: {
    bg: "bg-[#FFF1F1] dark:bg-red-950/40",
    textColor: "text-[#FF5C5C] dark:text-[#FCA5A5]",
    icon: AlertTriangle
  },
  payment_pending: {
    bg: "bg-[#EFF2FC] dark:bg-indigo-950/40",
    textColor: "text-[#3F51B5] dark:text-[#818CF8]",
    icon: CreditCard
  },
  payment_completed: {
    bg: "bg-[#EFF2FC] dark:bg-indigo-950/40",
    textColor: "text-[#3F51B5] dark:text-[#818CF8]",
    icon: CreditCard
  },
  payment_declined: {
    bg: "bg-[#EFF2FC] dark:bg-indigo-950/40",
    textColor: "text-[#3F51B5] dark:text-[#818CF8]",
    icon: CreditCard
  },
  payment_in_process: {
    bg: "bg-[#EFF2FC] dark:bg-indigo-950/40",
    textColor: "text-[#3F51B5] dark:text-[#818CF8]",
    icon: CreditCard
  }
};

export function ReportsBedOccupancyAlerts({ alerts = [], actions = [], activity = [] }) {
  const displayAlerts = alerts.length > 0 ? alerts : [
    { type: 'critical', title: 'Critical Patient Alert', message: 'Room 302: SpO2 levels dropping below 85%.' },
    { type: 'lab', title: 'Lab Result Pending', message: 'MRI Results for Patient #8829 are now ready for review.' },
    { type: 'emergency', title: 'Emergency Arrival', message: 'Ambulance #14 arriving in 4 minutes with trauma case.' },
    { type: 'reminder', title: 'Follow-up Reminder', message: 'Send discharge summaries for Ward 2C patients.' }
  ];

  const displayActions = actions.length > 0 ? actions : [
    { type: 'delay', title: 'Dr. Sarah Smith Delayed', description: 'Cardiology OPD is running 30 mins behind schedule.' },
    { type: 'emergency', title: 'Emergency Alert', description: 'Trauma case arriving in 5 mins. Prep Room 1.' },
    { type: 'payment_pending', title: 'Payment Pending', description: '3 patients checked out without completing pharmacy payment.' },
    { type: 'payment_completed', title: 'Payment Completed', description: '25 patients successfully completed their pharmacy payments.' },
    { type: 'payment_declined', title: 'Payment Declined', description: '2 patients faced issues with their payment methods.' },
    { type: 'payment_in_process', title: 'Payment In Process', description: '7 patients are currently processing their payments.' }
  ];

  const displayActivity = activity.length > 0 ? activity : [
    { title: 'New user created', user: 'John Doe', time: '2 minutes ago' },
    { title: 'User updated', user: 'Jane Smith', time: '5 minutes ago' },
    { title: 'User deleted', user: 'Alice Johnson', time: '10 minutes ago' },
    { title: 'Password changed', user: 'Bob Brown', time: '15 minutes ago' },
    { title: 'Profile picture updated', user: 'Charlie Green', time: '20 minutes ago' }
  ];

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
          {displayAlerts.map((alert, i) => {
            const style = alertStyles[alert.type] || alertStyles.reminder;
            const Icon = style.icon;
            
            return (
              <div key={i} className={`p-3 ${style.bg} rounded-lg flex items-start gap-3 border ${style.border}`}>
                <Icon className={`w-5 h-5 ${style.textColor} shrink-0 mt-0.5`} />
                <div className="flex flex-col gap-1.5">
                  <span className={`text-[12px] font-bold ${style.textColor}`}>{alert.title}</span>
                  <p className={`text-[11px] ${style.msgColor} font-medium leading-normal`}>
                    {alert.message}
                  </p>
                  {style.button && (
                    <button className={`text-[10px] font-extrabold ${style.textColor} self-start hover:underline tracking-wider mt-1`}>
                      {style.button}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
          {displayActions.map((act, i) => {
            const style = actionStyles[act.type] || actionStyles.delay;
            const Icon = style.icon;
            
            return (
              <div key={i} className="px-5 py-4 flex items-start gap-3.5">
                <div className={`w-9 h-9 ${style.bg} rounded-full flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${style.textColor}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-slate-200">{act.title}</span>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-snug">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })}
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
          {displayActivity.map((item, i) => (
            <div key={i} className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0"></span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-snug">{item.title}</span>
                  <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{item.user}</span>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium shrink-0 pt-0.5">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

