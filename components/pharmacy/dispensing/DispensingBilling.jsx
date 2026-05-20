"use client";
import React from "react";
import { ChevronDown, Plus, User, Calendar, CreditCard, Banknote, Smartphone, Wallet, Split, Check, X, Printer as PrinterIcon, Play, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DispensingBilling() {
  const { id } = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("Amoxi");
  const [selectedPayment, setSelectedPayment] = React.useState("Cash");
  const [insuranceScheme, setInsuranceScheme] = React.useState("Private Insurance");
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [amountReceived, setAmountReceived] = React.useState("100.00");
  const [printReceipt, setPrintReceipt] = React.useState(true);

  React.useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") setIsDialogOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isDialogOpen]);

  const totalDue = 51.45;
  const changeToReturn = parseFloat(amountReceived) - totalDue;

  const medications = [
    { name: "Amoxicillin", dosage: "500mg • Capsule", stock: "1,240", price: "₹12.00/unit" },
    { name: "Amoxyclav", dosage: "625mg • Tablet", stock: "450", price: "₹22.00/unit" },
    { name: "Azithromycin", dosage: "250mg • Tablet", stock: "800", price: "₹15.00/unit" },
    { name: "Aspirin", dosage: "75mg • Tablet", stock: "1000", price: "₹2.00/unit" },
  ];

  const paymentMethods = [
    { name: "Cash", icon: Banknote },
    { name: "Card", icon: CreditCard },
    { name: "UPI / QR", icon: Smartphone },
    { name: "Net Banking", icon: CreditCard },
    { name: "Wallet", icon: Wallet },
    { name: "Split", icon: Split },
  ];

  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Top Info Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-3 px-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-wrap items-center gap-x-8 gap-y-2">
        <div className="flex items-center gap-2">
           <span className="text-[12px] font-bold text-[#64748b]">Token:</span>
           <span className="text-[13px] font-bold text-[#2e37a4]">T46</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[12px] font-bold text-[#64748b]">Patient:</span>
           <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">John Doe</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[12px] font-bold text-[#64748b]">Doctor:</span>
           <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">Dr. Sarah Smith</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[12px] font-bold text-[#64748b]">Ward:</span>
           <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">OPD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-[20px]">
          {/* Medication Search Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search medication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
              />
            </div>

            <div className="space-y-0 divide-y divide-[#f1f5f9] dark:divide-[#334155]">
              {filteredMeds.map((med, index) => (
                <div key={index} className="py-4 flex items-center justify-between first:pt-0">
                  <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{med.name}</h3>
                        <span className="text-[12px] font-bold text-[#64748b] opacity-60">{med.dosage}</span>
                    </div>
                    <p className="text-[12px] font-bold text-[#64748b] mt-1">
                        Stock: <span className="text-[#1e293b] dark:text-white">{med.stock}</span> &nbsp;·&nbsp; {med.price}
                    </p>
                  </div>
                  <button className="px-4 h-8 bg-transparent text-[#2e37a4] hover:bg-[#2e37a4]/5 rounded-[4px] text-[12px] font-bold transition-all">Add</button>
                </div>
              ))}
              {filteredMeds.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-[13px] font-bold text-[#64748b] opacity-60">No medications found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Doctor's Notes (Read-only)</label>
                <div className="w-full min-h-[80px] p-4 bg-[#f8f9fc] dark:bg-[#1e293b]/50 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#64748b] opacity-80 leading-relaxed">
                  Take azithromycin after meals. Patient is allergic to penicillin.
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Pharmacist Notes</label>
                <textarea 
                  placeholder="Add dispensing notes..."
                  className="w-full min-h-[80px] p-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all resize-none"
                />
             </div>
          </div>
        </div>

        {/* Right Column (Billing) */}
        <div className="lg:col-span-5 space-y-[20px]">
          {/* Billing Details Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={18} className="text-[#2e37a4]" />
              <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Billing Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
               <div>
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Patient</p>
                  <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">John Doe (MRN: #1029384)</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">DOB</p>
                  <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">12 May 1985 (39y)</p>
               </div>
               <div className="col-span-2">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Insurance / Scheme</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-full h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all outline-none group data-[state=open]:border-primary shadow-none">
                        <span className="truncate">{insuranceScheme}</span>
                        <ChevronDown className="w-4 h-4 text-[#64748b] transition-transform group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[calc(100vw-40px)] md:w-[350px]">
                      {["Private Insurance", "Govt Scheme", "Self Pay", "Corporate"].map((scheme) => (
                        <DropdownMenuItem key={scheme} onClick={() => setInsuranceScheme(scheme)} className="font-bold text-[13px]">
                          {scheme}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
               </div>
               <div className="col-span-2">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Insurance ID</p>
                  <input 
                    type="text" 
                    defaultValue="POL-88234-A"
                    className="w-full h-11 px-4 bg-[#f8fafc] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none"
                  />
               </div>
            </div>
          </div>

          {/* Bill Summary Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4">
             <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-4">Bill Summary</h2>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                   <span>Subtotal</span>
                   <span className="text-[#1e293b] dark:text-white">₹110.00</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                   <span>Discount</span>
                   <div className="flex items-center gap-1">
                      <input type="text" defaultValue="10" className="w-10 h-7 text-center bg-[#f8fafc] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] text-[12px] font-bold outline-none" />
                      <span className="text-[11px]">%</span>
                   </div>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold text-[#22c55e]">
                   <span>Insurance Coverage</span>
                   <span>-₹50.00</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                   <span>Tax (5%)</span>
                   <span className="text-[#1e293b] dark:text-white">₹2.45</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                   <span>Advance Paid</span>
                   <span className="text-[#1e293b] dark:text-white">₹0.00</span>
                </div>
                <div className="pt-4 border-t border-[#f1f5f9] dark:border-[#334155] flex justify-between items-center">
                   <span className="text-[16px] font-bold text-[#1e293b] dark:text-white">Net Payable</span>
                   <span className="text-[24px] font-bold text-[#2e37a4]">₹51.45</span>
                </div>
             </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
             <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-4">Payment Method</h2>
             <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button 
                    key={method.name}
                    onClick={() => setSelectedPayment(method.name)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[5px] border transition-all ${
                      selectedPayment === method.name 
                        ? "border-[#2e37a4] bg-[#2e37a4]/5 text-[#2e37a4]" 
                        : "border-[#e2e8f0] dark:border-[#334155] text-[#64748b] hover:bg-[#f8fafc] dark:hover:bg-[#334155]"
                    }`}
                  >
                    <method.icon size={20} />
                    <span className="text-[11px] font-bold">{method.name}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Warning Message */}
          <div className="bg-[#fff7ed] dark:bg-[#fff7ed]/10 p-4 rounded-[5px] border border-[#fed7aa] dark:border-[#fed7aa]/20 flex items-start gap-3">
             <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#c2410c] text-[14px] font-bold">⚠️</span>
             </div>
             <div>
                <p className="text-[12px] font-bold text-[#c2410c]">2 items not fully dispensed</p>
                <p className="text-[11px] font-bold text-[#c2410c] opacity-80">Remaining items will create a follow-up queue entry automatically.</p>
             </div>
          </div>

          {/* Final Button */}
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full h-12 bg-[#2e37a4] text-white rounded-[5px] text-[14px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Confirm & Dispense <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[450px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[5px] bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">Complete Transaction</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Finalize payment and handover</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex gap-4 p-4 bg-[#f8f9fc] dark:bg-[#1e293b]/50 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
                  <div className="flex-1 border-r border-[#e2e8f0] dark:border-[#334155] pr-4">
                    <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-2">Total Amount Due</p>
                    <p className="text-[28px] font-bold text-[#2e37a4]">₹{totalDue.toFixed(2)}</p>
                  </div>
                  <div className="flex-1 space-y-3 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#64748b] opacity-70">Payment:</span>
                      <span className="text-[11px] font-bold text-[#1e293b] dark:text-white flex items-center gap-1">
                        <Banknote size={12} className="text-[#2e37a4]" /> {selectedPayment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#64748b] opacity-70">Items:</span>
                      <span className="text-[11px] font-bold text-[#1e293b] dark:text-white">2 Medicines</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Amount Received (₹)</label>
                  <input 
                    type="text" 
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full h-12 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[16px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>

                <div className="p-4 bg-[#f0fdf4] dark:bg-[#064e3b]/20 border border-[#dcfce7] dark:border-[#065f46] rounded-[5px] flex justify-between items-center">
                  <span className="text-[13px] font-bold text-[#15803d]">Change to Return:</span>
                  <span className="text-[20px] font-bold text-[#15803d]">₹{isNaN(changeToReturn) ? "0.00" : changeToReturn.toFixed(2)}</span>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={printReceipt}
                      onChange={(e) => setPrintReceipt(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#e2e8f0] dark:border-[#334155] rounded-[4px] checked:bg-[#2e37a4] checked:border-[#2e37a4] transition-all"
                    />
                    <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-all" strokeWidth={4} />
                  </div>
                  <span className="text-[12px] font-bold text-[#475569] dark:text-[#cbd5e1] group-hover:text-[#1e293b] transition-all">Print receipt automatically after completion</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#64748b] hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => router.push(`/pharmacy/prescription-queue/${id}/ready`)}
                    className="flex-2 px-8 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} strokeWidth={3} /> Mark as Paid
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
