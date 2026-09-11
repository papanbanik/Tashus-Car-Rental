import { useState, useMemo } from 'react';
import { OutstandingDuesItem, SortField, SortOrder } from '../types/outstanding-dues.type';
import { useFetchOutstandingDues } from './useFetchOutstandingDues';
import { completedStatuses, reservationCancelledStatuses } from '../utils/lists/outstanding-dues.list';

export const useOutstandingDues = (userId?: string) => {
  const { data, isLoading, isError } = useFetchOutstandingDues(userId ?? '');

  const [search, setSearch] = useState<string>('');
  const [breakdownFilter, setBreakdownFilter] = useState<string>(''); // 'rent' | 'additionalFee' | 'coverageFee' | 'vehicleFee' | ''
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' | 'confirmed' | 'pending' | 'completed' | 'cancelled'

  const [sortField, setSortField] = useState<SortField>('reservationId');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field as SortField);
      setSortOrder('desc');
    }
    setPage(0);
  };

  const handleClear = () => {
    setSearch('');
    setBreakdownFilter('');
    setStatusFilter('');
    setSortField('reservationId');
    setSortOrder('desc');
    setPage(0);
  };

  const filteredAndSorted: OutstandingDuesItem[] = useMemo(() => {
    let list = data?.outstandingDuesList ?? [];

    // Search by reservation ID
    if (search.trim()) {
      list = list.filter((item) => String(item.reservationId).toLowerCase().includes(search.trim().toLowerCase()));
    }

    // Status filter — 'cancelled' matches all cancelled variants, 'completed' matches all completed variants
    if (statusFilter) {
      list = list.filter((item) => {
        if (statusFilter === 'cancelled') return reservationCancelledStatuses.includes(item.reservationStatus);
        if (statusFilter === 'completed') return completedStatuses.includes(item.reservationStatus);
        return item.reservationStatus === statusFilter;
      });
    }

    // Breakdown filter — only show reservations that have that type of due > 0
    if (breakdownFilter) {
      list = list.filter((item) => (item.outStandingDuesBreakdown as any)[breakdownFilter] > 0);
    }

    // Sort
    list = [...list].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'reservationId':
          aVal = String(a.reservationId);
          bVal = String(b.reservationId);
          break;
        case 'totalOutstandingDues':
          aVal = a.transactionSummary.totalOutstandingDues;
          bVal = b.transactionSummary.totalOutstandingDues;
          break;
        case 'totalPaidAmount':
          aVal = a.transactionSummary.totalPaidAmount;
          bVal = b.transactionSummary.totalPaidAmount;
          break;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

    return list;
  }, [data, search, breakdownFilter, statusFilter, sortField, sortOrder]);

  const paginated = useMemo(
    () => filteredAndSorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredAndSorted, page, rowsPerPage]
  );

  return {
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
  };
};
