"use client";
import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrderSummary({ apiBase, getAuthHeaders, selectedPatient, selectedTests, priority, clinicalInfo }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subtotal = selectedTests.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleConfirm = async () => {
    if (!selectedPatient || selectedTests.length === 0) return;

    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${apiBase}/laboratory/test-orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId: selectedPatient.id,
          priority,
          doctorId: clinicalInfo.doctorId || null,
          doctorName: clinicalInfo.doctorName || null,
          departmentName: clinicalInfo.departmentName || null,
          clinicalNotes: clinicalInfo.clinicalNotes || null,
          tests: selectedTests.map((test) => ({
            id: test.id,
            name: test.name,
            code: test.code,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create test order");
      router.push(`/laboratory/test-orders/${data.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Order Summary</h2>

      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
          Selected Tests ({selectedTests.length})
        </h3>

        {selectedTests.length === 0 ? (
          <p className="text-[12px] font-semibold text-muted-foreground py-2">
            No tests selected. Please choose from the list above.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedTests.map((test) => (
              <div key={test.id} className="flex justify-between items-center text-[12px] font-semibold">
                <span className="text-foreground">{test.name}</span>
                <span className="text-foreground">Rs. {Number(test.price || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 space-y-2 text-[12px] font-semibold">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Tax (5%)</span>
          <span>Rs. {tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-bold text-foreground">Total Amount</span>
          <span className="text-[18px] font-bold text-primary">Rs. {total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-[12px] font-bold text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving || !selectedPatient || selectedTests.length === 0}
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-[13px] font-bold px-6 py-2.5 rounded-lg transition-colors select-none cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
          <span>{saving ? "Creating..." : "Confirm Order"}</span>
        </button>
      </div>
    </div>
  );
}
