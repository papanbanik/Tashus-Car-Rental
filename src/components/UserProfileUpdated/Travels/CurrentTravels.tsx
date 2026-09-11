'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { getCurrentTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelDataM from './TravelList/TravelDataM';

const CurrentTravels = () => {
  // const params = useParams();
  // const travelsType = params['travels-type'];
  const { travelsType } = useParams<{ travelsType: string }>();

  const [currentTravelList, setCurrentTravelList] = useState<TSingleTravel[]>([]);
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
      const tempCurrentList = await getCurrentTravels(travelList, true);
      const updatedTravelList: TSingleTravel[] = await getUpdatedTravelList(tempCurrentList, true);
      setCurrentTravelList(updatedTravelList);
      setTempTravelList(updatedTravelList); //Filtering purpose
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TravelDataM travelType={travelsType} dataList={currentTravelList} isLoading={isLoading || isTravelListLoading} />
    </div>
  );
};

export default CurrentTravels;
