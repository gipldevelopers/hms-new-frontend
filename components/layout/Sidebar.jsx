"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
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
  Hotel,
  LogOut,
  User,
  Settings as SettingsIcon,
  ChevronRight,
  MoreVertical,
  Settings2,
  Activity,
  ArrowLeftRight,
  PlusSquare,
  Wrench,
  LogIn,
  Bell,
  Siren,
  Percent,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    { name: "Manage Branches", icon: Building2, path: "/super-admin/branches", section: "MANAGEMENT" },
    { name: "User Management", icon: Users2, path: "/super-admin/users", section: "MANAGEMENT" },
    { name: "Patient Registration", icon: UserRound, path: "/super-admin/patient-registration", section: "MANAGEMENT" },
    { name: "Emergency Registration", icon: Activity, path: "/super-admin/emergency-registration", section: "MANAGEMENT" },
    { name: "Token Management", icon: ClipboardList, path: "/super-admin/tokens", section: "MANAGEMENT" },
    { name: "Bed & Ward Management", icon: Hotel, path: "/super-admin/wards", section: "MANAGEMENT" },
    { name: "Bed Map Overview", icon: LayoutGrid, path: "/super-admin/bed-map", section: "MANAGEMENT" },
    { name: "Admissions & Discharges", icon: ClipboardList, path: "/super-admin/admissions", section: "MANAGEMENT" },
    { name: "Configurations", icon: Settings, path: "/super-admin/configurations", section: "CONFIGURATION",
      subItems: [
        { name: "Master Data", path: "/super-admin/configurations/master-data" },
        { name: "Templates", path: "/super-admin/configurations/templates" },
        { name: "Assignments", path: "/super-admin/configurations/assignments" },
      ]
    },
    { name: "Reports", icon: BarChart3, path: "/super-admin/analytics", section: "SYSTEM" },
    { name: "System Logs", icon: FileText, path: "/super-admin/audit-logs", section: "SYSTEM" },
    { name: "Profile & Settings", icon: User, path: "/super-admin/profile", section: "SYSTEM" },
  ],
  "branch-admin": [
    { name: "Dashboard", icon: LayoutGrid, path: "/branch-admin", section: "none" },
    { name: "Bed & Ward Overview", icon: Hotel, path: "/branch-admin/wards", section: "Main" },
    { name: "Staff Management", icon: Users2, path: "/branch-admin/staff", section: "Main" },
    { name: "Admissions & Discharges", icon: ClipboardList, path: "/branch-admin/admissions", section: "Main" },
    { name: "Billing & Payments", icon: Wallet, path: "/branch-admin/billing", section: "Operations" },
    { name: "Emergency Reports", icon: Stethoscope, path: "/branch-admin/emergency", section: "Admin" },
    { name: "Configurations", icon: Settings, path: "/branch-admin/configuration", section: "Admin" },
    { name: "Profile & Settings", icon: User, path: "/branch-admin/profile", section: "Admin" },
  ],
  "doctor": [
    { name: "Dashboard", icon: LayoutGrid, path: "/doctor", section: "Main" },
    { name: "OPD Queue / Tokens", icon: Siren, path: "/doctor/opd", section: "Main" },
    { name: "IPD Patients", icon: Hotel, path: "/doctor/ipd", section: "Main" },
    { name: "My Schedule", icon: CalendarDays, path: "/doctor/schedule", section: "Work" },
    { name: "Alerts", icon: Bell, path: "/doctor/alerts", section: "Work" },
    { name: "Discharge Request", icon: LogOut, path: "/doctor/discharge", section: "Work" },
    { name: "Reports", icon: BarChart3, path: "/doctor/reports", section: "Reports" },
    { name: "Profile & Settings", icon: User, path: "/doctor/profile", section: "Reports" },
  ],
  "staff": [
    { name: "Dashboard", icon: LayoutGrid, path: "/staff", section: "none" },
    { name: "Bed Map", icon: LayoutGrid, path: "/staff/bed-map", section: "WARD" },
    { name: "Patients", icon: Users2, path: "/staff/patients", section: "WARD" },
    { name: "Vitals", icon: Activity, path: "/staff/vitals", section: "WARD" },
    { name: "Tasks", icon: ClipboardList, path: "/staff/tasks", section: "WARD" },
    { name: "Schedule", icon: ArrowLeftRight, path: "/staff/schedule", section: "MEDICATION" },
    { name: "MAR/ Administer", icon: PlusSquare, path: "/staff/medication/administer", section: "MEDICATION" },
    { name: "Service Requests", icon: Wrench, path: "/staff/services", section: "SERVICES" },
    { name: "Admission/Transfer", icon: ClipboardList, path: "/staff/admissions", section: "ADMISSION" },
    { name: "Profile & Settings", icon: User, path: "/staff/profile", section: "ADMISSION" },
  ],
  "reception": [
    { name: "Dashboard", icon: LayoutGrid, path: "/reception", section: "none" },
    { name: "Patient Registration", icon: UserRound, path: "/reception/patient-registration", section: "RECEPTION" },
    { name: "Emergency Registration", icon: Activity, path: "/reception/emergency-registration", section: "RECEPTION" },
    { name: "Token Management", icon: ClipboardList, path: "/reception/tokens", section: "APPOINTMENTS" },
    { name: "OPD Appointments", icon: CalendarDays, path: "/reception/opd-appointments", section: "APPOINTMENTS" },
    { name: "Patient Receipts", icon: Wallet, path: "/reception/patient-receipts", section: "FINANCE" },
    { name: "Notifications / Alerts", icon: Bell, path: "/reception/notifications", section: "SYSTEM" },
    { name: "Reports", icon: BarChart3, path: "/reception/reports", section: "SYSTEM" },
    { name: "Settings", icon: Settings, path: "/reception/settings", section: "SYSTEM" },
  ],
  "pharmacy": [
    { name: "Dashboard", icon: LayoutGrid, path: "/pharmacy", section: "none" },
    { name: "Prescription Queue", icon: Users2, path: "/pharmacy/prescription-queue", section: "PHARMACY" },
    { name: "Stock / Inventory", icon: ClipboardList, path: "/pharmacy/inventory", section: "INVENTORY" },
    { name: "Purchase & Suppliers", icon: CalendarDays, path: "/pharmacy/suppliers", section: "INVENTORY" },
    { name: "Alerts", icon: Bell, path: "/pharmacy/alerts", section: "SYSTEM" },
    { name: "Reports", icon: BarChart3, path: "/pharmacy/reports", section: "SYSTEM" },
    { name: "Profile & Settings", icon: User, path: "/pharmacy/settings", section: "SYSTEM" },
  ],
  "laboratory": [
    { name: "Dashboard", icon: LayoutGrid, path: "/laboratory", section: "none" },
    { name: "Tests", icon: FlaskConical, path: "/laboratory/tests", section: "OPS" },
    { name: "Reports", icon: Microscope, path: "/laboratory/reports", section: "OPS" },
    { name: "Profile & Settings", icon: User, path: "/laboratory/profile", section: "OPS" },
  ],
  "radiology": [
    { name: "Dashboard", icon: LayoutGrid, path: "/radiology", section: "none" },
    { name: "Scans", icon: Microscope, path: "/radiology/scans", section: "OPS" },
    { name: "Reports", icon: Microscope, path: "/radiology/reports", section: "OPS" },
    { name: "Profile & Settings", icon: User, path: "/radiology/profile", section: "OPS" },
  ],
  "finance": [
    { name: "Dashboard", icon: LayoutGrid, path: "/finance", section: "MAIN" },
    { name: "Patient Billing", icon: Users2, path: "/finance/patient-billing", section: "MAIN" },
    { name: "Payment", icon: CreditCard, path: "/finance/payment", section: "FINANCE & WORK" },
    { name: "Insurance/TPA", icon: ShieldCheck, path: "/finance/insurance", section: "FINANCE & WORK" },
    { name: "Discounts", icon: Percent, path: "/finance/discounts", section: "FINANCE & WORK" },
    { name: "Reports", icon: BarChart3, path: "/finance/reports", section: "REPORTS" },
  ],
  "reports": [
    { name: "Dashboard", icon: LayoutGrid, path: "/reports", section: "none" },
    { name: "System Reports", icon: PieChart, path: "/reports/system", section: "REPORTS" },
    { name: "User Logs", icon: FileText, path: "/reports/logs", section: "REPORTS" },
    { name: "Profile & Settings", icon: User, path: "/reports/profile", section: "REPORTS" },
  ]
};

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;

        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (res.ok && result.success) {
          setUser(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        } else {
          // Fallback to localStorage if API fails
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          setUser(storedUser);
        }
      } catch (error) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

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
  // Reorder sections so "Main" or "none" is first
  const orderedSections = ["Main", "none", ...sections.filter(s => s !== "Main" && s !== "none")];

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
            isCollapsed ? "lg:justify-center lg:px-0" : "px-6",
          )}
        >
          <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
             <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                <Image 
                  src="/favicon.ico" 
                  width={32} 
                  height={32} 
                  alt="Logo" 
                  className="object-contain"
                />
             </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary tracking-tight whitespace-nowrap">
                  GVoice HMS
                </span>
              </div>
            )}
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

        {/* User Profile Section - Now at Top */}
        <div className={cn(
          "px-4 shrink-0 transition-all duration-300 border-b border-transparent",
          isCollapsed ? "lg:px-2 lg:pt-2 mb-2" : "px-4 pt-[20px] mb-4"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn(
                  "flex items-center transition-all bg-white dark:bg-[#101935] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5", 
                  isCollapsed 
                    ? "lg:w-10 lg:h-10 lg:mx-auto rounded-full flex items-center justify-center p-0 border-none shadow-none" 
                    : "gap-3 p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10"
                )}>
                  {/* Avatar */}
                  <div className={cn(
                    "bg-primary rounded-full shrink-0 flex items-center justify-center transition-all",
                    isCollapsed ? "w-8 h-8" : "w-10 h-10"
                  )}>
                    <span className={cn("text-white font-bold", isCollapsed ? "text-[10px]" : "text-[12px]")}>
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
                    </span>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white truncate">
                        {user?.name || "Guest User"}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 font-bold truncate capitalize tracking-tight opacity-80">
                        {(user?.role || currentRole).toLowerCase().replace(/[-_]/g, ' ')}
                      </p>
                    </div>
                  )}
                  
                  {!isCollapsed && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />
                  )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              side={isCollapsed ? "right" : "bottom"} 
              align={isCollapsed ? "start" : "center"}
              className="w-56 mt-2 dark:bg-[#101935] dark:border-white/10 z-[300]"
            >
              <DropdownMenuLabel className="font-bold text-[11px] text-gray-400 tracking-widest px-3 py-2">
                User Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-3 h-11 cursor-pointer font-semibold text-[13px] px-3 focus:bg-primary/5 focus:text-primary">
                <User className="w-4 h-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 h-11 cursor-pointer font-semibold text-[13px] px-3 focus:bg-primary/5 focus:text-primary">
                <SettingsIcon className="w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="gap-3 h-11 cursor-pointer font-semibold text-[13px] px-3 text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation - Main Area */}
        <nav className={cn(
          "flex-1 px-3 no-scrollbar transition-all duration-300",
          isCollapsed ? "lg:overflow-visible space-y-0 lg:pt-2" : "overflow-y-auto space-y-5 pt-[20px]"
        )}>
          {orderedSections.map((section) => {
            const sectionItems = menuItems.filter((i) => i.section === section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section} className={cn(isCollapsed ? "space-y-0" : "space-y-1")}>
                {section !== "none" && (
                  <p className={cn(
                    "px-4 text-[10px] font-bold text-gray-400 mb-2 whitespace-nowrap transition-all duration-300",
                    isCollapsed && "lg:opacity-0 lg:invisible lg:h-0 lg:mb-0"
                  )}> 
                    {section}
                  </p>
                )}
                <div className="space-y-1">
                  {sectionItems
                    .map((item) => (
                    <div key={item.name} className="w-full">
                      <NavItem
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={
                          pathname === item.path || 
                          (
                            item.path !== "/" && 
                            !["/super-admin", "/branch-admin", "/doctor", "/staff", "/reception", "/pharmacy", "/laboratory", "/radiology", "/finance", "/reports"].includes(item.path) && 
                            pathname.startsWith(item.path + "/")
                          ) || 
                          item.subItems?.some(s => pathname === s.path)
                        }
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
          );
          })}
        </nav>

        {/* User Profile Section Removed From Here */}
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
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1">
          <span className="font-semibold text-[13px] whitespace-nowrap">
            {item.name}
          </span>
          {hasSubItems && (
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
          )}
        </div>
      )}
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
                <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-2 min-w-[220px] shadow-none animate-in fade-in slide-in-from-left-2 duration-200">
                     <div className="px-3 py-2.5 mb-1 bg-primary/5 dark:bg-primary/10 rounded-[5px]">
                        <p className="text-[11px] font-bold text-primary">{item.name}</p>
                     </div>
                    <div className="space-y-0.5">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={cn(
                            "flex items-center h-10 px-3 rounded-[5px] text-[13px] font-semibold transition-all mb-0.5",
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
          className="bg-[#1e293b] text-white border-none text-[12px] font-bold shadow-none animate-in fade-in zoom-in-95 duration-150"
        >
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
