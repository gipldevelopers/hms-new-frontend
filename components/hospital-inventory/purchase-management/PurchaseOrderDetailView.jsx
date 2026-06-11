"use client";
import React from "react";
import { ArrowLeft, ChevronRight, IndianRupee, Box, Calendar, Building2, CreditCard, FileText, Printer, Edit3, MapPin, Phone, Mail } from "lucide-react";

const VENDORS_DETAILS = {
  "Global Health Medical": {
    id: "V-GHM-1029",
    address: "123 Pharma St, Healthcare City, IN 400012",
    phone: "+91 22 555-0198",
    email: "orders@globalhealth.com"
  },
  "Baxter Healthcare Corp": {
    id: "V-BAX-9011",
    address: "456 Baxter Ave, Medical Zone, IN 300081",
    phone: "+91 22 444-0982",
    email: "procurement@baxter.com"
  },
  "Medtronic Inc.": {
    id: "V-MDT-3022",
    address: "789 Medtronic Rd, Innovation Hub, IN 560012",
    phone: "+91 22 888-1290",
    email: "support@medtronic.com"
  },
  "Surgical Supply Co.": {
    id: "V-SSC-5401",
    address: "12 Surgical Pkwy, Industrial Estate, IN 110025",
    phone: "+91 11 677-4401",
    email: "sales@surgicalsupply.com"
  },
  "Advanced Pharma": {
    id: "V-AP-8890",
    address: "99 Biotech Ave, Science City, IN 400085",
    phone: "+91 22 999-5501",
    email: "orders@advancedpharma.com"
  },
  "MedEquip Logistics": {
    id: "V-MEL-7789",
    address: "15 Logistics Way, Port Area, IN 700012",
    phone: "+91 33 222-9011",
    email: "shipping@medequiplogistics.com"
  }
};

