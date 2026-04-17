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
  X,
  ChevronDown,
  Stethoscope,
  UserRound,
  ClipboardList,
  Pill,
  FlaskConical,
  Microscope,
  Wallet,
  PieChart,
  CalendarDays,
  Hotel
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Database = ({ className }) => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>
}

const Target = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>

const roleMenus = {
  "super-admin": [
    { name: "Dashboard", icon: LayoutGrid, path: "/super-admin", section: "none" },
    { name: "Branch Management", icon: Building2, path: "/super-admin/branches", section: "MANAGEMENT" },
    { name: "User Management", icon: Users2, path: "/super-admin/users", section: "MANAGEMENT" },
    { name: "Configurations", icon: Settings, path: "/super-admin/configurations", section: "CONFIGURATION",
      subItems: [
        { name: "Master Data", path: "/super-admin/configurations/master-data" },
        { name: "Templates", path: "/super-admin/configurations/templates" },
        { name: "Assignments", path: "/super-admin/configurations/assignments" },
      ]
    },
    { name: "Analytics", icon: BarChart3, path: "/super-admin/analytics", section: "SYSTEM" },
    { name: "Audit Logs", icon: FileText, path: "/super-admin/audit-logs", section: "SYSTEM" },
  ],
  "branch-admin": [
    { name: "Dashboard", icon: LayoutGrid, path: "/branch-admin", section: "none" },
    { name: "Departments", icon: Building2, path: "/branch-admin/departments", section: "MANAGEMENT" },
    { name: "Staff Management", icon: Users2, path: "/branch-admin/staff", section: "MANAGEMENT" },
    { name: "Inventory", icon: Database, path: "/branch-admin/inventory", section: "SYSTEM" },
    { name: "Analytics", icon: BarChart3, path: "/branch-admin/analytics", section: "SYSTEM" },
  ],
  "doctor": [
    { name: "Dashboard", icon: LayoutGrid, path: "/doctor", section: "none" },
    { name: "Appointments", icon: CalendarDays, path: "/doctor/appointments", section: "CLINICAL" },
    { name: "Patients", icon: UserRound, path: "/doctor/patients", section: "CLINICAL" },
    { name: "Prescriptions", icon: Pill, path: "/doctor/prescriptions", section: "CLINICAL" },
  ],
  "staff": [
    { name: "Dashboard", icon: LayoutGrid, path: "/staff", section: "none" },
    { name: "Attendence", icon: ClipboardList, path: "/staff/attendance", section: "WORK" },
    { name: "My Tasks", icon: Target, path: "/staff/tasks", section: "WORK" },
  ],
  "reception": [
    { name: "Dashboard", icon: LayoutGrid, path: "/reception", section: "none" },
    { name: "Registration", icon: UserRound, path: "/reception/registration", section: "FRONT DESK" },
    { name: "Appointments", icon: CalendarDays, path: "/reception/appointments", section: "FRONT DESK" },
    { name: "Room Booking", icon: Hotel, path: "/reception/rooms", section: "FRONT DESK" },
  ],
  "pharmacy": [
    { name: "Dashboard", icon: LayoutGrid, path: "/pharmacy", section: "none" },
    { name: "Medicines", icon: Pill, path: "/pharmacy/medicines", section: "INVENTORY" },
    { name: "Sales", icon: Wallet, path: "/pharmacy/sales", section: "FINANCE" },
  ],
  "laboratory": [
    { name: "Dashboard", icon: LayoutGrid, path: "/laboratory", section: "none" },
    { name: "Tests", icon: FlaskConical, path: "/laboratory/tests", section: "OPS" },
    { name: "Reports", icon: Microscope, path: "/laboratory/reports", section: "OPS" },
  ],
  "radiology": [
    { name: "Dashboard", icon: LayoutGrid, path: "/radiology", section: "none" },
    { name: "Scans", icon: Microscope, path: "/radiology/scans", section: "OPS" },
    { name: "Reports", icon: Microscope, path: "/radiology/reports", section: "OPS" },
  ],
  "finance": [
    { name: "Dashboard", icon: LayoutGrid, path: "/finance", section: "none" },
    { name: "Invoices", icon: Wallet, path: "/finance/invoices", section: "ACCOUNTS" },
    { name: "Payroll", icon: Users2, path: "/finance/payroll", section: "ACCOUNTS" },
  ],
  "reports": [
    { name: "Dashboard", icon: LayoutGrid, path: "/reports", section: "none" },
    { name: "System Reports", icon: PieChart, path: "/reports/system", section: "REPORTS" },
    { name: "User Logs", icon: FileText, path: "/reports/logs", section: "REPORTS" },
  ]
};

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = React.useState(null);

  // Detect current role from pathname
  const currentRole = pathname.split('/')[1] || 'super-admin';
  const menuItems = roleMenus[currentRole] || roleMenus['super-admin'];

  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems?.some(sub => pathname.startsWith(sub.path))) {
        setOpenSubMenu(item.name);
      }
    });
  }, [pathname, menuItems]);

  const sections = [...new Set(menuItems.map(item => item.section))];
  // Reorder sections so "none" is first
  const orderedSections = ["none", ...sections.filter(s => s !== "none")];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "bg-white dark:bg-[#101935] flex flex-col h-full border-r border-[#E7E8EB] dark:border-white/10 transition-all duration-300 ease-in-out z-[110] shrink-0 relative",
          isCollapsed ? "w-full lg:w-[80px]" : "w-[280px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-[72px] border-b border-[#E7E8EB] dark:border-white/10 shrink-0 transition-all duration-300 overflow-hidden",
            isCollapsed ? "lg:justify-center px-4" : "px-6",
          )}
        >
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                <Image 
                  src="/favicon.ico" 
                  width={32} 
                  height={32} 
                  alt="Logo" 
                  className="object-contain"
                />
             </div>
            <span className={cn(
              "text-xl font-bold text-primary tracking-tight whitespace-nowrap transition-all duration-300",
              isCollapsed && "lg:opacity-0 lg:invisible lg:w-0"
            )}>
              GVoice HMS
            </span>
          </div>

          {!isCollapsed && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Profile Section - Dynamic Role Display */}
        <div className={cn("p-4 shrink-0 transition-all duration-300 overflow-hidden", isCollapsed && "lg:px-2")}>
          <div className={cn(
            "flex items-center border border-[#E7E8EB] dark:border-white/10 rounded-[10px] transition-all bg-white dark:bg-[#1e293b]", 
            isCollapsed ? "lg:justify-center p-2" : "p-3 gap-3"
          )}>
            <div className="w-9 h-9 bg-primary rounded-[5px] shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VD</span>
            </div>
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-300",
              isCollapsed && "lg:opacity-0 lg:invisible lg:w-0"
            )}>
              <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white truncate">Vraj Darji</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate uppercase tracking-tighter capitalize">{currentRole.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        <nav className={cn(
          "flex-1 px-3 space-y-5 pt-2 no-scrollbar pb-10 transition-all duration-300",
          isCollapsed ? "lg:overflow-visible" : "overflow-y-auto"
        )}>
          {orderedSections.map((section) => (
            <div key={section} className="space-y-1">
              {section !== "none" && (
                <p className={cn(
                  "px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap transition-all duration-300",
                  isCollapsed && "lg:opacity-0 lg:invisible lg:h-0 lg:mb-0"
                )}>
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {menuItems
                  .filter((i) => i.section === section)
                  .map((item) => (
                    <div key={item.name} className="w-full">
                      <NavItem
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={pathname === item.path || item.subItems?.some(s => pathname === s.path)}
                        hasSubItems={!!item.subItems}
                        isOpen={openSubMenu === item.name}
                        onClick={() => {
                          if (item.subItems) {
                            setOpenSubMenu(openSubMenu === item.name ? null : item.name);
                          }
                        }}
                        pathname={pathname}
                      />
                      {item.subItems && (
                        <AnimatePresence>
                          {openSubMenu === item.name && (isCollapsed ? !isCollapsed : true) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="ml-10 mt-1 space-y-1">
                                {item.subItems.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.path}
                                    className={cn(
                                      "flex items-center h-8 px-3 rounded-[5px] text-[12px] font-semibold transition-all",
                                      pathname === sub.path 
                                        ? "text-primary bg-primary/5 dark:bg-primary/10" 
                                        : "text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1e293b]"
                                    )}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({ item, isCollapsed, isActive, hasSubItems, isOpen, onClick, pathname }) {
  const Icon = item.icon;
  const content = (
    <div
      onClick={hasSubItems ? onClick : undefined}
      className={cn(
        "flex items-center rounded-[5px] transition-all relative group h-10 cursor-pointer overflow-hidden",
        isCollapsed ? "lg:justify-center px-0 bg-transparent lg:px-0" : "px-3 gap-3 w-full",
        isActive
          ? "bg-primary/5 dark:bg-primary/10 text-primary"
          : "text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1e293b]",
        !isCollapsed && "px-3 gap-3"
      )}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-r-full" />
      )}
      <div className={cn(
        "flex items-center justify-center shrink-0 transition-all duration-300",
        isCollapsed ? "w-10 h-10 lg:w-10 lg:h-10" : "w-4.5 h-4.5"
      )}>
        <Icon className={cn("w-4.5 h-4.5", isActive ? "text-primary" : "text-[#5E6C84] dark:text-slate-500")} />
      </div>
      <div className={cn(
        "flex items-center justify-between flex-1 transition-all duration-300",
        isCollapsed && "lg:opacity-0 lg:invisible lg:w-0"
      )}>
        <span className="font-semibold text-[13px] whitespace-nowrap">
          {item.name}
        </span>
        {hasSubItems && (
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
        )}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative group/collapsed-parent">
           {hasSubItems ? (
             <div className="w-full">{content}</div>
           ) : (
             <Link href={item.path} className="w-full block">
               {content}
             </Link>
           )}
           
           {isCollapsed && hasSubItems && (
             <div className="absolute left-full top-0 pl-3 hidden lg:group-hover/collapsed-parent:block z-[250]">
                <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] p-2 min-w-[220px] shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                     <div className="px-3 py-2.5 mb-1 bg-primary/5 dark:bg-primary/10 rounded-[6px]">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-widest">{item.name}</p>
                     </div>
                    <div className="space-y-0.5">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={cn(
                            "flex items-center h-10 px-3 rounded-[6px] text-[13px] font-semibold transition-all mb-0.5",
                            pathname === sub.path 
                              ? "text-primary bg-primary/5 dark:bg-primary/10" 
                              : "text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1e293b] hover:translate-x-1"
                          )}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
               </div>
             </div>
           )}
        </div>
      </TooltipTrigger>
      {isCollapsed && !hasSubItems && (
        <TooltipContent 
          side="right" 
          sideOffset={20}
          className="bg-[#1e293b] text-white border-none text-[12px] font-bold shadow-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
