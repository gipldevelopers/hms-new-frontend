"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex h-11 items-center rounded-lg border border-border bg-muted/20 px-4 text-[13px] font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}

function PaymentField({ label, placeholder, error }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "relative flex h-11 items-center rounded-lg border bg-card",
          error ? "border-red-200 dark:border-red-500/30" : "border-border"
        )}
      >
        <input
          type="password"
          placeholder={placeholder}
          defaultValue={error ? "********" : ""}
          className="h-full w-full bg-transparent pl-4 pr-10 text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
        <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error ? (
        <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold text-red-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Current password is incorrect</span>
        </div>
      ) : null}
    </div>
  );
}

export default function FinanceProfilePage() {
  const [paymentConfirmation, setPaymentConfirmation] = useState(true);
  const [upcomingInvoices, setUpcomingInvoices] = useState(true);
  const [failedPayments, setFailedPayments] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 pb-20 font-sans transition-colors duration-300 md:p-5">
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold leading-tight text-foreground">
              Billing Profile
            </h1>
            <p className="text-[13px] font-medium text-muted-foreground">
              Contact admin to update billing account details
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 sm:w-auto dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">
              Billing info updated
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 rounded-lg border border-border bg-card p-6 shadow-none md:flex-row md:items-start md:p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-muted/50 text-[32px] font-bold text-muted-foreground md:h-32 md:w-32 md:text-[40px]">
              AG
              <div className="absolute -bottom-1 -right-1 rounded-full border border-border bg-background p-1">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
              Active
            </span>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <ReadonlyField label="Account Name" value="Arlington Group" />
            <ReadonlyField label="Account ID" value="AG-3920" />
            <ReadonlyField label="Plan" value="Premium" />
            <ReadonlyField label="Billing Cycle" value="Monthly" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-none lg:col-span-3 md:p-8">
            <h2 className="text-[18px] font-bold text-foreground">
              Update Payment Method
            </h2>

            <div className="space-y-5">
              <PaymentField
                label="Current Password"
                placeholder="Enter current password"
                error
              />
              <PaymentField
                label="New Card Number"
                placeholder="Enter new card number"
              />
              <PaymentField
                label="Confirm New Card Number"
                placeholder="Confirm new card number"
              />
            </div>

            <button className="mt-2 h-11 w-full rounded-lg bg-primary text-[13px] font-bold text-primary-foreground transition-all hover:opacity-90">
              Update Payment Info
            </button>
          </div>

          <div className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-none lg:col-span-2 md:p-8">
            <h2 className="mb-8 text-[18px] font-bold text-foreground">
              Invoice Preferences
            </h2>

            <div className="flex-1 space-y-8">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-foreground">
                    Payment Confirmation
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                    Receive payment confirmation alerts
                  </p>
                </div>
                <Switch checked={paymentConfirmation} onChange={setPaymentConfirmation} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-foreground">
                    Upcoming Invoices
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                    Get notified about upcoming invoices
                  </p>
                </div>
                <Switch checked={upcomingInvoices} onChange={setUpcomingInvoices} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-foreground">
                    Failed Payment Alerts
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                    Receive notifications for failed payments
                  </p>
                </div>
                <Switch checked={failedPayments} onChange={setFailedPayments} />
              </div>
            </div>

            <button className="mt-8 h-11 w-full rounded-lg border border-primary text-[13px] font-bold text-primary transition-all hover:bg-primary/5">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
