import SignUp from '@/components/SignUp/SignUp';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { TReservationInfo, useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { getRoundUpStartTime } from '@/utils/Functions/dateTimeCommonFn';
import { convertDateToUtc, dayjsUtc, launchDate } from '@/utils/Functions/utcCommonFn';
import { Alert, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button/Button';
import dayjs, { Dayjs } from 'dayjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import PriceDetails from '../PriceDetails';
import IndividualPriceDisplay from './IndividualPriceDisplay';

const ReservationPrice = () => {
  const { guestAccess } = useProfileInfoContext();
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isIPadPro = useIPadProQuery();

  const router = useRouter();
  // const params = useParams();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const urlParams = useSearchParams();

  const [isOwnCar, setIsOwnCar] = useState<boolean>(false);

  const { carData } = useCarListingContext();
  const { openModal } = useModalContext();
  const { userCred, setUserType } = useUserCredContext();
  const {
    totalPrice,
    timeErrorText,
    durationPrice,
    peakIncPrice,
    discountedPrice,
    availabilityErrorText,
    serviceFee,
    singleCarReservationList,
    verifyConfirmReservationAvailability,
    reservationCustomPriceList,
    vehicleDropInfo,
    deliveryDetails,
    reservationDuration,
    setReservationInfo,
    setDeliveryDetails,
  } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  const carDaily = `${carData?.rates?.dailyRates?.amount}`;
  const carHours = `${carData?.rates?.hourlyRates?.amount}`;

  useEffect(() => {
    setReservationInfo(null);
    setDeliveryDetails({} as TDeliveryDetails);
  }, []);

  useEffect(() => {
    if (carData?.hostId === userCred?.userId) {
      setIsOwnCar(true);
    } else {
      setIsOwnCar(false);
    }
  }, [carData, userCred?.userId]);

  const openPriceDetails = () => {
    openModal({
      title: 'Price Details',
      content: <PriceDetails carRates={carData?.rates} />,
    });
  };

  const openPriceList = () => {
    openModal({
      title: 'Individual Price Details',
      // content: <PriceListModal />,
      content: <IndividualPriceDisplay />,
    });
  };

  const handleReservationData = () => {
    if (window !== undefined) {
      //const vehicleId = params['vehicle-id'];
      // const vehicleId = Array.isArray(params['vehicle-id']) ? params['vehicle-id'][0] : params['vehicle-id'];

      const updatedSearchParams: any = {
        pickup: '',
        return: '',
      };
      // @ts-ignore
      for (const [key, value] of urlParams.entries()) {
        if (updatedSearchParams.hasOwnProperty(key)) {
          updatedSearchParams[key] = value;
        }
      }
      // console.log(updatedSearchParams);
      const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');

      let reservationList: any = [];
      if (tashus?.reservationList?.length > 0) {
        reservationList = [...tashus?.reservationList];

        // if current car is already in the list, remove it
        const updatedList = reservationList?.filter((car: any) => parseInt(car?.listingId) !== parseInt(vehicleId));
        reservationList = [...updatedList];
        // console.log(reservationList);
      }

      // console.log(discountedPrice);
      const { advanceDiscount, longDiscount } = discountedPrice;
      // console.log(peakIncPrice);
      let allDiscounts: any = {};

      if (advanceDiscount?.duration) {
        const { text, ...advDis } = advanceDiscount;
        // console.log(advDis);
        // const advBookDis = { ...advDis };
        // allDiscounts.push({ advBookDis: advDis });
        allDiscounts.advanceBookingDiscounts = advDis;
      }
      if (longDiscount?.duration) {
        const { text, ...longDis } = longDiscount;
        // console.log(longDis);
        const longBookDis = { ...longDis };
        // allDiscounts.push({ longBookDis: longDis });
        allDiscounts.longBookingDiscounts = longDis;
      }

      const reservationInfo: TReservationInfo = {
        pickupTime: updatedSearchParams?.pickup,
        returnTime: updatedSearchParams?.return,
        listingId: parseInt(vehicleId),
        totalPrice,
        serviceFeeAmount: serviceFee,
        durationPrice,
        reservationCustomPrice: reservationCustomPriceList ?? [],
        reservationDuration,
        ...(longDiscount?.duration && { longDiscountText: longDiscount?.text }),
        ...(advanceDiscount?.duration && { advanceDiscountText: advanceDiscount?.text }),
      };

      if (vehicleDropInfo?.dropOffLocation) {
        reservationInfo.dropOffLocation = vehicleDropInfo?.dropOffLocation;
      }

      if (deliveryDetails?.isDeliveryEnabled && !!deliveryDetails?.deliveryVehicle?.deliveryLocation) {
        reservationInfo.deliveryDetails = deliveryDetails;
      }

      if (allDiscounts?.advanceBookingDiscounts || allDiscounts?.longBookingDiscounts) {
        reservationInfo.discounts = allDiscounts;
      }

      if (peakIncPrice?.increaseDays?.length && peakIncPrice?.increaseDays?.length > 0) {
        reservationInfo.incPrice = peakIncPrice;
      }

      // console.log('reservationInfo', reservationInfo);

      reservationList.push(reservationInfo);
      // console.log(reservationList);

      localStorage.setItem('tashus', JSON.stringify({ ...tashus, reservationList }));
      // !Dynamic Domain
      router.push(`/search/${vehicleId}/checkout`);
      // router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search/${vehicleId}/checkout`);
    }
  };

  const handleContinueReservation = async () => {
    setUserType('guest-booking');
    if (userCred?.loggedIn) {
      const pickupTime = dayjs(urlParams?.get('pickup')).second(0).millisecond(0);
      const returnTime = dayjs(urlParams?.get('return')).second(0).millisecond(0);
      const isValid = validatePickupReturn(pickupTime, returnTime);
      const isCarAvailable: boolean = isValid
        ? await verifyConfirmReservationAvailability(
            pickupTime.toISOString(),
            returnTime.toISOString(),
            carData?.availability,
            singleCarReservationList
          )
        : false;
      if (isValid && isCarAvailable) {
        handleReservationData();
      }
    } else {
      openModal({
        title: 'Login or Sign Up',
        content: (
          <div className="md:mx-4 md:my-2">
            <SignUp></SignUp>
          </div>
        ),
      });
    }
  };

  const validatePickupReturn = (pickupTime: Dayjs, returnTime: Dayjs) => {
    // console.log(params);

    const defaultPickupTime = dayjs(getRoundUpStartTime(60)).second(0).millisecond(0);

    // console.log(pickupTime.toDate(), defaultPickupTime.toDate());

    const isPickupPast = pickupTime.isBefore(defaultPickupTime, 'minute');
    const isReturnBeforePickup = returnTime.isBefore(pickupTime, 'minute');
    const minuteDiff = returnTime.diff(pickupTime, 'minute');

    if (isPickupPast) {
      openSnackBar({
        message: 'Ensure pickup time is set 1 hour after the current time.',
        severity: 'error',
      });
      return false;
    }

    if (isReturnBeforePickup) {
      openSnackBar({
        message: 'Invalid Time',
        severity: 'error',
      });
      return false;
    }

    if (minuteDiff < 60) {
      openSnackBar({
        message: 'Minimum reservation duration is 1 hour',
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  const showSideBar = isMedium && !isIPadPro;

  // for setting continue button disabled before prod launching date

  const shouldDisableContinueButton = (): boolean => {
    const formattedLaunchDate = convertDateToUtc(launchDate);
    const pickupTime = dayjsUtc(urlParams?.get('pickup'));
    const isBeforeLaunch = pickupTime.isBefore(formattedLaunchDate?.formattedDateObj, 'day');
    // console.log(isBeforeLaunch);
    return process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? isBeforeLaunch : false;
  };

  if (isOwnCar) {
    return (
      <div className="flex justify-center items-center w-full">
        <Alert severity="error" className="lg:mb-4">
          Reservations not available for own vehicles
        </Alert>
      </div>
    );
  }

  return (
    <>
      {availabilityErrorText ? (
        <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded">{availabilityErrorText}</p>
      ) : (
        <div className="w-full text-black">
          {/* Alternative UI for price showing */}
          {/* <div className={`flex flex-col`}>
            <div>
              {discountedPrice?.advanceDiscount?.text || discountedPrice?.longDiscount?.text ? (
                <p className="flex md:flex-col flex-row p-0 m-0">
                  <span className="line-through text-error">${durationPrice}</span>{' '}
                  <span className="font-bold md:text-3xl text-xl">${totalPrice?.toFixed(2)}</span>
                </p>
              ) : (
                totalPrice !== 0 && <span className="font-bold md:text-3xl text-xl">${totalPrice?.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <p className={`m-0 text-xs p-0`}>${`${carHours}`}/hr</p>
              <span>{'  |  '}</span>
              <p className={`m-0 text-xs p-0`}>
                <span> ${`${carDaily}`}/day</span>
                <span>
                  <Tooltip enterTouchDelay={0} title={'Price Information'} placement="top">
                    <IconButton size="small" onClick={openPriceList}>
                      <AiOutlineQuestionCircle />
                    </IconButton>
                  </Tooltip>
                </span>
              </p>
            </div>
          </div> */}

          <p className={`p-0 m-0 text-left ${isIPadPro ? 'text-left' : 'lg:text-center'}`}>
            {discountedPrice?.advanceDiscount?.text || discountedPrice?.longDiscount?.text ? (
              <>
                <span className="line-through text-error">${durationPrice}</span>{' '}
                <span className="font-bold md:text-2xl text-xl">${totalPrice?.toFixed(2)}</span>
              </>
            ) : (
              totalPrice !== 0 && <span className="font-bold md:text-2xl text-xl">${totalPrice?.toFixed(2)}</span>
            )}
          </p>

          <p className={`text-sm p-0 m-0 text-left ${isIPadPro ? 'text-left' : 'lg:text-center'}`}>
            <span> ${`${carHours}`}</span>/hr |<span> ${`${carDaily}`}</span>/day
            <span>
              <Tooltip enterTouchDelay={0} title={'Price Information'} placement="top">
                <IconButton size="small" onClick={openPriceList}>
                  <AiOutlineQuestionCircle />
                </IconButton>
              </Tooltip>
            </span>
          </p>

          {showSideBar ? (
            <PriceDetails carRates={carData?.rates} />
          ) : (
            <p onClick={openPriceDetails} className={`cursor-pointer underline p-0 m-0 text-primary`}>
              Price Details
            </p>
          )}

          {/* {discountedPrice?.nextLongDiscount?.text && (
            <div className="flex lg:justify-center items-center lg:mt-6">
              <p className="text-sm font-bold text-primary p-0 m-0 text-left md:text-center">
                Enjoy {discountedPrice?.nextLongDiscount?.amount}% off for {discountedPrice?.nextLongDiscount?.text} of travel
              </p>
            </div>
          )} */}
        </div>
      )}

      <div className={`my-6 ${isIPadPro ? '' : 'lg:w-full lg:justify-center'} flex justify-end items-center`}>
        <Button
          fullWidth={isMedium}
          disabled={
            !!availabilityErrorText ||
            !!timeErrorText ||
            isOwnCar ||
            isGuestRestrict(guestAccess) ||
            isGuestSuspended(guestAccess) ||
            shouldDisableContinueButton()
          }
          variant="contained"
          color="primary"
          className="normal-case text-md"
          onClick={handleContinueReservation}
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default ReservationPrice;
