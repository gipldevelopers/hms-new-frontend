"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Paperclip, Image, MoreVertical, User, MessageSquare, Bot, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NursingNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const roleOptions = ["All", "Nurse", "Cardiologist", "System"];

  const [notes, setNotes] = useState([
    {
      author: "Jessica Martinez, RN",
      role: "Nurse",
      roleVariant: "success",
      time: "Today at 2:15 PM",
      content: "Patient vitals remain stable. BP 120/80, HR 72, O2 sat 98%. Patient reports mild chest discomfort but denies shortness of breath. Administered prescribed pain medication. Continue monitoring cardiac rhythm. Patient is alert and oriented x3.",
      icon: User,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    },
    {
      author: "Dr. Michael Chen",
      role: "Cardiologist",
      roleVariant: "purple",
      time: "Today at 11:30 AM",
      content: "ECG review shows improving ST segments. Troponin levels trending down. Continue current medication regimen - Metoprolol 50mg BID, Atorvastatin 80mg daily. Patient cleared for progressive ambulation. Schedule echo in 48 hours.",
      icon: User,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50"
    },
    {
      author: "System Update",
      role: "System",
      roleVariant: "neutral",
      time: "Today at 8:00 AM",
      content: "Patient vitals remain stable. BP 120/80, HR 72, O2 sat 98%. Patient reports mild chest discomfort but denies shortness of breath. Administered prescribed pain medication. Continue monitoring cardiac rhythm. Patient is alert and oriented x3.",
      icon: Bot,
      iconColor: "text-gray-500",
      iconBg: "bg-gray-100"
    },
    {
      author: "Robert Kim, RN",
      role: "Night Nurse",
      roleVariant: "success",
      time: "Yesterday at 11:45 PM",
      content: "Patient vitals remain stable. BP 120/80, HR 72, O2 sat 98%. Patient reports mild chest discomfort but denies shortness of breath. Administered prescribed pain medication. Continue monitoring cardiac rhythm. Patient is alert and oriented x3.",
      icon: User,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    }
  ]);

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      author: "Current User, RN",
      role: "Nurse",
      roleVariant: "success",
      time: "Just now",
      content: newNote,
      icon: User,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    };
    
    setNotes([note, ...notes]);
    setNewNote("");
    alert("Note saved successfully!");
  };

  const handleAction = (note) => {
    alert(`Options for note by ${note.author}`);
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "All" || n.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Header Utilities */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">Nursing Notes</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none">
                {filterRole === "All" ? "All Roles" : filterRole}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
              {roleOptions.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterRole === role
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  {role === "All" ? "All Roles" : role}
                  {filterRole === role && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* New Note Editor Card */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[14px] font-bold text-[#1A1C23] dark:text-white">New Note</h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-[3px]">Draft</span>
        </div>
        <textarea 
          placeholder="Enter nursing notes, observations, or handover instructions here..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full min-h-[160px] p-4 bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[14px] outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("Attach File")}
              className="h-10 px-4 bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-bold text-[#5E6C84] dark:text-gray-400 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-none"
            >
              <Paperclip className="w-4 h-4" /> Attach File
            </button>
            <button 
              onClick={() => alert("Attach Image")}
              className="h-10 px-4 bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-bold text-[#5E6C84] dark:text-gray-400 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-none"
            >
              <Image className="w-4 h-4" /> Attach Image
            </button>
          </div>
          <button 
            onClick={handleSaveNote}
            className="h-10 px-8 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold hover:bg-[#242e70] transition-all shadow-none"
          >
            Save Notes
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note, idx) => (
          <div key={idx} className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", note.iconBg)}>
                  <note.icon className={cn("w-5 h-5", note.iconColor)} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{note.author}</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase tracking-wider",
                      note.roleVariant === "success" ? "bg-emerald-50 text-emerald-600" :
                      note.roleVariant === "purple" ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {note.role}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-gray-400">{note.time}</p>
                </div>
              </div>
              <button 
                onClick={() => handleAction(note)}
                className="text-gray-300 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[14px] text-[#1A1C23] dark:text-gray-300 leading-relaxed font-normal">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
