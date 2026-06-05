"use client";
import React, { useState } from "react";
import DepartmentTable from "./DepartmentTable";
import { ItemDetailView } from "../stock-management/stock-inventory/ItemDetailView";
import { CreateItemProfile } from "./CreateItemProfile";
import { StockTransferView } from "./StockTransferView";
import { toast } from "sonner";
import { X } from "lucide-react";

const INITIAL_DEPARTMENT_ITEMS = [
  {
    id: "1",
    sku: "ITM-90234",
    name: "Propofol 10mg/ml (20ml)",
    category: "Anesthetics",
    unit: "Ampoule",
    qty: 3100,
    minThreshold: 1000,
    expiry: "Valid",
    lastUpdated: "2 hrs ago",
    status: "In Stock",
    location: "Cold Vault Room B",
    minStock: 1500,
    batches: "4",
    notes: "Short-acting, intravenously administered anesthetic agent. Used for induction and maintenance of general anesthesia."
  },
  {
    id: "2",
    sku: "ITM-48202",
    name: "Surgical Gloves Sterile (Sz 7.5)",
    category: "Surgical Supplies",
    unit: "Pair",
    qty: 180,
    minThreshold: 500,
    expiry: "Valid",
    lastUpdated: "1 hrs ago",
    status: "Low",
    location: "Supply Closet A",
    minStock: 500,
    batches: "2",
    notes: "Powder-free sterile latex gloves for surgical procedures. Packaged in individual pairs."
  },
  {
    id: "3",
    sku: "ITM-11234",
    name: "Amoxicillin Trihydrate 500mg",
    category: "Antibiotics",
    unit: "Capsule",
    qty: 1200,
    minThreshold: 1500,
    expiry: "Expired",
    lastUpdated: "1 hrs ago",
    status: "Out of Stock",
    location: "Pharmacy Main Shelf",
    minStock: 1500,
    batches: "1",
    notes: "Broad-spectrum penicillin antibiotic used to treat bacterial infections."
  },
  {
    id: "4",
    sku: "ITM-77301",
    name: "Saline IV Solution 0.9% 500ml",
    category: "Intravenous Fluids",
    unit: "Bag",
    qty: 2400,
    minThreshold: 800,
    expiry: "Expiring Soon",
    lastUpdated: "1 hrs ago",
    status: "In Stock",
    location: "IV Fluids Stack Room",
    minStock: 800,
    batches: "6",
    notes: "Sodium chloride 0.9% intravenous infusion for fluid replenishment."
  },
  {
    id: "5",
    sku: "ITM-00293",
    name: "Paracetamol IV 10mg/ml 100ml",
    category: "Analgesics",
    unit: "Vial",
    qty: 420,
    minThreshold: 400,
    expiry: "Expired",
    lastUpdated: "1 hrs ago",
    status: "Out of Stock",
    location: "Cold Vault Room A",
    minStock: 400,
    batches: "3",
    notes: "Intravenous paracetamol for rapid relief of moderate pain or reduction of fever."
  },
  {
    id: "6",
    sku: "ITM-66231",
    name: "N95 Respirator Masks (Regular)",
    category: "PPE",
    unit: "Box of 20",
    qty: 85,
    minThreshold: 200,
    expiry: "Valid",
    lastUpdated: "1 hrs ago",
    status: "Low",
    location: "PPE Container Room",
    minStock: 200,
    batches: "2",
    notes: "Particulate filtering facepiece respirators meeting N95 standards."
  },
  {
    id: "7",
    sku: "ITM-33420",
    name: "Suture Vicryl 3-0 70cm",
    category: "Surgical Supplies",
    unit: "Box of 36",
    qty: 420,
    minThreshold: 150,
    expiry: "Expired",
    lastUpdated: "1 hrs ago",
    status: "In Stock",
    location: "Surgical Staging Rack B",
    minStock: 150,
    batches: "4",
    notes: "Synthetic absorbable sterile suture composed of copolymer of glycolide and lactide."
  },
  {
    id: "8",
    sku: "ITM-29103",
    name: "Heparin Sodium 5000 IU/ml",
    category: "Anticoagulants",
    unit: "Vial",
    qty: 0,
    minThreshold: 100,
    expiry: "Expired",
    lastUpdated: "1 hrs ago",
    status: "Out of Stock",
    location: "Cold Vault Room B",
    minStock: 100,
    batches: "0",
    notes: "Anticoagulant agent used to prevent and treat blood clots."
  }
];

