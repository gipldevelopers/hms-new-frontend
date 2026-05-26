"use client";

import React, { use } from "react";
import { HospitalInventoryDashboard } from "@/components/hospital-inventory/dashboard/HospitalInventoryDashboard";

export default function HospitalInventoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : '';

  return <HospitalInventoryDashboard slug={slug} />;
}
