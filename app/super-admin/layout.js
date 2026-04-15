"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

export default function SuperAdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F8F9FC] overflow-hidden">
      {/* Sidebar - Width changes based on state */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <div className={cn(
        "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out relative",
      )}>
        <Header 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}