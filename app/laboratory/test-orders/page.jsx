"use client";
import React from "react";
import { TestOrderQueueHeader } from "@/components/laboratory/test-orders/TestOrderQueueHeader";
import { TestOrderFilters } from "@/components/laboratory/test-orders/TestOrderFilters";
import { TestOrderTable } from "@/components/laboratory/test-orders/TestOrderTable";

export default function TestOrderQueuePage() {
  return (
    <div className="p-5 bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <TestOrderQueueHeader />
      <TestOrderFilters />
      <TestOrderTable />
    </div>
  );
}
