'use client';

import { useTravelContext } from '@/context/TravelProvider';
import { usePathname } from 'next/navigation';
import ReservationBasicsM from '../../Reservations/ReservationDetails/ReservationBasicsM';
import ReservationBilling from '../../Reservations/ReservationDetails/ReservationBilling';
import TravelBilling from '../TravelDetails/TravelBilling';
import ReservationCondition from '../TravelDetails/TravelCondition';
import TravelLocation from '../TravelDetails/TravelLocation/TravelLocation';
import TravelReview from '../TravelDetails/TravelReview/TravelReview';
import TravelBasicM from './TravelBasicM';

const TravelDetailsM = () => {
  const { updatedTravelData } = useTravelContext();
  const pathName = usePathname();

  return (
    <div>
      {pathName?.includes('reservations') ? <ReservationBasicsM></ReservationBasicsM> : <TravelBasicM></TravelBasicM>}

      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4 p-4  mt-5">
        {updatedTravelData?.isUserGuest ? <TravelBilling isTravelUpdatedPage={true} /> : <ReservationBilling />}
      </div>

      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4 mt-5 p-5">
        <ReservationCondition isTravelUpdatedPage={true} />
      </div>

      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4 mt-5 p-5">
        <TravelLocation isTravelUpdatedPage={true} />
      </div>

      <>
        <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4 mt-5 p-5">
          <TravelReview />
        </div>
      </>
    </div>
  );
};

export default TravelDetailsM;
