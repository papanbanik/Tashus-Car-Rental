import { TAdditionalPaymentInfo, TBasePrice, TTravelDiscounts } from '@/types/travels/typeTravels';
import { TReplacementVehicleInfo, TUpgradedCoverageInfo } from './allHistoryFn';
import { Fragment, useEffect, useState } from 'react';
import { Bill } from '@/types/profileInfoTypes';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { EPriceAdjustment } from '@/types/commonTypes';
import { Chip, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { separateAndCapitalize } from '@/utils/Functions/randomCommonFn';
import { getPaymentMethod } from '@/utils/Functions/travelCommonFn';
import TableDivider from '../TableDivider';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import TravelBillingCommonAmountM from '../TravelBillingCommonAmountM';

const RevisedBillingBreakdown = ({
  basePrice,
  travelDuration,
  additionalPaymentInfo,
  discounts,
  replacementVehicleInfo,
  upgradedCoverageInfo,
}: {
  basePrice: TBasePrice;
  travelDuration: string;
  additionalPaymentInfo: TAdditionalPaymentInfo;
  discounts?: TTravelDiscounts;
  replacementVehicleInfo?: TReplacementVehicleInfo;
  upgradedCoverageInfo?: TUpgradedCoverageInfo;
}) => {
  const [billingData, setBillingData] = useState<Bill[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const {
    paymentStatus: vehiclePaymentStatus,
    paymentMethod: vehiclePaymentMethod,
    creditedAmount = 0,
    discountAmount = 0,
    payableAmount = 0,
  } = replacementVehicleInfo ?? {};
  const { paymentStatus: coveragePaymentStatus, paymentMethod: coveragePaymentMethod, dueAmount = 0 } = upgradedCoverageInfo ?? {};
  const paymentStatus = vehiclePaymentStatus ?? coveragePaymentStatus ?? '';
  const paymentMethod = vehiclePaymentMethod ?? coveragePaymentMethod ?? '';
  const {
    totalPrice,
    durationPrice,
    coverageAmount = 0,
    gstAmount = 0,
    penaltyPrice: inconvenienceFee = 0,
    penaltyReason,
    waivedPayableAmount,
    waivedPenaltyPrice,
    priceAdjustment,
    deliveryFeeDiscount = 0,
    returnFeeDiscount = 0,
    totalDeliveryFee = 0,
    totalReturnFee = 0,
  } = basePrice ?? {};

  const vehicleDeliveryFee = (totalDeliveryFee ?? 0) - (deliveryFeeDiscount ?? 0);
  const vehicleReturnFee = (totalReturnFee ?? 0) - (returnFeeDiscount ?? 0);
  const finalDeliveryCost = parseFloatWithPrecision(vehicleDeliveryFee + vehicleReturnFee);

  const { adjustmentType: priceAdjustmentType, reason: priceAdjustmentReason, amount: priceAdjustmentAmount = 0 } = priceAdjustment ?? {};
  const { voucherAmountUsed: voucherDiscount = 0, creditAmountUsed: creditUsed = 0 } = additionalPaymentInfo ?? {};
  const { longBookingDiscounts, advanceBookingDiscounts, customLongDiscountAmount, customAdvanceDiscountAmount } = discounts ?? {};
  const longDiscount = customLongDiscountAmount ?? longBookingDiscounts?.calculatedAmount ?? 0;
  const advanceDiscount = customAdvanceDiscountAmount ?? advanceBookingDiscounts?.calculatedAmount ?? 0;
  const pendingStatus = [EPaymentStatus.Pending, EPaymentStatus.PendingCharge];

  const paymentDue = pendingStatus?.includes(paymentStatus as EPaymentStatus);

  useEffect(() => {
    if (basePrice) {
      let tempPaidTotal = totalPrice;
      tempPaidTotal = tempPaidTotal + finalDeliveryCost;
      const newBillingData: Bill[] = [
        {
          amountType: 'increase',
          label: `${!!travelDuration ? travelDuration : 'Duration Price'}`,
          amount: `+$${parseFloatWithPrecision(durationPrice)}`,
        },
        longDiscount > 0 && {
          amountType: 'decrease',
          label: 'Long Reservation Discount',
          amount: `-$${parseFloatWithPrecision(longDiscount)}`,
        },
        advanceDiscount > 0 && {
          amountType: 'decrease',
          label: 'Early Reservation Discount',
          amount: `-$${parseFloatWithPrecision(advanceDiscount)}`,
        },
        {
          amountType: 'increase',
          label: 'Coverage Amount',
          amount: `+$${parseFloatWithPrecision(coverageAmount)}`,
        },
        gstAmount > 0 && {
          amountType: 'increase',
          label: 'GST',
          amount: `+$${gstAmount.toFixed(2) ?? 0}`,
          helpingText: voucherDiscount > 0 ? `After applying $${voucherDiscount?.toFixed(2)} voucher discount` : '',
          useBorder: (inconvenienceFee ?? 0) > 0 ? false : true,
        },
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
          amount: `$${totalPrice?.toFixed(2)}`,
        },
      ].filter(Boolean) as any[];

      if (voucherDiscount > 0) {
        const voucherData: Bill = {
          amountType: 'decrease',
          label: 'Voucher Discount',
          amount: `-$${parseFloatWithPrecision(voucherDiscount)}`,
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
          label: priceAdjustmentReason ?? '',
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
  }, [basePrice]);
  return (
    <div className="my-1">
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Previous Billing Details</span>
      </span>
      <Divider className="border border-black my-1" />
      <div className="flex flex-col">
        {/* Title, Payment Status and Payment Method */}
        <div className={`flex justify-between items-center w-full my-2`}>
          {!!paymentStatus && (
            <div>
              <span className="flex items-center gap-2 font-bold">
                <span className="text-primary">Payment Status : </span>
                <Chip label={separateAndCapitalize(paymentStatus as string)} color="success" size="small" />
              </span>
            </div>
          )}
          {!!paymentMethod && paymentStatus === EPaymentStatus.Paid && (
            <div>
              <span className="flex items-center gap-2 font-bold">
                <span className="text-primary">Payment Method : </span>
                <Chip label={getPaymentMethod(paymentMethod as string)} color="success" size="small" />
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
                  <TableRow className={`${item.label === 'Total Fare' ? 'transparent' : index % 2 === 0 ? 'bg-[#ececec]' : 'bg-[#fafafa]'} `}>
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
              {/* Revised Coverage or Vehicle */}
              {/* Vehicle Credited Amount */}
              {creditedAmount > 0 && (
                <TravelBillingCommonAmountM amount={parseFloatWithPrecision(creditedAmount)} titleText="Credited Amount (Vehicle Replacement)" />
              )}

              {/* Vehicle Payable Amount */}
              {payableAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloatWithPrecision(payableAmount)}
                  titleText={`${paymentDue ? 'Due' : ''} Payable Amount (Vehicle Replacement)`}
                  textStyle={`${paymentDue ? 'text-error' : ''}`}
                />
              )}

              {/*Vehicle Discount Amount*/}
              {discountAmount > 0 && (
                <TravelBillingCommonAmountM amount={parseFloatWithPrecision(discountAmount)} titleText="Discount Amount (Vehicle Replacement)" />
              )}
              {/*Coverage Payable Amount*/}
              {dueAmount > 0 && (
                <TravelBillingCommonAmountM
                  amount={parseFloatWithPrecision(dueAmount)}
                  titleText={`${paymentDue ? 'Due' : ''} Payable Amount (Update Coverage)`}
                  textStyle={`${paymentDue ? 'text-error' : ''}`}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default RevisedBillingBreakdown;
