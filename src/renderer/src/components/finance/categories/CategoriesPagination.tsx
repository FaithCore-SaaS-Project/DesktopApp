import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCategoriesCount: number;
  itemName?: string;
}

export default function CategoriesPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCategoriesCount,
  itemName = 'categories'
}: CategoriesPaginationProps) {
  if (totalCategoriesCount === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCategoriesCount);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-t border-gray-100">
      {/* Index Info */}
      <p className="text-xs font-semibold text-gray-400">
        Showing <span className="text-gray-700">{startItem}</span> to{' '}
        <span className="text-gray-700">{endItem}</span> of{' '}
        <span className="text-gray-700">{totalCategoriesCount}</span> {itemName}
      </p>


      {/* Pagination Actions */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          type="button"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            currentPage === 1
              ? "border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page Buttons */}
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#5B3DF5] text-white border-[#5B3DF5] shadow-sm shadow-[#5B3DF5]/10"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-850"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            currentPage === totalPages
              ? "border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-850"
          }`}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
