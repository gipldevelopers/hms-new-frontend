import ReportsBedOccupancy from "@/components/reports/bed-occupancy/ReportsBedOccupancy";

export const metadata = {
  title: "Bed Occupancy Analytics | HMS Reports",
  description: "Real-time bed utilization, ward capacities, and patient flow statistics.",
};

export default function Page() {
  return <ReportsBedOccupancy />;
}
