"use client";

import React, { useState, useEffect } from "react";
import BedStats from "@/components/staff/bed-map/BedStats";
import BedHeader from "@/components/staff/bed-map/BedHeader";
import BedFilters from "@/components/staff/bed-map/BedFilters";
import BedGrid from "@/components/staff/bed-map/BedGrid";
import { toast } from "sonner";
import { Building2, Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SuperAdminBedMapPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchSearch, setBranchSearch] = useState("");

  // Persist selections to localStorage
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem("sa_bedmap_selectedBranchId", selectedBranch.id);
    } else {
      localStorage.removeItem("sa_bedmap_selectedBranchId");
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedDeptId) {
      localStorage.setItem("sa_bedmap_selectedDeptId", selectedDeptId);
    }
  }, [selectedDeptId]);

  useEffect(() => {
    if (selectedWardId) {
      localStorage.setItem("sa_bedmap_selectedWardId", selectedWardId);
    }
  }, [selectedWardId]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/branches`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setBranches(result.data);
        
        // Auto-select saved branch if exists
        const savedBranchId = localStorage.getItem("sa_bedmap_selectedBranchId");
        if (savedBranchId) {
          const found = result.data.find(b => b.id === savedBranchId);
          if (found) {
            setSelectedBranch(found);
            fetchData(found.id, true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchData = async (branchId, useSaved = false) => {
    if (!branchId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/bed-map/hierarchy?branchId=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const hierarchy = await res.json();
      
      if (res.ok && Array.isArray(hierarchy)) {
        setData(hierarchy);

        if (hierarchy.length > 0) {
          let activeDeptId = hierarchy[0].id;
          let activeWardId = hierarchy[0].wards && hierarchy[0].wards.length > 0 ? hierarchy[0].wards[0].id : null;

          if (useSaved) {
            const savedDeptId = localStorage.getItem("sa_bedmap_selectedDeptId");
            const savedWardId = localStorage.getItem("sa_bedmap_selectedWardId");

            const deptExists = hierarchy.find(d => d.id === savedDeptId);
            if (deptExists) {
              activeDeptId = savedDeptId;
              const wardExists = deptExists.wards && deptExists.wards.find(w => w.id === savedWardId);
              if (wardExists) {
                activeWardId = savedWardId;
              } else if (deptExists.wards && deptExists.wards.length > 0) {
                activeWardId = deptExists.wards[0].id;
              } else {
                activeWardId = null;
              }
            }
          }

          setSelectedDeptId(activeDeptId);
          setSelectedWardId(activeWardId);
        } else {
          setSelectedDeptId(null);
          setSelectedWardId(null);
        }
      } else {
        toast.error(hierarchy.error || "Failed to fetch bed map data");
      }
    } catch (error) {
      toast.error("Failed to fetch bed map data");
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    fetchData(branch.id, false);
  };

  const selectedDept = data.find(d => d.id === selectedDeptId);
  const selectedWard = selectedDept?.wards.find(w => w.id === selectedWardId);
  const beds = selectedWard?.beds || [];

  const filteredBeds = beds.filter(bed => 
    bed.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  );

  // Dynamic Stats calculation
  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.status?.toUpperCase() === 'OCCUPIED').length,
    vacant: beds.filter(b => b.status?.toUpperCase() === 'AVAILABLE').length,
    cleaning: beds.filter(b => b.status?.toUpperCase() === 'CLEANING').length,
    critical: beds.filter(b => b.admissions?.some(a => a.status === 'Critical')).length || 0
  };

  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Page Header with Branch Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-[22px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none tracking-tight">
          Global Bed Management
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 bg-white dark:bg-[#101935] px-4 h-[48px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:border-primary transition-all outline-none group min-w-[260px] shadow-none font-bold text-[13px]">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <span className={cn("truncate flex-1 text-left", !selectedBranch && "text-muted-foreground font-medium")}>
              {selectedBranch ? selectedBranch.name : "Select Branch to View Map"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] p-2 shadow-xl flex flex-col gap-1 rounded-[5px]">
            <div className="relative mb-2 px-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search branches..."
                className="w-full h-10 pl-9 pr-3 bg-[#F8F9FA] dark:bg-white/5 border border-[#E7E8EB] dark:border-white/5 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="max-h-[250px] overflow-y-auto no-scrollbar">
              {filteredBranches.map((branch) => (
                <DropdownMenuItem 
                  key={branch.id} 
                  onClick={() => handleBranchSelect(branch)}
                  className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold cursor-pointer rounded-[5px] mb-0.5"
                >
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{branch.name}</span>
                  {selectedBranch?.id === branch.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!selectedBranch ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/5 shadow-none">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary opacity-20" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white mb-1 tracking-tight">No Branch Selected</h3>
          <p className="text-[12px] text-gray-400 font-medium tracking-tight">Select a branch from the dropdown above to view its real-time bed map.</p>
        </div>
      ) : loading ? (
        <div className="p-10 text-center text-gray-400 font-bold py-40 uppercase tracking-widest text-[12px] animate-pulse">
          Fetching Branch Bed Map...
        </div>
      ) : (
        <>
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
          <BedFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Main Bed Grid */}
          <BedGrid 
            beds={filteredBeds} 
            refresh={() => fetchData(selectedBranch.id)} 
            deptId={selectedDeptId}
            wardId={selectedWardId}
            branchId={selectedBranch.id}
          />
        </>
      )}
      
    </div>
  );
}
