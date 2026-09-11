'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { getUpcomingTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelDataM from '../Travels/TravelList/TravelDataM';

const UpcomingReservations = () => {
  // const params = useParams();
  // const reservationsType = params['reservations-type'];
  const { reservationsType } = useParams<{ reservationsType: string }>();
  const [upcomingReservationList, setUpcomingReservationList] = useState<TSingleTravel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { reservationList, isReservationListLoading } = useTravelContext();
  const { tempReservationList, setTempReservationList } = useProfileInfoContext(); //Added this filtering purpose

  //Add this filtering purpose
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
      const tempUpcomingList = await getUpcomingTravels(reservationList);
      const updatedTravelList: TSingleTravel[] = await getUpdatedTravelList(tempUpcomingList, false);
      const updatedReservationFilteredList = updatedTravelList.filter((reservation) => reservation?.reservationStatus !== 'pending');
      setUpcomingReservationList(updatedReservationFilteredList);
      setTempReservationList(updatedReservationFilteredList); //Filtering Purpose
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TravelDataM travelType={reservationsType} dataList={upcomingReservationList} isLoading={isLoading || isReservationListLoading} />
    </div>
  );
};

export default UpcomingReservations;
