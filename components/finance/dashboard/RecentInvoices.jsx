"use client";
import React from "react";
import Link from "next/link";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatCurrency = (value) => currency.format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};

const statusColor = (status) => {
  if (status === "Paid") return "bg-[#dcfce7] text-[#15803d]";
  if (status === "Partial") return "bg-[#e0e7ff] text-[#4338ca]";
  if (status === "Unpaid") return "bg-[#fee2e2] text-[#b91c1c]";
  return "bg-[#fef3c7] text-[#b45309]";
};

export function RecentInvoices({ invoices, loading, error }) {
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-[13px] text-[#64748b] dark:text-[#94a3b8]">
                  Loading recent invoices...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-[13px] text-[#b91c1c]">
                  {error}
                </td>
              </tr>
            ) : !invoices?.length ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-[13px] text-[#64748b] dark:text-[#94a3b8]">
                  No recent invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50/30 dark:hover:bg-[#101935]/30">
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{row.invoiceNumber}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.patientName}</td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#f1f5f9] dark:bg-[#334155] text-[#475569] dark:text-[#94a3b8]">
                      {row.uhid || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{formatCurrency(row.amount)}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{formatDate(row.createdDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
