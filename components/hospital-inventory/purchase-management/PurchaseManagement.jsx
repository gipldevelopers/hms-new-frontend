"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PurchaseTable } from "./PurchaseTable";
import { PurchaseOrderDetailView } from "./PurchaseOrderDetailView";
import { CreatePurchaseOrderModal } from "./CreatePurchaseOrderModal";
import { toast } from "sonner";

export function PurchaseManagement({ slugs = [] }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const orderId = slugs[0] || "";

  // Fetch all purchase orders from the backend
  const fetchOrders = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/purchase?branchId=${branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        toast.error(result.error || "Failed to load purchase orders.");
      }
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      toast.error("Network error. Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Sync viewingOrder state with URL dynamic slugs
  useEffect(() => {
    if (orderId && orderId !== "add") {
      const matched = orders.find(o => String(o.id) === String(orderId) || o.poNumber === orderId);
      if (matched) {
        setViewingOrder(matched);
      }
    } else {
      setViewingOrder(null);
    }
  }, [orderId, orders]);

  // Handle URL change when modal opens/closes
  useEffect(() => {
    if (orderId === "add") {
      setOrderToEdit(null);
      setIsModalOpen(true);
    }
  }, [orderId]);

  const handleBack = () => {
    setViewingOrder(null);
    setIsModalOpen(false);
    setOrderToEdit(null);
    router.push("/hospital-inventory/purchase");
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    router.push(`/hospital-inventory/purchase/${order.id}`);
  };

  const handleEditOrder = (order) => {
    setOrderToEdit(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (order) => {
    if (window.confirm(`Are you sure you want to remove Purchase Order ${order.poNumber}?`)) {
      try {
        const token = localStorage.getItem("authtoken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
          toast.error("Session expired.");
          return;
        }
        const user = JSON.parse(userStr);
        const branchId = user.branchId;

        const res = await fetch(`${API_URL}/purchase/${order.id}?branchId=${branchId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await res.json();
        if (result.success) {
          toast.success(`Purchase Order ${order.poNumber} deleted successfully.`);
          fetchOrders();
          if (viewingOrder?.id === order.id) {
            handleBack();
          }
        } else {
          toast.error(result.error || "Failed to delete purchase order.");
        }
      } catch (err) {
        console.error("Error deleting purchase order:", err);
        toast.error("Network error. Failed to delete purchase order.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderToEdit(null);
    if (orderId === "add") {
      router.push("/hospital-inventory/purchase");
    }
  };

  const handleSaveOrder = async (savedOrder) => {
    try {
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const method = orderToEdit ? "PUT" : "POST";
      const url = orderToEdit 
        ? `${API_URL}/purchase/${orderToEdit.id}?branchId=${branchId}`
        : `${API_URL}/purchase?branchId=${branchId}`;

      // If editing, we keep some current status fields if not changed in form
      const payload = {
        ...savedOrder,
        branchId
      };

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
        toast.success(orderToEdit 
          ? `Purchase Order ${savedOrder.poNumber} updated successfully.`
          : `Purchase Order ${savedOrder.poNumber} created successfully.`
        );
        fetchOrders();
        setIsModalOpen(false);
        setOrderToEdit(null);
        if (orderId === "add") {
          router.push("/hospital-inventory/purchase");
        }
      } else {
        toast.error(result.error || "Failed to save purchase order.");
      }
    } catch (err) {
      console.error("Error saving purchase order:", err);
      toast.error("Network error. Failed to save purchase order.");
    }
  };

  const handleExport = () => {
    try {
      const headers = ["PO Number", "Vendor", "Order Date", "Expected Delivery", "Total Amount", "Payment Status", "Order Status"];
      const rows = orders.map(o => [
        o.poNumber,
        o.vendor,
        o.orderDate,
        o.expectedDelivery,
        o.totalAmount,
        o.payment,
        o.orderStatus
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `purchase_orders_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Purchase Order records exported successfully as CSV.");
    } catch (e) {
      toast.error("Failed to export purchase records.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 dark:bg-slate-900/20 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-6 text-slate-400 font-semibold font-sans mt-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[14px]">Loading Purchase Orders...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {viewingOrder ? (
        <PurchaseOrderDetailView
          order={viewingOrder}
          onBack={handleBack}
          onEdit={handleEditOrder}
        />
      ) : (
        <PurchaseTable
          orders={orders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onCreatePOClick={() => {
            router.push("/hospital-inventory/purchase/add");
          }}
          onExportClick={handleExport}
        />
      )}

      {/* Creation and Edit Modal */}
      <CreatePurchaseOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOrder}
        orderToEdit={orderToEdit}
      />
    </div>
  );
}

export default PurchaseManagement;
