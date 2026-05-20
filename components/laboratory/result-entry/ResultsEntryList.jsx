"use client";
import React from "react";
import { ResultsEntryCard } from "./ResultsEntryCard";

export function ResultsEntryList({ items, onViewDetails }) {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      {items.length > 0 ? (
        items.map((item) => (
          <ResultsEntryCard
            key={item.id}
            item={item}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <div className="text-center py-[40px] border border-border rounded-[5px] bg-card text-muted-foreground font-semibold">
          No results entry records found matching the active filters.
        </div>
      )}
    </div>
  );
}
