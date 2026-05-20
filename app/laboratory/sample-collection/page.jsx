"use client";
import React from "react";
import { SampleCollectionHeader } from "@/components/laboratory/sample-collection/SampleCollectionHeader";
import { SampleCollectionList } from "@/components/laboratory/sample-collection/SampleCollectionList";

export default function SampleCollectionPage() {
  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <SampleCollectionHeader />
      <SampleCollectionList />
    </div>
  );
}
