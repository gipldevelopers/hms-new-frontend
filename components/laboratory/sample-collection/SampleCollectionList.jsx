"use client";
import React, { useState, useEffect, useCallback } from "react";
import { SampleCollectionFilters } from "./SampleCollectionFilters";
import { SampleCollectionCard } from "./SampleCollectionCard";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");

  // Map backend LabTestOrder models to the format expected by our UI cards
  const mapBackendOrderToFrontend = useCallback((backendOrder) => {
    const patient = backendOrder.patient || {};
    const patientName = patient.name || [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Patient";
    const uhid = patient.uhid || `UHID-${patient.id ? patient.id.slice(0, 8).toUpperCase() : "UNKNOWN"}`;
    
    // Format tests list as a comma-separated string
    const testsArray = Array.isArray(backendOrder.tests) ? backendOrder.tests : [];
    const testsString = testsArray.map(t => t.name).join(", ") || "Clinical Tests";
    
    // Derive ward/category
    const wardStr = patient.ward || (patient.bedNo ? `IPD - Ward A, Bed ${patient.bedNo}` : "IPD - Ward A, Bed 12");
    const wardCategory = wardStr.includes("Ward B") ? "Ward B" : wardStr.includes("OPD") ? "OPD" : "Ward A";

    // Derive samples needed dynamically based on test names
    const samplesSet = new Set();
    testsArray.forEach(t => {
      const nameLower = t.name.toLowerCase();
      if (nameLower.includes("cbc") || nameLower.includes("hemoglobin") || nameLower.includes("blood") || nameLower.includes("wbc") || nameLower.includes("rbc") || nameLower.includes("hematocrit")) {
        samplesSet.add("Blood-EDTA (3mL)");
      } else if (nameLower.includes("lipid") || nameLower.includes("cholesterol") || nameLower.includes("lft") || nameLower.includes("liver") || nameLower.includes("thyroid") || nameLower.includes("tsh") || nameLower.includes("renal") || nameLower.includes("rft") || nameLower.includes("kidney") || nameLower.includes("bun") || nameLower.includes("creatinine")) {
        samplesSet.add("SST-Gold (5mL)");
      } else if (nameLower.includes("urine") || nameLower.includes("urinalysis")) {
        samplesSet.add("Urine Container (10mL)");
      } else if (nameLower.includes("coagulation") || nameLower.includes("d-dimer") || nameLower.includes("citrate")) {
        samplesSet.add("Citrate-Blue (2.7mL)");
      } else {
        samplesSet.add("SST-Gold (5mL)"); // Default fallback
      }
    });
    
    const samplesNeeded = Array.from(samplesSet);
    if (samplesNeeded.length === 0) {
      samplesNeeded.push("Blood-EDTA (3mL)");
    }

    // Derive times
    const orderedDate = new Date(backendOrder.orderedAt || backendOrder.createdAt || new Date());
    const orderedTime = orderedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const sampleOrderedDate = new Date(orderedDate.getTime() + 15 * 60 * 1000); // 15 mins later
    const sampleOrderedTime = sampleOrderedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Map status: backend has statuses, frontend expects "Pending" or "Collected"
    const status = backendOrder.status === "Pending" ? "Pending" : "Collected";

    return {
      id: backendOrder.id,
      orderId: backendOrder.orderNumber || `ORD-${backendOrder.id.slice(0, 4).toUpperCase()}`,
      patientName,
      uhid,
      ward: wardStr,
      wardCategory,
      priority: backendOrder.priority || "Normal",
      orderedTime,
      tat1: status === "Collected" ? "30m" : "-15m",
      tests: testsString,
      samplesNeeded,
      sampleOrderedTime,
      tat2: status === "Collected" ? "Completed" : "45m",
      status
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/laboratory/test-orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data.map(mapBackendOrderToFrontend);
          setOrders(mapped);
        } else {
          toast.error("Failed to parse backend lab orders.");
        }
      } else {
        toast.error("Failed to load lab orders from server.");
      }
    } catch (err) {
      console.error("Error loading lab orders:", err);
      toast.error("Error loading lab orders.");
    } finally {
      setLoading(false);
    }
  }, [mapBackendOrderToFrontend]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle marking a sample as collected (calls backend API route)
  const handleMarkCollected = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/laboratory/test-orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error("Failed to update sample collection status on server.");
      }
    } catch (err) {
      console.error("Error updating sample status:", err);
      toast.error("Error updating sample status.");
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card border border-border rounded-[5px] shadow-none min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[13px] font-bold text-muted-foreground">Loading sample collections...</p>
      </div>
    );
  }

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
