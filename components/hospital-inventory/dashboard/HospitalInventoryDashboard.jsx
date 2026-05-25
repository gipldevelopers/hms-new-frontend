"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatCards } from "./StatCards";
import { InventoryTable } from "./InventoryTable";
import { ItemDetailView } from "./ItemDetailView";

export const MOCK_ITEMS = [
  { id: 1, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "45 Bottles", expiry: "2024-12-01", status: "LOW", supplier: "MedTech Supplies", minThreshold: "15", notes: "Store in a cool, dry place. Ensure caps are tightly sealed after usage." },
  { id: 2, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "LOW", supplier: "LifeScience Corp", minThreshold: "10", notes: "Low stock alert triggered." },
  { id: 3, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "Out of Stock", supplier: "MedTech Labs", minThreshold: "8", notes: "Needs emergency requisition." },
  { id: 4, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "2024-12-01", status: "In Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 5, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 6, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "Out of Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 7, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 8, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 9, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "2024-12-01", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 10, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "2024-12-01", status: "In Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
  { id: 11, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "2024-12-01", status: "Out of Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
];

export function HospitalInventoryDashboard({ slug }) {
  const router = useRouter();
  const [viewingItem, setViewingItem] = useState(null);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  // Sync viewingItem state with URL dynamic slug path
  useEffect(() => {
    if (slug) {
      const matched = MOCK_ITEMS.find(item => String(item.id) === String(slug));
      if (matched) {
        setViewingItem(matched);
      } else {
        setViewingItem(null);
      }
    } else {
      setViewingItem(null);
    }
  }, [slug]);

  // FIX: Scroll main container back to top immediately when a details view opens
  useEffect(() => {
    if (viewingItem) {
      const scrollableMain = document.querySelector("main");
      if (scrollableMain) {
        scrollableMain.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [viewingItem]);

  const handleBack = () => {
    setViewingItem(null);
    router.push("/hospital-inventory");
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    router.push(`/hospital-inventory/${item.id}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {viewingItem ? (
        <ItemDetailView
          item={viewingItem}
          onBack={handleBack}
          onAddItem={() => {
            setTriggerAddModal(true);
          }}
        />
      ) : (
        <>
          {/* Title Block matching system standard style */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* Overview Cards (Stat Cards) */}
          <StatCards />
        </>
      )}

      {/* Lab Inventory items & Filter Table - Always mounted but table/filters hidden when viewing item */}
      <InventoryTable
        onViewItem={handleViewItem}
        triggerAddModal={triggerAddModal}
        clearAddTrigger={() => setTriggerAddModal(false)}
        hideTableContent={!!viewingItem}
      />

    </div>
  );
}
