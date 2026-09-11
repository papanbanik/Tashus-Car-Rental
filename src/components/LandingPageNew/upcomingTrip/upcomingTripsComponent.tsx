'use client';
import React, { useEffect, useState, useRef } from 'react';

import { getUpcomingTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { useTravelList } from '@/hooks/travel/useTravelList';
import { useUserCredContext } from '@/context/UserCredProvider';
import SmallScreenTravelCard from './smallScreenTravelCardNew';
import { Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { defaultCoordinate } from '@/utils/Functions/searchCommonFn';
import { getInitialLocation } from '@/utils/Lists/initialLocations';
interface TravelData {
  reservationStatus: string;
  vehicleName: string;
  location: string;
  pickupTime: string;
  dropoffTime: string;
  price: number;
}

function UpcomingTripsComponent() {
  const pickupTime = getDefaultPickupTime();
  const returnTime = getDefaultReturnTime();
  const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniState, complete_address } = getInitialLocation()[0];

  const { data } = useTravelList();
  const { userCred } = useUserCredContext();
  const [upcomingTravelList, setUpcomingTravelList] = useState<TSingleTravel[]>([]);
  const router = useRouter();
  const pathName = usePathname();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleUpdate = async () => {
    const tempUpcomingList = await getUpcomingTravels(data?.data);
    const updatedTravelList: TSingleTravel[] = await getUpdatedTravelList(tempUpcomingList, true);
    setUpcomingTravelList(updatedTravelList);
  };

  useEffect(() => {
    if (!!userCred?.userId && data?.data?.length > 0) {
      handleUpdate();
    }
  }, [data?.data, userCred?.userId]);

  const showDetails = (travelId: number) => {
    const updatedPathname = pathName.slice(0, pathName.lastIndexOf('/'));
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}${updatedPathname}/dashboard/${userCred?.userId}/travels/details/${travelId}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      scrollContainerRef.current.scrollLeft = newScroll;
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    checkScrollPosition();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
    }
    return () => {
      const container = scrollContainerRef.current;
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [upcomingTravelList]);

  return (
    <>
      {userCred?.userId && upcomingTravelList.length > 0 && (
        <div>
          <Typography className="text-2xl font-semibold mb-1">Your Upcoming Trips</Typography>
          <Typography className="text-base text-gray-500 mb-4">
            You have {upcomingTravelList.length} upcoming trip{upcomingTravelList.length > 1 ? 's' : ''}
          </Typography>

          <div className="relative">
            {canScrollLeft && (
              <>
                <button
                  className="absolute z-50 left-[-50px] top-1/2 transform -translate-y-1/2 bg-[#E6CDE6] text-primary w-10 h-10 rounded-full flex justify-center items-center shadow-lg hover:bg-[#5C8D07] hover:text-white transition-all border-none"
                  onClick={() => scroll('left')}
                >
                  <FiChevronLeft />
                </button>
                <div className="absolute hidden md:block top-0 left-0 h-[93%] w-16 bg-gradient-to-r from-[#EDEFEB] to-transparent pointer-events-none"></div>
              </>
            )}

            {canScrollRight && (
              <>
                {' '}
                <button
                  className="absolute z-50 right-[-50px] top-1/2 transform -translate-y-1/2 bg-[#E6CDE6] text-primary w-10 h-10 rounded-full flex justify-center items-center shadow-lg hover:bg-[#5C8D07] hover:text-white transition-all border-none"
                  onClick={() => scroll('right')}
                >
                  <FiChevronRight />
                </button>
                <div className="absolute hidden md:block top-0 right-0 h-[93%] w-16 bg-gradient-to-l from-[#EDEFEB] to-transparent pointer-events-none"></div>
              </>
            )}

            <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex flex-row space-x-3 w-max">
                {upcomingTravelList.map((travel, index) => (
                  <SmallScreenTravelCard key={index} showDetails={showDetails} travel={travel} />
                ))}
                <div
                  className="flex flex-col items-center justify-center w-full bg-[#FAF6F6] shadow-md shadow-secondary rounded-lg max-w-[440px] min-w-[350px] cursor-pointer commonMarginBottom"
                  onClick={() =>
                    router.push(
                      `/search?lat=${defaultCoordinate[1].toString()}&long=${defaultCoordinate[0].toString()}&pickup=${pickupTime}&return=${returnTime}&city=${iniCity}&region=${iniState}&country=${iniCountry}&address=${complete_address}`
                    )
                  }
                >
                  <IoIosAddCircleOutline className="text-8xl text-[#D1A5D1] " />
                  <Typography className="text-center text-[#D1A5D1]">Add another Trip</Typography>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default UpcomingTripsComponent;
