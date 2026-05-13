"use client";

import React from "react";
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Info, 
  Siren,
  MessageSquare,
  MessageCircle,
  MoreVertical,
  CheckCircle2,
  User,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsAlerts() {
  const highPriority = [
    {
      id: 1,
      type: "emergency",
      title: "Emergency Alert: ICU Room 4",
      desc: "Vitals dropping rapidly. Immediate doctor attention required.",
      user: "Robert Chen",
      userInit: "R",
      time: "2m ago",
      icon: Siren,
      iconBg: "bg-[#FEE2E2]",
      iconColor: "text-[#EF4444]"
    },
    {
      id: 2,
      type: "emergency",
      title: "Doctor Delay: Dr. Sarah Jenkins",
      desc: "Dr. Jenkins is delayed by 45 minutes. 3 patients waiting.",
      time: "15m ago",
      icon: Siren,
      iconBg: "bg-[#FEE2E2]",
      iconColor: "text-[#EF4444]"
    }
  ];

  const today = [
    {
      id: 3,
      type: "warning",
      title: "Pending Payment: ₹450.00",
      desc: "Payment pending for Consultation and MRI scan.",
      user: "Alice Johnson",
      userInit: "A",
      time: "1h ago",
      icon: AlertTriangle,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]"
    },
    {
      id: 4,
      type: "info",
      title: "Appointment Reminder",
      desc: "Upcoming Dental Consultation in 2 hours.",
      user: "Michael Smith",
      userInit: "M",
      time: "2h ago",
      icon: Info,
      iconBg: "bg-[#E0E7FF]",
      iconColor: "text-[#4F46E5]"
    },
    {
      id: 5,
      type: "warning",
      title: "Insurance Expiry Warning",
      desc: "Patient's primary health insurance policy expires in 5 days.",
      user: "David Brown",
      userInit: "D",
      time: "3h ago",
      icon: AlertTriangle,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      actions: true
    },
    {
      id: 6,
      type: "info",
      title: "Appointment Reminder",
      desc: "Follow-up checkup scheduled for 4:00 PM today.",
      user: "David Brown",
      userInit: "D",
      time: "5h ago",
      icon: Info,
      iconBg: "bg-[#E0E7FF]",
      iconColor: "text-[#4F46E5]",
      actions: true
    }
  ];

  const NotificationCard = ({ item }) => (
    <div className="bg-card border border-border rounded-[var(--radius)] p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 transition-all hover:border-border/80 group shadow-none">
      <div className={cn("w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0", item.iconBg)}>
        <item.icon className={cn("w-5 h-5", item.iconColor)} />
      </div>
      
      <div className="flex-1 space-y-3 w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-[15px] font-bold text-foreground leading-tight">{item.title}</h3>
            <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground/60 whitespace-nowrap pt-0.5">{item.time}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {item.user && (
              <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-[var(--radius)] border border-border/40">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                  {item.userInit}
                </div>
                <span className="text-[11px] font-bold text-foreground/80">{item.user}</span>
              </div>
            )}
          </div>

          {item.actions && (
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 border border-border rounded-[var(--radius)] text-[11px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all shadow-none">
                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                Send SMS
              </button>
              <button className="h-8 px-3 bg-[#E6F9F1] border border-[#00A389]/20 rounded-[var(--radius)] text-[11px] font-bold text-[#00A389] flex items-center gap-2 hover:bg-[#E6F9F1]/80 transition-all shadow-none">
                <MessageCircle className="w-3.5 h-3.5" />
                Send WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-5 min-h-screen bg-background">
      {/* High Priority Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">High Priority</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {highPriority.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Today Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Today</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {today.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
