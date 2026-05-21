"use client";
import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

export function TestOrderQueueHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      <h1 className="text-[20px] font-bold text-foreground leading-tight tracking-tight">
        Test Order Queue
      </h1>
      <Link href="/laboratory/test-orders/new">
        <button className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors select-none cursor-pointer">
          <Plus size={16} />
          <span>New Test Order</span>
        </button>
      </Link>
    </div>
  );
}
