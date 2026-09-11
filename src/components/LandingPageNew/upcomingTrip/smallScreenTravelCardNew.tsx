import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { Chip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { RiPinDistanceFill } from 'react-icons/ri';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import CountdownTimer from './countDownTimer';

export interface ISingleTravelData {
  travel: TSingleTravel;
  showDetails: (reservationId: number) => void;
}

interface SingleTravelDataProps {
  travel: TSingleTravel;
  showDetails: (reservationId: number) => void;
}

const SmallScreenTravelCard: React.FC<SingleTravelDataProps> = ({ showDetails, travel }) => {
  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const { userCred } = useUserCredContext();
  const isUserGuest = userCred?.userId === travel?.guestId;

  const displayPrice = isUserGuest ? travel?.totalPrice?.toFixed(2) : travel?.hostRentalFees;

  const showStatus = () => {
    if (
      travel?.reservationStatus === 'cancelledByGuest' ||
      travel?.reservationStatus === 'cancelledByHost' ||
      travel?.reservationStatus === 'cancelled'
    ) {
      return <Chip label="Cancelled" className="bg-red-100 text-xs text-error" />;
    }
    if (travel?.isPaymentExpired) {
      return <Chip label="Expired" className="bg-red-100 text-xs text-error" />;
    }
    return null;
  };

  return (
    <div
      key={travel?.reservationId}
      className="flex w-full bg-[#FAF6F6] shadow-md shadow-secondary rounded-lg commonMarginBottom max-w-[440px] min-w-[350px] cursor-pointer"
      onClick={() => showDetails(travel?.reservationId)}
    >
      <div className="mx-auto shadow-lg rounded-lg w-full bg-[#FAF6F6]">
        <div className="px-4 pt-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-[#F6E7F6] text-[#800080] font-bold rounded-2xl h-8 px-2 flex items-center justify-center text-xs">
                {travel?.reservationId}
              </div>
            </div>
            <div className="flex flex-col items-center relative">
              <Image src={`${travel?.coverPhoto}`} alt="CarImage" width={125} height={125} className="rounded-full h-32 w-32 object-cover" />
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-lg font-bold ${travel?.paymentStatus === 'pending' ? 'text-error' : ''}`}>${displayPrice}</span>
              <div className="text-[#5C8D07] font-bold rounded-2xl h-8 w-16 flex items-center justify-center mt-1">{showStatus()}</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-1">
            <span className="text-center text-lg font-bold">{travel?.vehicleModel}</span>
            <span className="text-primary md:text-sm font-semibold text-xs text-center mb-2">{travel?.carNickName}</span>
          </div>

          <div className="flex flex-col">
            <div className="h-px w-full bg-gray-300 mb-1.5"></div>
            <CountdownTimer targetTime={new Date(travel?.pickupDate)} />
          </div>

          <div className="flex flex-col">
            <div className="h-px w-full bg-gray-300 mb-1.5"></div>
            <div className="flex items-center text-sm text-start ml-0 pl-0">
              <LocationOnIcon className="mr-1 text-primary text-[18px]" />
              <span>{travel?.pickupLocation}</span>
            </div>
            <div className="h-px w-full bg-gray-300 mt-1.5"></div>
          </div>
        </div>

        <div className="flex flex-col text-sm my-2 mx-4 mb-3">
          <ShowPickupReturnTime startDate={travel?.pickupDate} endDate={travel?.returnDate} />
          <div className="h-px w-full bg-gray-300 mb-1.5 mt-1.5"></div>
          <div className="flex font-bold text-start">
            <div className="flex flex-row font-bold justify-between items-center w-full">
              <div className="flex items-center">
                <RiPinDistanceFill className="mr-2 text-primary text-sm" />
                {travel?.maximumDailyDistance ? (
                  <span>
                    KM Included: <span className="font-normal text-sm">{`${travel?.maximumDailyDistance} KM`}</span>
                  </span>
                ) : (
                  <span className=" text-sm font-normal">Unlimited Distance</span>
                )}
              </div>

              <div className="flex items-center">
                <FaMoneyCheckAlt className="mr-2 text-primary text-sm" />
                <span>
                  <span className="text-sm font-bold">{`$${travel?.hourlyPrice}`}</span>
                  <span className="text-sm font-normal ml-1">/hr</span>
                  <span className="text-sm font-bold ml-1">{`$${travel?.dailyPrice}`}</span>
                  <span className="text-sm font-normal ml-1">/day</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallScreenTravelCard;
