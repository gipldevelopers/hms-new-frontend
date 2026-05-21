"use client";
import React, { useState } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";

export function TestSelection({ selectedTests, toggleTest }) {
  const [activeCategory, setActiveCategory] = useState("Popular Panels");

  const categories = [
    "All Tests",
    "Popular Panels",
    "Biochemistry",
    "Hematology",
    "Immunology"
  ];

  const tests = [
    { id: "cbc", name: "Complete Blood Count (CBC)", code: "HEM-01", price: 45 },
    { id: "lipid", name: "Lipid Profile", code: "BIO-12", price: 65 },
    { id: "lft", name: "Liver Function Test (LFT)", code: "BIO-08", price: 55 },
    { id: "thyroid", name: "Thyroid Panel (T3, T4, TSH)", code: "IMM-04", price: 85 },
    { id: "cmp", name: "Comprehensive Metabolic Panel", code: "BIO-15", price: 110 },
    { id: "hba1c", name: "HbA1c", code: "BIO-03", price: 40 }
  ];

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Test Selection</h2>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          placeholder="Search tests, panels, or codes..."
          className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
        />
      </div>

      {/* Categories & Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        {/* Left Side: Tabs */}
        <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-border no-scrollbar select-none">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-[12px] font-bold text-left transition-all cursor-pointer whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Side: List of Tests */}
        <div className="md:col-span-9 space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {tests.map((test) => {
            const isSelected = selectedTests.some((t) => t.id === test.id);
            return (
              <div
                key={test.id}
                onClick={() => toggleTest(test)}
                className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-all select-none ${
                  isSelected
                    ? "border-primary bg-primary/[0.02]"
                    : "border-border hover:border-border/80 bg-background/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-[13px] font-bold text-foreground leading-snug">
                      {test.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">
                      {test.code}
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-foreground">
                  ₹{test.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
