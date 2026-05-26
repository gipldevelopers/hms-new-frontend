"use client";

import React, { useState, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import { StatCards } from "./StatCards";
import { InventoryTable } from "./InventoryTable";
import { ItemDetailView } from "./ItemDetailView";
import { Construction, ArrowLeft } from "lucide-react";

const slugPageNames = {
  stock: "Stock Management",
  purchase: "Purchase Management",
  supplier: "Supplier Management",
  department: "Department Inventory",
  store: "Store Operation",
  "ot-supplies": "OT & Clinical Supplies",
  approvals: "Approval Center",
  reports: "Report & Analytics"
};

function UnimplementedPage({ slug, onGoBack }) {
  const pageName = slugPageNames[slug] || "Requested Module";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-8 text-center space-y-6 shadow-none">
      <div className="relative">
        <div className="absolute inset-0 bg-[#2E37A4]/10 dark:bg-[#2E37A4]/20 blur-xl rounded-full scale-125"></div>
        <div className="w-16 h-16 bg-[#2E37A4]/10 dark:bg-[#2E37A4]/25 text-[#2E37A4] dark:text-[#5F69F8] rounded-full flex items-center justify-center relative">
          <Construction size={32} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-500 dark:border-amber-900/30">
          Module Under Construction
        </span>
        <h2 className="text-[20px] font-extrabold text-[#1e293b] dark:text-white leading-tight">
          {pageName} Page
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          The requested system module is currently in active development. Our developers are engineering high-fidelity features for this route. Please check back later or contact support.
        </p>
      </div>

      <button
        onClick={onGoBack}
        className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-none border border-[#2E37A4]"
      >
        <ArrowLeft size={14} /> Return to Inventory Dashboard
      </button>
    </div>
  );
}

export function HospitalInventoryDashboard({ slug }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingItem, setViewingItem] = useState(null);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  const unimplementedSlugs = ["stock", "purchase", "supplier", "department", "store", "ot-supplies", "approvals", "reports"];
  const isUnimplemented = slug && unimplementedSlugs.includes(slug);

  if (isUnimplemented) {
    notFound();
  }

  // Fetch items from the backend API
  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/hospital-inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Error fetching inventory items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUnimplemented) {
      fetchItems();
    }
  }, [slug]);

  // Sync viewingItem state with URL dynamic slug path
  useEffect(() => {
    if (slug && !isUnimplemented) {
      const matched = items.find(item => String(item.id) === String(slug));
      if (matched && !viewingItem) {
        setViewingItem(matched);
      }

      const fetchDetails = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const res = await fetch(`/api/hospital-inventory/${slug}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success) {
            setViewingItem(json.data);
          } else if (matched) {
            setViewingItem(matched);
          }
        } catch (e) {
          if (matched) {
            setViewingItem(matched);
          }
        }
      };
      fetchDetails();
    } else {
      setViewingItem(null);
    }
  }, [slug, items, isUnimplemented]);

  // FIX: Scroll main container back to top immediately when a details view opens
  useEffect(() => {
    if (viewingItem || isUnimplemented) {
      const scrollableMain = document.querySelector("main");
      if (scrollableMain) {
        scrollableMain.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [viewingItem, isUnimplemented]);

  const handleBack = () => {
    setViewingItem(null);
    router.push("/hospital-inventory");
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    router.push(`/hospital-inventory/${item.id}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {isUnimplemented ? (
        <UnimplementedPage slug={slug} onGoBack={handleBack} />
      ) : viewingItem ? (
        <ItemDetailView
          item={viewingItem}
          onBack={handleBack}
          onAddItem={() => {
            setTriggerAddModal(true);
          }}
          onRefreshDetails={async () => {
            await fetchItems();
            if (slug) {
              try {
                const token = localStorage.getItem("authtoken");
                const res = await fetch(`/api/hospital-inventory/${slug}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                  setViewingItem(json.data);
                }
              } catch (e) {
                console.error("Error refreshing item details:", e);
              }
            }
          }}
        />
      ) : (
        <>
          {/* Title Block matching system standard style */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* Overview Cards (Stat Cards) */}
          <StatCards items={items} />
        </>
      )}

      {/* Lab Inventory items & Filter Table - Always mounted but table/filters hidden when viewing item */}
      {!isUnimplemented && (
        loading && items.length === 0 ? (
          <div className="flex justify-center items-center h-48 bg-white dark:bg-[#0A0F1D] border border-dashed border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
            <span className="text-[13px] text-slate-500 font-semibold">Loading inventory data...</span>
          </div>
        ) : (
          <InventoryTable
            items={items}
            setItems={setItems}
            onViewItem={handleViewItem}
            triggerAddModal={triggerAddModal}
            clearAddTrigger={() => setTriggerAddModal(false)}
            hideTableContent={!!viewingItem}
            onRefresh={async () => {
              await fetchItems();
              if (slug) {
                try {
                  const token = localStorage.getItem("authtoken");
                  const res = await fetch(`/api/hospital-inventory/${slug}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const json = await res.json();
                  if (json.success) {
                    setViewingItem(json.data);
                  }
                } catch (e) {
                  console.error("Error refreshing item details on edit:", e);
                }
              }
            }}
          />
        )
      )}

    </div>
  );
}
