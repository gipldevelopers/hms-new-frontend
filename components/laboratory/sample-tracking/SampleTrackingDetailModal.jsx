"use client";
import React from "react";
import { X, CheckCircle2, Clock, MapPin, Clipboard } from "lucide-react";

export function SampleTrackingDetailModal({ isOpen, onClose, sample }) {
  if (!isOpen || !sample) return null;

  // Derive mock timeline history based on the sample's details
  const timelineSteps = [
    {
      title: "Sample Requested",
      time: "09:15 AM",
      description: "Order entry completed by Ward Nurse Sarah Johnson",
      icon: Clipboard,
      status: "done"
    },
    {
      title: "Sample Collected",
      time: "10:30 AM",
      description: `Specimen collected: Blood-EDTA & SST Gold`,
      icon: CheckCircle2,
      status: "done"
    },
    {
      title: "Received in Lab",
      time: sample.status === "Received" || sample.status === "Processing" ? "11:15 AM" : "--",
      description: sample.status === "Received" || sample.status === "Processing" 
        ? "Accession complete. Received at Lab desk by Mark Smith"
        : "Pending receipt at lab facility",
      icon: MapPin,
      status: sample.status === "Received" || sample.status === "Processing" ? "done" : "pending"
    },
    {
      title: "Processing",
      time: sample.status === "Processing" ? "11:45 AM" : "--",
      description: sample.status === "Processing"
        ? `Placed in: ${sample.location}`
        : "Awaiting analysis",
      icon: Clock,
      status: sample.status === "Processing" ? "done" : "pending"
    }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-card border border-border rounded-[5px] w-full max-w-[550px] overflow-hidden flex flex-col shadow-none">
        
        {/* Modal Header */}
        <div className="p-[20px] border-b border-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] text-primary font-bold">
              Sample Tracking Details
            </span>
            <h3 className="text-[16px] font-bold text-foreground leading-tight">
              {sample.patientName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none outline-none"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-[20px] flex flex-col gap-[20px] overflow-y-auto max-h-[70vh]">
          {/* Patient Profile Card */}
          <div className="grid grid-cols-2 gap-4 text-[13px] bg-secondary/35 p-[15px] border border-border/50 rounded-[5px]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
                UHID
              </span>
              <span className="font-bold text-foreground">{sample.uhid}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
                Ordered Tests
              </span>
              <span className="font-bold text-foreground">{sample.tests}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
                Current Location
              </span>
              <span className="font-bold text-foreground">{sample.location}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
                Time Elapsed
              </span>
              <span className="font-bold text-foreground">{sample.timeElapsed}</span>
            </div>
          </div>

          {/* Timeline Tracking */}
          <div className="flex flex-col gap-[20px]">
            <span className="text-[13px] font-bold text-foreground">
              Tracking Log Timeline
            </span>

            <div className="relative border-l border-border pl-[25px] ml-[10px] space-y-[20px]">
              {timelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isDone = step.status === "done";
                return (
                  <div key={idx} className="relative">
                    {/* Circle marker */}
                    <span 
                      className={`absolute -left-[36px] top-0.5 w-[22px] h-[22px] rounded-full border flex items-center justify-center transition-colors ${
                        isDone 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      <IconComponent size={11} className={isDone ? "stroke-[3]" : "stroke-[2]"} />
                    </span>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className={`font-bold ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground">
                          {step.time}
                        </span>
                      </div>
                      <span className="text-[12px] text-muted-foreground/80 font-semibold leading-normal">
                        {step.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-[20px] border-t border-border flex justify-end gap-3 bg-muted/5">
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground border border-primary font-bold text-[13px] px-4 py-2 rounded-[5px] hover:bg-primary/95 cursor-pointer transition-colors shadow-none"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
}
