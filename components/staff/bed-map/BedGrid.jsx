"use client";

import React from "react";
import BedCard from "./BedCard";

export default function BedGrid({ beds = [], refresh, deptId, wardId, branchId }) {
  if (beds.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground font-bold">No beds found in this ward.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-2">
      {beds.map((bed) => (
        <BedCard 
          key={bed.id} 
          bed={bed} 
          refresh={refresh} 
          deptId={deptId}
          wardId={wardId}
          branchId={branchId}
        />
      ))}
    </div>
  );
}
