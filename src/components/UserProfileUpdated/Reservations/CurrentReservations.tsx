'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { getCurrentTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelDataM from '../Travels/TravelList/TravelDataM';

const CurrentReservations = () => {
  // const params = useParams();
  // const reservationsType = params['reservations-type'];
  const { reservationsType } = useParams<{ reservationsType: string }>();

  const [currentReservationList, setCurrentReservationList] = useState<TSingleTravel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { reservationList, isReservationListLoading } = useTravelContext();
  const { tempReservationList, setTempReservationList } = useProfileInfoContext(); //Modified this for filtering purpose

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
      const tempCurrentList = await getCurrentTravels(reservationList);
      const updatedReservationList: TSingleTravel[] = await getUpdatedTravelList(tempCurrentList, false);
      const updatedReservationFilteredList = updatedReservationList.filter((reservation) => reservation?.reservationStatus !== 'pending');
      setCurrentReservationList(updatedReservationFilteredList);
      setTempReservationList(updatedReservationFilteredList); //Filtering Purpose
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TravelDataM travelType={reservationsType} dataList={currentReservationList} isLoading={isLoading || isReservationListLoading} />
    </div>
  );
};

export default CurrentReservations;
