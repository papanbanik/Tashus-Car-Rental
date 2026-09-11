import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import {
  calculateLiveDuration,
  combineDateTime,
  formatFullDateTime,
  getDefaultEndTime,
  getDefaultStartTime,
} from '@/utils/Functions/dateTimeCommonFn';
import { isLatePickup } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, formatFullDateTimeUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button/Button';
import IconButton from '@mui/material/IconButton/IconButton';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import EditTravel from '../EditTravel/EditTravel';
import EndModal from '../EndTravel/EndModal';

const TravelActions = () => {
  const currentTime = dayjs();
  const router = useRouter();
  const pathName = usePathname();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { openModal } = useModalContext();
  // console.log(dayjs().isBefore(dayjs(updatedTravelData?.pickupDate)) && dayjs().diff(dayjs(updatedTravelData?.pickupDate), 'minute') > 15);
  // console.log(dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute'));
  const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;
  const isTravelEnded =
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByPartner ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin;
  //Start and End
  const startTime = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin
    ? formatFullDateTimeUtc(updatedTravelData?.pickupDate)
    : formatFullDateTime(travelDetails?.tripInformation?.startTime) ?? formatFullDateTimeUtc(updatedTravelData?.pickupDate);
  const endTime = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin
    ? formatFullDateTimeUtc(updatedTravelData?.returnDate)
    : formatFullDateTime(travelDetails?.tripInformation?.endTime) ?? formatFullDateTimeUtc(updatedTravelData?.returnDate);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;
      // const isTravelEnded = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest;
      const travelStartTime = dayjs(travelDetails?.tripInformation?.startTime);
      const currentTime = dayjs();
      const utcCountStartTime = getPickerTimeStringInUtc(currentTime, true);
      if (isTravelStarted && !isTravelEnded) {
        const utcStartTime = getPickerTimeStringInUtc(travelStartTime, true);
        const timeCount = calculateLiveDuration(utcStartTime?.formattedTimeDayObj, utcCountStartTime?.formattedTimeDayObj);
        setTimeRemaining(timeCount);
      } else if (!isTravelStarted) {
        const timeCount = calculateLiveDuration(utcCountStartTime?.formattedTimeDayObj, dayjsUtc(updatedTravelData?.pickupDate));
        setTimeRemaining(timeCount);
      } else {
        setTimeRemaining('');
      }
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };

    // const calculateTimeRemaining = () => {
    //   const isTravelStarted = travelDetails?.tripInformation?.carKeyReceived;
    //   const isTravelEnded = travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest;
    //   const travelStartTime = dayjs(travelDetails?.tripInformation?.startTime);
    //   if (isTravelStarted && !isTravelEnded) {
    //     const currentTime = dayjs();

    //     const duration = currentTime.diff(travelStartTime);
    //     const days = Math.floor(duration / (24 * 60 * 60 * 1000));
    //     const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    //     const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
    //     const seconds = Math.floor((duration % (60 * 1000)) / 1000);

    //     let timeRemainingText = '';

    //     if (days > 0) {
    //       timeRemainingText += `${days} day${days > 1 ? 's' : ''} | `;
    //     }
    //     if (hours > 0 || minutes > 0 || seconds > 0) {
    //       timeRemainingText += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    //     }

    //     setTimeRemaining(timeRemainingText.trim());
    //   } else {
    //     setTimeRemaining('');
    //   }
    // };

    // calculateTimeRemaining();

    // const intervalId = setInterval(calculateTimeRemaining, 1000); // Update every second

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [travelDetails, updatedTravelData]);

  const handleStartTravel = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/start-travel?view=key-received`);
  };

  const utcCurrentTime = getPickerTimeStringInUtc(currentTime);

  const handleEndTravel = () => {
    const hourDiff = dayjsUtc(updatedTravelData?.returnDate).diff(utcCurrentTime?.formattedTimeDayObj, 'hour');
    // console.log(hourDiff);
    openModal({
      content: <EndModal isEndAllowed={hourDiff <= 6 ? true : false}></EndModal>,
    });
  };

  // console.log(
  //   updatedTravelData?.paymentStatus !== 'paid',
  //   dayjs().isBefore(dayjs(updatedTravelData?.pickupDate)) && dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute') > 15
  // );

  // console.log(dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute'));

  const handleRedirectToVehicleDetails = async (carListingId: number) => {
    const startDate = dayjs().add(1, 'day').toDate();
    const endDate = dayjs().add(3, 'day').toDate();
    const startTime = getDefaultStartTime()?.toDate();
    const endTime = getDefaultEndTime()?.toDate();

    const pickupTime = await combineDateTime(startDate, startTime);
    const returnTime = await combineDateTime(endDate, endTime);
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search/${carListingId}/vehicle-details?pickup=${pickupTime}&return=${returnTime}`);
  };

  const isEndDayPassed = utcCurrentTime?.formattedTimeDayObj.isAfter(dayjsUtc(updatedTravelData?.returnDate), 'minute');
  const isStartInvalid =
    utcCurrentTime?.formattedTimeDayObj.isBefore(dayjsUtc(updatedTravelData?.pickupDate)) &&
    dayjsUtc(updatedTravelData?.pickupDate).diff(utcCurrentTime?.formattedTimeDayObj, 'minute') > 15;

  return (
    <div
      style={{ borderTop: '4px solid red', borderBottom: '4px solid red' }}
      className="flex flex-row justify-between mt-4 pt-4 pb-2 border border-gray-400 flex-wrap w-full"
    >
      {isTravelEnded ? (
        <div className="w-full flex md:flex-row flex-col justify-between items-center">
          <div className="md:mb-0 mb-2">
            <p className="text-gray-400 m-0">Started at {startTime}</p>
            <p className="text-gray-400 m-0">Ended at {endTime}</p>
          </div>
          <p className="text-success lg:text-xl font-bold uppercase m-0">Completed</p>
          <Button
            onClick={() => handleRedirectToVehicleDetails(travelDetails?.carListingId)}
            disabled={isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
            className="font-bold normal-case"
            variant="contained"
          >
            Reserve Again
          </Button>
        </div>
      ) : travelDetails?.reservationStatus === 'cancelledByGuest' ||
        travelDetails?.reservationStatus === 'cancelledByHost' ||
        travelDetails?.reservationStatus === 'cancelled' ? (
        <p className="text-success lg:text-xl font-bold uppercase m-0 text-center w-full">
          Travel has been cancelled by{' '}
          {travelDetails?.reservationStatus?.includes('Host') ? 'partner' : travelDetails?.reservationStatus?.includes('Guest') ? 'you' : 'Tashus'}
        </p>
      ) : (
        <>
          {/* Previous */}
          {/* <div className="order-2 md:order-1 md:w-1/3">
            {travelDetails?.isTripStarted ? (
              <Button onClick={handleEndTravel} sx={{ border: 2 }} className="font-bold hover:bg-primary hover:text-white normal-case w-32">
                End Travel
              </Button>
            ) : (
              <Button
                onClick={handleStartTravel}
                disabled={
                  updatedTravelData?.paymentStatus === 'pending' ||
                  (dayjs().isBefore(dayjs(updatedTravelData?.pickupDate)) && dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute') > 15) ||
                  isEndDayPassed
                }
                sx={{ border: 2 }}
                className="font-bold hover:bg-primary hover:text-white normal-case w-32"
              >
                Start Travel
              </Button>
            )}
            {/* <Button
              onClick={travelDetails?.isTripStarted ? handleEndTravel : handleStartTravel}
              disabled={
                updatedTravelData?.paymentStatus === 'pending' ||
                (dayjs().isBefore(dayjs(updatedTravelData?.pickupDate)) && dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute') > 15)
              }
              sx={{ border: 2 }}
              className="font-bold hover:bg-primary hover:text-white normal-case w-32"
            >
              {travelDetails?.isTripStarted ? 'End Travel' : 'Start Travel'}
            </Button> //
            <div className="flex justify-start items-center mt-1">
              <p className="text-gray-400 text-sm m-0">
                {travelDetails?.isTripStarted
                  ? `Started at ${formatFullDateTime(travelDetails?.tripInformation?.startTime)}`
                  : formatFullDateTime(updatedTravelData?.pickupDate)}
              </p>

              {!travelDetails?.isTripStarted && (
                <Tooltip title="Enables 15 mins before pickup time" placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>

          {travelDetails?.isTripStarted ? (
            <div className="md:order-2 order-1 md:w-1/3 w-full ">
              <p className="text-success text-xl font-bold uppercase text-center m-0">{timeRemaining}</p>
            </div>
          ) : (
            ''
          )}

          <div className="flex flex-col justify-end items-end order-3 md:w-1/3">
            <EditTravel></EditTravel>
          </div> */}
          {/* Modification */}
          <div className="order-2 md:order-1 w-1/2 md:w-1/3">
            {travelDetails?.isTripStarted ? (
              <Button onClick={handleEndTravel} sx={{ border: 2 }} className="font-bold hover:bg-primary hover:text-white normal-case w-10 md:w-32">
                {isSmallScreen ? 'End' : 'End Travel'}
              </Button>
            ) : (
              <Button
                onClick={handleStartTravel}
                disabled={
                  updatedTravelData?.paymentStatus === 'pending' ||
                  isStartInvalid ||
                  // (dayjs().isBefore(dayjs(updatedTravelData?.pickupDate)) && dayjs(updatedTravelData?.pickupDate).diff(dayjs(), 'minute') > 15) ||
                  isEndDayPassed ||
                  isGuestRestrict(guestAccess) ||
                  isGuestSuspended(guestAccess)
                }
                sx={{ border: 2 }}
                className="font-bold hover:bg-primary hover:text-white normal-case w-10 md:w-32"
              >
                {isSmallScreen ? 'Start' : 'Start Travel'}
              </Button>
            )}
            <div className="mt-1 flex justify-start items-center">
              <span className="text-gray-400 md:text-sm md:m-0">
                {travelDetails?.isTripStarted
                  ? `${isSmallScreen ? 'Started at' : `Started at ${formatFullDateTime(travelDetails?.tripInformation?.startTime)}`}`
                  : `${isSmallScreen ? 'Pickup Time' : `${formatFullDateTimeUtc(updatedTravelData?.pickupDate)}`}`}
              </span>
              {!travelDetails?.isTripStarted && !isSmallScreen && (
                <Tooltip enterTouchDelay={0} title="Enables 15 mins before pickup time" placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle />
                  </IconButton>
                </Tooltip>
              )}
              {isSmallScreen && (
                <Tooltip
                  enterTouchDelay={0}
                  title={`${
                    travelDetails?.isTripStarted
                      ? `${formatFullDateTime(travelDetails?.tripInformation?.startTime)}`
                      : `${formatFullDateTimeUtc(updatedTravelData?.pickupDate)}. Enables 15 mins before pickup time`
                  }`}
                  placement="top"
                >
                  <IconButton size="small">
                    <AiOutlineQuestionCircle />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end items-end order-3 w-1/2 md:w-1/3">
            <EditTravel></EditTravel>
          </div>

          {travelDetails?.isTripStarted && (
            <div className="order-1 md:order-2 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="m-0 font-bold">Current Duration</p>
              <p className="text-success text-xl font-bold uppercase text-center m-0">{timeRemaining}</p>
            </div>
          )}

          {!travelDetails?.isTripStarted && !isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <div className="md:order-2 order-1 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="m-0 font-bold">Travel Starts In</p>
              <p className="text-success text-xl font-bold uppercase text-center m-0">{timeRemaining}</p>
            </div>
          )}

          {!travelDetails?.isTripStarted && isLatePickup(currentTime, updatedTravelData?.pickupDate) && (
            <div className="md:order-2 order-1 md:w-1/3 w-full flex flex-col justify-center items-center">
              <p className="text-orange-400 text-xl font-bold uppercase text-center m-0">Late Pickup</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TravelActions;
