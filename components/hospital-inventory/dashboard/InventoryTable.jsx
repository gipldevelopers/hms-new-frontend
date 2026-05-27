// "use client";

// import React, { useState } from "react";
// import { Search, ChevronDown, Download, Plus, Edit3, Eye, Trash2, ChevronLeft } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
// import * as DialogPrimitive from "@radix-ui/react-dialog";

// const MOCK_ITEMS = [
//   { id: 1, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "45 Bottles", expiry: "01-12-2024", status: "LOW", supplier: "MedTech Supplies", minThreshold: "15", notes: "Store in a cool, dry place. Ensure caps are tightly sealed after usage." },
//   { id: 2, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "LOW", supplier: "LifeScience Corp", minThreshold: "10", notes: "Low stock alert triggered." },
//   { id: 3, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "Out of Stock", supplier: "MedTech Labs", minThreshold: "8", notes: "Needs emergency requisition." },
//   { id: 4, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "01-12-2024", status: "In Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 5, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 6, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "Out of Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 7, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 8, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 9, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Consumables", qty: "12 Boxes", expiry: "01-12-2024", status: "LOW", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 10, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "01-12-2024", status: "In Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
//   { id: 11, name: "Reagent A (Hematology)", sku: "HEM-001", category: "Reagents", qty: "12 Boxes", expiry: "01-12-2024", status: "Out of Stock", supplier: "Global Pharma", minThreshold: "5", notes: "" },
// ];

// const formatDateToDDMMYYYY = (dateStr) => {
//   if (!dateStr) return "";
//   const cleaned = String(dateStr).trim();
//   // Match YYYY-MM-DD (e.g. 2024-12-01 or 222222-12-01)
//   const yyyymmddRegex = /^(\d{4,})-(\d{2})-(\d{2})/;
//   const match = cleaned.match(yyyymmddRegex);
//   if (match) {
//     const [_, year, month, day] = match;
//     const year4 = year.substring(0, 4);
//     return `${day}-${month}-${year4}`;
//   }
//   // Match DD-MM-YYYY (e.g. 01-12-2024 or 01-12-222222)
//   const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4,})/;
//   const match2 = cleaned.match(ddmmyyyyRegex);
//   if (match2) {
//     const [_, day, month, year] = match2;
//     const year4 = year.substring(0, 4);
//     return `${day}-${month}-${year4}`;
//   }
//   return cleaned;
// };

// const formatDateToYYYYMMDD = (dateStr) => {
//   if (!dateStr) return "";
//   const cleaned = String(dateStr).trim();
//   // Match DD-MM-YYYY
//   const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4,})/;
//   const match = cleaned.match(ddmmyyyyRegex);
//   if (match) {
//     const [_, day, month, year] = match;
//     const year4 = year.substring(0, 4);
//     return `${year4}-${month}-${day}`;
//   }
//   // Match YYYY-MM-DD
//   const yyyymmddRegex = /^(\d{4,})-(\d{2})-(\d{2})/;
//   const match2 = cleaned.match(yyyymmddRegex);
//   if (match2) {
//     const [_, year, month, day] = match2;
//     const year4 = year.substring(0, 4);
//     return `${year4}-${month}-${day}`;
//   }
//   return cleaned;
// };

// // Local custom DialogContent with reduced backdrop blur (matching subtle patient billing layouts)
// const CustomDialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
//   <DialogPortal>
//     <DialogOverlay className="backdrop-blur-[0.5px] bg-black/40" />
//     <DialogPrimitive.Content
//       ref={ref}
//       className={cn(
//         "fixed left-[50%] top-[50%] z-[1000] grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-[#101935] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-[5px] overflow-hidden border-[#E7E8EB] dark:border-white/10",
//         className
//       )}
//       {...props}
//     >
//       <DialogPrimitive.Title className="sr-only">Inventory Item Form Dialog</DialogPrimitive.Title>
//       <DialogPrimitive.Description className="sr-only">Form dialog modal for adding or editing hospital inventory reagents and consumables.</DialogPrimitive.Description>
//       {children}
//     </DialogPrimitive.Content>
//   </DialogPortal>
// ));
// CustomDialogContent.displayName = "CustomDialogContent";

