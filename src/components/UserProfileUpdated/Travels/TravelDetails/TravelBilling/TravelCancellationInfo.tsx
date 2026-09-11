import { CancellationInfo } from '@/types/travels/typeTravels';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { getCancelledTravelReturnAmountText } from './travelBillingFn';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface TravelCancellationInfoProps {
  cancellationInfo: CancellationInfo;
}

const TravelCancellationInfo = ({ cancellationInfo }: TravelCancellationInfoProps) => {
  const { guestInconvenienceFee = 0, guestInconvenienceFeeReason, returnAmount = 0, isRefundable, returnStatus } = cancellationInfo;
  return (
    <div>
      <span className="md:text-xl text-lg font-bold pl-4">Cancellation Details</span>

      <Table>
        <TableBody>
          {guestInconvenienceFee > 0 && (
            <TableRow>
              <TableCell className="flex items-center">
                <span>Inconvenience Fee</span>
                {guestInconvenienceFeeReason && (
                  <Tooltip enterTouchDelay={0} title={guestInconvenienceFeeReason} arrow={true} placement="top">
                    <IconButton size="small">
                      <AiOutlineInfoCircle />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell align="right" className={'text-error'}>
                {`-$${guestInconvenienceFee}`}
              </TableCell>
            </TableRow>
          )}
          {returnAmount > 0 && (
            <TableRow>
              <TableCell>
                <span>{getCancelledTravelReturnAmountText(isRefundable, returnStatus ?? '')}</span>
              </TableCell>
              <TableCell align="right" className={'text-success'}>
                {`+$${returnAmount}`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TravelCancellationInfo;
