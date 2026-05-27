"use client";
import React, { useState } from "react";
import { PatientSearch } from "@/components/laboratory/test-orders/new/PatientSearch";
import { ClinicalInformation } from "@/components/laboratory/test-orders/new/ClinicalInformation";
import { TestSelection } from "@/components/laboratory/test-orders/new/TestSelection";
import { OrderSummary } from "@/components/laboratory/test-orders/new/OrderSummary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function NewTestOrderPage() {
  const [priority, setPriority] = useState("Normal");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [clinicalInfo, setClinicalInfo] = useState({
    doctorId: "",
    doctorName: "",
    departmentName: "",
    clinicalNotes: "",
  });

  const toggleTest = (test) => {
    setSelectedTests((prev) => {
      const exists = prev.some((t) => t.id === test.id);
      if (exists) {
        return prev.filter((t) => t.id !== test.id);
      } else {
        return [...prev, test];
      }
    });
  };

  return (
    <div className="p-5 bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-foreground leading-tight tracking-tight">
          New Test Order
        </h1>
      </div>

      <PatientSearch 
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        onDeselectPatient={() => {
          setSelectedPatient(null);
          setSelectedTests([]);
        }}
      />

      {selectedPatient && (
        <>
          <ClinicalInformation
            priority={priority}
            setPriority={setPriority}
            value={clinicalInfo}
            onChange={setClinicalInfo}
          />
          <TestSelection selectedTests={selectedTests} toggleTest={toggleTest} />
          <OrderSummary
            apiBase={API_BASE}
            getAuthHeaders={getAuthHeaders}
            selectedPatient={selectedPatient}
            selectedTests={selectedTests}
            priority={priority}
            clinicalInfo={clinicalInfo}
          />
        </>
      )}
    </div>
  );
}
