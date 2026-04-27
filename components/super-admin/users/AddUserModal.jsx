import React, { useState, useEffect } from "react";
import { X, ChevronDown, Eye, EyeOff, Check, CheckCircle2, Clock as ClockIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// --- CUSTOM TIME PICKER COMPONENT (Copied from Shift Templates) ---
function CustomTimePicker({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to 08:00 AM
  const initialHour = value ? parseInt(value.split(':')[0]) : 8;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = value?.includes('PM') ? 'PM' : 'AM';

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];

  const formatTime = (h, m, p) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;
  };

  const handleSelect = (h, m, p) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    onChange(formatTime(h, m, p));
  };

  return (
    <DropdownMenu open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled}
          className="w-full h-[52px] justify-start font-bold text-[13px] bg-background border-border relative pl-12 shadow-none"
        >
          <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          {value || "Select Time"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="p-0 border-border bg-card shadow-2xl z-[600]"
      >
        <div className="flex h-[200px]">
          {/* Hours */}
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                className={cn(
                  "w-full py-2 text-[12px] font-bold transition-all",
                  hour === h ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(h, minute, period)}
              >
                {h.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
          {/* Minutes */}
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "w-full py-2 text-[12px] font-bold transition-all",
                  minute === parseInt(m) ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(hour, parseInt(m), period)}
              >
                {m}
              </button>
            ))}
          </div>
          {/* AM/PM */}
          <div className="w-16 flex flex-col py-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                className={cn(
                  "w-full flex-1 text-[11px] font-bold transition-all",
                  period === p ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(hour, minute, p)}
              >
                {p}
              </button>
            ))}
            <button 
              type="button"
              className="h-10 border-t border-border bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const API_BASE = "/api";

