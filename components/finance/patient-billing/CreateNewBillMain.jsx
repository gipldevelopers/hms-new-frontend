"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CreditCard, X, Smartphone, Wallet, Building2, Landmark, Search, Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ─── Patient Search Dropdown ────────────────────────────────────────────────
function PatientSearchInput({ value, onSelect }) {
  const [query, setQuery]         = useState(value?.name || "");
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen]           = useState(false);
  const debounceRef               = useRef(null);
  const wrapperRef                = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q) => {
    if (!q || q.trim().length < 2) { setResults([]); setOpen(false); return; }
    try {
      setSearching(true);
      const res  = await fetch(`${API_BASE}/patients/search?q=${encodeURIComponent(q)}`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) { setResults(json.data || []); setOpen(true); }
    } catch { setResults([]); }
    finally { setSearching(false); }
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (value) onSelect(null); // clear selection when typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 300);
  };

  const handleSelect = (patient) => {
    setQuery(`${patient.name} — ${patient.uhid}`);
    setResults([]);
    setOpen(false);
    onSelect(patient);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by Name or UHID..."
          className="w-full h-[38px] pl-9 pr-3 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] focus:outline-none focus:border-[#2E37A4] transition text-slate-800 dark:text-white placeholder:text-slate-400 shadow-none font-medium"
        />
        {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2E37A4] animate-spin" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-[42px] left-0 right-0 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-lg max-h-[220px] overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p)}
              className="w-full text-left px-[12px] py-[10px] hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition border-b border-[#E7E8EB] dark:border-white/5 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-white">{p.name}</p>
                  <p className="text-[11px] text-slate-400">{p.uhid}{p.age ? ` • ${p.age}y` : ""}{p.gender ? ` • ${p.gender}` : ""}{p.contact ? ` • ${p.contact}` : ""}</p>
                </div>
                {p.isAdmitted && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded">
                    IPD
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !searching && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-50 top-[42px] left-0 right-0 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-lg px-[12px] py-[10px] text-[13px] text-slate-400">
          No patients found for "{query}"
        </div>
      )}
    </div>
  );
}

