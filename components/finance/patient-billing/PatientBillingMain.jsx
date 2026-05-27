"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PatientBillingHeader } from "./PatientBillingHeader";
import { IPDBillingTable } from "./IPDBillingTable";
import { OPDBillingTable } from "./OPDBillingTable";

export default function PatientBillingMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ipd");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab")?.toLowerCase();
      const saved = localStorage.getItem("billing_active_tab");

      let resolvedTab = "ipd";
      if (tabParam === "opd" || tabParam === "ipd") {
        resolvedTab = tabParam;
      } else if (saved === "opd" || saved === "ipd") {
        resolvedTab = saved;
      }
      setActiveTab(resolvedTab);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("billing_active_tab", activeTab);
      
      const url = new URL(window.location.href);
      url.searchParams.set("tab", activeTab);
      window.history.replaceState({}, "", url.toString());
    }
  }, [activeTab, isInitialized]);

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

