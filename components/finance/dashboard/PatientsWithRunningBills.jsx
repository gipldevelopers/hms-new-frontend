import React from "react";

export function PatientsWithRunningBills() {
  const patients = [
    {
      id: "#PT-4821",
      name: "Rajesh Gupta",
      ward: "ICU / Bed 4A",
      bill: "Dr. R. Sharma",
      status: "Discharge Initiated"
    },
    {
      id: "#PT-4820",
      name: "Meena Patel",
      ward: "Ward A / Bed 12",
      bill: "Dr. P. Mehta",
      status: "Active"
    },
    {
      id: "#PT-4819",
      name: "Suresh Kumar",
      ward: "ICU / Bed 3C",
      bill: "Dr. N. Verma",
      status: "Active"
    },
    {
      id: "#PT-4818",
      name: "Anita Desai",
      ward: "Ward B / Bed 7",
      bill: "Dr. L. Joshi",
      status: "Active"
    },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[6px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white font-inter">
          Patients with Running Bills
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-white/5 border-b border-[#E7E8EB] dark:border-white/10">
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Ward / Bed
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Current Bill
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-inter">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
            {patients.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-3.5 text-[13px] font-bold text-[#3B82F6] cursor-pointer hover:underline">
                  {p.id}
                </td>
                <td className="px-6 py-3.5 text-[13px] font-medium text-gray-700 dark:text-slate-200 font-inter">
                  {p.name}
                </td>
                <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                  {p.ward}
                </td>
                <td className="px-6 py-3.5 text-[13px] font-medium text-gray-500 dark:text-slate-400 font-inter">
                  {p.bill}
                </td>
                <td className="px-6 py-3.5 text-right font-inter">
                  <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${p.status === "Active"
                    ? "bg-[#E7F9ED] text-[#2ECC71]"
                    : "bg-[#FFF1F1] text-[#FF5C5C]"
                    }`}>
                    {p.status}
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
