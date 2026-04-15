import { Plus } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex justify-between items-center mb-[20px]">
      <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">Admin Dashboard</h1>
      <button className="bg-[#2D3A8C] text-white px-4 py-2 rounded-[5px] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#242f70] transition-all">
        <Plus className="w-4 h-4" /> New Branch
      </button>
    </div>
  );
}
