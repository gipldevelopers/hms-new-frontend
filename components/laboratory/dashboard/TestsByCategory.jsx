"use client";
import React from "react";

export function TestsByCategory() {
  const categories = [
    { name: "Biochemistry", value: 342, percentage: 97.7, color: "bg-indigo-600 dark:bg-indigo-400" },
    { name: "Haematology", value: 284, percentage: 81.1, color: "bg-blue-600 dark:bg-blue-400" },
    { name: "Microbiology", value: 126, percentage: 36.0, color: "bg-purple-600 dark:bg-purple-400" },
    { name: "Immunology", value: 89, percentage: 25.4, color: "bg-amber-500 dark:bg-amber-400" },
    { name: "Histopathology", value: 42, percentage: 12.0, color: "bg-emerald-600 dark:bg-emerald-400" },
    { name: "Serology", value: 36, percentage: 10.3, color: "bg-slate-500 dark:bg-slate-400" }
  ];

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-[16px] font-bold text-foreground mb-5">Tests by Category</h2>
        <div className="space-y-5">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-28 text-[13px] font-semibold text-foreground/80 shrink-0">
                {category.name}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-lg overflow-hidden">
                <div
                  className={`h-full ${category.color} rounded-lg`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-[13px] font-bold text-foreground shrink-0">
                {category.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
