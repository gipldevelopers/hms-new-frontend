"use client";

import React, { useState } from "react";
import {
  Search, Plus, Eye, Check, X, ChevronDown,
  Clock, CheckCircle2, AlertCircle, ListTodo,
  Upload, User, Calendar, Filter, Activity, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── helpers ──────────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, minWidth = "140px", icon: Icon }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-10 px-3 bg-card border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
          style={{ minWidth }}
        >
          {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="truncate flex-1 text-left font-medium">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] border border-border bg-card rounded-[var(--radius)] p-1 z-[500] shadow-none">
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer", !value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const priorityClass = (p) => ({
  HIGH:   "bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
  LOW:    "bg-muted text-muted-foreground border border-border font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
}[p] ?? "text-muted-foreground text-[11px]");

const statusBadge = (s) => ({
  "In Progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  "Pending":     "bg-muted text-muted-foreground border border-border rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  "Completed":   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
}[s] ?? "bg-muted text-muted-foreground border-border");

const dueClass = (due, status) => {
  if (status === "Completed") return "text-muted-foreground font-medium text-[13px]";
  const [h, m] = due.replace(" AM","").replace(" PM","").split(":").map(Number);
  const isPM = due.includes("PM");
  const hour = isPM && h !== 12 ? h + 12 : h;
  const now = new Date();
  const dueDate = new Date(); dueDate.setHours(hour, m, 0);
  return dueDate < now
    ? "text-destructive font-semibold text-[13px]"
    : "text-muted-foreground font-medium text-[13px]";
};

// ─── mock data ────────────────────────────────────────────────────────────────
const MOCK_TASKS = [
  { id: 1,  patient: "Robert Chen",    bed: "A-12", title: "Discharge Preparation",    priority: "MEDIUM", dueTime: "10:00 AM", assignedTo: "Sarah J.",   status: "In Progress" },
  { id: 2,  patient: "Maria Garcia",   bed: "A-14", title: "Administer Pain Medica...", priority: "LOW",    dueTime: "10:15 AM", assignedTo: "Unassigned", status: "Pending"     },
  { id: 3,  patient: "James Wilson",   bed: "A-15", title: "Check Vitals",             priority: "HIGH",   dueTime: "09:00 AM", assignedTo: "David M.",   status: "Completed"   },
  { id: 4,  patient: "Emma Thompson",  bed: "A-18", title: "Change Wound Dressing",    priority: "MEDIUM", dueTime: "11:30 AM", assignedTo: "Sarah J.",   status: "Pending"     },
  { id: 5,  patient: "William Davis",  bed: "A-21", title: "Check Vitals",             priority: "LOW",    dueTime: "08:00 AM", assignedTo: "David M.",   status: "Completed"   },
  { id: 6,  patient: "Sophia Martinez",bed: "B-15", title: "Administer Medication",    priority: "MEDIUM", dueTime: "09:15 AM", assignedTo: "Lisa R.",    status: "In Progress" },
  { id: 7,  patient: "James Wilson",   bed: "C-34", title: "Schedule Test",            priority: "HIGH",   dueTime: "10:30 AM", assignedTo: "Tom G.",     status: "Pending"     },
  { id: 8,  patient: "Emily Johnson",  bed: "D-42", title: "Review Chart",             priority: "LOW",    dueTime: "11:00 AM", assignedTo: "Sara T.",    status: "Completed"   },
  { id: 9,  patient: "Michael Brown",  bed: "E-50", title: "Update Records",           priority: "HIGH",   dueTime: "01:30 PM", assignedTo: "Rachel K.",  status: "In Progress" },
];

const PATIENTS = [
  { name: "Robert Chen",     bed: "A-12" },
  { name: "Maria Garcia",    bed: "A-14" },
  { name: "James Wilson",    bed: "A-15" },
  { name: "Emma Thompson",   bed: "A-18" },
  { name: "William Davis",   bed: "A-21" },
  { name: "Sophia Martinez", bed: "B-15" },
  { name: "Emily Johnson",   bed: "D-42" },
  { name: "Michael Brown",   bed: "E-50" },
];

