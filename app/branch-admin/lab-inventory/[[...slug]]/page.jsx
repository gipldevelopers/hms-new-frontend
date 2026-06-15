"use client";

import React, { use } from "react";
import LabInventoryDashboard from "@/components/hospital-inventory/stock-management/lab-inventory/LabInventory";

export default function Page({ params }) {
  const resolvedParams = use(params);
  const slugs = resolvedParams.slug || [];

  return (
    <LabInventoryDashboard
      slugs={slugs}
      basePath="/branch-admin/lab-inventory"
      hideSubTabs={true}
    />
  );
}
