import RoleLayout from "@/components/layout/RoleLayout";
export default function Layout({ children }) {
  return (
    <RoleLayout>
      <div className="finance-admin-theme min-h-screen">{children}</div>
    </RoleLayout>
  );
}
