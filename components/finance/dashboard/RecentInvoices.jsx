"use client";
import React from "react";
import Link from "next/link";

export function RecentInvoices() {
  const data = [
    { invoice: "#INV-2023-001", patient: "Robert Fox", uhid: "P-882910", amount: "₹450.00", date: "Oct 23, 2023", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
    { invoice: "#INV-2023-002", patient: "Sophia Turner", uhid: "P-882911", amount: "₹600.00", date: "Oct 24, 2023", status: "Paid", statusColor: "bg-[#dcfce7] text-[#15803d]" },
    { invoice: "#INV-2023-003", patient: "Michael Smith", uhid: "P-882912", amount: "₹750.00", date: "Oct 25, 2023", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
    { invoice: "#INV-2023-004", patient: "Emily Johnson", uhid: "P-882913", amount: "₹300.00", date: "Oct 26, 2023", status: "Overdue", statusColor: "bg-[#fee2e2] text-[#b91c1c]" },
    { invoice: "#INV-2023-005", patient: "Daniel Wilson", uhid: "P-882914", amount: "₹1,200.00", date: "Oct 27, 2023", status: "Paid", statusColor: "bg-[#dcfce7] text-[#15803d]" },
    { invoice: "#INV-2023-006", patient: "Olivia Brown", uhid: "P-882915", amount: "₹500.00", date: "Oct 28, 2023", status: "Pending", statusColor: "bg-[#fef3c7] text-[#b45309]" },
    { invoice: "#INV-2023-007", patient: "James Davis", uhid: "P-882916", amount: "₹900.00", date: "Oct 29, 2023", status: "Paid", statusColor: "bg-[#dcfce7] text-[#15803d]" },
    { invoice: "#INV-2023-008", patient: "Ava Miller", uhid: "P-882917", amount: "₹250.00", date: "Oct 30, 2023", status: "Overdue", statusColor: "bg-[#fee2e2] text-[#b91c1c]" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#334155]">
        <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Recent Billing Transactions</h2>
        <Link href="/finance/payment">
          <button className="text-[12px] font-semibold px-4 py-1.5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] transition-colors hover:bg-muted">
            View all
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] dark:bg-[#1e293b]">
            <tr>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Invoice ID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Patient</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">UHID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Total Amount</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Billing Date</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-gray-50/30 dark:hover:bg-[#101935]/30">
                <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{row.invoice}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.patient}</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#f1f5f9] dark:bg-[#334155] text-[#475569] dark:text-[#94a3b8]">
                    {row.uhid}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{row.amount}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] ${row.statusColor}`}>
                    {row.status}
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
