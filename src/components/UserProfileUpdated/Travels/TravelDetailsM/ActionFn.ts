import { calculateLiveDuration, combineDateTime, getDefaultEndTime, getDefaultStartTime } from '@/utils/Functions/dateTimeCommonFn';
import { dayjsUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';

export const calculateTimeRemaining = (travelDetails: any, travelPickupDate: any) => {
  if (!travelDetails || !travelPickupDate) return null;

  const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;
  const isTravelEnded = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest;
  const travelStartTime = dayjs(travelDetails?.tripInformation?.startTime);
  const currentTime = dayjs();
  const utcCountStartTime = getPickerTimeStringInUtc(currentTime, true);

  if (isTravelStarted && !isTravelEnded) {
    const utcStartTime = getPickerTimeStringInUtc(travelStartTime, true);
    return calculateLiveDuration(utcStartTime?.formattedTimeDayObj, utcCountStartTime?.formattedTimeDayObj);
  } else if (!isTravelStarted) {
    return calculateLiveDuration(utcCountStartTime?.formattedTimeDayObj, dayjsUtc(travelPickupDate));
  }

  return null;
};

export const handleRedirectToVehicleDetails = async (carListingId: number) => {
  const startDate = dayjs().add(1, 'day').toDate();
  const endDate = dayjs().add(3, 'day').toDate();
  const startTime = getDefaultStartTime()?.toDate();
  const endTime = getDefaultEndTime()?.toDate();

  const pickupTime = await combineDateTime(startDate, startTime);
  const returnTime = await combineDateTime(endDate, endTime);
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/search/${carListingId}/vehicle-details?pickup=${pickupTime}&return=${returnTime}`;
  // Open in a new tab
  window.open(url, '_blank', 'noopener,noreferrer');
};
