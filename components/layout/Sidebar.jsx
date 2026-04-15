"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Users2,
  Settings,
  ShieldCheck,
  BarChart3,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutGrid,
    path: "/super-admin",
    section: "none",
  },
  {
    name: "Branch Management",
    icon: Building2,
    path: "/super-admin/branches",
    section: "MANAGEMENT",
  },
  {
    name: "User Management",
    icon: Users2,
    path: "/super-admin/users",
    section: "MANAGEMENT",
  },
  {
    name: "Configurations",
    icon: Settings,
    path: "/super-admin/configurations",
    section: "CONFIGURATION",
  },
  {
    name: "Master Data",
    icon: ShieldCheck,
    path: "/super-admin/master-data",
    section: "SYSTEM",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/super-admin/analytics",
    section: "SYSTEM",
  },
  {
    name: "Audit Logs",
    icon: FileText,
    path: "/super-admin/audit-logs",
    section: "SYSTEM",
  },
];

export default function Sidebar({ isCollapsed }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "bg-white dark:bg-[#101935] flex flex-col h-full border-r border-[#E7E8EB] dark:border-white/10 transition-all duration-300 ease-in-out z-20 shrink-0",
          isCollapsed ? "w-[80px]" : "w-[280px]",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-[72px] border-b border-[#E7E8EB] dark:border-white/10 shrink-0 transition-all duration-300",
            isCollapsed ? "justify-center" : "px-6",
          )}
        >
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M12 4C7.58172 4 4 7.58172 4 12V28C4 32.4183 7.58172 36 12 36H28C32.4183 36 36 32.4183 36 28V12C36 7.58172 32.4183 4 28 4H12Z"
                fill="#3F51B5"
              />
              <path
                d="M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C24.4183 28 28 24.4183 28 20"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            {!isCollapsed && (
              <span className="text-2xl font-bold text-[#2D3A8C] dark:text-blue-400 tracking-tight whitespace-nowrap">
                HMS
              </span>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-4 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center border border-[#E7E8EB] dark:border-white/10 rounded-[5px] transition-all overflow-hidden bg-white dark:bg-[#1e293b]",
                  isCollapsed
                    ? "w-12 h-12 mx-auto justify-center"
                    : "p-3 gap-3",
                )}
              >
                <div className="w-9 h-9 bg-[#2D3A8C] rounded-[5px] shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AS</span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white truncate">
                      Ayush Solanki
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate">
                      Super admin
                    </p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Ayush Solanki (Super Admin)
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-5 overflow-y-auto pt-2 no-scrollbar">
          {/* Dashboard Item */}
          <div className="space-y-1">
            <NavItem
              item={{
                name: "Dashboard",
                icon: LayoutGrid,
                path: "/super-admin",
              }}
              isCollapsed={isCollapsed}
              isActive={pathname === "/super-admin"}
            />
          </div>

          {["MANAGEMENT", "CONFIGURATION", "SYSTEM"].map((section) => (
            <div key={section} className="space-y-1">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">
                  {section}
                </p>
              )}
              <div
                className={cn(
                  "space-y-1",
                  isCollapsed && "flex flex-col items-center",
                )}
              >
                {menuItems
                  .filter((i) => i.section === section)
                  .map((item) => (
                    <NavItem
                      key={item.path}
                      item={item}
                      isCollapsed={isCollapsed}
                      isActive={pathname === item.path}
                    />
                  ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({ item, isCollapsed, isActive }) {
  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.path}
          className={cn(
            "flex items-center rounded-[5px] transition-all relative group h-10",
            isCollapsed ? "w-10 justify-center" : "px-3 gap-3 w-full",
            isActive
              ? "bg-[#F4F5FB] dark:bg-[#1e293b] text-[#2D3A8C] dark:text-blue-400"
              : "text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1e293b]",
          )}
        >
          {isActive && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#2D3A8C] dark:bg-blue-400 rounded-r-full" />
          )}
          <Icon
            className={cn(
              "w-4.5 h-4.5 shrink-0",
              isActive ? "text-[#2D3A8C] dark:text-blue-400" : "text-[#5E6C84] dark:text-slate-500",
            )}
          />
          {!isCollapsed && (
            <span className="font-semibold text-[13px] whitespace-nowrap transition-opacity duration-300">
              {item.name}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="font-semibold">
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
