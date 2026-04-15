"use client";

import * as React from "react";
import { Search, Bell, Command, ArrowLeft, ArrowRight, User, LogOut, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

export default function Header({ isCollapsed, setIsCollapsed }) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Close popovers on click outside (simple implementation)
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
    { id: 1, title: "New patient registered", desc: "Sarah Connor at Downtown Clinic", time: "5 mins ago" },
    { id: 2, title: "Revenue Milestone", desc: "Target 15% exceeded in Krishna Shalby", time: "2 hours ago" },
    { id: 3, title: "System Alert", desc: "Scheduled backup completed successfully", time: "4 hours ago" },
    { id: 4, title: "Security Update", desc: "New login from unauthorized device", time: "Yesterday" },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#101935] px-6 h-[72px] flex items-center justify-between border-b border-[#E7E8EB] dark:border-white/10 z-20 flex-shrink-0 transition-all">
      
      {/* Left side: Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-[#1e293b] transition-all"
        >
          {isCollapsed ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </button>

        <div className="relative w-[320px] hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 z-10" />
            <Input 
              type="text"
              placeholder="Search"
              className="pl-10 pr-12 h-10 w-full bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[14px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-100 transition-all dark:text-white"
            />
            <div className="absolute right-2 flex items-center justify-center w-7 h-7 bg-gray-50 dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-md">
              <Command className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
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
            className="w-10 h-10 rounded-full border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1e293b] relative"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 border-2 border-white dark:border-[#101935] rounded-full"></span>
          </Button>

          {isNotificationsOpen && (
            <div 
              className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-[#E7E8EB] dark:border-white/10 flex justify-between items-center">
                <span className="text-[14px] font-bold text-[#101935] dark:text-white">Recent Notifications</span>
                <span className="text-[11px] font-semibold bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">4 New</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b border-[#E7E8EB] dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <p className="text-[13px] font-bold text-[#101935] dark:text-white leading-tight">{n.title}</p>
                    <p className="text-[12px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-1">{n.desc}</p>
                    <p className="text-[11px] text-[#94A3B8] dark:text-slate-500 mt-2 font-medium">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-[#E7E8EB] dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
                <button className="text-[12px] font-bold text-[#2D3A8C] dark:text-blue-400 hover:underline">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Popover */}
        <div className="relative ml-1">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-10 h-10 rounded-full border border-[#E7E8EB] dark:border-white/10 cursor-pointer overflow-hidden hover:opacity-90 transition-opacity relative"
          >
            <Avatar className="w-full h-full">
              <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#101935] rounded-full"></span>
          </div>

          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#E7E8EB] dark:border-white/10">
                <p className="text-[14px] font-bold text-[#101935] dark:text-white truncate">Ayush Solanki</p>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium truncate">Super Admin</p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#64748B] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-[5px] transition-colors">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[5px] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}