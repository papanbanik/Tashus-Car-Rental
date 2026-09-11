'use client';

import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { EReservationStatus } from '@/types/travels/travelEnums';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useOutstandingDues } from '../hooks/useOutstandingDues';
import OutstandingDuesSummaryCard from './OutstandingDuesSummaryCard';
import OutstandingDuesFilters from './OutstandingDuesFilters';
import OutstandingDuesTable from './OutstandingDuesTable';
import OutstandingDuesPagination from './OutstandingDuesPagination';

const OutstandingDues = () => {
  const {
    userCred: { userId },
  } = useUserCredContext() as any;

  const {
    data,
    isLoading,
    isError,
    filteredAndSorted,
    paginated,
    search,
    setSearch,
    breakdownFilter,
    setBreakdownFilter,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    handleSort,
    handleClear,
  } = useOutstandingDues(userId);

  const { totalOutstandingDues = 0, outstandingDuesList = [] } = data ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Outstanding <span className="text-primary">Dues</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Showing active, non-expired reservations only. Cancelled or expired payments are excluded.</p>
        </div>
        {/* Summary Cards */}
        <OutstandingDuesSummaryCard totalOutstandingDues={totalOutstandingDues} totalReservations={outstandingDuesList?.length} />
        {/* Search Filter bar */}
        <OutstandingDuesFilters
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(0);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(v) => {
            setStatusFilter(v);
            setPage(0);
          }}
          breakdownFilter={breakdownFilter}
          setBreakdownFilter={(v) => {
            setBreakdownFilter(v);
            setPage(0);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onResetSort={() => {
            setSortField('reservationId');
            setSortOrder('desc');
            setPage(0);
          }}
          onClear={handleClear}
        />

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-gray-400 animate-pulse">Loading outstanding dues…</div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">Failed to load dues. Please try again.</div>
          ) : (
            <>
              {filteredAndSorted.length === 0 && !isLoading ? (
                <div className="py-16 text-center">
                  <p className="text-lg font-medium text-gray-400">No results found</p>
                  <p className="text-sm text-gray-400 mt-1">Your filters returned no outstanding dues.</p>
                </div>
              ) : (
                <>
                  <OutstandingDuesTable
                    data={paginated}
                    sortConfig={{ field: sortField, order: sortOrder }}
                    onSort={handleSort}
                    breakdownFilter={breakdownFilter}
                    setBreakdownFilter={(v) => {
                      setBreakdownFilter(v);
                      setPage(0);
                    }}
                    statusFilter={statusFilter}
                    setStatusFilter={(v) => {
                      setStatusFilter(v);
                      setPage(0);
                    }}
                  />
                  {filteredAndSorted.length > 0 && (
                    <OutstandingDuesPagination
                      page={page}
                      rowsPerPage={rowsPerPage}
                      totalCount={filteredAndSorted.length}
                      onPageChange={setPage}
                      onRowsPerPageChange={setRowsPerPage}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutstandingDues;
