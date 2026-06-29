import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, Plus } from "lucide-react";
import { ExpiredBatches } from "./ExpiredBatches";
import { Expiring30Days } from "./Expiring30Days";
import { Expiring60Days } from "./Expiring60Days";
import { ShowAllHealthy } from "./ShowAllHealthy";
import { BatchItemDetailView } from "./BatchItemDetailView";
import { ReturnVendorView } from "./ReturnVendorView";
import { API_URL } from "@/lib/api";

export function BatchExpiryTracking({ slugs = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState("All");
  const [activePill, setActivePill] = useState("Expired");
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnItem, setReturnItem] = useState(null);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [batchesData, setBatchesData] = useState({
    expired: [],
    expiring30: [],
    expiring60: [],
    healthy: []
  });
  const [loading, setLoading] = useState(false);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/batch-expiry?branchId=${branchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBatchesData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Handle view-detail slug detection and state sync
  useEffect(() => {
    if (slugs[0] === "view-detail" && slugs[1]) {
      const itemId = slugs[1];
      const allItems = [
        ...batchesData.expired,
        ...batchesData.expiring30,
        ...batchesData.expiring60,
        ...batchesData.healthy
      ];
      const found = allItems.find(x => x.id === itemId);
      if (found) {
        setSelectedItem(found);
      } else {
        setSelectedItem({ id: itemId });
      }
    } else {
      setSelectedItem(null);
    }
  }, [slugs, batchesData]);

  const handleViewDetail = (item) => {
    router.push(`/hospital-inventory/stock/batch-expiry-tracking/view-detail/${item.id}`);
  };

  const handleBackFromDetail = () => {
    router.push("/hospital-inventory/stock/batch-expiry-tracking");
  };

  const categories = ["All", "Anesthetics", "Surgical Supplies", "Antibiotics", "Intravenous Fluids"];
  const rooms = ["All", "Central Pharmacy", "O.T. Recovery Unit", "Main Store", "Cold Storage A", "Anesthesia Vault"];

  // Click outside to close dropdowns
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {returnItem ? (
        <ReturnVendorView item={returnItem} onBack={() => setReturnItem(null)} onSuccess={() => { setReturnItem(null); fetchBatches(); }} />
      ) : selectedItem ? (
        <BatchItemDetailView item={selectedItem} onBack={handleBackFromDetail} />
      ) : (
        <>
          {/* Premium Header matching mockup */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
              Batch & Expiry Tracking
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  toast.success("Opening add stock workflow!");
                  router.push("/hospital-inventory/stock/stock-inventory/add");
                }}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
              >
                <Plus size={14} />
                Add Stock
              </button>
            </div>
          </div>

          {/* Sub-tabs List */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] dark:bg-[#1E293B]/60 rounded-[8px] border border-[#E2E8F0] dark:border-[#334155] w-fit">
            <button
              className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
              onClick={() => router.push("/hospital-inventory/stock/stock-inventory")}
            >
              Stock Inventory
            </button>
            <button
              className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
              onClick={() => router.push("/hospital-inventory/stock/lab-inventory")}
            >
              Lab Inventory
            </button>
            <button
              className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
              onClick={() => router.push("/hospital-inventory/stock/stock-transfer")}
            >
              Stock Transfer
            </button>
            <button
              className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-[#2E37A4] text-white shadow-none cursor-pointer"
            >
              Batch & Expiry Tracking
            </button>
          </div>

          {/* Search & Dynamic Filters Controls Bar */}
          <div ref={dropdownRef} className="relative flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search batch, items, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-[#2E37A4] dark:focus:border-[#5F69F8] outline-none transition-all"
              />
            </div>

            {/* Dropdowns Filters */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                  className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none min-w-[140px]"
                >
                  <span>Category: {selectedCategory}</span>
                  <ChevronDown size={14} className="opacity-60" />
                </button>
                {activeDropdown === "category" && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg z-50 py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          selectedCategory === cat ? "text-[#2E37A4] dark:text-[#5F69F8]" : "text-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Storage Room Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "room" ? null : "room")}
                  className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none min-w-[170px]"
                >
                  <span>Storage Room: {selectedRoom}</span>
                  <ChevronDown size={14} className="opacity-60" />
                </button>
                {activeDropdown === "room" && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg z-50 py-1">
                    {rooms.map((rm) => (
                      <button
                        key={rm}
                        onClick={() => {
                          setSelectedRoom(rm);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          selectedRoom === rm ? "text-[#2E37A4] dark:text-[#5F69F8]" : "text-foreground"
                        )}
                      >
                        {rm === "All" ? "All Rooms" : rm}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Pills Filter Row */}
          <div className="flex flex-wrap gap-2 items-center">
            {["Expired", "Expiring in 30 Days", "Expiring in 60 Days", "Show All (Healthy)"].map((pill) => {
              const isActive = activePill === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActivePill(pill)}
                  className={cn(
                    "px-4 py-1.5 text-[11px] font-bold rounded-[5px] transition-all border cursor-pointer",
                    isActive
                      ? "bg-[#2E37A4] border-[#2E37A4] text-white shadow-sm"
                      : "bg-white dark:bg-[#1e293b] border-[#e2e8f0] dark:border-[#334155] text-slate-500 dark:text-slate-400 hover:bg-slate-55 dark:hover:bg-slate-800"
                  )}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Dynamic Modular Component Rendering depending on Active Pill */}
          {activePill === "Expired" ? (
            <ExpiredBatches 
              items={batchesData.expired}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedRoom={selectedRoom}
              onReturn={setReturnItem}
            />
          ) : activePill === "Expiring in 30 Days" ? (
            <Expiring30Days 
              items={batchesData.expiring30}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedRoom={selectedRoom}
              onReturn={setReturnItem}
            />
          ) : activePill === "Expiring in 60 Days" ? (
            <Expiring60Days 
              items={batchesData.expiring60}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedRoom={selectedRoom}
              onReturn={setReturnItem}
            />
          ) : activePill === "Show All (Healthy)" ? (
            <ShowAllHealthy 
              items={batchesData.healthy}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedRoom={selectedRoom}
              onView={handleViewDetail}
            />
          ) : (
            <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-10 text-center text-slate-400 font-semibold shadow-none">
              No active batches detected for filter tab "{activePill}".
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default BatchExpiryTracking;
