'use client';

interface Props {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const OutstandingDuesPagination = ({ page, rowsPerPage, totalCount, onPageChange, onRowsPerPageChange }: Props) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const from = page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalCount}</span> results
      </p>
      <div className="flex items-center gap-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { onRowsPerPageChange(Number(e.target.value)); onPageChange(0); }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(0)}
            className="px-2 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            «
          </button>
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="px-2 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ‹
          </button>
          <span className="px-3 py-1 text-sm font-medium text-[#800080]">
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="px-2 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ›
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(totalPages - 1)}
            className="px-2 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutstandingDuesPagination;
