import React from "react";
import { ChevronDown } from "lucide-react";

export function RecentUsers() {
  const users = [
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      role: "Doctor",
      hospital: "City General",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      role: "Nurse",
      hospital: "Downtown Clinic",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      name: "Mike Johnson",
      email: "mikejohnson@gmail.com",
      role: "Physiotherapist",
      hospital: "Health Center",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      name: "Sarah Connor",
      email: "sarahconnor@gmail.com",
      role: "Surgeon",
      hospital: "Main Street Hospital",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Card Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Recent Users</h3>
        <button className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
          Monthly <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-white/5">
              <th className="px-6 py-3 text-left text-[13px] font-bold text-[#101935] dark:text-slate-200 border-b border-[#E7E8EB] dark:border-white/10">
                Profile
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-bold text-[#101935] dark:text-slate-200 border-b border-[#E7E8EB] dark:border-white/10">
                Email
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-bold text-[#101935] dark:text-slate-200 border-b border-[#E7E8EB] dark:border-white/10">
                Role
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-bold text-[#101935] dark:text-slate-200 border-b border-[#E7E8EB] dark:border-white/10">
                Hospital
              </th>
              <th className="px-6 py-3 text-right text-[13px] font-bold text-[#101935] dark:text-slate-200 border-b border-[#E7E8EB] dark:border-white/10">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                {/* Profile Column */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-[5px] object-cover border border-[#E7E8EB] dark:border-white/10"
                    />
                    <span className="text-[13px] font-medium text-[#334155] dark:text-slate-200">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email Column */}
                <td className="px-6 py-3">
                  <span className="text-[13px] font-medium text-[#334155] dark:text-slate-400">
                    {user.email}
                  </span>
                </td>

                {/* Role Column - Blue Pill Outline */}
                <td className="px-6 py-3">
                  <span className="inline-flex px-3 py-0.5 rounded-[5px] text-[11px] font-medium border border-[#4F46E5] text-[#4F46E5] dark:text-blue-400 bg-white dark:bg-slate-900 dark:border-blue-900">
                    {user.role}
                  </span>
                </td>

                {/* Hospital Column */}
                <td className="px-6 py-3">
                  <span className="text-[13px] font-medium text-[#334155] dark:text-slate-400">
                    {user.hospital}
                  </span>
                </td>

                {/* Status Column - Green/Red Filled Pills */}
                <td className="px-6 py-3 text-right">
                  <span
                    className={`inline-flex px-3 py-0.5 rounded-[5px] text-[11px] font-bold text-white shadow-sm ${
                      user.status === "Active" ? "bg-[#2ECC71]" : "bg-[#FF3B30]"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
