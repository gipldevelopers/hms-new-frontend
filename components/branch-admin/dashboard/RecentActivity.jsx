"use client";

import React from "react";

const activities = [
  {
    action: "New user created",
    user: "John Doe",
    time: "2 minutes ago",
  },
  {
    action: "User updated",
    user: "Jane Smith",
    time: "5 minutes ago",
  },
  {
    action: "User deleted",
    user: "Alice Johnson",
    time: "10 minutes ago",
  },
  {
    action: "Password changed",
    user: "Bob Brown",
    time: "15 minutes ago",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Recent Activity
        </h3>
        <button className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors">
          View all
        </button>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="flex flex-col">
        {activities.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-start justify-between py-4">
              <div className="flex items-start gap-4">
                 <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1e293b] dark:bg-white flex-shrink-0"></div>
                 <div>
                    <h4 className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-tight">
                      {item.action}
                    </h4>
                    <p className="text-[12px] text-[#64748B] dark:text-slate-400 font-medium">{item.user}</p>
                 </div>
              </div>
              <span className="text-[10px] font-bold text-[#94A3B8] whitespace-nowrap">{item.time}</span>
            </div>
            {idx < activities.length - 1 && (
              <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      </div>
    </div>
  );
}
