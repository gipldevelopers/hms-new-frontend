"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, Plus, Info, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// High quality mock catalog database
const PRODUCT_CATALOG = [
  { sku: "SKU-PRP-9021", name: "Propofol 10mg/mL Injection (20ml)", currentStock: "1,450 vials", defaultQty: 2500, defaultCost: 3.00, baseCost: 3.50, unitType: "vials" },
  { sku: "SKU-AMX-1120", name: "Amoxicillin Trihydrate 500mg", currentStock: "8,200 caps", defaultQty: 10000, defaultCost: 0.15, baseCost: 0.15, unitType: "caps" },
  { sku: "SKU-SYR-85ML", name: "Disposable Syringes 5ml with Needle", currentStock: "12,000 units", defaultQty: 15000, defaultCost: 0.30, baseCost: 0.30, unitType: "units" },
  { sku: "SKU-SAL-1022", name: "Saline Solution 0.9% (500ml)", currentStock: "3,100 bags", defaultQty: 1000, defaultCost: 1.20, baseCost: 1.40, unitType: "bags" },
  { sku: "SKU-PAR-3021", name: "Paracetamol 500mg Tablets", currentStock: "15,400 tabs", defaultQty: 5000, defaultCost: 0.05, baseCost: 0.06, unitType: "tabs" },
  { sku: "SKU-GLV-8800", name: "Surgical Gloves Sterile (Size 7.5)", currentStock: "4,000 pairs", defaultQty: 2000, defaultCost: 0.80, baseCost: 0.90, unitType: "pairs" }
];

const VENDORS_DATABASE = {
  "Baxter Healthcare Corp": {
    contractRef: "BAXTER-MED-2025",
    paymentTerms: "Net 45",
    primaryContact: "Johnathan Reed (Baxter)",
    dotColor: "bg-[#0F8A5F]"
  },
  "Global Health Medical": {
    contractRef: "GH-GLOBAL-2026",
    paymentTerms: "Net 30",
    primaryContact: "Sarah Jenkins (Global)",
    dotColor: "bg-blue-500"
  },
  "Medtronic Inc.": {
    contractRef: "MED-TREAT-2024",
    paymentTerms: "Net 60",
    primaryContact: "Michael Vance (Medtronic)",
    dotColor: "bg-amber-500"
  },
  "Surgical Supply Co.": {
    contractRef: "SURG-SUP-2025",
    paymentTerms: "Due on Receipt",
    primaryContact: "Robert Chen (Surgical)",
    dotColor: "bg-purple-500"
  },
  "Advanced Pharma": {
    contractRef: "ADV-PHAR-2026",
    paymentTerms: "Net 30",
    primaryContact: "Elena Rostova (Advanced)",
    dotColor: "bg-indigo-500"
  },
  "MedEquip Logistics": {
    contractRef: "MED-LOG-2025",
    paymentTerms: "Net 15",
    primaryContact: "David Miller (Logistics)",
    dotColor: "bg-[#e11d48]"
  }
};

const DELIVERY_STORES = [
  "Main Central Pharmacy Store",
  "Emergency Department Store",
  "General ICU Stock Room",
  "Surgical Ward Storage"
];

const SHIPPING_URGENCIES = [
  "⚡ Emergency Expedited (24h)",
  "Standard Delivery (3-5 business days)",
  "Next-Day Priority (48h)"
];

