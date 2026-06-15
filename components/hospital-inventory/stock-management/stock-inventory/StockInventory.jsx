"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InventoryTable } from "./InventoryTable";
import { ItemDetailView } from "./ItemDetailView";
import { CreateItemProfile } from "./CreateItemProfile";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export function StockInventory({ slugs = [] }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const itemId = slugs[0] || "";

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/stock-inventory?branchId=${branchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.data || []).map(item => {
          const qtyStr = item.qty || "0";
          const qtyNum = parseFloat(qtyStr) || 0;
          const rawUnit = qtyStr.replace(/^[0-9.\s]+/, "").trim() || "Units";
          // Deduplicate consecutive identical words
          const words = rawUnit.split(/\s+/);
          const uniqueWords = [];
          words.forEach(w => {
            if (uniqueWords.length === 0 || uniqueWords[uniqueWords.length - 1] !== w) {
              uniqueWords.push(w);
            }
          });
          const unitStr = uniqueWords.join(" ") || "Units";

          return {
            ...item,
            qty: `${qtyNum} ${unitStr}`,
            qtyNum,
            unit: unitStr,
            minStock: item.minThreshold || "0",
            batches: item.stockHistory ? String(item.stockHistory.length) : "1",
            vendor: item.supplier || "",
          };
        });
        setItems(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch stock inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const handleRefresh = () => {
      fetchItems();
    };
    window.addEventListener("refresh-inventory", handleRefresh);
    return () => {
      window.removeEventListener("refresh-inventory", handleRefresh);
    };
  }, []);

  // Sync URL ID with details view
  useEffect(() => {
    if (itemId === "add") {
      setIsAddingItem(true);
      setViewingItem(null);
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("id");
      if (editId) {
        const matched = items.find(item => String(item.id) === String(editId));
        if (matched) {
          setEditItem(matched);
        } else {
          // Robust direct fetch from backend API if items list is not populated/loaded yet
          const fetchEditDetails = async () => {
            try {
              const token = localStorage.getItem("authtoken");
              const userStr = localStorage.getItem("user");
              if (!token || !userStr) return;
              const user = JSON.parse(userStr);
              const branchId = user.branchId;

              const res = await fetch(`${API_URL}/stock-inventory/${editId}?branchId=${branchId}`, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });
              const data = await res.json();
              if (data.success && data.data) {
                const item = data.data;
                const qtyStr = item.qty || "0";
                const qtyNum = parseFloat(qtyStr) || 0;
                const unitStr = qtyStr.replace(/^[0-9.\s]+/, "") || "Units";
                setEditItem({
                  ...item,
                  qty: qtyStr,
                  qtyNum,
                  unit: unitStr,
                  minStock: item.minThreshold || "0",
                  batches: item.stockHistory ? String(item.stockHistory.length) : "1",
                  vendor: item.supplier || "",
                });
              }
            } catch (err) {
              console.error("Failed to load edit details directly:", err);
            }
          };
          fetchEditDetails();
        }
      } else {
        setEditItem(null);
      }
    } else if (itemId) {
      const fetchDetails = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const userStr = localStorage.getItem("user");
          if (!token || !userStr) return;
          const user = JSON.parse(userStr);
          const branchId = user.branchId;

          const res = await fetch(`${API_URL}/stock-inventory/${itemId}?branchId=${branchId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setViewingItem(data.data);
          }
        } catch (err) {
          console.error("Failed to load details:", err);
        }
      };
      fetchDetails();
      setIsAddingItem(false);
      setEditItem(null);
    } else {
      setViewingItem(null);
      setIsAddingItem(false);
      setEditItem(null);
    }
  }, [itemId, items]);

  useEffect(() => {
    if (triggerAddModal) {
      setIsAddingItem(true);
      setTriggerAddModal(false);
    }
  }, [triggerAddModal]);

  const handleBack = () => {
    setViewingItem(null);
    router.push("/hospital-inventory/stock/stock-inventory");
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    router.push(`/hospital-inventory/stock/stock-inventory/${item.id}`);
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="text-[14px] font-bold text-slate-400">Loading stock inventory...</span>
        </div>
      ) : isAddingItem ? (
        <CreateItemProfile
          editItem={editItem}
          onCancel={() => {
            setIsAddingItem(false);
            setEditItem(null);
            if (itemId === "add") {
              router.push("/hospital-inventory/stock/stock-inventory");
            }
          }}
          onSave={async (newItem) => {
            try {
              const token = localStorage.getItem("authtoken");
              const userStr = localStorage.getItem("user");
              if (!token || !userStr) {
                toast.error("Session expired.");
                return;
              }
              const user = JSON.parse(userStr);
              const branchId = user.branchId;

              const cleanQtyNum = parseFloat(newItem.qty) || 0;
              const rawUnit = (newItem.unit || "Units").trim();
              const words = rawUnit.split(/\s+/);
              const uniqueWords = [];
              words.forEach(w => {
                if (uniqueWords.length === 0 || uniqueWords[uniqueWords.length - 1] !== w) {
                  uniqueWords.push(w);
                }
              });
              const cleanUnit = uniqueWords.join(" ") || "Units";

              const payload = {
                name: newItem.name,
                sku: newItem.sku,
                category: newItem.category,
                qty: `${cleanQtyNum} ${cleanUnit}`,
                expiry: newItem.expiry || "24 Months",
                status: newItem.status,
                supplier: newItem.supplier || newItem.vendor || "",
                minThreshold: newItem.minStock || "5",
                notes: newItem.notes || "",
                unitPrice: parseFloat(newItem.cost || newItem.unitPrice || 0.0)
              };

              let res;
              if (editItem) {
                res = await fetch(`${API_URL}/stock-inventory/${editItem.id}?branchId=${branchId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
              } else {
                res = await fetch(`${API_URL}/stock-inventory?branchId=${branchId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
              }
              const result = await res.json();
              if (result.success) {
                toast.success(editItem ? "Stock Profile updated successfully!" : "New Item Profile created successfully!");
                fetchItems();
                setIsAddingItem(false);
                setEditItem(null);
                if (itemId === "add") {
                  router.push("/hospital-inventory/stock/stock-inventory");
                }
              } else {
                toast.error(result.error || "Failed to save stock item.");
              }
            } catch (err) {
              console.error(err);
              toast.error("Network error. Please try again.");
            }
          }}
        />
      ) : viewingItem ? (
        <ItemDetailView
          item={viewingItem}
          onBack={handleBack}
          onAddItem={() => router.push("/hospital-inventory/stock/stock-inventory/add")}
          onRefreshDetails={fetchItems}
          onTransferStock={() => router.push(`/hospital-inventory/stock/stock-transfer?itemId=${viewingItem.id}&sku=${viewingItem.sku}`)}
        />
      ) : (
        <InventoryTable
          items={items}
          setItems={setItems}
          onViewItem={handleViewItem}
          triggerAddModal={triggerAddModal}
          clearAddTrigger={() => setTriggerAddModal(false)}
          onAddClick={() => router.push("/hospital-inventory/stock/stock-inventory/add")}
        />
      )}

    </div>
  );
}

export default StockInventory;