// export function InventoryTable({ items, setItems, onViewItem, triggerAddModal, clearAddTrigger, hideTableContent, onRefresh }) {
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [selectedExpiry, setSelectedExpiry] = useState("All");
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   // Modal States
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [modalType, setModalType] = useState(null); // 'view', 'edit', 'add'

//   React.useEffect(() => {
//     if (triggerAddModal) {
//       setModalType("add");
//       clearAddTrigger();
//     }
//   }, [triggerAddModal, clearAddTrigger]);

//   const categories = ["All", "Reagents", "Consumables"];
//   const statuses = ["All", "In Stock", "LOW", "Out of Stock"];
//   const expiries = ["All", "Expired", "Next 30 Days", "Next 90 Days", "Next 180 Days"];

//   const parseExpiryDate = (dateStr) => {
//     if (!dateStr) return null;
//     const cleaned = String(dateStr).trim();
//     const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})/;
//     const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})/;

//     let expDate = null;
//     if (ddmmyyyyRegex.test(cleaned)) {
//       const [_, day, month, year] = cleaned.match(ddmmyyyyRegex);
//       expDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
//     } else if (yyyymmddRegex.test(cleaned)) {
//       const [_, year, month, day] = cleaned.match(yyyymmddRegex);
//       expDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
//     } else {
//       expDate = new Date(cleaned);
//     }
//     return isNaN(expDate.getTime()) ? null : expDate;
//   };

//   const handleClearFilters = () => {
//     setSearch("");
//     setSelectedCategory("All");
//     setSelectedStatus("All");
//     setSelectedExpiry("All");
//   };

//   const filteredItems = items.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.sku.toLowerCase().includes(search.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
//     const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;

//     let matchesExpiry = true;
//     if (selectedExpiry !== "All") {
//       const expDate = parseExpiryDate(item.expiry);
//       if (!expDate) {
//         matchesExpiry = false;
//       } else {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const diffTime = expDate.getTime() - today.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//         if (selectedExpiry === "Expired") {
//           matchesExpiry = diffDays < 0;
//         } else if (selectedExpiry === "Next 30 Days") {
//           matchesExpiry = diffDays >= 0 && diffDays <= 30;
//         } else if (selectedExpiry === "Next 90 Days") {
//           matchesExpiry = diffDays >= 0 && diffDays <= 90;
//         } else if (selectedExpiry === "Next 180 Days") {
//           matchesExpiry = diffDays >= 0 && diffDays <= 180;
//         }
//       }
//     }

//     return matchesSearch && matchesCategory && matchesStatus && matchesExpiry;
//   });

//   const toggleDropdown = (dropdown) => {
//     if (activeDropdown === dropdown) {
//       setActiveDropdown(null);
//     } else {
//       setActiveDropdown(dropdown);
//     }
//   };

//   // Actions
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const name = formData.get("name");
//     const sku = formData.get("sku");
//     const category = formData.get("category");
//     const qtyVal = parseFloat(formData.get("qtyVal")) || 0;
//     const qtyUnit = formData.get("qtyUnit");
//     const qty = `${qtyVal} ${qtyUnit}`;
//     const expiry = formatDateToDDMMYYYY(formData.get("expiry"));
    
//     let status = "In Stock";
//     if (qtyVal === 0) {
//       status = "Out of Stock";
//     } else if (qtyVal < 500) {
//       status = "LOW";
//     } else {
//       status = "In Stock";
//     }

//     const supplier = formData.get("supplier");
//     const minThreshold = formData.get("minThreshold");
//     const notes = formData.get("notes");
//     const payload = {
//       name,
//       sku,
//       category,
//       qty,
//       expiry,
//       status,
//       supplier,
//       minThreshold,
//       notes,
//       unitPrice: 0.0
//     };

