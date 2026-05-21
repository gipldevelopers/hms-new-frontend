"use client";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OrderDetailsHeader({ id, showActionButton = true }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      <div className="flex items-center gap-3">
        <Link href="/laboratory/test-orders" className="p-2 hover:bg-muted rounded-lg border border-border text-foreground transition-all cursor-pointer">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-foreground leading-tight tracking-tight">
            Order Details
          </h1>
          <span className="text-[16px] font-semibold text-muted-foreground">
            #{id}
          </span>
        </div>
      </div>
      {showActionButton && (
        <button className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold px-4 py-2.5 rounded-lg transition-colors select-none cursor-pointer">
          <span>Confirm Collection</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
