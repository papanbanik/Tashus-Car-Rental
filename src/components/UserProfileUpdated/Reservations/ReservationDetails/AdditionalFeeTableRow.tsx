import { ReservationAdditionalFeeItems } from '@/types/travels/typeTravels';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import AdditionalFeeTableFeeLabel from '../../Travels/TravelDetails/TravelBilling/AdditionalFeeTableFeeLabel';

interface AdditionalFeeTableRow {
  feeItem: ReservationAdditionalFeeItems;
  serial: number;
  finalSubTotal: number;
  dueAmount: number;
}

const AdditionalFeeTableRow = ({ feeItem, serial, finalSubTotal, dueAmount }: AdditionalFeeTableRow) => {
  return (
    <>
      <TableRow
        sx={{
          borderBottom: (feeItem?.additionalCharges?.length ?? 0) > 0 ? 'none' : '2px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <TableCell>{serial}</TableCell>
        <TableCell className="w-[70%]">
          <AdditionalFeeTableFeeLabel
            feeItemName={feeItem.itemName}
            processingFee={feeItem.processingFee}
            notes={feeItem.notes}
            fromDate={feeItem?.fromDate}
            toDate={feeItem?.toDate}
            itemKey={feeItem?.itemKey}
          ></AdditionalFeeTableFeeLabel>
        </TableCell>
        <TableCell className="text-end w-[20%]">
          <div className="flex flex-col w-full justify-end">
            <span>{feeItem.cost ? `$${feeItem.cost?.toFixed(2)}` : <span className="text-center">-</span>}</span>

            {feeItem.processingFee && feeItem.processingFee > 0 && <span className="mt-4">+${feeItem.processingFee.toFixed(2)}</span>}
          </div>
        </TableCell>
      </TableRow>

      {feeItem?.additionalCharges?.map((charge, index) => (
        <TableRow
          key={index}
          sx={{
            borderBottom: index === (feeItem?.additionalCharges?.length || 0) - 1 ? '2px solid rgba(0, 0, 0, 0.12)' : 'none',
          }}
        >
          <TableCell className="w-[10%] text-center py-0">{/* <span className="text-base text-green-500">+</span>  */}</TableCell>
          <TableCell className="w-[70%] pt-0 pb-1 ps-6">
            <AdditionalFeeTableFeeLabel
              feeItemName={charge.chargeName}
              fromDate={charge?.fromDate}
              toDate={charge?.toDate}
              isAdditionalCost={true}
            ></AdditionalFeeTableFeeLabel>
          </TableCell>
          <TableCell className="w-[20%] pt-0 pb-1">
            <div className="w-full flex justify-end">
              <span>{charge.cost ? `$${charge.cost?.toFixed(2)}` : '-'}</span>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default AdditionalFeeTableRow;
