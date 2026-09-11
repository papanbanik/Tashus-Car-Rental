import { TDate } from '@/types/commonTypes';
import { TCancelUpcomingTravelByGuest, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { CustomPricing, PeakIncreaseType } from '@/types/user-profile/customPriceTypes';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { getPickerTimeStringInUtc } from '../utcCommonFn';
import { getReservationPriceList } from '../vehiclePriceUpdateFn';

export const calculatePenaltyPrice = async (
  oldPickupTime: TDate,
  oldReturnTime: TDate,
  oldDailyPrice: number,
  oldHourlyPrice: number,
  oldCustomPricing: CustomPricing[],
  travelPeakIncreaseList: PeakIncreaseType[]
) => {
  let dayOnePenalty = 0;
  let dayTwoPenalty = 0;
  try {
    const { reservationPriceList: dateList } = await getReservationPriceList(
      oldPickupTime,
      oldReturnTime,
      oldDailyPrice,
      oldHourlyPrice,
      oldCustomPricing,
      travelPeakIncreaseList
    );
    dayOnePenalty = dateList[0]?.dailyPrice || 0;
    dayTwoPenalty = dateList[1]?.dailyPrice || 0;
  } catch (error) {
    console.log(error);
  }

  return { dayOnePenalty, dayTwoPenalty };
};

export const handleCancellationAction = async (
  totalPenalty: number,
  penaltyHours: number,
  cancelTravel: TCancelUpcomingTravelByGuest,
  voucherAmount: number,
  amountWithoutVoucher: number,
  setShowCreditOption: Dispatch<SetStateAction<boolean>>,
  setCancellationText: Dispatch<SetStateAction<string>>
) => {
  cancelTravel.cancellationFee = parseFloat(Math.min(totalPenalty, amountWithoutVoucher).toFixed(2));
  cancelTravel.creditAmount = Math.max(parseFloat((amountWithoutVoucher - cancelTravel.cancellationFee).toFixed(2)), 0);
  cancelTravel.guestInconvenienceFeeReason = `Cancellation made within ${penaltyHours} hours of pickup time`;

  setShowCreditOption(cancelTravel.creditAmount > 0);
  const voucherText = voucherAmount > 0 ? ` You have used a voucher to get $${voucherAmount} discount.` : '';
  const refundText =
    cancelTravel.creditAmount > 0
      ? `An amount of $${cancelTravel?.creditAmount} will be refunded to the card used for payment. Please allow 3–5 business days for the transaction to process. Alternatively, you can keep the refund as credit for future travels within Tashus.`
      : '';
  // `You will receive a refund of $${cancelTravel.creditAmount}. You can take the refund as credit to use it for next travels.`
  // : 'You will not have to pay this extra amount';
  setCancellationText(
    // `Please be informed that a non-refundable fee of $${cancelTravel.cancellationFee} applies to cancellations made within 24 hours of pickup time. ${refundText}`
    `Please be informed that a ${cancelTravel.creditAmount > 0 ? 'non-refundable' : 'cancellation'} fee of $${
      cancelTravel.cancellationFee
    } applies to cancellations made within ${penaltyHours} hours of pickup time. ${refundText}${voucherText}`
  );

  return cancelTravel;
};

export const getCancelData = async (
  updatedTravelData: TUpdatedTravelData,
  travelDetails: any,
  setShowCreditOption: Dispatch<SetStateAction<boolean>>,
  setCancellationText: Dispatch<SetStateAction<string>>
) => {
  const utcCurrentTime = getPickerTimeStringInUtc(dayjs());
  const currentHourDiff = dayjs(updatedTravelData?.pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'hour');
  const voucherAmount = updatedTravelData?.additionalPaymentInfo?.voucherAmountUsed || 0;
  const creditAmount = travelDetails?.reservationInfo?.additionalPaymentInfo?.creditAmountUsed || 0;
  // const amountWithoutVoucher =
  //   voucherAmount > 0 ? travelDetails?.reservationInfo?.additionalPaymentInfo?.cardAmountUsed : updatedTravelData?.basePrice?.totalPrice;
  const amountWithoutVoucher = parseFloat(((updatedTravelData?.totalPaidAmount ?? 0) - (updatedTravelData?.totalReturnedAmount ?? 0))?.toFixed(2)); //considering paid amount
  let cancelTravel: TCancelUpcomingTravelByGuest = {
    userId: travelDetails?.guestId,
    totalAmount: parseFloat(updatedTravelData?.basePrice?.totalPrice?.toFixed(2)),
    cancellationFee: 0,
    creditAmount: 0,
    reservationInfo: {
      hostName: `${travelDetails?.partnerInfo?.firstName} ${travelDetails?.partnerInfo?.lastName}`,
      carName: travelDetails?.carInfo?.car?.model,
    },
    isRefundable: true,
  };

  // 7.2 d, no refund, full fee
  if (currentHourDiff < 48 && updatedTravelData?.totalDurationHours < 24) {
    // console.log('7.2 d');
    cancelTravel.cancellationFee = updatedTravelData?.basePrice?.totalPrice;
    cancelTravel.guestInconvenienceFeeReason = 'Travel duration is less than 24 hours';
    setCancellationText(`Please be informed that travel duration less than 24 hours is not eligible for refund.`);
  }

  // 7.2 c-i, full refund, no cancellation fee
  else if (currentHourDiff >= 48) {
    // console.log('7.2 c-i');
    const voucherText = voucherAmount > 0 ? ` You have used a voucher to get $${voucherAmount} discount.` : '';
    // const creditText = creditAmount > 0 ? ` You have used credit amount $${creditAmount} to pay for reservation.` : '';
    // const cardAmountText = cardAmountUsed > 0 ? `Your paid amount $${cancelTravel.creditAmount?.toFixed(2)} will be refunded to you.` : "No refund "
    cancelTravel.creditAmount = parseFloat(amountWithoutVoucher?.toFixed(2));
    if (cancelTravel?.creditAmount > 0) {
      setCancellationText(
        `An amount of $${cancelTravel?.creditAmount?.toFixed(
          2
        )} will be refunded to the card used for payment. Please allow 3–5 business days for the transaction to process. Alternatively, you can keep the refund as credit for future travels within Tashus. ${voucherText}`
      );
      setShowCreditOption(true);
    } else {
      setCancellationText(`${voucherText}`);
      setShowCreditOption(false);
    }
    // setCancellationText(`Your paid amount $${cancelTravel.creditAmount?.toFixed(2)} will be refunded to you.${voucherText}${creditText}`);
    // setCancellationText(`Your paid amount $${updatedTravelData?.basePrice?.totalPrice} will be refunded to you.`);
  }

  // 7.2 c-ii, add one day cancellation fee
  else if (currentHourDiff > 24 && currentHourDiff < 48) {
    // console.log('7.2 c-ii');
    const { dayOnePenalty } = await calculatePenaltyPrice(
      updatedTravelData?.pickupDate,
      updatedTravelData?.returnDate,
      updatedTravelData?.basePrice?.dailyPrice,
      updatedTravelData?.basePrice?.hourlyPrice,
      updatedTravelData?.basePrice?.customPrices ?? [],
      travelDetails?.carInfo?.rates?.peakIncrease
    );
    cancelTravel = await handleCancellationAction(
      dayOnePenalty,
      48,
      cancelTravel,
      voucherAmount,
      amountWithoutVoucher,
      setShowCreditOption,
      setCancellationText
    );
  }

  // 7.2 c-iii add two days cancellation fee
  else if (currentHourDiff <= 24) {
    // console.log('7.2 c-iii');
    const { dayOnePenalty, dayTwoPenalty } = await calculatePenaltyPrice(
      updatedTravelData?.pickupDate,
      updatedTravelData?.returnDate,
      updatedTravelData?.basePrice?.dailyPrice,
      updatedTravelData?.basePrice?.hourlyPrice,
      updatedTravelData?.basePrice?.customPrices ?? [],
      travelDetails?.carInfo?.rates?.peakIncrease
    );
    const totalPenalty = dayOnePenalty + dayTwoPenalty;
    cancelTravel = await handleCancellationAction(
      totalPenalty,
      24,
      cancelTravel,
      voucherAmount,
      amountWithoutVoucher,
      setShowCreditOption,
      setCancellationText
    );
  }

  return cancelTravel;
};

export const handleCancelUpcomingTravel = async (
  updatedTravelData: TUpdatedTravelData,
  travelDetails: any,
  setShowCreditOption: Dispatch<SetStateAction<boolean>>,
  setCancellationText: Dispatch<SetStateAction<string>>,
  setCancelTravelInfo: Dispatch<SetStateAction<TCancelUpcomingTravelByGuest>>
) => {
  const cancelTravel = await getCancelData(updatedTravelData, travelDetails, setShowCreditOption, setCancellationText);
  setCancelTravelInfo(cancelTravel);
};
