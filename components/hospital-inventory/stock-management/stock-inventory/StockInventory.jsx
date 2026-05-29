"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InventoryTable } from "./InventoryTable";
import { ItemDetailView } from "./ItemDetailView";
import { CreateItemProfile } from "./CreateItemProfile";

const INITIAL_STOCK_ITEMS = [
  { id: 1, sku: "ITM-90234", name: "Propofol 10mg/ml (20ml)", category: "Anesthetics", unit: "Ampoule", qty: "3100", minStock: "1000", batches: "4", status: "In Stock", supplier: "Baxter Healthcare", minThreshold: "1000", notes: "Store in a cool, dry place. Keep out of reach of children.", stockHistory: [
    { id: 1, dateTime: "2026-05-27T10:00:00Z", type: "Initial Stock", qtyChanged: "+3000", user: "Inventory Manager", notes: "Opening stock balance" },
    { id: 2, dateTime: "2026-05-27T12:30:00Z", type: "Addition", qtyChanged: "+100", user: "Dr. Ayush Solanki", notes: "Emergency stock addition from central store" }
  ]},
  { id: 2, sku: "ITM-48202", name: "Surgical Gloves Sterile (Sz 7.5)", category: "Surgical Supplies", unit: "Pair", qty: "180", minStock: "500", batches: "1", status: "Low", supplier: "Ansell Med", minThreshold: "500", notes: "Low stock alert active.", stockHistory: [
    { id: 1, dateTime: "2026-05-26T08:00:00Z", type: "Initial Stock", qtyChanged: "+180", user: "Nurse Sarah K.", notes: "Initial audit" }
  ]},
  { id: 3, sku: "ITM-11234", name: "Amoxicillin Trihydrate 500mg", category: "Antibiotics", unit: "Capsule", qty: "1200", minStock: "1500", batches: "3", status: "Out of Stock", supplier: "Pfizer Inc.", minThreshold: "1500", notes: "Needs emergency order placement.", stockHistory: [
    { id: 1, dateTime: "2026-05-25T09:15:00Z", type: "Initial Stock", qtyChanged: "+1200", user: "Store Manager", notes: "Standard opening stock" }
  ]},
  { id: 4, sku: "ITM-77301", name: "Saline IV Solution 0.9% 500ml", category: "Intravenous Fluids", unit: "Bag", qty: "2400", minStock: "800", batches: "2", status: "In Stock", supplier: "Baxter Healthcare", minThreshold: "800", notes: "Verify seals before use.", stockHistory: [
    { id: 1, dateTime: "2026-05-24T14:20:00Z", type: "Initial Stock", qtyChanged: "+2400", user: "Lab Asst John D.", notes: "Main store consignment received" }
  ]},
  { id: 5, sku: "ITM-00293", name: "Paracetamol IV 10mg/ml 100ml", category: "Analgesics", unit: "Vial", qty: "420", minStock: "400", batches: "2", status: "Out of Stock", supplier: "GlaxoSmithKline", minThreshold: "400", notes: "Fast-moving consumable item.", stockHistory: [
    { id: 1, dateTime: "2026-05-23T11:00:00Z", type: "Initial Stock", qtyChanged: "+420", user: "Dr. Ayush Solanki", notes: "Standard audit" }
  ]},
  { id: 6, sku: "ITM-66231", name: "N95 Respirator Masks (Regular)", category: "PPE", unit: "Box of 20", qty: "85", minStock: "200", batches: "1", status: "Low", supplier: "3M Health", minThreshold: "200", notes: "Essential PPE gear.", stockHistory: [
    { id: 1, dateTime: "2026-05-22T08:30:00Z", type: "Initial Stock", qtyChanged: "+85", user: "Admin", notes: "Audit check" }
  ]},
  { id: 7, sku: "ITM-33420", name: "Suture Vicryl 3-0 70cm", category: "Surgical Supplies", unit: "Box of 36", qty: "420", minStock: "150", batches: "3", status: "In Stock", supplier: "Ethicon", minThreshold: "150", notes: "Keep in dry compartment.", stockHistory: [
    { id: 1, dateTime: "2026-05-21T07:15:00Z", type: "Initial Stock", qtyChanged: "+420", user: "Surgical Dept Head", notes: "Opening stock balance" }
  ]},
  { id: 8, sku: "ITM-29103", name: "Heparin Sodium 5000 IU/ml", category: "Anticoagulants", unit: "Vial", qty: "0", minStock: "100", batches: "0", status: "Out of Stock", supplier: "Sandoz", minThreshold: "100", notes: "High priority critical stock.", stockHistory: [
    { id: 1, dateTime: "2026-05-20T10:00:00Z", type: "Initial Stock", qtyChanged: "0", user: "Store Supervisor", notes: "Opening out of stock" }
  ]}
];

export function StockInventory({ slugs = [] }) {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL_STOCK_ITEMS);
  const [loading, setLoading] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  const itemId = slugs[0] || "";

  // Sync URL ID with details view
  useEffect(() => {
    if (itemId === "add") {
      setIsAddingItem(true);
      setViewingItem(null);
    } else if (itemId) {
      const matched = items.find(item => String(item.id) === String(itemId));
      if (matched) {
        setViewingItem(matched);
        setIsAddingItem(false);
      }
    } else {
      setViewingItem(null);
      setIsAddingItem(false);
    }
  }, [itemId, items]);

  useEffect(() => {
    if (triggerAddModal) {
      setIsAddingItem(true);
      setTriggerAddModal(false);
    }
  }, [triggerAddModal]);

  const handleBack = () => {
    setViewingItem(null);
    router.push("/hospital-inventory/stock/stock-inventory");
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    router.push(`/hospital-inventory/stock/stock-inventory/${item.id}`);
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {isAddingItem ? (
        <CreateItemProfile
          onCancel={() => {
            setIsAddingItem(false);
            if (itemId === "add") {
              router.push("/hospital-inventory/stock/stock-inventory");
            }
          }}
          onSave={(newItem) => {
            setItems([newItem, ...items]);
            setIsAddingItem(false);
            if (itemId === "add") {
              router.push("/hospital-inventory/stock/stock-inventory");
            }
          }}
        />
      ) : viewingItem ? (
        <ItemDetailView
          item={viewingItem}
          onBack={handleBack}
          onAddItem={() => router.push("/hospital-inventory/stock/stock-inventory/add")}
          onRefreshDetails={() => {
            // handle refresh
          }}
        />
      ) : (
        <InventoryTable
          items={items}
          setItems={setItems}
          onViewItem={handleViewItem}
          triggerAddModal={triggerAddModal}
          clearAddTrigger={() => setTriggerAddModal(false)}
          onAddClick={() => router.push("/hospital-inventory/stock/stock-inventory/add")}
        />
      )}

    </div>
  );
}

export default StockInventory;
