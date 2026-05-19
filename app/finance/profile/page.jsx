"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";

function PreferenceToggle({ enabled, onToggle, title, description }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-7 last:border-b-0 dark:border-white/10">
      <div>
        <p className="text-[13px] font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-8 w-14 rounded-full transition ${
          enabled ? "bg-[#3B43B1]" : "bg-slate-200 dark:bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PasswordField({
  label,
  value,
  placeholder,
  showValue,
  onToggle,
  hasError = false,
  helperText,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div
        className={`flex h-14 items-center rounded-xl border bg-white px-4 dark:bg-[#0B1121] ${
          hasError ? "border-rose-400" : "border-slate-200 dark:border-white/10"
        }`}
      >
        <input
          type={showValue ? "text" : "password"}
          value={value}
          readOnly
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
        >
          {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {helperText ? (
        <div className="flex items-center gap-2 text-sm text-rose-500">
          <AlertCircle className="h-4 w-4" />
          <span>{helperText}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function FinanceProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewCard, setShowNewCard] = useState(false);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [preferences, setPreferences] = useState({
    paymentConfirmation: true,
    upcomingInvoices: true,
    failedPayments: false,
  });

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-6 transition-colors duration-300 dark:bg-[#0B1121] md:px-6 md:py-7">
      <div className="mx-auto max-w-[1720px] space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#101935]">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-8 py-7 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[24px] font-bold leading-tight text-slate-900 dark:text-white">
                Billing Profile
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                Update billing details with admin support
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-[12px] font-bold text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.12)] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Billing info updated
            </div>
          </div>

          <div className="grid gap-8 px-8 py-8 lg:grid-cols-[150px_minmax(0,1fr)]">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-[132px] w-[132px] items-center justify-center rounded-full border-4 border-slate-200 text-[3rem] font-semibold text-slate-500 dark:border-white/10 dark:text-slate-300">
                SJ
              </div>
              <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                Active
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: "Account Name", value: "Arlington Group" },
                { label: "Account ID", value: "AG-3920" },
                { label: "Plan", value: "Premium" },
                { label: "Billing Cycle", value: "Monthly" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </label>
                  <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-[13px] font-medium text-slate-900 dark:border-white/10 dark:bg-[#0B1121] dark:text-slate-200">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#101935]">
            <div className="border-b border-slate-200 px-8 py-7">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">
                Update Payment Method
              </h2>
            </div>

            <div className="space-y-7 px-8 py-8">
              <PasswordField
                label="Current Password"
                value="12345678"
                showValue={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((value) => !value)}
                hasError
                helperText="Current password is incorrect"
              />

              <PasswordField
                label="New Card Number"
                value=""
                placeholder="Enter new card number"
                showValue={showNewCard}
                onToggle={() => setShowNewCard((value) => !value)}
              />

              <PasswordField
                label="Confirm New Card Number"
                value=""
                placeholder="Confirm new card number"
                showValue={showConfirmCard}
                onToggle={() => setShowConfirmCard((value) => !value)}
              />

              <Button className="mt-2 h-11 w-full rounded-lg bg-[#3B43B1] text-[13px] font-bold text-white hover:bg-[#30379a]">
                Update Payment Info
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#101935]">
            <div className="border-b border-slate-200 px-8 py-7">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">
                Invoice Preferences
              </h2>
            </div>

            <div className="px-8 py-4">
              <PreferenceToggle
                enabled={preferences.paymentConfirmation}
                onToggle={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    paymentConfirmation: !prev.paymentConfirmation,
                  }))
                }
                title="Payment Confirmation"
                description="Receive payment confirmation alerts"
              />
              <PreferenceToggle
                enabled={preferences.upcomingInvoices}
                onToggle={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    upcomingInvoices: !prev.upcomingInvoices,
                  }))
                }
                title="Upcoming Invoices"
                description="Get notified about upcoming invoices"
              />
              <PreferenceToggle
                enabled={preferences.failedPayments}
                onToggle={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    failedPayments: !prev.failedPayments,
                  }))
                }
                title="Failed Payment Alerts"
                description="Receive notifications for failed payments"
              />

              <div className="pt-8">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-lg border-[#3B43B1] bg-white text-[13px] font-bold text-[#3B43B1] hover:bg-indigo-50 hover:text-[#3B43B1] dark:bg-[#101935] dark:hover:bg-indigo-500/10"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
