"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft,
  Plus, 
  Trash2, 
  GripVertical,
  Image as ImageIcon,
  User,
  Activity,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Signature,
  FileText,
  Save,
  ChevronDown,
  Monitor,
  Check,
  Upload,
  Clock,
  Calendar,
  Mail,
  MoreVertical,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { PromptModal } from "@/components/ui/prompt-modal";

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

const TEMPLATE_BLOCKS = [
  { id: "header", label: "Logo & Header", icon: ImageIcon, description: "Hospital identity, logo, and document header." },
  { id: "patient", label: "Patient Details", icon: User, description: "Auto-populated basic patient demographics." },
  { id: "vitals", label: "Vitals & Bio", icon: Activity, description: "Table showing patient pulse, BP, and temperature." },
  { id: "diagnosis", label: "Diagnosis Block", icon: Stethoscope, description: "Section for multi-line clinical diagnoses." },
  { id: "medicine", label: "Medicines Table", icon: ClipboardList, description: "Automated list for dosages and medications." },
  { id: "lab", label: "Lab Results", icon: FlaskConical, description: "Dynamic results from diagnostic reports." },
  { id: "signature", label: "Signatures", icon: Signature, description: "Space for authenticated doctor digital signs." },
  { id: "text", label: "Rich Text Area", icon: FileText, description: "Customizable text section with formatting." },
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
        <div className="w-8 h-8 rounded-[5px] bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
           <type.icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-[11px] font-bold text-gray-500">{type.label}</span>
      </div>
      <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary" />
    </div>
  );
}

