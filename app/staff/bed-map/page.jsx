"use client";

import React, { useState, useEffect } from "react";
import BedStats from "@/components/staff/bed-map/BedStats";
import BedHeader from "@/components/staff/bed-map/BedHeader";
import BedFilters from "@/components/staff/bed-map/BedFilters";
import BedGrid from "@/components/staff/bed-map/BedGrid";
import { toast } from "sonner";

export default function BedMapPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [myPatientIds, setMyPatientIds] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/bed-map/hierarchy", {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const hierarchy = await res.json();
      
      if (res.ok && Array.isArray(hierarchy)) {
        setData(hierarchy);

        // Only set initial selection if nothing is selected yet
        if (hierarchy.length > 0) {
        setSelectedDeptId(prev => {
          if (prev) return prev;
          return hierarchy[0].id;
        });
        
        setSelectedWardId(prev => {
          if (prev) return prev;
          const firstDept = hierarchy[0];
          return (firstDept.wards && firstDept.wards.length > 0) ? firstDept.wards[0].id : null;
        });
      }
    } else {
        toast.error(hierarchy.error || "Failed to fetch bed map hierarchy");
      }
    } catch (error) {
      toast.error("Failed to fetch bed map data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAssignments = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role !== 'STAFF') return;

      const res = await fetch(`/api/staff/my-patients?branchId=${user.branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMyPatientIds(data.map(p => p.id));
      }
    } catch (error) {
      console.error("Failed to fetch my patients:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMyAssignments();
  }, []);

  const selectedDept = data.find(d => d.id === selectedDeptId);
  const selectedWard = selectedDept?.wards.find(w => w.id === selectedWardId);
  const beds = selectedWard?.beds || [];

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.label.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === "Occupied") return bed.status?.toUpperCase() === 'OCCUPIED';
    if (activeFilter === "Vacant") return bed.status?.toUpperCase() === 'AVAILABLE';
    if (activeFilter === "Critical") return bed.admissions?.some(a => a.status === 'Critical');
    if (activeFilter === "My Patients") {
      return bed.admissions?.some(a => myPatientIds.includes(a.patientId));
    }

    return true;
  });

  // Dynamic Stats calculation
  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.status?.toUpperCase() === 'OCCUPIED').length,
    vacant: beds.filter(b => b.status?.toUpperCase() === 'AVAILABLE').length,
    cleaning: beds.filter(b => b.status?.toUpperCase() === 'CLEANING').length,
    critical: beds.filter(b => b.admissions?.some(a => a.status === 'Critical')).length || 0
  };

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold py-40">Initializing Bed Map...</div>;

  return (
    <div className="p-4 sm:p-5 bg-background min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-none">
          Bed Management
        </h1>
      </div>

      {/* Summary Statistics */}
      <BedStats stats={stats} />

      {/* Ward Information & Assignment */}
      <BedHeader 
        departments={data}
        selectedDept={selectedDept}
        selectedWard={selectedWard}
        onDeptChange={(deptId) => {
          setSelectedDeptId(deptId);
          const dept = data.find(d => d.id === deptId);
          if (dept && dept.wards.length > 0) {
            setSelectedWardId(dept.wards[0].id);
          } else {
            setSelectedWardId(null);
          }
        }}
        onWardChange={setSelectedWardId}
      />

      {/* Filters & Search */}
      <BedFilters 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        stats={stats}
      />

      {/* Main Bed Grid */}
      <BedGrid 
        beds={filteredBeds} 
        refresh={fetchData} 
        deptId={selectedDeptId}
        wardId={selectedWardId}
      />
      
    </div>
  );
}
