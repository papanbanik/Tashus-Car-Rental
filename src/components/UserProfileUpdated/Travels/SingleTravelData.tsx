import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Chip, Divider, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { TbListDetails } from 'react-icons/tb';

import { reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { RiPinDistanceFill } from 'react-icons/ri';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface ISingleTravelData {
  travel: TSingleTravel;
  showDetails: (reservationId: number) => void;
}

const SingleTravelData = ({ travel, showDetails }: ISingleTravelData) => {
  const pathName = usePathname();
  const updatedPathname = pathName.slice(0, pathName.lastIndexOf('/'));

  const isSmallScreen = useMediaQuery('(max-width:850px)'); // Check for small screen
  const { userCred } = useUserCredContext();
  const isUserGuest = userCred?.userId === travel?.guestId ? true : false;
  // console.log(travel?.reservationStatus);
  // console.log(travel?.returnDate);

  return (
    <div key={travel?.reservationId} className="flex w-full bg-[#FAF6F6] shadow-md shadow-secondary rounded-lg ">
      {/* bg-[#FAF6F6] */}
      {isSmallScreen ? (
        // Mobile Layout
        <div className="mx-auto  shadow-lg rounded-lg w-full  bg-[#FAF6F6]">
          <div className="px-4 pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-center">
                {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && pathName?.includes('travels') ? (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details-new/${travel?.reservationId}`}
                    className="text-black md:text-sm text-xs text-end no-underline"
                  >
                    <div className="bg-[#F6E7F6] text-[#800080] font-bold rounded-2xl h-8  px-2 flex items-center justify-center text-xs">
                      {travel?.reservationId}
                    </div>
                  </Link>
                ) : process.env.NEXT_PUBLIC_NODE_ENV === 'development' && pathName?.includes('reservations') ? (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details-new/${travel?.reservationId}`}
                    className="text-black md:text-sm text-xs text-end no-underline"
                  >
                    <div className="bg-[#F6E7F6] text-[#800080] font-bold rounded-2xl h-8  px-2 flex items-center justify-center text-xs">
                      {travel?.reservationId}
                    </div>
                  </Link>
                ) : (
                  <div className="bg-[#F6E7F6] text-[#800080] font-bold rounded-2xl h-8  px-2 flex items-center justify-center text-xs">
                    {travel?.reservationId}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center relative">
                <Image src={`${travel?.coverPhoto}`} alt="CarImage" width={125} height={125} className="rounded-full h-32 w-32 object-cover" />
                {/* <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center">
                  <div className="bg-white rounded-full py-1 px-2 shadow-md flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-gray-800 text-sm">4.6/5.0</span>
                  </div>
                </div> */}
              </div>
              <div className="flex flex-col items-end">
                {' '}
                {/* Use items-end to align items to the right */}
                <span className={`text-lg font-bold ${travel?.paymentStatus === 'pending' ? 'text-error' : ''}`}>
                  ${isUserGuest ? travel?.totalPrice?.toFixed(2) : travel?.hostRentalFees}
                </span>
                <div className="text-[#5C8D07] font-bold rounded-2xl h-8 w-16 flex items-center justify-center mt-1">
                  {' '}
                  {/* Added mt-1 for spacing */}
                  <div>
                    {travel?.reservationStatus === 'cancelledByGuest' ||
                    travel?.reservationStatus === 'cancelledByHost' ||
                    travel?.reservationStatus === 'cancelled' ? (
                      <Chip label="Cancelled" className="bg-red-100 text-xs text-error" />
                    ) : travel?.isPaymentExpired ? (
                      <Chip label="Expired" className="bg-red-100 text-xs text-error" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* <p className="text-gray-700 text-center text-lg font-bold mb-2">{travel?.vehicleModel}</p> */}
            <div className="flex flex-col items-center justify-center mt-4">
              <span className="text-center text-lg font-bold">{travel?.vehicleModel}</span>
              <span className="text-primary md:text-sm font-semibold text-xs text-center mb-2">{travel?.carNickName}</span>
            </div>
            <div className="flex flex-col">
              {/* Horizontal line at the top */}
              <div className="h-px w-full bg-gray-300 mb-1.5"></div>

              {/* Location with Icon aligned to the left */}
              <div className="flex items-center text-sm text-start ml-0 pl-0">
                <LocationOnIcon className="mr-1 text-primary text-[18px]" />
                <span>{travel?.pickupLocation}</span>
              </div>

              {/* Horizontal line at the bottom */}
              <div className="h-px w-full bg-gray-300 mt-1.5"></div>
            </div>

            {/* <div className="h-px w-full bg-gray-300 mb-0"></div>
            <div className="mb-0.5 flex justify-between items-center">
              <div className="flex items-center text-center">
                <FaCalendarAlt className="text-[#800080] text-lg mr-1" />
                <p className="text-gray-700 text-md">03 Days</p>
              </div>
              <div className="w-px h-10 bg-gray-300 mx-2"></div>
              <div className="flex items-center text-center">
                <FaClock className="text-[#800080] text-lg mr-1" />
                <p className="text-gray-700 text-md">09 Hours</p>
              </div>
              <div className="w-px h-10 bg-gray-300 mx-2 items-center"></div>
              <div className="flex items-center text-center">
                <FaCar className="text-[#800080] text-lg mr-1" />
                <p className="text-gray-700 text-md">12 Trips</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-300 mb-0"></div> */}
            {/* <div className="mb-0 flex items-center"></div> */}
          </div>
          {/* <div className="flex items-center mt-0 mb-0 mx-4 bg-red-200"> */}
          {/* <div className="flex items-start rounded-lg w-full">
              <ShowPickupReturnTime startDate={travel?.pickupDate} endDate={travel?.returnDate}></ShowPickupReturnTime>
              
              <div className=" flex items-center pr-2">
                <Image src="/dummy/pickup-dropoff.png" alt="Description" width={10} height={10} className="h-auto" />
                <div className="ml-2 text-left text-sm py-3">
                  <p className="my-0 py-0">
                    From <b>22 Sep 2022</b>
                  </p>
                  <p className="my-0 py-0">
                    To <b>27 Sep 2022</b>
                  </p>
                </div>
              </div>

             
              <div className="ml-4 text-left text-sm py-3">
                <p className="my-0 py-0">
                  KM included: <b>1780KM</b>
                </p>
                <p className="my-0 py-0">
                  <b>$12</b>/hour |<b>$50</b>/day
                </p>
              </div>
            </div> */}
          <div className="flex flex-col text-sm my-2  mx-4">
            <ShowPickupReturnTime startDate={travel?.pickupDate} endDate={travel?.returnDate}></ShowPickupReturnTime>

            <div className="h-px w-full bg-gray-300 mb-1.5 mt-1.5"></div>
            <div className="flex font-bold text-start ">
              {/* Vertical Divider */}

              {/* Distance and Time Section */}
              <div className="flex flex-row font-bold justify-between items-center w-full">
                <div className="flex items-center">
                  {/* Distance Icon */}
                  <RiPinDistanceFill className="mr-2 text-primary text-sm" />
                  {travel?.maximumDailyDistance ? (
                    <span>
                      KM Included:<span className="font-normal text-sm"> {`${travel?.maximumDailyDistance} KM`}</span>
                    </span>
                  ) : (
                    <span className=" text-sm font-normal">Unlimited Distance</span>
                  )}
                </div>

                <div className="flex items-center">
                  {/* Time Icon */}
                  <FaMoneyCheckAlt className="mr-2 text-primary text-sm" />
                  <span>
                    <span className="text-sm font-bold">{`$${travel?.hourlyPrice}`}</span>
                    <span className="text-sm font-normal ml-1">/hr</span> {/* Adds some margin-left between price and /hr */}
                    <span className="text-sm font-bold ml-1">{`$${travel?.dailyPrice}`}</span>
                    <span className="text-sm font-normal ml-1">/day</span> {/* Adds some margin-left between price and /day */}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className="mt-auto">
            <Link
              className="w-full bg-[#5C8D07] text-white no-underline py-3 border-0 rounded-bl-md rounded-br-md flex items-center justify-center cursor-pointer"
              href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details/${travel?.reservationId}`}
              passHref
            >
              <button
                className="w-full bg-[#5C8D07] text-white border-none outline-none flex items-center justify-center cursor-pointer"
                // onClick={() => showDetails(travel?.reservationId)}
              >
                <TbListDetails className="mr-2" />
                View Details
              </button>
            </Link>
          </div>
        </div>
      ) : (
        // Large Device Layout
        <>
          {/* Image Section */}
          <div className="w-1/5 flex items-center justify-center max-h-full ml-4 relative">
            <div className="relative w-32 h-32">
              <Image src={`${travel?.coverPhoto}`} alt="CarImage" className="object-cover rounded-full" fill={true} />
            </div>
          </div>

          {/* Travel Information Section (73%) */}
          <div className="flex-grow md:p-4 py-2 px-1 w-3/4">
            {/* Reservation ID and Status */}
            <div className="flex w-full justify-between items-center">
              <div className="flex w-full justify-between items-center">
                <span className="text-primary md:text-sm font-semibold text-xs">{travel?.carNickName}</span>
                {/* <span className="text-primary md:text-sm text-xs">{travel?.reservationId}</span> */}
              </div>
              {/* <div>
                {travel?.reservationStatus === 'cancelledByGuest' ||
                travel?.reservationStatus === 'cancelledByHost' ||
                travel?.reservationStatus === 'cancelled' ? (
                  <Chip label="Cancelled" className="bg-red-100 text-xs text-error" />
                ) : travel?.isPaymentExpired ? (
                  <Chip label="Payment duration expired" className="bg-red-100 text-xs text-error" />
                ) : (
                  ''
                )}
              </div> */}
            </div>

            {/* Vehicle Model */}
            <div className="grid grid-cols-[auto,1fr] font-bold md:text-xl text-sm lg:mb-1">
              <span className="md:whitespace-nowrap text-start">{travel?.vehicleModel}</span>
            </div>

            {/* Location with Icon */}
            <div className="flex items-center md:text-sm text-xs text-start">
              <LocationOnIcon className="mr-1 text-primary" />
              <span>{travel?.pickupLocation}</span>
            </div>

            {/* Pickup and Return Time, Distance */}
            <div className="flex lg:gap-4 text-sm my-2">
              <ShowPickupReturnTime startDate={travel?.pickupDate} endDate={travel?.returnDate}></ShowPickupReturnTime>
              <div className="flex font-bold text-start lg:gap-4">
                <Divider orientation="vertical" className="w-px bg-gray-300 mx-2"></Divider>
                <div className="grid grid-cols-1 font-bold">
                  {travel?.maximumDailyDistance ? (
                    <span>
                      KM Included:<span className="font-bold"> {`${travel?.maximumDailyDistance} KM`}</span>
                    </span>
                  ) : (
                    <span className="font-bold">Unlimited Distance</span>
                  )}
                  <span>
                    <span className="font-bold"> {`$${travel?.hourlyPrice}`}</span>/hr
                    <span className="font-bold"> {`$${travel?.dailyPrice}`}</span>/day
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/4 flex flex-col  p-4 rounded-lg ">
            <div className="flex flex-col justify-around items-end mb-2">
              {travel?.reservationStatus === 'cancelledByGuest' ||
              travel?.reservationStatus === 'cancelledByHost' ||
              travel?.reservationStatus === 'cancelled' ? (
                <Chip label="Cancelled" className="bg-red-100 text-xs text-error " />
              ) : (
                ''
              )}
              {/* travel?.isPaymentExpired ? (
                <Chip label="Payment duration expired" className="bg-red-100 text-xs text-error" />
              ) : (
                ''
              )} */}
            </div>
            {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && pathName?.includes('travels') ? (
              <Link
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details-new/${travel?.reservationId}`}
                className="text-black md:text-sm text-xs text-end no-underline"
              >
                <span className="text-black md:text-sm text-xs text-end">ID:{travel?.reservationId}</span>
              </Link>
            ) : process.env.NEXT_PUBLIC_NODE_ENV === 'development' && pathName?.includes('reservations') ? (
              <Link
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details-new/${travel?.reservationId}`}
                className="text-black md:text-sm text-xs text-end no-underline"
              >
                <span className="text-black md:text-sm text-xs text-end">ID:{travel?.reservationId}</span>
              </Link>
            ) : (
              <span className="text-black md:text-sm text-xs text-end">ID:{travel?.reservationId}</span>
            )}

            <span className={`text-right text-xl font-bold ${reservationPendingStatus.includes(travel?.paymentStatus) ? 'text-error' : ''}`}>
              ${isUserGuest ? travel?.totalPrice?.toFixed(2) : travel?.hostRentalFees}
            </span>
            <div className="flex flex-col justify-around items-end ">
              {/* <button className="flex items-center justify-center bg-[#800080] text-white rounded-lg py-2 px-4 mt-2 w-full">
                <FaLock className="mr-2" />
                Open LockBox
              </button> */}
              <Link
                className="flex items-center justify-center bg-[#5C8D07] text-white border-[.7px] no-underline rounded-md py-2 px-4 mt-2 w-full cursor-pointer  hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/${updatedPathname}/details/${travel?.reservationId}`}
                passHref
              >
                <button
                  // onClick={() => showDetails(travel?.reservationId)}
                  className="flex items-center justify-center bg-[#5C8D07] text-white border-none cursor-pointer "
                >
                  <TbListDetails className="mr-2" />
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleTravelData;
