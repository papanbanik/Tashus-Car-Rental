import { TWaiveFeesItem } from '@/types/travels/typeTravels';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface WaiveFeesTableRow {
  waiveFeeItem: TWaiveFeesItem;
  serial: number;
  paymentStatus: string;
  dueAmount: number;
}

const WaiveFeesTableRow = ({ waiveFeeItem, serial, paymentStatus, dueAmount }: WaiveFeesTableRow) => {
  return (
    <>
      <TableRow
        sx={{
          borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <TableCell>{serial}</TableCell>
        <TableCell className="w-1/2 text-green-500">{waiveFeeItem?.description ?? '-'}</TableCell>
        <TableCell className="w-[15%]">
          <div className="w-full flex justify-end">
            <span className="text-green-500">
              {waiveFeeItem.amount ? `-$${waiveFeeItem.amount?.toFixed(2)}` : <span className="text-center">-</span>}
            </span>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default WaiveFeesTableRow;
