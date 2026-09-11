import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { isDevelopment } from '@/utils/Functions/randomCommonFn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Chip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { RiPinDistanceFill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';
import { statusCancelled } from './SingleTravelDataM';

const TravelDataMobile = ({
  travel,
  baseNewUrl,
  baseUrl,
  isUserGuest,
}: {
  travel: TSingleTravel;
  baseNewUrl: string;
  baseUrl: string;
  isUserGuest: boolean;
}) => {
  return (
    <div className="mx-auto  shadow-lg rounded-lg w-full bg-soft">
      <div className="px-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col items-center">
            {isDevelopment ? (
              <Link href={baseNewUrl} className="text-black md:text-sm text-xs text-end no-underline">
                <div className="bg-blush text-primary font-bold rounded-2xl h-8  px-2 flex items-center justify-center text-xs">
                  {travel?.reservationId}
                </div>
              </Link>
            ) : (
              <div className="bg-blush text-primary font-bold rounded-2xl h-8  px-2 flex items-center justify-center text-xs">
                {travel?.reservationId}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center relative">
            <Image src={`${travel?.coverPhoto}`} alt="CarImage" width={125} height={125} className="rounded-full h-32 w-32 object-cover" />
          </div>
          <div className="flex flex-col items-end">
            {/* Use items-end to align items to the right */}
            <span className={`text-lg font-bold ${travel?.paymentStatus === 'pending' ? 'text-error' : ''}`}>
              ${isUserGuest ? travel?.totalPrice?.toFixed(2) : travel?.hostRentalFees}
            </span>
            <div className="text-success font-bold rounded-2xl h-8 w-16 flex items-center justify-center mt-1">
              {/* Added mt-1 for spacing */}
              <div>
                {statusCancelled?.includes(travel?.reservationStatus) ? (
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
      </div>
      <div className="flex flex-col text-sm my-2  mx-4">
        <ShowPickupReturnTime startDate={travel?.pickupDate} endDate={travel?.returnDate} />

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
          //   className="w-full bg-success text-white no-underline py-3 border-0 rounded-bl-md rounded-br-md flex items-center justify-center cursor-pointer"
          href={baseUrl}
          passHref
        >
          <Button size="small" variant="contained" startIcon={<TbListDetails />} className="normal-case w-full bg-complementary">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TravelDataMobile;
