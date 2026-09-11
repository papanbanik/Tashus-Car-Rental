import CommonTooltip from '@/components/Common/CommonTooltip';
import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useTravelEdit } from '@/hooks/travel/useTravelEdit';
import { EPriceAdjustment, ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { TRevisedReservation } from '@/types/travels/typeTravels';
import { IExtendBilling } from '@/types/user-profile/customPriceTypes';
import { calculateWithPrecision, parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { isTravelCurrent } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc } from '@/utils/Functions/utcCommonFn';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import Typography from '@mui/material/Typography/Typography';
import dayjs from 'dayjs';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoInfo } from 'react-icons/go';
import { LuBadgeInfo } from 'react-icons/lu';
import BillingPriceBreakdown from './BillingDetailsBreakdown.tsx/BillingPriceBreakdown';
import CompareBilling from './ExtendBilling/CompareBilling';
import PreviousBilling from './ExtendBilling/PreviousBilling';
import UpdatedBilling from './ExtendBilling/UpdatedBilling';
import VoucherRulesDisplay from './ExtendBilling/VoucherRulesDisplay';
const ExtendBillingUpdated = ({ billingDetails }: IExtendBilling) => {
  const { userId: guestId, travelId } = useParams<{ userId: string; travelId: string }>();
  const router = useRouter();
  const pathName = usePathname();
  const { watch, control } = useForm({
    mode: 'onChange',
  });
  const { mutateAsync } = useTravelEdit();
  const { openModal, closeModal } = useModalContext();
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  const [isCompare, setIsCompare] = useState<boolean>(false);
  //Destruct Billing Details
  const {
    payableAmount = 0,
    refundableAmount = 0,
    refundText,
    paidText,
    newStartDate,
    newEndDate,
    totalDurationHours,
    additionalPaymentInfo: billingAdditionalPayment,
    discountsInfo,
    dailyPrice: newDailyPrice,
    hourlyPrice: newHourlyPrice,
    newDurationPrice,
    newTotalPrice,
    currency,
    newCoverageAmount,
    newGstAmount,
    penaltyPrice: newPenaltyPrice = 0,
    previousPenaltyPrice = 0,
    inconvenienceToolTip,
    additionalDistanceFeePerKm,
    waivedPenaltyPrice = 0,
    waivedPayableAmount = 0,
    newLongBookingDis,
    newPeakIncPrice,
    priceAdjustment: billingPriceAdjustment,
    previousLongBookingDiscount = 0,
  } = billingDetails ?? {};
  const { adjustmentType, reason: adjustmentReason, amount: adjustmentAmount } = billingPriceAdjustment ?? {};
  //Destruct Travel Details
  const { isEndedByGuest, reservationStatus, reservationInfo, carInfo } = travelDetails;
  const { voucherInfo, additionalPaymentInfo: initialAdditionalPaymentInfo } = reservationInfo ?? {};
  const { voucherAmountUsed: initialVoucherAmountUsed = 0 } = initialAdditionalPaymentInfo ?? {};
  const { voucherRules = [], discountAmount = 0, discountType = '' } = voucherInfo ?? {};
  const { carNickName, car } = carInfo || {};
  const { licensePlate, make, model } = car || {};
  const carName = `${make} ${model} - ${carNickName} [${licensePlate}]`;
  //Destruct Updated Travel Data
  const {
    basePrice,
    additionalPaymentInfo,
    pickupDate,
    totalPaidAmount = 0,
    totalReturnedAmount = 0,
    revisedCoveragePaymentStatus,
    revisedVehiclePaymentStatus,
    discounts,
  } = updatedTravelData;
  const { totalPrice, priceAdjustment, coverageAmount, gstAmount, penaltyPrice } = basePrice;
  const { longBookingDiscounts } = discounts || {};
  const { voucherAmountUsed = 0 } = additionalPaymentInfo ?? {};
  const hasVoucher = voucherAmountUsed > 0;

  const oldGstText = (gstAmount ?? 0) > 0 ? `GST: $${gstAmount}` : '';
  const oldCoverageText = (coverageAmount ?? 0) > 0 ? `Coverage: $${coverageAmount}, ` : '';
  const paidBeforeAdjustmentAmount = totalPrice - voucherAmountUsed;
  const paidAmount =
    priceAdjustment?.adjustmentType === EPriceAdjustment.Increase
      ? paidBeforeAdjustmentAmount + (priceAdjustment?.amount ?? 0)
      : paidBeforeAdjustmentAmount - (priceAdjustment?.amount ?? 0);
  const actualPaidAmount = parseFloatWithPrecision(totalPaidAmount - totalReturnedAmount);
  const extraFees = (coverageAmount ?? 0) + (gstAmount ?? 0) + (penaltyPrice ?? 0);
  const previousReservationAmount = parseFloat(totalPrice?.toFixed(2)) - parseFloat(extraFees?.toFixed(2));

  const warningNote =
    actualPaidAmount === parseFloatWithPrecision(refundableAmount) &&
    (revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Pending || revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Pending)
      ? 'Please clear any outstanding payments to receive your refund, as the refund will only include the amount you have already paid.'
      : '';
  // console.log({ extraFees, previousReservationAmount });

  const handleSaveEditTravel = async () => {
    // console.log(billingDetails);
    // filter reservation dates included custom price
    const updatedCustomPriceList =
      billingDetails?.customPrices?.filter((price) => dayjsUtc(price?.date).isBetween(dayjsUtc(newStartDate), dayjsUtc(newEndDate), 'date', '[]')) ??
      [];
    // console.log(updatedCustomPriceList);
    const paymentStatus = refundableAmount > 0 ? 'refundable' : payableAmount > 0 ? 'pending' : 'paid';
    const newTotalPriceWithoutAdjustment =
      !!priceAdjustment?.adjustmentType && (priceAdjustment?.amount ?? 0) > 0
        ? calculateWithPrecision(priceAdjustment?.adjustmentType === EPriceAdjustment.Decrease ? 'add' : 'subtract', [
            newTotalPrice,
            priceAdjustment?.amount ?? 0,
          ])
        : newTotalPrice;
    const newTotalPriceWithWaived = parseFloatWithPrecision(newTotalPriceWithoutAdjustment - waivedPayableAmount);
    let revisedReservationData: TRevisedReservation = {
      newStartDate: newStartDate,
      newEndDate: newEndDate,
      totalDurationHours: totalDurationHours,
      basePrice: {
        dailyPrice: newDailyPrice,
        hourlyPrice: newHourlyPrice,
        totalPrice: newTotalPriceWithWaived,
        durationPrice: newDurationPrice,
        customPrices: updatedCustomPriceList ?? [],
        currency: currency,
        // serviceFeeAmount: billingDetails?.newServiceFee,
        serviceFeeAmount: 0,
        coverageAmount: newCoverageAmount,
        gstAmount: newGstAmount,
      },
      // serviceFeePercentage: billingDetails?.serviceFeePercentage,
      serviceFeePercentage: 0,
      paymentStatus,
      // paymentStatus: billingDetails?.refundableAmount && billingDetails?.refundableAmount > 0 ? 'refundable' : 'pending',
    };

    if (refundableAmount > 0) {
      revisedReservationData.basePrice.refundableAmount = refundableAmount;
      revisedReservationData.isRefundable = watch('credit') ? false : true;
    }

    if (payableAmount > 0) {
      revisedReservationData.basePrice.payableAmount = payableAmount;
      revisedReservationData.additionalPaymentInfo = { cardAmountUsed: payableAmount };
      revisedReservationData.paymentMethod = 'onlyCard';
    }

    if (newPenaltyPrice > 0 || previousPenaltyPrice > 0) {
      revisedReservationData.basePrice.penaltyPrice = newPenaltyPrice + previousPenaltyPrice;
      revisedReservationData.basePrice.penaltyReason = inconvenienceToolTip;
    }

    if (additionalDistanceFeePerKm) {
      revisedReservationData.additionalDistanceFeePerKm = additionalDistanceFeePerKm;
    }

    if (waivedPenaltyPrice > 0) {
      revisedReservationData.basePrice.waivedPenaltyPrice = waivedPenaltyPrice;
    }
    if (adjustmentType && (adjustmentAmount ?? 0) > 0 && adjustmentReason) {
      revisedReservationData.basePrice.priceAdjustment = billingPriceAdjustment;
    }
    if (waivedPayableAmount > 0) {
      revisedReservationData.basePrice.waivedPayableAmount = waivedPayableAmount;
    }
    //pass voucher amount
    if (!!billingAdditionalPayment && !refundableAmount) {
      revisedReservationData.additionalPaymentInfo = {
        ...((billingAdditionalPayment?.voucherAmountUsed ?? 0) > 0 && {
          voucherAmountUsed: billingAdditionalPayment?.voucherAmountUsed,
        }),
        ...((payableAmount ?? 0) > 0 && { cardAmountUsed: payableAmount }),
      };
    }

    let discounts: any = {};

    // if (billingDetails?.newAdvBookingDis?.text) {
    //   const { text, ...rest } = billingDetails?.newAdvBookingDis;
    //   discounts.advanceBookingDiscounts = { ...rest };
    // }

    // if (newLongBookingDis) {
    //   const { text, ...rest } = newLongBookingDis;
    //   discounts.longBookingDiscounts = { ...rest };
    // }

    if (!newLongBookingDis && previousLongBookingDiscount > 0) {
      discounts.longBookingDiscounts = {
        ...longBookingDiscounts,
        calculatedAmount: previousLongBookingDiscount,
      };
    } else if (newLongBookingDis) {
      const calculatedAmount = parseFloatWithPrecision((newLongBookingDis?.calculatedAmount ?? 0) + previousLongBookingDiscount);
      const { text, ...rest } = newLongBookingDis;
      discounts.longBookingDiscounts = { ...rest, calculatedAmount: calculatedAmount };
    }

    if (discounts?.advanceBookingDiscounts || discounts?.longBookingDiscounts) {
      if (discountsInfo) {
        discounts.discountsInfo = discountsInfo;
      }
      revisedReservationData.discounts = discounts;
    }

    if (newPeakIncPrice?.increaseAmount) {
      revisedReservationData.peakIncrease = { ...newPeakIncPrice };
    }

    // console.log(revisedReservationData);

    try {
      //console.log('Check Revised Pass', revisedReservationData);
      await mutateAsync({ reservationId: parseInt(travelId), guestId: guestId, revisedReservationData });
      openSnackBar({
        message: 'Travel Updated Successfully',
        severity: 'success',
      });
      closeModal();
      router.back();
    } catch (error: any) {
      console.log(error);
      openSnackBar({
        message: error?.response?.data?.message || 'Error Updating Travel',
        severity: 'error',
      });
    }
  };

  const handleRefundConfirmation = (subTitle?: string) => {
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to update travel?"
          subTitle={
            (billingDetails?.refundableAmount || 0) > 0
              ? `An amount of $${billingDetails?.refundableAmount} will be refunded to the card used for payment. Please allow 3–5 business days for the transaction to process. Alternatively, you can keep the refund as credit for future travels within Tashus.`
              : ''
            // `An amount of $${billingDetails?.refundableAmount} will be refunded to you. You can take the refund as credit to use it for next travels.`
          }
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={handleSaveEditTravel}
          disagreeButtonAction={closeModal}
        >
          {(billingDetails?.refundableAmount || 0) > 0 && (
            <p className="flex flex-col justify-center items-center">
              <span>
                <CheckBox control={control} registerName="credit" label="Keep refund as credit" required={false} />
              </span>
            </p>
          )}
        </ConfirmationCheck>
      ),
    });
  };

  const handlePayConfirmation = () => {
    const subTitleText = payableAmount > 0 ? `Be informed that you have to pay $${payableAmount} after updating the travel` : '';
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to update travel?"
          subTitle={subTitleText}
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={handleSaveEditTravel}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };

  const isUpcomingTravelInvalid = (): boolean => {
    // console.log(travelType);
    const isCurrent = isTravelCurrent(pickupDate, isEndedByGuest, reservationStatus);
    const isStartSame = dayjs(pickupDate).isSame(newStartDate, 'minute');

    return isCurrent && !isStartSame;
  };

  const showInvalidWarning = () => {
    openSnackBar({
      message: 'Changing pickup time is not allowed within 2 hours',
      severity: 'warning',
    });

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const voucherText = `Thank you for updating the travel. A voucher amount of $${parseFloatWithPrecision(
    billingAdditionalPayment?.voucherAmountUsed ?? 0
  )} has been applied to the reservation, so no refund or additional payment will be necessary.`;

  const handleDetailsDisplay = () => {
    openModal({
      title: 'Billing in Details Breakdown',
      content: <BillingPriceBreakdown />,
    });
  };
  const openVoucherRulesModal = () => {
    openModal({
      content: (
        <VoucherRulesDisplay
          voucherRules={voucherRules}
          discountAmount={discountAmount}
          discountType={discountType}
          voucherAmountUsed={initialVoucherAmountUsed}
          carName={carName}
        />
      ),
    });
  };
  return (
    <div className="w-full mt-6">
      {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && (
        <Button variant="outlined" className="normal-case my-2" onClick={() => setIsCompare(!isCompare)}>
          {isCompare ? 'Close' : 'Compare'}
        </Button>
      )}
      {isCompare && <CompareBilling />}
      <Typography variant="h6" className="flex flex-col font-bold mb-2">
        Billing Details
        <span className="helping_text font-normal">
          Please click{' '}
          <span onClick={handleDetailsDisplay} className="text-primary cursor-pointer hover:underline">
            here
          </span>{' '}
          for detailed travel update billing breakdown.
        </span>
      </Typography>
      <div className="w-full lg:flex lg:gap-6">
        <PreviousBilling
          billingDetails={billingDetails}
          previousReservationAmount={previousReservationAmount}
          updatedTravelData={updatedTravelData}
          travelDetails={travelDetails}
          paidAmount={paidAmount}
        />
        {/* Updated */}
        <UpdatedBilling billingDetails={billingDetails} coveragePercentage={travelDetails?.reservationInfo?.insurance?.coveragePercentage ?? 0} />
      </div>
      {/* Show Voucher Rules */}
      {hasVoucher && (
        <div className="flex gap-1 my-2" onClick={openVoucherRulesModal}>
          <LuBadgeInfo className="w-6 h-6 text-primary" />
          <span className="text-sm text-primary leading-relaxed">
            The voucher will be applied based on the voucher rules during reservation.
            <span className="font-medium underline">Click to view details.</span>
          </span>
        </div>
      )}
      {(payableAmount ?? 0) > 0 && (
        <div className="grid md:grid-cols-12 grid-cols-2 mt-8">
          <div className="col-start-1 md:col-span-7 flex justify-start items-center">
            <p className="m-0 font-bold ">Payable Amount</p>
            {(voucherAmountUsed ?? 0) > 0 && (
              <span>
                <CommonTooltip
                  title={`Voucher amount $${voucherAmountUsed} is only applicable for this travel.`}
                  // title={`Voucher amount $${voucherAmountUsed} is not applicable for updating travel.`}
                >
                  <IconButton size="small">
                    <GoInfo />
                  </IconButton>
                </CommonTooltip>
              </span>
            )}
          </div>
          <p className="m-0 font-bold md:col-span-3 md:col-start-8 justify-end items-center flex">
            {'$'}
            {payableAmount?.toFixed(2)}
          </p>
          <div className="md:col-start-11 col-span-2 flex md:justify-end justify-center items-center md:mt-0 mt-4">
            <Button
              variant="contained"
              color="success"
              size="small"
              className="font-semibold"
              onClick={() => (isUpcomingTravelInvalid() ? showInvalidWarning() : handlePayConfirmation())}
            >
              Update
            </Button>
          </div>
        </div>
      )}

      {/* if voucher amount used */}
      {!!(!paidText && !payableAmount && !refundableAmount && billingAdditionalPayment?.voucherAmountUsed) && (
        <div className="mt-6 w-full">
          <Alert severity="info">{voucherText}</Alert>
          <div className="flex mt-4 justify-center items-center">
            <Button
              variant="contained"
              color="success"
              size="small"
              className="font-semibold"
              onClick={() => (isUpcomingTravelInvalid() ? showInvalidWarning() : handlePayConfirmation())}
            >
              Update Travel
            </Button>
          </div>
        </div>
      )}
      {(refundableAmount ?? 0) > 0 && (
        <div className="grid lg:grid-cols-2 grid-cols-1 items-center mt-8">
          <p className="m-0 col-span-1 font-semibold lg:text-left text-center">
            Refundable Amount
            <Tooltip enterTouchDelay={0} title={`Paid: $${actualPaidAmount}`} placement="top">
              <IconButton size="small">
                <GoInfo />
              </IconButton>
            </Tooltip>
            :
            <span className="font-bold text-primary">
              {' $'}
              {refundableAmount?.toFixed(2)}
            </span>
          </p>

          <div className="col-span-1 flex lg:justify-end justify-center gap-4 items-center lg:mt-0 mt-4">
            <Button
              variant="contained"
              color="success"
              size="small"
              className="font-semibold"
              onClick={() => (isUpcomingTravelInvalid() ? showInvalidWarning() : handleRefundConfirmation())}
            >
              Update Travel
            </Button>
          </div>
        </div>
      )}

      {refundText && (
        <div className="mt-6 w-full">
          <Alert severity="info">{refundText}</Alert>
          <div className="flex mt-4 justify-center items-center">
            <Button
              variant="contained"
              color="success"
              size="small"
              className="font-semibold"
              onClick={() => (isUpcomingTravelInvalid() ? showInvalidWarning() : handleRefundConfirmation(refundText))}
            >
              Update Travel
            </Button>
          </div>
        </div>
      )}

      {paidText && (
        <div className="mt-6 w-full">
          <Alert severity="info">{paidText}</Alert>
          <div className="flex mt-4 justify-center items-center">
            <Button
              variant="contained"
              color="success"
              size="small"
              className="font-semibold"
              onClick={() => (isUpcomingTravelInvalid() ? showInvalidWarning() : handlePayConfirmation())}
            >
              Update Travel
            </Button>
          </div>
        </div>
      )}

      {!!warningNote && (
        <Alert severity="warning" className="my-1">
          {warningNote}
        </Alert>
      )}
    </div>
  );
};

export default ExtendBillingUpdated;
