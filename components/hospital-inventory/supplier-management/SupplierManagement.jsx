"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatCards } from "./StatCards";
import { SupplierTable } from "./SupplierTable";
import { SupplierDetailView } from "./SupplierDetailView";
import { AddSupplierWizard } from "./AddSupplierWizard";
import { toast } from "sonner";

// Initial mock data based directly on the provided screenshot
const INITIAL_SUPPLIERS = [
  { id: 1, name: "PharmaCorp Global", sku: "SUP-2024-001", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3456", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 2, name: "PharmaCorp Global", sku: "SUP-2024-002", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3456", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 3, name: "PharmaCorp Global", sku: "SUP-2024-003", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3458", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 4, name: "PharmaCorp Global", sku: "SUP-2024-004", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3456", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 5, name: "PharmaCorp Global", sku: "SUP-2024-005", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3456", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 6, name: "PharmaCorp Global", sku: "SUP-2024-006", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3458", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" },
  { id: 7, name: "PharmaCorp Global", sku: "SUP-2024-007", category: "Pharmaceuticals", contact: "Mark Stevenson", phone: "+1 (555) 012-3456", lastOrder: "Oct 24, 2023", rating: 4, status: "Active", email: "mark.s@pharmacorp.com", address: "12, Sourcing Valley, New Delhi, India" }
];

export function SupplierManagement({ slugs = [] }) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [viewingSupplier, setViewingSupplier] = useState(null);

  const supplierId = slugs[0] || "";
  const isAdding = supplierId === "add";

  // Sync viewingSupplier state with url dynamic slugs
  useEffect(() => {
    if (supplierId && supplierId !== "add") {
      const matched = suppliers.find(s => String(s.id) === String(supplierId));
      if (matched) {
        setViewingSupplier(matched);
      }
    } else {
      setViewingSupplier(null);
    }
  }, [supplierId, suppliers]);

  // Scroll to top when opening details or wizard
  useEffect(() => {
    if (viewingSupplier || isAdding) {
      const scrollableMain = document.querySelector("main");
      if (scrollableMain) {
        scrollableMain.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [viewingSupplier, isAdding]);

  const handleBack = () => {
    setViewingSupplier(null);
    router.push("/hospital-inventory/supplier");
  };

  const handleViewSupplier = (supplier) => {
    setViewingSupplier(supplier);
    router.push(`/hospital-inventory/supplier/${supplier.id}`);
  };

  const handleEditSupplier = (supplier) => {
    toast.info("Editing is supported via the Add Supplier flow.");
    router.push(`/hospital-inventory/supplier/add`);
  };

  const handleDeleteSupplier = (supplier) => {
    if (window.confirm(`Are you sure you want to remove ${supplier.name}?`)) {
      setSuppliers(suppliers.filter(s => s.id !== supplier.id));
      toast.success(`${supplier.name} removed successfully.`);
    }
  };

  const handleSaveSupplier = (savedSupplier) => {
    setSuppliers([savedSupplier, ...suppliers]);
    router.push("/hospital-inventory/supplier");
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {isAdding ? (
        <AddSupplierWizard
          onSave={handleSaveSupplier}
          onCancel={handleBack}
        />
      ) : viewingSupplier ? (
        <SupplierDetailView
          supplier={viewingSupplier}
          onBack={handleBack}
        />
      ) : (
        <>
          {/* Header block with stats cards */}
          <StatCards suppliers={suppliers} />

          {/* Supplier Directory Table */}
          <SupplierTable
            suppliers={suppliers}
            onViewSupplier={handleViewSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddSupplierClick={() => {
              router.push("/hospital-inventory/supplier/add");
            }}
            onCreatePOClick={() => {
              toast.success("Redirecting to Purchase Order builder...");
              router.push("/hospital-inventory/purchase/add");
            }}
          />
        </>
      )}

    </div>
  );
}
export default SupplierManagement;
