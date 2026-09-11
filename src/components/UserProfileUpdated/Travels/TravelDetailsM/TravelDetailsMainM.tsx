'use client';

import CommonBreadCrumb from '@/components/Common/Breadcrumbs/CommonBreadCrumb';
import CommonDrawer from '@/components/Common/CommonDrawer';
import ReservationDetailsSkeletonM from '@/components/Common/Skeletons/ReservationDetailsSkeletonM';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { loadText } from '@/utils/Functions/randomCommonFn';
import { IconButton, useMediaQuery } from '@mui/material';
import { notFound, useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ReservationBilling from '../../Reservations/ReservationDetails/ReservationBilling';
import ReservationPhotos from '../../Reservations/ReservationDetails/ReservationPhotos';
import UpdateVehicleInformation from '../../Reservations/ReservationDetails/UpdateVehicleInformation/UpdateVehicleInformation';
import VerifyGuest from '../../Reservations/VerifyGuest/VerifyGuest';
import TravelDeliveryLocationsInfo from '../Delivery/TravelDeliveryLocationsInfo';
import TravelBilling from '../TravelDetails/TravelBilling';
import ReservationCondition from '../TravelDetails/TravelCondition';
import TravelLocation from '../TravelDetails/TravelLocation/TravelLocation';
import TravelOdometer from '../TravelDetails/TravelOdometer';
import TravelPhotos from '../TravelDetails/TravelPhotos';
import TravelReview from '../TravelDetails/TravelReview/TravelReview';
import BasicDetailsWrapper from './BasicDetailsWrapper';
import ReservationNotes from './ReservationNotes/ReservationNotes';
import Sidebar from './Sidebar/Sidebar';
import TabContent from './TabContent';
import TravelDetailsM from './TravelDetailsM';
import TravelUpdateHistory from './TravelUpdateHistory/TravelUpdateHistory';

const TravelDetailsMainM = () => {
  const searchParams = useSearchParams();
  const { userId, travelId, reservationId: reservationIdParam } = useParams<{ userId: string; travelId: string; reservationId: string }>();
  const reservationId = travelId || reservationIdParam;
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { userCred } = useUserCredContext();
  const isSmall = useMediaQuery('(max-width: 1024px)');
  const { data, isLoading, refetch } = useTravelDetails();
  const defaultTab = searchParams.get('tab') || 'travelDetails';
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);
  const pathName = usePathname();
  const router = useRouter();

  const billingDetailsRef = useRef<HTMLDivElement | null>(null);
  const conditionDetailsRef = useRef<HTMLDivElement | null>(null);
  const locationDetailsRef = useRef<HTMLDivElement | null>(null);
  const photoDetailsRef = useRef<HTMLDivElement | null>(null);
  const reviewDetailsRef = useRef<HTMLDivElement | null>(null);
  const odometerDetailsRef = useRef<HTMLDivElement | null>(null);
  const reservationHistoryRef = useRef<HTMLDivElement | null>(null);
  const deliveryInfoRef = useRef<HTMLDivElement | null>(null);
  const reservationNotesRef = useRef<HTMLDivElement | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);

  const isDeliveryEnabled = travelDetails?.reservationInfo?.isDeliveryEnabled ?? false;

  useEffect(() => {
    const timer = setTimeout(() => setIsContentReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const scrollToSection = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const targetPosition = ref.current.getBoundingClientRect().top + window.scrollY - 100; // Adjust offset
      let currentScroll = window.scrollY;
      let isScrolling = true;

      const step = () => {
        if (!isScrolling) return;

        const distance = targetPosition - currentScroll;
        if (Math.abs(distance) < 1) {
          window.scrollTo(0, targetPosition);
          isScrolling = false;
          return;
        }

        currentScroll += distance / 10;
        window.scrollTo(0, currentScroll);
        requestAnimationFrame(step);
      };

      isScrolling = true;
      step();
    }
  }, []);

  const scrollToBillingDetails = () => scrollToSection(billingDetailsRef);
  const scrollToConditionDetails = () => scrollToSection(conditionDetailsRef);
  const scrollToLocationDetails = () => scrollToSection(locationDetailsRef);
  const scrollToPhotoDetails = () => scrollToSection(photoDetailsRef);
  const scrollToReviewDetails = () => scrollToSection(reviewDetailsRef);
  const scrollToOdometerDetails = () => scrollToSection(odometerDetailsRef);
  const scrollToReservationHistory = () => scrollToSection(reservationHistoryRef);
  const scrollToDeliveryInfo = () => scrollToSection(deliveryInfoRef);
  const scrollToReservationNotes = () => scrollToSection(reservationNotesRef);

  useEffect(() => {}, [isContentReady]);
  useEffect(() => {
    if (selectedTab === 'reviews') {
      scrollToSection(reviewDetailsRef);
    } else if (selectedTab === 'photos') {
      scrollToSection(photoDetailsRef);
    } else if (selectedTab === 'odometer') {
      scrollToSection(odometerDetailsRef);
    } else if (selectedTab === 'travel-update-history') {
      scrollToSection(reservationHistoryRef);
    } else if (selectedTab === 'notes') {
      scrollToSection(reservationNotesRef);
    }
  }, [searchParams, selectedTab]);

  const NotFoundRedirect = () => {
    useEffect(() => {
      if (userCred?.userId) {
        notFound();
      }
    }, []);
    return null;
  };

  const reservationUrl = `/dashboard/${userId}/${pathName.includes('reservations') ? 'reservations' : 'travels'}/current`;
  const reservationBreadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: pathName.includes('reservations') ? 'Reservations' : 'Travels', href: reservationUrl },
    { label: `${!!travelDetails?.carInfo?.car?.model ? `${reservationId} (${travelDetails?.carInfo?.car?.model})` : loadText}` },
  ];

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isSmall && isFirstRender.current) {
      setDrawerOpen(true);
      isFirstRender.current = false;
    }
  }, [isSmall]);

  return (
    <>
      <div>
        <div className="flex justify-center max-w-[1200px]  mx-auto">
          <div className="flex w-full  gap-2 mb-4 p-2">
            <CommonBreadCrumb items={reservationBreadcrumbItems} />
          </div>
        </div>
        {isSmall ? (
          <>
            <CommonDrawer
              buttonClasses="flex justify-start items-start ms-1"
              drawerAnchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
            >
              <div className="p-2">
                <div>
                  <span className="text-end text-2xl pe-3.5 cursor-pointer block font-semibold text-primary">
                    <AiOutlineArrowLeft />
                  </span>
                </div>
                {(searchParams.get('view') === 'verify-guest' ||
                  searchParams.get('view') === 'upload-pickup-photos' ||
                  searchParams.get('view') === 'upload-return-photos') &&
                pathName?.includes('reservations') ? (
                  ''
                ) : (
                  <Sidebar
                    scrollToBillingDetails={scrollToBillingDetails}
                    scrollToConditionDetails={scrollToConditionDetails}
                    scrollToLocationDetails={scrollToLocationDetails}
                    scrollToPhotoDetails={scrollToPhotoDetails}
                    scrollToReviewDetails={scrollToReviewDetails}
                    scrollToOdometerDetails={scrollToOdometerDetails}
                    scrollToReservationHistory={scrollToReservationHistory}
                    scrollToDeliveryInfo={scrollToDeliveryInfo}
                    scrollToReservationNotes={scrollToReservationNotes}
                    setSelectedTab={setSelectedTab}
                  />
                )}
              </div>
            </CommonDrawer>
            <div className="w-full flex flex-col px-2.5">
              {searchParams.get('view') === 'verify-guest' && pathName?.includes('reservations') ? (
                <div className="flex flex-col items-start">
                  <IconButton onClick={() => router.back()} className="text-primary">
                    <IoMdArrowRoundBack size={30} />
                  </IconButton>
                  <VerifyGuest></VerifyGuest>
                </div>
              ) : searchParams.get('view') === 'upload-pickup-photos' ? (
                <>
                  <div className="flex flex-col items-start">
                    <IconButton onClick={() => router.back()} className="text-primary">
                      <IoMdArrowRoundBack size={30} />
                    </IconButton>
                  </div>
                  <ReservationPhotos />
                </>
              ) : searchParams.get('view') === 'upload-return-photos' ? (
                <>
                  <div className="flex flex-col items-start">
                    <IconButton onClick={() => router.back()} className="text-primary">
                      <IoMdArrowRoundBack size={30} />
                    </IconButton>
                    <ReservationPhotos />
                  </div>
                </>
              ) : selectedTab === 'travelDetails' ||
                selectedTab === 'billingDetails' ||
                selectedTab === 'condition' ||
                selectedTab === 'location' ||
                selectedTab === 'notes' ||
                selectedTab === 'deliveryInfo' ? (
                <>
                  <BasicDetailsWrapper pathName={pathName} />
                  <TabContent id="billing-details" refProp={billingDetailsRef}>
                    {updatedTravelData?.isUserGuest ? (
                      <TravelBilling isTravelUpdatedPage={true} />
                    ) : (
                      <ReservationBilling isTravelUpdatedPage={true} />
                    )}
                  </TabContent>

                  <TabContent id="location-details" refProp={locationDetailsRef}>
                    <TravelLocation isTravelUpdatedPage={true} />
                  </TabContent>

                  <TabContent id="condition-details" refProp={conditionDetailsRef}>
                    <ReservationCondition isTravelUpdatedPage={true} />
                  </TabContent>
                  {isDeliveryEnabled && (
                    <TabContent id="deliveryInfo-details" refProp={deliveryInfoRef}>
                      <TravelDeliveryLocationsInfo />
                    </TabContent>
                  )}
                  <TabContent id="notes" refProp={reservationNotesRef}>
                    <ReservationNotes />
                  </TabContent>
                </>
              ) : selectedTab === 'photos' || searchParams.get('tab') === 'photos' ? (
                <>
                  <BasicDetailsWrapper pathName={pathName} />
                  <TabContent id="photo-details" refProp={photoDetailsRef}>
                    <TravelPhotos isTravelUpdatedPage={true} />
                  </TabContent>
                </>
              ) : selectedTab === 'reviews' || searchParams.get('tab') === 'reviews' ? (
                <>
                  <BasicDetailsWrapper pathName={pathName} />
                  <TabContent id="review-details" refProp={reviewDetailsRef}>
                    <TravelReview isTravelUpdatedPage={true} />
                  </TabContent>
                </>
              ) : selectedTab === 'odometer' || searchParams.get('tab') === 'odometer' ? (
                <>
                  <BasicDetailsWrapper pathName={pathName} />
                  <TabContent id="odometer-details" refProp={odometerDetailsRef}>
                    {pathName?.includes('reservations') ? (
                      <>
                        <UpdateVehicleInformation isTravelUpdatedPage={true} />
                        <TravelOdometer isTravelUpdatedPage={true} isHost={true} />
                      </>
                    ) : (
                      <TravelOdometer isTravelUpdatedPage={true} />
                    )}
                  </TabContent>
                </>
              ) : selectedTab === 'travel-update-history' || searchParams.get('tab') === 'travel-update-history' ? (
                <>
                  <>
                    <BasicDetailsWrapper pathName={pathName} />
                    <TabContent id="travel-update-history" refProp={reservationHistoryRef}>
                      {pathName?.includes('travels') ? <TravelUpdateHistory reservationDetailsData={travelDetails} /> : ''}
                    </TabContent>
                  </>
                </>
              ) : (
                <>
                  <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-0 sm:ml-4 mt-5 p-5">
                    <TravelDetailsM />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-row  max-w-[1200px] justify-center mx-auto">
            {(searchParams.get('view') === 'verify-guest' ||
              searchParams.get('view') === 'upload-pickup-photos' ||
              searchParams.get('view') === 'upload-return-photos') &&
            pathName?.includes('reservations') ? (
              ''
            ) : (
              <div className="h-[400px] sticky top-10">
                <Sidebar
                  scrollToBillingDetails={scrollToBillingDetails}
                  scrollToConditionDetails={scrollToConditionDetails}
                  scrollToLocationDetails={scrollToLocationDetails}
                  scrollToPhotoDetails={scrollToPhotoDetails}
                  scrollToReviewDetails={scrollToReviewDetails}
                  scrollToOdometerDetails={scrollToOdometerDetails}
                  scrollToReservationHistory={scrollToReservationHistory}
                  scrollToDeliveryInfo={scrollToDeliveryInfo}
                  scrollToReservationNotes={scrollToReservationNotes}
                  setSelectedTab={setSelectedTab}
                />
              </div>
            )}

            {isLoading ? (
              <div className="w-full">
                <ReservationDetailsSkeletonM />
              </div>
            ) : userId &&
              userCred?.userId &&
              userId === userCred?.userId &&
              data?.data &&
              ((pathName?.includes('travels') && userCred?.userId === data?.data?.guestId) ||
                (pathName?.includes('reservations') && userCred?.userId === data?.data?.partnerId)) ? (
              <div className="w-full flex flex-col">
                {searchParams.get('view') === 'verify-guest' && pathName?.includes('reservations') ? (
                  <div className="flex flex-col items-start">
                    <IconButton onClick={() => router.back()} className="text-primary">
                      <IoMdArrowRoundBack size={30} />
                    </IconButton>
                    <VerifyGuest></VerifyGuest>
                  </div>
                ) : searchParams.get('view') === 'upload-pickup-photos' ? (
                  <>
                    <div className="flex flex-col items-start">
                      <IconButton onClick={() => router.back()} className="text-primary">
                        <IoMdArrowRoundBack size={30} />
                      </IconButton>
                    </div>
                    <ReservationPhotos />
                  </>
                ) : searchParams.get('view') === 'upload-return-photos' ? (
                  <>
                    <div className="flex flex-col items-start">
                      <IconButton onClick={() => router.back()} className="text-primary">
                        <IoMdArrowRoundBack size={30} />
                      </IconButton>
                      <ReservationPhotos />
                    </div>
                  </>
                ) : selectedTab === 'travelDetails' ||
                  selectedTab === 'billingDetails' ||
                  selectedTab === 'condition' ||
                  selectedTab === 'location' ||
                  selectedTab === 'notes' ||
                  selectedTab === 'deliveryInfo' ? (
                  <>
                    <BasicDetailsWrapper pathName={pathName} />
                    <TabContent id="billing-details" refProp={billingDetailsRef}>
                      {updatedTravelData?.isUserGuest ? (
                        <TravelBilling isTravelUpdatedPage={true} />
                      ) : (
                        <ReservationBilling isTravelUpdatedPage={true} />
                      )}
                    </TabContent>

                    <TabContent id="location-details" refProp={locationDetailsRef}>
                      <TravelLocation isTravelUpdatedPage={true} />
                    </TabContent>

                    <TabContent id="condition-details" refProp={conditionDetailsRef}>
                      <ReservationCondition isTravelUpdatedPage={true} />
                    </TabContent>
                    {isDeliveryEnabled && (
                      <TabContent id="deliveryInfo-details" refProp={deliveryInfoRef}>
                        <TravelDeliveryLocationsInfo />
                      </TabContent>
                    )}
                    <TabContent id="notes" refProp={reservationNotesRef}>
                      <ReservationNotes />
                    </TabContent>
                  </>
                ) : selectedTab === 'photos' || searchParams.get('tab') === 'photos' ? (
                  <>
                    <BasicDetailsWrapper pathName={pathName} />
                    <TabContent id="photo-details" refProp={photoDetailsRef}>
                      <TravelPhotos isTravelUpdatedPage={true} />
                    </TabContent>
                  </>
                ) : selectedTab === 'reviews' || searchParams.get('tab') === 'reviews' ? (
                  <>
                    <BasicDetailsWrapper pathName={pathName} />
                    <TabContent id="review-details" refProp={reviewDetailsRef}>
                      <TravelReview isTravelUpdatedPage={true} />
                    </TabContent>
                  </>
                ) : selectedTab === 'odometer' || searchParams.get('tab') === 'odometer' ? (
                  <>
                    <>
                      <BasicDetailsWrapper pathName={pathName} />
                      <TabContent id="odometer-details" refProp={odometerDetailsRef}>
                        {pathName?.includes('reservations') ? (
                          <>
                            <UpdateVehicleInformation isTravelUpdatedPage={true} />
                            <TravelOdometer isTravelUpdatedPage={true} isHost={true} />
                          </>
                        ) : (
                          <TravelOdometer isTravelUpdatedPage={true} />
                        )}
                      </TabContent>
                    </>
                  </>
                ) : selectedTab === 'travel-update-history' || searchParams.get('tab') === 'travel-update-history' ? (
                  <>
                    <>
                      <BasicDetailsWrapper pathName={pathName} />
                      <TabContent id="travel-update-history" refProp={reservationHistoryRef}>
                        {pathName?.includes('travels') ? <TravelUpdateHistory reservationDetailsData={travelDetails} /> : ''}
                      </TabContent>
                    </>
                  </>
                ) : (
                  <>
                    <>
                      <TravelDetailsM />
                    </>
                  </>
                )}
              </div>
            ) : (
              <NotFoundRedirect />
              // notFound()
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TravelDetailsMainM;
