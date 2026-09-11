import { ReservationAdditionalFees } from '@/types/travels/typeTravels';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Typography } from '@mui/material';
import React from 'react';
import AdditionalFeeTableRow from './AdditionalFeeTableRow';
import WaiveFeesTableRow from './WaiveFeesTableRow';

export type Header = {
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  className?: string;
  label: string;
};

interface AdditionalFeeTableProps {
  reservationAdditionalFees: ReservationAdditionalFees[];
  finalSubtotal: number;
  dueAmount: number;
  paidAmount: number;
  isLoading: boolean;
}

const AdditionalFeeTable = ({
  reservationAdditionalFees = [],
  finalSubtotal = 0,
  dueAmount = 0,
  paidAmount = 0,
  isLoading,
}: AdditionalFeeTableProps) => {
  const tableHeading: Header[] = [
    { align: 'left', label: 'SL' },
    { className: 'text-sm font-bold', label: 'Fee Name' },
    { className: 'text-sm font-bold text-right', label: 'Cost' },
  ];

  let serialCounter = 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex flex-col mt-8`}>
        <Typography variant="h6" className="md:text-xl text-lg font-bold pl-2">
          Additional Fees <span className="text-sm">– Added for Guest</span>
        </Typography>
        <div className="mt-6 flex justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mt-8`}>
      <Typography variant="h6" className="md:text-xl text-lg font-bold pl-2">
        Additional Fees <span className="text-sm">– Added for Guest</span>
      </Typography>

      {reservationAdditionalFees?.length > 0 ? (
        <>
          {/* Table with data */}
          <TableContainer>
            <Table aria-label="fee items table">
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid black' }}>
                  {tableHeading?.map((header, index) => (
                    <TableCell key={index} align={header.align} className={header.className}>
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reservationAdditionalFees?.map((additionalFee, groupIndex) => (
                  <React.Fragment key={`additionalFee-${groupIndex}`}>
                    {/* Map feeItems */}
                    {additionalFee?.feeItems?.map((fee, feeIndex) => {
                      serialCounter += 1;
                      return (
                        <AdditionalFeeTableRow
                          key={`feeItem-${groupIndex}-${feeIndex}`}
                          finalSubTotal={finalSubtotal}
                          feeItem={fee}
                          serial={serialCounter}
                          dueAmount={dueAmount}
                        />
                      );
                    })}

                    {/* Map waive fees */}
                    {additionalFee?.waiveFees?.map((waiveFee: any, waiveFeeIndex) => {
                      serialCounter += 1;
                      return (
                        <WaiveFeesTableRow
                          key={`waiveFee-${groupIndex}-${waiveFeeIndex}`}
                          serial={serialCounter}
                          waiveFeeItem={waiveFee}
                          paymentStatus={additionalFee?.paymentStatus}
                          dueAmount={dueAmount}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Right-aligned Summary Box */}
          <div className="mt-1 flex justify-end">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-80">
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${finalSubtotal?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Paid:</span>
                  <span className="font-semibold text-green-600">${paidAmount?.toFixed(2)}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-800">Amount Due:</span>
                  <span className="font-bold text-red-600 text-lg">${dueAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 flex justify-center">
          <div className="text-center py-8">
            <Typography variant="body1" className="text-gray-500 mb-2">
              No additional fees found
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              There are currently no additional fees for this reservation.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalFeeTable;
