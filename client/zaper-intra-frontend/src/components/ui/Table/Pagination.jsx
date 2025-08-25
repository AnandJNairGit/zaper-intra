// src/components/ui/Table/Pagination.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, className = '' }) => {
  if (!pagination || pagination.total_pages <= 1) return null;

  const {
    page: currentPage,
    total_pages: totalPages,
    total,
    limit,
    has_prev: hasPrev,
    has_next: hasNext
  } = pagination;

  const startRecord = ((currentPage - 1) * limit) + 1;
  const endRecord = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        start = 1;
        end = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisiblePages + 1;
        end = totalPages;
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`bg-white px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Records Info */}
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{startRecord}</span>
              {' '}to{' '}
              <span className="font-medium">{endRecord}</span>
              {' '}of{' '}
              <span className="font-medium">{total}</span>
              {' '}results
            </p>
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {/* First Page */}
              {currentPage > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">First</span>
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentPage <= 3 || totalPages <= 5 ? 'rounded-l-md' : ''
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNum === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentPage >= totalPages - 2 || totalPages <= 5 ? 'rounded-r-md' : ''
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Last Page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Last</span>
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
