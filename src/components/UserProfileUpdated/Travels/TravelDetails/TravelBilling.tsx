'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetReservationInvoiceInfo } from '@/hooks/reservation/reservation-invoice/useGetReservationInvoiceInfo';
import { EPriceAdjustment, ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { Bill } from '@/types/profileInfoTypes';
import { ReservationInvoiceInfoData } from '@/types/reservations/reservationInvoiceTypes';
import { CancellationInfo, ReservationAdditionalFeeItems, ReservationAdditionalFees, TWaiveFeesItem } from '@/types/travels/typeTravels';
import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import AdditionalFeeTableFeeLabel from './TravelBilling/AdditionalFeeTableFeeLabel';
import ModificationBilling from './TravelBilling/ModificationBilling';
import TravelCancellationInfo from './TravelBilling/TravelCancellationInfo';
import TravelHoldDepositInfo from './TravelBilling/TravelHoldDepositInfo';
import TravelRequestUpdate from './TravelBilling/TravelRequestUpdate';
import { InvoicePDFDownloaderProps } from './TravelInvoice/InvoicePDFDownloader';
import InvoicePaymentHistory from './TravelInvoice/InvoicePaymentHistory';

const InvoicePDFDownloader = dynamic(() => import('./TravelInvoice/InvoicePDFDownloader'), { loading: () => <p>Loading...</p> });

interface TravelBillingProps {
  isTravelUpdatedPage?: boolean;
}

const TravelBilling = ({ isTravelUpdatedPage }: TravelBillingProps) => {
  const router = useRouter();
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const [billingData, setBillingData] = useState<Bill[]>([]);
  const [voucherDiscountRow, setVoucherDiscountRow] = useState<Bill | null>(null);
  const { travelId } = useParams<{ travelId: string }>();
  const { reservationId, revisedId } = updatedTravelData ?? {};

  const { data } = useGetReservationInvoiceInfo({ reservationId, revisedId });

  const reservationInvoiceInfo: ReservationInvoiceInfoData = data?.data?.data[0] ?? {};

  const {
    invoiceSubtotal,
    invoiceTotalPaid,
    creditAmountUsed,
    voucherAmountUsed,
    additionalFeeDue,
    rentDueAmount,
    rentPaidAmount,
    totalDeliveryFee,
    totalReturnFee,
    deliveryFeeDiscount,
    returnFeeDiscount,
    replacementVehicleInfo,
    paymentTransactionHistory,
    ...rest
  } = reservationInvoiceInfo;
  //Destruct UpdatedTravelData
  const {
    totalPaidAmount,
    totalReturnedAmount,
    basePrice,
    cancellationInfo,
    additionalPaymentInfo,
    pickupDate,
    returnDate,
    discounts,
    serviceFeePercentage,
    revisedVehiclePayableAmount,
    revisedVehiclePaymentStatus,
    revisedCoveragePayableAmount,
    revisedCoverageCreditedAmount,
    revisedCoveragePaymentStatus,
    vehicleReturnFee,
    vehicleDeliveryFee,
    holdPaymentTransaction,
    depositAmount,
  } = updatedTravelData ?? {};
  //Destruct discounts
  const { advanceBookingDiscounts, longBookingDiscounts, customAdvanceDiscountAmount, customLongDiscountAmount } = discounts ?? {};
  const discountAmount = (replacementVehicleInfo?.discountAmount ?? 0) > 0 ? replacementVehicleInfo?.discountAmount : 0;
  const creditedAmount = (replacementVehicleInfo?.creditedAmount ?? 0) > 0 ? replacementVehicleInfo?.creditedAmount : 0;
  //Check if cancellation fee or refund exists
  const hasCancellationFeeOrRefund: boolean = (cancellationInfo?.returnAmount ?? 0) > 0 || (cancellationInfo?.guestInconvenienceFee ?? 0) > 0;
  const vehicleFee = parseFloat((revisedVehiclePayableAmount ?? 0)?.toFixed(2));
  const coverageFee = parseFloat((revisedCoveragePayableAmount ?? 0)?.toFixed(2));
  //Discounts Amount
  const customLongBookingAmount = customLongDiscountAmount ?? 0;
  const longBookingDiscount = longBookingDiscounts?.calculatedAmount ?? 0;
  // const longBookingDiscount =
  //   customLongDiscountAmount && longBookingDiscounts?.calculatedAmount && !longBookingDiscounts?.duration
  //     ? customLongDiscountAmount + (longBookingDiscounts?.calculatedAmount ?? 0)
  //     : customLongDiscountAmount ?? longBookingDiscounts?.calculatedAmount;
  const advBookingDiscount = customAdvanceDiscountAmount ?? advanceBookingDiscounts?.calculatedAmount ?? 0;
  //Price Adjustment
  const priceAdjustmentReason = basePrice?.priceAdjustment?.reason ?? '';
  const priceAdjustmentAmount = basePrice?.priceAdjustment?.amount ?? 0;
  const priceAdjustmentType = basePrice?.priceAdjustment?.adjustmentType;
  const isPriceIncrease = priceAdjustmentType === EPriceAdjustment.Increase;
  const isVehiclePayable = revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Pending && vehicleFee > 0;
  const isCoveragePayable = revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Pending && coverageFee > 0;
  const hasHoldDeposit = (depositAmount ?? 0) > 0 || (holdPaymentTransaction?.actualCardPaidAmount ?? 0) > 0;

  useEffect(() => {
    if (travelDetails && updatedTravelData) {
      const remainingPaidAmount = parseFloat((totalPaidAmount ?? 0)?.toFixed(2)) - parseFloat((totalReturnedAmount ?? 0)?.toFixed(2));
      let tempPaidTotal = basePrice?.totalPrice;
      const travelDuration = getDurationDayHourMin(pickupDate, returnDate);
      const voucherDiscount = additionalPaymentInfo?.voucherAmountUsed || 0;
      const creditUsed = additionalPaymentInfo?.creditAmountUsed || 0;
      const newBillingData: Bill[] = [
        {
          amountType: 'increase',
          label: `${travelDuration} rental`,
          amount: `+$${basePrice?.durationPrice?.toFixed(2)}`,
        },
        // {
        //   amountType: 'increase',
        //   label: 'Peak Increase',
        //   amount: `+$${peakIncrease?.calculatedAmount?.toFixed(2) || 0}`,
        // },
        serviceFeePercentage > 0 && {
          //modify for car rental
          amountType: 'increase',
          label: `${serviceFeePercentage}% Service Fee`,
          amount: `+$${basePrice?.serviceFeeAmount?.toFixed(2)}`,
        },
        (longBookingDiscount ?? 0) > 0 && {
          amountType: 'decrease',
          label: 'Long Reservation Discount',
          amount: `-$${parseFloatWithPrecision(longBookingDiscount)}`,
        },
        customLongBookingAmount > 0 && {
          amountType: 'decrease',
          label: 'Special Long Reservation Discount',
          amount: `-$${parseFloatWithPrecision(customLongBookingAmount)}`,
        },
        (advBookingDiscount ?? 0) > 0 && {
          amountType: 'decrease',
          label: 'Early Reservation Discount',
          amount: `-$${advBookingDiscount?.toFixed(2) || 0}`,
        },
        {
          amountType: 'increase',
          label: 'Coverage Amount',
          amount: `+$${basePrice?.coverageAmount?.toFixed(2) || 0}`,
        },
        (basePrice?.gstAmount ?? 0) > 0 && {
          //gstAmount show change if calculated but not display
          amountType: 'increase',
          label: 'GST',
          amount: `+$${basePrice?.gstAmount?.toFixed(2) || 0}`,
          useBorder: (basePrice?.penaltyPrice ?? 0) > 0 ? false : true,
          helpingText: voucherDiscount > 0 ? `After applying $${voucherDiscount?.toFixed(2)} voucher discount` : '',
        },
        // {
        //   amountType: 'increase',
        //   label: 'Deposit Amount',
        //   amount: `+$${depositAmount?.toFixed(2) || 0}`,
        //   useBorder: (basePrice?.penaltyPrice ?? 0) > 0 ? false : true,
        // },
        (basePrice?.penaltyPrice ?? 0) > 0 && {
          amountType: 'increase',
          label: 'Inconvenience Fee',
          amount: `+$${basePrice?.penaltyPrice?.toFixed(2) || 0}`,
          useBorder: (basePrice?.waivedPayableAmount ?? 0) > 0 ? false : true,
          helpingText: basePrice?.penaltyReason ?? '',
        },
        (basePrice?.waivedPayableAmount ?? 0) > 0 && {
          amountType: 'decrease',
          label: 'Travel Update Waived',
          amount: `-$${basePrice?.waivedPayableAmount?.toFixed(2) || 0}`,
          useBorder: true,
        },
        {
          amountType: 'general',
          label: 'Total Fare',
          amount: `$${basePrice?.totalPrice?.toFixed(2)}`,
          // useBorder: voucherDiscount <= 0,
          useBorder: true,
          // helpingText: voucherDiscount > 0 ? `Voucher Discount: $${voucherDiscount}` : creditUsed > 0 ? `Used Credit: $${creditUsed}` : '',
        },
        (vehicleDeliveryFee ?? 0) > 0 && {
          amountType: 'increase',
          label: 'Delivery Fee',
          amount: `+$${vehicleDeliveryFee?.toFixed(2) || 0}`,
          useBorder: true,
        },
        (vehicleReturnFee ?? 0) > 0 && {
          amountType: 'increase',
          label: 'Return Fee',
          amount: `+$${vehicleReturnFee?.toFixed(2) || 0}`,
          useBorder: true,
        },
        // {
        //   amountType: 'general',
        //   label: 'Travel Extension Fee',
        //   amount: `$${basePrice?.payableAmount?.toFixed(2) || 0}`,
        // },
      ].filter(Boolean) as any[];

      // if (voucherDiscount > 0) {
      //   const voucherData: Bill = {
      //     amountType: 'decrease',
      //     label: 'Voucher Discount',
      //     amount: `-$${voucherDiscount?.toFixed(2)}`,
      //     useBorder: true,
      //   };
      //   tempPaidTotal = tempPaidTotal - voucherDiscount;
      //   newBillingData.push(voucherData);
      // }
      if (priceAdjustmentAmount > 0) {
        const priceAdjustmentData: Bill = {
          amountType: isPriceIncrease ? 'increase' : 'decrease',
          label: priceAdjustmentReason,
          amount: `${isPriceIncrease ? '+' : '-'}$${priceAdjustmentAmount?.toFixed(2)}`,
          useBorder: true,
        };
        tempPaidTotal = isPriceIncrease ? tempPaidTotal + priceAdjustmentAmount : tempPaidTotal - priceAdjustmentAmount;
        newBillingData.push(priceAdjustmentData);
      }
      // if (creditUsed > 0) {
      //   const creditData: Bill = {
      //     amountType: 'general',
      //     label: 'Used Credit',
      //     amount: `-$${creditUsed?.toFixed(2)}`,
      //     useBorder: true,
      //   };
      //   tempPaidTotal = tempPaidTotal - creditUsed;
      //   newBillingData.push(creditData);
      // }

      // const newTotalAmount = newBillingData.reduce((total, item) => {
      //   const amount = item.amount.endsWith('$') ? parseFloat(item.amount) : eval(item.amount);
      //   return total + amount;
      // }, 0);

      let extractedVoucherDiscount: Bill | null = null;

      if (voucherDiscount > 0) {
        extractedVoucherDiscount = {
          amountType: 'decrease',
          label: 'Voucher Discount',
          amount: `-$${voucherDiscount?.toFixed(2)}`,
          useBorder: true,
        };
        tempPaidTotal = tempPaidTotal - voucherDiscount;
      }

      setVoucherDiscountRow(extractedVoucherDiscount);
      setBillingData(newBillingData);
    }
  }, [travelDetails]);

  const invoicePDFDownloaderProps: InvoicePDFDownloaderProps = {
    ...rest,
    invoiceSubtotal,
    invoiceTotalPaid,
    creditAmountUsed,
    voucherAmountUsed,
    discountAmount,
    creditedAmount,
    paymentTransactionHistory,
    totalReturnedAmount,
    pickupDate,
    returnDate,
  };

  return (
    <div className={` flex flex-col ${isTravelUpdatedPage ? 'md:p-5 p-1' : ''}`}>
      {invoicePDFDownloaderProps?.companyInfo && (
        <div className="flex justify-between">
          <span className="md:text-2xl text-lg font-bold">Billing Details</span>
          <InvoicePDFDownloader {...invoicePDFDownloaderProps}></InvoicePDFDownloader>
        </div>
      )}

      <TableContainer component={isTravelUpdatedPage ? React.Fragment : Paper} className="bg-transparent mt-4">
        <Table>
          <TableBody>
            {billingData.map((item, index) => (
              <TableRow
                key={index}
                style={{ borderBottom: item?.useBorder ? 'solid 1px gray' : '' }}
                className={item?.useBorder ? 'border-b-2 border-gray-500' : ''}
              >
                <TableCell>
                  <span>{item.label}</span>
                  {item?.helpingText && (
                    <Tooltip enterTouchDelay={0} title={item?.helpingText} arrow={true} placement="top">
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
                  {item.amount}
                </TableCell>
              </TableRow>
            ))}
            {updatedTravelData?.reservationAdditionalFees?.map((additionalFee: ReservationAdditionalFees, index: number) => (
              <Fragment key={index}>
                {additionalFee?.feeItems?.map((fee: ReservationAdditionalFeeItems, index: number) => (
                  <Fragment key={index}>
                    {fee?.hideItemName ? (
                      ''
                    ) : (
                      <TableRow>
                        <TableCell>
                          <AdditionalFeeTableFeeLabel
                            feeItemName={fee?.itemName}
                            fromDate={fee?.fromDate}
                            toDate={fee?.toDate}
                            processingFee={fee.processingFee}
                            notes={fee.notes}
                            itemKey={fee?.itemKey}
                          ></AdditionalFeeTableFeeLabel>
                        </TableCell>
                        <TableCell align="right" className="text-success">
                          <div className="flex flex-col w-full justify-end">
                            {fee?.cost ? `+$${fee?.cost?.toFixed(2)}` : '-'}
                            {fee.processingFee && fee.processingFee > 0 && <span className="mt-4">+${fee.processingFee.toFixed(2)}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {fee?.additionalCharges?.map((charge, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <AdditionalFeeTableFeeLabel
                            feeItemName={charge?.chargeName}
                            fromDate={charge?.fromDate}
                            toDate={charge?.toDate}
                            isAdditionalCost={fee?.hideItemName ? false : true}
                            processingFee={charge.processingFee}
                            notes={charge.notes}
                            itemKey={fee?.itemKey}
                          ></AdditionalFeeTableFeeLabel>
                        </TableCell>
                        <TableCell align="right" className="text-success">
                          {charge?.cost ? `+$${charge?.cost?.toFixed(2)}` : '-'}
                          {charge.processingFee && charge.processingFee > 0 && <span className="mt-4">+${charge.processingFee.toFixed(2)}</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            ))}

            {updatedTravelData?.reservationAdditionalFees?.map((additionalFee: ReservationAdditionalFees, index: number) => (
              <Fragment key={index}>
                {additionalFee?.waiveFees?.map((fee: TWaiveFeesItem, index: number) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell>{fee?.description ?? '-'}</TableCell>
                      <TableCell align="right" className="text-error">
                        {fee?.amount ? `-$${fee?.amount?.toFixed(2)}` : '-'}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </Fragment>
            ))}

            {/* Subtotal */}
            <TableRow className="w-full">
              <TableCell align="right" colSpan={2} className="font-bold text-md text-right border-none pb-0">
                {`Subtotal: $${invoiceSubtotal?.toFixed(2)}`}
              </TableCell>
            </TableRow>

            {/* Voucher Discount Row  */}
            {voucherDiscountRow && (
              <TableRow className="w-full mb-2">
                <TableCell align="right" colSpan={2} className="font-bold text-md text-right border-none pb-0">
                  {voucherDiscountRow.label}: <span className="text-error">{voucherDiscountRow?.amount}</span>
                </TableCell>
              </TableRow>
            )}

            {/* Used Credit */}

            {/* {Number(creditAmountUsed || 0) > 0 && (
              <TableRow className="w-full mb-2">
                <TableCell align="right" colSpan={2} className="font-bold text-md text-right border-none pb-0">
                  Used Credit: <span className="text-black">-${convertToThousandSeparator(creditAmountUsed)}</span>
                </TableCell>
              </TableRow>
            )} */}
            {/* Total paid amount */}
            <TableRow className="w-full ">
              <TableCell align="right" colSpan={2} className="font-bold text-md text-right border-none pb-0">
                <span className="font-bold text-md text-success">{`Paid: $${invoiceTotalPaid?.toFixed(2)}`}</span>
              </TableCell>
            </TableRow>

            {/* Rent due amount */}
            {rentDueAmount > 0 && (
              <TableRow className="w-full border-none">
                <TableCell align="right" colSpan={2} className="font-bold text-md text-error text-right py-1 border-none">
                  <span className="pr-1">{`Rent Due: $${rentDueAmount?.toFixed(2)}`}</span>
                </TableCell>
              </TableRow>
            )}

            {/* Additional Fee Due amount */}

            {(updatedTravelData?.reservationAdditionalFees ?? [])?.length > 0 && (
              <TableRow className="w-full border-none">
                <TableCell align="right" colSpan={2} className="font-bold text-md text-error text-right py-1 border-none">
                  <span className="pr-1">
                    {`Additional Fee Due: $`}
                    {additionalFeeDue?.toFixed(2)}
                  </span>

                  {additionalFeeDue > 0 && updatedTravelData?.isUserGuest && !isTravelUpdatedPage && (
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/additionalFee/${travelId}`)}
                    >
                      Pay
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}

            {(isVehiclePayable || isCoveragePayable) && updatedTravelData?.isUserGuest && !isTravelUpdatedPage && (
              <ModificationBilling
                vehicleFee={vehicleFee}
                coverageFee={coverageFee}
                isCoveragePayable={isCoveragePayable}
                isVehiclePayable={isVehiclePayable}
                travelId={travelId}
              />
            )}
            {/* Show Refundable, Refunded, Credited Amount conditionally */}
            {/* {updatedTravelData?.basePrice?.refundableAmount && (
              <TravelBillingCommonAmount
                amount={updatedTravelData?.basePrice?.refundableAmount ?? 0}
                titleText={getUpdatedTravelReturnAmountText(updatedTravelData?.paymentStatus)}
              ></TravelBillingCommonAmount>
            )} */}
          </TableBody>
        </Table>
        {updatedTravelData?.revisedVehicleCreditedAmount ||
        updatedTravelData?.revisedVehicleDiscountAmount ||
        updatedTravelData?.revisedCoverageCreditedAmount ? (
          <TravelRequestUpdate
            revisedVehicleCreditedAmount={updatedTravelData?.revisedVehicleCreditedAmount ?? 0}
            revisedVehicleDiscountAmount={updatedTravelData?.revisedVehicleDiscountAmount ?? 0}
            revisedCoverageCreditedAmount={updatedTravelData?.revisedCoverageCreditedAmount ?? 0}
          />
        ) : (
          ''
        )}

        {/* Show hold deposit details */}
        {hasHoldDeposit && (
          <TravelHoldDepositInfo reservationHoldTransaction={holdPaymentTransaction} depositAmount={depositAmount}></TravelHoldDepositInfo>
        )}

        {/* Show travel cancellation details if return amount or cancellation fee exists */}
        {hasCancellationFeeOrRefund && (
          <TravelCancellationInfo cancellationInfo={updatedTravelData?.cancellationInfo ?? ({} as CancellationInfo)}></TravelCancellationInfo>
        )}
        {paymentTransactionHistory && paymentTransactionHistory?.length > 0 && (
          <InvoicePaymentHistory paymentTransactionHistory={paymentTransactionHistory} totalReturnedAmount={totalReturnedAmount} />
        )}
      </TableContainer>
    </div>
  );
};

export default TravelBilling;
