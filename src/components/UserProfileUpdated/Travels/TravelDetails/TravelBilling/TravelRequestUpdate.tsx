import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Table, TableBody } from '@mui/material';
import CommonTableRow from './CommonTableRow';

const TravelRequestUpdate = ({
  revisedVehicleCreditedAmount,
  revisedVehicleDiscountAmount,
  revisedCoverageCreditedAmount,
}: {
  revisedVehicleCreditedAmount: number;
  revisedVehicleDiscountAmount: number;
  revisedCoverageCreditedAmount: number;
}) => {
  return (
    <div className="w-full">
      <span className="text-md md:text-lg font-semibold pl-4">Modification Info</span>
      {/* Revised Coverage or Vehicle */}
      <Table className="w-full">
        <TableBody>
          {/* Vehicle Credited Amount */}
          {revisedVehicleCreditedAmount > 0 && (
            <CommonTableRow title="Credited Amount (Vehicle Replacement)" value={`$${parseFloat((revisedVehicleCreditedAmount ?? 0).toFixed(2))}`} />
          )}

          {/* Vehicle Payable Amount */}
          {/* {revisedVehiclePayableAmount > 0 && (
            <CommonTableRow title="Payable Amount (Vehicle Replacement)" value={`$${parseFloat((revisedVehiclePayableAmount ?? 0).toFixed(2))}`} />
          )} */}

          {/*Vehicle Discount Amount*/}
          {revisedVehicleDiscountAmount > 0 && (
            <CommonTableRow title="Discount Amount (Vehicle Replacement)" value={`$${parseFloat((revisedVehicleDiscountAmount ?? 0).toFixed(2))}`} />
          )}
          {/*Coverage Payable Amount*/}
          {/* {revisedCoveragePayableAmount > 0 && (
            <CommonTableRow title="Payable Amount (Update Coverage)" value={`$${parseFloat((revisedCoveragePayableAmount ?? 0).toFixed(2))}`} />
          )} */}

          {/*Coverage credited Amount*/}
          {revisedCoverageCreditedAmount > 0 && (
            <CommonTableRow title="Credited Amount (Coverage Downgrade)" value={`$${parseFloatWithPrecision(revisedCoverageCreditedAmount ?? 0)}`} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TravelRequestUpdate;
