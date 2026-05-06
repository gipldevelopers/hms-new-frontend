"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Paperclip,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-11 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none w-full"
          style={{ minWidth }}
        >
          <span className="truncate text-foreground">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-border bg-card p-1 rounded-lg shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-muted dark:hover:bg-muted/50"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id;
  const [noteType, setNoteType] = useState("progress");
  const [reason, setReason] = useState("");
  const editorRef = React.useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `
        <p>Patient is responding well to IV antibiotics. Fever has subsided.</p>
        <p><br></p>
        <p>Chest X-ray scheduled for tomorrow morning.</p>
        <p><br></p>
        <p>Plan: Continue current antibiotic regimen. Monitor vitals every 4 hours. Encourage oral fluid intake.</p>
      `;
    }
  }, []);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const noteTypeOptions = [
    { label: "Progress Note", value: "progress" },
    { label: "Nursing Note", value: "nursing" },
    { label: "Admission Note", value: "admission" },
  ];

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="bg-card border border-border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-none">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
               <span>Robert Chen</span>
               <span>/</span>
               <span>Notes</span>
             </div>
             <h1 className="text-[18px] font-bold text-foreground leading-none mt-1">Edit Progress Note</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => router.back()}
            className="flex-1 sm:flex-none h-10 px-6 bg-card border border-destructive text-destructive rounded-lg text-[13px] font-bold hover:bg-destructive/5 transition-all shadow-none"
          >
            Cancel
          </button>
          <button className="flex-1 sm:flex-none h-10 px-6 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Form Section ── */}
      <div className="bg-card border border-border p-6 rounded-lg shadow-none space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[13px] font-bold text-foreground">Note Type</label>
              <CustomSelect 
                value={noteType}
                onChange={setNoteType}
                placeholder="Add Note type"
                options={noteTypeOptions}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[13px] font-bold text-foreground">Date & Time (Auto)</label>
              <input 
                type="text"
                value="Today, 09:30 AM"
                disabled
                className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-muted-foreground outline-none"
              />
           </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold text-foreground">Note Content</label>
              <span className="text-[11px] font-medium text-muted-foreground">Last saved: 2 mins ago</span>
           </div>
           <div className="border border-border rounded-lg overflow-hidden">
              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-muted/30 border-b border-border">
                 <ToolbarButton icon={Bold} onClick={() => handleCommand('bold')} />
                 <ToolbarButton icon={Italic} onClick={() => handleCommand('italic')} />
                 <ToolbarButton icon={Underline} onClick={() => handleCommand('underline')} />
                 <div className="w-[1px] h-4 bg-border mx-1" />
                 <ToolbarButton icon={List} onClick={() => handleCommand('insertUnorderedList')} />
                 <ToolbarButton icon={ListOrdered} onClick={() => handleCommand('insertOrderedList')} />
                 <div className="w-[1px] h-4 bg-border mx-1" />
                 <ToolbarButton icon={Paperclip} onClick={() => {}} />
              </div>
              <div 
                ref={editorRef}
                contentEditable={true}
                placeholder="Add your Note Content..."
                className="w-full min-h-[300px] p-5 text-[14px] font-medium text-muted-foreground outline-none resize-none bg-card prose prose-sm max-w-none focus:ring-0"
              />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[13px] font-bold text-foreground">Reason for Edit (Optional)</label>
           <input 
             type="text"
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             placeholder="e.g., Added omitted details regarding treatment plan..."
             className="w-full h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium text-muted-foreground outline-none focus:border-primary transition-all"
           />
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, onClick }) {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-muted text-muted-foreground transition-all"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
