'use client';
import TransmissionFilter from '@/components/Search/Carfiltering/TransmissionFilter';
import { useUserCredContext } from '@/context/UserCredProvider';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaCar, FaCog, FaDollarSign, FaMinus, FaPlus, FaUsers } from 'react-icons/fa';
import { LuArrowRight } from 'react-icons/lu';
import { MdVerified } from 'react-icons/md';
import PriceRangeFilterMainSection from './PriceRangeFilter/PriceRangeFilterMainSection';
import SeatFilter from './SeatsFilter';
import VehicleTypeFilter from './VehicleTypeFilter';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { TSearchedCar, TSearchPriceMode } from '@/types/car-search/carSearchType';
import { useSearchParams } from 'next/navigation';
import { useSearchContext } from '@/context/SearchProvider';

interface FilterMenuProps {
  availableCarList: TSearchedCar[]; // Adjust the type according to your data
  priceMode: TSearchPriceMode;
  setPriceMode: React.Dispatch<React.SetStateAction<TSearchPriceMode>>;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ availableCarList = [], priceMode, setPriceMode }) => {
  useHealthCheck();
  useGetVerificationInfo();
  const { userCred, isAllVerificationStepsCompleted, setIsAllVerificationStepsCompleted, userProfileInfo } = useUserCredContext();
  const params = useSearchParams();
  const vehicleType = params.get('vehicleType') ?? '';
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;

  useEffect(() => {
    const { verificationStatus, dynamicText, isAllStepsCompleted, dynamicSearchParams } = getVerificationStatusInfo(
      profileInfo,
      guestVerificationInfo
    );

    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
  }, [profileInfo, guestVerificationInfo]);

  // const [priceMode, setPriceMode] = useState<'Day' | 'Hour'>('Day'); // State for the toggle

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceFilter: true,
    pricePerHour: false,
    vehicleType: false,
    seats: false,
    transmission: false,
  });

  // Dynamically open vehicleType section whenever vehicleType param is present
  useEffect(() => {
    if (vehicleType && availableCarList?.length > 0) {
      setOpenSections((prev) => ({
        ...prev,
        vehicleType: true,
      }));
    }
  }, [vehicleType, availableCarList]);
  const handleClick = (mode: 'Day' | 'Hour') => {
    setPriceMode(mode);
    setOpenSections((prevSections) => ({
      ...prevSections,
      priceFilter: true,
      pricePerHour: false,
      vehicleType: !!vehicleType,
      seats: false,
      transmission: false,
    }));
  };
  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const newState: Record<string, boolean> = {
        priceFilter: prev.priceFilter, // Keep the price filter state unchanged
      };

      // Set the clicked section to true, close all others (except priceFilter)
      Object.keys(prev).forEach((key) => {
        if (key === section) {
          newState[key] = !prev[key]; // Toggle clicked section
        } else if (key !== 'priceFilter') {
          newState[key] = false; // Close all other filters
        }
      });

      return newState;
    });
  };

  const baseUrl = userCred?.loggedIn
    ? `${process.env.NEXT_PUBLIC_DOMAIN}/au/verify-account/${userCred?.userId}`
    : `${process.env.NEXT_PUBLIC_DOMAIN}/get-verified`;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm shadow-secondary min-h-[450px]">
      <div className="flex justify-center w-full">
        {/* Only display verification link if the user is not logged in */}
        {userCred?.loggedIn && isAllVerificationStepsCompleted && userProfileInfo?.guestVerification?.finalVerificationStatus === 'approved' ? (
          <div className="bg-success text-white py-2 px-3 w-full rounded-lg mb-6 text-center flex items-center justify-center transition-colors">
            <MdVerified className="text-white mr-0" size={24} />
            <span className="text-white pl-1 py-1 text-sm mr-1">Verified Account</span>
            {/* <span className="text-sm">Let&apos;s Roll</span> */}
          </div>
        ) : (
          <Link target="_blank" href={baseUrl} className="text-white inline-block no-underline w-full">
            <div className="bg-primary text-white py-2 px-3 w-full rounded-lg mb-6 hover:bg-[#6b006b] transition-colors text-center flex items-center justify-center">
              <span>Verify Your Account</span>
              <LuArrowRight className="ml-1 text-white" size={20} />
            </div>
          </Link>
        )}
      </div>

      <div>
        {/* Only show filters if the user is logged in */}

        <>
          {/* Price per Day Filter */}
          <div>
            <div className="h-[1px] bg-gray-200 my-0" />
            <div
              className="w-full flex items-center cursor-pointer justify-between py-2 text-left border-none bg-white"
              onClick={() => toggleSection('priceFilter')}
            >
              <div className="flex items-center justify-between p-0 rounded-md">
                <div className={`flex items-center gap-3 ${openSections.priceFilter ? 'mb-2' : ''}`}>
                  <FaDollarSign size={18} className="text-gray-600 " />
                  <span className="font-medium text-gray-800">Price Per:</span>
                  <div className="flex items-center gap-0 bg-slate-300 rounded-md">
                    {/* "Day" button */}
                    <div
                      className={`px-2 rounded cursor-pointer ${
                        priceMode === 'Day'
                          ? 'bg-primary text-white px-2 font-semibold rounded-md shadow-lg'
                          : 'text-gray-500 hover:bg-gray-300 px-2 rounded-md'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation to prevent triggering parent onClick
                        handleClick('Day');
                      }}
                    >
                      Day
                    </div>
                    {/* "Hour" button */}
                    <div
                      className={`px-2 rounded cursor-pointer ${
                        priceMode === 'Hour'
                          ? 'bg-primary text-white px-2 font-semibold rounded-md shadow-lg'
                          : 'text-gray-500 hover:bg-gray-300 px-2 rounded-md'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation to prevent triggering parent onClick
                        handleClick('Hour');
                      }}
                    >
                      Hour
                    </div>
                  </div>
                </div>
              </div>
              {openSections.priceFilter ? <FaMinus className="text-gray-600" size={12} /> : <FaPlus className="text-gray-600" size={12} />}
            </div>
            {openSections.priceFilter && (
              <div className="text-sm text-gray-600 mb-3 ">
                <PriceRangeFilterMainSection availableCarList={availableCarList} priceMode={priceMode} />
              </div>
            )}
            <div className="h-[1px] bg-gray-200 my-0" />
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <div
              onClick={() => toggleSection('vehicleType')}
              className="w-full flex  cursor-pointer items-center justify-between py-2 text-left border-none bg-white"
            >
              <div className="flex items-center gap-3">
                <FaCar size={18} className="text-gray-600" />
                <span className="font-medium text-gray-800">Vehicle Type</span>
              </div>
              {openSections.vehicleType ? <FaMinus className="text-gray-600" size={12} /> : <FaPlus className="text-gray-600" size={12} />}
            </div>
            {openSections.vehicleType && (
              <div className="text-sm text-gray-600 mb-3">
                <VehicleTypeFilter vehicleType={vehicleType} />
              </div>
            )}
            <div className="h-[1px] bg-gray-200 my-0" />
          </div>

          {/* Seats Filter */}
          <div>
            <div
              onClick={() => toggleSection('seats')}
              className="w-full  cursor-pointer flex items-center justify-between py-2 text-left border-none bg-white"
            >
              <div className="flex items-center gap-3">
                <FaUsers size={18} className="text-gray-600" />
                <span className="font-medium text-gray-800">Seats</span>
              </div>
              {openSections.seats ? <FaMinus className="text-gray-600" size={12} /> : <FaPlus className="text-gray-600" size={12} />}
            </div>
            {openSections.seats && (
              <div className="text-sm text-gray-600 mb-3">
                <SeatFilter />
              </div>
            )}
            <div className="h-[1px] bg-gray-200 my-0" />
          </div>

          {/* Transmission Filter */}
          <div>
            <div
              onClick={() => toggleSection('transmission')}
              className="w-full  cursor-pointer flex items-center justify-between py-2 text-left border-none bg-white"
            >
              <div className="flex items-center gap-3">
                <FaCog size={18} className="text-gray-600" />
                <span className="font-medium text-gray-800">Transmission</span>
              </div>
              {openSections.transmission ? <FaMinus className="text-gray-600" size={12} /> : <FaPlus className="text-gray-600" size={12} />}
            </div>
            {openSections.transmission && (
              <div className="text-sm text-gray-600 mb-3">
                <TransmissionFilter />
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default FilterMenu;
