"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronDown,
  Check,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const StatusPill = ({ status }) => {
  const styles = {
    Complete: "bg-[#E6F9F1] text-[#00A389]",
    Incomplete: "bg-[#FEFCE8] text-[#A16207]",
    Emergency: "bg-[#FFF2F2] text-[#E11D48]",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-[5px] text-[11px] font-bold ${styles[status] || styles.Complete}`}
    >
      {status}
    </span>
  );
};

export default function SuperAdminPatientRegistration() {
  const router = useRouter();
  const [patientList, setPatientList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Status");
  
  const [branches, setBranches] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState(null);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setBranches(json.data);
          if (json.data.length > 0) {
            setSelectedBranch(json.data[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchPatients = async (branchId) => {
    if (!branchId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients?branchId=${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPatientList(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBranches();
  }, []);

  React.useEffect(() => {
    if (selectedBranch) {
      fetchPatients(selectedBranch.id);
    }
  }, [selectedBranch]);

  const filteredPatients = patientList.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contact && p.contact.includes(searchQuery));
    
    const matchesStatus = statusFilter === "All Status" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-[20px] font-bold text-foreground">
             Patient Registration (Super Admin)
           </h1>
           <p className="text-[12px] text-muted-foreground mt-1">Manage patient registrations across all branches</p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-4 bg-white dark:bg-[#111827] border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                <Building2 className="w-4 h-4 text-primary" />
                {selectedBranch ? selectedBranch.name : "Select Branch"}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] border-border bg-card shadow-xl rounded-[5px] p-1">
              {branches.map((branch) => (
                <DropdownMenuItem 
                  key={branch.id} 
                  onClick={() => setSelectedBranch(branch)}
                  className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors flex items-center justify-between"
                >
                  {branch.name}
                  {selectedBranch?.id === branch.id && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => router.push("/super-admin/patient-registration/new")}
            className="flex items-center gap-2 bg-primary text-white px-4 h-11 rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
          >
            <Plus className="w-4 h-4" />
            New Registration
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-[5px] shadow-none flex flex-col">
        {/* Filters and Search Bar */}
        <div className="p-3 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/60">
          <div className="relative w-full md:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name or mobile..."
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                  {statusFilter}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[140px] border-border bg-card shadow-xl rounded-[5px] p-1"
              >
                {["All Status", "Complete", "Incomplete", "Emergency"].map(status => (
                  <DropdownMenuItem 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Container - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient Name</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mobile</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gender / Age</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Registration Date</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-[11px] font-bold text-muted-foreground text-center uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-muted-foreground">Loading patients...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-muted-foreground">No patients found.</td>
                </tr>
              ) : filteredPatients.map((patient, index) => (
                <tr key={index} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-5 text-[13px] font-bold text-foreground">{patient.name}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">{patient.contact || "N/A"}</td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">
                    {patient.gender} • {patient.age} yrs
                  </td>
                  <td className="px-5 py-5 text-[13px] font-medium text-foreground">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill status={patient.status} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (patient.status === "Draft") {
                            router.push(`/super-admin/patient-registration/${patient.id}/edit`);
                          } else {
                            router.push(`/super-admin/patient-registration/${patient.id}`);
                          }
                        }}
                        className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground transition-all group/eye"
                      >
                        <Eye className="w-4 h-4 group-hover/eye:text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-border/60">
          {loading ? (
            <div className="p-10 text-center text-[13px] text-muted-foreground">Loading...</div>
          ) : filteredPatients.map((patient, index) => (
            <div 
              key={index} 
              className="p-4 space-y-4 hover:bg-muted/5 transition-colors active:bg-muted/10"
              onClick={() => {
                if (patient.status === "Incomplete") {
                  router.push(`/reception/patient-registration/${patient.id}/edit`);
                } else {
                  router.push(`/reception/patient-registration/${patient.id}`);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusPill status={patient.status} />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">{patient.name}</h3>
                </div>
                <button className="p-2 bg-muted/50 rounded-full">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Mobile</p>
                  <p className="text-[13px] font-bold text-foreground">{patient.contact || "N/A"}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Gender/Age</p>
                  <p className="text-[13px] font-bold text-foreground">{patient.gender} • {patient.age} yrs</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Reg. Date</p>
                  <p className="text-[13px] font-medium text-foreground">{new Date(patient.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
