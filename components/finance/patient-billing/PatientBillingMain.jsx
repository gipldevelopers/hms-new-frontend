"use client";

import React, { useState } from "react";
import { PatientBillingHeader } from "./PatientBillingHeader";
import { IPDBillingTable } from "./IPDBillingTable";
import { OPDBillingTable } from "./OPDBillingTable";

export default function PatientBillingMain() {
  const [activeTab, setActiveTab] = useState("ipd");

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <PatientBillingHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "ipd" ? <IPDBillingTable /> : <OPDBillingTable />}
    </div>
  );
}
