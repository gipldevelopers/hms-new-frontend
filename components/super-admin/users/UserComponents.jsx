import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Mail,
  Building2,
  Edit3,
  Trash2,
  Users2,
  Activity,
  ShieldCheck,
  Database,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// --- USER STATS COMPONENT ---
export function UserStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    activeNurses: 0,
    systemAdmins: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch("/api/users/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (e) {}
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users2,
      color: "blue",
    },
    {
      title: "Active Doctors",
      value: stats.activeDoctors,
      icon: Activity,
      color: "emerald",
    },
    {
      title: "Support Staff",
      value: stats.activeNurses,
      icon: Database,
      color: "indigo",
    },
    {
      title: "System Admins",
      value: stats.systemAdmins,
      icon: ShieldCheck,
      color: "indigo",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat, i) => (
        <div
          key={i}
          className="bg-card p-5 rounded-[5px] border border-border flex items-center gap-4 transition-all"
        >
          <div
            className={cn(
              "w-12 h-12 rounded-[5px] flex items-center justify-center",
              stat.color === "blue" && "bg-primary/10 text-primary",
              stat.color === "indigo" && "bg-primary/10 text-primary",
              stat.color === "emerald" && "bg-emerald-500/10 text-emerald-500",
            )}
          >
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1.5">
              {stat.title}
            </p>
            <p className="text-[20px] font-bold text-foreground leading-none">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- USER TABLE COMPONENT ---
export function UserTable({
  users,
  onEdit,
  onDelete,
  onView,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
}) {
  const [mounted, setMounted] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true); // Default to true for server consistency or just empty

  useEffect(() => {
    setMounted(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsSuperAdmin(user.role === "SUPERADMIN");
  }, []);

  const allRoles = [
    "All",
    "SUPERADMIN",
    "BRANCH_ADMIN",
    "DOCTOR",
    "STAFF",
    "RECEPTION",
    "PHARMACY",
    "LABORATORY",
    "RADIOLOGY",
    "FINANCE",
    "REPORTS",
  ];

  // During hydration, we use a consistent state. After mount, we apply the filter.
  const filteredRoles =
    !mounted || isSuperAdmin
      ? allRoles
      : allRoles.filter(
          (role) => !["SUPERADMIN", "BRANCH_ADMIN"].includes(role),
        );

  const formatRole = (role) => {
    if (!role) return "Guest";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar with Search and Role Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-3 rounded-[5px] border border-border shadow-none">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search staff..."
            className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                {roleFilter === "All"
                  ? "Filter by role"
                  : formatRole(roleFilter)}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px] border-border bg-card shadow-xl max-h-64 overflow-y-auto rounded-[5px] p-1"
            >
              {filteredRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    roleFilter === role
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5",
                  )}
                >
                  {role === "All" ? "All Staff" : formatRole(role)}
                  {roleFilter === role && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card rounded-[5px] border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Name
                </th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Email
                </th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Role
                </th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Hospital
                </th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Shift
                </th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border">
                  Status
                </th>
                <th className="px-8 py-3 text-right text-[11px] font-bold text-muted-foreground border-b border-border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-8 py-24 text-center text-gray-400 font-bold text-[12px] opacity-60"
                  >
                    No staff found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr
                    key={i}
                    className="hover:bg-muted/10 transition-all group"
                  >
                    <td className="px-8 py-3">
                      <div className="text-[14px] font-bold text-foreground leading-tight">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      <div className="text-[14px] text-muted-foreground font-medium">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      <div className="text-[14px] font-bold text-foreground">
                        {formatRole(user.role)}
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      <div className="text-[14px] text-muted-foreground font-medium">
                        {user.hospital}
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      {user.shiftType ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-bold text-foreground leading-none">
                            {user.shiftType}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {user.shiftStartTime} - {user.shiftEndTime}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[13px] text-gray-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-3">
                      <span
                        className={cn(
                          "inline-flex px-3 py-1 rounded-[5px] text-[11px] font-bold border leading-none items-center justify-center",
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-red-100 text-red-700 border-red-200",
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors group/btn"
                        >
                          <Eye className="w-5 h-5 text-primary" />
                        </button>
                        <button
                          onClick={() => onEdit(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors group/btn"
                        >
                          <Edit3 className="w-5 h-5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => onDelete(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors group/btn"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
