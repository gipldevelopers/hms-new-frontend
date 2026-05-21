import { Suspense } from "react";
import { RackView } from "@/components/pharmacy/inventory/RackView";

export default function RackViewPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4 min-h-screen">
        <div className="h-8 w-8 animate-spin border-[3px] border-primary/20 border-t-primary rounded-full" />
        <p className="text-[13px] font-bold text-muted-foreground font-sans">Loading page...</p>
      </div>
    }>
      <RackView />
    </Suspense>
  );
}
