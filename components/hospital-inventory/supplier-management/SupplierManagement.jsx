"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatCards } from "./StatCards";
import { SupplierTable } from "./SupplierTable";
import { AddSupplierWizard } from "./AddSupplierWizard";
import { toast } from "sonner";

export function SupplierManagement({ slugs = [] }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  const firstSlug = slugs[0] || "";
  const secondSlug = slugs[1] || "";

  const isAdding = firstSlug === "add";
  const isEditing = firstSlug === "edit";
  const isViewing = firstSlug === "view";
  const editId = (isEditing || isViewing) ? secondSlug : null;
  const viewOnly = isViewing;

  // Fetch all suppliers and stats from the backend
  const fetchSuppliers = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      // Fetch suppliers and stats in parallel
      const [suppliersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/supplier?branchId=${branchId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${API_URL}/supplier/stats/summary?branchId=${branchId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      const suppliersResult = await suppliersRes.json();
      if (suppliersResult.success) {
        setSuppliers(suppliersResult.data || []);
      } else {
        toast.error(suppliersResult.error || "Failed to load suppliers.");
      }

      const statsResult = await statsRes.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      toast.error("Network error. Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);


  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Scroll to top when opening wizard
  useEffect(() => {
    if (isAdding || isEditing || isViewing) {
      const scrollableMain = document.querySelector("main");
      if (scrollableMain) {
        scrollableMain.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [isAdding, isEditing, isViewing]);

  const handleBack = () => {
    router.push("/hospital-inventory/supplier");
  };

  const handleViewSupplier = (supplier) => {
    router.push(`/hospital-inventory/supplier/view/${supplier.id}`);
  };

  const handleEditSupplier = (supplier) => {
    router.push(`/hospital-inventory/supplier/edit/${supplier.id}`);
  };

  const handleDeleteSupplier = async (supplier) => {
    if (window.confirm(`Are you sure you want to remove ${supplier.name}?`)) {
      try {
        const token = localStorage.getItem("authtoken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
          toast.error("Session expired.");
          return;
        }
        const user = JSON.parse(userStr);
        const branchId = user.branchId;

        const res = await fetch(`${API_URL}/supplier/${supplier.id}?branchId=${branchId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await res.json();
        if (result.success) {
          toast.success(`${supplier.name} removed successfully.`);
          fetchSuppliers();
        } else {
          toast.error(result.error || "Failed to delete supplier.");
        }
      } catch (err) {
        console.error("Error deleting supplier:", err);
        toast.error("Network error. Failed to delete supplier.");
      }
    }
  };

  const handleSaveSupplier = async (finalData) => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const documents = {
        gst: finalData.gst,
        pan: finalData.pan,
        drug: finalData.drug,
        additional: finalData.additional
      };

      const payload = {
        ...finalData,
        documents,
        branchId
      };

      const url = editId
        ? `${API_URL}/supplier/${editId}?branchId=${branchId}`
        : `${API_URL}/supplier?branchId=${branchId}`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Supplier ${payload.name} saved successfully.`);
        fetchSuppliers();
        router.push("/hospital-inventory/supplier");
      } else {
        toast.error(result.error || "Failed to save supplier.");
      }
    } catch (err) {
      console.error("Error saving supplier:", err);
      toast.error("Network error. Failed to save supplier.");
    }
  };

  if (loading && !isAdding && !isEditing && !isViewing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 dark:bg-slate-900/20 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-6 text-slate-400 font-semibold font-sans mt-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[14px]">Loading Suppliers...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">

      {isAdding || isEditing || isViewing ? (
        <AddSupplierWizard
          editId={editId}
          viewOnly={viewOnly}
          onSave={handleSaveSupplier}
          onCancel={handleBack}
        />
      ) : (
        <>
          {/* Header block with stats cards */}
          <StatCards suppliers={suppliers} stats={stats} />


          {/* Supplier Directory Table */}
          <SupplierTable
            suppliers={suppliers}
            onViewSupplier={handleViewSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddSupplierClick={() => {
              router.push("/hospital-inventory/supplier/add");
            }}
            onCreatePOClick={() => {
              toast.success("Redirecting to Purchase Order builder...");
              router.push("/hospital-inventory/purchase/add");
            }}
          />
        </>
      )}

    </div>
  );
}
export default SupplierManagement;
