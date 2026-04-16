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
  ChevronDown
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
    subItems: [
      { name: "Master Data", path: "/super-admin/configurations/master-data" },
      { name: "Templates", path: "/super-admin/configurations/templates" },
      { name: "Assignments", path: "/super-admin/configurations/assignments" },
    ]
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

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = React.useState(null);

  React.useEffect(() => {
    // Auto open sub menu if active path is inside
    menuItems.forEach(item => {
      if (item.subItems?.some(sub => pathname.startsWith(sub.path))) {
        setOpenSubMenu(item.name);
      }
    });
  }, [pathname]);

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
              "text-xl font-bold text-[#2E37A4] dark:text-blue-400 tracking-tight whitespace-nowrap transition-all duration-300",
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

        <div className={cn("p-4 shrink-0 transition-all duration-300 overflow-hidden", isCollapsed && "lg:px-2")}>
          <div className={cn(
            "flex items-center border border-[#E7E8EB] dark:border-white/10 rounded-[10px] transition-all bg-white dark:bg-[#1e293b]", 
            isCollapsed ? "lg:justify-center p-2" : "p-3 gap-3"
          )}>
            <div className="w-9 h-9 bg-[#2E37A4] rounded-[5px] shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VD</span>
            </div>
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-300",
              isCollapsed && "lg:opacity-0 lg:invisible lg:w-0"
            )}>
              <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white truncate">Vraj Darji</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate uppercase tracking-tighter">Super admin</p>
            </div>
          </div>
        </div>

        <nav className={cn(
          "flex-1 px-3 space-y-5 pt-2 no-scrollbar pb-10 transition-all duration-300",
          isCollapsed ? "lg:overflow-visible" : "overflow-y-auto"
        )}>
          {["none", "MANAGEMENT", "CONFIGURATION", "SYSTEM"].map((section) => (
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
                                    key={sub.path}
                                    href={sub.path}
                                    className={cn(
                                      "flex items-center h-8 px-3 rounded-[5px] text-[12px] font-semibold transition-all",
                                      pathname === sub.path 
                                        ? "text-[#2E37A4] bg-[#F4F5FB] dark:bg-[#1e293b] dark:text-blue-400" 
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
          ? "bg-[#F4F5FB] dark:bg-[#1e293b] text-[#2E37A4] dark:text-blue-400"
          : "text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1e293b]",
        !isCollapsed && "px-3 gap-3"
      )}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#2E37A4] dark:bg-blue-400 rounded-r-full" />
      )}
      <div className={cn(
        "flex items-center justify-center shrink-0 transition-all duration-300",
        isCollapsed ? "w-10 h-10 lg:w-10 lg:h-10" : "w-4.5 h-4.5"
      )}>
        <Icon className={cn("w-4.5 h-4.5", isActive ? "text-[#2E37A4] dark:text-blue-400" : "text-[#5E6C84] dark:text-slate-500")} />
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
                    <div className="px-3 py-2.5 mb-1 bg-[#F4F5FB] dark:bg-white/5 rounded-[6px]">
                       <p className="text-[11px] font-bold text-[#2E37A4] dark:text-blue-400 uppercase tracking-widest">{item.name}</p>
                    </div>
                    <div className="space-y-0.5">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={cn(
                            "flex items-center h-10 px-3 rounded-[6px] text-[13px] font-semibold transition-all mb-0.5",
                            pathname === sub.path 
                              ? "text-[#2E37A4] bg-[#F4F5FB] dark:bg-[#1e293b] dark:text-blue-400" 
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
