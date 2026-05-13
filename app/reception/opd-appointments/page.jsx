"use client";

import React from "react";
import {
  Search,
  Plus,
  Calendar,
  Filter,
  ChevronDown,
  MoreVertical,
  CalendarDays,
  UserCheck,
  Clock,
  XCircle,
  UserX,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function OPDAppointments() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const stats = [
    { label: "Today's Appointments", value: "142", icon: CalendarDays, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
    { label: "Checked In", value: "45", icon: UserCheck, color: "text-[#00A389]", bg: "bg-[#00A389]/5" },
    { label: "Waiting", value: "18", icon: Clock, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
    { label: "Cancelled", value: "5", icon: XCircle, color: "text-[#00A389]", bg: "bg-[#00A389]/5" },
    { label: "No Show", value: "2", icon: UserX, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
  ];

  const appointmentData = [
    { token: "A-101", patient: "Rahul Sharma", department: "Cardiology", doctor: "Dr. A. Gupta", time: "09:00 AM", status: "Checked In" },
    { token: "A-102", patient: "Sneha Patel", department: "Orthopedic", doctor: "Dr. R. Mehta", time: "09:15 AM", status: "Waiting" },
    { token: "B-205", patient: "Amit Kumar", department: "ENT", doctor: "Dr. S. Singh", time: "09:30 AM", status: "Checked In" },
    { token: "B-205", patient: "Amit Kumar", department: "ENT", doctor: "Dr. S. Singh", time: "09:30 AM", status: "Checked In" },
    { token: "B-205", patient: "Amit Kumar", department: "ENT", doctor: "Dr. S. Singh", time: "09:30 AM", status: "Checked In" },
    { token: "C-301", patient: "Priya Desai", department: "Dental", doctor: "Dr. K. Joshi", time: "09:45 AM", status: "Cancelled" },
    { token: "A-103", patient: "Vikram Reddy", department: "Cardiology", doctor: "Dr. A. Gupta", time: "10:00 AM", status: "Waiting" },
    { token: "A-103", patient: "Vikram Reddy", department: "Cardiology", doctor: "Dr. A. Gupta", time: "10:00 AM", status: "Waiting" },
    { token: "D-402", patient: "Anjali Verma", department: "Neurology", doctor: "Dr. M. Iyer", time: "10:15 AM", status: "No Show" },
    { token: "D-402", patient: "Anjali Verma", department: "Neurology", doctor: "Dr. M. Iyer", time: "10:15 AM", status: "No Show" },
    { token: "D-402", patient: "Anjali Verma", department: "Neurology", doctor: "Dr. M. Iyer", time: "10:15 AM", status: "No Show" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Checked In": return "bg-[#E6F9F1] text-[#00A389]";
      case "Waiting": return "bg-[#FEF9EE] text-[#F59E0B]";
      case "Cancelled": return "bg-[#FFF1F1] text-red-500";
      case "No Show": return "bg-blue-50 text-blue-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleOpen(true);
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelOpen(true);
  };

  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsRescheduleOpen(false);
        setIsCancelOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Today's Schedule
        </h1>
        <button 
          onClick={() => router.push("/reception/opd-appointments/book")}
          className="h-10 px-5 bg-primary text-white rounded-[var(--radius)] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "bg-card border border-border rounded-[var(--radius)] p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
            i === 4 && "col-span-2 xl:col-span-1" // Last item spans 2 cols on mobile for balance
          )}>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-tight sm:normal-case sm:tracking-normal">{stat.label}</p>
              <h3 className="text-[20px] sm:text-[28px] font-bold text-foreground leading-none">{stat.value}</h3>
            </div>
            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60">
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full h-10 pl-11 pr-4 bg-muted/30 border border-border rounded-[var(--radius)] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 sm:flex-none h-10 px-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between sm:justify-start gap-2 hover:bg-muted transition-all outline-none shadow-none">
                  <span className="truncate text-muted-foreground font-medium">Dept:</span> All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] border-border bg-card rounded-[var(--radius)] p-1 shadow-xl">
                <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Departments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 sm:flex-none h-10 px-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between sm:justify-start gap-2 hover:bg-muted transition-all outline-none shadow-none">
                  <span className="truncate text-muted-foreground font-medium">Dr:</span> All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] border-border bg-card rounded-[var(--radius)] p-1 shadow-xl">
                <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Doctors</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Token</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Patient Name</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Department</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Doctor</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Time</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Status</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {appointmentData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">{item.token}</td>
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">{item.patient}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.department}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.doctor}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.time}</td>
                  <td className="px-5 py-5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-[var(--radius)] text-[11px] font-bold inline-block",
                      getStatusStyles(item.status)
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleReschedule(item)}
                        className="h-7 px-3 border border-border bg-card text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all shadow-none"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleCancel(item)}
                        className="h-7 px-3 border border-border bg-card text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all shadow-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-border/60">
          {appointmentData.map((item, index) => (
            <div key={index} className="p-4 space-y-4 hover:bg-muted/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-foreground bg-muted/30 px-2 py-0.5 rounded-[3px]">{item.token}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-[3px] text-[10px] font-bold",
                      getStatusStyles(item.status)
                    )}>{item.status}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">{item.patient}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-foreground">{item.time}</p>
                  <p className="text-[10px] text-muted-foreground">Appointment</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 border border-border/40 rounded-[var(--radius)]">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Doctor</p>
                  <p className="text-[12px] font-bold text-foreground truncate">{item.doctor}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Dept</p>
                  <p className="text-[12px] font-bold text-foreground">{item.department}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleReschedule(item)}
                  className="flex-1 h-9 bg-card border border-border rounded-[var(--radius)] text-[12px] font-bold text-foreground shadow-none hover:bg-muted"
                >
                  Reschedule
                </button>
                <button 
                  onClick={() => handleCancel(item)}
                  className="flex-1 h-9 bg-card border border-border rounded-[var(--radius)] text-[12px] font-bold text-foreground shadow-none hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-card border border-border rounded-[var(--radius)] w-full max-w-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-border/60">
              <h2 className="text-[16px] font-bold text-foreground">Reschedule Appointment</h2>
              <button 
                onClick={() => setIsRescheduleOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-all"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Current Appointment Box */}
              <div className="p-4 bg-muted/20 border border-border/40 rounded-[var(--radius)] space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Appointment</p>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-foreground">
                    {selectedAppointment?.patient} • {selectedAppointment?.doctor} ({selectedAppointment?.department})
                  </p>
                  <p className="text-[12px] font-bold text-[#F59E0B]">
                    Today, {selectedAppointment?.time}
                  </p>
                </div>
              </div>

              {/* Select Date */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-muted-foreground">Select New Date</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {["Today", "Tomorrow", "14 Oct", "15 Oct"].map((date, i) => (
                    <button
                      key={date}
                      className={cn(
                        "h-9 px-5 rounded-[var(--radius)] text-[12px] font-bold transition-all whitespace-nowrap border",
                        i === 1 
                          ? "bg-primary border-primary text-white" 
                          : "bg-card border-border text-foreground hover:bg-muted"
                      )}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Time */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-muted-foreground">Select New Time Slot</label>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-primary">
                    Morning
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["08:45 AM", "09:15 AM", "09:30 AM", "09:30 AM", "09:30 AM", "09:45 AM", "10:30 AM", "10:45 AM"].map((time, i) => (
                    <button
                      key={i}
                      className={cn(
                        "h-9 rounded-[3px] border text-[11px] font-bold transition-all",
                        i === 6
                          ? "bg-primary border-primary text-white"
                          : "bg-card border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Patient requested"
                  className="w-full h-11 px-4 bg-muted/30 border border-border rounded-[var(--radius)] text-[13px] font-medium outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsRescheduleOpen(false)}
                className="h-10 px-6 border border-destructive/30 text-destructive rounded-[var(--radius)] text-[12px] font-bold hover:bg-destructive/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsRescheduleOpen(false)}
                className="h-10 px-6 bg-primary text-white rounded-[var(--radius)] text-[12px] font-bold hover:opacity-90 transition-all"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-card border border-border rounded-[var(--radius)] w-full max-w-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-border/60">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-[16px] font-bold text-foreground">Cancel Appointment</h2>
              </div>
              <button 
                onClick={() => setIsCancelOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-all"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Appointment Details Box */}
              <div className="p-4 bg-muted/20 border border-border/40 rounded-[var(--radius)] space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Appointment Details</p>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-foreground">
                    {selectedAppointment?.patient} • Token {selectedAppointment?.token}
                  </p>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {selectedAppointment?.doctor} ({selectedAppointment?.department}) • Today, {selectedAppointment?.time}
                  </p>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Cancellation Reason</label>
                <button className="w-full h-11 px-4 flex items-center justify-between bg-card border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none">
                  Patient request
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Process Refund */}
              <div className="flex items-center justify-between p-4 border border-border rounded-[var(--radius)]">
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-foreground">Process Refund</p>
                  <p className="text-[11px] text-muted-foreground">Refund the collected amount of ₹500</p>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-2 p-3 bg-red-50/50 rounded-[var(--radius)] border border-red-100">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[12px] font-medium text-red-500 leading-tight">
                  This action cannot be undone. The token will be released and the slot will become available.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border/60 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCancelOpen(false)}
                className="h-10 px-6 border border-destructive/30 text-destructive rounded-[var(--radius)] text-[12px] font-bold hover:bg-destructive/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsCancelOpen(false)}
                className="h-10 px-6 bg-primary text-white rounded-[var(--radius)] text-[12px] font-bold hover:opacity-90 transition-all shadow-none"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
