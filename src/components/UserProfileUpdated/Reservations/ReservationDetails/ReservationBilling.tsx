'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetReservationInvoiceInfo } from '@/hooks/reservation/reservation-invoice/useGetReservationInvoiceInfo';
import { Bill } from '@/types/profileInfoTypes';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import { getHostRentalFees } from '@/utils/Functions/travelCommonFn';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import AdditionalFeeTable from './AdditionalFeeTable';

interface ReservationBillingProps {
  isTravelUpdatedPage?: boolean;
}

const ReservationBilling = ({ isTravelUpdatedPage }: ReservationBillingProps) => {
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const [billingData, setBillingData] = useState<Bill[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { reservationAdditionalFees = [], reservationId = '', revisedId = undefined } = updatedTravelData;
  const { data, refetch, isFetching, isLoading } = useGetReservationInvoiceInfo({ reservationId, revisedId });

  useEffect(() => {
    if (updatedTravelData?.reservationId) {
      refetch();
    }
  }, [updatedTravelData]);

  const reservationInvoiceInfo: ReservationInvoiceInfoData = data?.data?.data[0] ?? {};

  const { additionalFeeSubtotal, additionalFeeDue, additionalFeePaidAmount } = reservationInvoiceInfo;

  useEffect(() => {
    const getBillingDetails = async () => {
      if (travelDetails && updatedTravelData) {
        const coveragePercentage = travelDetails?.reservationInfo?.vehicleInsurance?.coveragePercentage || 75;
        const hostPercentage =
          updatedTravelData?.basePrice?.hostIncome ??
          (await getHostRentalFees(updatedTravelData?.basePrice, coveragePercentage, updatedTravelData?.depositAmount ?? 0));

        const newBillingData: Bill[] = [
          {
            amountType: 'increase',
            label: `Rental Fees (${coveragePercentage}% share)`,
            amount: parseFloat(hostPercentage?.toFixed(2)),
          },
        ];

        const tempTotalAmount = newBillingData.reduce((sum, item) => sum + item.amount, 0);

        setBillingData(newBillingData);
        setTotalAmount(parseFloat(tempTotalAmount?.toFixed(2)));
      }
    };
    getBillingDetails();
  }, [travelDetails]);

  return (
    <div className={` flex flex-col ${isTravelUpdatedPage ? 'p-5' : ''}`}>
      <span className="md:text-2xl text-lg font-bold">Billing Details</span>

      <TableContainer component={isTravelUpdatedPage ? React.Fragment : Paper} className="bg-transparent mt-4">
        <Table>
          <TableBody>
            {billingData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span>{item.label}</span>
                  {item?.helpingText && (
                    <Tooltip enterTouchDelay={0} title={item?.helpingText} placement="top">
                      <IconButton size="small">
                        <AiOutlineInfoCircle />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  className={`${item?.amountType === 'increase' ? 'text-success' : item?.amountType === 'decrease' ? 'text-error' : ''}`}
                >
                  {`+$${item.amount}`}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="w-full">
              <TableCell align="right" colSpan={2} className="font-bold text-lg text-success text-right">
                {`Total: $`}
                {totalAmount?.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Additional Fees Table */}

      <AdditionalFeeTable
        reservationAdditionalFees={reservationAdditionalFees ?? []}
        finalSubtotal={additionalFeeSubtotal}
        dueAmount={additionalFeeDue}
        paidAmount={additionalFeePaidAmount}
        isLoading={isFetching || isLoading}
      />
    </div>
  );
};

export default ReservationBilling;
