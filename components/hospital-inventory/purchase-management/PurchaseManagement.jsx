"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PurchaseTable } from "./PurchaseTable";
import { PurchaseOrderDetailView } from "./PurchaseOrderDetailView";
import { CreatePurchaseOrderModal } from "./CreatePurchaseOrderModal";
import { toast } from "sonner";

// Initial mock data based directly on the provided screenshot
const INITIAL_ORDERS = [
  {
    id: 1,
    poNumber: "PO-2024-0892",
    vendor: "Global Health Medical",
    orderDate: "Oct 12, 2023",
    expectedDelivery: "Oct 20, 2023",
    totalAmount: "₹12,450.00",
    payment: "PAID",
    orderStatus: "PARTIAL RECEIVED",
    items: [
      { id: 1, name: "Reagent A (Hematology)", qty: 25, unitPrice: 200, total: 5000 },
      { id: 2, name: "Sterile Disposable Syringes (10ml)", qty: 100, unitPrice: 15, total: 1500 },
      { id: 3, name: "N95 Protective Masks", qty: 200, unitPrice: 25, total: 5000 },
      { id: 4, name: "Surgical Spirit (500ml)", qty: 15, unitPrice: 63.33, total: 950 }
    ]
  },
  {
    id: 2,
    poNumber: "PO-2024-0901",
    vendor: "Medtronic Inc.",
    orderDate: "Oct 14, 2023",
    expectedDelivery: "Oct 22, 2023",
    totalAmount: "₹45,210.50",
    payment: "PENDING",
    orderStatus: "ORDERED",
    items: [
      { id: 1, name: "Premium Heart Valves (Model B)", qty: 5, unitPrice: 8000, total: 40000 },
      { id: 2, name: "Pacemaker Electrodes", qty: 10, unitPrice: 521.05, total: 5210.50 }
    ]
  },
  {
    id: 3,
    poNumber: "PO-2024-0850",
    vendor: "Surgical Supply Co.",
    orderDate: "Oct 01, 2023",
    expectedDelivery: "Oct 05, 2023",
    totalAmount: "₹3,120.00",
    payment: "PAID",
    orderStatus: "COMPLETED",
    items: [
      { id: 1, name: "Surgical Cotton Rolls", qty: 50, unitPrice: 42.40, total: 2120 },
      { id: 2, name: "Disposable Scalpels (Size 10)", qty: 20, unitPrice: 50, total: 1000 }
    ]
  },
  {
    id: 4,
    poNumber: "PO-2024-0850",
    vendor: "Surgical Supply Co.",
    orderDate: "Oct 01, 2023",
    expectedDelivery: "Oct 05, 2023",
    totalAmount: "₹3,120.00",
    payment: "PAID",
    orderStatus: "COMPLETED",
    items: [
      { id: 1, name: "Surgical Cotton Rolls", qty: 50, unitPrice: 42.40, total: 2120 },
      { id: 2, name: "Disposable Scalpels (Size 10)", qty: 20, unitPrice: 50, total: 1000 }
    ]
  },
  {
    id: 5,
    poNumber: "PO-2024-0850",
    vendor: "Surgical Supply Co.",
    orderDate: "Oct 01, 2023",
    expectedDelivery: "Oct 05, 2023",
    totalAmount: "₹3,120.00",
    payment: "PAID",
    orderStatus: "COMPLETED",
    items: [
      { id: 1, name: "Surgical Cotton Rolls", qty: 50, unitPrice: 42.40, total: 2120 },
      { id: 2, name: "Disposable Scalpels (Size 10)", qty: 20, unitPrice: 50, total: 1000 }
    ]
  },
  {
    id: 6,
    poNumber: "PO-2024-0915",
    vendor: "Advanced Pharma",
    orderDate: "Oct 18, 2023",
    expectedDelivery: "Pending",
    totalAmount: "₹5,800.00",
    payment: "PAID",
    orderStatus: "COMPLETED",
    items: [
      { id: 1, name: "Amoxicillin Capsules 500mg", qty: 40, unitPrice: 100, total: 4000 },
      { id: 2, name: "Paracetamol Syrup (100ml)", qty: 60, unitPrice: 30, total: 1800 }
    ]
  },
  {
    id: 7,
    poNumber: "PO-2024-0812",
    vendor: "MedEquip Logistics",
    orderDate: "Sep 28, 2023",
    expectedDelivery: "--",
    totalAmount: "₹890.00",
    payment: "VOID",
    orderStatus: "CANCELLED",
    items: [
      { id: 1, name: "Cardboard Disposal Bins", qty: 10, unitPrice: 89, total: 890 }
    ]
  }
];

export function PurchaseManagement({ slugs = [] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const orderId = slugs[0] || "";

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

  // Handle URL change when modal opens/closes to match AddSupplier patterns if preferred,
  // or simply control via modal state. Let's support both cleanly.
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

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Are you sure you want to remove Purchase Order ${order.poNumber}?`)) {
      setOrders(orders.filter(o => o.id !== order.id));
      toast.success(`Purchase Order ${order.poNumber} deleted successfully.`);
      if (viewingOrder?.id === order.id) {
        handleBack();
      }
    }
  };

  const handleSaveOrder = (savedOrder) => {
    if (orderToEdit) {
      setOrders(orders.map(o => o.id === savedOrder.id ? savedOrder : o));
    } else {
      setOrders([savedOrder, ...orders]);
    }
    setIsModalOpen(false);
    setOrderToEdit(null);
    router.push("/hospital-inventory/purchase");
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
        onClose={handleBack}
        onSave={handleSaveOrder}
        orderToEdit={orderToEdit}
      />
    </div>
  );
}

export default PurchaseManagement;
