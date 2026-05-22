import InvoiceMain from "@/components/finance/patient-billing/InvoiceMain";

export const metadata = {
  title: "Patient Billing Invoice | Finance Dashboard",
  description: "View and print patient billing invoices.",
};

export default async function PatientBillingInvoicePage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return <InvoiceMain params={resolvedParams} searchParams={resolvedSearchParams} />;
}
