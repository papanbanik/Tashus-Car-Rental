import { CiCalendarDate } from 'react-icons/ci';
import { formatDateRangeForDisplay } from '../additionalFeesFn';

interface AdditionalFeeTableFeeLabelProps {
  feeItemName: string;
  fromDate?: string;
  toDate?: string;
  isAdditionalCost?: boolean;
  processingFee?: number;
  notes?: string;
  itemKey?: string;
}

const AdditionalFeeTableFeeLabel = ({
  feeItemName,
  processingFee,
  notes,
  fromDate,
  toDate,
  itemKey,
  isAdditionalCost,
}: AdditionalFeeTableFeeLabelProps) => {
  return (
    <span className={`flex ${toDate || processingFee ? 'flex-col' : 'flex-col sm:flex-row'} gap-1`}>
      <span className="flex items-start sm:items-center flex-wrap">
        {isAdditionalCost ? '+ ' : ''}
        <span className="break-words">{feeItemName}</span>
        {/* Notes - Toll */}
        {notes && itemKey === 'toll' && (
          <span className="ps-1 flex-shrink-0">
            (<span className="text-[10px] sm:text-xs">{notes}</span>)
          </span>
        )}
      </span>

      {/* Notes-Transfer of Traffic or Parking Fines */}
      {notes && itemKey === 'transferOfTrafficOrParkingFines' && (
        <span className="ps-1 flex-shrink-0">
          <span className="text-[10px] sm:text-xs">{notes}</span>
        </span>
      )}
      {fromDate && (
        <span className="flex items-center gap-1 flex-shrink-0 py-2">
          <CiCalendarDate className="flex flex-shrink-0" size={16} />
          <span className="text-[10px] sm:text-xs break-all">{formatDateRangeForDisplay({ fromDate, toDate })}</span>
        </span>
      )}

      {processingFee && processingFee > 0 && <span className="text-[10px] sm:text-xs text-gray-600 flex-shrink-0">Processing Fee</span>}
    </span>
  );
};

export default AdditionalFeeTableFeeLabel;
