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
  UserX
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

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Today's Schedule
        </h1>
        <button 
          onClick={() => router.push("/reception/opd-appointments/book")}
          className="h-10 px-5 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:bg-[#3B4CB8]/90 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[5px] p-5 flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-muted-foreground">{stat.label}</p>
              <h3 className="text-[28px] font-bold text-foreground leading-none">{stat.value}</h3>
            </div>
            <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-card border border-border rounded-[5px] overflow-hidden">
        {/* Filters */}
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60">
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-11 pr-4 bg-muted/30 border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none shadow-none">
                  All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] border-border bg-card rounded-[5px] p-1 shadow-xl">
                <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Departments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none shadow-none">
                  All
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] border-border bg-card rounded-[5px] p-1 shadow-xl">
                <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Doctors</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Token</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Patient Name</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Department</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Doctor</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Time</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Status</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Actions</th>
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
                      "px-2.5 py-1 rounded-[5px] text-[11px] font-bold inline-block",
                      getStatusStyles(item.status)
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <button className="h-7 px-3 border border-border bg-background text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all shadow-none">
                        Reschedule
                      </button>
                      <button className="h-7 px-3 border border-border bg-background text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all shadow-none">
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
                    <span className="text-[14px] font-bold text-foreground">{item.token}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-[3px] text-[10px] font-bold",
                      getStatusStyles(item.status)
                    )}>{item.status}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">{item.patient}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-foreground">{item.time}</p>
                  <p className="text-[11px] text-muted-foreground">Appointment</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-[5px]">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground">Doctor</p>
                  <p className="text-[13px] font-bold text-foreground truncate">{item.doctor}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[11px] font-medium text-muted-foreground">Department</p>
                  <p className="text-[13px] font-bold text-foreground">{item.department}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 bg-background border border-border rounded-[5px] text-[12px] font-bold text-foreground shadow-none">
                  Reschedule
                </button>
                <button className="flex-1 h-9 bg-background border border-border rounded-[5px] text-[12px] font-bold text-foreground shadow-none">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