export function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
  editingUser,
  branches = [],
  selectedBranchId,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    consoleRoles: [],
    branchId: "",
    status: "Active",
    password: "",
    shiftType: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        role: editingUser.role || "",
        consoleRoles: editingUser.consoleRoles || [],
        branchId: editingUser.branchId || "",
        status: editingUser.status || "Active",
        password: "",
        shiftType: editingUser.shiftType || "",
        shiftStartTime: editingUser.shiftStartTime || "",
        shiftEndTime: editingUser.shiftEndTime || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        consoleRoles: [],
        branchId: selectedBranchId || "",
        status: "Active",
        password: "",
        shiftType: "",
        shiftStartTime: "",
        shiftEndTime: "",
      });
    }
  }, [editingUser, isOpen, selectedBranchId]);

  const [mounted, setMounted] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);

  useEffect(() => {
    setMounted(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsSuperAdmin(user.role === "SUPERADMIN");
  }, []);

  const handleValueChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Mutual Exclusivity: if new primary role was in console roles, remove it
      if (name === "role" && prev.consoleRoles.includes(value)) {
        updated.consoleRoles = prev.consoleRoles.filter((r) => r !== value);
      }

      // Shift Selection Logic
      if (name === "shiftType") {
        if (value === "Day") {
          updated.shiftStartTime = "09:00 AM";
          updated.shiftEndTime = "06:00 PM";
        } else if (value === "Night") {
          updated.shiftStartTime = "09:00 PM";
          updated.shiftEndTime = "06:00 AM";
        } else if (value === "Emergency") {
          // Manual
        } else {
          updated.shiftStartTime = "";
          updated.shiftEndTime = "";
        }
      }

      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleValueChange(name, value);
  };

  // Watch for role changes to ensure consoleRoles never contains the primary role
  useEffect(() => {
    if (formData.role && formData.consoleRoles.includes(formData.role)) {
      setFormData((prev) => ({
        ...prev,
        consoleRoles: prev.consoleRoles.filter((r) => r !== formData.role),
      }));
    }
  }, [formData.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const url = editingUser
        ? `${API_BASE}/users/${editingUser.id}`
        : `${API_BASE}/users`;

      const method = editingUser ? "PUT" : "POST";

      const payload = { ...formData };
      if (!payload.password && editingUser) delete payload.password;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            (editingUser
              ? "Personnel record updated"
              : "New user provisioned successfully"),
        );
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Credential orchestration failed");
      }
    } catch (error) {
      console.error("Submit user error:", error);
      toast.error("Cloud synchronization error. Check network integrity.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const allRoles = [
    { value: "BRANCH_ADMIN", label: "Branch Admin" },
    { value: "DOCTOR", label: "Doctor" },
    { value: "STAFF", label: "Staff" },
    { value: "RECEPTION", label: "Receptionist" },
    { value: "PHARMACY", label: "Pharmacist" },
    { value: "LABORATORY", label: "Laboratory Tech" },
    { value: "RADIOLOGY", label: "Radiologist" },
    { value: "FINANCE", label: "Finance" },
    { value: "REPORTS", label: "Reports & Mgmt" },
  ];

  const roles =
    !mounted || isSuperAdmin
      ? allRoles
      : allRoles.filter(
          (r) => !["BRANCH_ADMIN", "SUPERADMIN"].includes(r.value),
        );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[680px] rounded-[5px] overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
              {editingUser
                ? "Edit Staff Member"
                : "Add New Staff"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-6 sm:px-8 sm:py-8 space-y-6 sm:space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* User Name */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. John Deo"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                  Primary Role*
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full h-[52px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all flex items-center justify-between shadow-none"
                    >
                      <span>{formData.role ? roles.find(r => r.value === formData.role)?.label : "Select Primary Role"}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px] border-gray-100 dark:border-white/10 z-[600]">
                    {roles.map((r) => (
                      <DropdownMenuItem
                        key={r.value}
                        onClick={() => handleValueChange("role", r.value)}
                        className={cn(
                          "text-[13px] font-bold h-11 cursor-pointer focus:bg-primary/5",
                          formData.role === r.value && "bg-primary/5 text-primary"
                        )}
                      >
                        {r.label}
                        {formData.role === r.value && <Check className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Console Access (Multiple) */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                  Console Access
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all flex items-center justify-between"
                    >
                      <span className="text-gray-400 font-medium">
                        Select Permissions
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[300px] max-h-[300px] overflow-y-auto dark:bg-[#0F172A] border-gray-100 dark:border-white/10 z-[600]"
                  >
                    {allRoles
                      .filter((role) => role.value !== formData.role)
                      .map((role) => (
                        <DropdownMenuCheckboxItem
                          key={role.value}
                          checked={formData.consoleRoles.includes(role.value)}
                          onCheckedChange={(checked) => {
                            setFormData((prev) => ({
                              ...prev,
                              consoleRoles: checked
                                ? [...prev.consoleRoles, role.value]
                                : prev.consoleRoles.filter(
                                    (v) => v !== role.value,
                                  ),
                            }));
                          }}
                          className="text-[13px] font-medium"
                        >
                          {role.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected Roles Badges */}
                {formData.consoleRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 px-1">
                    {formData.consoleRoles.map((val) => {
                      const label = allRoles.find(
                        (r) => r.value === val,
                      )?.label;
                      return (
                        <div
                          key={val}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 dark:bg-primary/10 text-primary border border-primary/20 rounded-[5px] text-[10px] font-bold uppercase tracking-wider animate-in zoom-in-95 duration-200 group/badge"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                consoleRoles: prev.consoleRoles.filter(
                                  (v) => v !== val,
                                ),
                              }));
                            }}
                            className="p-0.5 hover:bg-primary/10 rounded-sm transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff.name@gvoice.hms"
                  required
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              {/* Deployment Location */}
              {isSuperAdmin && (
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                    Select Branch*
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline"
                        disabled={branches.length <= 1}
                        className="w-full h-[52px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed shadow-none"
                      >
                        <span>{formData.branchId ? branches.find(b => b.id === formData.branchId)?.name : "Select Target Branch"}</span>
                        {branches.length > 1 && <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </Button>
                    </DropdownMenuTrigger>
                    {branches.length > 1 && (
                      <DropdownMenuContent align="start" className="w-[300px] border-gray-100 dark:border-white/10 z-[600]">
                        {branches.map((b) => (
                          <DropdownMenuItem
                            key={b.id}
                            onClick={() => handleValueChange("branchId", b.id)}
                            className={cn(
                              "text-[13px] font-bold h-11 cursor-pointer focus:bg-primary/5",
                              formData.branchId === b.id && "bg-primary/5 text-primary"
                            )}
                          >
                            {b.name}
                            {formData.branchId === b.id && <Check className="w-4 h-4 ml-auto" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                </div>
              )}

              {/* Shift Selection */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">Staff Shift*</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full h-[52px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all flex items-center justify-between shadow-none"
                    >
                      <span>
                        {formData.shiftType === "Day" && "Day Shift (09:00 AM - 06:00 PM)"}
                        {formData.shiftType === "Night" && "Night Shift (09:00 PM - 06:00 AM)"}
                        {formData.shiftType === "Emergency" && "Emergency (Manual)"}
                        {!formData.shiftType && "Select Shift"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px] border-gray-100 dark:border-white/10 z-[600]">
                    <DropdownMenuItem 
                      onClick={() => handleValueChange("shiftType", "Day")}
                      className="text-[13px] font-bold h-11 cursor-pointer focus:bg-primary/5"
                    >
                      Day Shift (09:00 AM - 06:00 PM)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleValueChange("shiftType", "Night")}
                      className="text-[13px] font-bold h-11 cursor-pointer focus:bg-primary/5"
                    >
                      Night Shift (09:00 PM - 06:00 AM)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleValueChange("shiftType", "Emergency")}
                      className="text-[13px] font-bold h-11 cursor-pointer focus:bg-primary/5"
                    >
                      Emergency (Manual)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Shift Timings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">Start Time</label>
                  <CustomTimePicker 
                    value={formData.shiftStartTime}
                    onChange={(val) => handleValueChange("shiftStartTime", val)}
                    disabled={formData.shiftType !== "Emergency" && formData.shiftType !== ""}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-300 ml-1">End Time</label>
                  <CustomTimePicker 
                    value={formData.shiftEndTime}
                    onChange={(val) => handleValueChange("shiftEndTime", val)}
                    disabled={formData.shiftType !== "Emergency" && formData.shiftType !== ""}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 h-[48px] bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 text-gray-500 font-bold text-[12px] rounded-[5px] transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-10 h-[48px] rounded-[5px] font-bold text-[12px] hover:opacity-90 transition-all shadow-none disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingUser
                  ? "Save"
                  : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
