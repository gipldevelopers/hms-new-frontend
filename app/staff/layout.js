import RoleLayout from "@/components/layout/RoleLayout";
export default function Layout({ children }) {
  return (
    <RoleLayout>
      <div className="staff-finance-theme min-h-screen">{children}</div>
    </RoleLayout>
  );
}
