"use client";
import React, { useState } from "react";
import { CriticalValuesHeader } from "@/components/laboratory/critical-values/CriticalValuesHeader";
import { CriticalValuesFilters } from "@/components/laboratory/critical-values/CriticalValuesFilters";
import { CriticalValuesList } from "@/components/laboratory/critical-values/CriticalValuesList";
import { AcknowledgeCriticalModal } from "@/components/laboratory/critical-values/AcknowledgeCriticalModal";
import { AnimatePresence } from "framer-motion";

const INITIAL_CRITICAL_ALERTS = [
  {
    id: "cv-1",
    testName: "Potassium (K+)",
    value: "6.8 mEq/L",
    status: "unacknowledged",
    wardNotified: false,
    notifiedNurse: "",
    notifiedTime: "",
    time: "10:42 AM, Today",
    reportedBy: "Tech. John Doe",
    refRange: "3.5 - 5.1 mEq/L",
    patientName: "Robert Johnson",
    uhid: "UHID-882910",
    bedLabel: "ICU / Bed 4",
    attendingDoctor: "Dr. Emily Chen",
    orderNo: "ORD-2023-8912",
    department: "Biochemistry",
    acknowledgedBy: "",
    acknowledgedTime: ""
  },
  {
    id: "cv-2",
    testName: "Troponin I",
    value: "2.4 ng/mL",
    status: "unacknowledged",
    wardNotified: false,
    notifiedNurse: "",
    notifiedTime: "",
    time: "10:15 AM, Today",
    reportedBy: "Tech. Sarah Smith",
    refRange: "< 0.04 ng/mL",
    patientName: "Maria Garcia",
    uhid: "UHID-773102",
    bedLabel: "Emergency / Bay 2",
    attendingDoctor: "Dr. James Wilson",
    orderNo: "ORD-2023-8905",
    department: "Immunology",
    acknowledgedBy: "",
    acknowledgedTime: ""
  },
  {
    id: "cv-3",
    testName: "Hemoglobin",
    value: "6.2 g/dL",
    status: "acknowledged",
    wardNotified: true,
    notifiedNurse: "Nurse Clara",
    notifiedTime: "09:45 AM",
    time: "09:30 AM, Today",
    reportedBy: "Tech. Mike Brown",
    refRange: "12.0 - 15.5 g/dL",
    patientName: "William Davis",
    uhid: "UHID-991204",
    bedLabel: "Surgical / Bed 12",
    attendingDoctor: "Dr. Robert Taylor",
    orderNo: "ORD-2023-8890",
    department: "Hematology",
    acknowledgedBy: "Nurse Clara",
    acknowledgedTime: "09:45 AM"
  },
  {
    id: "cv-4",
    testName: "Hemoglobin",
    value: "6.2 g/dL",
    status: "acknowledged",
    wardNotified: true,
    notifiedNurse: "Nurse Clara",
    notifiedTime: "09:45 AM",
    time: "09:30 AM, Today",
    reportedBy: "Tech. Mike Brown",
    refRange: "12.0 - 15.5 g/dL",
    patientName: "William Davis",
    uhid: "UID-891204",
    bedLabel: "Surgical / Bed 12",
    attendingDoctor: "Dr. Robert Taylor",
    orderNo: "ORD-2023-8890",
    department: "Hematology",
    acknowledgedBy: "Nurse Clara",
    acknowledgedTime: "09:45 AM"
  },
  {
    id: "cv-5",
    testName: "Hemoglobin",
    value: "6.2 g/dL",
    status: "acknowledged",
    wardNotified: true,
    notifiedNurse: "Nurse Clara",
    notifiedTime: "09:45 AM",
    time: "09:30 AM, Today",
    reportedBy: "Tech. Mike Brown",
    refRange: "12.0 - 15.5 g/dL",
    patientName: "William Davis",
    uhid: "UHID-991204",
    bedLabel: "Surgical / Bed 12",
    attendingDoctor: "Dr. Robert Taylor",
    orderNo: "ORD-2023-8890",
    department: "Hematology",
    acknowledgedBy: "Nurse Clara",
    acknowledgedTime: "09:45 AM"
  }
];

export default function CriticalValuesPage() {
  const [alerts, setAlerts] = useState(INITIAL_CRITICAL_ALERTS);
  const [activeTab, setActiveTab] = useState("unacknowledged");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedAcknowledgeAlert, setSelectedAcknowledgeAlert] = useState(null);

  const handleUpdateAlert = (updatedItem) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleConfirmAcknowledge = () => {
    if (!selectedAcknowledgeAlert) return;
    const nurse = selectedAcknowledgeAlert.notifiedNurse || "Nurse Clara";
    const time = selectedAcknowledgeAlert.notifiedTime || "09:45 AM";

    handleUpdateAlert({
      ...selectedAcknowledgeAlert,
      status: "acknowledged",
      acknowledgedBy: nurse,
      acknowledgedTime: time
    });
  };

  // Derived filter logic
  const filteredAlerts = alerts.filter((item) => {
    // 1. Tab Status Filter
    if (item.status !== activeTab) return false;

    // 2. Department Filter
    if (selectedDept !== "all" && item.department !== selectedDept) return false;

    // 3. Date filter placeholder
    return true;
  });

  const unacknowledgedCount = alerts.filter((item) => item.status === "unacknowledged").length;
  const acknowledgedCount = alerts.filter((item) => item.status === "acknowledged").length;

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header section */}
      <CriticalValuesHeader unacknowledgedCount={unacknowledgedCount} />

      {/* Tabs and Filters */}
      <CriticalValuesFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        unacknowledgedCount={unacknowledgedCount}
        acknowledgedCount={acknowledgedCount}
      />

      {/* Alerts list display */}
      <CriticalValuesList
        items={filteredAlerts}
        onUpdate={handleUpdateAlert}
        onAcknowledge={(item) => setSelectedAcknowledgeAlert(item)}
      />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedAcknowledgeAlert && (
          <AcknowledgeCriticalModal
            isOpen={!!selectedAcknowledgeAlert}
            alertItem={selectedAcknowledgeAlert}
            onClose={() => setSelectedAcknowledgeAlert(null)}
            onConfirm={handleConfirmAcknowledge}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
