import React from "react";

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

const statusClass = (status) => {
  if (status === "Paid") return "bg-[#E7F9ED] text-[#2ECC71]";
  if (status === "No Bill") return "bg-[#FFF1F1] text-[#FF5C5C]";
  return "bg-[#FFF7ED] text-[#F97316]";
};

export function PatientsWithRunningBills({ bills, loading, error }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden font-sans transition-all shadow-none">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white font-inter">
          Patients with Running Bills
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                UHID
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Admission Date
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Current Bill
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Advance Paid
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Balance Due
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-[13px] text-gray-500 dark:text-slate-400">
                  Loading running bills...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-[13px] text-[#FF5C5C]">
                  {error}
                </td>
              </tr>
            ) : !bills?.length ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-[13px] text-gray-500 dark:text-slate-400">
                  No running bills found.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.admissionId} className="hover:bg-muted/30 transition-all">
                  <td className="px-6 py-3.5 text-[13px] font-bold text-[#3B82F6]">
                    {bill.uhid || "-"}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-gray-700 dark:text-slate-200 font-inter">
                    {bill.patientName}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                    {formatDate(bill.admissionDate)}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                    {formatCurrency(bill.currentBillAmount)}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                    {formatCurrency(bill.advancePaid)}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                    {formatCurrency(bill.balanceDue)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-inter">
                    <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${statusClass(bill.billingStatus)}`}>
                      {bill.billingStatus}
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
