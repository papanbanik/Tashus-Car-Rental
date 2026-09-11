'use client';

import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { OutstandingDuesItem, SortConfig } from '../types/outstanding-dues.type';
import { BREAKDOWN_FILTERS, STATUS_FILTERS } from '../utils/lists/outstanding-dues.list';
import { getStatusBadgeClass, getStatusLabel } from '../utils/functions/outstanding-dues.function';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isDevelopment } from '@/utils/Functions/randomCommonFn';

interface Props {
  data: OutstandingDuesItem[];
  sortConfig: SortConfig;
  onSort: (field: string) => void;
  breakdownFilter: string;
  setBreakdownFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

const SortIcon = ({ field, sortConfig }: { field: string; sortConfig: SortConfig }) => {
  if (sortConfig.field !== field) return <span className="ml-1 text-white/50">⇅</span>;
  return <span className="ml-1">{sortConfig.order === 'asc' ? '↑' : '↓'}</span>;
};

const AmountRow = ({ label, value }: { label: string; value: number }) => {
  if (value <= 0) return null;
  return (
    <div className="text-xs text-error font-medium">
      {label}: ${parseFloatWithPrecision(value)}
    </div>
  );
};

const OutstandingDuesTable = ({ data, sortConfig, onSort, breakdownFilter, setBreakdownFilter, statusFilter, setStatusFilter }: Props) => {
  const params = useParams();
  const userId = params.userId as string;

  const thClass = 'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white select-none';
  const thSortable = `${thClass} cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap`;

  if (!data || data.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-lg font-medium">No outstanding dues</p>
        <p className="text-sm mt-1">All your payments are up to date</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className="bg-primary text-white">
          <tr>
            {/* Reservation ID */}
            <th className={thSortable} onClick={() => onSort('reservationId')}>
              Reservation <SortIcon field="reservationId" sortConfig={sortConfig} />
            </th>

            {/* Status — filter dropdown in header */}
            <th className={thClass}>
              <div className="flex flex-col gap-1">
                <span className="whitespace-nowrap">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  className="text-[10px] border border-white/40 rounded px-1 py-0.5 w-full cursor-pointer focus:outline-none"
                >
                  {STATUS_FILTERS.map((f) => (
                    <option key={f.value} value={f.value} style={{ color: '#1f2937', backgroundColor: '#ffffff' }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </th>

            {/* Outstanding Dues column with breakdown filter in header */}
            <th className={thClass}>
              <div className="flex flex-col gap-1">
                <span className="cursor-pointer hover:text-white/80 whitespace-nowrap" onClick={() => onSort('totalOutstandingDues')}>
                  Outstanding Dues <SortIcon field="totalOutstandingDues" sortConfig={sortConfig} />
                </span>
                {/* Native select — force dark text on the element so options are readable */}
                <select
                  value={breakdownFilter}
                  onChange={(e) => setBreakdownFilter(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  className="text-[10px] border border-white/40 rounded px-1 py-0.5 w-full cursor-pointer focus:outline-none"
                >
                  {BREAKDOWN_FILTERS.map((f) => (
                    <option key={f.value} value={f.value} style={{ color: '#1f2937', backgroundColor: '#ffffff' }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </th>

            {/* Transaction Summary */}
            <th className={thSortable} onClick={() => onSort('totalPaidAmount')}>
              Transaction Summary <SortIcon field="totalPaidAmount" sortConfig={sortConfig} />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200/50">
          {data.map((item, index) => {
            const { transactionSummary: gt, outStandingDuesBreakdown: bd } = item;

            return (
              <tr key={item.reservationId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {/* Reservation ID */}
                <td className="px-4 py-3 text-sm font-semibold text-primary whitespace-nowrap">#{item.reservationId}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.reservationStatus)}`}>
                    {getStatusLabel(item.reservationStatus)}
                  </span>
                </td>

                {/* Outstanding Dues (grouped breakdown) */}
                <td className="px-4 py-3 text-sm">
                  {/* Total outstanding with Pay Now button */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-error text-base">${parseFloatWithPrecision(gt.totalOutstandingDues)}</span>
                    <Link
                      href={
                        isDevelopment
                          ? `/payment/combined-payment/${item.reservationId}`
                          : `/dashboard/${userId}/travels/details/${item.reservationId}`
                      }
                      className="cursor-pointer shrink-0 bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-primary active:scale-95 transition-all whitespace-nowrap text-center"
                    >
                      Pay Now
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    <AmountRow label="Rent" value={bd.rent} />
                    <AmountRow label="Additional" value={bd.additionalFee} />
                    <AmountRow label="Coverage" value={bd.coverageFee} />
                    <AmountRow label="Vehicle" value={bd.vehicleFee} />
                    <AmountRow label="Hold" value={bd.holdDue} />
                    <AmountRow label="Revised" value={bd.revised} />
                  </div>
                </td>

                {/* Transaction Summary */}
                <td className="px-4 py-3 text-sm">
                  {gt.totalPaidAmount > 0 && (
                    <div className="text-gray-700">
                      <span className="text-xs text-gray-500">Paid:</span>{' '}
                      <span className="font-semibold">${parseFloatWithPrecision(gt.totalPaidAmount)}</span>
                    </div>
                  )}
                  {gt.totalReturnedAmount > 0 && (
                    <div className="text-blue-600">
                      <span className="text-xs text-gray-500">Returned:</span>{' '}
                      <span className="font-semibold">${parseFloatWithPrecision(gt.totalReturnedAmount)}</span>
                    </div>
                  )}
                  {gt.totalAdditionalAmount > 0 && (
                    <div className="text-gray-700 mt-0.5">
                      <span className="text-xs text-gray-500">Add. Fees:</span>{' '}
                      <span className="font-semibold">${parseFloatWithPrecision(gt.totalAdditionalAmount)}</span>
                    </div>
                  )}
                  {gt.depositAmount > 0 && (
                    <div className="text-gray-700 mt-0.5">
                      <span className="text-xs text-gray-500">Deposit:</span>{' '}
                      <span className="font-semibold">${parseFloatWithPrecision(gt.depositAmount)}</span>
                    </div>
                  )}
                  {gt.totalOutstandingDues > 0 && (
                    <div className="text-error mt-0.5">
                      <span className="text-xs text-gray-500">Outstanding:</span>{' '}
                      <span className="font-bold">${parseFloatWithPrecision(gt.totalOutstandingDues)}</span>
                    </div>
                  )}
                  {gt.totalPaidAmount === 0 &&
                    gt.totalReturnedAmount === 0 &&
                    gt.totalOutstandingDues === 0 &&
                    gt.totalAdditionalAmount === 0 &&
                    gt.depositAmount === 0 && <span className="text-gray-400 text-xs">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OutstandingDuesTable;
