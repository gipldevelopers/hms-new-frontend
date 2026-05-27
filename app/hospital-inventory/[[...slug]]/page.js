"use client";

import React, { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { LabInventory as LabInventoryDashboard } from "@/components/hospital-inventory/stock-management/lab-inventory/LabInventory";
import { StockInventory as StockInventoryDashboard } from "@/components/hospital-inventory/stock-management/stock-inventory/StockInventory";
import { HospitalInventoryDashboard } from "@/components/hospital-inventory/dashboard/HospitalInventoryDashboard";

export default function HospitalInventoryPage({ params }) {
  const resolvedParams = use(params);
  const slugs = resolvedParams.slug || [];
  const router = useRouter();

  const firstSlug = slugs[0] || "";
  const secondSlug = slugs[1] || "";

  // 1. Render the main landing dashboard page at /hospital-inventory
  if (slugs.length === 0) {
    return <HospitalInventoryDashboard />;
  }

  // 2. Redirect /hospital-inventory/stock to /hospital-inventory/stock/stock-inventory (default view page)
  if (firstSlug === "stock" && !secondSlug) {
    React.useEffect(() => {
      router.replace("/hospital-inventory/stock/stock-inventory");
    }, [router]);
    return null;
  }

  // 3. Render /hospital-inventory/stock/stock-inventory
  if (firstSlug === "stock" && secondSlug === "stock-inventory") {
    return <StockInventoryDashboard slugs={slugs.slice(2)} />;
  }

  // 4. Render /hospital-inventory/stock/lab-inventory
  if (firstSlug === "stock" && secondSlug === "lab-inventory") {
    return <LabInventoryDashboard slugs={slugs.slice(2)} />;
  }

  // 5. Any other slug triggers a 404 Not Found error
  notFound();
}
