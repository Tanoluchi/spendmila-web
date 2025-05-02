import React from 'react';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalTransactions: number;
  visibleTransactions: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalTransactions,
  visibleTransactions,
  onPageChange,
  onPageSizeChange
}) => {
  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = [];
    const maxButtonsToShow = 5;
    
    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
        aria-label="Previous page"
      >
        &laquo;
      </button>
    );
    
    // First page button if not starting from page 1
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md hover:bg-muted/80"
        >
          1
        </button>
      );
      
      // Ellipsis if there's a gap
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-purple-600 text-white'
              : 'hover:bg-muted/80'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Ellipsis if there's a gap to the last page
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }
    
    // Last page button if not ending on the last page
    if (endPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-muted/80"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
        aria-label="Next page"
      >
        &raquo;
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={onPageSizeChange}
          className="bg-background dark:text-gray-200 border border-input rounded-md px-2 py-1 text-sm"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>per page</span>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {visibleTransactions} of {totalTransactions} transactions
      </div>
      
      <div className="flex gap-1 dark:text-gray-200">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default TransactionPagination;
