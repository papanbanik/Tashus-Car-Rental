'use client';

import { CustomTabPanel } from '@/components/Common/CommonTab/CommonTabDraft';
import ReservationListSkeletonUpdated from '@/components/Common/Skeletons/ReservationListSkeletonUpdated';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { TabListType, TabMultipleComponents, userReservationsTabList } from '@/utils/Lists/userProfileListInfo';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Reservations = () => {
  const router = useRouter();
  const { reservationsType } = useParams<{ reservationsType: string }>();
  // console.log(reservationsType);

  const { data, isLoading } = useReservationList();

  useEffect(() => {
    const validRouteNames = userReservationsTabList?.map((tab) => tab?.routeName);

    if (!validRouteNames.includes(reservationsType)) {
      // If the routeName is not valid, redirect to the "not found" page
      router.push('/not_found');
    }
  }, [reservationsType]);

  return (
    <div className="min-h-[45vh] p-4">
      {userReservationsTabList?.map(
        (tab: TabListType) =>
          tab?.routeName === reservationsType && (
            <CustomTabPanel key={tab?.id} value={parseInt(tab?.id) - 1} index={parseInt(tab?.id) - 1}>
              {isLoading ? <ReservationListSkeletonUpdated /> : <>{(tab?.component as TabMultipleComponents)?.reservationCompo}</>}
            </CustomTabPanel>
          )
      )}
    </div>
  );
};

export default Reservations;
