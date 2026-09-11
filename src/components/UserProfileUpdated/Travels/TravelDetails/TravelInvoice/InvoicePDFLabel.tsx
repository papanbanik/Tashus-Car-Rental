import { Text, View } from '@react-pdf/renderer';
import { CiCalendarDate } from 'react-icons/ci';
import { formatDateRangeForDisplay } from '../additionalFeesFn';
import { addFeePDFStyles } from './TravelInvoicePDFContent';

interface InvoicePDFLabelProps {
  feeItemName: string;
  fromDate?: string;
  toDate?: string;
  isAdditionalCost?: boolean;
  notes?: string;
  itemKey?: string;
}

const InvoicePDFLabel = ({ feeItemName, fromDate, toDate, notes, itemKey, isAdditionalCost }: InvoicePDFLabelProps) => {
  // const hasDates = fromDate || toDate;
  // const formattedFrom = fromDate ? formatDateUtc(fromDate) : '';
  // const formattedTo = toDate ? formatDateUtc(toDate) : '';

  return (
    // <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableItem, { width: '100%' }]}>
    //   {isAdditionalCost ? '+ ' : ''}
    //   {feeItemName}
    //   {notes && ` (${notes})`}
    //   {hasDates && ` [${formattedFrom}${toDate ? ` - ${formattedTo}` : ''}]`}
    // </Text>

    <View style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableItem, { width: '100%' }]}>
      {/* Fee Item Name with Notes */}
      <Text style={{ marginBottom: 2, paddingBottom: '4px' }}>
        {isAdditionalCost ? '+ ' : ''}
        {feeItemName}
        {/* Notes-Toll */}
        {notes && itemKey === 'toll' && ` (${notes})`}
      </Text>

      {/* Notes-Transfer of Traffic or Parking Fines */}
      {notes && itemKey === 'transferOfTrafficOrParkingFines' && <Text style={{ fontSize: 9, color: '#666', padding: '4px 0px' }}>{notes}</Text>}
      {/* Date Range */}
      {fromDate && (
        <Text style={{ fontSize: 9, color: '#666', padding: '4px 0px' }}>
          <CiCalendarDate className="flex" size={16} />
          {formatDateRangeForDisplay({ fromDate, toDate })}
        </Text>
      )}
    </View>
  );
};

export default InvoicePDFLabel;
