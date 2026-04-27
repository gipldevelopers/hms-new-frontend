"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Plus, 
  Trash2, 
  GripVertical,
  Type,
  Hash,
  Mail,
  Calendar,
  Layers,
  FileUp,
  Clock,
  CheckSquare,
  ChevronDown,
  Save,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const FIELD_TYPES = [
  { id: "text", label: "Text Field", icon: Type },
  { id: "number", label: "Number", icon: Hash },
  { id: "email", label: "Email", icon: Mail },
  { id: "date", label: "Date", icon: Calendar },
  { id: "time", label: "Time", icon: Clock },
  { id: "select", label: "Dropdown", icon: ChevronDown },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "file", label: "File", icon: FileUp },
];

function DraggableToolkitItem({ type }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolkit-${type.id}`,
    data: { type: type.id, isToolkitItem: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center justify-between p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 transition-all cursor-grab active:cursor-grabbing bg-white dark:bg-[#1e293b]",
        isDragging ? "opacity-40 border-dashed" : "hover:border-primary group"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[5px] bg-[#F4F5FB] dark:bg-[#101935] flex items-center justify-center">
           <type.icon className="w-4 h-4 text-[#2D3A8C]" />
        </div>
        <span className="text-[11px] font-bold text-gray-500">{type.label}</span>
      </div>
      <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary" />
    </div>
  );
}

function SortableField({ field, onRemove, onUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const TypeIcon = FIELD_TYPES.find(t => t.id === field.type)?.icon || Type;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 transition-all hover:border-primary/30 flex flex-col gap-6 relative shadow-none",
        isDragging && "opacity-50 z-50 shadow-2xl"
      )}
    >
      <div className="flex gap-4 items-start">
        <div 
          {...attributes} 
          {...listeners} 
          className="mt-2 text-gray-300 cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-[400px]">
              <input 
                type="text" 
                placeholder="Field Label (e.g. Hospital Name)"
                className="w-full h-10 px-0 bg-transparent border-none text-[18px] font-bold text-[#1e293b] dark:text-white focus:ring-0 placeholder:text-gray-300"
                value={field.label}
                onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-[#F8F9FC] dark:bg-[#101935] px-3 py-1.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:border-primary transition-all outline-none group/type">
                <TypeIcon className="w-3.5 h-3.5 text-[#2D3A8C]" />
                <span className="text-[10px] font-bold text-[#2D3A8C] tracking-[2px]">{field.type}</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover/type:text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] dark:bg-[#101935] dark:border-white/10 p-1">
                {FIELD_TYPES.map((type) => (
                  <DropdownMenuItem 
                    key={type.id} 
                    className="gap-3 cursor-pointer py-2 rounded-[5px]"
                    onClick={() => onUpdate(field.id, 'type', type.id)}
                  >
                    <type.icon className="w-4 h-4 text-[#2D3A8C]" />
                    <span className="text-[12px] font-medium">{type.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Special Config for list types */}
          {(field.type === 'select' || field.type === 'checkbox') && (
            <div className="mb-6 p-4 bg-amber-50/50 dark:bg-amber-900/5 border border-amber-100 dark:border-amber-900/10 rounded-[5px]">
               <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mb-2">Options (One per line)</label>
               <textarea 
                 rows={3}
                 placeholder="Option 1&#10;Option 2&#10;Option 3"
                 className="w-full bg-transparent border-none p-0 text-[13px] font-medium text-[#1e293b] dark:text-white focus:ring-0 resize-none placeholder:text-amber-200"
                 value={field.options || ""}
                 onChange={(e) => onUpdate(field.id, 'options', e.target.value)}
               />
               <p className="text-[10px] text-amber-500/60 mt-2 italic">Press enter for each new option</p>
            </div>
          )}

          <div className="flex items-center gap-8 pt-6 border-t border-gray-50 dark:border-white/5">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Input placeholder tips..."
                className="w-full h-8 px-0 bg-transparent border-none text-[13px] font-medium text-gray-500 focus:ring-0 outline-none placeholder:text-gray-300"
                value={field.placeholder}
                onChange={(e) => onUpdate(field.id, 'placeholder', e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 pr-6 border-r border-gray-100 dark:border-white/5">
                <input 
                  type="checkbox" 
                  id={`req-${field.id}`}
                  className="w-4 h-4 rounded border-gray-300 text-[#2D3A8C] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  checked={field.required}
                  onChange={(e) => onUpdate(field.id, 'required', e.target.checked)}
                />
                <label htmlFor={`req-${field.id}`} className="text-[11px] font-bold text-gray-500 cursor-pointer hover:text-primary transition-colors">Required</label>
              </div>
              
              <button 
                onClick={() => onRemove(field.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove Field"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropZone({ children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-zone",
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "space-y-3 min-h-[50px] rounded-[5px] transition-all",
        isOver && "bg-primary/5 dark:bg-primary/5 p-2 rounded-[5px] border-2 border-dashed border-primary/20 dark:border-primary/30"
      )}
    >
      {children}
    </div>
  );
}

export default function CreateMasterDataPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [fields, setFields] = useState([
    { id: "field-1", type: "text", label: "Field Name", required: false, placeholder: "Enter details..." }
  ]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for ID in URL for editing
  const getEditId = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  };

  const editId = getEditId();

  useEffect(() => {
    setIsMounted(true);
    if (editId) {
      fetchSchema();
    }
  }, [editId]);

  const fetchSchema = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/master-data/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Could not find schema");
      const data = await res.json();
      setFormName(data.name);
      setFormCode(data.code);
      setFormDesc(data.description || "");
      setFields(data.fields);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const addField = (type = "text") => {
    setFields([...fields, { id: `field-${Date.now()}`, type, label: "", required: false, placeholder: "" }]);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Toolkit to list drop (either on drop-zone or over an existing field)
    const isToolkitItem = active.data.current?.isToolkitItem;
    if (isToolkitItem) {
      addField(active.data.current.type);
      return;
    }

    // List reordering
    if (active.id !== over.id) {
       setFields((items) => {
         const oldIndex = items.findIndex((i) => i.id === active.id);
         const newIndex = items.findIndex((i) => i.id === over.id);
         if (oldIndex !== -1 && newIndex !== -1) {
           return arrayMove(items, oldIndex, newIndex);
         }
         return items;
       });
    }
  };

  const removeField = (id) => {
    if (fields.length > 1) {
      setFields(fields.filter(f => f.id !== id));
    }
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleSave = async () => {
    if (!formName || !formCode) {
      toast.error("Please provide a name and unique code.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const url = editId 
        ? `/api/master-data/${editId}`
        : "/api/master-data";
      
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formName,
          code: formCode,
          description: formDesc,
          fields: fields
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save");

      toast.success(editId ? "Schema updated!" : "Master Data Schema created!");
      window.location.href = '/super-admin/configurations/master-data';
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeTool = activeId?.toString().startsWith('toolkit-') 
    ? FIELD_TYPES.find(t => `toolkit-${t.id}` === activeId) 
    : null;
  
  const activeField = activeId && !activeId.toString().startsWith('toolkit-') 
    ? fields.find(f => f.id === activeId) 
    : null;

  if (!isMounted) return null;

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <Link 
              href="/super-admin/configurations/master-data"
              className="w-10 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 bg-white dark:bg-[#101935]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">
              {editId ? "Edit Master Data Schema" : "Create Master Data Schema"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              disabled={loading}
              onClick={() => window.location.href='/super-admin/configurations/master-data'}
              className="px-6 py-2 rounded-[5px] text-[13px] font-bold text-gray-500 hover:text-primary transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              onClick={handleSave}
              className="bg-primary text-white px-8 py-2.5 rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : (editId ? "Update Schema" : "Save Schema")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 space-y-6">
              <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">Basic Information</h3>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400">Master Data Name</label>
                <input type="text" placeholder="e.g. Hospital Master Data" className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold focus:ring-0 outline-none placeholder:text-gray-300" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400">Unique Schema Code</label>
                <input type="text" placeholder="e.g. HOSP_MD" className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold focus:ring-0 outline-none placeholder:text-gray-300" value={formCode} onChange={(e) => setFormCode(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400">Description</label>
                <textarea placeholder="..." rows={4} className="w-full px-4 py-3 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold focus:ring-0 outline-none resize-none placeholder:text-gray-300" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
              <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3 mb-4">Field Types Toolkit</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {FIELD_TYPES.map((type) => (
                  <DraggableToolkitItem key={type.id} type={type} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between px-1 border-b border-gray-100 dark:border-white/5 pb-4">
              <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Design Input Fields</h3>
              <span className="text-[11px] font-bold text-gray-400 underline decoration-primary decoration-2 underline-offset-4">{fields.length} Fields Added</span>
            </div>

            <DropZone>
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((field) => (
                  <SortableField key={field.id} field={field} onRemove={removeField} onUpdate={updateField} />
                ))}
              </SortableContext>
            </DropZone>

            <button 
              onClick={() => addField()}
              className="w-full h-14 border border-dashed border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-2.5 text-gray-400 font-bold text-[13px] hover:border-primary hover:text-primary transition-all bg-white dark:bg-[#101935]/30 mt-4 shadow-none"
            >
              <Plus className="w-4 h-4" /> Add New Field
            </button>
          </div>
        </div>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeTool && (
            <div className="flex items-center justify-between p-3 rounded-[5px] border border-primary bg-white dark:bg-[#101935] shadow-2xl w-[300px]">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-[5px] bg-[#F4F5FB] dark:bg-[#101935] flex items-center justify-center">
                    <activeTool.icon className="w-4 h-4 text-[#2D3A8C]" />
                 </div>
                 <span className="text-[11px] font-bold text-gray-400">{activeTool.label}</span>
               </div>
            </div>
          )}
          {activeField && (
            <div className="bg-white dark:bg-[#101935] border-2 border-[#2D3A8C] rounded-[5px] p-6 opacity-90 shadow-2xl w-[600px]">
               <div className="flex gap-4">
                  <GripVertical className="w-5 h-5 text-[#2D3A8C]" />
                  <span className="font-bold text-[#1e293b] dark:text-white">{activeField.label || "Untilted Field"}</span>
               </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