function SortableBlock({ block, onRemove, onUpdate, onTypeChange }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockTypeInfo = TEMPLATE_BLOCKS.find(b => b.id === block.type) || TEMPLATE_BLOCKS[7];
  const BlockIcon = blockTypeInfo.icon;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 transition-all flex flex-col gap-6 relative",
        isDragging && "opacity-50 z-50"
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
                placeholder={`Enter section title...`}
                className="w-full h-10 px-0 bg-transparent border-none text-[18px] font-bold text-[#1e293b] dark:text-white focus:ring-0 placeholder:text-gray-300"
                value={block.label}
                onChange={(e) => onUpdate(block.id, 'label', e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-[#F8F9FC] dark:bg-[#101935] px-3 py-1.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:border-primary/30 transition-all outline-none group focus:border-primary">
                 <BlockIcon className="w-3.5 h-3.5 text-primary" />
                 <span className="text-[10px] font-bold text-primary tracking-[2px]">{block.type}</span>
                 <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] dark:bg-[#101935] dark:border-white/10 p-1 shadow-2xl">
                {TEMPLATE_BLOCKS.map((t) => (
                  <DropdownMenuItem 
                    key={t.id} 
                    onClick={() => onTypeChange(block.id, t.id)}
                    className="flex items-center gap-3 px-3 py-2 text-[12px] font-semibold cursor-pointer rounded-[5px]"
                  >
                    <t.icon className={cn("w-4 h-4", block.type === t.id ? "text-primary" : "text-gray-400")} />
                    <span className="capitalize">{t.label}</span>
                    {block.type === t.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Block Specific Content */}
          <div className="min-h-[60px] mb-2">
             {block.type === 'header' ? (
               <div className="flex items-start gap-6 animate-in slide-in-from-top-2 duration-300">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-[5px] border-2 border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all overflow-hidden relative shrink-0"
                  >
                    {logoPreview ? (
                       <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-300" />
                        <span className="text-[9px] font-bold text-gray-400">Logo</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-400">Hospital Name</label>
                           <input type="text" placeholder="GVoice Medical Center" className="w-full h-9 px-3 bg-[#F8F9FC] dark:bg-[#1e293b]/50 border border-gray-100 dark:border-white/5 rounded-[5px] text-[12px] font-semibold outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-400">Contact Info</label>
                           <input type="text" placeholder="+91 99999 00000" className="w-full h-9 px-3 bg-[#F8F9FC] dark:bg-[#1e293b]/50 border border-gray-100 dark:border-white/5 rounded-[5px] text-[12px] font-semibold outline-none focus:border-primary" />
                        </div>
                     </div>
                     <textarea placeholder="Hospital Address Line 1..." className="w-full h-16 p-3 bg-[#F8F9FC] dark:bg-[#1e293b]/50 border border-gray-100 dark:border-white/5 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary resize-none" />
                  </div>
               </div>
             ) : (
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-primary/20 rounded-[5px] border border-primary/20 text-primary animate-in fade-in duration-500">
                  <span className="text-[12px] font-medium italic">{blockTypeInfo.description}</span>
               </div>
             )}
          </div>

          <div className="flex items-center gap-8 pt-6 border-t border-gray-50 dark:border-white/5">
            <div className="flex-1 flex gap-4">
               {block.type === 'patient' && (
                 <div className="flex gap-2">
                   {[
                     { l: 'MRN', i: '#' }, 
                     { l: 'Gender', i: 'M/F' }, 
                     { l: 'Category', i: 'Mail' }
                    ].map(f => (
                     <div key={f.l} className="px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-[5px] text-[10px] font-bold text-gray-400 flex items-center gap-1.5 border border-gray-100 dark:border-white/5 tracking-tighter">
                       <Check className="w-3 h-3 text-emerald-500" /> {f.l}
                     </div>
                   ))}
                 </div>
               )}
               {block.type === 'vitals' && (
                 <div className="flex gap-2 text-[10px] text-gray-400 font-bold tracking-tight">
                    <Check className="w-3 h-3 text-indigo-500 inline mr-1" /> Dynamic Pulse/BP/Temp tracking enabled
                 </div>
               )}
            </div>
            
            <button 
              onClick={() => onRemove(block.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove Block"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
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
        isOver && "bg-primary/5 dark:bg-primary/10 p-2 rounded-[5px] border-2 border-dashed border-primary/20"
      )}
    >
      {children}
    </div>
  );
}

export default function CreateTemplatePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempCode, setTempCode] = useState("");
  const [tempCategory, setTempCategory] = useState("prescription");
  const [categories, setCategories] = useState(["prescription", "discharge", "lab"]);
  const [blocks, setBlocks] = useState([
    { id: "block-1", type: "header", label: "Hospital Header" }
  ]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      fetchTemplate();
    }
  }, [editId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/templates/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Could not find template");
      const data = await res.json();
      setTempName(data.name);
      setTempCode(data.code);
      setTempCategory(data.category);
      if (!categories.includes(data.category)) {
        setCategories(prev => [...prev, data.category]);
      }
      setBlocks(data.blocks);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const addBlock = (type = TEMPLATE_BLOCKS[0].id) => {
    const blockType = TEMPLATE_BLOCKS.find(b => b.id === type) || TEMPLATE_BLOCKS[0];
    setBlocks([...blocks, { id: `block-${Date.now()}`, type, label: blockType.label }]);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Toolkit to list drop
    const isToolkitItem = active.data.current?.isToolkitItem;
    if (isToolkitItem) {
      addBlock(active.data.current.type);
      return;
    }

    // List reordering
    if (active.id !== over.id) {
       setBlocks((items) => {
         const oldIndex = items.findIndex((i) => i.id === active.id);
         const newIndex = items.findIndex((i) => i.id === over.id);
         if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
         }
         return items;
       });
    }
  };

  const removeBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const updateBlock = (id, key, value) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const handleTypeChange = (id, newType) => {
    const blockType = TEMPLATE_BLOCKS.find(b => b.id === newType);
    setBlocks(blocks.map(b => b.id === id ? { ...b, type: newType, label: blockType.label } : b));
  };

  const handleSave = async () => {
    if (!tempName || !tempCode) {
      toast.error("Please provide a name and unique code.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editId 
        ? `/api/templates/${editId}`
        : "/api/templates";
      
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: tempName,
          code: tempCode,
          category: tempCategory,
          blocks: blocks
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save template");

      toast.success(editId ? "Template updated!" : "Document Template saved to library!");
      window.location.href = '/super-admin/configurations/templates';
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = (name) => {
    const cat = name.toLowerCase();
    if (!categories.includes(cat)) {
      setCategories([...categories, cat]);
      setTempCategory(cat);
      toast.success(`'${name}' added to categories.`);
    } else {
      toast.warning("Category already exists.");
      setTempCategory(cat);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (cat) => {
    if (categories.length > 1) {
      const newCats = categories.filter(c => c !== cat);
      setCategories(newCats);
      if (tempCategory === cat) {
        setTempCategory(newCats[0]);
      }
      toast.info(`'${cat}' removed.`);
    } else {
      toast.error("Cannot delete the last category.");
    }
  };

  const activeTool = activeId?.toString().startsWith('toolkit-') 
    ? TEMPLATE_BLOCKS.find(t => `toolkit-${t.id}` === activeId) 
    : null;
  
  const activeBlock = activeId && !activeId.toString().startsWith('toolkit-') 
    ? blocks.find(b => b.id === activeId) 
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
              href="/super-admin/configurations/templates"
              className="w-10 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 bg-white dark:bg-[#101935]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">
              {editId ? "Edit Document Template" : "Document Builder Studio"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              disabled={loading}
              onClick={handleSave}
              className="bg-primary text-white px-8 py-2.5 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 border border-primary/20"
            >
              <Save className="w-4 h-4" /> {loading ? "Saving..." : (editId ? "Update Template" : "Publish Template")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 space-y-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">Template Info</h3>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400">Display Name</label>
                <input type="text" placeholder="e.g. Discharge Summary" className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold focus:border-primary outline-none placeholder:text-gray-300 transition-all font-semibold" value={tempName} onChange={(e) => setTempName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400">Internal Code</label>
                  <input type="text" placeholder="e.g. RX_01" className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-semibold focus:border-primary outline-none placeholder:text-gray-300 transition-all font-mono" value={tempCode} onChange={(e) => setTempCode(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-gray-400">Category</label>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline tracking-tighter"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between focus:border-primary outline-none hover:border-primary/30 transition-all group shadow-sm shadow-primary/5">
                      <span className="capitalize">{tempCategory}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] dark:bg-[#101935] dark:border-white/10 p-1 shadow-2xl">
                      {categories.map((cat) => (
                        <DropdownMenuItem 
                          key={cat} 
                          onSelect={(e) => e.preventDefault()}
                          className="px-3 py-2 text-[13px] font-medium cursor-pointer flex justify-between items-center rounded-[5px] group/item"
                        >
                          <div className="flex items-center gap-2 flex-1" onClick={() => setTempCategory(cat)}>
                             <span className="capitalize">{cat}</span>
                             {tempCategory === cat && <Check className="w-4 h-4 text-primary" />}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat);
                            }}
                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition-all text-gray-400"
                          >
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#1e293b] dark:text-white border-b border-gray-100 dark:border-white/5 pb-3 mb-4">Print Blocks</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {TEMPLATE_BLOCKS.map((block) => (
                  <DraggableToolkitItem key={block.id} type={block} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between px-1 border-b border-gray-100 dark:border-white/5 pb-4">
              <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Design Document Blocks</h3>
              <span className="text-[11px] font-bold text-gray-400 underline decoration-primary decoration-2 underline-offset-4">{blocks.length} Blocks Added</span>
            </div>

            <DropZone>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                  <SortableBlock 
                    key={block.id} 
                    block={block} 
                    onRemove={removeBlock} 
                    onUpdate={updateBlock} 
                    onTypeChange={handleTypeChange}
                  />
                ))}
              </SortableContext>
            </DropZone>

            <button 
              onClick={() => addBlock()}
              className="w-full h-14 border border-dashed border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-2.5 text-gray-400 font-bold text-[13px] hover:border-primary hover:text-primary transition-all bg-white dark:bg-[#101935]/30 mt-4 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Add New Block (Header)
            </button>
          </div>
        </div>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeTool && (
            <div className="flex items-center justify-between p-3 rounded-[5px] border border-primary bg-white dark:bg-[#101935] shadow-2xl w-[300px]">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-[5px] bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <activeTool.icon className="w-4 h-4 text-primary" />
                 </div>
                 <span className="text-[11px] font-bold text-gray-400">{activeTool.label}</span>
               </div>
            </div>
          )}
          {activeBlock && (
            <div className="bg-white dark:bg-[#101935] border-2 border-primary rounded-[5px] p-6 opacity-90 shadow-2xl w-[600px]">
               <div className="flex gap-4">
                  <GripVertical className="w-5 h-5 text-primary" />
                  <span className="font-bold text-[#1e293b] dark:text-white">{activeBlock.label || "Untilted Block"}</span>
               </div>
            </div>
          )}
        </DragOverlay>

        <PromptModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleModalConfirm}
          title="Add New Category"
          label="Category Name"
          placeholder="e.g. Radiology, Billing..."
        />
      </div>
    </DndContext>
  );
}
