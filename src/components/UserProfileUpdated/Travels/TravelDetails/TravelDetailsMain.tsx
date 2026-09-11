'use client';

import CommonBreadCrumb from '@/components/Common/Breadcrumbs/CommonBreadCrumb';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { loadText } from '@/utils/Functions/randomCommonFn';
import { IconButton, Tab, Tabs, useMediaQuery } from '@mui/material';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiFillWechat } from 'react-icons/ai';
import { BiBookContent } from 'react-icons/bi';
import { BsFillCarFrontFill } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdArrowRoundBack, IoMdPhotos } from 'react-icons/io';
import { RiBillFill } from 'react-icons/ri';
import ReservationPhotos from '../../Reservations/ReservationDetails/ReservationPhotos';
import UpdateVehicleInformation from '../../Reservations/ReservationDetails/UpdateVehicleInformation/UpdateVehicleInformation';
import VerifyGuest from '../../Reservations/VerifyGuest/VerifyGuest';
import TravelBasics from './TravelBasics';
import TravelDetails from './TravelDetails';
import TravelPhotos from './TravelPhotos';

const tabData = [
  { label: 'Details', icon: <BsFillCarFrontFill size={20} className="text-primary" /> },
  { label: 'Location', icon: <FaLocationDot size={20} className="text-primary" /> },
  { label: 'Condition', icon: <BiBookContent size={20} className="text-primary" /> },
  { label: 'Photos', icon: <IoMdPhotos size={20} className="text-primary" /> },
  { label: 'Billing', icon: <RiBillFill size={20} className="text-primary" /> },
  { label: 'Reviews', icon: <AiFillWechat size={20} className="text-primary" /> },
];

const TravelDetailsMain = () => {
  const searchParams = useSearchParams(); //travel-photos
  const { userId, travelId, reservationId: reservationIdParam } = useParams<{ userId: string; travelId: string; reservationId: string }>();
  const reservationId = travelId || reservationIdParam;
  const { guestAccess, partnerAccess, travelDetails } = useProfileInfoContext();
  const pathName = usePathname();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMedium = useMediumForTravelDetails();
  const { data } = useTravelDetails();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    if (searchParams.get('view') === 'travel-photos') {
      setSelectedTab(3);
    } else if (searchParams.get('view') === 'update-vehicle-info') {
      setSelectedTab(2);
    }
  }, [searchParams]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleTabRedirect = (index: number, label: string) => {
    if (label !== 'Photos') {
      router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}`);
      scrollToSection(`section${index}`);
    } else {
      router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=travel-photos`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    var headerOffset = 200;
    if (element && typeof window !== undefined) {
      // element.scrollIntoView({ behavior: 'smooth' });
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      // element.scrollIntoView({
      //   block: 'start',
      //   behavior: 'smooth',
      // });
    }
  };
  const reservationUrl = `/dashboard/${userId}/${pathName.includes('reservations') ? 'reservations' : 'travels'}/current`;
  const reservationBreadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: pathName.includes('reservations') ? 'Reservations' : 'Travels', href: reservationUrl },
    { label: `${!!travelDetails?.carInfo?.car?.model ? `${reservationId} (${travelDetails?.carInfo?.car?.model})` : loadText}` },
  ];
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-10/12 gap-2">
        <div className="mb-4">
          <CommonBreadCrumb items={reservationBreadcrumbItems} />
        </div>
        <div className="sticky top-[60px] bg-neutral z-50 flex items-center ">
          <div>
            <IconButton size="small" className="normal-case underline text-md font-semibold p-0" onClick={() => router.back()}>
              <IoMdArrowRoundBack size={isSmallScreen ? 20 : 30} className="text-primary" />
            </IconButton>
          </div>
          <div className="flex-grow flex justify-center items-center">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="Reservation Tabs"
              className={`${isSmallScreen && 'w-full max-w-[300px] overflow-x-auto '}`}
            >
              {tabData.map((tab: any, index: number) => (
                <Tab
                  className="normal-case text-black font-bold"
                  key={index}
                  label={tab.label}
                  // icon={tab.icon}
                  onClick={() => handleTabRedirect(index, tab?.label)}
                />
              ))}
            </Tabs>
          </div>
        </div>
        {pathName.includes('reservations') && isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
        {pathName.includes('travels') && isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        {pathName.includes('travels') && isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
        {searchParams.get('view') === 'travel-photos' ? (
          <>
            <TravelBasics></TravelBasics>
            <TravelPhotos></TravelPhotos>
          </>
        ) : searchParams.get('view') === 'upload-pickup-photos' ? (
          <ReservationPhotos />
        ) : searchParams.get('view') === 'upload-return-photos' ? (
          <ReservationPhotos />
        ) : searchParams.get('view') === 'verify-guest' && pathName?.includes('reservations') ? (
          <VerifyGuest></VerifyGuest>
        ) : searchParams.get('view') === 'update-vehicle-info' && pathName?.includes('reservations') ? (
          <UpdateVehicleInformation></UpdateVehicleInformation>
        ) : (
          <TravelDetails></TravelDetails>
        )}
      </div>
    </div>
  );
};

export default TravelDetailsMain;
