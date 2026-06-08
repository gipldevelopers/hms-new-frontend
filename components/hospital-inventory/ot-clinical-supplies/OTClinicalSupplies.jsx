"use client";

import React, { useState } from "react";
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

// Mock initial data matching the screenshot
const INITIAL_RECORDS = [
  {
    id: "1",
    name: "Surgical Sutures (Nylon)",
    ref: "Ref: 8823-PX",
    batch: "B-1029-A",
    usedQty: 12,
    unit: "Units",
    remainingStock: 480,
    stockStatus: "STABLE",
    usedBy: "Dr. Aris",
    usedById: "ID: 902",
    status: "VERIFIED"
  },
  {
    id: "2",
    name: "Propofol 20ml Vial",
    ref: "Ref: ANES-552",
    batch: "B-8832-C",
    usedQty: 5,
    unit: "Vials",
    remainingStock: 14,
    stockStatus: "CRITICAL",
    usedBy: "Elena R.",
    usedById: "ID: 1104",
    status: "VERIFIED"
  },
  {
    id: "3",
    name: "N95 Surgical Mask",
    ref: "Ref: PPE-20",
    batch: "B-4401-Z",
    usedQty: 50,
    unit: "Pcs",
    remainingStock: 1240,
    stockStatus: "STABLE",
    usedBy: "Admin Shift B",
    usedById: "",
    status: "VERIFIED"
  }
];

export function OTClinicalSupplies({ slugs = [] }) {
  const router = useRouter();
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchValue, setSearchValue] = useState("");

  // Form State
  const [department, setDepartment] = useState("Main Operation Theatre");
  const [procedureType, setProcedureType] = useState("General Surgery");
  const [date, setDate] = useState("2023-10-27");
  const [itemName, setItemName] = useState("");
  const [batch, setBatch] = useState("B-2044-X");
  const [usedQty, setUsedQty] = useState(0);

  // Stats calculation
  const totalConsumptionValue = 12408.50; // Mock base value
  const budgetUtilization = 64; // percentage

  const handleLogConsumptionSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!itemName.trim()) {
      toast.error("Please enter or select an item name.");
      return;
    }
    if (usedQty <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }

    const newRecord = {
      id: (records.length + 1).toString(),
      name: itemName,
      ref: "Ref: OT-" + Math.floor(100 + Math.random() * 900) + "-SUP",
      batch: batch || "B-" + Math.floor(1000 + Math.random() * 9000) + "-X",
      usedQty: parseInt(usedQty),
      unit: "Units",
      remainingStock: Math.floor(Math.random() * 500) + 10,
      stockStatus: Math.random() > 0.3 ? "STABLE" : "CRITICAL",
      usedBy: "Dr. Ayush",
      usedById: "ID: 304",
      status: "VERIFIED"
    };

    setRecords([newRecord, ...records]);
    toast.success(`Logged ${usedQty} units of ${itemName} successfully!`);

    // Clear item specific inputs
    setItemName("");
    setUsedQty(0);
  };

  const handleExport = () => {
    toast.success("Exporting OT Supply records as CSV...");
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
          onSave={(data) => {
            const newRecords = data.items.map((it, idx) => ({
              id: (records.length + idx + 1).toString(),
              name: it.name,
              ref: "Ref: OT-" + Math.floor(100 + Math.random() * 900) + "-SUP",
              batch: it.batch,
              usedQty: it.usedQty,
              unit: it.unit,
              remainingStock: Math.floor(Math.random() * 200) + 10,
              stockStatus: it.usedQty > 20 ? "CRITICAL" : "STABLE",
              usedBy: data.surgeon.split(" (")[0] || "Dr. Sarah Chen",
              usedById: "ID: " + Math.floor(100 + Math.random() * 900),
              status: "VERIFIED"
            }));
            setRecords([...newRecords, ...records]);
            router.push("/hospital-inventory/ot-supplies");
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
      />

      {/* Bottom Row: Peak Hours & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Peak Hours Chart */}
        <div className="lg:col-span-3">
          <ConsumptionPeakHours />
        </div>

        {/* Critical Stock Alerts */}
        <div className="lg:col-span-2">
          <CriticalStockAlerts onGeneratePO={handleGeneratePO} />
        </div>

      </div>

    </div>
  );
}

export default OTClinicalSupplies;
