"use client";
import React from "react";
import { Eye, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PrescriptionQueue() {
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [doctorFilter, setDoctorFilter] = React.useState("All");

  const prescriptions = [
    { token: "RX-0045", patient: "Sarah Jenkins", department: "Emergency", doctor: "Dr. Smith", time: "10:42 AM", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
    { token: "RX-0047", patient: "Emma Watson", department: "Inpatient", doctor: "Dr. Patel", time: "10:30 AM", status: "Ready", statusColor: "bg-[#dcfce7] text-[#15803d]" },
    { token: "RX-0048", patient: "James Robert", department: "General Ward", doctor: "Dr. Adams", time: "10:15 AM", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
    { token: "RX-0049", patient: "Linda Davis", department: "Neurology", doctor: "Dr. Kim", time: "10:50 AM", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
        <div>
          <h1 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Prescription Queue</h1>
          <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-1 opacity-70">Manage and track all incoming prescriptions</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] opacity-50" />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white placeholder:text-[#64748b]/60 outline-none focus:border-primary transition-all shadow-none"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[120px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-all outline-none group data-[state=open]:border-primary">
                    <span className="truncate">{deptFilter}</span>
                    <ChevronDown className="w-4 h-4 text-[#64748b] group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[120px]">
                  {["All", "Emergency", "Cardiology", "Neurology"].map((dept) => (
                    <DropdownMenuItem key={dept} onClick={() => setDeptFilter(dept)} className="font-bold text-[13px]">
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative w-full md:w-[120px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-all outline-none group data-[state=open]:border-primary">
                    <span className="truncate">{doctorFilter}</span>
                    <ChevronDown className="w-4 h-4 text-[#64748b] group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[120px]">
                  {["All", "Dr. Smith", "Dr. Lee", "Dr. Kim"].map((doc) => (
                    <DropdownMenuItem key={doc} onClick={() => setDoctorFilter(doc)} className="font-bold text-[13px]">
                      {doc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] dark:bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Token</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Patient Name</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Department</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Doctor</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Time</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Status</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              {prescriptions.map((p, i) => (
                <tr key={i} className="transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{p.token}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{p.patient}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{p.department}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{p.doctor}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{p.time}</td>
                  <td className="px-6 py-4">
                    <Link href={
                      p.status === "Ready"
                        ? `/pharmacy/prescription-queue/${p.token}/ready`
                        : `/pharmacy/prescription-queue/${p.token}`
                    }>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] cursor-pointer ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={
                        p.status === "Ready"
                          ? `/pharmacy/prescription-queue/${p.token}/ready`
                          : `/pharmacy/prescription-queue/${p.token}`
                      }
                      className="text-[#64748b] hover:text-[#1e293b] dark:hover:text-white transition-colors cursor-pointer inline-block"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