//     try {
//       const token = localStorage.getItem("authtoken");
//       if (modalType === "edit") {
//         const res = await fetch(`/api/hospital-inventory/${selectedItem.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify(payload)
//         });
//         const json = await res.json();
//         if (json.success) {
//           toast.success("Inventory item updated successfully!");
//           if (onRefresh) onRefresh();
//         } else {
//           toast.error(json.error || "Failed to update item");
//         }
//       } else {
//         const res = await fetch("/api/hospital-inventory", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify(payload)
//         });
//         const json = await res.json();
//         if (json.success) {
//           toast.success("Inventory item added successfully!");
//           if (onRefresh) onRefresh();
//         } else {
//           toast.error(json.error || "Failed to add item");
//         }
//       }
//     } catch (err) {
//       console.error("Error saving inventory item:", err);
//       toast.error("Network error saving inventory item");
//     }

//     setModalType(null);
//     setSelectedItem(null);
//   };

//   const handleDeleteItem = async (item) => {
//     const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
//     if (confirmed) {
//       try {
//         const token = localStorage.getItem("authtoken");
//         const res = await fetch(`/api/hospital-inventory/${item.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const json = await res.json();
//         if (json.success) {
//           toast.success(`${item.name} deleted successfully`);
//           if (onRefresh) onRefresh();
//         } else {
//           toast.error(json.error || "Failed to delete item");
//         }
//       } catch (err) {
//         console.error("Error deleting item:", err);
//         toast.error("Network error deleting item");
//       }
//     }
//   };

//   return (
//     <div className="space-y-[20px]">
//       {!hideTableContent && (
//         <>
//           {/* Lab Inventory Header */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
//             <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
//               Lab Inventory Items
//             </h2>
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none">
//                 <Download size={14} />
//                 Export
//               </button>
//               <button
//                 onClick={() => setModalType("add")}
//                 className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
//               >
//                 <Plus size={14} />
//                 Add Item
//               </button>
//             </div>
//           </div>

//           {/* Sub-tabs List matching your exact mockup */}
//           <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] dark:bg-[#1E293B]/60 rounded-[8px] border border-[#E2E8F0] dark:border-[#334155] w-fit">
//             <button 
//               className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
//               onClick={() => toast.info("Stock Inventory module is ready for integration")}
//             >
//               Stock Inventory
//             </button>
//             <button 
//               className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-[#2E37A4] text-white shadow-none cursor-pointer"
//             >
//               Lab Inventory
//             </button>
//             <button 
//               className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
//               onClick={() => toast.info("Transfers & Requests module is ready for integration")}
//             >
//               Transfers & Requests
//             </button>
//             <button 
//               className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
//               onClick={() => toast.info("Batch & Expiry Tracking module is ready for integration")}
//             >
//               Batch & Expiry Tracking
//             </button>
//           </div>

//           {/* Filter bar */}
//           <div className="relative flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none">

//             {/* Search */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search Patient name / Order ID..."
//                 className="w-full h-10 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all text-foreground"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             {/* Dynamic Filters */}
//             <div className="flex flex-wrap items-center gap-2">

