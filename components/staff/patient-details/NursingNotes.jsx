"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Paperclip, MoreVertical, User, Bot, Check, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function NursingNotes({ patientId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [attachedFileUrl, setAttachedFileUrl] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");

  const fileInputRef = useRef(null);

  const fetchNotes = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/patients/${patientId}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setNotes(result.data);
        }
      }
    } catch (e) {
      console.error("Error fetching notes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/gvoice/file", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status && result.data?.url) {
          setAttachedFileUrl(result.data.url);
          setAttachedFileName(file.name);
        } else {
          toast.error("File upload failed: " + (result.message || "Unknown error"));
        }
      } else {
        toast.error("File upload failed with status " + res.status);
      }
    } catch (err) {
      console.error("File upload error:", err);
      toast.error("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    if (!patientId) return;

    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/patients/${patientId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newNote,
          fileUrl: attachedFileUrl || null
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setNotes(prev => [result.data, ...prev]);
          setNewNote("");
          setAttachedFileUrl("");
          setAttachedFileName("");
          toast.success("Note saved successfully!");
        } else {
          toast.error("Failed to save note: " + (result.error || "Unknown error"));
        }
      } else {
        toast.error("Failed to save note with status " + res.status);
      }
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error("Error saving note.");
    }
  };

  const handleAction = (note) => {
    toast.info(`Options for note by ${note.authorName}`);
  };

  // Generate dynamic role filter options
  const uniqueRoles = Array.from(new Set(notes.map(n => n.authorRole).filter(Boolean)));
  const roleOptions = ["All", ...uniqueRoles];

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "All" || n.authorRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyles = (role) => {
    if (!role) return "bg-muted text-muted-foreground border-transparent";
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("doctor") || lowerRole.includes("cardiologist") || lowerRole.includes("surgeon")) {
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
    if (lowerRole.includes("nurse") || lowerRole.includes("staff")) {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };
  
  const getRoleIconStyles = (role) => {
    if (!role) return { bg: "bg-muted", text: "text-muted-foreground" };
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("doctor") || lowerRole.includes("cardiologist") || lowerRole.includes("surgeon")) {
      return { bg: "bg-purple-500/10", text: "text-purple-500" };
    }
    if (lowerRole.includes("nurse") || lowerRole.includes("staff")) {
      return { bg: "bg-emerald-500/10", text: "text-emerald-500" };
    }
    return { bg: "bg-blue-500/10", text: "text-blue-500" };
  };

  const formatNoteTime = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Header Utilities */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-foreground leading-none">Nursing & Clinical Notes</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-lg text-[12px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none">
                {filterRole === "All" ? "All Roles" : filterRole}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-card border border-border rounded-lg p-1 shadow-none z-50">
              {roleOptions.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterRole === role
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted"
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
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-none p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[14px] font-bold text-foreground">New Note</h4>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md">Draft</span>
        </div>
        <textarea 
          placeholder="Enter clinical notes, observations, or handover instructions here..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full min-h-[160px] p-4 bg-transparent border border-border rounded-lg text-[14px] outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none text-foreground placeholder:text-muted-foreground"
        />

        {/* Attachment Preview (if any) */}
        {attachedFileUrl && (
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border text-[12px] font-semibold text-muted-foreground w-fit">
            <Paperclip className="w-3.5 h-3.5 text-primary" />
            <span className="truncate max-w-[250px]">{attachedFileName}</span>
            <button 
              onClick={() => { setAttachedFileUrl(""); setAttachedFileName(""); }}
              className="text-destructive hover:text-destructive/80 transition-colors ml-1 font-bold"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="h-10 px-4 bg-transparent border border-border rounded-lg text-[12px] font-bold text-muted-foreground flex items-center gap-2 hover:bg-muted transition-all shadow-none disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Uploading...
                </>
              ) : (
                <>
                  <Paperclip className="w-4 h-4" /> Attach File
                </>
              )}
            </button>
          </div>
          <button 
            onClick={handleSaveNote}
            disabled={!newNote.trim() || uploading}
            className="h-10 px-8 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-all shadow-none disabled:opacity-50"
          >
            Save Notes
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {loading && (
          <div className="p-10 flex justify-center items-center text-muted-foreground">
            <Loader2 className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3" />
            <span>Loading notes...</span>
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div className="p-12 rounded-lg border border-border border-dashed flex flex-col items-center justify-center text-center bg-card">
            <Bot className="w-10 h-10 text-muted-foreground/30 mb-2" />
            <p className="text-sm font-bold text-foreground">No notes recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add a new note to start the conversation.</p>
          </div>
        )}

        {!loading && filteredNotes.map((note, idx) => {
          const badgeStyles = getRoleBadgeStyles(note.authorRole);
          const iconStyles = getRoleIconStyles(note.authorRole);
          return (
            <div key={note.id || idx} className="bg-card p-6 rounded-lg border border-border shadow-none space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconStyles.bg)}>
                    <User className={cn("w-5 h-5", iconStyles.text)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <p className="text-[14px] font-bold text-foreground">{note.authorName}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border",
                        badgeStyles
                      )}>
                        {note.authorRole}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-muted-foreground">{formatNoteTime(note.createdAt)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleAction(note)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[14px] text-foreground leading-relaxed font-normal whitespace-pre-wrap">
                {note.content}
              </p>

              {/* Attachment Link */}
              {note.fileUrl && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-primary shrink-0" />
                  <a 
                    href={note.fileUrl.includes('gvoice') ? `/api/gvoice/download?url=${encodeURIComponent(note.fileUrl)}` : note.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[12px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    View Attachment ({note.fileUrl.substring(note.fileUrl.lastIndexOf('/') + 1) || "Document"})
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
