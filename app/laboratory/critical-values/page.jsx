"use client";
import React, { useState, useEffect } from "react";
import { CriticalValuesHeader } from "@/components/laboratory/critical-values/CriticalValuesHeader";
import { CriticalValuesFilters } from "@/components/laboratory/critical-values/CriticalValuesFilters";
import { CriticalValuesList } from "@/components/laboratory/critical-values/CriticalValuesList";
import { AcknowledgeCriticalModal } from "@/components/laboratory/critical-values/AcknowledgeCriticalModal";
import { ReportCriticalModal } from "@/components/laboratory/critical-values/ReportCriticalModal";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("unacknowledged");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedAcknowledgeAlert, setSelectedAcknowledgeAlert] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleReportCritical = async (newData) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/laboratory/critical-values", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newData)
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Critical value reported successfully.");
        fetchAlerts();
      } else {
        toast.error(json.message || "Failed to report critical value.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error reporting critical value.");
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/laboratory/critical-values", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setAlerts(json.data);
      } else {
        toast.error(json.message || "Failed to fetch critical values.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateAlert = async (updatedItem) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/laboratory/critical-values/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedItem)
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Critical value updated successfully.");
        fetchAlerts();
      } else {
        toast.error(json.message || "Failed to update critical value.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating critical value.");
    }
  };

  const handleConfirmAcknowledge = async () => {
    if (!selectedAcknowledgeAlert) return;
    const nurse = selectedAcknowledgeAlert.notifiedNurse || "Nurse Clara";
    const time = selectedAcknowledgeAlert.notifiedTime || "09:45 AM";

    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/laboratory/critical-values/${selectedAcknowledgeAlert.id}/acknowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          acknowledgedBy: nurse,
          acknowledgedTime: time
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Critical value acknowledged successfully.");
        fetchAlerts();
        setSelectedAcknowledgeAlert(null);
      } else {
        toast.error(json.message || "Failed to acknowledge critical value.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error acknowledging critical value.");
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header section */}
      <CriticalValuesHeader unacknowledgedCount={unacknowledgedCount} onReportClick={() => setIsReportModalOpen(true)} />

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
        {isReportModalOpen && (
          <ReportCriticalModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            onSave={handleReportCritical}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
