"use client";
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SampleCollectionCard({ order, onMarkCollected }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleGenerateResult = () => {
    const hasReport = typeof window !== "undefined" && localStorage.getItem(`report-generated-${order.id}`) === "true";
    if (hasReport) {
      router.push(`/laboratory/sample-collection/report?id=${order.id}`);
    } else {
      router.push(`/laboratory/sample-collection/report/edit?id=${order.id}`);
    }
    setMenuOpen(false);
  };

  const handleGenerateReport = () => {
    router.push(`/laboratory/sample-collection/report?id=${order.id}`);
    setMenuOpen(false);
  };

  const handlePrintLabels = () => {
    toast.success(`Printing barcode labels for ${order.patientName} (${order.orderId})`);
    setMenuOpen(false);
  };

  const handleMarkCollectedToggle = () => {
    const isCollected = order.status === "Collected";
    const nextStatus = isCollected ? "Pending" : "Collected";
    onMarkCollected(order.id, nextStatus);
    
    if (nextStatus === "Collected") {
      toast.success(`Sample collected successfully for ${order.patientName} (${order.orderId})`);
    } else {
      toast.info(`Sample status reset to Pending for ${order.patientName} (${order.orderId})`);
    }
  };

  // Sample badge styles configuration
  const sampleBadgeConfig = {
    "Blood-EDTA (3mL)": {
      bg: "bg-[#FAF5FF] dark:bg-[#2E1065]/20",
      text: "text-[#7C3AED] dark:text-[#D8B4FE]",
      border: "border-[#E9D5FF] dark:border-[#7C3AED]/30",
      dot: "bg-[#7C3AED] dark:bg-[#C084FC]"
    },
    "SST-Gold (5mL)": {
      bg: "bg-[#FFF7ED] dark:bg-[#7C2D12]/20",
      text: "text-[#D97706] dark:text-[#FBBF24]",
      border: "border-[#FED7AA] dark:border-[#D97706]/30",
      dot: "bg-[#D97706] dark:bg-[#FBBF24]"
    },
    "Serum Separation (4mL)": {
      bg: "bg-[#FEF2F2] dark:bg-[#7F1D1D]/20",
      text: "text-[#DC2626] dark:text-[#FCA5A5]",
      border: "border-[#FEE2E2] dark:border-[#DC2626]/30",
      dot: "bg-[#DC2626] dark:bg-[#FCA5A5]"
    },
    "Urine Container (10mL)": {
      bg: "bg-[#FEFCE8] dark:bg-[#713F12]/15",
      text: "text-[#CA8A04] dark:text-[#FDE047]",
      border: "border-[#FEF9C3] dark:border-[#CA8A04]/30",
      dot: "bg-[#CA8A04] dark:bg-[#FDE047]"
    },
    "Citrate-Blue (2.7mL)": {
      bg: "bg-[#EFF6FF] dark:bg-[#1E3A8A]/20",
      text: "text-[#2563EB] dark:text-[#93C5FD]",
      border: "border-[#DBEAFE] dark:border-[#2563EB]/30",
      dot: "bg-[#2563EB] dark:bg-[#93C5FD]"
    }
  };

  const defaultBadgeStyle = {
    bg: "bg-[#F1F5F9] dark:bg-[#1E293B]",
    text: "text-[#475569] dark:text-[#94A3B8]",
    border: "border-[#E2E8F0] dark:border-[#334155]",
    dot: "bg-[#475569] dark:bg-[#94A3B8]"
  };
  return (
    <div className="bg-card border border-border rounded-[5px] p-[20px] w-full flex flex-col gap-[20px] shadow-none hover:shadow-none transition-colors duration-300">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Patient and Order Details */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-primary font-bold text-[14px]">
            {order.orderId}
          </span>
          <span className="text-border dark:text-white/10">|</span>
          <span className="text-foreground font-bold text-[14px]">
            {order.patientName}
          </span>
          <span className="text-muted-foreground text-[13px]">
            {order.uhid}
          </span>
          <span className="inline-flex items-center rounded-[5px] bg-secondary text-secondary-foreground px-2.5 py-1 text-[11px] font-bold">
            {order.ward}
          </span>
          {order.status === "Collected" && (
            <span className="inline-flex items-center rounded-[5px] bg-[#E8F5E9] dark:bg-[#1B5E20]/20 px-2.5 py-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#81C784]">
              Collected
            </span>
          )}
        </div>

        {/* Priority and Time Metadata */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto self-stretch sm:self-auto relative">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-muted-foreground">
              Ordered: {order.orderedTime}
            </span>
            
            {/* Overdue/Red or Normal TAT pill */}
            {order.tat1.startsWith("-") ? (
              <span className="bg-[#FEE2E2] dark:bg-[#EF4444]/20 text-[#EF4444] dark:text-[#F87171] font-bold text-[11px] px-2.5 py-0.5 rounded-[5px] whitespace-nowrap">
                TAT: {order.tat1}
              </span>
            ) : (
              <span className="bg-secondary text-secondary-foreground font-bold text-[11px] px-2.5 py-0.5 rounded-[5px] whitespace-nowrap">
                TAT: {order.tat1}
              </span>
            )}
          </div>

          {/* Three-dots menu button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-[5px] hover:bg-muted/10 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {/* Custom dropdown menu matching the UI screenshot exactly */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-1 w-[160px] bg-card border border-border rounded-[5px] p-0 shadow-none z-50 flex flex-col overflow-hidden"
              >
                <button
                  onClick={handleGenerateResult}
                  className="w-full text-left px-4 py-2 bg-card text-foreground hover:bg-primary hover:text-primary-foreground text-[13px] font-semibold transition-colors cursor-pointer rounded-t-[4px]"
                >
                  Generate Result
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="w-full text-left px-4 py-2 bg-card text-foreground hover:bg-primary hover:text-primary-foreground text-[13px] font-semibold transition-colors cursor-pointer border-t border-border"
                >
                  Generate Report
                </button>
                <button
                  onClick={handlePrintLabels}
                  className="w-full text-left px-4 py-2 bg-card text-foreground hover:bg-primary hover:text-primary-foreground text-[13px] font-semibold transition-colors cursor-pointer border-t border-border rounded-b-[4px]"
                >
                  Print Labels
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - 20px space-y is preserved by parent flex container */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2.5fr_auto] items-start md:items-center gap-[20px] pt-[20px] border-t border-border/50">
        
        {/* Column 1: Tests Required */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
            Tests Required
          </span>
          <span className="text-foreground font-bold text-[13px]">
            {order.tests}
          </span>
        </div>

        {/* Column 2: Samples Needed */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
            Samples Needed
          </span>
          <div className="flex flex-wrap gap-2">
            {order.samplesNeeded.map((sample, idx) => {
              const style = sampleBadgeConfig[sample] || defaultBadgeStyle;
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-[5px] border ${style.border} ${style.bg} ${style.text} px-2.5 py-1 text-[11px] font-bold`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot} mr-2 shrink-0`} />
                  {sample}
                </span>
              );
            })}
          </div>
        </div>

        {/* Column 3: Secondary Order Timeline & Mark Collected Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <span className="text-[12px] font-semibold text-muted-foreground">
              Ordered: {order.sampleOrderedTime}
            </span>
            
            {/* TAT2 Pill */}
            {order.tat2.startsWith("-") ? (
              <span className="bg-[#FEE2E2] dark:bg-[#EF4444]/20 text-[#EF4444] dark:text-[#F87171] font-bold text-[11px] px-2.5 py-0.5 rounded-[5px] whitespace-nowrap">
                TAT: {order.tat2}
              </span>
            ) : (
              <span className="bg-secondary text-secondary-foreground font-bold text-[11px] px-2.5 py-0.5 rounded-[5px] whitespace-nowrap">
                TAT: {order.tat2}
              </span>
            )}
          </div>

          {/* Mark Collected Button - full width on mobile, auto width on tablet/desktop */}
          {order.status === "Collected" ? (
            <button
              onClick={handleMarkCollectedToggle}
              className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground border border-primary font-bold text-[13px] px-4 py-2 rounded-[5px] transition-colors cursor-pointer select-none shadow-none hover:shadow-none focus:shadow-none w-full sm:w-auto"
            >
              <span>✓</span>
              <span>Mark Collected</span>
            </button>
          ) : (
            <button
              onClick={handleMarkCollectedToggle}
              className="flex items-center justify-center gap-1.5 bg-transparent text-primary border border-primary font-bold text-[13px] px-4 py-2 rounded-[5px] hover:bg-primary/5 transition-colors cursor-pointer select-none shadow-none hover:shadow-none focus:shadow-none w-full sm:w-auto"
            >
              <span>Mark Collected</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
