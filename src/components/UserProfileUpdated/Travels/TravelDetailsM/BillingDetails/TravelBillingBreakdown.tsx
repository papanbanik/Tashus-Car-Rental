'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { EPriceAdjustment } from '@/types/commonTypes';
import { Bill } from '@/types/profileInfoTypes';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { CancellationInfo } from '@/types/travels/typeTravels';
import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { getPaymentStatus } from '@/utils/Functions/priceListFn';
import { separateAndCapitalize } from '@/utils/Functions/randomCommonFn';
import { getPaymentMethod, getRefundPaymentMethod } from '@/utils/Functions/travelCommonFn';
import { Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import TableDivider from '../TableDivider';
import TravelBillingCommonAmountM from '../TravelBillingCommonAmountM';
import TravelCancellationInfoM from './TravelCancelationInfoM';
import TravelPaymentDetails from './TravelPaymentDetails';

const TravelBillingBreakdown = ({ reservationInfo, reservationItem, isModal }: any & { isModal?: boolean }) => {
  const [billingData, setBillingData] = useState<Bill[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { travelDetails } = useProfileInfoContext();

  const vehicleDeliveryFee =
    (travelDetails?.reservationInfo?.basePrice?.totalDeliveryFee ?? 0) - (travelDetails?.reservationInfo?.basePrice?.deliveryFeeDiscount ?? 0);
  const vehicleReturnFee =
    (travelDetails?.reservationInfo?.basePrice?.totalReturnFee ?? 0) - (travelDetails?.reservationInfo?.basePrice?.returnFeeDiscount ?? 0);

  const finalDeliveryCost = parseFloat((vehicleDeliveryFee + vehicleReturnFee).toFixed(2));

  const paymentStatus: string = !!reservationItem
    ? getPaymentStatus(reservationItem?.updatedAt, reservationItem?.paymentStatus, reservationInfo?.reservationStatus)
    : getPaymentStatus(reservationInfo?.updatedAt, reservationInfo?.paymentStatus, reservationInfo?.reservationStatus);

  useEffect(() => {
    if (reservationInfo) {
      let tempPaidTotal = !!reservationItem ? reservationItem?.basePrice?.totalPrice : reservationInfo?.basePrice?.totalPrice;
      tempPaidTotal = tempPaidTotal + finalDeliveryCost;
      const travelDuration = !!reservationItem
        ? getDurationDayHourMin(reservationItem?.newStartDate, reservationItem?.newEndDate)
        : getDurationDayHourMin(reservationInfo?.pickupDate, reservationInfo?.returnDate);
      const voucherDiscount = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.voucherAmountUsed
        : reservationInfo?.additionalPaymentInfo?.voucherAmountUsed || 0;
      const creditUsed = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.creditAmountUsed
        : reservationInfo?.additionalPaymentInfo?.creditAmountUsed || 0;
      const travelDurationPrice = !!reservationItem ? reservationItem?.basePrice?.durationPrice : reservationInfo?.basePrice?.durationPrice;
      // const peakIncrease = !!reservationItem
      //   ? reservationItem?.peakIncrease?.calculatedAmount || 0
      //   : reservationInfo?.peakIncrease?.calculatedAmount || 0;
      // const servicePercentage = !!reservationItem ? reservationItem?.serviceFeePercentage : reservationInfo?.serviceFeePercentage;
      // const serviceFee = !!reservationItem ? reservationItem?.basePrice?.serviceFeeAmount || 0 : reservationInfo?.basePrice?.serviceFeeAmount || 0;
      // const longBookingDiscounts = !!reservationItem
      //   ? reservationItem?.discounts?.customLongDiscountAmount ?? reservationItem?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0
      //   : reservationInfo?.discounts?.customLongDiscountAmount ?? reservationInfo?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0;
      const customLongBookingDiscounts = !!reservationItem
        ? reservationItem?.discounts?.customLongDiscountAmount ?? 0
        : reservationInfo?.discounts?.customLongDiscountAmount ?? 0;
      const longBookingDiscounts = !!reservationItem
        ? reservationItem?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0
        : reservationInfo?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0;
      // const longBookingDiscounts = !!reservationItem
      //   ? reservationItem?.discounts?.customLongDiscountAmount && !reservationItem?.discounts?.longBookingDiscounts?.duration
      //     ? reservationItem?.discounts?.customLongDiscountAmount + (reservationItem?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0)
      //     : reservationItem?.discounts?.customLongDiscountAmount ?? reservationItem?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0
      //   : reservationInfo?.discounts?.customLongDiscountAmount && !reservationInfo?.discounts?.longBookingDiscounts?.duration
      //   ? reservationInfo?.discounts?.customLongDiscountAmount + (reservationInfo?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0)
      //   : reservationInfo?.discounts?.customLongDiscountAmount ?? reservationInfo?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0;

      const earlyBookingDiscounts = !!reservationItem
        ? reservationItem?.discounts?.customAdvanceDiscountAmount ?? reservationItem?.discounts?.advanceBookingDiscounts?.calculatedAmount ?? 0
        : reservationInfo?.discounts?.customAdvanceDiscountAmount ?? reservationInfo?.discounts?.advanceBookingDiscounts?.calculatedAmount ?? 0;
      const coverageAmount = !!reservationItem ? reservationItem?.basePrice?.coverageAmount || 0 : reservationInfo?.basePrice?.coverageAmount || 0;
      const gstAmount = !!reservationItem ? reservationItem?.basePrice?.gstAmount || 0 : reservationInfo?.basePrice?.gstAmount || 0;
      // const depositAmount = !!reservationItem ? reservationInfo?.reservationInfo?.depositAmount || 0 : reservationInfo?.depositAmount || 0;
      const inconvenienceFee = !!reservationItem ? reservationItem?.basePrice?.penaltyPrice : reservationInfo?.basePrice?.penaltyPrice;
      const waivedPayableAmount = !!reservationItem
        ? reservationItem?.basePrice?.waivedPayableAmount
        : reservationInfo?.basePrice?.waivedPayableAmount;
      const penaltyReason = reservationInfo?.basePrice?.penaltyReason ?? '';
      const totalFare = !!reservationItem ? reservationItem?.basePrice?.totalPrice : reservationInfo?.basePrice?.totalPrice;
      // console.log('Early Booking', earlyBookingDiscounts);
      const priceAdjustmentType = !!reservationItem
        ? reservationItem?.basePrice?.priceAdjustment?.adjustmentType
        : reservationInfo?.basePrice?.priceAdjustment?.adjustmentType;
      const priceAdjustmentReason = !!reservationItem
        ? reservationItem?.basePrice?.priceAdjustment?.reason
        : reservationInfo?.basePrice?.priceAdjustment?.reason;
      const priceAdjustmentAmount = !!reservationItem
        ? reservationItem?.basePrice?.priceAdjustment?.amount
        : reservationInfo?.basePrice?.priceAdjustment?.amount;
      // console.log(reservationInfo?.basePrice?.priceAdjustment?.amount);
      const newBillingData: Bill[] = [
        {
          amountType: 'increase',
          label: travelDuration,
          amount: `+$${travelDurationPrice?.toFixed(2)}`,
        },
        // {
        //   amountType: 'increase',
        //   label: 'Peak Increase',
        //   amount: `+$${peakIncrease.toFixed(2) ?? 0}`,
        // },
        // {
        //   amountType: 'increase',
        //   label: `${servicePercentage}% Service Fee`,
        //   amount: `+$${serviceFee.toFixed(2) ?? 0}`,
        // },
        longBookingDiscounts > 0 && {
          amountType: 'decrease',
          label: 'Long Reservation Discount',
          amount: `-$${longBookingDiscounts.toFixed(2)}`,
        },
        customLongBookingDiscounts > 0 && {
          amountType: 'decrease',
          label: 'Special Long Reservation Discount',
          amount: `-$${parseFloatWithPrecision(customLongBookingDiscounts)}`,
        },
        earlyBookingDiscounts > 0 && {
          amountType: 'decrease',
          label: 'Early Reservation Discount',
          amount: `-$${earlyBookingDiscounts.toFixed(2)}`,
        },
        {
          amountType: 'increase',
          label: 'Coverage Amount',
          amount: `+$${coverageAmount.toFixed(2) ?? 0}`,
        },
        gstAmount > 0 && {
          amountType: 'increase',
          label: 'GST',
          amount: `+$${gstAmount.toFixed(2) ?? 0}`,
          helpingText: voucherDiscount > 0 ? `After applying $${voucherDiscount?.toFixed(2)} voucher discount` : '',
          useBorder: (inconvenienceFee ?? 0) > 0 ? false : true,
        },
        // {
        //   amountType: 'increase',
        //   label: 'Deposit Amount',
        //   amount: `+$${depositAmount?.toFixed(2) || 0}`,
        //   useBorder: (inconvenienceFee ?? 0) > 0 ? false : true,
        // },
        (inconvenienceFee ?? 0) > 0 && {
          amountType: 'increase',
          label: 'Inconvenience Fee',
          amount: `+$${inconvenienceFee ?? 0}`,
          useBorder: (waivedPayableAmount ?? 0) > 0 ? false : true,
          helpingText: penaltyReason,
        },
        (waivedPayableAmount ?? 0) > 0 && {
          amountType: 'decrease',
          label: 'Travel Update Waived',
          amount: `-$${waivedPayableAmount?.toFixed(2) || 0}`,
          useBorder: true,
        },
        {
          amountType: 'general',
          label: 'Total Fare',
          amount: `$${totalFare?.toFixed(2)}`,
        },
      ].filter(Boolean) as any[];

      if (voucherDiscount > 0) {
        const voucherData: Bill = {
          amountType: 'decrease',
          label: 'Voucher Discount',
          amount: `-$${voucherDiscount?.toFixed(2)}`,
          useBorder: true,
        };
        tempPaidTotal = tempPaidTotal - voucherDiscount;
        newBillingData.push(voucherData);
      }
      if (creditUsed > 0) {
        const creditData: Bill = {
          amountType: 'general',
          label: 'Used Credit',
          amount: `-$${creditUsed?.toFixed(2)}`,
          useBorder: true,
        };
        tempPaidTotal = tempPaidTotal - creditUsed;
        newBillingData.push(creditData);
      }
      if (priceAdjustmentAmount > 0) {
        const priceAdjustmentData: Bill = {
          amountType: priceAdjustmentType === EPriceAdjustment.Increase ? 'increase' : 'decrease',
          label: priceAdjustmentReason,
          amount: `${priceAdjustmentType === EPriceAdjustment.Increase ? '+' : '-'}$${priceAdjustmentAmount?.toFixed(2)}`,
          useBorder: true,
        };
        tempPaidTotal =
          priceAdjustmentType === EPriceAdjustment.Increase ? tempPaidTotal + priceAdjustmentAmount : tempPaidTotal - priceAdjustmentAmount;
        newBillingData.push(priceAdjustmentData);
      }
      setBillingData(newBillingData);
      setTotalAmount(tempPaidTotal);
    }
  }, [reservationInfo]);

  const depositAmount = !!reservationItem ? reservationItem?.depositAmount || 0 : reservationInfo?.depositAmount || 0;
  const refundableAmount = !!reservationItem ? reservationItem?.basePrice?.refundableAmount || 0 : reservationInfo?.basePrice?.refundableAmount;
  const cancellationInfo = !!reservationItem ? reservationInfo?.reservationInfo?.cancellationInfo : reservationInfo?.cancellationInfo;
  const refundStatus = !!reservationItem ? reservationItem?.paymentStatus : reservationInfo?.paymentStatus;
  const hasCancellationFeeOrRefund: boolean = (cancellationInfo?.returnAmount ?? 0) > 0 || (cancellationInfo?.guestInconvenienceFee ?? 0) > 0;

  //Revised Vehicle or Coverage Amount
  const revisedCreditedAmount = !!reservationItem ? 0 : reservationInfo?.revisedVehicleCreditedAmount;
  const revisedPayableAmount = !!reservationItem ? 0 : reservationInfo?.revisedVehiclePayableAmount;
  const revisedDiscountAmount = !!reservationItem ? 0 : reservationInfo?.revisedVehicleDiscountAmount;
  const revisedCoverageAmount = !!reservationItem ? 0 : reservationInfo?.revisedCoveragePayableAmount;
  const revisedCoverageStatus = !!reservationItem ? 0 : reservationInfo?.revisedCoveragePaymentStatus;
  const revisedVehicleStatus = !!reservationItem ? 0 : reservationInfo?.revisedVehiclePaymentStatus;

  const pendingStatus = [EPaymentStatus.Pending, EPaymentStatus.PendingCharge];

  const coveragePaymentDue = pendingStatus?.includes(revisedCoverageStatus);
  const vehiclePaymentDue = pendingStatus?.includes(revisedVehicleStatus);

  const payableAmount =
    reservationInfo?.basePrice?.payableAmount > 0
      ? parseFloat(((reservationInfo?.basePrice?.previousPayableAmount ?? 0) + (reservationInfo?.basePrice?.payableAmount ?? 0))?.toFixed(2))
      : parseFloat((totalAmount ?? 0)?.toFixed(2));

  const { openModal } = useModalContext();

  return (
    <div className="border border-solid border-accent p-4 rounded-lg">
      <div className="flex flex-col">
        {/* Title, Payment Status and Payment Method */}
        {isModal ? '' : <div className="flex justify-between items-center"></div>}

        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center w-full my-2`}>
          <div>
            <span className="flex items-center gap-2 font-bold">
              <span className="text-primary">Payment Status : </span>
              <Chip label={separateAndCapitalize(paymentStatus)} color="success" size="small" />
            </span>
          </div>
          {paymentStatus === EPaymentStatus.Paid && (
            <div className="mt-2.5 sm:mt-0">
              <span className="flex items-center gap-2 font-bold">
                <span className="text-primary">Payment Method : </span>
                <Chip
                  label={!!reservationItem ? getPaymentMethod(reservationItem?.paymentMethod) : getPaymentMethod(reservationInfo?.paymentMethod)}
                  color="success"
                  size="small"
                />
              </span>
            </div>
          )}
          {paymentStatus === EPaymentStatus.Refunded && (
            <div>
              <span className="flex items-center gap-2 font-bold">
                <span className="text-primary">Refund Method : </span>
                <Chip
                  label={
                    !!reservationItem
                      ? getRefundPaymentMethod(reservationItem?.paymentMethod)
                      : getRefundPaymentMethod(reservationInfo?.paymentMethod)
                  }
                  color="success"
                  size="small"
                />
              </span>
            </div>
          )}
        </div>

        <TableContainer component={Paper} className="bg-transparent">
          <Table>
            <TableBody>
              {billingData.map((item, index) => (
                <Fragment key={index}>
                  {item.label === 'Total Fare' && <TableDivider />}
                  <TableRow
                    // key={index}
                    className={`${item.label === 'Total Fare' ? 'transparent' : index % 2 === 0 ? 'bg-[#ececec]' : 'bg-[#fafafa]'} `}
                    // style={{
                    //   borderBottom: item?.useBorder ? 'solid 2px gray' : '',
                    //   backgroundColor:
                    //     item.label === 'Peak Increase' ||
                    //     item.label === travelDuration ||
                    //     item.label === 'Long Reservation Discount' ||
                    //     item.label === 'Early Reservation Discount'
                    //       ? `${highlightColor}`
                    //       : '',
                    //   borderRadius:
                    //     item.label === 'Peak Increase' ||
                    //     item.label === travelDuration ||
                    //     item.label === 'Long Reservation Discount' ||
                    //     item.label === 'Early Reservation Discount'
                    //       ? '10px'
                    //       : '0px',
                    // }}
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
                </Fragment>
              ))}
              <TableDivider />
              {(vehicleDeliveryFee ?? 0) > 0 && (
                <>
                  <TravelBillingCommonAmountM
                    amount={`+$${vehicleDeliveryFee?.toFixed(2) || 0}`}
                    titleText={`Delivery Fee`}
                    textStyle="font-normal"
                    amountTextStyle="font-normal text-success"
                    rowStyle="w-full bg-[#ececec]"
                  />
                  {(vehicleReturnFee ?? 0) > 0 ? '' : <TableDivider />}
                </>
              )}
              {(vehicleReturnFee ?? 0) > 0 && (
                <>
                  <TravelBillingCommonAmountM
                    amount={`+$${vehicleReturnFee?.toFixed(2) || 0}`}
                    titleText={`Return Fee`}
                    textStyle="font-normal"
                    amountTextStyle="font-normal text-success"
                    rowStyle="w-full bg-[#fafafa]"
                  />
                  <TableDivider />
                </>
              )}
              <TravelBillingCommonAmountM
                amount={parseFloat((totalAmount ?? 0)?.toFixed(2))}
                titleText={`${paymentStatus === 'paid' ? 'Paid ' : ''}Total:`}
                textStyle="font-bold text-success"
              />
              {(paymentStatus === EPaymentStatus.Pending || paymentStatus === EPaymentStatus.PendingCharge) && (
                <TravelBillingCommonAmountM amount={payableAmount} titleText="Rent Due:" textStyle="font-bold text-error" />
              )}
              <TravelBillingCommonAmountM
                amount={`$${depositAmount?.toFixed(2)}`}
                titleText="Hold Amount:"
                // textStyle="font-bold bg-blue-100"
              />
              {refundableAmount > 0 && <TableDivider />}
              {/* Add Refundable Amount */}
              {refundableAmount && refundStatus === 'refundable' ? (
                <TravelBillingCommonAmountM amount={parseFloat((refundableAmount ?? 0).toFixed(2))} titleText="Refundable Amount" />
              ) : (
                ''
              )}

              {/* Add Refunded Amount */}
              {refundableAmount && refundStatus === 'refunded' ? (
                <TravelBillingCommonAmountM amount={parseFloat((refundableAmount ?? 0).toFixed(2))} titleText="Refunded Amount" />
              ) : (
                ''
              )}

              {/* Add Credited Amount */}
              {refundableAmount && refundStatus === 'refundedAsCredit' ? (
                <TravelBillingCommonAmountM amount={parseFloat((refundableAmount ?? 0).toFixed(2))} titleText="Credited Amount" />
              ) : (
                ''
              )}
              {/* Revised Coverage or Vehicle */}
              {/* Vehicle Credited Amount */}
              {revisedCreditedAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloat((revisedCreditedAmount ?? 0).toFixed(2))}
                  titleText="Credited Amount (Vehicle Replacement)"
                  textStyle=""
                />
              )}

              {/* Vehicle Payable Amount */}
              {revisedPayableAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloat((revisedPayableAmount ?? 0).toFixed(2))}
                  titleText={`${vehiclePaymentDue ? 'Due' : ''} Payable Amount (Vehicle Replacement)`}
                  textStyle={`${vehiclePaymentDue ? 'text-error' : ''}`}
                />
              )}

              {/*Vehicle Discount Amount*/}
              {revisedDiscountAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloat((revisedDiscountAmount ?? 0).toFixed(2))}
                  titleText="Discount Amount (Vehicle Replacement)"
                />
              )}
              {/*Coverage Payable Amount*/}
              {revisedCoverageAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloat((revisedCoverageAmount ?? 0).toFixed(2))}
                  titleText={`${coveragePaymentDue ? 'Due' : ''} Payable Amount (Update Coverage)`}
                  textStyle={`${coveragePaymentDue ? 'text-error' : ''}`}
                />
              )}
            </TableBody>
          </Table>
          {/* Show travel cancellation info if return amount or cancellation fee exists */}
          {hasCancellationFeeOrRefund ? <TravelCancellationInfoM cancellationInfo={cancellationInfo ?? ({} as CancellationInfo)} /> : ''}
          {isModal && <TravelPaymentDetails reservationInfo={reservationInfo} reservationItem={reservationItem} isModal={isModal} />}
        </TableContainer>
      </div>
    </div>
  );
};

export default TravelBillingBreakdown;
