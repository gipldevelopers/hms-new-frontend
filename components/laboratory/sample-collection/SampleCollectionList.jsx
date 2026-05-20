"use client";
import React, { useState } from "react";
import { SampleCollectionFilters } from "./SampleCollectionFilters";
import { SampleCollectionCard } from "./SampleCollectionCard";

const INITIAL_ORDERS = [
  {
    id: "robert-1",
    orderId: "ORD-1204",
    patientName: "Robert Fox",
    uhid: "UH-98234",
    ward: "IPD - Ward A, Bed 12",
    wardCategory: "Ward A",
    priority: "Urgent",
    orderedTime: "09:15 AM",
    tat1: "-15m",
    tests: "CBC, Lipid Profile, LFT",
    samplesNeeded: ["Blood-EDTA (3mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "10:30 AM",
    tat2: "45m",
    status: "Pending"
  },
  {
    id: "robert-2",
    orderId: "ORD-1204",
    patientName: "Robert Fox",
    uhid: "UH-98234",
    ward: "IPD - Ward A, Bed 12",
    wardCategory: "Ward A",
    priority: "Urgent",
    orderedTime: "09:15 AM",
    tat1: "-15m",
    tests: "CBC, Lipid Profile, LFT",
    samplesNeeded: ["Blood-EDTA (3mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "10:30 AM",
    tat2: "45m",
    status: "Pending"
  },
  {
    id: "robert-3",
    orderId: "ORD-1204",
    patientName: "Robert Fox",
    uhid: "UH-98234",
    ward: "IPD - Ward A, Bed 12",
    wardCategory: "Ward A",
    priority: "Urgent",
    orderedTime: "09:15 AM",
    tat1: "-15m",
    tests: "CBC, Lipid Profile, LFT",
    samplesNeeded: ["Blood-EDTA (3mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "10:30 AM",
    tat2: "45m",
    status: "Collected"
  },
  {
    id: "robert-4",
    orderId: "ORD-1204",
    patientName: "Robert Fox",
    uhid: "UH-98234",
    ward: "IPD - Ward A, Bed 12",
    wardCategory: "Ward A",
    priority: "Urgent",
    orderedTime: "09:15 AM",
    tat1: "-15m",
    tests: "CBC, Lipid Profile, LFT",
    samplesNeeded: ["Blood-EDTA (3mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "10:30 AM",
    tat2: "45m",
    status: "Pending"
  },
  {
    id: "robert-5",
    orderId: "ORD-1204",
    patientName: "Robert Fox",
    uhid: "UH-98234",
    ward: "IPD - Ward A, Bed 12",
    wardCategory: "Ward A",
    priority: "Urgent",
    orderedTime: "09:15 AM",
    tat1: "-15m",
    tests: "CBC, Lipid Profile, LFT",
    samplesNeeded: ["Blood-EDTA (3mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "10:30 AM",
    tat2: "45m",
    status: "Pending"
  },
  {
    id: "jane-1",
    orderId: "ORD-1205",
    patientName: "Jane Cooper",
    uhid: "UH-98235",
    ward: "IPD - Ward B, Bed 5",
    wardCategory: "Ward B",
    priority: "High",
    orderedTime: "09:30 AM",
    tat1: "20m",
    tests: "Thyroid Profile, HbA1c",
    samplesNeeded: ["Blood-EDTA (3mL)", "Serum Separation (4mL)"],
    sampleOrderedTime: "10:45 AM",
    tat2: "60m",
    status: "Pending"
  },
  {
    id: "albert-1",
    orderId: "ORD-1206",
    patientName: "Albert Flores",
    uhid: "UH-98236",
    ward: "IPD - Ward A, Bed 3",
    wardCategory: "Ward A",
    priority: "Normal",
    orderedTime: "10:00 AM",
    tat1: "50m",
    tests: "Urine Routine, Renal Function Test",
    samplesNeeded: ["Urine Container (10mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "11:15 AM",
    tat2: "90m",
    status: "Pending"
  },
  {
    id: "esther-1",
    orderId: "ORD-1207",
    patientName: "Esther Howard",
    uhid: "UH-98237",
    ward: "OPD - Clinic 2",
    wardCategory: "OPD",
    priority: "Urgent",
    orderedTime: "10:15 AM",
    tat1: "-5m",
    tests: "D-Dimer, Troponin I",
    samplesNeeded: ["Citrate-Blue (2.7mL)", "SST-Gold (5mL)"],
    sampleOrderedTime: "11:30 AM",
    tat2: "30m",
    status: "Pending"
  }
];

export function SampleCollectionList() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");

  // Handle marking a sample as collected (toggle supported)
  const handleMarkCollected = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // 1. Search Query (Patient Name or Order ID)
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.uhid.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Ward Category Filter
    let matchesWard = true;
    if (selectedWard !== "All Wards") {
      matchesWard = order.wardCategory === selectedWard || order.ward.includes(selectedWard);
    }

    // 3. Priority Filter
    let matchesPriority = true;
    if (selectedPriority !== "All Priorities") {
      matchesPriority = order.priority.toLowerCase() === selectedPriority.toLowerCase();
    }

    return matchesSearch && matchesWard && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <SampleCollectionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        wardsList={["All Wards", "Ward A", "Ward B", "OPD"]}
        prioritiesList={["All Priorities", "Urgent", "High", "Normal"]}
      />

      <div className="flex flex-col gap-[20px] w-full">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <SampleCollectionCard
              key={order.id || `${order.orderId}-${idx}`}
              order={order}
              onMarkCollected={handleMarkCollected}
            />
          ))
        ) : (
          <div className="bg-card border border-border rounded-[5px] p-[40px] text-center text-muted-foreground shadow-none">
            No sample collection orders match your search filters.
          </div>
        )}
      </div>
    </div>
  );
}