// ─── Service Catalog Picker ──────────────────────────────────────────────────
function ServiceCatalogPicker({ catalog, onAdd }) {
  const [search, setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(catalog.map(s => s.category)))];

  const filtered = catalog.filter(s => {
    const matchCat  = category === "All" || s.category === category;
    const matchTerm = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchTerm;
  });

  return (
    <div className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden">
      <div className="p-[12px] bg-slate-50/50 dark:bg-white/5 border-b border-[#E7E8EB] dark:border-white/10 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search services..."
          className="flex-1 h-[34px] px-[10px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] focus:outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white placeholder:text-slate-400"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="h-[34px] px-[10px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] focus:outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="max-h-[200px] overflow-y-auto divide-y divide-[#E7E8EB] dark:divide-white/5">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-[12px] text-slate-400">No services found</div>
        ) : filtered.map(s => (
          <div key={s.id} className="flex items-center justify-between px-[12px] py-[9px] hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition">
            <div>
              <p className="text-[13px] font-medium text-slate-800 dark:text-white">{s.name}</p>
              <p className="text-[11px] text-slate-400">{s.category} • ₹{s.price.toFixed(2)} / {s.unit}</p>
            </div>
            <button
              type="button"
              onClick={() => onAdd(s)}
              className="shrink-0 h-[28px] px-[10px] bg-[#2E37A4] text-white text-[11px] font-semibold rounded-[4px] hover:bg-[#2E37A4]/90 transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function CreateNewBillMain({ searchParams }) {
  const router   = useRouter();
  const billTypeFromParams = (searchParams?.type || "opd").toUpperCase();

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billType,        setBillType]         = useState(billTypeFromParams);
  const [discountPct,     setDiscountPct]       = useState(5);
  const [taxPct,          setTaxPct]            = useState(0);

  // Catalog
  const [catalog,         setCatalog]    = useState([]);
  const [catalogLoading,  setCatalogLoading] = useState(true);
  const [showCatalog,     setShowCatalog]   = useState(false);

  // Line items (what user adds to the bill)
  const [items, setItems] = useState([]);

  // Submit state
  const [submitting,    setSubmitting]   = useState(false);
  const [submitError,   setSubmitError]  = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null); // { billId, invoiceNo, patient, ... }

  // Collect-payment modal
  const [showPayModal,   setShowPayModal]   = useState(false);
  const [payMethod,      setPayMethod]      = useState("cash");
  const [payReference,   setPayReference]   = useState("");
  const [partialMode,    setPartialMode]    = useState(false);
  const [payAmountInput, setPayAmountInput] = useState("");

  // Fetch service catalog once
  useEffect(() => {
    (async () => {
      try {
        setCatalogLoading(true);
        const res  = await fetch(`${API_BASE}/billing/service-catalog`, { headers: getAuthHeaders() });
        const json = await res.json();
        if (json.success) setCatalog(json.data || []);
      } catch { /* catalog still usable — empty */ }
      finally { setCatalogLoading(false); }
    })();
  }, []);

  // Add service from catalog
  const handleAddFromCatalog = (service) => {
    setItems(prev => [...prev, {
      _key:     `${service.id}-${Date.now()}`,
      name:     service.name,
      category: service.category,
      qty:      1,
      price:    service.price,
      total:    service.price,
      source:   deriveSource(service.category)
    }]);
  };

  // Inline item mutations
  const updateItem = (key, field, val) => {
    setItems(prev => prev.map(item => {
      if (item._key !== key) return item;
      const updated = { ...item, [field]: val };
      if (field === "qty" || field === "price") {
        const q = parseFloat(updated.qty) || 0;
        const p = parseFloat(updated.price) || 0;
        updated.total = q * p;
      }
      return updated;
    }));
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i._key !== key));

  const addBlankRow = (category) => {
    setItems(prev => [...prev, {
      _key:     `manual-${Date.now()}`,
      name:     "",
      category,
      qty:      1,
      price:    0,
      total:    0,
      source:   deriveSource(category)
    }]);
  };

  // Derived totals
  const subtotal   = items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const discount   = subtotal * (discountPct / 100);
  const taxAmount  = (subtotal - discount) * (taxPct / 100);
  const netPayable = Math.max(0, subtotal - discount + taxAmount);

  const advancePct = netPayable > 0 ? ((parseFloat(payAmountInput) || 0) / netPayable) * 100 : 100;
  const isLow      = advancePct < 50 && netPayable > 0;

  // Validation
  const validate = () => {
    if (!selectedPatient) return "Please select a patient.";
    if (!billType)         return "Please select IPD or OPD.";
    if (items.length === 0) return "Add at least one charge item.";
    for (const item of items) {
      if (!item.name.trim()) return "All items must have a service name.";
      if (item.qty <= 0)     return "All item quantities must be greater than 0.";
    }
    return null;
  };

  // Submit bill via POST /api/billing/create
  const handleSubmitBill = async (amountPaid = 0, method = "Cash") => {
    const error = validate();
    if (error) { setSubmitError(error); return; }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = {
        patientId:     selectedPatient.id,
        type:          billType,
        items:         items.map(i => ({
          name:     i.name,
          category: i.category,
          qty:      i.qty,
          price:    i.price,
          total:    i.total,
          source:   i.source
        })),
        discount:      discount,
        tax:           taxAmount,
        paymentMethod: method,
        amountPaid:    amountPaid
      };

      const res  = await fetch(`${API_BASE}/billing/create`, {
        method:  "POST",
        headers: getAuthHeaders(),
        body:    JSON.stringify(payload)
      });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);

      setSubmitSuccess(json.data);
      setShowPayModal(false);
    } catch (e) {
      setSubmitError(e.message || "Failed to create bill.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitSuccess) {
    const d = submitSuccess;
    return (
      <div className="p-[20px] max-w-[900px] mx-auto space-y-[20px]">
        <div className="bg-[#10B9811A] border border-[#10B981]/20 rounded-[8px] p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-bold text-[#10B981]">Bill Created Successfully</h3>
            <p className="text-[13px] text-[#10B981]/80 mt-1">Invoice <strong>{d.invoiceNo}</strong> has been generated for <strong>{d.patient?.name}</strong>.</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
              {[
                ["Patient",     d.patient?.name],
                ["UHID",        d.patient?.uhid],
                ["Net Payable", `₹${d.netPayable?.toFixed(2)}`],
                ["Status",      d.status]
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-slate-400 font-semibold">{label}</p>
                  <p className="text-slate-800 dark:text-white font-bold mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setSubmitSuccess(null); setItems([]); setSelectedPatient(null); }}
            className="h-[38px] px-5 rounded-[5px] bg-[#2E37A4] text-white text-[13px] font-semibold hover:bg-[#2E37A4]/90 transition">
            Create Another Bill
          </button>
          <button onClick={() => router.push("/finance/patient-billing")}
            className="h-[38px] px-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 text-slate-600 dark:text-slate-300 text-[13px] font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition">
            Back to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px] font-inter bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen text-slate-800 dark:text-white">

      {/* Header */}
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[24px] font-bold text-slate-800 dark:text-white tracking-tight">Create New Bill</h1>
      </div>

      {/* Global error banner */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-[5px]">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-600 dark:text-red-400 font-medium">{submitError}</p>
          <button onClick={() => setSubmitError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
        </div>
      )}

      {/* ── Patient & Bill Info Form ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[20px] shadow-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px]">

          {/* Patient search */}
          <div className="space-y-[6px] md:col-span-2">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
              Patient Name / UHID <span className="text-red-500">*</span>
            </label>
            <PatientSearchInput value={selectedPatient} onSelect={setSelectedPatient} />
            {selectedPatient && (
              <div className="flex items-center gap-2 mt-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-[5px]">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[12px] font-semibold text-blue-700 dark:text-blue-300">
                  {selectedPatient.name} • {selectedPatient.uhid}
                  {selectedPatient.contact ? ` • ${selectedPatient.contact}` : ""}
                </span>
                <button onClick={() => setSelectedPatient(null)} className="ml-auto"><X className="w-3 h-3 text-blue-400" /></button>
              </div>
            )}
          </div>

          {/* IPD / OPD */}
          <div className="space-y-[6px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Bill Type <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {["IPD", "OPD"].map(t => (
                <button key={t} type="button" onClick={() => setBillType(t)}
                  className={`flex-1 h-[38px] rounded-[5px] border text-[13px] font-semibold transition ${
                    billType === t
                      ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                      : "bg-white dark:bg-[#101935] text-slate-600 dark:text-slate-300 border-[#E7E8EB] dark:border-white/10 hover:border-[#2E37A4]"
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charges + Summary ────────────────────────────────────────────────── */}
      <BillingChargesSection
        items={items}
        catalog={catalog}
        catalogLoading={catalogLoading}
        showCatalog={showCatalog}
        setShowCatalog={setShowCatalog}
        onAddFromCatalog={handleAddFromCatalog}
        onAddBlankRow={addBlankRow}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        subtotal={subtotal}
        discount={discount}
        discountPct={discountPct}
        setDiscountPct={setDiscountPct}
        taxAmount={taxAmount}
        taxPct={taxPct}
        setTaxPct={setTaxPct}
        netPayable={netPayable}
        isLow={isLow}
        advancePct={advancePct}
        submitting={submitting}
        onCollectPayment={() => { const err = validate(); if (err) { setSubmitError(err); return; } setPayAmountInput(netPayable.toFixed(2)); setShowPayModal(true); }}
        onSaveDraft={() => handleSubmitBill(0, "Pending")}
        billType={billType}
      />

      {/* ── Collect Payment Modal ─────────────────────────────────────────── */}
      {showPayModal && (
        <CollectPaymentModal
          patient={selectedPatient}
          subtotal={subtotal}
          discount={discount}
          taxAmount={taxAmount}
          netPayable={netPayable}
          items={items}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          payReference={payReference}
          setPayReference={setPayReference}
          partialMode={partialMode}
          setPartialMode={setPartialMode}
          payAmountInput={payAmountInput}
          setPayAmountInput={setPayAmountInput}
          submitting={submitting}
          onClose={() => setShowPayModal(false)}
          onConfirm={() => handleSubmitBill(parseFloat(payAmountInput) || netPayable, payMethod)}
        />
      )}
    </div>
  );
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function deriveSource(category = "") {
  const c = category.toLowerCase();
  if (c.includes("accommodation") || c.includes("room") || c.includes("ward") || c.includes("nursing")) return "System";
  if (c.includes("consultation") || c.includes("visit") || c.includes("emergency") || c.includes("procedure")) return "IPD";
  if (c.includes("lab") || c.includes("pathology") || c.includes("radiology") || c.includes("diagnostic")) return "Lab";
  if (c.includes("medicine") || c.includes("pharmacy")) return "Pharmacy";
  return "Other";
}

// ─── Charges + Summary Section ───────────────────────────────────────────────
function BillingChargesSection({
  items, catalog, catalogLoading, showCatalog, setShowCatalog,
  onAddFromCatalog, onAddBlankRow, onUpdateItem, onRemoveItem,
  subtotal, discount, discountPct, setDiscountPct,
  taxAmount, taxPct, setTaxPct, netPayable,
  isLow, advancePct, submitting, onCollectPayment, onSaveDraft, billType
}) {
  const SECTIONS = [
    { key: "room",     label: "Room Charges",  categories: ["Accommodation", "Nursing"] },
    { key: "doctor",   label: "Doctor Visits", categories: ["Consultation", "Emergency", "Procedure"] },
    { key: "lab",      label: "Lab Tests",     categories: ["Lab Test", "Pathology", "Radiology", "Diagnostics"] },
    { key: "pharmacy", label: "Pharmacy",      categories: ["Medicine"] },
  ];
  const [expanded, setExpanded] = useState({ room: true, doctor: true, lab: true, pharmacy: true });
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));

  const getItemsForSection = (sec) =>
    items.filter(i => sec.categories.some(c => i.category.toLowerCase() === c.toLowerCase())
      || (sec.key === "room" && deriveSource(i.category) === "System")
    );

  // Uncategorised items: not belonging to any section
  const categorisedIds = new Set(SECTIONS.flatMap(s => getItemsForSection(s).map(i => i._key)));
  const otherItems = items.filter(i => !categorisedIds.has(i._key));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
      {/* Left: Charges (8 cols) */}
      <div className="lg:col-span-8 space-y-[20px]">

        {/* Service Catalog Toggle */}
        <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
          <button
            type="button"
            onClick={() => setShowCatalog(p => !p)}
            className="w-full flex items-center justify-between p-[16px] text-[14px] font-bold text-slate-800 dark:text-white hover:bg-slate-50/50 dark:hover:bg-white/5 transition"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#2E37A4]" />
              Browse & Add Services
              {catalogLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCatalog ? "rotate-180" : ""}`} />
          </button>
          {showCatalog && !catalogLoading && (
            <div className="px-[16px] pb-[16px]">
              <ServiceCatalogPicker catalog={catalog} onAdd={onAddFromCatalog} />
            </div>
          )}
        </div>

        {/* Charges card */}
        <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none space-y-[16px] p-[20px]">
          <h2 className="text-[18px] font-bold text-slate-800 dark:text-white">Charges</h2>

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-12 gap-[12px] text-[11px] font-semibold text-slate-500 dark:text-slate-400 pb-[8px] border-b border-[#E7E8EB] dark:border-white/10">
            <div className="col-span-4">Service Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-right">Price (₹)</div>
            <div className="col-span-2 text-right">Total (₹)</div>
            <div className="col-span-1"></div>
          </div>

          {/* Sections */}
          {SECTIONS.map(sec => {
            const secItems = getItemsForSection(sec);
            return (
              <div key={sec.key} className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden">
                <div className="flex items-center justify-between px-[16px] py-[10px] bg-slate-50/50 dark:bg-white/5">
                  <button type="button" onClick={() => toggle(sec.key)}
                    className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded[sec.key] ? "" : "-rotate-90"}`} />
                    {sec.label}
                    <span className="text-[11px] font-normal text-slate-400">({secItems.length})</span>
                  </button>
                  <button type="button" onClick={() => onAddBlankRow(sec.categories[0])}
                    className="text-[12px] font-semibold text-[#2E37A4] hover:text-[#2E37A4]/80 transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                {expanded[sec.key] && (
                  <div className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                    {secItems.length === 0 ? (
                      <p className="px-[16px] py-[10px] text-[12px] text-slate-400 italic">No items — use "Add" or Browse Services above.</p>
                    ) : secItems.map(item => (
                      <ItemRow key={item._key} item={item} onUpdate={onUpdateItem} onRemove={onRemoveItem} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Other / uncategorised */}
          {otherItems.length > 0 && (
            <div className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden">
              <div className="px-[16px] py-[10px] bg-slate-50/50 dark:bg-white/5 text-[13px] font-bold text-slate-800 dark:text-white">
                Other Charges
              </div>
              <div className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                {otherItems.map(item => (
                  <ItemRow key={item._key} item={item} onUpdate={onUpdateItem} onRemove={onRemoveItem} />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-[24px] pt-[12px] border-t border-[#E7E8EB] dark:border-white/10 text-[14px]">
            <span className="text-slate-500 font-medium">
              Total Items: <strong className="text-slate-800 dark:text-white">{items.length}</strong>
            </span>
            <span className="text-slate-500 font-medium">
              Subtotal: <strong className="text-[#2E37A4] dark:text-blue-400 text-[16px]">₹{subtotal.toFixed(2)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Summary (4 cols) */}
      <div className="lg:col-span-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[20px] space-y-[16px] h-fit shadow-none">
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Gross Total</p>
          <p className="text-[30px] font-extrabold text-[#1e293b] dark:text-white mt-1">₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10" />

        {/* Discount */}
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Discount
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="0" max="100" step="0.5"
                value={discountPct}
                onChange={e => setDiscountPct(parseFloat(e.target.value) || 0)}
                className="w-[52px] h-[28px] px-2 text-center bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[12px] font-bold text-[#218F40] focus:outline-none focus:border-[#2E37A4]"
              />
              <span className="text-[12px] text-slate-400">%</span>
              <span className="text-[13px] font-bold text-[#218F40]">-₹{discount.toFixed(2)}</span>
            </div>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Tax (GST)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="0" max="28" step="0.5"
                value={taxPct}
                onChange={e => setTaxPct(parseFloat(e.target.value) || 0)}
                className="w-[52px] h-[28px] px-2 text-center bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[12px] font-bold text-slate-600 dark:text-slate-300 focus:outline-none focus:border-[#2E37A4]"
              />
              <span className="text-[12px] text-slate-400">%</span>
              <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">+₹{taxAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-[#E7E8EB] dark:border-white/10" />
        <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
          <span>Net Payable</span>
          <span>₹{netPayable.toFixed(2)}</span>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10" />

        {/* Billing Health */}
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between text-[12px] font-bold">
            <span className="text-slate-400">Billing Health</span>
            <span className={netPayable === 0 ? "text-[#218F40]" : isLow ? "text-[#DF8F2A]" : "text-[#218F40]"}>
              {netPayable === 0 ? "No Charges" : isLow ? "Low Advance" : "Ready"}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isLow ? "bg-[#DF8F2A]" : "bg-[#218F40]"}`}
              style={{ width: `${Math.min(100, items.length > 0 ? 80 : 0)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {items.length === 0 ? "Add charge items to proceed." : `${items.length} item(s) added. Review and submit.`}
          </p>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10" />

        {/* Actions */}
        <div className="space-y-[10px]">
          <button
            type="button"
            onClick={onCollectPayment}
            disabled={submitting}
            className="w-full h-[40px] bg-[#2E37A4] hover:bg-[#2E37A4]/90 disabled:opacity-60 text-white font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-2 transition shadow-none"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Collect Payment & Save
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={submitting}
            className="w-full h-[40px] bg-[#F1F5F9] hover:bg-[#F1F5F9]/80 disabled:opacity-60 text-[#1e293b] font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-2 transition border border-[#E7E8EB] shadow-none"
          >
            Save as Draft (Unpaid)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single line-item row ─────────────────────────────────────────────────────
function ItemRow({ item, onUpdate, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-[10px] items-center px-[12px] py-[8px]">
      <div className="col-span-4">
        <input
          type="text" value={item.name}
          onChange={e => onUpdate(item._key, "name", e.target.value)}
          placeholder="Service name"
          className="w-full h-[32px] px-[8px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[12px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
        />
      </div>
      <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400 truncate" title={item.category}>{item.category}</div>
      <div className="col-span-1">
        <input
          type="number" min="1" value={item.qty}
          onChange={e => onUpdate(item._key, "qty", parseFloat(e.target.value) || 1)}
          className="w-full h-[32px] px-[4px] text-center bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[12px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number" min="0" step="0.01" value={item.price}
          onChange={e => onUpdate(item._key, "price", parseFloat(e.target.value) || 0)}
          className="w-full h-[32px] px-[6px] text-right bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[12px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
        />
      </div>
      <div className="col-span-2 text-right text-[12px] font-semibold text-slate-800 dark:text-white pr-1">
        ₹{(parseFloat(item.total) || 0).toFixed(2)}
      </div>
      <div className="col-span-1 flex justify-end">
        <button type="button" onClick={() => onRemove(item._key)}
          className="p-[5px] text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[4px] transition">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Collect Payment Modal ────────────────────────────────────────────────────
function CollectPaymentModal({
  patient, subtotal, discount, taxAmount, netPayable, items,
  payMethod, setPayMethod, payReference, setPayReference,
  partialMode, setPartialMode, payAmountInput, setPayAmountInput,
  submitting, onClose, onConfirm
}) {
  const payAmt      = parseFloat(payAmountInput) || 0;
  const remaining   = Math.max(0, netPayable - payAmt);
  const serviceList = items.slice(0, 4);

  const METHODS = [
    { id: "cash",   label: "Cash",        icon: <Landmark className="w-4 h-4" /> },
    { id: "card",   label: "Card",        icon: <CreditCard className="w-4 h-4" /> },
    { id: "upi",    label: "UPI / QR",    icon: <Smartphone className="w-4 h-4" /> },
    { id: "net",    label: "Net Banking", icon: <Building2 className="w-4 h-4" /> },
    { id: "wallet", label: "Wallet",      icon: <Wallet className="w-4 h-4" /> },
    { id: "split",  label: "Split",       icon: <span className="text-[12px] font-bold font-mono">[|]</span> },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 backdrop-blur-[0.5px] p-4">
      <div className="bg-white dark:bg-[#101935] rounded-[12px] shadow-2xl flex flex-col md:flex-row max-w-[800px] w-full border border-[#E2E8F0] dark:border-white/10 max-h-[95vh] overflow-y-auto md:overflow-hidden">

        {/* Left: Invoice summary */}
        <div className="w-full md:w-[290px] shrink-0 bg-[#F8FAFC] dark:bg-white/5 p-5 border-b md:border-b-0 md:border-r border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Invoice Details</p>
            <div className="mt-4 space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Patient</p>
              <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{patient?.name || "—"}</p>
              <p className="text-[11px] text-gray-400">{patient?.uhid}</p>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10 my-4" />
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Services</p>
            <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
              {serviceList.map((s, i) => (
                <div key={i} className="flex justify-between text-[12px]">
                  <span className="text-[#1e293b] dark:text-white font-medium truncate mr-2">{s.name}</span>
                  <span className="text-[#1e293b] dark:text-white shrink-0">₹{(parseFloat(s.total)||0).toFixed(2)}</span>
                </div>
              ))}
              {items.length > 4 && <p className="text-[11px] text-slate-400">+{items.length - 4} more items</p>}
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-white/10 space-y-1.5">
            {[["Subtotal", `₹${subtotal.toFixed(2)}`], ["Discount", `-₹${discount.toFixed(2)}`], ["Tax", `+₹${taxAmount.toFixed(2)}`]].map(([l,v]) => (
              <div key={l} className="flex justify-between text-[12px] text-gray-400">
                <span>{l}</span><span className="font-semibold text-[#1e293b] dark:text-white">{v}</span>
              </div>
            ))}
            <div className="border-b border-dashed border-[#E2E8F0] dark:border-white/10 my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-[12px] font-bold text-[#1e293b] dark:text-white">Total Pending</span>
              <span className="text-[18px] font-extrabold text-[#1e293b] dark:text-white">₹{netPayable.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment form */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Collect Payment</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between text-[12px] mb-2">
              <span className="text-gray-500 font-bold">Amount to Pay</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-[9px] font-bold uppercase">Partial Payment</span>
                <button onClick={() => setPartialMode(p => !p)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${partialMode ? "bg-[#2E37A4]" : "bg-gray-200 dark:bg-white/10"}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${partialMode ? "translate-x-4" : ""}`} />
                </button>
              </div>
            </div>
            <input
              type="number" min="0" step="0.01"
              value={payAmountInput}
              disabled={!partialMode}
              onChange={e => setPayAmountInput(e.target.value)}
              className={`w-full h-11 px-4 border rounded-[6px] text-[16px] font-bold focus:outline-none focus:border-[#2E37A4] ${partialMode ? "bg-white dark:bg-white/5 border-gray-300 dark:border-white/15 text-[#1e293b] dark:text-white" : "bg-slate-50 dark:bg-white/5 border-[#E2E8F0] text-slate-400 cursor-not-allowed"}`}
            />
            {partialMode && remaining > 0 && (
              <p className="text-[10px] font-bold text-[#DF8F2A] mt-1">Remaining balance: ₹{remaining.toFixed(2)}</p>
            )}

            {/* Payment methods */}
            <div className="mt-4 space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                    className={`flex flex-col items-center py-2.5 border rounded-[6px] gap-1 transition ${
                      payMethod === m.id
                        ? "border-2 border-[#2E37A4] bg-[#2E37A4]/5 text-[#2E37A4] font-bold"
                        : "border-[#E2E8F0] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-[#1e293b] dark:text-slate-300"
                    }`}>
                    {m.icon}
                    <span className="text-[11px] font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference */}
            <div className="mt-4 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Transaction Reference (Optional)</p>
              <input type="text" placeholder="e.g. TXN-12345" value={payReference}
                onChange={e => setPayReference(e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] text-[#1e293b] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-5">
            <button onClick={onClose} className="h-9 px-5 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] font-bold text-[#64748B] transition">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={submitting}
              className="h-9 px-6 bg-[#2E37A4] hover:bg-[#2E37A4]/90 disabled:opacity-60 text-white font-semibold rounded-[6px] text-[12px] flex items-center gap-2 transition">
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
