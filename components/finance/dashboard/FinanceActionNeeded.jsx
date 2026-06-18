"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Clock, CreditCard } from "lucide-react";

const iconForType = (type) => {
  if (type === "overdue-bill" || type === "high-balance") return AlertTriangle;
  if (type === "missing-ipd-bill") return Clock;
  return CreditCard;
};

const colorForPriority = (priority) => {
  if (priority === "high") {
    return { iconBg: "bg-[#FFF1F1]", iconColor: "text-[#FF5C5C]" };
  }

  return { iconBg: "bg-[#F0F2FF]", iconColor: "text-[#5C67FF]" };
};

const alertTitle = (alert) => {
  if (alert.type === "missing-ipd-bill") return "IPD Bill Not Generated";
  if (alert.type === "high-balance") return "High Balance Pending";
  if (alert.type === "overdue-bill") return "Overdue Bill";
  return "Finance Follow-up";
};

const alertDescription = (alert) => {
  if (alert.message) return `${alert.patientName} (${alert.uhid || "No UHID"}): ${alert.message}`;
  return `${alert.patientName} (${alert.uhid || "No UHID"}) has ${alert.status?.toLowerCase() || "pending"} amount due.`;
};

export function FinanceActionNeeded({ alerts, loading, error }) {
  const highPriorityAlerts = alerts?.highPriorityFinanceAlerts || [];

  return (
    <div className="w-full md:h-[350px] h-auto bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Action Needed
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="py-[20px] px-5 text-[13px] text-gray-500 dark:text-slate-400">Loading alerts...</div>
        ) : error ? (
          <div className="py-[20px] px-5 text-[13px] text-[#FF5C5C]">{error}</div>
        ) : highPriorityAlerts.length === 0 ? (
          <div className="flex items-start gap-4 py-[20px] px-5">
            <div className="w-10 h-10 rounded-full bg-[#E7F9ED] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                No High Priority Alerts
              </h4>
              <p className="text-[13px] text-[#64748b] dark:text-slate-400 leading-tight">
                No finance items currently require immediate action.
              </p>
            </div>
          </div>
        ) : (
          highPriorityAlerts.slice(0, 4).map((alert) => {
            const Icon = iconForType(alert.type);
            const colors = colorForPriority(alert.priority);

            return (
              <div
                key={`${alert.type}-${alert.id}`}
                className="flex items-start gap-4 py-[20px] px-5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white group-hover:text-primary transition-colors">
                    {alertTitle(alert)}
                  </h4>
                  <p className="text-[13px] text-[#64748b] dark:text-slate-400 leading-tight">
                    {alertDescription(alert)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
