"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Phone,
  Mail,
  UserRound,
  FlaskConical,
  Activity,
  CheckCircle2
} from "lucide-react";

// Mock database matching sample list
const SAMPLE_DETAILS_DB = {
  "sam-0": {
    name: "Sarah Jenkins",
    uhid: "98234",
    ageGender: "32 Yrs • Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@example.com",
    avatar: "female-1",
    timeline: [
      {
        title: "Order Placed",
        status: "completed",
        time: "Oct 24, 08:00 AM",
        meta: [{ label: "Dr. House", icon: UserRound }]
      },
      {
        title: "Sample Collection",
        status: "completed",
        time: "Oct 24, 08:30 AM",
        meta: [
          { label: "Nurse Jackie", icon: UserRound },
          { label: "Tube: Purple Top", icon: FlaskConical }
        ]
      },
      {
        title: "Sample Received at Lab",
        status: "completed",
        time: "Oct 24, 09:15 AM",
        meta: [{ label: "Tech Sarah", icon: UserRound }]
      },
      {
        title: "Processing Started",
        status: "active",
        time: "Oct 24, 09:30 AM",
        meta: [{ label: "Analyzer: Sysmex XN-1000", icon: Activity }]
      },
      { title: "Result Entered", status: "pending" },
      { title: "Pathologist Approved", status: "pending" },
      { title: "Dispatched / Reported", status: "pending" }
    ]
  },
  "sam-1": {
    name: "Robert Fox",
    uhid: "98234",
    ageGender: "45 Yrs • Male",
    phone: "+1 (555) 234-5678",
    email: "robert.f@example.com",
    avatar: "male-1",
    timeline: [
      {
        title: "Order Placed",
        status: "completed",
        time: "Oct 24, 09:15 AM",
        meta: [{ label: "Dr. House", icon: UserRound }]
      },
      {
        title: "Sample Collection",
        status: "completed",
        time: "Oct 24, 10:30 AM",
        meta: [
          { label: "Nurse Jackie", icon: UserRound },
          { label: "Tube: Gold Top", icon: FlaskConical }
        ]
      },
      {
        title: "Sample Received at Lab",
        status: "active",
        time: "Oct 24, 11:15 AM",
        meta: [{ label: "Tech Sarah", icon: UserRound }]
      },
      { title: "Processing Started", status: "pending" },
      { title: "Result Entered", status: "pending" },
      { title: "Pathologist Approved", status: "pending" },
      { title: "Dispatched / Reported", status: "pending" }
    ]
  },
  "sam-2": {
    name: "Esther Howard",
    uhid: "98235",
    ageGender: "28 Yrs • Female",
    phone: "+1 (555) 345-6789",
    email: "esther.h@example.com",
    avatar: "female-2",
    timeline: [
      {
        title: "Order Placed",
        status: "completed",
        time: "Oct 24, 09:30 AM",
        meta: [{ label: "Dr. House", icon: UserRound }]
      },
      {
        title: "Sample Collection",
        status: "completed",
        time: "Oct 24, 10:45 AM",
        meta: [
          { label: "Nurse Jackie", icon: UserRound },
          { label: "Tube: Red Top", icon: FlaskConical }
        ]
      },
      {
        title: "Sample Received at Lab",
        status: "active",
        time: "Oct 24, 11:30 AM",
        meta: [{ label: "Tech Sarah", icon: UserRound }]
      },
      { title: "Processing Started", status: "pending" },
      { title: "Result Entered", status: "pending" },
      { title: "Pathologist Approved", status: "pending" },
      { title: "Dispatched / Reported", status: "pending" }
    ]
  },
  "sam-3": {
    name: "Jenny Wilson",
    uhid: "98236",
    ageGender: "38 Yrs • Female",
    phone: "+1 (555) 456-7890",
    email: "jenny.w@example.com",
    avatar: "female-3",
    timeline: [
      {
        title: "Order Placed",
        status: "completed",
        time: "Oct 24, 10:00 AM",
        meta: [{ label: "Dr. House", icon: UserRound }]
      },
      {
        title: "Sample Collection",
        status: "completed",
        time: "Oct 24, 11:15 AM",
        meta: [
          { label: "Nurse Jackie", icon: UserRound },
          { label: "Tube: Green Top", icon: FlaskConical }
        ]
      },
      {
        title: "Sample Received at Lab",
        status: "completed",
        time: "Oct 24, 12:00 PM",
        meta: [{ label: "Tech Sarah", icon: UserRound }]
      },
      {
        title: "Processing Started",
        status: "active",
        time: "Oct 24, 12:30 PM",
        meta: [{ label: "Analyzer: Sysmex XN-1000", icon: Activity }]
      },
      { title: "Result Entered", status: "pending" },
      { title: "Pathologist Approved", status: "pending" },
      { title: "Dispatched / Reported", status: "pending" }
    ]
  }
};

function DetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "sam-0"; // fallback to Sarah Jenkins to match ditto screenshot

  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    // Resolve matching patient details
    const resolvedData = SAMPLE_DETAILS_DB[id] || SAMPLE_DETAILS_DB["sam-0"];
    setData(resolvedData);
  }, [id]);

  const handleGoBack = () => {
    router.push("/laboratory/sample-tracking");
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center p-[40px] text-muted-foreground font-semibold bg-card border border-border rounded-[5px] shadow-none">
        Loading sample tracking details...
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      {/* Header section with back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
          className="p-2 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none outline-none"
          aria-label="Go Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col">
          <span className="text-[12px] text-muted-foreground font-semibold">
            {data.name} / Sample Tracking
          </span>
          <h1 className="text-[20px] font-bold text-foreground leading-tight">
            Sample Tracking
          </h1>
        </div>
      </div>

      {/* Barcode scanner / Search input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Scan barcode or enter Order ID / UHID to track sample"
          className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none hover:shadow-none focus:shadow-none"
        />
      </div>

      {/* Patient Demographics Card */}
      <div className="bg-[#EBF0FF] dark:bg-[#1E293B]/45 border border-[#C5D3F7] dark:border-[#334155] rounded-[5px] p-[20px] shadow-none flex flex-col sm:flex-row items-start sm:items-center gap-[20px] transition-colors duration-300">
        {/* Profile Avatar Container matching layout portrait */}
        <div className="w-[54px] h-[54px] rounded-full overflow-hidden bg-background border border-border/80 flex items-center justify-center shrink-0">
          <svg
            className="w-10 h-10 text-muted-foreground/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Demographics details */}
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="text-[15px] font-bold text-foreground leading-snug">
            {data.name}
          </h2>
          <div className="text-[12px] text-muted-foreground font-semibold flex flex-wrap items-center gap-1.5 leading-none">
            <span>UHID: {data.uhid}</span>
            <span>•</span>
            <span>{data.ageGender}</span>
          </div>
          
          {/* Contact Details row */}
          <div className="flex flex-wrap items-center gap-[20px] text-[12px] text-muted-foreground font-semibold mt-1">
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-muted-foreground" />
              <span>{data.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-muted-foreground" />
              <span>{data.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative pl-[35px] pr-[10px] space-y-[20px] py-[10px]">
        {/* Connecting Vertical Track Line */}
        <div className="absolute left-[9.5px] top-[15px] bottom-[15px] w-[1px] bg-border/60" />

        {data.timeline.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isPending = step.status === "pending";

          return (
            <div key={index} className="relative flex items-start w-full">
              
              {/* Circle Marker Indicator */}
              <div className="absolute -left-[35px] top-4 z-10 flex items-center justify-center">
                {isCompleted && (
                  <div className="bg-background rounded-full p-0.5">
                    <CheckCircle2 size={19} className="text-[#10B981] fill-[#10B981] text-background stroke-[2.5]" />
                  </div>
                )}
                {isActive && (
                  <div className="w-[19px] h-[19px] rounded-full border-[1.5px] border-primary bg-background flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                )}
                {isPending && (
                  <div className="w-[19px] h-[19px] rounded-full border-[1.5px] border-border bg-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
                  </div>
                )}
              </div>

              {/* Step Card Box */}
              <div
                className={`w-full border rounded-[5px] p-[16px] flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-colors ${
                  isPending
                    ? "bg-card/45 border-border/40 opacity-70"
                    : isActive
                    ? "bg-[#F5F8FF] dark:bg-[#1E293B]/30 border-primary/50"
                    : "bg-card border-border/80"
                }`}
              >
                {/* Details left side */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`text-[13.5px] font-bold ${
                      isPending ? "text-muted-foreground/80" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>

                  {/* Meta items (e.g. nurse, doctor, analyzer, tube type) */}
                  {!isPending && step.meta && (
                    <div className="flex flex-wrap items-center gap-[15px] text-[12px] text-muted-foreground font-semibold mt-0.5">
                      {step.meta.map((m, mIdx) => {
                        const Icon = m.icon;
                        return (
                          <div key={mIdx} className="flex items-center gap-1.5">
                            <Icon size={12} className="text-muted-foreground" />
                            <span>{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Timestamp right side */}
                {!isPending && step.time && (
                  <span className="text-[12px] text-muted-foreground font-bold shrink-0 self-start sm:self-auto">
                    {step.time}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SampleTrackingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-[40px] text-muted-foreground font-semibold bg-card border border-border rounded-[5px]">
          Loading details...
        </div>
      }
    >
      <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
        <DetailContent />
      </div>
    </Suspense>
  );
}
