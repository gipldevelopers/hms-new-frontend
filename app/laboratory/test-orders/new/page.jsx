"use client";
import React, { useState } from "react";
import { PatientSearch } from "@/components/laboratory/test-orders/new/PatientSearch";
import { ClinicalInformation } from "@/components/laboratory/test-orders/new/ClinicalInformation";
import { TestSelection } from "@/components/laboratory/test-orders/new/TestSelection";
import { OrderSummary } from "@/components/laboratory/test-orders/new/OrderSummary";

export default function NewTestOrderPage() {
  const [priority, setPriority] = useState("Urgent");
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Default selected tests to match mockup totals on load once patient is chosen
  const [selectedTests, setSelectedTests] = useState([
    { id: "cbc", name: "Complete Blood Count (CBC)", code: "HEM-01", price: 45 },
    { id: "lipid", name: "Lipid Profile", code: "BIO-12", price: 65 },
    { id: "cmp", name: "Comprehensive Metabolic Panel", code: "BIO-15", price: 110 }
  ]);

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
        onDeselectPatient={() => setSelectedPatient(null)}
      />

      {selectedPatient && (
        <>
          <ClinicalInformation priority={priority} setPriority={setPriority} />
          <TestSelection selectedTests={selectedTests} toggleTest={toggleTest} />
          <OrderSummary selectedTests={selectedTests} />
        </>
      )}
    </div>
  );
}
