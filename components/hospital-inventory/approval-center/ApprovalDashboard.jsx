"use client";

import React, { useState } from "react";
import ApprovalTable from "./ApprovalTable";
import { Search, ChevronDown } from "lucide-react";
import { PurchaseOrderDetailView } from "@/components/hospital-inventory/purchase-management/PurchaseOrderDetailView";
import { CreatePurchaseOrderModal } from "@/components/hospital-inventory/purchase-management/CreatePurchaseOrderModal";

export function ApprovalDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const handleEditClick = (itemOrOrder) => {
    // Check if it's already a full order object (from detailed view) or a row item (from table)
    const isFullOrder = !!itemOrOrder.poNumber;
    const mockOrder = isFullOrder ? itemOrOrder : {
      id: itemOrOrder.prNumber,
      poNumber: itemOrOrder.prNumber.replace("PR-", "PO-"),
      vendor: "Baxter Healthcare Corp",
      orderDate: itemOrOrder.date,
      expectedDelivery: "Oct 20, 2023",
      totalAmount: "₹53,100.00",
      payment: "PAID",
      orderStatus: "ORDERED",
      items: [
        { id: 1, name: "Propofol 10mg/mL Injection (20ml)", qty: 2500, unitPrice: 3.00, sku: "SKU-PRP-9021" },
        { id: 2, name: "Amoxicillin Trihydrate 500mg", qty: 10000, unitPrice: 0.15, sku: "SKU-AMX-1120" },
        { id: 3, name: "Disposable Syringes 5ml with Needle", qty: 15000, unitPrice: 0.30, sku: "SKU-SYR-85ML" }
      ]
    };
    setOrderToEdit(mockOrder);
    setIsPOModalOpen(true);
  };

  // If viewing details of a purchase order, render the detail view page
  if (viewingOrder) {
    return (
      <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen">
        <PurchaseOrderDetailView
          order={viewingOrder}
          onBack={() => setViewingOrder(null)}
          onEdit={() => handleEditClick(viewingOrder)}
        />
        {/* Render edit modal on detailed view screen if active */}
        <CreatePurchaseOrderModal
          isOpen={isPOModalOpen}
          onClose={() => {
            setIsPOModalOpen(false);
            setOrderToEdit(null);
          }}
          onSave={(updatedOrder) => {
            setIsPOModalOpen(false);
            setOrderToEdit(null);
            // Update viewingOrder to reflect the changes in the UI
            setViewingOrder(updatedOrder);
          }}
          orderToEdit={orderToEdit}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300 relative">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold text-slate-800 dark:text-white leading-none tracking-tight mt-2">
          Approval Requests
        </h1>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[6px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input Container */}
        <div className="relative flex-1 max-w-2xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Patient name / Order ID..."
            className="w-full pl-9 pr-4 py-2 text-[12px] bg-slate-50/50 dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2E37A4] dark:focus:ring-indigo-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Priority Filter */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[12px] font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Priority:Urgent</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          {/* All Filter */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[12px] font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>All</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>

      {/* Main Full-width Table Card */}
      <div className="w-full">
        <ApprovalTable
          onViewOrder={(item) => {
            const mockOrder = {
              id: item.prNumber,
              poNumber: item.prNumber.replace("PR-", "PO-"),
              vendor: "Global Health Medical",
              orderDate: item.date,
              expectedDelivery: "Oct 20, 2023",
              totalAmount: "₹53,100.00",
              payment: "PAID",
              orderStatus: item.status === "Ordered" ? "ORDERED" : "PARTIAL RECEIVED",
              items: [
                { id: 1, name: "Surgical Gloves", qty: 50, unitPrice: 200, total: 11800, sku: "SKU-882", unit: "Boxes" },
                { id: 2, name: "Scalpels", qty: 10, unitPrice: 1500, total: 17700, sku: "SKU-102", unit: "Units" }
              ]
            };
            setViewingOrder(mockOrder);
          }}
          onApproveAndPO={(item) => {
            setOrderToEdit(null);
            setIsPOModalOpen(true);
          }}
          onEditOrder={handleEditClick}
        />
      </div>

      {/* Render create/edit modal on list view screen */}
      <CreatePurchaseOrderModal
        isOpen={isPOModalOpen}
        onClose={() => {
          setIsPOModalOpen(false);
          setOrderToEdit(null);
        }}
        onSave={() => {
          setIsPOModalOpen(false);
          setOrderToEdit(null);
        }}
        orderToEdit={orderToEdit}
      />
    </div>
  );
}

export default ApprovalDashboard;
