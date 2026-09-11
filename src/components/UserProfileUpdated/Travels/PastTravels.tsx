'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { getPastTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelDataM from './TravelList/TravelDataM';

const PastTravels = () => {
  // const params = useParams();
  // const travelsType = params['travels-type'];
  const { travelsType } = useParams<{ travelsType: string }>();
  const [pastTravelList, setPastTravelList] = useState<TSingleTravel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { travelList, setTempTravelList } = useProfileInfoContext(); //Modify it filtering purpose
  const { isTravelListLoading } = useTravelContext();

  //Add this filtering purpose
  useEffect(() => {
    setTempTravelList([]);
  }, []);

  useEffect(() => {
    if (travelList?.length > 0) {
      handleUpdate();
    } else {
      setIsLoading(false);
    }
  }, [travelList]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const tempPastList = await getPastTravels(travelList);
      const updatedTravelList: TSingleTravel[] = await getUpdatedTravelList(tempPastList, true);
      const sortedTravelList = updatedTravelList.sort((a, b) => {
        const dateA = new Date(a.pickupDate).getTime();
        const dateB = new Date(b.returnDate).getTime();
        return dateB - dateA;
      });
      setPastTravelList(sortedTravelList);
      setTempTravelList(updatedTravelList);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TravelDataM travelType={travelsType} dataList={pastTravelList} isLoading={isLoading || isTravelListLoading} />
    </div>
  );
};

export default PastTravels;
