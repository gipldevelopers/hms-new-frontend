"use client";

import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Ambulance,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Pencil,
  Printer,
  X,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useParams } from "next/navigation";

// ─── Reusable form components ─────────────────────────────────────────────────
function FormInput({ label, required, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[13px] font-bold text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        {...props}
        className={cn(
          "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60",
          error ? "border-red-400" : "border-border"
        )}
      />
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function FormSelect({ label, required, value, onChange, options, placeholder, error }) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[13px] font-bold text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all flex items-center justify-between shadow-none text-left",
            error ? "border-red-400" : "border-border"
          )}>
            <span className={cn(!selected && "text-muted-foreground/60")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] border-border z-[600] p-1 bg-card rounded-[5px] shadow-xl">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]", value === opt.value && "bg-primary/5 text-primary font-bold")}
            >
              {opt.label}
              {value === opt.value && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ isOpen, patientId, onClose }) {
  const router = useRouter();

  React.useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[440px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-bold text-[#1A1C23] dark:text-white">Update Successful</h2>
            <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 max-w-[300px] mx-auto leading-relaxed">
              The emergency registration details have been successfully updated.
            </p>
          </div>
          <div className="flex flex-col w-full gap-3 pt-2">
            <button
              onClick={() => { onClose(); router.push(`/super-admin/emergency-registration/${patientId}`); }}
              className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all w-full"
            >
              <Printer className="w-4 h-4" />
              View & Print Updated Slip
            </button>
            <button
              onClick={() => { onClose(); router.push("/super-admin/emergency-registration"); }}
              className="flex items-center justify-center gap-2 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-[#5E6C84] hover:bg-muted transition-all w-full"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditEmergencyRegistration() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = React.useState({
    name:           "",
    age:            "",
    gender:         "",
    contact:        "",
    arrivalMode:    "Walk-In",
    emergencyType:  "",
    triagePriority: "Red",
  });
  const [errors, setErrors]           = React.useState({});
  const [loading, setLoading]         = React.useState(true);
  const [submitting, setSubmitting]   = React.useState(false);
  const [apiError, setApiError]       = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  // ── Load existing data ──────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emergency/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data;
          setFormData({
            name:           p.name           || "",
            age:            p.age            ? String(p.age) : "",
            gender:         p.gender         || "",
            contact:        p.contact        || "",
            arrivalMode:    p.arrivalMode    || "Walk-In",
            emergencyType:  p.emergencyType  || "",
            triagePriority: p.triagePriority || "Red",
          });
        }
      } catch (err) {
        console.error("Failed to load patient:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatient();
  }, [id]);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.name.trim())          e.name          = "Patient name is required.";
    if (!formData.age.trim())           e.age           = "Approx age is required.";
    if (!formData.gender)               e.gender        = "Gender is required.";
    if (!formData.emergencyType.trim()) e.emergencyType = "Emergency type is required.";
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    try {
      setSubmitting(true);
      setApiError("");
      const token = localStorage.getItem("authtoken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emergency/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setApiError(json.message || "Update failed. Please try again.");
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      setApiError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-[13px] font-medium">Loading patient details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/super-admin/emergency-registration/${id}`)}
            className="w-10 h-10 flex items-center justify-center border border-border rounded-[5px] text-muted-foreground hover:bg-muted transition-all shadow-none shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-[5px] flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-[18px] font-bold text-foreground leading-none">Edit Emergency Registration</h1>
                <span className="bg-primary/5 text-primary text-[11px] font-bold px-2 py-0.5 rounded-[3px] border border-primary/20 w-fit">
                  ID: {id?.slice(0, 8)}…
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-1">Modify critical details for patient intake</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-8">

        {/* API error banner */}
        {apiError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[5px] text-red-700 text-[13px] font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {apiError}
          </div>
        )}

        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormInput
            label="Patient Name" required
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
          />
          <FormInput
            label="Approx Age" required
            type="number" min="0" max="150"
            value={formData.age}
            onChange={(e) => update("age", e.target.value)}
            error={errors.age}
          />
          <FormSelect
            label="Gender" required
            placeholder="Select gender"
            value={formData.gender}
            onChange={(val) => update("gender", val)}
            error={errors.gender}
            options={[
              { label: "Male",   value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other",  value: "Other" },
            ]}
          />
          <FormInput
            label="Mobile Number"
            value={formData.contact}
            onChange={(e) => update("contact", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          {/* Arrival Mode */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-foreground">Arrival Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { name: "Walk-In",   Icon: User      },
                { name: "Ambulance", Icon: Ambulance },
                { name: "Referral",  Icon: Building2 },
              ].map(({ name, Icon }) => (
                <div
                  key={name}
                  onClick={() => update("arrivalMode", name)}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-[5px] cursor-pointer transition-all",
                    formData.arrivalMode === name
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    formData.arrivalMode === name ? "border-primary" : "border-border"
                  )}>
                    {formData.arrivalMode === name && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="text-[14px] font-bold text-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Details & Priority */}
          <div className="space-y-8">
            <FormInput
              label="Emergency Type" required
              placeholder="e.g. Cardiac Arrest, Severe Trauma"
              value={formData.emergencyType}
              onChange={(e) => update("emergencyType", e.target.value)}
              error={errors.emergencyType}
            />

            <div className="space-y-4">
              <label className="text-[13px] font-bold text-foreground">
                Triage Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "Red",    Icon: Zap,          color: "red",     label: "Red",    sub: "Critical / Life Threatening" },
                  { value: "Yellow", Icon: AlertTriangle, color: "amber",   label: "Yellow", sub: "Urgent" },
                  { value: "Green",  Icon: CheckCircle2,  color: "emerald", label: "Green",  sub: "Stable / Non-Urgent" },
                ].map(({ value, Icon, color, label, sub }) => {
                  const active = formData.triagePriority === value;
                  return (
                    <div
                      key={value}
                      onClick={() => update("triagePriority", value)}
                      className={cn(
                        "relative p-6 border rounded-[5px] flex flex-col items-center text-center gap-3 cursor-pointer transition-all",
                        active
                          ? `bg-${color}-50 border-${color}-500 ring-1 ring-${color}-500`
                          : `border-border hover:bg-${color}-50/30`
                      )}
                    >
                      {active && (
                        <div className={`absolute top-2 right-2 w-5 h-5 bg-${color}-500 rounded-full flex items-center justify-center`}>
                          <Check className="w-3 h-3 text-white stroke-[4]" />
                        </div>
                      )}
                      <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      <div>
                        <p className={`text-[14px] font-bold text-${color}-600 leading-none`}>{label}</p>
                        <p className={`text-[11px] text-${color}-600/70 mt-1`}>{sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={() => router.push(`/super-admin/emergency-registration/${id}`)}
            className="px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={handleUpdate}
            className="flex items-center gap-2 px-6 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Registration
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        patientId={id}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
