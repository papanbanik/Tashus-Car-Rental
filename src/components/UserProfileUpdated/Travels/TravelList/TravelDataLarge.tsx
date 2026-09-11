import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { isDevelopment } from '@/utils/Functions/randomCommonFn';
import { reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Chip, Divider } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { TbListDetails } from 'react-icons/tb';
import { statusCancelled } from './SingleTravelDataM';

const TravelDataLarge = ({
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
          </div>
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
          {statusCancelled?.includes(travel?.reservationStatus) ? (
            <Chip label="Cancelled" className="bg-red-100 text-xs text-error " />
          ) : travel?.isPaymentExpired ? (
            <Chip label="Expired" className="bg-red-100 text-xs text-error" />
          ) : (
            ''
          )}
        </div>
        {isDevelopment ? (
          <Link href={baseNewUrl} className="text-black md:text-sm text-xs text-end no-underline">
            <span className="text-black md:text-sm text-xs text-end">ID:{travel?.reservationId}</span>
          </Link>
        ) : (
          <span className="text-black md:text-sm text-xs text-end">ID:{travel?.reservationId}</span>
        )}

        <span className={`text-right text-xl font-bold ${reservationPendingStatus.includes(travel?.paymentStatus) ? 'text-error' : ''}`}>
          ${isUserGuest ? travel?.totalPrice?.toFixed(2) : travel?.hostRentalFees}
        </span>
        <div className="flex flex-col justify-around items-end mt-4">
          <Link href={baseUrl} passHref>
            <Button size="small" variant="contained" startIcon={<TbListDetails />} className="normal-case px-4 bg-complementary">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TravelDataLarge;
