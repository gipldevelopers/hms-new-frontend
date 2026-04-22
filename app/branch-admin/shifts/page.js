"use client";

import React from "react";
import { 
  LayoutGrid, 
  CalendarDays, 
  ClipboardList, 
  Settings, 
  Users, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShiftDashboard() {
  const cards = [
    { 
      title: "Shift Templates", 
      desc: "Manage blueprints for various branch shifts", 
      icon: LayoutGrid, 
      path: "/branch-admin/shifts/templates",
      color: "bg-blue-500",
      stats: "4 Active"
    },
    { 
      title: "Roster Builder", 
      desc: "Schedule staff members into shift slots", 
      icon: CalendarDays, 
      path: "/branch-admin/shifts/roster",
      color: "bg-purple-500",
      stats: "Week 17 Ready"
    },
    { 
      title: "Attendance Tracking", 
      desc: "Monitor real-time check-ins and check-outs", 
      icon: ClipboardList, 
      path: "/branch-admin/shifts/attendance",
      color: "bg-emerald-500",
      stats: "38 Present"
    },
    { 
      title: "Shift Settings", 
      desc: "Configure global rules and grace periods", 
      icon: Settings, 
      path: "/branch-admin/shifts/settings",
      color: "bg-orange-500",
      stats: "Configured"
    }
  ];

  return (
    <div className="p-6 space-y-5 min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] dark:text-white tracking-tight">
            Shift Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Welcome to the shift control center for your branch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.title}
          >
            <Link 
              href={card.path}
              className="group block bg-white dark:bg-[#101935] p-8 rounded-[5px] border border-gray-100 dark:border-white/5 shadow-none hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`w-16 h-16 ${card.color} rounded-[5px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black dark:text-white">{card.title}</h2>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-500 rounded-[5px]">
                   {card.stats}
                 </span>
              </div>

              {/* Decorative background circle */}
              <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${card.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4">
         <div className="lg:col-span-2 space-y-5">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Review Late Arrivals", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                { title: "Assign Doctors to Morning Shift", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                { title: "Update Night Shift Rotation", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
                { title: "Download Today's Roster", icon: CalendarDays, color: "text-emerald-500", bg: "bg-emerald-50" }
              ].map((action) => (
                <button key={action.title} className="flex items-center gap-4 p-5 bg-white dark:bg-[#101935] rounded-[5px] border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all text-left">
                  <div className={`w-12 h-12 ${action.bg} dark:bg-white/5 rounded-[5px] flex items-center justify-center shrink-0`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <span className="text-sm font-bold dark:text-white leading-tight">{action.title}</span>
                </button>
              ))}
            </div>
         </div>

         <div className="space-y-5">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Shifts
            </h3>
            <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-gray-100 dark:border-white/5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[5px] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-[5px] flex flex-col items-center justify-center text-primary">
                    <span className="text-[10px] font-black leading-none">MAY</span>
                    <span className="text-lg font-black leading-none">0{i}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">Emergency Surgery</p>
                    <p className="text-[10px] text-gray-400 font-medium">02:00 PM - 08:00 PM</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-[5px] transition-all">View All Shifts</button>
            </div>
         </div>
      </div>
    </div>
  );
}
