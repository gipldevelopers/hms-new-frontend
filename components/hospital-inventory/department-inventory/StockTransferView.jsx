"use client";

import React, { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

export function StockTransferView({ item, onBack, onTransferComplete }) {
  const [formData, setFormData] = useState({
    transferId: "TX-2024-995",
    fromDept: "Central Store",
    toDept: "O.T. Recovery",
    date: "2024-03-22",
    items: [
      {
        name: "Surgical Gloves Sterile",
        batch: "GLV-11",
        stock: "180 pr",
        qty: "50"
      },
      {
        name: item?.name || "Propofol 10mg/ml",
        batch: "PRP-24-A",
        stock: `${item?.qty || "3,100"} amp`,
        qty: "100"
      }
    ],
    notes: "Urgent restocking for evening neuro-surgeries."
  });

  const [dispatches, setDispatches] = useState([
    { id: "TX-2024-991", source: "Central Store", destination: "O.T. Recovery Unit", date: "2024-03-22", totalItems: 5 },
    { id: "TX-2024-988", source: "Central Pharmacy", destination: "Emergency Ward", date: "2024-03-21", totalItems: 3 },
    { id: "TX-2024-984", source: "Central Store", destination: "ICU Department B", date: "2024-03-20", totalItems: 12 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 }
  ]);

  const handleQtyChange = (idx, value) => {
    const updatedItems = [...formData.items];
    updatedItems[idx].qty = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const totalQty = formData.items.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    
    // Add new dispatch to recent
    const newDispatch = {
      id: formData.transferId,
      source: formData.fromDept,
      destination: `${formData.toDept} Unit`,
      date: formData.date,
      totalItems: totalQty
    };
    
    setDispatches([newDispatch, ...dispatches]);
    toast.success("Stock transfer dispatch created successfully!");

    if (onTransferComplete) {
      onTransferComplete();
    }
  };

  return (
    <div className="font-sans space-y-5 animate-in fade-in duration-200">
      
      {/* HEADER ROW */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-between shadow-none">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-800 dark:text-white leading-none">
              Stock Transfer
            </h1>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Form (40% width / 2-cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none space-y-5">
          
          <div>
            <span className="px-2 py-0.5 rounded-[3px] text-[9px] font-extrabold bg-[#2E37A4]/5 border border-[#2E37A4]/20 text-[#2E37A4] dark:bg-indigo-950/20 dark:border-indigo-900/30 uppercase tracking-wider">
              NEW DISPATCH
            </span>
            <h2 className="text-[15px] font-bold text-slate-850 dark:text-white mt-2 leading-none">
              Create Internal Stock Transfer
            </h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1 leading-normal">
              Move stock from main storage to a specific clinic ward
            </p>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            {/* Transfer ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Transfer ID</label>
              <input
                type="text"
                disabled
                className="w-full h-10 px-3 bg-slate-50/70 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] text-slate-450 dark:text-slate-500 font-semibold"
                value={formData.transferId}
              />
            </div>

            {/* Department row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">From Department</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.fromDept}
                    onChange={(e) => setFormData({ ...formData, fromDept: e.target.value })}
                  >
                    <option>Central Store</option>
                    <option>Central Pharmacy</option>
                    <option>Emergency Ward</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">To Department</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.toDept}
                    onChange={(e) => setFormData({ ...formData, toDept: e.target.value })}
                  >
                    <option>O.T. Recovery</option>
                    <option>Emergency Ward</option>
                    <option>ICU Department B</option>
                    <option>Outpatient Clinic</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Transfer Date</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] text-foreground font-semibold outline-none"
                  value={`${formData.date} (Today)`}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 block">Selected Items to Transfer</label>
              
              <div className="space-y-2">
                {formData.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 border border-[#e2e8f0] dark:border-slate-700 bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[5px]">
                    <div>
                      <div className="text-[12.5px] font-extrabold text-slate-800 dark:text-white leading-tight">{it.name}</div>
                      <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">
                        Batch: {it.batch} • Stock: {it.stock}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-bold text-slate-450 dark:text-slate-500">Qty:</span>
                      <input
                        type="text"
                        className="w-12 h-7 px-1.5 bg-white dark:bg-[#1e293b] border border-[#E2E8F0] dark:border-slate-700 rounded-[4px] text-[12px] font-bold text-center outline-none text-slate-800 dark:text-white"
                        value={it.qty}
                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Transfer Notes / Destination Purpose</label>
              <textarea
                rows={2}
                className="w-full p-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold resize-none leading-relaxed"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12.5px] font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Transfer Stock
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: Table (60% width / 3-cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col justify-between">
          
          <div className="pb-4">
            <h2 className="text-[15px] font-bold text-slate-850 dark:text-white leading-none">
              Recent Dispatches
            </h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1 leading-normal">
              Tracking current movement between wards
            </p>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-[#1e293b] flex-1 mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#0A0F1D] border-b border-[#e2e8f0] dark:border-slate-850">
                  <th className="py-3 px-4 text-[11px] font-extrabold text-slate-450 uppercase tracking-wider">Transfer ID</th>
                  <th className="py-3 px-4 text-[11px] font-extrabold text-slate-450 uppercase tracking-wider">Source</th>
                  <th className="py-3 px-4 text-[11px] font-extrabold text-slate-450 uppercase tracking-wider">Destination</th>
                  <th className="py-3 px-4 text-[11px] font-extrabold text-slate-450 uppercase tracking-wider">Date</th>
                  <th className="py-3 pr-4 text-[11px] font-extrabold text-slate-450 uppercase tracking-wider text-right">Total Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-800 text-[13px]">
                {dispatches.map((disp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-350">{disp.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-500">{disp.source}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-350">{disp.destination}</td>
                    <td className="py-3 px-4 font-medium text-slate-500">{disp.date}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className="inline-flex w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-[11.5px] font-bold text-slate-800 dark:text-slate-200">
                        {disp.totalItems}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StockTransferView;
