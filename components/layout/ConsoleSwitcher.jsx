"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Monitor, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Activity, 
  FileText, 
  UserCircle,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_CONFIG = {
  STAFF: { icon: UserCircle, path: "/staff", label: "Staff" },
  DOCTOR: { icon: Stethoscope, path: "/doctor", label: "Doctor" },
  RECEPTION: { icon: Activity, path: "/reception", label: "Reception" },
  PHARMACY: { icon: Pill, path: "/pharmacy", label: "Pharmacy" },
  LABORATORY: { icon: FlaskConical, path: "/laboratory", label: "Laboratory" },
  RADIOLOGY: { icon: Monitor, path: "/radiology", label: "Radiology" },
  FINANCE: { icon: FileText, path: "/finance", label: "Finance" },
  REPORTS: { icon: FileText, path: "/reports", label: "Reports" },
};

export function ConsoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [side, setSide] = useState("bottom");
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          if (!token) return;
          const res = await fetch("/api/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success) {
            const freshUser = json.data;
            setUser(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          }
        } catch (err) {
          console.error("Profile sync failed:", err);
        }
      };
      fetchProfile();
    } else {
      setUser(null);
    }
  }, [pathname]);

  if (!mounted) return null;
  if (!user || pathname.startsWith("/auth")) return null;

  const availableRoles = [user.role, ...(user.consoleRoles || [])];
  const uniqueRoles = [...new Set(availableRoles)];

  if (uniqueRoles.length <= 1) return null;

  const handleDragEnd = (event, info) => {
    const x = info.point.x;
    const y = info.point.y;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Snap to nearest edge (Left, Right, or Bottom)
    const distToLeft = x;
    const distToRight = windowWidth - x;
    const distToBottom = windowHeight - y;

    if (distToBottom < 100) {
      setSide("bottom");
    } else if (distToLeft < distToRight) {
      setSide("left");
    } else {
      setSide("right");
    }
    setIsOpen(false);
    setIsHovered(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[201]">
      <motion.div 
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={
          side === "bottom" 
            ? { x: "-50%", y: isHovered || isOpen ? 0 : 24, left: "50%", bottom: "24px", top: "auto", right: "auto" } 
            : side === "left" 
              ? { x: isHovered || isOpen ? 0 : -24, left: 0, top: "50%", y: "-50%", bottom: "auto", right: "auto" }
              : { x: isHovered || isOpen ? 0 : 24, right: 0, top: "50%", y: "-50%", left: "auto", bottom: "auto" }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsOpen(false);
        }}
      >
        <div className="relative flex items-center">
          {/* Quickball Indicator */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-12 h-12 rounded-full bg-primary shadow-2xl flex items-center justify-center text-white transition-all duration-500",
              isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 cursor-grab active:cursor-grabbing",
              !isHovered && side !== "bottom" && "opacity-60"
            )}
          >
            <GripVertical className="w-5 h-5 pointer-events-none" />
          </button>

          {/* Expanded Console Matrix */}
          <motion.div
            initial={false}
            animate={isOpen ? { scale: 1, opacity: 1, x: 0 } : { scale: 0.2, opacity: 0, x: side === "left" ? -100 : 100 }}
            className={cn(
              "absolute bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-[#E7E8EB] dark:border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-1.5",
              !isOpen && "pointer-events-none",
              side === "left" && "left-4",
              side === "right" && "right-4 flex-row-reverse",
              side === "bottom" && "-top-16 left-1/2 -translate-x-1/2"
            )}
          >
            <div className="px-1.5 text-gray-300">
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-1.5">
              {uniqueRoles.map((role) => {
                const config = ROLE_CONFIG[role];
                if (!config) return null;
                const isActive = pathname.startsWith(config.path);
                const Icon = config.icon;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      router.push(config.path);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "group/btn relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white/50 dark:bg-white/5 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1e293b] text-white text-[10px] font-bold rounded-[5px] shadow-2xl opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[210] border border-white/10">
                      {config.label} Access
                    </div>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
