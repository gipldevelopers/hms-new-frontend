"use client";
import React from "react";

export function TechnicianWorkload() {
  const technicians = [
    {
      name: "Dr. A. Sharma",
      dept: "Biochemistry",
      samples: 145,
      percentage: 96.7,
      color: "bg-rose-500",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "M. Chen",
      dept: "Haematology",
      samples: 112,
      percentage: 74.7,
      color: "bg-orange-500",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "S. Patel",
      dept: "Microbiology",
      samples: 85,
      percentage: 56.7,
      color: "bg-indigo-600 dark:bg-indigo-400",
      avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "J. Doe",
      dept: "Immunology",
      samples: 42,
      percentage: 28.0,
      color: "bg-blue-500 dark:bg-blue-400",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-[16px] font-bold text-foreground mb-5">Technician Workload</h2>
        <div className="space-y-6">
          {technicians.map((tech, index) => (
            <div key={index} className="flex items-center gap-3">
              <img
                src={tech.avatar}
                alt={tech.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[13px] font-bold text-foreground truncate">
                    {tech.name}
                  </span>
                  <span className="text-[12px] font-bold text-foreground shrink-0">
                    {tech.samples} samples
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-muted-foreground w-24 shrink-0">
                    {tech.dept}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${tech.color} rounded-lg`}
                      style={{ width: `${tech.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