export function CreatePurchaseOrderModal({ isOpen, onClose, onSave, orderToEdit }) {
  const [vendor, setVendor] = useState("Baxter Healthcare Corp");
  const [poNumber, setPoNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [justification, setJustification] = useState(
    "Surgical supplies levels reached critical thresholds (less than 15 days of operating volume). Immediate fast-track shipment approved by Logistics Committee."
  );

  const [deliveryStore, setDeliveryStore] = useState("Main Central Pharmacy Store");
  const [shippingUrgency, setShippingUrgency] = useState("⚡ Emergency Expedited (24h)");

  const [lineItems, setLineItems] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const catalogRef = useRef(null);

  // Initialize form fields
  useEffect(() => {
    if (orderToEdit) {
      setPoNumber(orderToEdit.poNumber || "");
      setVendor(orderToEdit.vendor || "Baxter Healthcare Corp");

      const parseDate = (dStr) => {
        if (!dStr || dStr === "--" || dStr.toLowerCase() === "pending") return "";
        try {
          const dateObj = new Date(dStr);
          if (isNaN(dateObj.getTime())) return "";
          return dateObj.toISOString().split("T")[0];
        } catch (e) {
          return "";
        }
      };

      const today = new Date().toISOString().split("T")[0];
      setOrderDate(orderToEdit.orderDate ? parseDate(orderToEdit.orderDate) : today);

      if (orderToEdit.items && orderToEdit.items.length > 0) {
        setLineItems(orderToEdit.items.map(item => {
          const catalogItem = PRODUCT_CATALOG.find(c => c.name === item.name || c.sku === item.sku) || {};
          return {
            sku: item.sku || catalogItem.sku || "SKU-GEN",
            name: item.name,
            currentStock: catalogItem.currentStock || "N/A",
            qty: String(item.qty),
            unitPrice: String(item.unitPrice),
            baseCost: catalogItem.baseCost || item.unitPrice || 0,
            unitType: catalogItem.unitType || "units"
          };
        }));
      } else {
        setLineItems([
          {
            sku: "SKU-PRP-9021",
            name: "Propofol 10mg/mL Injection (20ml)",
            currentStock: "1,450 vials",
            qty: "2500",
            unitPrice: "3.00",
            baseCost: 3.50,
            unitType: "vials"
          }
        ]);
      }
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const today = new Date().toISOString().split("T")[0];
      setPoNumber(`PO-2026-${randomNum}`);
      setVendor("Baxter Healthcare Corp");
      setOrderDate(today);
      setJustification("Surgical supplies levels reached critical thresholds (less than 15 days of operating volume). Immediate fast-track shipment approved by Logistics Committee.");
      setDeliveryStore("Main Central Pharmacy Store");
      setShippingUrgency("⚡ Emergency Expedited (24h)");

      // Default line items matching the screenshot
      setLineItems([
        {
          sku: "SKU-PRP-9021",
          name: "Propofol 10mg/mL Injection (20ml)",
          currentStock: "1,450 vials",
          qty: "2500",
          unitPrice: "3.00",
          baseCost: 3.50,
          unitType: "vials"
        },
        {
          sku: "SKU-AMX-1120",
          name: "Amoxicillin Trihydrate 500mg",
          currentStock: "8,200 caps",
          qty: "10000",
          unitPrice: "0.15",
          baseCost: 0.15,
          unitType: "caps"
        },
        {
          sku: "SKU-SYR-85ML",
          name: "Disposable Syringes 5ml with Needle",
          currentStock: "12,000 units",
          qty: "15000",
          unitPrice: "0.30",
          baseCost: 0.30,
          unitType: "units"
        }
      ]);
    }
  }, [orderToEdit, isOpen]);

  // Close catalog popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setShowCatalog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close modal when pressing the Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddItemFromCatalog = (item) => {
    // Check if item is already added
    if (lineItems.some(i => i.sku === item.sku)) {
      toast.info(`${item.name} is already added.`);
      setShowCatalog(false);
      return;
    }

    setLineItems([
      ...lineItems,
      {
        sku: item.sku,
        name: item.name,
        currentStock: item.currentStock,
        qty: String(item.defaultQty),
        unitPrice: String(item.defaultCost),
        baseCost: item.baseCost,
        unitType: item.unitType
      }
    ]);
    toast.success(`${item.name} added to purchase order.`);
    setShowCatalog(false);
  };

  const handleRemoveLineItem = (index) => {
    if (lineItems.length === 1) {
      toast.error("At least one line item is required.");
      return;
    }
    const newItems = [...lineItems];
    newItems.splice(index, 1);
    setLineItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setLineItems(newItems);
  };

  // Math Calculations matching mockup logic
  const totalQty = lineItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);

  const grandTotal = lineItems.reduce((sum, item) => {
    const q = parseFloat(item.qty) || 0;
    const cost = parseFloat(item.unitPrice) || 0;
    return sum + (q * cost);
  }, 0);

  const preNegotiatedSavings = lineItems.reduce((sum, item) => {
    const q = parseFloat(item.qty) || 0;
    const cost = parseFloat(item.unitPrice) || 0;
    const base = parseFloat(item.baseCost) || cost;
    const diff = base - cost;
    return sum + (diff > 0 ? diff * q : 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!poNumber || !vendor || !orderDate) {
      toast.error("Please ensure PO Number, Vendor, and Date are set.");
      return;
    }

    const hasInvalidItem = lineItems.some(i => !i.name || parseFloat(i.qty) <= 0 || parseFloat(i.unitPrice) < 0);
    if (hasInvalidItem) {
      toast.error("Please fill in valid quantities and prices for all items.");
      return;
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return "--";
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return "--";
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    };

    const formattedTotalAmount = `₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const finalOrder = {
      id: orderToEdit ? orderToEdit.id : Date.now(),
      poNumber: poNumber,
      vendor: vendor,
      orderDate: formatDate(orderDate),
      expectedDelivery: "Pending", // Will be marked pending or calculated based on urgency
      totalAmount: formattedTotalAmount,
      payment: orderToEdit ? orderToEdit.payment : "PENDING",
      orderStatus: "ORDERED",
      items: lineItems.map(item => ({
        sku: item.sku,
        name: item.name,
        qty: parseFloat(item.qty) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0
      }))
    };

    if (onSave) {
      onSave(finalOrder);
    }
    onClose();
  };

  const selectedVendorDetails = VENDORS_DATABASE[vendor] || VENDORS_DATABASE["Baxter Healthcare Corp"];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[0.5px] transition-all"
      />
      {/* Modal Container */}
      <div className="relative w-full max-w-[1240px] max-h-[92vh] bg-white dark:bg-[#0F172A] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[6px] shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 overflow-y-auto no-scrollbar">

        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E8EB] dark:border-white/10">
          <h3 className="text-[17px] font-bold text-slate-800 dark:text-white">
            Create Purchase Order
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Two Column Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* LEFT COLUMN: Line Items & Justification (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">

              {/* Sourced Line Items Card */}
              <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e2e8f0] dark:border-[#334155] flex justify-between items-center bg-[#F8F9FC] dark:bg-[#101935]">
                  <span className="text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">
                    Sourced Line Items
                  </span>

                  {/* Browse Catalog Popover Button */}
                  <div className="relative" ref={catalogRef}>
                    <button
                      type="button"
                      onClick={() => setShowCatalog(!showCatalog)}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-[5px] border border-[#2E37A4]/25 text-[#2E37A4] dark:text-blue-400 hover:bg-[#2E37A4]/5 text-[11px] font-bold transition-all cursor-pointer bg-white dark:bg-[#1e293b]"
                    >
                      <Search size={12} />
                      Browse Catalog
                    </button>

                    {/* Catalog list dropdown */}
                    {showCatalog && (
                      <div className="absolute right-0 mt-1.5 w-[360px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-2xl z-50 p-2 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase border-b border-slate-100 dark:border-white/5 mb-1">
                          Select Item from Inventory Catalog
                        </div>
                        <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1">
                          {PRODUCT_CATALOG.map((p) => {
                            const isAdded = lineItems.some(i => i.sku === p.sku);
                            return (
                              <button
                                key={p.sku}
                                type="button"
                                disabled={isAdded}
                                onClick={() => handleAddItemFromCatalog(p)}
                                className={`w-full text-left p-2 rounded-[4px] flex justify-between items-center text-[12px] transition-colors ${isAdded
                                  ? "bg-slate-50 text-slate-350 dark:bg-slate-800/40 dark:text-slate-500 cursor-not-allowed"
                                  : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
                                  }`}
                              >
                                <div className="truncate flex-1 pr-2">
                                  <div className="font-bold truncate">{p.name}</div>
                                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{p.sku} • Stock: {p.currentStock}</div>
                                </div>
                                <span className={`text-[10.5px] font-extrabold shrink-0 ${isAdded ? "text-slate-400" : "text-[#2E37A4] dark:text-blue-400"}`}>
                                  {isAdded ? "Added" : "+ Add"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[12px]">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-[#101935]/40 text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155]">
                        <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]">Product / Description</th>
                        <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] text-right">Current Stock</th>
                        <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] text-center w-28">Order Qty</th>
                        <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] text-center w-28">Unit Cost</th>
                        <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] text-right">Total Price</th>
                        <th className="px-3 py-2.5 font-bold text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                      {lineItems.map((item, idx) => {
                        const costValue = parseFloat(item.unitPrice) || 0;
                        const qtyValue = parseInt(item.qty) || 0;
                        const rowTotal = costValue * qtyValue;
                        return (
                          <tr key={`${item.sku}-${idx}`} className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-all">
                            {/* Description */}
                            <td className="px-4 py-3">
                              <div className="font-extrabold text-slate-800 dark:text-white leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                                {item.sku}
                              </div>
                            </td>

                            {/* Stock */}
                            <td className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {item.currentStock}
                            </td>

                            {/* Quantity Input */}
                            <td className="px-4 py-3 text-center">
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                                className="w-[84px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-extrabold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors"
                              />
                            </td>

                            {/* Cost Input with prefix */}
                            <td className="px-4 py-3 text-center">
                              <div className="relative w-24 mx-auto">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                  ₹
                                </span>
                                <input
                                  type="text"
                                  value={item.unitPrice}
                                  onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                                  className="w-full h-8 pl-6 pr-2 text-left bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                />
                              </div>
                            </td>

                            {/* Computed Row Total */}
                            <td className="px-4 py-3 text-right font-extrabold text-slate-800 dark:text-white whitespace-nowrap text-[12.5px]">
                              ₹{rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>

                            {/* Delete Action */}
                            <td className="px-3 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLineItem(idx)}
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-[5px] transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Sourcing Justification / Instructions Area inside the card */}
                <div className="px-5 py-4 border-t border-[#e2e8f0] dark:border-[#334155] space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Sourcing Justification / Instructions
                  </label>
                  <textarea
                    rows="3"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Justification details..."
                    className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0E1526] border border-slate-200/60 dark:border-slate-800/40 rounded-[5px] text-[12.5px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Left Card Bottom metrics (rendered last) */}
                <div className="bg-[#F8F9FC] dark:bg-[#101935]/40 border-t border-[#e2e8f0] dark:border-[#334155] px-5 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Left stats */}
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Total Sourced Qty
                      </div>
                      <div className="text-[15px] font-extrabold text-slate-800 dark:text-white mt-1">
                        {totalQty.toLocaleString('en-IN')} units
                      </div>
                    </div>

                    {/* Vertical line separator */}
                    <div className="h-9 w-[1px] bg-slate-200 dark:bg-slate-700 self-center hidden sm:block" />

                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Pre-negotiated Savings
                      </div>
                      <div className="text-[15px] font-extrabold text-slate-800 dark:text-white mt-1">
                        ₹{preNegotiatedSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Grand Sourcing Total */}
                  <div className="text-right">
                    <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Grand Sourcing Total
                    </div>
                    <div className="text-[22px] font-extrabold text-slate-800 dark:text-white mt-0.5">
                      ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Supplier, Store and Urgency Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">

                {/* Supplier Details Card */}
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-3.5">
                  <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Supplier Details
                  </h4>

                  {/* Select Vendor dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">Select Vendor</label>
                    <div className="relative">
                      <select
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                        className="w-full h-10 pl-7 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                      >
                        {Object.keys(VENDORS_DATABASE).map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      {/* Green Dot / Color Dot absolute prefix */}
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${selectedVendorDetails.dotColor}`} />
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
                    </div>
                  </div>

                  {/* Subbox Metadata exactly matching screenshot */}
                  <div className="bg-[#F8F9FC] dark:bg-[#0A0F1D] p-3 rounded-[5px] border border-slate-200/50 dark:border-white/5 space-y-2 text-[12px]">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-400">Contract Ref:</span>
                      <span className="font-extrabold text-slate-850 dark:text-white uppercase">
                        {selectedVendorDetails.contractRef}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-400">Payment Terms:</span>
                      <span className="font-extrabold text-slate-850 dark:text-white">
                        {selectedVendorDetails.paymentTerms}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-400">Primary Contact:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedVendorDetails.primaryContact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery & Terms Card */}
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-3.5">
                  <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Delivery & Terms
                  </h4>

                  {/* Target Delivery Store dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">Target Delivery Store</label>
                    <div className="relative">
                      <select
                        value={deliveryStore}
                        onChange={(e) => setDeliveryStore(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-850 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                      >
                        {DELIVERY_STORES.map(store => (
                          <option key={store} value={store}>{store}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
                    </div>
                  </div>

                  {/* Shipping Urgency dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">Shipping Urgency</label>
                    <div className="relative">
                      <select
                        value={shippingUrgency}
                        onChange={(e) => setShippingUrgency(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-850 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                      >
                        {SHIPPING_URGENCIES.map(urgency => (
                          <option key={urgency} value={urgency}>{urgency}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Action buttons matching screenshot */}
            <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E7E8EB] dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-6 rounded-[5px] border border-[#EF4444] bg-white hover:bg-rose-50 text-[12px] font-bold text-[#EF4444] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-colors cursor-pointer"
              >
                Send to Vendor
              </button>
            </div>

        </form>

      </div>
    </div>
  );
}

export default CreatePurchaseOrderModal;
