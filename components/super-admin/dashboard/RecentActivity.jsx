import React from "react";

function ActivityItem({ activity, name, time }) {
  return (
    <div className="flex justify-between items-start py-0.5">
      <div className="flex gap-2">
        {/* The Dot */}
        <span className="text-[#101935] dark:text-blue-400 mt-1.5 font-bold text-base leading-none">
          •
        </span>
        <div>
          <p className="text-[13px] font-bold text-[#101935] dark:text-slate-200 leading-tight">
            {activity}
          </p>
          <p className="text-[12px] text-[#94A3B8] dark:text-slate-500 font-medium mt-0.5">
            {name}
          </p>
        </div>
      </div>
      <span className="text-[11px] text-[#94A3B8] dark:text-slate-500 font-medium whitespace-nowrap pt-1">
        {time}
      </span>
    </div>
  );
}

export function RecentActivity() {
  const activities = [
    { activity: "New user created", name: "John Doe", time: "2 minutes ago" },
    { activity: "User updated", name: "Jane Smith", time: "5 minutes ago" },
    { activity: "User deleted", name: "Alice Johnson", time: "10 minutes ago" },
    { activity: "Password changed", name: "Bob Brown", time: "15 minutes ago" },
    {
      activity: "Profile picture updated",
      name: "Charlie Green",
      time: "20 minutes ago",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header section with specific button style */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">
          Recent Activity
        </h3>
        <button className="text-[12px] font-semibold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1 rounded-[5px] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
          View all
        </button>
      </div>

      {/* Activity List with specific spacing */}
      <div className="p-6 space-y-4">
        {activities.map((item, index) => (
          <ActivityItem
            key={index}
            activity={item.activity}
            name={item.name}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
}
