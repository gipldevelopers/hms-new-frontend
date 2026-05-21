"use client";
import React from "react";
import { Eye } from "lucide-react";
import Link from "next/link";

export function TestOrderTable() {
  const orders = [
    {
      orderId: "ORD-1204",
      patientName: "Robert Fox",
      uhid: "UHID-98234",
      ageGen: "45/M",
      doctor: "Dr. Sarah Smith",
      tests: ["CBC", "LFT"],
      extraTests: 2,
      priority: "Urgent",
      priorityColor: "bg-rose-500",
      status: "Pending",
      statusColor: "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]",
      orderedAt: "10:30 AM",
      tat: "45 mins",
      tatColor: "text-rose-600 dark:text-rose-400"
    },
    {
      orderId: "ORD-1205",
      patientName: "Esther Howard",
      uhid: "UHID-98235",
      ageGen: "32/F",
      doctor: "Dr. Sarah Smith",
      tests: ["Lipid Profile"],
      extraTests: 0,
      priority: "Normal",
      priorityColor: "bg-emerald-500",
      status: "Collecting",
      statusColor: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
      orderedAt: "10:45 AM",
      tat: "25 mins",
      tatColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      orderId: "ORD-1205",
      patientName: "Esther Howard",
      uhid: "UHID-98235",
      ageGen: "32/F",
      doctor: "Dr. Sarah Smith",
      tests: ["Lipid Profile"],
      extraTests: 0,
      priority: "Normal",
      priorityColor: "bg-emerald-500",
      status: "Completed",
      statusColor: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]",
      orderedAt: "10:45 AM",
      tat: "25 mins",
      tatColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      orderId: "ORD-1206",
      patientName: "Jenny Wilson",
      uhid: "UHID-98236",
      ageGen: "28/F",
      doctor: "Dr. Sarah Smith",
      tests: ["Thyroid Panel", "HbA1c"],
      extraTests: 0,
      priority: "High",
      priorityColor: "bg-amber-500",
      status: "Collecting",
      statusColor: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
      orderedAt: "09:15 AM",
      tat: "2h 10m",
      tatColor: "text-amber-600 dark:text-amber-400"
    },
    {
      orderId: "ORD-1206",
      patientName: "Jenny Wilson",
      uhid: "UHID-98236",
      ageGen: "28/F",
      doctor: "Dr. Michael",
      tests: ["Thyroid Panel", "HbA1c"],
      extraTests: 0,
      priority: "High",
      priorityColor: "bg-amber-500",
      status: "Collecting",
      statusColor: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
      orderedAt: "09:15 AM",
      tat: "2h 10m",
      tatColor: "text-amber-600 dark:text-amber-400"
    },
    {
      orderId: "ORD-1207",
      patientName: "Cameron Williamson",
      uhid: "UHID-98237",
      ageGen: "61/M",
      doctor: "Dr. Sarah Smith",
      tests: ["Comprehensive Metabolic"],
      extraTests: 0,
      priority: "Normal",
      priorityColor: "bg-emerald-500",
      status: "Pending",
      statusColor: "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]",
      orderedAt: "08:00 AM",
      tat: "3h 45m",
      tatColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      orderId: "ORD-1208",
      patientName: "Brooklyn Simmons",
      uhid: "UHID-98238",
      ageGen: "19/F",
      doctor: "Dr. Sarah Smith",
      tests: ["Urinalysis", "Culture"],
      extraTests: 0,
      priority: "Urgent",
      priorityColor: "bg-rose-500",
      status: "Completed",
      statusColor: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]",
      orderedAt: "07:30 AM",
      tat: "4h 15m",
      tatColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      orderId: "ORD-1208",
      patientName: "Brooklyn Simmons",
      uhid: "UHID-98238",
      ageGen: "19/F",
      doctor: "Dr. Sarah Smith",
      tests: ["Urinalysis", "Culture"],
      extraTests: 0,
      priority: "Urgent",
      priorityColor: "bg-rose-500",
      status: "Completed",
      statusColor: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]",
      orderedAt: "07:30 AM",
      tat: "4h 15m",
      tatColor: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <div className="w-full">
      {/* Mobile view: Responsive card-based queue */}
      <div className="block sm:hidden space-y-4">
        {orders.map((row, index) => (
          <div key={index} className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-3 shadow-none">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-foreground">#{row.orderId}</span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${row.statusColor}`}>
                {row.status}
              </span>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-foreground">{row.patientName}</h4>
              <p className="text-[11px] text-muted-foreground font-semibold">
                {row.uhid} • {row.ageGen}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold border-t border-border pt-3">
              <div>
                <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Referring Doctor</span>
                <span className="text-foreground">{row.doctor}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">TAT / Ordered At</span>
                <span className={`${row.tatColor} block`}>{row.tat}</span>
                <span className="text-muted-foreground block text-[9px] mt-0.5">{row.orderedAt}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider mb-1.5">Priority</span>
              <div className="flex items-center gap-1.5 font-bold text-[12px]">
                <span className={`w-1.5 h-1.5 rounded-full ${row.priorityColor}`} />
                <span className="text-foreground">{row.priority}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-3 flex justify-between items-center gap-3">
              <div className="flex flex-wrap gap-1">
                {row.tests.map((test, tIdx) => (
                  <span key={tIdx} className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-muted text-foreground rounded">
                    {test}
                  </span>
                ))}
                {row.extraTests > 0 && (
                  <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                    +{row.extraTests}
                  </span>
                )}
              </div>
              
              <Link href={`/laboratory/test-orders/${row.orderId}?status=${row.status.toLowerCase()}`}>
                <button className="flex items-center gap-1 bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold px-3 py-1.5 rounded border border-border transition-colors cursor-pointer select-none">
                  <Eye size={13} />
                  <span>View</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet view: Table */}
      <div className="hidden sm:block bg-card text-card-foreground rounded-lg border border-border overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px] xl:min-w-0">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Patient Name</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Age/Gen</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Doctor</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Tests Ordered</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Priority</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Ordered At</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">TAT</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((row, index) => (
                <tr key={index} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3 text-[12px] font-bold text-foreground">
                    {row.orderId}
                  </td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{row.patientName}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">{row.uhid}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">
                    {row.ageGen}
                  </td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">
                    {row.doctor}
                  </td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.tests.map((test, tIdx) => (
                        <span key={tIdx} className="bg-muted px-2 py-0.5 rounded-[4px] text-[10px] font-bold text-foreground select-none">
                          {test}
                        </span>
                      ))}
                      {row.extraTests > 0 && (
                        <span className="text-[10px] text-muted-foreground font-bold pl-0.5">
                          +{row.extraTests} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.priorityColor}`} />
                      <span className="text-foreground">{row.priority}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">
                    {row.orderedAt}
                  </td>
                  <td className={`px-5 py-3 text-[12px] font-bold ${row.tatColor}`}>
                    {row.tat}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/laboratory/test-orders/${row.orderId}?status=${row.status.toLowerCase()}`}>
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted/50 transition-colors cursor-pointer">
                        <Eye size={15} />
                      </button>
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
