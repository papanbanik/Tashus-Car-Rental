'use client';

import { BREAKDOWN_FILTERS, STATUS_FILTERS } from '../utils/lists/outstanding-dues.list';
import { SortField, SortOrder } from '../types/outstanding-dues.type';
import { getSortLabel } from '../utils/functions/outstanding-dues.function';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  breakdownFilter: string;
  setBreakdownFilter: (v: string) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onResetSort?: () => void;
  onClear: () => void;
}

interface ActiveChipProps {
  label: string;
  onRemove: () => void;
}

const ActiveChip = ({ label, onRemove }: ActiveChipProps) => (
  <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="ml-0.5 text-primary hover:text-purple-900 leading-none" aria-label={`Remove ${label} filter`}>
      ✕
    </button>
  </span>
);

const OutstandingDuesFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  breakdownFilter,
  setBreakdownFilter,
  sortField = 'reservationId',
  sortOrder = 'desc',
  onResetSort,
  onClear,
}: Props) => {
  const activeStatusLabel = STATUS_FILTERS.find((f) => f.value === statusFilter && f.value !== '')?.label;
  const activeBreakdownLabel = BREAKDOWN_FILTERS.find((f) => f.value === breakdownFilter && f.value !== '')?.label;

  const isCustomSort = sortField !== 'reservationId' || sortOrder !== 'desc';
  const hasActiveFilters = !!search || !!statusFilter || !!breakdownFilter || isCustomSort;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Search row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search by Reservation ID</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. 2600XXX"
              className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                ✕
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onClear}
          disabled={!hasActiveFilters}
          className={`border rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
            hasActiveFilters
              ? 'border-primary bg-primary text-white hover:bg-purple-700 cursor-pointer'
              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Reset
        </button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-400 font-medium">Active filters & sort:</span>
          {search && <ActiveChip label={`ID: ${search}`} onRemove={() => setSearch('')} />}
          {activeStatusLabel && <ActiveChip label={`Status: ${activeStatusLabel}`} onRemove={() => setStatusFilter('')} />}
          {activeBreakdownLabel && <ActiveChip label={`Due type: ${activeBreakdownLabel}`} onRemove={() => setBreakdownFilter('')} />}
          {isCustomSort && onResetSort && <ActiveChip label={`Sort: ${getSortLabel({ sortField, sortOrder })}`} onRemove={onResetSort} />}
        </div>
      )}
    </div>
  );
};

export default OutstandingDuesFilters;
