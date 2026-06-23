"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  TrendingDown, 
  TrendingUp,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrderTestModal from "@/components/doctor/alerts/OrderTestModal";

export default function AlertDetailsPage({ params }) {
  const router = useRouter();
  const id = React.use(params).id;
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/doctor-opd/alerts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch alert details");
        const json = await res.json();
        if (json.success) {
          setAlert(json.data);
        } else {
          throw new Error(json.message || "Failed to fetch alert details");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertDetails();
  }, [id]);

  const handleAcknowledge = async () => {
    try {
      setAcknowledging(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/doctor-opd/alerts/${id}/acknowledge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to acknowledge alert");
      const json = await res.json();
      if (json.success) {
        router.push("/doctor/alerts");
      } else {
        throw new Error(json.message || "Failed to acknowledge alert");
      }
    } catch (err) {
      console.error(err);
      // Fallback simple dialog warning if modal or custom alerts are not initialized
      alert(err.message);
    } finally {
      setAcknowledging(false);
    }
  };

  const isCriticalStatus = (status) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return s === "HIGH" || s === "LOW" || s === "CRITICAL" || s === "URGENT" || s === "DESTRUCTIVE";
  };

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
          Alert Details
        </h1>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[13px] font-medium text-gray-500 dark:text-slate-400">Loading details...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px] text-destructive">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-[14px] font-bold">Error Loading Alert</p>
          <p className="text-[12px] font-medium text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && alert && (
        <>
          {/* Main Alert Info Card */}
          <div className="bg-white dark:bg-[#101935] border border-border rounded-[5px] flex flex-col shadow-none">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-[22px] font-bold text-[#1A1C23] dark:text-white leading-tight mb-3">
                {alert.title}
              </h2>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-slate-400 font-medium">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="opacity-80">Reported on: {alert.reportedAt}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="p-5 px-6">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">PATIENT</p>
                <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{alert.patient?.name}</p>
              </div>
              <div className="p-5 px-6">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">UHID</p>
                <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{alert.patient?.uhid}</p>
              </div>
              <div className="p-5 px-6">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1.5 tracking-[0.05em] uppercase">LOCATION</p>
                <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{alert.patient?.location}</p>
              </div>
            </div>
          </div>

          {/* Laboratory / Finding Findings Section */}
          <div className="bg-white dark:bg-[#101935] border border-border rounded-[5px] flex flex-col overflow-hidden shadow-none">
            <div className="bg-[#EEF2F8] dark:bg-white/[0.03] p-4 px-6 border-b border-border">
              <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white">
                {alert.type === "Critical Result" ? "Laboratory findings" : "Alert findings & parameters"}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase">Parameter / Test</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase">Result Value</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 tracking-wider uppercase text-right">Reference Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {alert.findings && alert.findings.map((item, index) => {
                    const critical = isCriticalStatus(item.status);
                    return (
                      <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 text-[14px] font-bold text-[#334155] dark:text-gray-200">{item.name}</td>
                        <td className="px-6 py-5">
                          <div className={cn(
                            "flex items-center gap-1.5 text-[14px] font-bold",
                            critical ? "text-[#EF4444]" : "text-emerald-600 dark:text-emerald-400"
                          )}>
                            {item.value}
                            {critical ? (
                              <TrendingDown className="w-4 h-4 stroke-[2.5px]" />
                            ) : (
                              <TrendingUp className="w-4 h-4 stroke-[2.5px]" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[13px] font-medium text-gray-500 dark:text-slate-400 text-right">
                          {item.referenceRange}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-6 flex justify-end gap-3 border-t border-border/60">
              <Button
                onClick={handleAcknowledge}
                disabled={acknowledging}
                variant="outline"
                className="h-10 px-6 border-border hover:bg-muted text-gray-700 dark:text-gray-200 text-[13px] font-bold rounded-[5px]"
              >
                {acknowledging ? "Acknowledging..." : "Acknowledge Alert"}
              </Button>
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
            patientId={alert.patient?.uhid}
            patientName={alert.patient?.name}
          />
        </>
      )}

    </div>
  );
}
