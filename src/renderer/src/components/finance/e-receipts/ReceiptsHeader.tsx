import React from 'react';
import { Download, Plus, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface ReceiptsHeaderProps {
  onCreateReceiptClick: () => void;
  onExportClick?: () => void;
}

export default function ReceiptsHeader({
  onCreateReceiptClick,
  onExportClick
}: ReceiptsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
          E-Receipts
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
          <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-gray-500">E-Receipts</span>
          <ChevronRight size={12} />
          <span className="text-gray-650 font-bold">All Receipts</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-start md:self-auto">
        <button 
          onClick={onExportClick}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <Download size={15} className="text-gray-400" />
          <span>Export</span>
        </button>
        <button
          onClick={onCreateReceiptClick}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Create New Receipt
        </button>
      </div>
    </div>
  );
}
