'use client';
import StepHeader from '@/components/CarListing/StepHeader';
import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Avatar, Button, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { IoIosCall } from 'react-icons/io';
import { IoCall } from 'react-icons/io5';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { PiPathBold } from 'react-icons/pi';

const ReservationInfo = () => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { vehicleDetails } = useProfileInfoContext();
  console.log(vehicleDetails);
  const { userProfileInfo } = useUserCredContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width: 960px)');
  const formatDate = (dateString: string) => {
    const formattedDate = dayjs(dateString).format('MMM YYYY ');
    return formattedDate;
  };
  const formatEndDate = (dateString: string) => {
    const formattedDate = dayjs(dateString).format('DD MMM YYYY | h:mm A');
    return formattedDate;
  };
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const tripStart = vehicleDetails?.startDate;
      const tripEnd = vehicleDetails?.endDate;
      if (tripStart) {
        const tripStartDate: Dayjs = dayjs(tripStart);
        const tripEndDate: Dayjs = dayjs(tripEnd);
        const currentTime: Dayjs = dayjs();

        if (tripStartDate.isAfter(currentTime)) {
          const duration = tripStartDate.diff(currentTime);
          const days = Math.floor(duration / (24 * 60 * 60 * 1000));
          const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));

          let timeRemainingText = '';
          if (days > 0) {
            timeRemainingText += `${days} day${days > 1 ? 's' : ''} `;
          }
          if (hours > 0) {
            timeRemainingText += `${hours} hour${hours > 1 ? 's' : ''} `;
          }
          if (minutes > 0) {
            timeRemainingText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
          }

          setTimeRemaining(timeRemainingText.trim());
        } else if (tripStartDate.isBefore(currentTime) && tripEndDate.isAfter(currentTime)) {
          setTimeRemaining('Travel is ongoing');
        }
      } else {
        setTimeRemaining('Travel has already ended');
      }
    };

    calculateTimeRemaining();

    const intervalId: NodeJS.Timeout = setInterval(calculateTimeRemaining, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [vehicleDetails]);

  return (
    <div>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        {/* <div className="flex md:flex-row flex-col justify-between"> */}
        <div className=" flex justify-center items-center text-center">
          <Image
            src={vehicleDetails?.coverPhoto?.secureUrl || ''}
            alt="CarImage"
            // width={600}
            // height={320}
            width={isSmallScreen ? 350 : isMediumScreen ? 300 : 600}
            height={isSmallScreen ? 200 : isMediumScreen ? 200 : 380}
            className="object-cover rounded-lg"
          />
        </div>
        {!isSmallScreen ? (
          <div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="h-1/2">
                  <StepHeader title={`${vehicleDetails?.carInfo?.car?.model}`} />
                </div>
                {/* <div className="h-1/2 flex flex-row justify-between"> */}
                <div className="grid grid-cols-2 gap-4">
                  <span className="flex items-center justify-start">
                    <Rating initialRating={4} />
                  </span>
                  <span className="flex items-center justify-end">
                    <PiPathBold />
                    311 trips
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold lg:text-6xl text-md">${vehicleDetails?.reservationInfo?.basePrice?.totalPrice}</span>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                <Avatar
                  src={vehicleDetails?.partnerInfo?.profilePhoto || '/UserProfile/default-pp.jpg'}
                  // sx={{ width: 100, height: 100 }}
                  sx={{
                    width: isSmallScreen ? 50 : 100,
                    height: isSmallScreen ? 50 : 100,
                  }}
                />
                <div className="flex flex-col ml-2">
                  <span className="font-bold">{`${vehicleDetails?.partnerInfo?.firstName} ${vehicleDetails?.partnerInfo?.lastName}`}</span>
                  <span>
                    208 trips <BsDot /> {formatDate(vehicleDetails?.partnerInfo?.joinedDate)}
                  </span>
                  <span>Typically responds in 12 minutes</span>
                  <span>
                    <Rating initialRating={4.6} />
                  </span>
                </div>
              </div>
              <div className="mt-6">
                {vehicleDetails?.partnerInfo?.phoneNumber ? (
                  <span className="flex flex-row font-bold text-lg">
                    <IoIosCall size={30} className="text-primary" />
                    <span> {vehicleDetails?.partnerInfo?.phoneNumber}</span>
                  </span>
                ) : (
                  <span className="flex flex-row font-bold text-lg">
                    <IoIosCall size={30} className="text-primary" />
                    <span>None</span>
                  </span>
                )}
                <div className=" flex justify-center items-center mt-2">
                  <Button fullWidth className="normal-case text-white bg-primary font-bold">
                    Message
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="bg-gray-400 h-[1px] flex-grow" />
              <div className="flex flex-row justify-between my-4">
                <div className="flex flex-col">
                  {timeRemaining ? (
                    <>
                      <span className="text-lg text-black font-bold">
                        Trips Start in <span className="font-bold text-success">{timeRemaining}</span>
                      </span>
                      <span className="text-gray-400 mt-2">Ends at {formatEndDate(vehicleDetails?.endDate)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-black font-bold">Travel Ended</span>
                      <span className="text-gray-400 mt-2">Hope you enjoy your travel</span>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <Button sx={{ border: 2 }} className="font-bold border-primary text-primary hover:bg-primary hover:text-white normal-case">
                    Cancel
                  </Button>
                  <span className="text-gray-400 mt-2">Cancel Travel</span>
                </div>
              </div>
              <div className="bg-gray-400 h-[1px] flex-grow my-2" />
            </div>
          </div>
        ) : (
          // <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-rows-[auto,1fr]">
            <div className="flex flex-row justify-between">
              <div>
                <StepHeader title={`${vehicleDetails?.carInfo?.car?.model}`} />
              </div>
              <div>
                <span className="font-bold text-2xl">${vehicleDetails?.reservationInfo?.basePrice?.totalPrice}</span>
              </div>
            </div>
            <div className="">
              <span>
                <PiPathBold />
                311 trips
              </span>
              <Rating initialRating={4.6} />
              <div className="flex flex-row">
                <LuCalendarCheck2 className="text-primary mr-2" size={20} />
                Reservation ID: <span className="font-bold">{vehicleDetails?.reservationId}</span>
              </div>
            </div>
            <div className="my-6">
              <span className="text-lg font-bold">Transport Partner</span>
              <div className="my-4 p-4 flex flex-row justify-center items-center bg-white shadow-lg shadow-secondary">
                <div>
                  <Avatar src={vehicleDetails?.partnerInfo?.profilePhoto || '/UserProfile/default-pp.jpg'} sx={{ width: 50, height: 50 }} />
                </div>
                <div className="flex flex-col px-2">
                  <span className="font-bold">{`${vehicleDetails?.partnerInfo?.firstName} ${vehicleDetails?.partnerInfo?.lastName}`}</span>
                  <span>
                    208 trips <BsDot /> {formatDate(vehicleDetails?.partnerInfo?.joinedDate)}
                  </span>
                  <span>Typically responds in 12 minutes</span>
                  <span>
                    <Rating initialRating={4.6} />
                  </span>
                </div>
                <div>
                  <IoCall size={50} className="rounded-full text-white bg-primary p-4 flex justify-center items-center" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationInfo;
