"use client";

import React from "react";
import { ArrowRight, Calendar, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SLOT_DURATION = 15; // minutes

function generateSlots(startHour = 9, endHour = 17) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += SLOT_DURATION) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

function formatSlotDisplay(time24) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getNextDays(n = 5) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateLabel(date) {
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function toDateString(date) {
  return date.toISOString().split("T")[0];
}

export default function BookAppointmentStep2() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("authtoken")}` });

  const [step1, setStep1] = React.useState(null);
  const [doctors, setDoctors] = React.useState([]);
  const [doctorsLoading, setDoctorsLoading] = React.useState(true);

  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(getNextDays(1)[0]);
  const [selectedSlot, setSelectedSlot] = React.useState(null);

  const [bookedSlots, setBookedSlots] = React.useState([]); // [{ time: "HH:MM", status }]
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({});
  const days = getNextDays(5);
  const allSlots = generateSlots(9, 17);

  // Load step1 data from session
  React.useEffect(() => {
    const raw = sessionStorage.getItem("appt_step1");
    if (!raw) { router.replace("/reception/opd-appointments/book"); return; }
    setStep1(JSON.parse(raw));
  }, []);

  // Load doctors
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/appointments/doctors`, { headers: headers() });
        const json = await res.json();
        if (json.success) setDoctors(json.data);
      } catch (e) { console.error(e); }
      finally { setDoctorsLoading(false); }
    })();
  }, []);

  // Load booked slots when doctor or date changes
  React.useEffect(() => {
    if (!selectedDoctor) return;
    (async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(
          `${API}/appointments/slots?doctorId=${selectedDoctor.id}&date=${toDateString(selectedDate)}`,
          { headers: headers() }
        );
        const json = await res.json();
        if (json.success) setBookedSlots(json.data);
      } catch (e) { console.error(e); }
      finally { setSlotsLoading(false); }
    })();
  }, [selectedDoctor, selectedDate]);

  const getSlotStatus = (time24) => {
    const booked = bookedSlots.find((b) => b.time === time24);
    if (!booked) return "available";
    return booked.status === "CANCELLED" ? "available" : "booked";
  };

  const validate = () => {
    const e = {};
    if (!selectedDoctor) e.doctor = "Please select a doctor.";
    if (!selectedSlot)   e.slot   = "Please select a time slot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const dateTime = new Date(selectedDate);
    const [h, m] = selectedSlot.split(":").map(Number);
    dateTime.setHours(h, m, 0, 0);

    sessionStorage.setItem("appt_step2", JSON.stringify({
      doctor: selectedDoctor,
      date: toDateString(selectedDate),
      slot: selectedSlot,
      dateTime: dateTime.toISOString(),
    }));
    router.push("/reception/opd-appointments/book/confirm");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">Book Appointment: Step 2</h1>
        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">1</span>
          <span className="text-muted-foreground">Select</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">2</span>
          <span className="text-primary">Doctor</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[11px]">3</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Context banner */}
      {step1 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 border border-border rounded-[5px] text-[12px] font-medium text-muted-foreground">
          <span>Patient: <strong className="text-foreground">{step1.patient?.name}</strong></span>
          <span className="text-border">|</span>
          <span>Department: <strong className="text-foreground">{step1.dept?.name}</strong></span>
        </div>
      )}

      <div className="flex flex-col gap-5 w-full">

        {/* Select Doctor */}
        <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-foreground">Select Doctor</h2>
            {errors.doctor && <p className="text-[12px] text-red-500 font-medium">{errors.doctor}</p>}
          </div>
          {doctorsLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-[5px] bg-muted animate-pulse" />)}
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-[5px]">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-[13px] text-amber-700">No doctors found. Please add doctors with the DOCTOR role in user management.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {doctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                const initials = doc.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "DR";
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex p-4 rounded-[5px] border transition-all items-start cursor-pointer",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30 bg-card"
                    )}
                    onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null); setErrors((e) => ({ ...e, doctor: undefined })); }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[13px] shrink-0 mr-3">
                      {initials}
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-[13px] font-bold text-foreground truncate">{doc.name}</h3>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {doc.shiftStartTime && doc.shiftEndTime
                              ? `Shift: ${doc.shiftStartTime} – ${doc.shiftEndTime}`
                              : "General OPD"}
                          </p>
                        </div>
                        <span className={cn(
                          "h-7 px-3 rounded-[3px] text-[11px] font-bold shrink-0",
                          isSelected ? "bg-primary text-white" : "bg-background border border-border text-foreground/60"
                        )}>
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Select Time Slot */}
        <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-foreground">Select Time Slot</h2>
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {errors.slot && <p className="text-[12px] text-red-500 font-medium">{errors.slot}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {[
                { color: "bg-white border border-border", label: "Available" },
                { color: "bg-amber-100 border-amber-200", label: "Booked" },
                { color: "bg-primary border-primary", label: "Selected" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn("w-3 h-3 rounded-[2px] border", l.color)} />
                  <span className="text-[10px] font-medium text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Date tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {days.map((day) => {
              const isSelected = toDateString(day) === toDateString(selectedDate);
              return (
                <button
                  key={toDateString(day)}
                  onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                  className={cn(
                    "h-9 px-5 rounded-[5px] text-[12px] font-bold transition-all whitespace-nowrap border",
                    isSelected ? "bg-primary border-primary text-white" : "bg-background border-border text-foreground/60 hover:bg-muted"
                  )}
                >
                  {formatDateLabel(day)}
                </button>
              );
            })}
          </div>

          {/* Slots */}
          {!selectedDoctor ? (
            <div className="h-24 border border-dashed border-border rounded-[5px] flex items-center justify-center bg-muted/10">
              <p className="text-[12px] text-muted-foreground">Select a doctor first to see available slots</p>
            </div>
          ) : slotsLoading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[13px]">Loading slots...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2">
              {allSlots.map((slot) => {
                const status = getSlotStatus(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    disabled={status === "booked"}
                    onClick={() => { setSelectedSlot(slot); setErrors((e) => ({ ...e, slot: undefined })); }}
                    className={cn(
                      "h-10 rounded-[3px] border text-[11px] font-bold transition-all flex items-center justify-center",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : status === "booked"
                        ? "bg-amber-50 border-amber-200 text-amber-400 cursor-not-allowed"
                        : "bg-white border-border text-foreground/50 hover:border-primary hover:text-primary"
                    )}
                  >
                    {formatSlotDisplay(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto h-11 px-8 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-[5px] text-[13px] font-bold transition-all"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-auto h-11 px-8 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            Confirm & Book <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
