"use client";
import React from "react";

export function PatientInfoCard({ patient }) {
  if (!patient) return null;

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-5 shadow-none">
      {/* Patient info top */}
      <div className="flex items-center gap-4">
        {patient.avatar ? (
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-14 h-14 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-[18px] font-bold text-primary">{patient.name?.charAt(0)?.toUpperCase() || "P"}</span>
          </div>
        )}
        <div>
          <h3 className="text-[16px] font-bold text-foreground">{patient.name}</h3>
          <p className="text-[12px] text-muted-foreground font-semibold mt-0.5">
            {patient.uhid} • {patient.age} • {patient.gender}
          </p>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Patient info details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Contact</span>
          <span className="text-[13px] font-semibold text-foreground">{patient.phone}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email</span>
          <span className="text-[13px] font-semibold text-foreground truncate block">{patient.email}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Address</span>
          <span className="text-[13px] font-semibold text-foreground leading-relaxed block">
            {patient.address}
          </span>
        </div>
      </div>
    </div>
  );
}
