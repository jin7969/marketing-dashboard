interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-50 p-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-30"
      >
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 rounded-lg text-sm transition-colors ${
            currentPage === page ? 'bg-blue-600 font-bold text-white' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
}
