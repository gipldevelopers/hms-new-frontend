import { IPDBillingDetailsMain } from "@/components/finance/patient-billing/IPDBillingDetailsMain";
import { OPDBillingDetailsMain } from "@/components/finance/patient-billing/OPDBillingDetailsMain";

export const metadata = {
  title: "Patient Billing Details | Finance Dashboard",
  description: "View detailed patient bills in the HMS finance module.",
};

export default async function PatientBillingDetailsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const isOPD = resolvedSearchParams?.type?.toLowerCase() === "opd";

  if (isOPD) {
    return <OPDBillingDetailsMain searchParams={resolvedSearchParams} />;
  }

  return <IPDBillingDetailsMain searchParams={resolvedSearchParams} />;
}
