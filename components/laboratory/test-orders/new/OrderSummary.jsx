"use client";
import React from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrderSummary({ selectedTests }) {
  const router = useRouter();

  const subtotal = selectedTests.reduce((acc, curr) => acc + curr.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleConfirm = () => {
    router.push("/laboratory/test-orders");
  };

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Order Summary</h2>

      {/* Selected Tests Header */}
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
                <span className="text-foreground">₹{test.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 space-y-2 text-[12px] font-semibold">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-bold text-foreground">Total Amount</span>
          <span className="text-[18px] font-bold text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleConfirm}
          disabled={selectedTests.length === 0}
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-[13px] font-bold px-6 py-2.5 rounded-lg transition-colors select-none cursor-pointer disabled:cursor-not-allowed"
        >
          <Check size={16} strokeWidth={2.5} />
          <span>Confirm Order</span>
        </button>
      </div>
    </div>
  );
}
