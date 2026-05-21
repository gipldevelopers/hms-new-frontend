"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PatientBillingHeader } from "./PatientBillingHeader";
import { IPDBillingTable } from "./IPDBillingTable";
import { OPDBillingTable } from "./OPDBillingTable";

export default function PatientBillingMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ipd");

  const handleGenerateBill = () => {
    router.push(`/finance/patient-billing/create?type=${activeTab}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <PatientBillingHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onGenerateBill={handleGenerateBill}
      />

      {activeTab === "ipd" ? <IPDBillingTable /> : <OPDBillingTable />}
    </div>
  );
}