export function PurchaseOrderDetailView({ order, onBack, onEdit }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  if (!order) return null;

  const getTimelineEvents = (orderObj) => {
    const events = [];
    if (!orderObj.orderDate || orderObj.orderDate === "--") return events;

    const baseDate = new Date(orderObj.orderDate);
    if (isNaN(baseDate.getTime())) return events;

    const formatDateStr = (date, daysToAdd, timeStr) => {
      const d = new Date(date);
      d.setDate(d.getDate() + daysToAdd);
      const formatted = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      return `${formatted} | ${timeStr}`;
    };

    // 1. Order Placed is always there
    events.push({
      title: "Order Placed",
      time: formatDateStr(baseDate, 0, "10:45 AM"),
      color: "bg-[#0F8A5F]",
      description: null
    });

    const status = orderObj.orderStatus || "ORDERED";

    if (status === "CANCELLED") {
      events.push({
        title: "Order Cancelled",
        time: formatDateStr(baseDate, 1, "04:15 PM"),
        color: "bg-rose-500",
        description: orderObj.justification || "Cancelled by Logistics Committee."
      });
      return events;
    }

    // 2. Vendor Confirmed is present for ORDERED, PARTIAL RECEIVED, COMPLETED
    events.push({
      title: "Vendor Confirmed",
      time: formatDateStr(baseDate, 1, "02:20 PM"),
      color: "bg-[#0F8A5F]",
      description: null
    });

    if (status === "ORDERED") {
      events.push({
        title: "Awaiting Shipment",
        time: `Expected ${orderObj.expectedDelivery || "Pending"}`,
        color: "bg-[#2E37A4]",
        description: orderObj.justification || "Purchase order sent to vendor queue."
      });
    } else if (status === "PARTIAL RECEIVED") {
      events.push({
        title: "Partial Items Received",
        time: formatDateStr(baseDate, 3, "09:15 AM"),
        color: "bg-[#2E37A4]",
        description: `Sourced items delivered to ${orderObj.deliveryStore || "Main Store"}. Remaining items pending.`
      });
    } else if (status === "COMPLETED") {
      events.push({
        title: "Sourced Items Delivered",
        time: formatDateStr(baseDate, 3, "11:30 AM"),
        color: "bg-[#0F8A5F]",
        description: `All items received successfully at ${orderObj.deliveryStore || "Main Store"}.`
      });
    }

    return events;
  };

  const timelineEvents = getTimelineEvents(order);

  const vendorInfo = VENDORS_DETAILS[order.vendor] || VENDORS_DETAILS["Global Health Medical"];

  // Helper styles for order state badges
  const statusBadgeStyles = {
    "PARTIAL RECEIVED": "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] dark:bg-sky-950/20 dark:border-sky-900/30",
    ORDERED: "bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE] dark:bg-blue-950/20 dark:border-blue-900/30",
    COMPLETED: "bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7] dark:bg-emerald-950/20 dark:border-emerald-900/30",
    CANCELLED: "bg-rose-50 text-rose-650 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30"
  };

  const paymentBadgeStyles = {
    PAID: "bg-[#E2FBE9] text-[#0F8A5F] border-[#B7F4C7] dark:bg-emerald-950/20 dark:border-emerald-900/30",
    PENDING: "bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800 dark:border-slate-700",
    VOID: "bg-[#FFF1F0] text-[#F5222D] border-[#FFCCC7] dark:bg-rose-950/20 dark:border-rose-900/30"
  };

  // Build high fidelity lines from item rows
  const rawItems = order.items || [];
  const items = rawItems.map((item, idx) => {
    const sku = item.sku || (idx === 0 ? "SKU-882" : idx === 1 ? "SKU-102" : `SKU-${200 + idx * 5}`);
    const unit = item.unit || (idx === 0 ? "Boxes" : idx === 1 ? "Units" : "vials");
    const qty = parseFloat(item.qty) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const taxRate = 0.18; // standard 18% tax
    const subtotal = qty * unitPrice;
    const totalWithTax = subtotal * (1 + taxRate);

    return {
      name: item.name,
      sku,
      qty,
      unit,
      unitPrice,
      tax: "18%",
      total: totalWithTax,
      subtotal
    };
  });

  // Totals calculations based on line items
  const itemsSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemsTax = itemsSubtotal * 0.18;
  const itemsGrandTotal = itemsSubtotal + itemsTax;

  return (
    <div ref={containerRef} className="font-sans space-y-4" id="printable-po-area">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body, #__next, 
          div, main, section, article {
            height: auto !important;
            overflow: visible !important;
            position: static !important;
          }
          
          /* Hide everything on page */
          body * {
            visibility: hidden;
          }
          
          /* Show only our print container */
          #printable-po-area, #printable-po-area * {
            visibility: visible;
          }
          
          /* Position the print container to cover full page */
          #printable-po-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Force layout to be normal block and take full width */
          #printable-po-area .grid {
            display: block !important;
          }
          #printable-po-area .grid-cols-1,
          #printable-po-area .grid-cols-2,
          #printable-po-area .grid-cols-3,
          #printable-po-area .grid-cols-4,
          #printable-po-area .lg\\:grid-cols-12 {
            display: block !important;
          }
          
          #printable-po-area .lg\\:col-span-8,
          #printable-po-area .lg\\:col-span-4,
          #printable-po-area .md\\:grid-cols-2 {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
            display: block !important;
            margin-bottom: 20px !important;
          }

          /* Hide buttons and navigation */
          .no-print {
            display: none !important;
          }

          /* Ensure text colors are black for printing */
          #printable-po-area text,
          #printable-po-area span,
          #printable-po-area h1,
          #printable-po-area h2,
          #printable-po-area h3,
          #printable-po-area td,
          #printable-po-area th,
          #printable-po-area p {
            color: #000000 !important;
          }
          
          /* Keep timeline background colors etc white for printing */
          #printable-po-area .bg-white,
          #printable-po-area .bg-[#F8F9FC] {
            background-color: #ffffff !important;
            background: #ffffff !important;
          }
          
          /* Table styling for neat print */
          #printable-po-area table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 15px !important;
          }
          #printable-po-area th {
            background-color: #f1f5f9 !important;
            border-bottom: 2px solid #cbd5e1 !important;
            padding: 10px 8px !important;
            font-weight: bold !important;
          }
          #printable-po-area td {
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 10px 8px !important;
          }
        }
      `}} />

      {/* TOP HEADER CONTAINER CARD */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-none">
        <div className="flex items-center gap-3">
          {/* Circular Back Button with ArrowLeft */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-none no-print"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-800 dark:text-white leading-none">
                {order.poNumber}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E2FBE9] border uppercase leading-none ${statusBadgeStyles[order.orderStatus] || statusBadgeStyles.ORDERED}`}>
                {order.orderStatus}
              </span>
            </div>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              <span>Hospital Inventory</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span>Purchase Management</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-slate-600 dark:text-slate-300 font-extrabold">{order.poNumber}</span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5 no-print">
          <button
            onClick={() => window.print()}
            className="h-[38px] px-[16px] rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101935] text-[13px] font-semibold text-slate-655 dark:text-slate-350 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition flex items-center justify-center gap-[6px] cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print PO
          </button>
          <button
            onClick={() => onEdit(order)}
            className="h-[38px] px-[16px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition flex items-center justify-center gap-[6px] cursor-pointer border border-[#2E37A4]"
          >
            <Edit3 className="h-4 w-4" /> Edit Order
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* LEFT COLUMN: Line items & Info subcards (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">

          {/* Order Line Items Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden shadow-none">
            <div className="px-5 py-4 border-b border-[#e2e8f0] dark:border-[#334155] flex justify-between items-center bg-[#F8F9FC] dark:bg-[#101935]/40">
              <h2 className="text-[13px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                Order Line Items
              </h2>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {items.length} Items Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="bg-slate-50/20 dark:bg-slate-800/10 text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#e2e8f0] dark:border-[#334155]">
                    <th className="px-5 py-3.5 font-extrabold">Item Name</th>
                    <th className="px-5 py-3.5 font-extrabold">SKU</th>
                    <th className="px-5 py-3.5 font-extrabold text-center">Qty</th>
                    <th className="px-5 py-3.5 font-extrabold">Unit</th>
                    <th className="px-5 py-3.5 font-extrabold text-right">Unit Price</th>
                    <th className="px-5 py-3.5 font-extrabold text-center">Tax</th>
                    <th className="px-5 py-3.5 font-extrabold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-200">
                      <td className="px-5 py-4 font-bold text-[12.5px]">
                        {item.name}
                      </td>
                      <td className="px-5 py-4 font-bold text-[12.5px] text-slate-400 dark:text-slate-500">
                        {item.sku}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-[12.5px] text-center">
                        {item.qty.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-400">
                        {item.unit}
                      </td>
                      <td className="px-5 py-4 font-bold text-right">
                        ₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 font-bold text-center text-slate-400">
                        {item.tax}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-800 dark:text-white text-right">
                        ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SHIPPING & PAYMENT INFO BLOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Shipping Details Card */}
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none space-y-3.5">
              <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-2">
                <Calendar size={13} className="text-slate-400" />
                Shipping Details
              </h3>
              <div className="space-y-2.5 text-[12.5px]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Shipment Method:</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">Standard Logistics</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Expected Delivery:</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">{order.expectedDelivery || "Oct 20, 2023"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Carrier:</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">BlueDart Healthcare</span>
                </div>
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none space-y-3.5">
              <h3 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-2">
                <CreditCard size={13} className="text-slate-400" />
                Payment Information
              </h3>
              <div className="space-y-2.5 text-[12.5px]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Payment Status:</span>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold uppercase border ${paymentBadgeStyles[order.payment] || paymentBadgeStyles.PENDING}`}>
                    {order.payment}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Payment Method:</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">Bank Transfer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Terms:</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">Net 30 Days</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Vendor, Financials & Timeline (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Vendor Details Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col items-center text-center space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest self-start">
              Vendor Details
            </span>

            {/* Rounded Icon Box */}
            <div className="flex items-center justify-center w-12 h-12 rounded-[10px] bg-blue-50 dark:bg-[#2E37A4]/15 text-[#2E37A4] dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <Building2 size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-[14.5px] font-extrabold text-slate-800 dark:text-white">
                {order.vendor}
              </h3>
              <span className="text-[11.5px] font-bold text-[#2E37A4] dark:text-blue-400">
                {vendorInfo.id}
              </span>
            </div>

            {/* Separator line */}
            <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800" />

            <div className="w-full space-y-3.5 text-left text-[12.5px] text-slate-600 dark:text-slate-350">
              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{vendorInfo.address}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <span className="font-semibold">{vendorInfo.phone}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="font-semibold truncate">{vendorInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Financial Summary
            </span>

            <div className="space-y-3 text-[13px] text-slate-700 dark:text-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-400">Subtotal</span>
                <span className="font-extrabold text-slate-800 dark:text-white">
                  ₹{itemsSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-400">Tax (18% GST)</span>
                <span className="font-extrabold text-slate-800 dark:text-white">
                  ₹{itemsTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Muted line separator */}
              <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 pt-1" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-semibold text-slate-400">Grand Total</span>
                <span className="text-[20px] font-black text-slate-800 dark:text-white leading-none">
                  ₹{itemsGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Order Timeline
            </span>

            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 pl-5.5 space-y-4">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-[28.5px] top-1 w-2.5 h-2.5 rounded-full ${evt.color}`} />
                  <div className="font-extrabold text-[12.5px] text-slate-800 dark:text-white leading-tight">
                    {evt.title}
                  </div>
                  <div className="text-[10.5px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                    {evt.time}
                  </div>
                  {evt.description && (
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic bg-slate-50/80 dark:bg-[#101935]/40 border border-slate-100 dark:border-slate-800/40 p-2 rounded-[4px] mt-1.5 leading-relaxed">
                      "{evt.description}"
                    </p>
                  )}
                </div>
              ))}
              {timelineEvents.length === 0 && (
                <p className="text-[12px] text-slate-405 font-semibold italic">No timeline events recorded.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default PurchaseOrderDetailView;
