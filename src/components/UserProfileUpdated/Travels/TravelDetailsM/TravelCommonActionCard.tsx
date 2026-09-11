'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaClock, FaClipboardList, FaCopy } from 'react-icons/fa';
import { useTravelContext } from '@/context/TravelProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import dayjs from 'dayjs';
import { combineDateTime, getDefaultEndTime, getDefaultStartTime } from '@/utils/Functions/dateTimeCommonFn';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { BiSupport } from 'react-icons/bi';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

interface TravelCommonActionCardProps {
  timeRemaining?: string;
  title?: string;
  currentStatus?: string;
  isStartInvalid?: boolean;
  isEndDayPassed?: boolean;
  isLatePickup?: boolean;
}

function TravelCommonActionCard({ timeRemaining, title, currentStatus, isStartInvalid, isEndDayPassed }: TravelCommonActionCardProps) {
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationId = travelId || reservationIdParam;
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const [isCopy, setIsCopy] = useState(false);
  const isSmall = useMediaQuery('(max-width: 1024px)');

  const handleCopy = () => {
    navigator.clipboard.writeText(reservationId);
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 2000);
  };

  return (
    <>
      <div className="ml-0 sm:ml-4  w-full">
        <div className="w-full rounded-[16px] flex justify-between  h-28 bg-primary shadow-lg">
          <div className="w-[35%] rounded-[16px] overflow-hidden">
            {currentStatus === 'completed' || currentStatus === 'cancelled' ? (
              <Image
                src="/CardsImages/EndTravel.png"
                alt="Image"
                className="w-full h-full object-cover"
                layout="responsive"
                width={300}
                height={200}
              />
            ) : currentStatus === 'latePickup' ? (
              <Image
                src="/CardsImages/EndTravel2.png"
                alt="Image"
                className="w-full h-full object-cover"
                layout="responsive"
                width={300}
                height={200}
              />
            ) : currentStatus === 'started' ? (
              <Image
                src="/CardsImages/StartTravel.png"
                alt="Image"
                className="w-full h-full object-cover"
                layout="responsive"
                width={300}
                height={200}
              />
            ) : (
              <Image
                src="/CardsImages/Tashusreservationcards.png"
                alt="Image"
                className="w-full h-full object-cover"
                layout="responsive"
                width={300}
                height={200}
              />
            )}
          </div>

          <div className="w-[45%] flex flex-col justify-center ps-4">
            <div className="flex flex-row w-full">
              <div className=" flex flex-col justify-center">
                <div className="flex flex-row items-start text-white">
                  <div className="flex flex-col">
                    {currentStatus === 'cancelled' ? (
                      <p className={`m-0 p-0  ${isSmall ? 'text-sm' : 'text-xl'}} text-white`}>
                        Travel has been cancelled by{' '}
                        {travelDetails?.reservationStatus?.includes('Host')
                          ? 'partner'
                          : travelDetails?.reservationStatus?.includes('Guest')
                          ? 'you'
                          : 'Tashus'}
                      </p>
                    ) : (
                      <>
                        <span className={` flex ${isSmall ? 'flex-col' : 'flex-row'}`}>
                          <div className={`flex  m-0   flex-row ${isSmall ? 'text-sm' : ''}}`}>
                            <p className={`mr-3 m-0 ${currentStatus === 'completed' || currentStatus === 'latePickup' ? 'text-xl uppercase ' : ''}`}>
                              {title ?? ''}
                            </p>
                          </div>

                          <div className="flex flex-row m-0 font-bold">
                            <p className="m-0">{currentStatus === 'completed' ? '' : timeRemaining}</p>
                          </div>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {!isSmall && (
              <div className="w-full text-white">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-white" />
                    <span>Duration: {updatedTravelData?.totalDurationText}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClipboardList className="mr-2 text-white" />
                    <span className="flex items-center">
                      Reservation ID: <b className="ms-1"> {reservationId}</b>
                      {isCopy ? (
                        <span className="text-white text-xs ms-1">Copied</span>
                      ) : (
                        <FaCopy className="ml-2 cursor-pointer text-white" onClick={handleCopy} title="Copy Reservation ID" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className=" p-4 flex flex-col  space-y-2 justify-center ">
            {/* {currentStatus === 'upcoming' ? (
              <span className="flex">
                <Button
                  variant="contained"
                  onClick={handleStartTravel}
                  disabled={
                    updatedTravelData?.paymentStatus === 'pending' ||
                    isStartInvalid ||
                    isEndDayPassed ||
                    isGuestRestrict(guestAccess) ||
                    isGuestSuspended(guestAccess)
                  }
                  className={`w-full border-none outline-none normal-case py-1  rounded-full ${
                    updatedTravelData?.paymentStatus === 'pending' ||
                    isStartInvalid ||
                    isEndDayPassed ||
                    isGuestRestrict(guestAccess) ||
                    isGuestSuspended(guestAccess)
                      ? 'bg-gray-400 text-gray-50'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  Start Travel
                </Button>
              </span>
            ) : currentStatus === 'completed' ? (
              <Button
                variant="contained"
                disabled={isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
                className="w-full border-none outline-none normal-case py-1  text-white rounded-full hover:bg-green-800 bg-green-600"
              >
                Reserve Again
              </Button>
            ) : (
              ''
            )} */}

            <Link href={`/support/support-center/${reservationId}?role=${travelId ? 'guest' : 'host'}&from=${travelId ? 'travel' : 'reservation'}`}>
              <Button
                variant="contained"
                className="w-full mt-1 py-1 px-6 bg-white border border-white text-primary normal-case rounded-full  hover:border-success hover:bg-success hover:text-white transition-colors duration-300"
                startIcon={<BiSupport />}
              >
                Support
              </Button>
            </Link>
          </div>
          {/* {currentStatus === 'upcoming' && (
            <Tooltip
              enterTouchDelay={0}
              title="Enables 15 mins before pickup time"
              placement="top"
              className="p-0 m-0 relative -top-[22px] right-[12px] "
            >
              <IconButton size="small" className="text-white">
                <AiOutlineQuestionCircle className="text-white" />
              </IconButton>
            </Tooltip>
          )} */}
        </div>
      </div>
    </>
  );
}

export default TravelCommonActionCard;
