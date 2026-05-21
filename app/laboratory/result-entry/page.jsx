"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ResultsEntryHeader } from "@/components/laboratory/result-entry/ResultsEntryHeader";
import { ResultsEntryFilters } from "@/components/laboratory/result-entry/ResultsEntryFilters";
import { ResultsEntryList } from "@/components/laboratory/result-entry/ResultsEntryList";

const INITIAL_ITEMS = [
  {
    id: "re-0",
    patientName: "James Wilson",
    testName: "Complete Blood Count",
    status: "Urgent",
    timeElapsed: "10 mins ago"
  },
  {
    id: "re-1",
    patientName: "Robert Fox",
    testName: "Complete Blood Count",
    status: "Urgent",
    timeElapsed: "10 mins ago"
  },
  {
    id: "re-2",
    patientName: "Esther Howard",
    testName: "Lipid Profile",
    status: "High",
    timeElapsed: "25 mins ago"
  },
  {
    id: "re-3",
    patientName: "Esther Howard",
    testName: "Lipid Profile",
    status: "High",
    timeElapsed: "25 mins ago"
  },
  {
    id: "re-4",
    patientName: "Jenny Wilson",
    testName: "Liver Function Test",
    status: "Normal",
    timeElapsed: "1 hr ago"
  },
  {
    id: "re-5",
    patientName: "Cameron Williamson",
    testName: "Thyroid Panel",
    status: "Normal",
    timeElapsed: "2 hrs ago"
  },
  {
    id: "re-6",
    patientName: "Wade Warren",
    testName: "Comprehensive Metabolic",
    status: "Normal",
    timeElapsed: "3 hrs ago"
  }
];

export default function ResultsEntryPage() {
  const router = useRouter();
  const [items] = useState(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  // Derive counts dynamically
  const allCount = items.length;
  const urgentCount = items.filter((x) => x.status === "Urgent").length;
  const highCount = items.filter((x) => x.status === "High").length;

  // Filter items in real time
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "All" || item.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const handleViewDetails = (item) => {
    // Navigate to details/entry screen
    router.push(`/laboratory/result-entry/detail?id=${item.id}`);
  };

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <ResultsEntryHeader />

      <ResultsEntryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        allCount={allCount}
        urgentCount={urgentCount}
        highCount={highCount}
      />

      <ResultsEntryList
        items={filteredItems}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
