import { CreateNewBillMain } from "@/components/finance/patient-billing/CreateNewBillMain";

export const metadata = {
  title: "Create New Bill | Finance Dashboard",
  description: "Create a new patient bill in the HMS finance module.",
};

export default async function CreateNewBillPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <CreateNewBillMain searchParams={resolvedSearchParams} />;
}
