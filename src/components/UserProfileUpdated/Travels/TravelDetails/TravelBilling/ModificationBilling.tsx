import { Button, TableCell, TableRow } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ModificationBillingProps {
  vehicleFee?: number;
  coverageFee?: number;
  isVehiclePayable?: boolean;
  isCoveragePayable?: boolean;
  travelId: string;
}
const ModificationBilling = ({ vehicleFee, coverageFee, isVehiclePayable, isCoveragePayable, travelId }: ModificationBillingProps) => {
  const router = useRouter();
  return (
    <>
      {/* Vehicle Due amount */}
      {isVehiclePayable && (
        <TableRow className="w-full">
          <TableCell align="right" colSpan={2} className="font-bold text-md text-error text-right py-1">
            <span className="pr-1">{`Replacement Fee Due: $${vehicleFee}`}</span>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=changed_vehicle`)}
            >
              Pay
            </Button>
          </TableCell>
        </TableRow>
      )}
      {/* Coverage Due amount */}
      {isCoveragePayable && (
        <TableRow className="w-full">
          <TableCell align="right" colSpan={2} className="font-bold text-md text-error text-right py-1">
            <span className="pr-1">{`Coverage Fee Due: $${coverageFee}`}</span>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=upgraded_coverage`)}
            >
              Pay
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ModificationBilling;
