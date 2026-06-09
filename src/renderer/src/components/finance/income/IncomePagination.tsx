import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IncomePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function IncomePagination({
  currentPage,
  totalPages,
  onPageChange
}: IncomePaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 3; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 w-10 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
          currentPage === 1
            ? "border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed"
            : "border-gray-200 text-gray-500 hover:bg-gray-55 hover:text-gray-700 active:scale-95"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-400 font-bold">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`h-10 w-10 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-[#5B3DF5] text-white border-[#5B3DF5] shadow-md shadow-[#5B3DF5]/20"
                : "border-gray-200 text-gray-600 hover:bg-gray-55 hover:text-gray-850 active:scale-95"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 w-10 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
          currentPage === totalPages
            ? "border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed"
            : "border-gray-200 text-gray-500 hover:bg-gray-55 hover:text-gray-700 active:scale-95"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
