"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const statusColors = {
  Pending: "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]",
  Collecting: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
  Processing: "bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd]",
  Completed: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]",
};

const priorityColors = {
  Urgent: "bg-rose-500",
  High: "bg-amber-500",
  Normal: "bg-emerald-500",
};

function formatTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function patientName(patient) {
  return patient?.name || [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") || "Patient";
}

function mapOrder(order) {
  const tests = Array.isArray(order.tests) ? order.tests : [];
  const visibleTests = tests.slice(0, 2).map((test) => test.name);
  return {
    id: order.id,
    orderId: order.orderNumber || order.orderId || order.id,
    patientName: patientName(order.patient),
    uhid: order.patient?.id ? `UHID-${order.patient.id.slice(0, 8).toUpperCase()}` : "-",
    ageGen: `${order.patient?.age || "-"}${order.patient?.gender ? `/${order.patient.gender.charAt(0).toUpperCase()}` : ""}`,
    doctor: order.doctorName || "Doctor",
    tests: visibleTests,
    extraTests: Math.max(0, tests.length - visibleTests.length),
    priority: order.priority || "Normal",
    status: order.status || "Pending",
    orderedAt: formatTime(order.orderedAt || order.createdAt),
  };
}

export function TestOrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/laboratory/test-orders`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch lab orders");
        if (alive) setOrders(Array.isArray(data.data) ? data.data.map(mapOrder) : []);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchOrders();
    return () => { alive = false; };
  }, []);

  const rows = useMemo(() => orders, [orders]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-10 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-[13px] font-bold">Loading lab orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-[13px] font-bold text-destructive">
        {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-10 text-center text-[13px] font-bold text-muted-foreground">
        No lab investigations ordered by doctors yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="block sm:hidden space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-3 shadow-none">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-foreground">#{row.orderId}</span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${statusColors[row.status]}`}>
                {row.status}
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-foreground">{row.patientName}</h4>
              <p className="text-[11px] text-muted-foreground font-semibold">{row.uhid} - {row.ageGen}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold border-t border-border pt-3">
              <div>
                <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Referring Doctor</span>
                <span className="text-foreground">{row.doctor}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Ordered At</span>
                <span className="text-foreground block">{row.orderedAt}</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center gap-3">
              <div className="flex flex-wrap gap-1">
                {row.tests.map((test) => (
                  <span key={test} className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-muted text-foreground rounded">{test}</span>
                ))}
                {row.extraTests > 0 && <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-muted text-muted-foreground rounded">+{row.extraTests}</span>}
              </div>
              <Link href={`/laboratory/test-orders/${row.id}`}>
                <button className="flex items-center gap-1 bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold px-3 py-1.5 rounded border border-border transition-colors">
                  <Eye size={13} />
                  <span>View</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block bg-card text-card-foreground rounded-lg border border-border overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px] xl:min-w-0">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Patient Name</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Age/Gen</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Doctor</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Tests Ordered</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Priority</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Ordered At</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3 text-[12px] font-bold text-foreground">{row.orderId}</td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{row.patientName}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">{row.uhid}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">{row.ageGen}</td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">{row.doctor}</td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.tests.map((test) => <span key={test} className="bg-muted px-2 py-0.5 rounded-[4px] text-[10px] font-bold text-foreground">{test}</span>)}
                      {row.extraTests > 0 && <span className="text-[10px] text-muted-foreground font-bold pl-0.5">+{row.extraTests} more</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[row.priority] || priorityColors.Normal}`} />
                      <span className="text-foreground">{row.priority}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${statusColors[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-foreground">{row.orderedAt}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/laboratory/test-orders/${row.id}`}>
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted/50 transition-colors">
                        <Eye size={15} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
