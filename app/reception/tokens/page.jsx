"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronDown,
  Check,
  Ticket,
  Calendar,
  Filter,
  User,
  Clock,
  Activity,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function TokenManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("listing");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [doctorFilter, setDoctorFilter] = React.useState("All");
  const [departmentFilter, setDepartmentFilter] = React.useState("All");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    const savedTab = localStorage.getItem("hms-token-tab");
    if (savedTab) setActiveTab(savedTab);
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("hms-token-tab", tab);
  };

  const tokenData = [
    {
      id: "1",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "2",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "3",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "4",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "5",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "6",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "7",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "8",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "9",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
    {
      id: "10",
      patientName: "Sarah Jenkins",
      mobile: "+91 84636 86523",
      gender: "Female",
      age: "32 yrs",
      registrationDate: "Oct 24, 2023 09:41 AM",
    },
  ];

  const historyData = [
    { token: "T-099", patient: "Angela Martin", doctor: "Dr. Sarah Jenkins", dateTime: "Today, 10:15 AM", duration: "15 mins", status: "Completed" },
    { token: "T-098", patient: "Kevin Malone", doctor: "Dr. Mike Williams", dateTime: "Today, 09:45 AM", duration: "-", status: "Skipped" },
    { token: "T-097", patient: "Oscar Martinez", doctor: "Dr. Emily Chen", dateTime: "Today, 09:30 AM", duration: "20 mins", status: "Completed" },
    { token: "T-097", patient: "Oscar Martinez", doctor: "Dr. Emily Chen", dateTime: "Today, 09:30 AM", duration: "20 mins", status: "Completed" },
    { token: "T-097", patient: "Oscar Martinez", doctor: "Dr. Emily Chen", dateTime: "Today, 09:30 AM", duration: "20 mins", status: "Completed" },
    { token: "T-097", patient: "Oscar Martinez", doctor: "Dr. Emily Chen", dateTime: "Today, 09:30 AM", duration: "20 mins", status: "Completed" },
    { token: "T-096", patient: "Stanley Hudson", doctor: "Dr. Sarah Jenkins", dateTime: "Today, 09:00 AM", duration: "12 mins", status: "Completed" },
    { token: "T-098", patient: "Kevin Malone", doctor: "Dr. Mike Williams", dateTime: "Today, 09:45 AM", duration: "-", status: "Skipped" },
  ];

  const stats = [
    { label: "Total Tokens (This Month)", value: "1,248", change: "+12%", trend: "up", icon: User },
    { label: "Completed Consultations", value: "1,180", change: "+8%", trend: "up", icon: Calendar },
    { label: "Skipped/Cancelled", value: "68", change: "+2%", trend: "down", icon: Activity },
  ];

  const [showModal, setShowModal] = React.useState(false);
  const [showOverview, setShowOverview] = React.useState(false);
  const [generatedToken, setGeneratedToken] = React.useState("T-105");

  const handleGenerateToken = (patient) => {
    setGeneratedToken(`T-${Math.floor(Math.random() * 900) + 100}`);
    setShowModal(true);
  };

  const handleShowOverview = (patient) => {
    setShowOverview(true);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Token Queue Management
        </h1>
      </div>

      {activeTab === "history" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-[5px] p-5 flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[12px] font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-[24px] font-bold text-foreground leading-none">{stat.value}</h3>
                <p className={cn("text-[11px] font-bold", stat.trend === "up" ? "text-[#00A389]" : "text-red-500")}>
                  {stat.trend === "up" ? "↗" : "↘"} {stat.change} <span className="text-muted-foreground font-medium">from last month</span>
                </p>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-[5px] flex items-center justify-center",
                i === 0 ? "bg-[#3B4CB8]/5 text-[#3B4CB8]" : i === 1 ? "bg-[#00A389]/5 text-[#00A389]" : "bg-red-50 text-red-500"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleTabChange("listing")}
          className={cn(
            "px-5 h-10 rounded-[5px] text-[13px] font-bold transition-all shadow-none",
            activeTab === "listing"
              ? "bg-[#3B4CB8] text-white"
              : "bg-white border border-border text-foreground hover:bg-muted"
          )}
        >
          Token Listing
        </button>
        <button
          onClick={() => handleTabChange("history")}
          className={cn(
            "px-5 h-10 rounded-[5px] text-[13px] font-bold transition-all shadow-none",
            activeTab === "history"
              ? "bg-[#3B4CB8] text-white"
              : "bg-white border border-border text-foreground hover:bg-muted"
          )}
        >
          Token History
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-card border border-border rounded-[5px] shadow-none flex flex-col">
        <div className="p-3 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/60">
          <div className="relative w-full md:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {activeTab === "listing" ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                      {doctorFilter}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[140px] border-border bg-card shadow-xl rounded-[5px] p-1"
                  >
                    {["All", "Dr. Smith", "Dr. Jones"].map((doc) => (
                      <DropdownMenuItem
                        key={doc}
                        onClick={() => setDoctorFilter(doc)}
                        className={cn(
                          "text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]",
                          doctorFilter === doc && "bg-primary/5 text-primary font-bold"
                        )}
                      >
                        {doc}
                        {doctorFilter === doc && <Check className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                      {departmentFilter}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[140px] border-border bg-card shadow-xl rounded-[5px] p-1"
                  >
                    {["All", "OPD", "IPD", "Pharmacy"].map((dep) => (
                      <DropdownMenuItem
                        key={dep}
                        onClick={() => setDepartmentFilter(dep)}
                        className={cn(
                          "text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]",
                          departmentFilter === dep && "bg-primary/5 text-primary font-bold"
                        )}
                      >
                        {dep}
                        {departmentFilter === dep && <Check className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="relative" ref={calendarRef}>
                <button 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none"
                >
                  <Calendar className="w-4 h-4 text-muted-foreground/60" />
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select Date"}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {isCalendarOpen && (
                  <>
                    {/* Mobile: Modal Style */}
                    <div className="md:hidden fixed inset-0 z-[1000] flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsCalendarOpen(false)} />
                      <div className="relative animate-in zoom-in-95 duration-200">
                        <CustomCalendar
                          selectedDate={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                          }}
                          onClose={() => setIsCalendarOpen(false)}
                        />
                      </div>
                    </div>
                    
                    {/* Desktop: Dropdown Style */}
                    <div className="hidden md:block absolute top-[calc(100%+5px)] right-0 z-[100] animate-in fade-in zoom-in-95 duration-200">
                      <CustomCalendar
                        selectedDate={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setIsCalendarOpen(false);
                        }}
                        onClose={() => setIsCalendarOpen(false)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tables & Mobile Views */}
        <div className="flex flex-col">
          {activeTab === "listing" ? (
            <>
              {/* Listing - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/60">
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Patient Name</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Mobile</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Gender / Age</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Registration Date</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tokenData.map((patient, index) => (
                      <tr key={index} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-5 text-[13px] font-bold text-foreground">{patient.patientName}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.mobile}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.gender} • {patient.age}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.registrationDate}</td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleShowOverview(patient)} className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground transition-all group/eye shadow-none">
                              <Eye className="w-4 h-4 group-hover/eye:text-primary" />
                            </button>
                            <button onClick={() => handleGenerateToken(patient)} className="flex items-center gap-2 h-8 px-3 border border-[#3B4CB8]/20 bg-[#3B4CB8]/5 text-[#3B4CB8] rounded-[5px] text-[11px] font-bold hover:bg-[#3B4CB8] hover:text-white transition-all shadow-none">
                              <Ticket className="w-3.5 h-3.5" />
                              Generate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Listing - Mobile */}
              <div className="md:hidden divide-y divide-border/60">
                {tokenData.map((patient, index) => (
                  <div key={index} className="p-4 space-y-4 hover:bg-muted/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-[15px] font-bold text-foreground">{patient.patientName}</h3>
                        <p className="text-[13px] font-medium text-muted-foreground">{patient.mobile}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleShowOverview(patient)} className="p-2 bg-muted/50 rounded-[5px] text-muted-foreground shadow-none">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleGenerateToken(patient)} className="p-2 bg-[#3B4CB8]/10 rounded-[5px] text-[#3B4CB8] shadow-none">
                          <Ticket className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-medium text-muted-foreground">Gender/Age</p>
                        <p className="text-[13px] font-bold text-foreground">{patient.gender} • {patient.age}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[11px] font-medium text-muted-foreground">Reg. Date</p>
                        <p className="text-[13px] font-medium text-foreground">{patient.registrationDate.split(' ')[0]}</p>
                      </div>
                    </div>
                    <button onClick={() => handleGenerateToken(patient)} className="w-full h-10 bg-[#3B4CB8] text-white rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 shadow-none">
                      <Ticket className="w-4 h-4" />
                      Generate Token
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* History - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/60">
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Token Number</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Patient</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Doctor</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Date & Time</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Duration</th>
                      <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground tracking-wider">Final Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {historyData
                      .filter(item => {
                        if (!selectedDate) return true;
                        const isToday = format(new Date(), "MMM dd, yyyy") === format(selectedDate, "MMM dd, yyyy");
                        return isToday; 
                      })
                      .map((item, index) => (
                      <tr key={index} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-5 text-[13px] font-bold text-foreground">{item.token}</td>
                        <td className="px-5 py-5 text-[13px] font-bold text-foreground">{item.patient}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.doctor}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.dateTime}</td>
                        <td className="px-5 py-5 text-[13px] font-medium text-foreground">{item.duration}</td>
                        <td className="px-5 py-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-[5px] text-[11px] font-bold",
                            item.status === "Completed" ? "bg-[#E6F9F1] text-[#00A389]" : "bg-red-50 text-red-500"
                          )}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* History - Mobile */}
              <div className="md:hidden divide-y divide-border/60">
                {historyData
                  .filter(item => {
                    if (!selectedDate) return true;
                    const isToday = format(new Date(), "MMM dd, yyyy") === format(selectedDate, "MMM dd, yyyy");
                    return isToday; 
                  })
                  .map((item, index) => (
                  <div key={index} className="p-4 space-y-4 hover:bg-muted/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-foreground">{item.token}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-[3px] text-[10px] font-bold",
                            item.status === "Completed" ? "bg-[#E6F9F1] text-[#00A389]" : "bg-red-50 text-red-500"
                          )}>{item.status}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-foreground">{item.patient}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-bold text-foreground">{item.duration}</p>
                        <p className="text-[11px] text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-[5px]">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-medium text-muted-foreground">Doctor</p>
                        <p className="text-[13px] font-bold text-foreground truncate">{item.doctor}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[11px] font-medium text-muted-foreground">Date & Time</p>
                        <p className="text-[12px] font-bold text-foreground">{item.dateTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Token Generated Modal */}
      <TokenGeneratedModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        tokenNumber={generatedToken} 
      />

      {/* Token Overview Modal */}
      <TokenOverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
        tokenNumber="T-102" 
      />
    </div>
  );
}

function TokenGeneratedModal({ isOpen, onClose, tokenNumber }) {
  const { X, Check, Printer } = require("lucide-react");

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[420px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#00A389] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-foreground">
              Token Generated
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Successfully assigned to the queue
            </p>
          </div>

          {/* Token Box */}
          <div className="w-full bg-[#F5F7FF] dark:bg-primary/5 border border-primary/10 py-8 rounded-[5px] flex flex-col items-center justify-center space-y-2">
            <span className="text-[11px] font-bold text-primary/60 tracking-widest uppercase">
              Token Number
            </span>
            <span className="text-[42px] font-bold text-[#3B4CB8] leading-none">
              {tokenNumber}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="flex items-center justify-center h-11 border border-red-500 rounded-[5px] text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all shadow-none"
            >
              Cancel
            </button>
            <button 
              className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
            >
              <Printer className="w-4 h-4" />
              Print Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenOverviewModal({ isOpen, onClose, tokenNumber }) {
  const { X, Calendar, Clock } = require("lucide-react");

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previousVisits = [
    { title: "General Checkup", sub: "Dr. Emily Chen", date: "Oct 10, 2023", time: "09:15 AM" },
    { title: "Blood Test", sub: "Pathology Lab", date: "Sep 28, 2023", time: "11:30 AM" },
    { title: "Consultation", sub: "Dr. Alan Smith", date: "Aug 14, 2023", time: "02:45 PM" },
    { title: "Follow-up", sub: "Dr. Emily Chen", date: "Jul 05, 2023", time: "10:00 AM" },
    { title: "Vaccination", sub: "Nurse Station", date: "May 22, 2023", time: "04:15 PM" },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[500px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border/60 flex items-center justify-between shrink-0">
          <h2 className="text-[14px] font-bold text-foreground">Token Overview</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
          <div className="bg-[#F5F7FF] dark:bg-primary/5 border border-primary/10 py-6 rounded-[5px] flex flex-col items-center justify-center space-y-1">
             <span className="text-[11px] font-bold text-primary/60 tracking-widest uppercase">Current Token</span>
             <span className="text-[42px] font-bold text-[#3B4CB8] leading-none">{tokenNumber}</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Previous Visits</h3>
            <div className="space-y-2">
              {previousVisits.map((visit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border/60 rounded-[5px] hover:bg-muted/5 transition-all">
                  <div className="w-10 h-10 bg-muted/40 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-foreground truncate">{visit.title}</h4>
                    <p className="text-[11px] text-muted-foreground truncate">{visit.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-foreground">{visit.date}</p>
                    <p className="text-[11px] text-muted-foreground">{visit.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
