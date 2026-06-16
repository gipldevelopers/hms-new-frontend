"use client";

import React, { useState } from "react";

const defaultExpiryRisks = [
  {
    id: 1,
    name: "Propofol 10mg/mL Injection (20ml)",
    sku: "SKU-PRP-9821",
    location: "Central Pharmacy",
    batch: "B-PPF9021-A",
    expiry: "2025-04-12",
    daysLeft: "12 days left",
    qty: "1,450 vials",
    loss: "₹4,350"
  },
  {
    id: 2,
    name: "Propofol 10mg/mL Injection (20ml)",
    sku: "SKU-PRP-9821",
    location: "Central Pharmacy",
    batch: "B-PPF9021-A",
    expiry: "2025-04-12",
    daysLeft: "12 days left",
    qty: "1,450 vials",
    loss: "₹4,350"
  },
  {
    id: 3,
    name: "Propofol 10mg/mL Injection (20ml)",
    sku: "SKU-PRP-9821",
    location: "Central Pharmacy",
    batch: "B-PPF9021-A",
    expiry: "2025-04-12",
    daysLeft: "12 days left",
    qty: "1,450 vials",
    loss: "₹4,350"
  },
  {
    id: 4,
    name: "Propofol 10mg/mL Injection (20ml)",
    sku: "SKU-PRP-9821",
    location: "Central Pharmacy",
    batch: "B-PPF9021-A",
    expiry: "2025-04-12",
    daysLeft: "12 days left",
    qty: "1,450 vials",
    loss: "₹4,350"
  }
];

export function ExpiryRiskTable({ expiryRisks }) {
  const [items, setItems] = useState(defaultExpiryRisks);

  React.useEffect(() => {
    if (expiryRisks) {
      setItems(expiryRisks);
    }
  }, [expiryRisks]);

  const handleAction = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden mb-6">
      {/* Premium Integrated Header */}
      <div className="p-5 border-b border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
        <h3 className="text-[16px] font-bold text-slate-800 dark:text-white leading-none">
          Expiry Risk Management
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                ITEM DETAILS / SKU
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                BATCH NUMBER
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                EXPIRY DATE
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                REMAINING DAYS
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                QUANTITY
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                ESTIMATED LOSS
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-16 text-center text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                  No high-risk expiring items found. Good job!
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group"
                >
                  {/* Item Details */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800 dark:text-white text-[12.5px] leading-tight whitespace-nowrap">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] mt-1.5 whitespace-nowrap">
                      <span className="bg-[#EDF2F7] dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-[4px] font-extrabold text-[9.5px] uppercase tracking-wide whitespace-nowrap">
                        {item.sku}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#00A389] dark:text-[#00BFA5] font-bold text-[10.5px] whitespace-nowrap">{item.location}</span>
                    </div>
                  </td>

                  {/* Batch Number */}
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-[12.5px] font-semibold whitespace-nowrap">
                    {item.batch}
                  </td>

                  {/* Expiry Date */}
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-[12.5px] font-semibold whitespace-nowrap">
                    {item.expiry}
                  </td>

                  {/* Remaining Days */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF5F5] dark:bg-red-950/20 text-[#E53E3E] dark:text-red-400 whitespace-nowrap">
                      {item.daysLeft}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white text-[12.5px] whitespace-nowrap">
                    {item.qty}
                  </td>

                  {/* Estimated Loss */}
                  <td className="px-5 py-4 font-extrabold text-[#E53E3E] text-[12.5px] whitespace-nowrap">
                    {item.loss}
                  </td>

                  {/* Action buttons */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex justify-start gap-2 flex-nowrap whitespace-nowrap">
                      <button
                        onClick={() => handleAction(item.id)}
                        className="flex items-center justify-center px-3.5 py-1 bg-[#E6FFFA] border border-[#B2F5EA] text-[#319795] rounded-[4px] font-bold text-[11px] hover:bg-[#B2F5EA] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Transfer First
                      </button>
                      <button
                        onClick={() => handleAction(item.id)}
                        className="flex items-center justify-center px-3.5 py-1 bg-[#EDF2F7] dark:bg-slate-800 text-[#4A5568] dark:text-slate-300 rounded-[4px] font-bold text-[11px] hover:bg-[#E2E8F0] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Return Vendor
                      </button>
                    </div>
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

export default ExpiryRiskTable;