//               {/* Category Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => toggleDropdown("category")}
//                   className={cn(
//                     "h-10 px-4 rounded-[8px] text-[13px] font-semibold flex items-center gap-2 hover:bg-muted transition-all outline-none border cursor-pointer",
//                     selectedCategory !== "All"
//                       ? "bg-[#2E37A4]/5 border-[#2E37A4] text-[#2E37A4]"
//                       : "bg-white dark:bg-[#1e293b] border-[#e2e8f0] dark:border-[#334155] text-foreground"
//                   )}
//                 >
//                   {selectedCategory === "All" ? "Category" : `Category: ${selectedCategory}`}
//                   <ChevronDown className={cn("w-3.5 h-3.5", selectedCategory !== "All" ? "text-[#2E37A4]" : "text-muted-foreground")} />
//                 </button>
//                 {activeDropdown === "category" && (
//                   <div className="absolute right-0 mt-1.5 w-[180px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-xl z-50 p-1">
//                     {categories.map((cat) => (
//                       <button
//                         key={cat}
//                         onClick={() => {
//                           setSelectedCategory(cat);
//                           setActiveDropdown(null);
//                         }}
//                         className={cn(
//                           "w-full text-left rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors block",
//                           selectedCategory === cat
//                             ? "bg-[#2E37A4]/5 text-[#2E37A4] font-bold"
//                             : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
//                         )}
//                       >
//                         {cat === "All" ? "All Categories" : cat}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Stock Status Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => toggleDropdown("status")}
//                   className={cn(
//                     "h-10 px-4 rounded-[8px] text-[13px] font-semibold flex items-center gap-2 hover:bg-muted transition-all outline-none border cursor-pointer",
//                     selectedStatus !== "All"
//                       ? "bg-[#2E37A4]/5 border-[#2E37A4] text-[#2E37A4]"
//                       : "bg-white dark:bg-[#1e293b] border-[#e2e8f0] dark:border-[#334155] text-foreground"
//                   )}
//                 >
//                   {selectedStatus === "All" ? "Stock Status" : `Status: ${selectedStatus}`}
//                   <ChevronDown className={cn("w-3.5 h-3.5", selectedStatus !== "All" ? "text-[#2E37A4]" : "text-muted-foreground")} />
//                 </button>
//                 {activeDropdown === "status" && (
//                   <div className="absolute right-0 mt-1.5 w-[180px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-xl z-50 p-1">
//                     {statuses.map((stat) => (
//                       <button
//                         key={stat}
//                         onClick={() => {
//                           setSelectedStatus(stat);
//                           setActiveDropdown(null);
//                         }}
//                         className={cn(
//                           "w-full text-left rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors block",
//                           selectedStatus === stat
//                             ? "bg-[#2E37A4]/5 text-[#2E37A4] font-bold"
//                             : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
//                         )}
//                       >
//                         {stat === "All" ? "All Statuses" : stat}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Expiry Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => toggleDropdown("expiry")}
//                   className={cn(
//                     "h-10 px-4 rounded-[8px] text-[13px] font-semibold flex items-center gap-2 hover:bg-muted transition-all outline-none border cursor-pointer",
//                     selectedExpiry !== "All"
//                       ? "bg-[#2E37A4]/5 border-[#2E37A4] text-[#2E37A4]"
//                       : "bg-white dark:bg-[#1e293b] border-[#e2e8f0] dark:border-[#334155] text-foreground"
//                   )}
//                 >
//                   {selectedExpiry === "All" ? "Expiry Range" : `Expiry: ${selectedExpiry}`}
//                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("ml-1", selectedExpiry !== "All" ? "text-[#2E37A4]" : "text-muted-foreground")}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
//                 </button>
//                 {activeDropdown === "expiry" && (
//                   <div className="absolute right-0 mt-1.5 w-[180px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-xl z-50 p-1">
//                     {expiries.map((exp) => (
//                       <button
//                         key={exp}
//                         onClick={() => {
//                           setSelectedExpiry(exp);
//                           setActiveDropdown(null);
//                         }}
//                         className={cn(
//                           "w-full text-left rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors block",
//                           selectedExpiry === exp
//                             ? "bg-[#2E37A4]/5 text-[#2E37A4] font-bold"
//                             : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
//                         )}
//                       >
//                         {exp === "All" ? "Any Date" : exp}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {(search || selectedCategory !== "All" || selectedStatus !== "All" || selectedExpiry !== "All") && (
//                 <button
//                   onClick={handleClearFilters}
//                   className="text-[13px] font-bold text-[#2E37A4] hover:text-[#232a7d] px-2 transition-all cursor-pointer outline-none"
//                 >
//                   Clear Filters
//                 </button>
//               )}

//             </div>

//           </div>

