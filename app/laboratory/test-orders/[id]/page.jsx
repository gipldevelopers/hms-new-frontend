"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { OrderDetailsHeader } from "@/components/laboratory/test-orders/details/OrderDetailsHeader";
import { PatientInfoCard } from "@/components/laboratory/test-orders/details/PatientInfoCard";
import { TestsRequestedCard } from "@/components/laboratory/test-orders/details/TestsRequestedCard";
import { OrderInformationCard } from "@/components/laboratory/test-orders/details/OrderInformationCard";
import { OrderTimelineCard } from "@/components/laboratory/test-orders/details/OrderTimelineCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function getName(patient) {
  return patient?.name || [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Patient";
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function buildTimeline(order) {
  const tests = Array.isArray(order?.tests) ? order.tests : [];
  const events = tests.flatMap((test) => Array.isArray(test.timeline) ? test.timeline : []);
  const firstEventAt = (status) => events.find((event) => event.status === status)?.at;
  const status = order?.status || "Pending";
  const rank = { Pending: 0, Collecting: 1, Processing: 2, Completed: 3 }[status] || 0;
  const steps = [
    { status: "Pending", title: "Order Placed", desc: `By ${order?.doctorName || "Doctor"}` },
    { status: "Collecting", title: "Sample Collection Started", desc: "Sample collection in progress" },
    { status: "Processing", title: "Sample Received in Lab", desc: "Awaiting result entry" },
    { status: "Completed", title: "Results Ready", desc: "All requested tests completed" },
  ];

  return steps.map((step, index) => {
    const at = index === 0 ? (order?.orderedAt || order?.createdAt) : firstEventAt(step.status);
    return {
      title: step.title,
      desc: step.desc,
      time: at ? new Date(at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
      date: at ? new Date(at).toLocaleDateString("en-IN", { month: "short", day: "2-digit" }) : "",
      isDone: rank >= index,
      isActive: rank === index,
    };
  });
}

function OrderDetailsContent({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTestId, setUpdatingTestId] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/laboratory/test-orders/${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch lab order");
      setOrder(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const updateTest = async (testId) => {
    if (!order || !testId) return;
    try {
      setUpdatingTestId(testId);
      const res = await fetch(`${API_BASE}/laboratory/test-orders/${order.id}/tests/${testId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update test status");
      setOrder(data.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingTestId("");
    }
  };

  const patientData = useMemo(() => {
    const patient = order?.patient;
    if (!patient) return null;
    return {
      name: getName(patient),
      uhid: patient.id ? `UHID-${patient.id.slice(0, 8).toUpperCase()}` : "-",
      age: patient.age ? `${patient.age} Yrs` : "-",
      gender: patient.gender || "-",
      phone: patient.contact || "-",
      email: patient.email || "-",
      address: patient.address || "-",
      avatar: "",
    };
  }, [order]);

  const infoData = order ? {
    orderId: order.orderNumber || order.orderId || order.id,
    priority: order.priority || "Normal",
    doctor: order.doctorName || "Doctor",
    department: order.departmentName || "-",
    orderedAt: formatDateTime(order.orderedAt || order.createdAt),
    status: order.status || "Pending",
  } : null;

  if (loading) {
    return (
      <div className="p-5 min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-[13px] font-bold">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-5 text-[13px] font-bold text-destructive">{error}</div>;
  }

  return (
    <div className="p-5 bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <OrderDetailsHeader id={order?.orderNumber || order?.orderId || id} showActionButton={false} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-start">
        <div className="lg:col-span-8 flex flex-col gap-[20px] w-full">
          <PatientInfoCard patient={patientData} />
          <TestsRequestedCard tests={Array.isArray(order?.tests) ? order.tests : []} onUpdate={updateTest} updatingTestId={updatingTestId} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-[20px] w-full">
          <OrderInformationCard info={infoData} />
          <OrderTimelineCard timeline={buildTimeline(order)} />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({ params }) {
  return (
    <Suspense fallback={<div className="p-5 text-muted-foreground">Loading details...</div>}>
      <OrderDetailsContent params={params} />
    </Suspense>
  );
}
