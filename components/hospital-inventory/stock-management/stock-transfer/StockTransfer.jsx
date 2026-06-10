"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export function StockTransfer({ slugs = [] }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [dispatches, setDispatches] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [transferId, setTransferId] = useState("");
  const [fromDept, setFromDept] = useState("Central Store");
  const [toDept, setToDept] = useState("O.T. Recovery Unit");
  const [transferDate, setTransferDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");

  // Fetch recent dispatches and active stock inventory items
  const fetchData = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      // 1. Fetch available stock items
      const itemsRes = await fetch(`${API_URL}/stock-inventory?branchId=${branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const itemsData = await itemsRes.json();
      if (itemsData.success) {
        setAvailableItems(itemsData.data || []);
      }

      // 2. Fetch recent dispatches
      const transRes = await fetch(`${API_URL}/stock-transfer?branchId=${branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const transData = await transRes.json();
      if (transData.success) {
        setDispatches(transData.data || []);
      }
    } catch (err) {
      console.error("Error fetching transfer module data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle auto-selected item from query parameters (e.g. from the Details page)
  React.useEffect(() => {
    if (availableItems.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryItemId = urlParams.get("itemId");
      if (queryItemId) {
        const matched = availableItems.find(x => x.id === queryItemId);
        if (matched && !items.some(x => x.id === matched.id)) {
          setItems([{
            id: matched.id,
            name: matched.name,
            sku: matched.sku,
            batch: matched.sku,
            stock: matched.qty,
            qty: 1
          }]);
        }
      }
    }
  }, [availableItems]);

  // Generate next transfer ID if empty
  React.useEffect(() => {
    if (!transferId) {
      setTransferId(`TX-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [transferId]);

  // Handle quantity change
  const handleQtyChange = (id, val) => {
    const numericVal = parseInt(val) || 0;
    setItems(items.map(item => item.id === id ? { ...item, qty: numericVal } : item));
  };

  // Submit transfer to backend
  const handleTransferSubmit = async (e) => {
    e.preventDefault();

    if (!fromDept || !toDept) {
      toast.error("Please select both source and destination departments");
      return;
    }

    if (fromDept === toDept) {
      toast.error("Source and destination departments cannot be the same");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item to transfer");
      return;
    }

    const invalidItem = items.find(item => item.qty <= 0);
    if (invalidItem) {
      toast.error(`Please enter a valid transfer quantity for ${invalidItem.name}`);
      return;
    }

    // Double check available stock
    for (const item of items) {
      const avail = parseFloat(item.stock) || 0;
      if (item.qty > avail) {
        toast.error(`Transfer quantity for ${item.name} exceeds available stock of ${item.stock}`);
        return;
      }
    }

    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const payload = {
        transferId,
        source: fromDept,
        destination: toDept,
        date: transferDate,
        items: items.map(x => ({ id: x.id, sku: x.sku, name: x.name, qty: String(x.qty) })),
        notes
      };

      const res = await fetch(`${API_URL}/stock-transfer?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Successfully transferred stock! ID: ${transferId}`);
        setTransferId(`TX-2026-${Math.floor(1000 + Math.random() * 9000)}`);
        setItems([]);
        setNotes("");
        fetchData();
      } else {
        toast.error(result.error || "Failed to complete stock transfer.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300 mt-3">

      {/* Title & Action Buttons Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Stock Transfer
        </h2>
      </div>

      {/* Sub-tabs List */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] dark:bg-[#1E293B]/60 rounded-[8px] border border-[#E2E8F0] dark:border-[#334155] w-fit">
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/stock-inventory")}
        >
          Stock Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/lab-inventory")}
        >
          Lab Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-[#2E37A4] text-white shadow-none cursor-pointer"
        >
          Stock Transfer
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/batch-expiry-tracking")}
        >
          Batch & Expiry Tracking
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left Column - Create Internal Stock Transfer Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-5 space-y-4 shadow-none">
          <form onSubmit={handleTransferSubmit} className="space-y-4">

            {/* Header info */}
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-extrabold bg-[#2E37A4]/10 text-[#2E37A4] dark:bg-[#5F69F8]/20 dark:text-[#5F69F8] uppercase tracking-wider">
                New Dispatch
              </span>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Create Internal Stock Transfer</h3>
              <p className="text-[12px] text-slate-400 font-medium">Move stock from main storage to a specific clinic ward</p>
            </div>

            <hr className="border-[#e2e8f0] dark:border-[#334155]" />

            {/* Transfer ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer ID</label>
              <input
                type="text"
                disabled
                value={transferId}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            {/* Source & Destination Wards Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From Department</label>
                <select
                  value={fromDept}
                  onChange={(e) => setFromDept(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                >
                  <option value="Central Store">Central Store</option>
                  <option value="Central Pharmacy">Central Pharmacy</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                  <option value="O.T. Recovery Unit">O.T. Recovery Unit</option>
                  <option value="ICU Department B">ICU Department B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">To Department</label>
                <select
                  value={toDept}
                  onChange={(e) => setToDept(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                >
                  <option value="O.T. Recovery Unit">O.T. Recovery Unit</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                  <option value="ICU Department B">ICU Department B</option>
                  <option value="Outpatient Clinic">Outpatient Clinic</option>
                  <option value="Central Store">Central Store</option>
                </select>
              </div>
            </div>

            {/* Transfer Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                />
                <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Add Item Selection Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Add Item to Transfer</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const selected = availableItems.find(x => x.id === val);
                  if (selected) {
                    if (items.some(x => x.id === selected.id)) {
                      toast.error("Item already added to transfer list.");
                      return;
                    }
                    setItems([...items, {
                      id: selected.id,
                      name: selected.name,
                      sku: selected.sku,
                      batch: selected.sku,
                      stock: selected.qty,
                      qty: 1
                    }]);
                  }
                  e.target.value = ""; // reset selection
                }}
                className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
              >
                <option value="">-- Select Item from Stock Inventory --</option>
                {availableItems.map(x => (
                  <option key={x.id} value={x.id}>{x.name} (Stock: {x.qty})</option>
                ))}
              </select>
            </div>

            {/* Selected Items */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Selected Items to Transfer</label>

              <div className="space-y-2.5">
                {items.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 font-semibold border border-dashed border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px]">
                    No items selected. Choose an item above to add.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-[#F8F9FC] dark:bg-[#0f172a]/20">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <div className="text-[11px] text-slate-400 font-semibold">
                          SKU: <span className="text-slate-500 dark:text-slate-300 font-bold">{item.sku}</span> &bull; Stock: <span className="text-slate-500 dark:text-slate-300 font-bold">{item.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400 font-bold">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            className="w-14 h-8 px-2 border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] rounded-[4px] text-[12px] font-extrabold text-center outline-none focus:border-[#2E37A4]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setItems(items.filter(x => x.id !== item.id))}
                          className="text-red-500 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transfer Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer Notes / Destination Purpose</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Urgent restocking for evening neuro-surgeries."
                className="w-full p-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] resize-none"
              />
            </div>

            {/* Transfer Button */}
            <button
              type="submit"
              className="w-full h-11 bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-extrabold text-white rounded-[5px] transition-all cursor-pointer shadow-none flex items-center justify-center"
            >
              Transfer Stock
            </button>

          </form>
        </div>

        {/* Right Column - Recent Dispatches Table Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden flex flex-col justify-start">

          <div className="p-4 pb-3 space-y-1">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Recent Dispatches</h3>
            <p className="text-[12px] text-slate-400 font-medium">Tracking current movement between wards</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px] text-left">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-b border-[#e2e8f0] dark:border-[#334155]">
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Transfer ID</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Source</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Destination</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-center uppercase tracking-wider">Total Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-semibold">
                      Loading stock transfer dispatches...
                    </td>
                  </tr>
                ) : dispatches.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-semibold">
                      No stock transfers recorded yet
                    </td>
                  </tr>
                ) : (
                  dispatches.map((disp) => (
                    <tr key={disp.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#2E37A4] dark:text-[#5F69F8]">{disp.transferId}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{disp.source}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{disp.destination}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100 text-slate-700 dark:text-slate-300">
                        {new Date(disp.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {disp.totalItems}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StockTransfer;