//           {/* Lab Items Table Card */}
//           <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       Item Name
//                     </th>
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       SKU Code
//                     </th>
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       Quantity
//                     </th>
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       Expiry
//                     </th>
//                     <th className="px-8 py-3.5 text-left text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       STATUS
//                     </th>
//                     <th className="px-8 py-3.5 text-right text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">
//                       ACTION
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
//                   {filteredItems.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="px-8 py-16 text-center text-[#64748b] font-bold text-[12px] opacity-60">
//                         No matching items found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-muted/10 transition-all group">
//                         <td className="px-8 py-4">
//                           <button
//                             onClick={() => onViewItem(item)}
//                             className="text-[13px] font-bold text-[#1e293b] dark:text-white hover:text-[#2E37A4] dark:hover:text-[#4f5bd5] no-underline hover:no-underline focus:no-underline leading-tight text-left outline-none cursor-pointer"
//                           >
//                             {item.name}
//                           </button>
//                         </td>
//                         <td className="px-8 py-4">
//                           <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-bold">
//                             {item.sku}
//                           </div>
//                         </td>
//                         <td className="px-8 py-4">
//                           <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">
//                             {item.category}
//                           </div>
//                         </td>
//                         <td className="px-8 py-4">
//                           <div className="text-[13px] text-[#1e293b] dark:text-white font-bold">
//                             {item.qty}
//                           </div>
//                         </td>
//                         <td className="px-8 py-4">
//                           <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-bold">
//                             {formatDateToDDMMYYYY(item.expiry)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-4">
//                           <span className={cn(
//                             "inline-flex px-2.5 py-1 rounded-[5px] text-[11px] font-extrabold border leading-none items-center justify-center uppercase tracking-wider",
//                             item.status === "In Stock" && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/50 dark:border-emerald-900/30",
//                             item.status === "LOW" && "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200/50 dark:border-amber-900/30",
//                             item.status === "Out of Stock" && "bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/50 dark:border-rose-900/30",
//                           )}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-4 text-right">
//                           <div className="flex items-center justify-end gap-1">
//                             <button
//                               onClick={() => { setSelectedItem(item); setModalType("edit"); }}
//                               className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
//                               title="Edit"
//                             >
//                               <Edit3 className="w-4 h-4 text-blue-500" />
//                             </button>
//                             <button
//                               onClick={() => onViewItem(item)}
//                               className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
//                               title="View"
//                             >
//                               <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteItem(item)}
//                               className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4 text-red-500" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Edit / Add Modal Dialog Overlay */}
//       <Dialog open={modalType === "edit" || modalType === "add"} onOpenChange={(open) => { if (!open) { setModalType(null); setSelectedItem(null); } }}>
//         <CustomDialogContent className="max-w-4xl w-[95vw] p-0 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] flex flex-col gap-0 overflow-hidden shadow-2xl">
//           <div className="flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#334155] px-5 py-3.5 bg-white dark:bg-[#1e293b]">
//             <h3 className="text-[15px] font-bold text-foreground">
//               {modalType === "edit" ? "Edit Item" : "Add New Item"}
//             </h3>
//             <button onClick={() => { setModalType(null); setSelectedItem(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
//             </button>
//           </div>

//           <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
//             {/* Form Content Body with Subcards (Scrollbar-free fixed single page view) */}
//             <div className="p-5 bg-[#F8F9FC] dark:bg-[#0A0F1D] overflow-hidden flex-1">

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                 {/* Left Column (Basic Info & Stock Details) */}
//                 <div className="md:col-span-2 space-y-4">

//                   {/* Basic Information Subcard */}
//                   <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-3">
//                     <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Basic Information</h4>

