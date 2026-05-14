"use client";
import React from "react";
import { ArrowLeft, Check, Pause } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function PrescriptionProcess() {
  const { id } = useParams();
  const [picked, setPicked] = React.useState([true, false]);

  const togglePicked = (index) => {
    const newPicked = [...picked];
    newPicked[index] = !newPicked[index];
    setPicked(newPicked);
  };

  const itemsPicked = picked.filter(Boolean).length;
  const progress = (itemsPicked / picked.length) * 100;

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/pharmacy/prescription-queue" className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">RX-2024-0046</h1>
              <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                 Processing
              </span>
              <span className="bg-[#f1f5f9] text-[#64748b] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">OPD</span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">Started processing 2 mins ago by Dr. John Doe</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all">
            <Pause size={16} /> Pause
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all">
            <Check size={16} strokeWidth={3} /> Mark as Ready
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-[20px]">
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">Patient Information</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#2e37a4]/10 text-[#2e37a4] flex items-center justify-center rounded-full font-bold text-[16px]">MC</div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Michael Chang</h2>
                <p className="text-[13px] text-[#64748b] font-bold opacity-80 mt-0.5">MRN-10294</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8">
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Age / Gender</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">32 Years / Male</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Location</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">OPD - Cardio</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Prescribing Doctor</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">Dr. Lee</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Allergies</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">None</p>
              </div>
            </div>
          </div>

          {/* Fulfillment Progress Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">Fulfillment Progress</p>
            <div className="flex justify-between items-end mb-2">
              <p className="text-[16px] font-bold text-[#1e293b] dark:text-white">{itemsPicked} / {picked.length} Picked</p>
              <p className="text-[12px] font-bold text-[#64748b]">{progress}%</p>
            </div>
            <div className="w-full h-2.5 bg-[#f1f5f9] dark:bg-[#334155] rounded-full overflow-hidden">
               <div className="h-full bg-[#2e37a4] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Right Column (Pick List) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Pick List</h2>
              <p className="text-[12px] font-bold text-[#64748b] opacity-70">Mark items as picked manually</p>
            </div>
          </div>
          
          <div className="space-y-0 divide-y divide-[#f1f5f9] dark:divide-[#334155]">
            {/* Item 1 */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <h3 className={cn("text-[15px] font-bold text-[#1e293b] dark:text-white", picked[0] && "line-through opacity-40")}>Aspirin</h3>
                     <span className={cn("text-[13px] font-bold text-[#64748b]", picked[0] && "line-through opacity-40")}>75mg</span>
                  </div>
                  <p className={cn("text-[12px] font-bold text-[#64748b] opacity-80", picked[0] && "line-through opacity-40")}>
                    Sig: <span className="text-[#1e293b] dark:text-white">1-0-0</span> &nbsp;·&nbsp; Qty: <span className="text-[#1e293b] dark:text-white">30 Tabs</span>
                  </p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-0.5">Location</p>
                     <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">A12-B</p>
                  </div>
                  <button 
                    onClick={() => togglePicked(0)}
                    className={cn(
                      "flex items-center gap-2 px-4 h-9 rounded-[5px] text-[12px] font-bold transition-all border",
                      picked[0] 
                        ? "bg-[#dcfce7] text-[#15803d] border-[#dcfce7]" 
                        : "border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-white hover:bg-[#f8fafc]"
                    )}
                  >
                    {picked[0] ? <><Check size={14} strokeWidth={3} /> Picked</> : "Pick Item"}
                  </button>
               </div>
            </div>

            {/* Item 2 */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <h3 className={cn("text-[15px] font-bold text-[#1e293b] dark:text-white", picked[1] && "line-through opacity-40")}>Atorvastatin</h3>
                     <span className={cn("text-[13px] font-bold text-[#64748b]", picked[1] && "line-through opacity-40")}>40mg</span>
                  </div>
                  <p className={cn("text-[12px] font-bold text-[#64748b] opacity-80", picked[1] && "line-through opacity-40")}>
                    Sig: <span className="text-[#1e293b] dark:text-white">0-0-1</span> &nbsp;·&nbsp; Qty: <span className="text-[#1e293b] dark:text-white">30 Tabs</span>
                  </p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-0.5">Location</p>
                     <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">C04-A</p>
                  </div>
                  <button 
                    onClick={() => togglePicked(1)}
                    className={cn(
                      "flex items-center gap-2 px-4 h-9 rounded-[5px] text-[12px] font-bold transition-all border",
                      picked[1] 
                        ? "bg-[#dcfce7] text-[#15803d] border-[#dcfce7]" 
                        : "border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-white hover:bg-[#f8fafc]"
                    )}
                  >
                    {picked[1] ? <><Check size={14} strokeWidth={3} /> Picked</> : "Pick Item"}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
