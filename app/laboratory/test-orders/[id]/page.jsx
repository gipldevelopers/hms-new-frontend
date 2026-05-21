"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderDetailsHeader } from "@/components/laboratory/test-orders/details/OrderDetailsHeader";
import { PatientInfoCard } from "@/components/laboratory/test-orders/details/PatientInfoCard";
import { TestsRequestedCard } from "@/components/laboratory/test-orders/details/TestsRequestedCard";
import { OrderInformationCard } from "@/components/laboratory/test-orders/details/OrderInformationCard";
import { OrderTimelineCard } from "@/components/laboratory/test-orders/details/OrderTimelineCard";

function OrderDetailsContent({ params }) {
  // Extract order ID dynamically by unwrapping the params Promise
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id || "ORD-1204";
  
  const searchParams = useSearchParams();
  const statusParam = searchParams ? searchParams.get("status") : "";
  const isCompletedOrProcessing = statusParam === "completed" || statusParam === "processing";

  // Exact static details to match the mockup image ditto for both detail pages
  const patientData = {
    name: "Sarah Jenkins",
    uhid: "UHID: 98234",
    age: "45 Yrs",
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "robert.fox@example.com",
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  };

  const infoData = {
    orderId: id,
    priority: isCompletedOrProcessing ? "High" : "Normal",
    doctor: "Dr. Sarah Smith",
    department: "Cardiology",
    orderedAt: "Oct 24, 10:30 AM",
    status: isCompletedOrProcessing ? "Completed" : "Collecting"
  };

  const testsData = [
    { name: "Complete Blood Count (CBC)", code: "HEM-01", status: "Pending", statusColor: "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]" },
    { name: "Liver Function Test (LFT)", code: "BIO-08", status: "Collecting", statusColor: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]" },
    { name: "Lipid Profile", code: "BIO-12", status: "Processing", statusColor: "bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd]" }
  ];

  const timelineData = isCompletedOrProcessing
    ? [
        { title: "Order Placed", desc: "By Dr. Sarah Smith", time: "10:30 AM", date: "Oct 24", isDone: true, iconColor: "bg-emerald-500/10 text-emerald-600" },
        { title: "Sample Collection Started", desc: "Phlebotomist assigned: John D.", time: "10:45 AM", date: "Oct 24", isDone: true, iconColor: "bg-amber-500/10 text-amber-600" },
        { title: "Sample Received in Lab", desc: "Awaiting processing", time: "", date: "", isDone: true, iconColor: "bg-indigo-500/10 text-indigo-600" },
        { title: "Results Ready", desc: "Pending pathologist approval", time: "", date: "", isDone: false, iconColor: "bg-slate-500/10 text-slate-600" }
      ]
    : [
        { title: "Order Placed", desc: "By Dr. Sarah Smith", time: "10:30 AM", date: "Oct 24", isDone: true },
        { title: "Sample Collection Started", desc: "Phlebotomist assigned: John D.", time: "10:45 AM", date: "Oct 24", isDone: true },
        { title: "Sample Received in Lab", desc: "Awaiting processing", time: "", date: "", isDone: false },
        { title: "Results Ready", desc: "Pending pathologist approval", time: "", date: "", isDone: false }
      ];

  return (
    <div className="p-5 bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <OrderDetailsHeader id={id} showActionButton={!isCompletedOrProcessing} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-start">
        {/* Left Column: Patient Info and Tests Requested */}
        <div className="lg:col-span-8 flex flex-col gap-[20px] w-full">
          <PatientInfoCard patient={patientData} />
          <TestsRequestedCard tests={testsData} />
        </div>

        {/* Right Column: Order Information and Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-[20px] w-full">
          <OrderInformationCard info={infoData} />
          <OrderTimelineCard timeline={timelineData} />
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
