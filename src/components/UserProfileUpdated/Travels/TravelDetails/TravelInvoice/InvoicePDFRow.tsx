import { EPriceAdjustment } from '@/types/commonTypes';
import { ReservationAdditionalFeeItems, TInvoiceReservationWaiveFeeItem } from '@/types/travels/typeTravels';
import { Text, View } from '@react-pdf/renderer';
import InvoicePDFLabel from './InvoicePDFLabel';
import { addFeePDFStyles } from './TravelInvoicePDFContent';

interface InvoicePDFRowProps {
  feeItem?: ReservationAdditionalFeeItems;
  serial: number;
  reservationId?: number;
  waiveFeeItem?: TInvoiceReservationWaiveFeeItem;
  isWaiveFee?: boolean;
}

const InvoicePDFRow = ({ feeItem, serial, waiveFeeItem, isWaiveFee }: InvoicePDFRowProps) => {
  const hasAdditionalCharges = Boolean((feeItem?.additionalCharges ?? [])?.length > 0);
  const hasProcessingFee = Boolean(feeItem?.processingFee && feeItem?.processingFee > 0);
  const isHideItemName = feeItem?.hideItemName ?? false;

  return (
    <View>
      {/* Main Fee Row */}
      {/* show itemName */}
      {!isWaiveFee && !isHideItemName ? (
        <>
          <View style={[addFeePDFStyles.tableRow, { ...(!hasAdditionalCharges && addFeePDFStyles.bottomBorder) }]}>
            <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}>{`${serial}. `}</Text>
            <View style={[addFeePDFStyles.tableItem]}>
              <InvoicePDFLabel
                feeItemName={feeItem?.itemName || ''}
                fromDate={feeItem?.fromDate}
                toDate={feeItem?.toDate}
                notes={feeItem?.notes}
                itemKey={feeItem?.itemKey}
              />
              {/* Processing Fee on same row */}
              {hasProcessingFee && <Text style={[addFeePDFStyles.processingFeeTableCell, { paddingBottom: '10px' }]}>+ Processing Fee</Text>}
            </View>
            <View style={[addFeePDFStyles.tableAmount]}>
              <Text style={[addFeePDFStyles.tableCell, { textAlign: 'right' }]}>
                {feeItem?.cost ? `${feeItem?.itemType === EPriceAdjustment.Decrease ? '-' : ''}$${feeItem?.cost?.toFixed(2)}` : '-'}
              </Text>
              {/* Processing Fee Amount on same row */}
              {hasProcessingFee && (
                <Text style={[addFeePDFStyles.processingFeeTableCell, { textAlign: 'right', marginTop: '8px', paddingBottom: '10px' }]}>
                  ${feeItem?.processingFee?.toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        </>
      ) : (
        ''
      )}

      {/* hide itemName - Single or no additional charges */}
      {isHideItemName && (!feeItem?.additionalCharges || feeItem?.additionalCharges?.length < 2) ? (
        <>
          <View style={[addFeePDFStyles.tableRow, { ...(hasAdditionalCharges && addFeePDFStyles.bottomBorder) }]}>
            {feeItem?.additionalCharges?.map((charge, chargeIndex) => (
              <View key={chargeIndex} style={addFeePDFStyles.tableRow}>
                {chargeIndex === 0 ? (
                  <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}>{`${serial}. `}</Text>
                ) : (
                  <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}></Text>
                )}
                <View style={[addFeePDFStyles.tableItem]}>
                  <InvoicePDFLabel
                    feeItemName={charge?.chargeName || ''}
                    fromDate={charge?.fromDate}
                    toDate={charge?.toDate}
                    notes={feeItem?.notes}
                    itemKey={feeItem?.itemKey}
                  />
                  {/* Processing Fee for last charge only */}
                  {hasProcessingFee && <Text style={[addFeePDFStyles.processingFeeTableCell, { paddingBottom: '10px' }]}>+ Processing Fee</Text>}
                </View>
                <View style={[addFeePDFStyles.tableAmount]}>
                  <Text style={[addFeePDFStyles.tableCell, { textAlign: 'right' }]}>{charge?.cost ? `$${charge?.cost?.toFixed(2)}` : '-'}</Text>
                  {/* Processing Fee Amount for last charge only */}
                  {hasProcessingFee && (
                    <Text style={[addFeePDFStyles.processingFeeTableCell, { textAlign: 'right', marginTop: '8px', paddingBottom: '10px' }]}>
                      ${feeItem?.processingFee?.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      ) : isHideItemName && feeItem?.additionalCharges && feeItem?.additionalCharges?.length > 1 ? (
        /* hide itemName - Multiple additional charges */
        <>
          <View style={[addFeePDFStyles.collapsibleRowList, { ...(hasAdditionalCharges && addFeePDFStyles.bottomBorder) }]}>
            {feeItem?.additionalCharges?.map((charge, chargeIndex) => (
              <View key={chargeIndex} style={addFeePDFStyles.tableRow}>
                {chargeIndex === 0 ? (
                  <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}>{`${serial}. `}</Text>
                ) : (
                  <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}></Text>
                )}
                <View style={[addFeePDFStyles.tableItem]}>
                  <InvoicePDFLabel
                    feeItemName={charge?.chargeName || ''}
                    fromDate={charge?.fromDate}
                    toDate={charge?.toDate}
                    notes={feeItem?.notes}
                    itemKey={feeItem?.itemKey}
                  />
                  {/* Processing Fee  */}
                  {hasProcessingFee && <Text style={[addFeePDFStyles.processingFeeTableCell, { paddingBottom: '10px' }]}>+ Processing Fee</Text>}
                </View>
                <View style={[addFeePDFStyles.tableAmount, { width: '50%' }]}>
                  <Text style={[addFeePDFStyles.tableCell, { textAlign: 'right' }]}>{charge?.cost ? `$${charge?.cost?.toFixed(2)}` : '-'}</Text>
                  {/* Processing Fee Amount */}
                  {hasProcessingFee && (
                    <Text style={[addFeePDFStyles.processingFeeTableCell, { textAlign: 'right', marginTop: '8px', paddingBottom: '10px' }]}>
                      ${feeItem?.processingFee?.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        /* Additional charges with collapsible row */
        <>
          <View style={[addFeePDFStyles.collapsibleRow, { ...(hasAdditionalCharges && addFeePDFStyles.bottomBorder) }]}>
            {feeItem?.additionalCharges?.map((charge, chargeIndex) => (
              <View key={chargeIndex} style={addFeePDFStyles.tableRow}>
                <View style={[addFeePDFStyles.tableItem]}>
                  <InvoicePDFLabel
                    feeItemName={charge?.chargeName || ''}
                    fromDate={charge?.fromDate}
                    toDate={charge?.toDate}
                    isAdditionalCost={true}
                    notes={feeItem?.notes}
                  />
                  {/* Processing Fee  */}
                  {hasProcessingFee && <Text style={[addFeePDFStyles.processingFeeTableCell, { paddingBottom: '10px' }]}>+ Processing Fee</Text>}
                </View>
                <View style={[addFeePDFStyles.tableAmount, { width: '50%' }]}>
                  <Text style={[addFeePDFStyles.tableCell, { textAlign: 'right' }]}>{charge?.cost ? `$${charge?.cost?.toFixed(2)}` : '-'}</Text>
                  {/* Processing Fee Amount */}
                  {hasProcessingFee && (
                    <Text style={[addFeePDFStyles.processingFeeTableCell, { textAlign: 'right', marginTop: '8px', paddingBottom: '10px' }]}>
                      ${feeItem?.processingFee?.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* waive fees items Row */}
      {isWaiveFee && waiveFeeItem?.description && (
        <View style={[addFeePDFStyles.tableRow, { ...(!hasAdditionalCharges && addFeePDFStyles.bottomBorder) }]}>
          <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableSerial]}>{`${serial ?? ''}. `}</Text>
          <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableItem]}>{waiveFeeItem?.description ?? '-'}</Text>
          <Text style={[addFeePDFStyles.tableCell, addFeePDFStyles.tableAmount, { color: 'red' }]}>
            {waiveFeeItem?.amount ? `-$${waiveFeeItem?.amount?.toFixed(2)}` : '-'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default InvoicePDFRow;
