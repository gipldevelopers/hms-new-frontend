"use client";

import React from "react";
import { 
  ArrowRight, 
  Calendar,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BookAppointmentStep2() {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = React.useState(1);
  const [selectedSlot, setSelectedSlot] = React.useState("10:30 AM");
  const [selectedDate, setSelectedDate] = React.useState("Mon, 12 Oct");

  const doctors = [
    { id: 1, name: "Dr. Arvind Gupta", specialization: "General Medicine", exp: "15 yrs exp", fee: "₹500", next: "Today 10:30 AM", initials: "DAG" },
    { id: 2, name: "Dr. Meera Iyer", specialization: "General Medicine", exp: "8 yrs exp", fee: "₹400", next: "Tomorrow 09:00 AM", initials: "DMI" },
    { id: 3, name: "Dr. Meera Iyer", specialization: "General Medicine", exp: "8 yrs exp", fee: "₹400", next: "Tomorrow 09:00 AM", initials: "DMI" },
    { id: 4, name: "Dr. Meera Iyer", specialization: "General Medicine", exp: "8 yrs exp", fee: "₹400", next: "Tomorrow 09:00 AM", initials: "DMI" },
  ];

  const dates = [
    "Mon, 12 Oct",
    "Tue, 13 Oct",
    "Wed, 14 Oct",
    "Thu, 15 Oct"
  ];

  const timeSlots = [
    { time: "09:00 AM", status: "emergency" },
    { time: "09:15 AM", status: "emergency" },
    { time: "09:30 AM", status: "available" },
    { time: "09:45 AM", status: "available" },
    { time: "10:00 AM", status: "emergency" },
    { time: "10:15 AM", status: "booked" },
    { time: "10:30 AM", status: "selected" },
    { time: "10:45 AM", status: "available" },
    { time: "11:00 AM", status: "booked" },
    { time: "11:15 AM", status: "booked" },
    { time: "11:30 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:30 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
    { time: "11:45 AM", status: "available" },
  ];

  const getSlotStyles = (slot) => {
    switch (slot.status) {
      case "emergency": return "bg-[#FFF1F1] border-red-100 text-red-400";
      case "booked": return "bg-[#FEF9EE] border-yellow-100 text-yellow-500";
      case "selected": return "bg-primary border-primary text-white";
      case "available": return "bg-white border-border text-foreground/40";
      default: return "bg-white border-border text-foreground/40";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">
          Book Appointment: Step 2
        </h1>
      </div>

      {/* Main Content Area - Vertical Stack */}
      <div className="flex flex-col gap-5 w-full">
        
        {/* Section 1: Select Doctor */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-none">
          <h2 className="text-[14px] font-bold text-foreground">Select Doctor</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={cn(
                  "flex p-4 sm:p-5 rounded-[var(--radius)] border transition-all relative group items-start",
                  selectedDoctor === doctor.id
                    ? "border-primary bg-primary/0"
                    : "border-border hover:bg-muted/30 bg-card"
                )}
              >
                {/* Avatar / Initials */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[13px] sm:text-[14px] shrink-0 mr-3 sm:mr-4">
                  {doctor.initials}
                </div>
                
                {/* Content Container */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  {/* Top Row: Info + Button */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground truncate">{doctor.name}</h3>
                      <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate">{doctor.specialization} • {doctor.exp}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={cn(
                        "h-7 sm:h-8 px-3 sm:px-5 rounded-[3px] text-[10px] sm:text-[11px] font-bold transition-all shadow-none whitespace-nowrap",
                        selectedDoctor === doctor.id
                          ? "bg-primary text-white"
                          : "bg-background border border-border text-foreground/60 hover:bg-muted"
                      )}
                    >
                      {selectedDoctor === doctor.id ? "Selected" : "Select"}
                    </button>
                  </div>
                  
                  {/* Bottom Row: Fee + Next */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[11px] sm:text-[12px] font-bold text-foreground">Fee: {doctor.fee}</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#00A389] bg-[#E6F9F1] px-2 py-0.5 rounded-[2px]">Next: {doctor.next}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Select Time Slot */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-4 sm:p-6 space-y-5 shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-foreground">Select Time Slot</h2>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-border bg-white" />
                <span className="text-[10px] font-medium text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-[10px] font-medium text-muted-foreground">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[10px] font-medium text-muted-foreground">Emergency</span>
              </div>
            </div>
          </div>

          {/* Date Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "h-9 px-5 rounded-[var(--radius)] text-[11px] sm:text-[12px] font-bold transition-all whitespace-nowrap shadow-none border",
                  selectedDate === date
                    ? "bg-primary border-primary text-white"
                    : "bg-background border-border text-foreground/60 hover:bg-muted"
                )}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
            {timeSlots.map((slot, i) => (
              <button
                key={i}
                disabled={slot.status === "booked" || slot.status === "emergency"}
                onClick={() => setSelectedSlot(slot.time)}
                className={cn(
                  "h-10 sm:h-11 rounded-[3px] border text-[11px] sm:text-[12px] font-bold transition-all shadow-none flex items-center justify-center",
                  getSlotStyles(slot),
                  slot.status === "available" && "hover:border-primary hover:text-primary"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto h-11 px-8 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-[var(--radius)] text-[13px] font-bold transition-all shadow-none"
          >
            Cancel
          </button>
          <button 
            onClick={() => router.push("/reception/opd-appointments/book/confirm")}
            className="w-full sm:w-auto h-11 px-8 bg-primary text-white rounded-[var(--radius)] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-none"
          >
            Confirm & Book
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
