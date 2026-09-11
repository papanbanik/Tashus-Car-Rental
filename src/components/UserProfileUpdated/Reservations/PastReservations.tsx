'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { getPastTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelDataM from '../Travels/TravelList/TravelDataM';

const PastReservations = () => {
  // const params = useParams();
  // const reservationsType = params['reservations-type'];
  const { reservationsType } = useParams<{ reservationsType: string }>();
  const [pastReservationList, setPastReservationList] = useState<TSingleTravel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { reservationList, isReservationListLoading } = useTravelContext();
  const { tempReservationList, setTempReservationList } = useProfileInfoContext(); //Added this filtering purpose

  //Added this filtering purpose
  useEffect(() => {
    setTempReservationList([]);
  }, []);

  useEffect(() => {
    if (reservationList?.length > 0) {
      handleUpdate();
    } else {
      setIsLoading(false);
    }
  }, [reservationList]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const tempPastList = await getPastTravels(reservationList);
      const updatedTravelList: TSingleTravel[] = await getUpdatedTravelList(tempPastList, false);
      const sortedTravelList = updatedTravelList.sort((a, b) => {
        const dateA = new Date(a.pickupDate).getTime();
        const dateB = new Date(b.returnDate).getTime();
        return dateB - dateA;
      });
      setPastReservationList(sortedTravelList);
      setTempReservationList(updatedTravelList); //filtering purpose
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TravelDataM travelType={reservationsType} dataList={pastReservationList} isLoading={isLoading || isReservationListLoading} />
    </div>
  );
};

export default PastReservations;
