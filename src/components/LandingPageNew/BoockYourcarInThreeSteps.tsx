'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { defaultCoordinate } from '@/utils/Functions/searchCommonFn';
import { getInitialLocation } from '@/utils/Lists/initialLocations';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaIdCard, FaCar, FaRoad } from 'react-icons/fa';

const BookYourCarInThreeSteps = () => {
  const { userCred } = useUserCredContext();
  const router = useRouter();
  const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniState, complete_address } = getInitialLocation()[0];
  const pickupTime = getDefaultPickupTime();
  const returnTime = getDefaultReturnTime();
  return (
    <div className=" w-full h-full bg-cover bg-right flex items-center sm:px-6 px-0 rounded-2xl bg-[url('/landingPageNew/forPhone.jpg')] lg:bg-[url('/landingPageNew/new23.png')] ">
      {/* Main content */}
      <div className="relative  z-10 flex flex-col sm:space-y-6 space-y-2 text-white w-full">
        {/* Title */}
        <div className="text-[24px] sm:text-4xl md:text-4xl font-bold leading-tight sm:leading-normal ml-6 mb-3 md:mb-0">
          Rent vehicle on <br />
          three easy steps
        </div>

        {/* Steps Section */}
        <div className="flex flex-row items-center justify-start sm:text-lg text-[15px] space-x-4 sm:space-x-8 ml-6 mt-2">
          {/* Step 1 */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/get-verified`)}>
            <FaIdCard className="h-[1em]" />
            <span className="transition-all duration-300 hover:underline">Verify ID</span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-white hidden md:flex"></div>

          {/* Step 2 */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() =>
              router.push(
                `/search?lat=${defaultCoordinate[1].toString()}&long=${defaultCoordinate[0].toString()}&pickup=${pickupTime}&return=${returnTime}&city=${iniCity}&region=${iniState}&country=${iniCountry}&address=${complete_address}`
              )
            }
          >
            <FaCar className="h-[1em]" />
            <span className="transition-all duration-300 hover:underline">Choose Car</span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-white hidden md:flex"></div>

          {/* Step 3 */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              if (userCred?.loggedIn) {
                router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred.userId}/travels/current`);
              } else {
                router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/login`);
              }
            }}
          >
            <FaRoad className="h-[1em]" />
            <span className="transition-all duration-300 hover:underline">Hit the Road</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookYourCarInThreeSteps;
