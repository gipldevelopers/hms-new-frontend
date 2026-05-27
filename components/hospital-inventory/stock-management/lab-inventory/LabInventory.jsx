"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatCards } from "./StatCards";
import { InventoryTable } from "./InventoryTable";
import { ItemDetailView } from "./ItemDetailView";

export function LabInventory({ slugs = [] }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingItem, setViewingItem] = useState(null);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  const itemId = slugs[0] || "";

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
    fetchItems();
  }, []);

  // Sync viewingItem state with URL dynamic slug path
  useEffect(() => {
    if (itemId) {
      const matched = items.find(item => String(item.id) === String(itemId));
      if (matched && !viewingItem) {
        setViewingItem(matched);
      }

      const fetchDetails = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const res = await fetch(`/api/hospital-inventory/${itemId}`, {
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
  }, [itemId, items]);

  // Scroll main container back to top immediately when a details view opens
  useEffect(() => {
    if (viewingItem) {
      const scrollableMain = document.querySelector("main");
      if (scrollableMain) {
        scrollableMain.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [viewingItem]);

  const handleBack = () => {
    setViewingItem(null);
    router.push("/hospital-inventory/stock/lab-inventory");
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    router.push(`/hospital-inventory/stock/lab-inventory/${item.id}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {viewingItem ? (
        <ItemDetailView
          item={viewingItem}
          onBack={handleBack}
          onAddItem={() => {
            setTriggerAddModal(true);
          }}
          onRefreshDetails={async () => {
            await fetchItems();
            if (itemId) {
              try {
                const token = localStorage.getItem("authtoken");
                const res = await fetch(`/api/hospital-inventory/${itemId}`, {
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
          {/* Title Block for Stock Management page */}
          <div className="flex justify-between items-center mb-2">

          </div>

          {/* Overview Cards (Stat Cards) */}
          <StatCards items={items} />

          {/* Lab Inventory items & Filter Table */}
          {loading && items.length === 0 ? (
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
              hideTableContent={false}
              onRefresh={async () => {
                await fetchItems();
                if (itemId) {
                  try {
                    const token = localStorage.getItem("authtoken");
                    const res = await fetch(`/api/hospital-inventory/${itemId}`, {
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
          )}
        </>
      )}

    </div>
  );
}
export default LabInventory;
