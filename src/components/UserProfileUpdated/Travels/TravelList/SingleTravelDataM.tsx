import { useUserCredContext } from '@/context/UserCredProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { useMediaQuery } from '@mui/material';
import TravelDataLarge from './TravelDataLarge';
import TravelDataMobile from './TravelDataMobile';

export const statusCancelled = ['cancelledByGuest', 'cancelledByHost', 'cancelled'];

const SingleTravelDataM = ({ travel }: { travel: TSingleTravel }) => {
  const isSmallScreen = useMediaQuery('(max-width:850px)'); // Check for small screen
  const { userCred } = useUserCredContext();
  const isUserGuest = userCred?.userId === travel?.guestId ? true : false;
  const baseUrl = `/dashboard/${userCred?.userId}/${isUserGuest ? 'travels' : 'reservations'}/details/${travel?.reservationId}`;
  const baseNewUrl = `/dashboard/${userCred?.userId}/${isUserGuest ? 'travels' : 'reservations'}/details-new/${travel?.reservationId}`;
  const commonProps = {
    travel,
    baseUrl,
    baseNewUrl,
    isUserGuest,
  };
  return (
    <div className="flex w-full bg-soft shadow-md shadow-secondary rounded-lg ">
      {isSmallScreen ? <TravelDataMobile {...commonProps} /> : <TravelDataLarge {...commonProps} />}
    </div>
  );
};

export default SingleTravelDataM;
