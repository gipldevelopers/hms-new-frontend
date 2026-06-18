"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ApprovalTable from "./ApprovalTable";
import { Search, ChevronDown } from "lucide-react";
import { PurchaseOrderDetailView } from "@/components/hospital-inventory/purchase-management/PurchaseOrderDetailView";
import { CreatePurchaseOrderModal } from "@/components/hospital-inventory/purchase-management/CreatePurchaseOrderModal";
import { toast } from "sonner";

export function ApprovalDashboard({ slugs = [] }) {
  const router = useRouter();
  const prIdOrNumber = slugs[0] || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("All"); // "All", "Urgent", "High", "Normal"
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Pending Admin", "Ordered", "Rejected"
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const priorityRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (priorityRef.current && !priorityRef.current.contains(event.target)) {
        setIsPriorityOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get branchId from logged-in user context
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.branchId) {
          setBranchId(user.branchId);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("authtoken");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) return;

    let bId = branchId;
    if (!bId) {
      try {
        bId = JSON.parse(userStr).branchId;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
      const res = await fetch(`${API_URL}/approvals?branchId=${bId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        toast.error(data.error || "Failed to fetch approvals requests");
      }
    } catch (error) {
      console.error("Error fetching approvals requests:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchRequests();
    }
  }, [branchId]);

  const handleEditClick = async (itemOrOrder) => {
    const token = localStorage.getItem("authtoken");
    let bId = branchId;
    if (!bId) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          bId = JSON.parse(userStr).branchId;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Check if it's a purchase request that has been ordered
    if (itemOrOrder.prNumber && itemOrOrder.status === "Ordered" && itemOrOrder.poNumber) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
        const res = await fetch(`${API_URL}/purchase?branchId=${bId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          const matchedPO = data.data.find(po => po.poNumber === itemOrOrder.poNumber);
          if (matchedPO) {
            setOrderToEdit(matchedPO);
            setIsPOModalOpen(true);
            return;
          }
        }
      } catch (e) {
        console.error("Error fetching matching PO for edit:", e);
      }
    }

    // Fallback/Default edit mapping (for Pending Admin PRs or already mapped objects):
    const isFullOrder = !!itemOrOrder.poNumber && !itemOrOrder.prNumber && itemOrOrder.orderStatus === "ORDERED";
    const mockOrder = isFullOrder ? itemOrOrder : {
      id: itemOrOrder.id,
      poNumber: itemOrOrder.poNumber || (itemOrOrder.prNumber ? itemOrOrder.prNumber.replace("PR-", "PO-") : ""),
      vendor: itemOrOrder.vendor || "Global Health Medical",
      orderDate: itemOrOrder.date || itemOrOrder.orderDate || new Date().toISOString().split('T')[0],
      expectedDelivery: itemOrOrder.expectedDelivery || "Pending",
      totalAmount: itemOrOrder.totalAmount || "₹0.00",
      payment: itemOrOrder.payment || "PENDING",
      orderStatus: itemOrOrder.orderStatus || (itemOrOrder.status === "Ordered" ? "ORDERED" : "PENDING"),
      items: itemOrOrder.items || []
    };
    setOrderToEdit(mockOrder);
    setIsPOModalOpen(true);
  };

  const handleSaveOrder = async (finalOrder) => {
    const token = localStorage.getItem("authtoken");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
    
    let bId = branchId;
    if (!bId) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          bId = JSON.parse(userStr).branchId;
        } catch (e) {
          console.error(e);
        }
      }
    }

    try {
      const isPendingPR = requests.some(r => r.id === orderToEdit.id && r.status === "Pending Admin");

      if (isPendingPR) {
        // Edit a Pending Admin Purchase Request directly
        const prPayload = {
          date: finalOrder.orderDate,
          items: finalOrder.items,
          totalItems: finalOrder.items.length
        };

        const prRes = await fetch(`${API_URL}/approvals/${orderToEdit.id}?branchId=${bId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(prPayload)
        });

        const prData = await prRes.json();
        if (!prData.success) {
          toast.error(prData.error || "Failed to update Purchase Request");
          return;
        }

        toast.success(`Purchase Request updated successfully!`);

        // Update detailed view if it matches the current view
        if (viewingOrder && viewingOrder.id === orderToEdit.id) {
          const totalCost = finalOrder.items.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0);
          setViewingOrder({
            ...viewingOrder,
            orderDate: finalOrder.orderDate,
            totalAmount: `₹${totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            items: finalOrder.items
          });
        }
      } else {
        // Edit an Ordered PO or create a new PO from a PR approval
        const isEdit = !!(orderToEdit && orderToEdit.id && !orderToEdit.prId);
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit
          ? `${API_URL}/purchase/${orderToEdit.id}?branchId=${bId}`
          : `${API_URL}/purchase`;

        const poPayload = {
          poNumber: finalOrder.poNumber,
          vendor: finalOrder.vendor,
          orderDate: finalOrder.orderDate,
          expectedDelivery: finalOrder.expectedDelivery,
          totalAmount: finalOrder.totalAmount,
          payment: finalOrder.payment,
          orderStatus: finalOrder.orderStatus,
          items: finalOrder.items,
          justification: finalOrder.justification,
          deliveryStore: finalOrder.deliveryStore,
          shippingUrgency: finalOrder.shippingUrgency,
          branchId: bId
        };

        const poRes = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(poPayload)
        });

        const poData = await poRes.json();
        if (!poData.success) {
          toast.error(poData.error || `Failed to ${isEdit ? "update" : "create"} Purchase Order`);
          return;
        }

        if (isEdit) {
          // Also sync the matching PurchaseRequest's items so the list view is up-to-date
          if (orderToEdit.poNumber) {
            const matchingPR = requests.find(r => r.poNumber === orderToEdit.poNumber);
            if (matchingPR) {
              await fetch(`${API_URL}/approvals/${matchingPR.id}?branchId=${bId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  items: finalOrder.items,
                  totalItems: finalOrder.items.length
                })
              });
            }
          }
          toast.success(`Purchase Order ${poData.data.poNumber} updated successfully!`);
        } else {
          // If this PO was spawned from a PR approval, update the PR status to Ordered
          if (orderToEdit && orderToEdit.prId) {
            const prRes = await fetch(`${API_URL}/approvals/${orderToEdit.prId}?branchId=${bId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                status: "Ordered",
                poNumber: poData.data.poNumber
              })
            });
            
            const prData = await prRes.json();
            if (prData.success) {
              toast.success(`Purchase Request approved and ${poData.data.poNumber} created successfully!`);
            } else {
              toast.error(prData.error || "PO created but failed to update Purchase Request status");
            }
          } else {
            toast.success(`Purchase Order ${poData.data.poNumber} created successfully!`);
          }
        }

        // If details view was open, sync it
        if (viewingOrder) {
          setViewingOrder(poData.data);
        }
      }

      // Refresh list and close modal
      fetchRequests();
      setIsPOModalOpen(false);
      setOrderToEdit(null);
    } catch (e) {
      console.error(e);
      toast.error("Error processing request");
    }
  };

  const handleReject = async (item) => {
    const token = localStorage.getItem("authtoken");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
    try {
      const res = await fetch(`${API_URL}/approvals/${item.id}?branchId=${branchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "Rejected"
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Purchase Request ${item.prNumber} rejected.`);
        fetchRequests();
      } else {
        toast.error(data.error || "Failed to reject Purchase Request");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error processing request");
    }
  };

  const handleDelete = async (item) => {
    const token = localStorage.getItem("authtoken");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
    try {
      const res = await fetch(`${API_URL}/approvals/${item.id}?branchId=${branchId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Purchase Request ${item.prNumber} deleted.`);
        fetchRequests();
      } else {
        toast.error(data.error || "Failed to delete Purchase Request");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error processing request");
    }
  };

  const loadDetailedViewOrder = async (item) => {
    const token = localStorage.getItem("authtoken");
    if (item.status === "Ordered" && item.poNumber) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
        const res = await fetch(`${API_URL}/purchase?branchId=${branchId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          const matchedPO = data.data.find(po => po.poNumber === item.poNumber);
          if (matchedPO) {
            setViewingOrder(matchedPO);
            return;
          }
        }
      } catch (e) {
        console.error("Error fetching linked PO:", e);
      }
    }

    const totalCost = item.items ? item.items.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0) : 0;
    const mappedOrder = {
      id: item.id,
      poNumber: item.poNumber || item.prNumber.replace("PR-", "PO-"),
      vendor: "Global Health Medical",
      orderDate: item.date,
      expectedDelivery: "Pending",
      totalAmount: `₹${totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      payment: "PENDING",
      orderStatus: item.status === "Ordered" ? "ORDERED" : "PENDING",
      items: item.items || [],
      justification: `Purchase Request ${item.prNumber} details.`,
      deliveryStore: "Main Central Pharmacy Store",
      shippingUrgency: item.priority === "Urgent" ? "⚡ Emergency Expedited (24h)" : "Standard Delivery (3-5 business days)"
    };
    setViewingOrder(mappedOrder);
  };

  useEffect(() => {
    if (prIdOrNumber && requests.length > 0) {
      const matched = requests.find(r => String(r.id) === String(prIdOrNumber) || r.prNumber === prIdOrNumber);
      if (matched) {
        loadDetailedViewOrder(matched);
      } else {
        setViewingOrder(null);
      }
    } else {
      setViewingOrder(null);
    }
  }, [prIdOrNumber, requests, branchId]);

  // Filter requests based on search term, priority, and status
  const filteredRequests = requests.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    const matchesSearch = (
      (item.prNumber && item.prNumber.toLowerCase().includes(searchLower)) ||
      (item.department && item.department.toLowerCase().includes(searchLower)) ||
      (item.requestedBy && item.requestedBy.toLowerCase().includes(searchLower))
    );

    // Priority filter
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;

    // Status filter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // If viewing details of a purchase order, render the detail view page
  if (viewingOrder) {
    return (
      <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen">
        <PurchaseOrderDetailView
          order={viewingOrder}
          onBack={() => router.push("/hospital-inventory/approvals")}
          onEdit={() => handleEditClick(viewingOrder)}
        />
        {/* Render edit modal on detailed view screen if active */}
        <CreatePurchaseOrderModal
          isOpen={isPOModalOpen}
          onClose={() => {
            setIsPOModalOpen(false);
            setOrderToEdit(null);
          }}
          onSave={handleSaveOrder}
          orderToEdit={orderToEdit}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300 relative">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold text-slate-800 dark:text-white leading-none tracking-tight mt-2">
          Approval Requests
        </h1>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[6px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input Container */}
        <div className="relative flex-1 max-w-2xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Patient name / Order ID..."
            className="w-full pl-9 pr-4 py-2 text-[12px] bg-slate-50/50 dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2E37A4] dark:focus:ring-indigo-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 self-end sm:self-auto z-30">
          {/* Priority Filter Dropdown */}
          <div className="relative" ref={priorityRef}>
            <button
              type="button"
              onClick={() => {
                setIsPriorityOpen(!isPriorityOpen);
                setIsStatusOpen(false);
              }}
              className="flex items-center gap-2 h-9 px-3 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[12px] font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>{priorityFilter === "All" ? "Priority: All" : `Priority: ${priorityFilter}`}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>
            {isPriorityOpen && (
              <div className="absolute right-0 mt-1 w-[150px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] shadow-lg z-30 overflow-hidden py-1">
                {["All", "Urgent", "High", "Normal"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPriorityFilter(p);
                      setIsPriorityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors cursor-pointer block ${
                      priorityFilter === p
                        ? "bg-slate-100 dark:bg-slate-800 text-[#2E37A4] dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p === "All" ? "All Priorities" : p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status/All Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsPriorityOpen(false);
              }}
              className="flex items-center gap-2 h-9 px-3 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[12px] font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>{statusFilter === "All" ? "Status: All" : `Status: ${statusFilter}`}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>
            {isStatusOpen && (
              <div className="absolute right-0 mt-1 w-[160px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] shadow-lg z-30 overflow-hidden py-1">
                {["All", "Pending Admin", "Ordered", "Rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors cursor-pointer block ${
                      statusFilter === s
                        ? "bg-slate-100 dark:bg-slate-800 text-[#2E37A4] dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {s === "All" ? "All Statuses" : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Full-width Table Card */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center py-10 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <span className="text-[14px] font-semibold text-slate-500 dark:text-slate-400">Loading approvals request queue...</span>
          </div>
        ) : (
          <ApprovalTable
            requests={filteredRequests}
            onViewOrder={(item) => {
              router.push(`/hospital-inventory/approvals/${item.id}`);
            }}
            onApproveAndPO={(item) => {
              // Pre-fill the CreatePurchaseOrderModal with the PR details
              const mappedOrder = {
                prId: item.id, // Store target PR ID to update its status upon PO creation
                poNumber: item.prNumber.replace("PR-", "PO-"),
                vendor: "Baxter Healthcare Corp",
                orderDate: item.date,
                expectedDelivery: "Pending",
                totalAmount: `₹${(item.items ? item.items.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0) : 0).toLocaleString('en-IN')}`,
                payment: "PENDING",
                orderStatus: "ORDERED",
                items: item.items || [],
                justification: `Approved purchase request ${item.prNumber} from ${item.department}.`,
                deliveryStore: "Main Central Pharmacy Store",
                shippingUrgency: item.priority === "Urgent" ? "⚡ Emergency Expedited (24h)" : "Standard Delivery (3-5 business days)"
              };
              setOrderToEdit(mappedOrder);
              setIsPOModalOpen(true);
            }}
            onEditOrder={handleEditClick}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Render create/edit modal on list view screen */}
      <CreatePurchaseOrderModal
        isOpen={isPOModalOpen}
        onClose={() => {
          setIsPOModalOpen(false);
          setOrderToEdit(null);
        }}
        onSave={handleSaveOrder}
        orderToEdit={orderToEdit}
      />
    </div>
  );
}

export default ApprovalDashboard;
