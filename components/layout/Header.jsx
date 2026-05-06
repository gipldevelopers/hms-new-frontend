"use client";

import * as React from "react";
import {
  Search,
  Bell,
  Command,
  ArrowLeft,
  ArrowRight,
  User,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  // Close popovers on click outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsNotificationsOpen(false);
      setIsProfileOpen(false);
    };
    if (isNotificationsOpen || isProfileOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isNotificationsOpen, isProfileOpen]);

  const notifications = [
    {
      id: 1,
      title: "New patient registered",
      desc: "Sarah Connor at Downtown Clinic",
      time: "5 mins ago",
    },
    {
      id: 2,
      title: "Revenue Milestone",
      desc: "Target 15% exceeded in Krishna Shalby",
      time: "2 hours ago",
    },
    {
      id: 3,
      title: "System Alert",
      desc: "Scheduled backup completed successfully",
      time: "4 hours ago",
    },
    {
      id: 4,
      title: "Security Update",
      desc: "New login from unauthorized device",
      time: "Yesterday",
    },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#101935] px-4 md:px-6 h-[72px] flex items-center justify-between border-b border-[#E7E8EB] dark:border-white/10 z-[30] flex-shrink-0 transition-all">
      {/* Left side: Toggle & Search */}
      <div className="flex items-center gap-3">
        {/* Desktop Collapse Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-all"
        >
          {isCollapsed ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileOpen(!isMobileOpen);
          }}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[5px] border border-[#E7E8EB] dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-[180px] md:w-[320px] hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 md:pr-12 h-10 w-full bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[14px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary transition-all dark:text-white"
            />
            <div className="absolute right-2 hidden md:flex items-center justify-center w-7 h-7 bg-gray-50 dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px]">
              <Command className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1e293b] relative"
          >
            <Bell className="w-[17px] h-[17px] md:w-[18px] md:h-[18px]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary border-2 border-white dark:border-[#101935] rounded-full"></span>
          </Button>

          {isNotificationsOpen && (
            <div
              className="absolute right-[-60px] md:right-0 mt-3 w-72 md:w-80 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-[#E7E8EB] dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                <span className="text-[13px] font-bold text-[#101935] dark:text-white">
                  Recent Notifications
                </span>
                <span className="text-[10px] font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full">
                  4 New
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 border-b border-[#E7E8EB] dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <p className="text-[12px] font-bold text-[#101935] dark:text-white leading-tight group-hover:text-primary transition-colors">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.desc}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] dark:text-slate-500 mt-2 font-bold">
                      {n.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-[#E7E8EB] dark:border-white/10">
                <button className="text-[11px] font-bold text-primary dark:text-primary hover:underline tracking-tighter">
                  View All Updates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Popover */}
        <div className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#E7E8EB] dark:border-white/10 cursor-pointer overflow-hidden hover:opacity-90 transition-opacity relative"
          >
            <Avatar className="w-full h-full">
              <AvatarFallback className="bg-primary text-white font-bold text-[12px]">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#101935] rounded-full"></span>
          </div>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#E7E8EB] dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]">
                <p className="text-[13px] font-bold text-[#101935] dark:text-white truncate">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-bold truncate capitalize">
                  {(user?.role || "User").toLowerCase().replace(/[-_]/g, ' ')}
                </p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-[5px] transition-colors tracking-tight">
                  <User className="w-4 h-4" /> Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
