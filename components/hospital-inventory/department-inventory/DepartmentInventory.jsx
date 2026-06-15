"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentTable, { formatRelativeTime } from "./DepartmentTable";
import { ItemDetailView } from "../stock-management/stock-inventory/ItemDetailView";
import { CreateItemProfile } from "./CreateItemProfile";
import { toast } from "sonner";

export function DepartmentInventory({ slugs = [] }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const itemId = slugs[0] || "";

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Authentication required.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`/api/department-inventory?branchId=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Error fetching department inventory:", err);
      toast.error("Failed to fetch department inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (itemId && itemId !== "add") {
      const fetchDetails = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const userStr = localStorage.getItem("user");
          if (!token || !userStr) return;
          const user = JSON.parse(userStr);
          const branchId = user.branchId;

          const res = await fetch(`/api/department-inventory/${itemId}?branchId=${branchId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success) {
            setSelectedItem(json.data);
          } else {
            toast.error(json.error || "Failed to fetch item details.");
          }
        } catch (err) {
          console.error("Error fetching item details:", err);
          toast.error("Failed to fetch item details.");
        }
      };
      fetchDetails();
      setIsAddingItem(false);
      setEditingItem(null);
    } else {
      setSelectedItem(null);
      setIsAddingItem(false);
      setEditingItem(null);
    }
  }, [itemId]);

  const handleViewItem = (item) => {
    router.push(`/hospital-inventory/department/${item.id}`);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddingItem(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsAddingItem(true);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const token = localStorage.getItem("authtoken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) return;
        const user = JSON.parse(userStr);
        const branchId = user.branchId;

        const res = await fetch(`/api/department-inventory/${item.id}?branchId=${branchId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`${item.name} deleted successfully`);
          fetchItems();
        } else {
          toast.error(data.error || "Failed to delete item.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error. Failed to delete item.");
      }
    }
  };

  const handleExport = () => {
    try {
      if (!items || items.length === 0) {
        toast.error("No items to export");
        return;
      }
      
      const headers = ["SKU Code", "Item Name", "Category", "Unit", "Current Stock", "Min Stock", "Expiry", "Last Updated", "Status"];
      
      const rows = items.map(item => [
        item.sku || "",
        item.name || "",
        item.category || "",
        item.unit || "",
        item.qty || "0",
        item.minThreshold || "0",
        item.expiry || "",
        formatRelativeTime(item.updatedAt),
        item.status || ""
      ]);

      // Format CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Department_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Department inventory exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export department inventory.");
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {isAddingItem ? (
        <CreateItemProfile
          initialData={editingItem}
          onCancel={() => {
            setIsAddingItem(false);
            setEditingItem(null);
          }}
          onSave={async (newItem) => {
            const token = localStorage.getItem("authtoken");
            const userStr = localStorage.getItem("user");
            if (!token || !userStr) {
              toast.error("Session expired.");
              return;
            }
            const user = JSON.parse(userStr);
            const branchId = user.branchId;

            const payload = {
              sku: newItem.sku,
              name: newItem.name,
              category: newItem.category,
              unit: newItem.unit,
              qty: String(newItem.qty),
              minThreshold: String(newItem.minThreshold),
              expiry: newItem.expiry,
              status: newItem.status,
              notes: newItem.notes,
              unitPrice: newItem.unitPrice || 0
            };

            try {
              let res;
              if (editingItem) {
                res = await fetch(`/api/department-inventory/${editingItem.id}?branchId=${branchId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
              } else {
                res = await fetch(`/api/department-inventory?branchId=${branchId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
              }
              const data = await res.json();
              if (data.success) {
                fetchItems();
                setIsAddingItem(false);
                setEditingItem(null);
              } else {
                toast.error(data.error || "Failed to save item.");
              }
            } catch (err) {
              console.error(err);
              toast.error("Network error. Please try again.");
            }
          }}
        />
      ) : selectedItem ? (
        <ItemDetailView
          item={selectedItem}
          onBack={() => {
            setSelectedItem(null);
            router.push("/hospital-inventory/department");
          }}
          onTransferStock={() => router.push(`/hospital-inventory/stock/stock-transfer?itemId=${selectedItem.id}&sku=${selectedItem.sku}&fromDept=O.T. Recovery Unit`)}
        />
      ) : loading ? (
        <div className="flex justify-center items-center h-48 bg-white dark:bg-[#0A0F1D] border border-dashed border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
          <span className="text-[13px] text-slate-500 font-semibold">Loading department inventory data...</span>
        </div>
      ) : (
        <DepartmentTable
          items={items}
          onViewItem={handleViewItem}
          onEditItem={handleOpenEditModal}
          onDeleteItem={handleDeleteItem}
          onAddItemClick={handleOpenAddModal}
          onExportClick={handleExport}
        />
      )}
    </div>
  );
}

export default DepartmentInventory;
