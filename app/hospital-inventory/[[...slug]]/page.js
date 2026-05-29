"use client";

import React, { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { LabInventory as LabInventoryDashboard } from "@/components/hospital-inventory/stock-management/lab-inventory/LabInventory";
import { StockInventory as StockInventoryDashboard } from "@/components/hospital-inventory/stock-management/stock-inventory/StockInventory";
import { StockTransfer as StockTransferDashboard } from "@/components/hospital-inventory/stock-management/stock-transfer/StockTransfer";
import { BatchExpiryTracking as BatchExpiryTrackingDashboard } from "@/components/hospital-inventory/stock-management/batch-expiry-tracking/BatchExpiryTracking";
import { HospitalInventoryDashboard } from "@/components/hospital-inventory/dashboard/HospitalInventoryDashboard";
import { SupplierManagement as SupplierManagementDashboard } from "@/components/hospital-inventory/supplier-management/SupplierManagement";

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

  // 4.5. Render /hospital-inventory/stock/stock-transfer
  if (firstSlug === "stock" && secondSlug === "stock-transfer") {
    return <StockTransferDashboard slugs={slugs.slice(2)} />;
  }

  // 4.6. Render /hospital-inventory/stock/batch-expiry-tracking
  if (firstSlug === "stock" && secondSlug === "batch-expiry-tracking") {
    return <BatchExpiryTrackingDashboard slugs={slugs.slice(2)} />;
  }

  // 4.7. Render /hospital-inventory/supplier
  if (firstSlug === "supplier") {
    return <SupplierManagementDashboard slugs={slugs.slice(1)} />;
  }

  // 5. Any other slug triggers a 404 Not Found error
  notFound();
}