const NURSES = ["Sarah Jenkins", "David Miller", "Lisa Roberts", "Tom Green", "Sara Thomas", "Rachel Kim"];

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function AddTaskModal({ onClose, onSave }) {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientOpen, setPatientOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bedLabel, setBedLabel] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("Today, 10:30 AM");
  const [assignNurse, setAssignNurse] = useState("Unassigned");
  const [nurseOpen, setNurseOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const filteredPatients = PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.bed.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPatient || !title) return;
    onSave({
      patient: selectedPatient.name,
      bed: bedLabel || selectedPatient.bed,
      title,
      priority,
      dueTime: dueDate,
      assignedTo: assignNurse === "Unassigned" ? "Unassigned" : assignNurse.split(" ")[0] + " " + assignNurse.split(" ")[1]?.[0] + ".",
      status: "Pending",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-card w-full max-w-[520px] rounded-[var(--radius)] border border-border overflow-hidden shadow-none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-[16px] font-bold text-foreground">Create New Task</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[var(--radius)] transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">

          {/* Select Patient */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Select Patient <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPatientOpen(!patientOpen)}
                className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-left flex items-center justify-between outline-none focus:border-primary transition-all shadow-none"
              >
                <span className={selectedPatient ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {selectedPatient ? `${selectedPatient.name} — Bed ${selectedPatient.bed}` : "Search by name or bed..."}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
              {patientOpen && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-none">
                  <div className="p-2 border-b border-border">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search by name or bed..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full h-9 px-3 bg-muted border border-border rounded-[var(--radius)] text-[13px] outline-none shadow-none text-foreground"
                    />
                  </div>
                  <div className="max-h-[180px] overflow-y-auto no-scrollbar">
                    {filteredPatients.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => { setSelectedPatient(p); setBedLabel(p.bed); setPatientOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-medium hover:bg-muted flex items-center justify-between"
                      >
                        <span className="text-foreground font-semibold">{p.name}</span>
                        <span className="text-[11px] text-muted-foreground font-bold">Bed {p.bed}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Administer Medication"
              className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the task..."
              rows={3}
              className="w-full px-4 py-3 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none shadow-none"
            />
          </div>

          {/* Bed Label + Priority */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Bed Label
              </label>
              <input
                type="text"
                value={bedLabel}
                onChange={(e) => setBedLabel(e.target.value)}
                placeholder="e.g. A-12"
                className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPriorityOpen(!priorityOpen)}
                  className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-left flex items-center justify-between outline-none focus:border-primary transition-all shadow-none text-foreground"
                >
                  {priority}
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
                {priorityOpen && (
                  <div className="absolute top-12 left-0 right-0 z-50 bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-none">
                    {["HIGH", "MEDIUM", "LOW"].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPriority(p); setPriorityOpen(false); }}
                        className="w-full px-4 py-2 text-left text-[13px] font-medium hover:bg-muted text-foreground"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Due Date + Assigned To */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Due date & time
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Today, 10:30 AM"
                className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Assign to nurse
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNurseOpen(!nurseOpen)}
                  className="w-full h-11 px-4 bg-muted border border-border rounded-[var(--radius)] text-[13px] font-medium text-left flex items-center justify-between outline-none focus:border-primary transition-all shadow-none text-foreground"
                >
                  <span className="truncate">{assignNurse}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
                {nurseOpen && (
                  <div className="absolute top-12 left-0 right-0 z-50 bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-none">
                    <button
                      onClick={() => { setAssignNurse("Unassigned"); setNurseOpen(false); }}
                      className="w-full px-4 py-2 text-left text-[13px] font-medium hover:bg-muted text-foreground"
                    >
                      Unassigned
                    </button>
                    {NURSES.map((n) => (
                      <button
                        key={n}
                        onClick={() => { setAssignNurse(n); setNurseOpen(false); }}
                        className="w-full px-4 py-2 text-left text-[13px] font-medium hover:bg-muted text-foreground"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="h-10 px-4 border border-border hover:bg-muted text-foreground rounded-[var(--radius)] text-[13px] font-semibold transition-all shadow-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold transition-all shadow-none"
          >
            Create Task
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");

  const priorityOptions = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ];

  const wardOptions = [
    { label: "Ward A", value: "A-" },
    { label: "Ward B", value: "B-" },
    { label: "Ward C", value: "C-" },
  ];

  const filtered = tasks.filter((t) => {
    const s = searchQuery.toLowerCase();
    const matchSearch   = t.patient.toLowerCase().includes(s) || t.title.toLowerCase().includes(s);
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    const matchStatus   = !statusFilter   || t.status   === statusFilter;
    const matchWard     = !wardFilter     || t.bed.startsWith(wardFilter);
    return matchSearch && matchPriority && matchStatus && matchWard;
  });

  const handleAddTask = (task) => {
    setTasks((prev) => [{ id: prev.length + 1, ...task }, ...prev]);
  };

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <h1 className="text-[20px] md:text-[24px] font-bold text-foreground tracking-tight leading-none">
          Tasks
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto shadow-none"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-5 bg-card text-card-foreground p-4 border border-border rounded-[var(--radius)] shadow-none">
        <div className="relative w-full sm:w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-9 pr-4 bg-background border border-border rounded-[var(--radius)] text-[13px] font-normal focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <CustomSelect value={priorityFilter} onChange={setPriorityFilter} options={priorityOptions} placeholder="Priority" minWidth="130px" icon={ListTodo} />
          <CustomSelect value={statusFilter}   onChange={setStatusFilter}   options={statusOptions}   placeholder="Status"   minWidth="130px" icon={Activity} />
          <CustomSelect value={wardFilter}     onChange={setWardFilter}     options={wardOptions}     placeholder="Ward / Bed" minWidth="135px" icon={MapPin} />
          <CustomSelect value=""               onChange={() => {}}           options={[{ label: "Today", value: "today" }, { label: "This Week", value: "week" }]} placeholder="Time" minWidth="110px" icon={Clock} />
        </div>
      </div>

      {/* ── Mobile Card View ── */}
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {filtered.map((task) => (
          <div key={task.id} className="bg-card text-card-foreground p-5 rounded-[var(--radius)] border border-border shadow-none">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[15px] font-bold text-foreground leading-tight">{task.patient}</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">{task.bed}</p>
              </div>
              <span className={cn("px-2.5 py-1 rounded-[var(--radius)] text-[11px] font-medium border inline-flex", statusBadge(task.status))}>
                {task.status}
              </span>
            </div>
            <p className="text-[13px] font-semibold text-foreground mb-3">{task.title}</p>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span className={priorityClass(task.priority)}>{task.priority}</span>
                <span className={dueClass(task.dueTime, task.status)}>{task.dueTime}</span>
              </div>
              <button
                onClick={() => router.push(`/staff/tasks/${task.id}`)}
                className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors shadow-none"
              >
                <Eye className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Table View ── */}
      <div className="hidden md:block bg-card text-card-foreground rounded-[var(--radius)] border border-border overflow-hidden shadow-none">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["Patient", "Bed", "Task Title", "Priority", "Due Time", "Assigned", "Status", "Action"].map((col, i) => (
                  <th key={i} className={cn(
                    "px-6 py-3.5 text-[12px] font-semibold text-muted-foreground",
                    i === 7 ? "text-center" : "text-left"
                  )}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((task) => (
                <tr key={task.id} className="hover:bg-muted/30 transition-all">
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-semibold text-foreground">{task.patient}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-semibold text-blue-600 dark:text-blue-400">{task.bed}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-semibold text-foreground">{task.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={priorityClass(task.priority)}>{task.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={dueClass(task.dueTime, task.status)}>{task.dueTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[13px] font-medium", task.assignedTo === "Unassigned" ? "text-muted-foreground" : "text-foreground")}>{task.assignedTo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(statusBadge(task.status))}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => router.push(`/staff/tasks/${task.id}`)}
                      className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors inline-flex text-foreground shadow-none"
                      title="View task"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground italic">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Task Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AddTaskModal onClose={() => setShowModal(false)} onSave={handleAddTask} />
        )}
      </AnimatePresence>
    </div>
  );
}
