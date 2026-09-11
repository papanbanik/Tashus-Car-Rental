import CarAdditionalFeatures from '@/components/CarListing/CarViewPost/CarAdditionalFeatures';
import CarDetailsOverview from '@/components/CarListing/CarViewPost/CarDetailsOverview';
import CarDetailsPolicies from '@/components/CarListing/CarViewPost/CarDetailsPolicies';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { getCarName, getHighestLongDiscountText } from '@/utils/Functions/carListingCommonFn';
import { AppBar, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CarAvailability from '../../CarListing/CarViewPost/CarDetailsAvailability/CarAvailability';
import CarFeatures from '../../CarListing/CarViewPost/CarFeatures';
import CarInformation from '../../CarListing/CarViewPost/CarInformation';
import CarLocation from '../../CarListing/CarViewPost/CarLocation';
import CarPictures from '../../CarListing/CarViewPost/CarPictures';
import HostDetails from '../../CarListing/CarViewPost/HostDetails';
import CommonAccStatusAlert from '../CommonAccStatusAlert';
import ReservationPrice from './PriceUpdate/ReservationPrice';
import VehiclePickupReturnUpdate from './PriceUpdate/VehiclePickupReturnUpdate';
import TemporaryData from './TemporaryData';
import DeliveryLocation from './VehicleDelivery/DeliveryLocation';
import VehicleDetailsBreadcrumbs from './VehicleDetailsBreadcrumbs';
import VehicleDetailsSideBar from './VehicleDetailsSideBar';
import VehicleReviews from './VehicleReviews';
import VehicleUnavailabilityCalendar from './VehicleUnavailabilityCalendar';

const VehicleDetails = ({ isViewPost }: { isViewPost?: Boolean }) => {
  const [discountText, setDiscountText] = useState<string>('');
  const { guestAccess } = useProfileInfoContext();
  const { carData } = useCarListingContext();
  const { car, carNickName, rates, additionalInfos, additionalFeatures, features, guidelines, availability, location, photos } = carData ?? {};
  const { dailyRates, longBookingDiscounts, longBookingDiscountActive = true } = rates ?? {};
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  //const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isMedium = useMediaQuery('(min-width:960px)');
  const isIPadPro = useIPadProQuery();
  const carAvailabilityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchDiscountText = async () => {
      if (longBookingDiscounts?.length > 0 && longBookingDiscountActive) {
        const text = await getHighestLongDiscountText(longBookingDiscounts);
        setDiscountText(text);
      } else {
        setDiscountText('');
      }
    };

    fetchDiscountText();
  }, [longBookingDiscounts]);

  const scrollToCarAvailability = () => {
    if (carAvailabilityRef.current) {
      carAvailabilityRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showSideBar = isMedium && !isIPadPro;
  //const baseUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/au/verify-account/${userCred?.userId}`;

  const carTitle = getCarName(car?.make, car?.model, car?.year?.toString());

  return (
    <div className="home_max_width w-full">
      {photos ? (
        <div>
          {!isViewPost && <VehicleDetailsBreadcrumbs carTitle={carTitle}></VehicleDetailsBreadcrumbs>}

          <CarInformation carTitle={carTitle} carNickname={carNickName} dailyRate={dailyRates?.amount} discountText={discountText}></CarInformation>

          {photos && <CarPictures />}

          {/* Side bar contents for small screen */}
          {!isViewPost && (
            <div className={`${showSideBar ? 'hidden' : 'block mb-6'}`}>
              {/* <Link target="_blank" href={baseUrl} className="no-underline">
                <CommonTextIcon
                  className="flex justify-center items-center text-primary font-bold underline "
                  text="Verify your ID"
                  endIcon={<FaArrowRight className="text-primary ml-2" />}
                />
              </Link> */}
              <VehiclePickupReturnUpdate />
              <div className="py-4 px-4 bg-white">
                {/* <CustomReservationLocation></CustomReservationLocation> */}
                <DeliveryLocation />
              </div>
            </div>
          )}

          <div className={`grid ${isViewPost ? 'grid-cols-4' : 'grid-cols-12'} gap-2`}>
            <div id="pick-ret" className={` mr-6 ${isViewPost ? 'col-span-4' : !showSideBar ? 'col-span-12' : 'lg:col-span-8 col-span-12'}`}>
              {guidelines && <HostDetails />}

              <CarDetailsOverview car={car} carDescription={additionalInfos?.carDescription}></CarDetailsOverview>

              {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && !isViewPost && <TemporaryData></TemporaryData>}

              {features?.length > 0 && <CarFeatures features={features} />}

              {additionalFeatures?.length > 0 && additionalFeatures[0] && (
                <CarAdditionalFeatures additionalFeatures={additionalFeatures}></CarAdditionalFeatures>
              )}

              {availability && (
                <div ref={carAvailabilityRef}>
                  <CarAvailability availability={availability} />
                </div>
              )}

              {!isViewPost && <VehicleUnavailabilityCalendar></VehicleUnavailabilityCalendar>}

              {isViewPost && location && <CarLocation />}

              {!isViewPost && <VehicleReviews />}
            </div>

            {/* Sidebar contents for larger screen */}
            {!isViewPost && (
              <div id="pickup-return" className={`${showSideBar ? 'lg:col-span-4' : 'hidden'}`}>
                <VehicleDetailsSideBar scrollToCarAvailability={scrollToCarAvailability}></VehicleDetailsSideBar>
              </div>
            )}

            {!isViewPost && !showSideBar && (
              <div className="col-span-12 bg-white p-4 rounded-lg">
                <CarDetailsPolicies></CarDetailsPolicies>
              </div>
            )}
          </div>

          {!isViewPost && (
            <AppBar
              position="fixed"
              color="primary"
              sx={{ top: 'auto', bottom: 8 }}
              className={`${showSideBar ? 'hidden' : 'block'} bg-transparent shadow-none `}
            >
              {!isViewPost && isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
              {!isViewPost && isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
              <div className="bg-white mx-4 rounded-lg md:px-4 md:py-4 px-2 py-2 flex justify-between items-center">
                <ReservationPrice></ReservationPrice>
              </div>
            </AppBar>
          )}
        </div>
      ) : (
        <>
          <Skeleton variant="rounded" className="mt-4 h-64" />
          <div className="grid md:grid-cols-4 grid-cols-3 gap-12 lg:px-64">
            {Array.from(new Array(isSmall ? 3 : 4)).map((item, index) => (
              <Skeleton key={index} animation="wave" height={100} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleDetails;
