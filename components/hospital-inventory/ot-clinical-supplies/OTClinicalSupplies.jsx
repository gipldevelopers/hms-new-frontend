"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

// Import modular child components
import LogConsumptionForm from "./LogConsumptionForm";
import ConsumptionStatCard from "./ConsumptionStatCard";
import ConsumptionRecordsTable from "./ConsumptionRecordsTable";
import ConsumptionPeakHours from "./ConsumptionPeakHours";
import CriticalStockAlerts from "./CriticalStockAlerts";
import NewConsumptionLog from "./NewConsumptionLog";

export function AddSupplyItemModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Consumables | Sterile");
  const [qty, setQty] = useState("100");
  const [batch, setBatch] = useState("");
  const [unit, setUnit] = useState("Units");
  const [unitPrice, setUnitPrice] = useState("1.50");
  const [expiry, setExpiry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter an item name.");
      return;
    }
    onSave({
      name,
      sku,
      category,
      qty,
      batch: batch || `B-${Math.floor(1000 + Math.random() * 9000)}-X`,
      unit,
      unitPrice: parseFloat(unitPrice) || 0.0,
      expiry: expiry || "N/A"
    });
    // Reset form
    setName("");
    setSku("");
    setBatch("");
    setExpiry("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-[500px] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-2xl p-6 overflow-hidden">
        <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0] dark:border-[#334155] mb-5">
          <h3 className="text-[16px] font-extrabold text-slate-800 dark:text-white">
            Add Supply Item to Inventory
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 font-bold text-[20px] cursor-pointer">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Item Name</label>
            <input type="text" placeholder="e.g. Propofol 20ml Vial" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SKU */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">SKU Code</label>
              <input type="text" placeholder="e.g. SKU-102" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer">
                <option value="Consumables | Sterile">Consumables | Sterile</option>
                <option value="Instruments | Sterile">Instruments | Sterile</option>
                <option value="Supplies | Sterile">Supplies | Sterile</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Qty */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Initial Qty</label>
              <input type="number" placeholder="100" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" required />
            </div>

            {/* Unit */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Unit</label>
              <input type="text" placeholder="e.g. Units, Vials, Packs" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Batch */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Batch No.</label>
              <input type="text" placeholder="e.g. B-991" value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
            </div>

            {/* Unit Price */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Unit Price ($)</label>
              <input type="text" placeholder="e.g. 1.50" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
            </div>

            {/* Expiry */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Expiry</label>
              <input type="text" placeholder="e.g. 12/2026" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full h-10 px-3 bg-[#F1F5F9] dark:bg-[#0A0F1D] border border-transparent rounded-[5px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0] dark:border-[#334155] mt-5">
            <button type="button" onClick={onClose} className="h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-white font-bold transition cursor-pointer">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function OTClinicalSupplies({ slugs = [] }) {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  // Form State
  const [department, setDepartment] = useState("Main Operation Theatre");
  const [procedureType, setProcedureType] = useState("General Surgery");
  const [date, setDate] = useState("2023-10-27");
  const [itemName, setItemName] = useState("");
  const [batch, setBatch] = useState("B-2044-X");
  const [usedQty, setUsedQty] = useState(0);

  // Stats State
  const [totalConsumptionValue, setTotalConsumptionValue] = useState(0);
  const [budgetUtilization, setBudgetUtilization] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  // Modal State
  const [isAddSupplyModalOpen, setIsAddSupplyModalOpen] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`/api/ot-supplies?branchId=${branchId}&search=${searchValue}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
      toast.error("Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`/api/ot-supplies/stats?branchId=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setTotalConsumptionValue(json.data.totalConsumptionValue);
        setBudgetUtilization(json.data.budgetUtilization);
        setCriticalAlerts(json.data.criticalAlerts);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [searchValue]);

  const handleLogConsumptionSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!itemName.trim()) {
      toast.error("Please enter or select an item name.");
      return;
    }
    if (usedQty <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
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

      const res = await fetch(`/api/ot-supplies?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: itemName,
          batch: batch || `B-${Math.floor(1000 + Math.random() * 9000)}-X`,
          usedQty: parseInt(usedQty),
          unit: "Units",
          date,
          department,
          procedureType
        })
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Logged ${usedQty} units of ${itemName} successfully!`);
        setItemName("");
        setUsedQty(0);
        setBatch("B-2044-X");
        fetchRecords();
        fetchStats();
      } else {
        toast.error(json.error || "Failed to log consumption.");
      }
    } catch (err) {
      console.error("Error saving log:", err);
      toast.error("Network error. Failed to log consumption.");
    }
  };

  const handleAddSupplyItem = async (newItem) => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`/api/ot-supplies/items?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Successfully added ${newItem.name} to inventory!`);
        setIsAddSupplyModalOpen(false);
        fetchStats();
      } else {
        toast.error(json.error || "Failed to add supply item.");
      }
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("Network error. Failed to add item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`/api/ot-supplies/${id}?branchId=${branchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Consumption record deleted successfully.");
        fetchRecords();
        fetchStats();
      } else {
        toast.error(json.error || "Failed to delete record.");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Network error. Failed to delete record.");
    }
  };

  const handleExport = () => {
    try {
      if (!records || records.length === 0) {
        toast.error("No consumption records to export.");
        return;
      }

      const headers = ["Date", "Item Name", "Reference", "Batch No.", "Used Qty", "Unit", "Remaining Stock", "Stock Status", "Used By", "Department", "Procedure", "Status"];
      const rows = records.map(r => [
        r.date || new Date(r.createdAt).toISOString().slice(0, 10),
        r.name || "",
        r.ref || "",
        r.batch || "",
        r.usedQty || 0,
        r.unit || "Units",
        r.remainingStock || 0,
        r.stockStatus || "STABLE",
        r.usedBy || "",
        r.department || "",
        r.procedureType || "",
        r.status || "VERIFIED"
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `OT_Supply_Consumption_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Consumption records exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export records.");
    }
  };

  const handleGeneratePO = () => {
    toast.success("Purchase Order generated for critical items successfully!");
  };

  // Add Mode Check
  if (slugs[0] === "add") {
    return (
      <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
        <NewConsumptionLog 
          onCancel={() => router.push("/hospital-inventory/ot-supplies")}
          onSave={async (data) => {
            try {
              const token = localStorage.getItem("authtoken");
              const userStr = localStorage.getItem("user");
              if (!token || !userStr) {
                toast.error("Session expired.");
                return;
              }
              const user = JSON.parse(userStr);
              const branchId = user.branchId;

              const res = await fetch(`/api/ot-supplies?branchId=${branchId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  department: data.department,
                  procedureType: data.procedureType,
                  patientId: data.patientId,
                  date: data.date,
                  surgeon: data.surgeon,
                  items: data.items
                })
              });

              const json = await res.json();
              if (json.success) {
                toast.success("New consumption log saved successfully!");
                router.push("/hospital-inventory/ot-supplies");
              } else {
                toast.error(json.error || "Failed to save log entry.");
              }
            } catch (err) {
              console.error("Error saving log entry:", err);
              toast.error("Network error. Failed to save log entry.");
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
            OT Supply Consumption
          </h1>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#1e293b]/55 text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 transition-all cursor-pointer shadow-none"
          >
            <Download size={14} className="text-slate-500" />
            Export
          </button>
          <button
            onClick={() => router.push("/hospital-inventory/ot-supplies/add")}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus size={14} />
            New Log Entry
          </button>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Stats Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Log Consumption Form Card */}
        <div className="lg:col-span-2 h-full">
          <LogConsumptionForm
            department={department}
            setDepartment={setDepartment}
            procedureType={procedureType}
            setProcedureType={setProcedureType}
            date={date}
            setDate={setDate}
            itemName={itemName}
            setItemName={setItemName}
            batch={batch}
            setBatch={setBatch}
            usedQty={usedQty}
            setUsedQty={setUsedQty}
            onSubmit={handleLogConsumptionSubmit}
          />
        </div>

        {/* Stats Card */}
        <ConsumptionStatCard
          totalConsumptionValue={totalConsumptionValue}
          budgetUtilization={budgetUtilization}
        />

      </div>

      {/* Consumption Records Table Section */}
      <ConsumptionRecordsTable
        records={records}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onDelete={handleDelete}
      />

      {/* Bottom Row: Peak Hours & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Peak Hours Chart */}
        <div className="lg:col-span-3">
          <ConsumptionPeakHours records={records} />
        </div>

        {/* Critical Stock Alerts */}
        <div className="lg:col-span-2">
          <CriticalStockAlerts alerts={criticalAlerts} onGeneratePO={handleGeneratePO} />
        </div>

      </div>

      {/* Add Supply Modal */}
      <AddSupplyItemModal 
        isOpen={isAddSupplyModalOpen} 
        onClose={() => setIsAddSupplyModalOpen(false)} 
        onSave={handleAddSupplyItem} 
      />

    </div>
  );
}

export default OTClinicalSupplies;
