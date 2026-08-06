import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
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

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-4 text-black">
      {/* Information & Per Page Selector */}
      <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 w-full md:w-auto text-xs sm:text-sm font-semibold">
        <div className="bg-neutral-100 px-3.5 py-2 rounded-xl border border-neutral-300 flex items-center gap-1.5 text-neutral-700">
          <span>Showing</span>
          <span className="font-extrabold text-black">{startItem}-{endItem}</span>
          <span>of</span>
          <span className="font-extrabold text-black">{totalItems}</span>
          <span>cards</span>
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
          <label htmlFor="itemsPerPageSelect" className="text-xs font-bold text-neutral-700 hidden sm:inline">
            Cards per page:
          </label>
          <select
            id="itemsPerPageSelect"
            aria-label="Cards per page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-all"
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="First page"
          className="p-2 rounded-xl border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
          className="px-3 py-2 rounded-xl border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 text-xs font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-neutral-500 text-xs font-bold">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                aria-label={`Page ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                  isCurrent
                    ? 'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(250,204,21,1)]'
                    : 'bg-white border-2 border-black text-black hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          aria-label="Next page"
          className="px-3 py-2 rounded-xl border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 text-xs font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          aria-label="Last page"
          className="p-2 rounded-xl border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
