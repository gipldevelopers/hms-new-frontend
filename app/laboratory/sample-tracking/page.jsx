"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SampleTrackingHeader } from "@/components/laboratory/sample-tracking/SampleTrackingHeader";
import { SampleTrackingFilters } from "@/components/laboratory/sample-tracking/SampleTrackingFilters";
import { SampleTrackingTable } from "@/components/laboratory/sample-tracking/SampleTrackingTable";

const INITIAL_SAMPLES = [
  {
    id: "sam-0",
    patientName: "Sarah Jenkins",
    uhid: "UHID-98234",
    tests: "CBC",
    testList: ["CBC"],
    status: "Processing",
    location: "Biochemistry Auto-Analyzer",
    timeElapsed: "30 mins ago"
  },
  {
    id: "sam-1",
    patientName: "Robert Fox",
    uhid: "UHID-98234",
    tests: "CBC + 2 more",
    testList: ["CBC", "Lipid Profile", "LFT"],
    status: "Received",
    location: "Ward A → Main Lab",
    timeElapsed: "15 mins ago"
  },
  {
    id: "sam-2",
    patientName: "Esther Howard",
    uhid: "UHID-98235",
    tests: "Lipid Profile",
    testList: ["Lipid Profile"],
    status: "Received",
    location: "Accessioning",
    timeElapsed: "45 mins ago"
  },
  {
    id: "sam-3",
    patientName: "Jenny Wilson",
    uhid: "UHID-98236",
    tests: "Lipid Profile",
    testList: ["Lipid Profile"],
    status: "Processing",
    location: "Biochemistry Auto-Analyzer",
    timeElapsed: "1h 20m ago"
  },
  {
    id: "sam-4",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Received",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  },
  {
    id: "sam-5",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Processing",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  },
  {
    id: "sam-6",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Received",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  },
  {
    id: "sam-7",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Received",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  },
  {
    id: "sam-8",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Processing",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  },
  {
    id: "sam-9",
    patientName: "Cameron Williamson",
    uhid: "UHID-98237",
    tests: "Thyroid Panel, HbA1c",
    testList: ["Thyroid Panel", "HbA1c"],
    status: "Processing",
    location: "Fridge A, Rack 2",
    timeElapsed: "3 hrs ago"
  }
];

export default function SampleTrackingPage() {
  const router = useRouter();
  const [samples] = useState(INITIAL_SAMPLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Labs");

  // Filter functionality
  const filteredSamples = samples.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uhid.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    const matchesLocation =
      selectedLocation === "All Labs" || item.location === selectedLocation;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleOpenDetails = (sample) => {
    router.push(`/laboratory/sample-tracking/detail?id=${sample.id}`);
  };

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <SampleTrackingHeader />

      <SampleTrackingFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <SampleTrackingTable
        samples={filteredSamples}
        onViewDetails={handleOpenDetails}
      />
    </div>
  );
}