export function DepartmentInventory() {
  const [items, setItems] = useState(INITIAL_DEPARTMENT_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Form State
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Anesthetics");
  const [unit, setUnit] = useState("Ampoule");
  const [qty, setQty] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const [expiry, setExpiry] = useState("Valid");
  const [notes, setNotes] = useState("");

  const handleOpenAddModal = () => {
    setIsAddingItem(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setSku(item.sku);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.unit);
    setQty(item.qty.toString());
    setMinThreshold(item.minThreshold.toString());
    setExpiry(item.expiry);
    setNotes(item.notes || "");
    setShowAddEditModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter item name");
      return;
    }
    const parsedQty = parseFloat(qty) || 0;
    const parsedThreshold = parseFloat(minThreshold) || 0;

    let status = "In Stock";
    if (parsedQty === 0) {
      status = "Out of Stock";
    } else if (parsedQty <= parsedThreshold) {
      status = "Low";
    }

    if (editingItem) {
      // Edit
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                sku,
                name,
                category,
                unit,
                qty: parsedQty,
                minThreshold: parsedThreshold,
                minStock: parsedThreshold,
                expiry,
                notes,
                status,
                lastUpdated: "Just now"
              }
            : item
        )
      );
      toast.success("Item updated successfully");
    } else {
      // Add
      const newItem = {
        id: (items.length + 1).toString(),
        sku,
        name,
        category,
        unit,
        qty: parsedQty,
        minThreshold: parsedThreshold,
        minStock: parsedThreshold,
        expiry,
        notes,
        status,
        lastUpdated: "Just now",
        location: "Department Cabinet A",
        batches: "1"
      };
      setItems((prev) => [...prev, newItem]);
      toast.success("Item added successfully");
    }
    setShowAddEditModal(false);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`${item.name} deleted successfully`);
    }
  };

  const handleExport = () => {
    toast.success("Exporting department stock list as Excel...");
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {isTransferring ? (
        <StockTransferView
          item={selectedItem}
          onBack={() => setIsTransferring(false)}
          onTransferComplete={() => {
            setIsTransferring(false);
            setSelectedItem(null);
          }}
        />
      ) : isAddingItem ? (
        <CreateItemProfile
          onCancel={() => setIsAddingItem(false)}
          onSave={(newItem) => {
            const added = {
              ...newItem,
              id: (items.length + 1).toString()
            };
            setItems([added, ...items]);
            setIsAddingItem(false);
          }}
        />
      ) : selectedItem ? (
        <ItemDetailView
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          onTransferStock={() => setIsTransferring(true)}
        />
      ) : (
        <DepartmentTable
          items={items}
          onViewItem={setSelectedItem}
          onEditItem={handleOpenEditModal}
          onDeleteItem={handleDeleteItem}
          onAddItemClick={handleOpenAddModal}
          onExportClick={handleExport}
        />
      )}

      {/* ADD / EDIT ITEM OVERLAY MODAL */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[150] p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] w-full max-w-[500px] shadow-2xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]">
              <h2 className="text-[16px] font-extrabold text-slate-800 dark:text-white">
                {editingItem ? "Edit Department Stock Item" : "Add Department Stock Item"}
              </h2>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-[4px] text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 text-[13px]">
              
              <div className="grid grid-cols-2 gap-4">
                {/* SKU Code */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>

                {/* Expiry State */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Expiry Status
                  </label>
                  <select
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Propofol 10mg/ml"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Anesthetics">Anesthetics</option>
                    <option value="Surgical Supplies">Surgical Supplies</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Intravenous Fluids">Intravenous Fluids</option>
                    <option value="Analgesics">Analgesics</option>
                    <option value="PPE">PPE</option>
                    <option value="Anticoagulants">Anticoagulants</option>
                  </select>
                </div>

                {/* Unit of Measure */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Unit of Measure
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ampoule, Vial, Pair"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Current Stock */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3100"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>

                {/* Min Stock / Threshold */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Min Stock Threshold
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1000"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Clinical Notes / Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Clinical notes, storage guidelines, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2E37A4] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e2e8f0] dark:border-[#334155]">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-slate-50 text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 cursor-pointer shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white cursor-pointer shadow-none"
                >
                  Save Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentInventory;
