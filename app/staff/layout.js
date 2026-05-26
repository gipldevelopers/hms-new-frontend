"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleLayout from "@/components/layout/RoleLayout";

export default function Layout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleLayout>
      <div className="staff-finance-theme min-h-screen">{children}</div>
    </RoleLayout>
  );
}