//                     <div className="space-y-1.5">
//                       <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Item Name <span className="text-red-500">*</span></label>
//                       <input
//                         type="text"
//                         required
//                         placeholder="e.g. Reagent A (Hematology)"
//                         className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                         defaultValue={modalType === "edit" ? selectedItem?.name : ""}
//                         name="name"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div className="space-y-1.5">
//                         <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">SKU Code <span className="text-red-500">*</span></label>
//                         <input
//                           type="text"
//                           required
//                           placeholder="e.g. HEM-001"
//                           className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                           defaultValue={modalType === "edit" ? selectedItem?.sku : ""}
//                           name="sku"
//                         />
//                       </div>
//                       <div className="space-y-1.5">
//                         <div className="flex justify-between items-center">
//                           <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
//                           <button type="button" className="text-[11px] font-bold text-[#2E37A4] hover:underline">+ Add Category</button>
//                         </div>
//                         <select
//                           className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                           defaultValue={modalType === "edit" ? selectedItem?.category : ""}
//                           name="category"
//                           required
//                         >
//                           <option value="" disabled>Select Category</option>
//                           <option value="Reagents">Reagents</option>
//                           <option value="Consumables">Consumables</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Stock Details Subcard */}
//                   <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-3">
//                     <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Stock Details</h4>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div className="space-y-1.5">
//                         <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Initial Quantity <span className="text-red-500">*</span></label>
//                         <input
//                           type="number"
//                           required
//                           placeholder="0"
//                           className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                           defaultValue={modalType === "edit" ? parseFloat(selectedItem?.qty) || 0 : ""}
//                           name="qtyVal"
//                         />
//                       </div>
//                       <div className="space-y-1.5">
//                         <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Unit <span className="text-red-500">*</span></label>
//                         <select
//                           className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                           defaultValue={modalType === "edit" ? (selectedItem?.qty.includes("Boxes") ? "Boxes" : "Bottles") : ""}
//                           name="qtyUnit"
//                           required
//                         >
//                           <option value="" disabled hidden>e.g. Bottles, Boxes</option>
//                           <option value="Boxes">Boxes</option>
//                           <option value="Bottles">Bottles</option>
//                           <option value="Vials">Vials</option>
//                           <option value="Packs">Packs</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-3">
//                       <div className="space-y-1.5">
//                         <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Minimum Threshold</label>
//                         <input
//                           type="text"
//                           placeholder="Alert below quantity"
//                           className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                           defaultValue={modalType === "edit" ? selectedItem?.minThreshold || "" : ""}
//                           name="minThreshold"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column (Additional Information Subcard) */}
//                 <div className="md:col-span-1">
//                   <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-3 h-full flex flex-col">
//                     <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Additional Information</h4>

//                     <div className="space-y-1.5">
//                       <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Supplier</label>
//                       <input
//                         type="text"
//                         placeholder="Enter here..."
//                         className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                         defaultValue={modalType === "edit" ? selectedItem?.supplier || "" : ""}
//                         name="supplier"
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Expiry Date</label>
//                       <input
//                         type="date"
//                         max="9999-12-31"
//                         className="w-full h-9 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground"
//                         defaultValue={modalType === "edit" ? formatDateToYYYYMMDD(selectedItem?.expiry) : ""}
//                         name="expiry"
//                       />
//                     </div>

//                     <div className="space-y-1.5 flex-1 flex flex-col">
//                       <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Notes</label>
//                       <textarea
//                         placeholder="Add any internal notes here..."
//                         className="w-full px-3 py-2 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground resize-none h-[95px] flex-1"
//                         defaultValue={modalType === "edit" ? selectedItem?.notes || "" : ""}
//                         name="notes"
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </div>

//             </div>

//             {/* Action Buttons Footer */}
//             <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shrink-0">
//               <button
//                 type="button"
//                 onClick={() => { setModalType(null); setSelectedItem(null); }}
//                 className="h-9 px-5 rounded-[5px] border border-red-500 bg-white hover:bg-red-50 text-[12px] font-bold text-red-500 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="h-9 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer border border-[#2E37A4]"
//               >
//                 Save Item
//               </button>
//             </div>
//           </form>
//         </CustomDialogContent>
//       </Dialog>
//     </div>
//   );
// }
