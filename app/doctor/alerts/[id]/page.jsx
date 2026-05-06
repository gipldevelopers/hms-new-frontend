"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  TrendingDown, 
  Plus,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrderTestModal from "@/components/doctor/alerts/OrderTestModal";

export default function AlertDetailsPage({ params }) {
  const id = React.use(params).id;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/doctor/alerts">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-[5px] border-border bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </Button>
        </Link>
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Alerts
        </h1>
      </div>

      {/* Main Alert Info Card */}
      <div className="bg-white dark:bg-[#101935] border border-border rounded-[5px] flex flex-col shadow-none">
        <div className="p-6 border-b border-border/60">
          <h2 className="text-[22px] font-bold text-[#1A1C23] dark:text-white leading-tight mb-3">
            Hemoglobin critically low – 4.2 g/dL
          </h2>
          <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-slate-400 font-medium">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="opacity-80">Reported on: Oct 24, 2023 at 08:45 AM</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
          <div className="p-5 px-6">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">PATIENT</p>
            <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Michael Chang</p>
          </div>
          <div className="p-5 px-6">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">UHID</p>
            <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">92831</p>
          </div>
          <div className="p-5 px-6">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">LOCATION</p>
            <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Ward 3B - Bed 12</p>
          </div>
        </div>
      </div>

      {/* Laboratory Findings Section */}
      <div className="bg-white dark:bg-[#101935] border border-border rounded-[5px] flex flex-col overflow-hidden shadow-none">
        <div className="bg-[#EEF2F8] dark:bg-white/[0.03] p-4 px-6 border-b border-border">
          <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white">
            Laboratory findings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase">Test Name</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase">Result Value</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase text-right">Reference Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 text-[14px] font-bold text-[#334155] dark:text-gray-200">Hemoglobin</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#EF4444]">
                    4.2 g/dL
                    <TrendingDown className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                </td>
                <td className="px-6 py-5 text-[13px] font-medium text-gray-500 dark:text-slate-400 text-right">
                  13.5 - 17.5 g/dL
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 text-[14px] font-bold text-[#334155] dark:text-gray-200">Hematocrit (Hct)</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#EF4444]">
                    12.5 g/dL
                    <TrendingDown className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                </td>
                <td className="px-6 py-5 text-[13px] font-medium text-gray-500 dark:text-slate-400 text-right">
                  41.0 - 50.0 %
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-6 flex justify-end">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-6 gap-2 bg-[#2E37A4] text-white hover:opacity-90 transition-all font-bold text-[13px] rounded-[5px] shadow-none"
          >
            <Plus className="w-4 h-4" />
            Order Follow-up Test
          </Button>
        </div>
      </div>

      <OrderTestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}
