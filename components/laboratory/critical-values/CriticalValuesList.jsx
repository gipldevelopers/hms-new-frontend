"use client";
import React from "react";
import { CriticalValueCard } from "./CriticalValueCard";

export function CriticalValuesList({ items, onUpdate, onAcknowledge }) {
  if (items.length === 0) {
    return (
      <div className="bg-card text-center p-[40px] border border-border rounded-[5px] text-[13px] font-bold text-muted-foreground italic select-none shadow-none">
        No critical alerts found matching the active filters
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {items.map((item) => (
        <CriticalValueCard
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  );
}
