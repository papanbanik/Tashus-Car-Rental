'use client';

import { CustomTabPanel } from '@/components/Common/CommonTab/CommonTabDraft';
import ReservationListSkeletonUpdated from '@/components/Common/Skeletons/ReservationListSkeletonUpdated';
import { useTravelList } from '@/hooks/travel/useTravelList';
import { TabListType, TabMultipleComponents, userReservationsTabList } from '@/utils/Lists/userProfileListInfo';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Travels = () => {
  const { travelsType } = useParams<{ travelsType: string }>();
  const router = useRouter();
  const { isLoading } = useTravelList();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mobileAppFlag = searchParams.get('mobileAppFlag') as any;
    if (mobileAppFlag === true || mobileAppFlag == true || mobileAppFlag === 'true' || mobileAppFlag == 'true') {
      console.log(mobileAppFlag);
      window.opener = null;
      window.open('', '_self');
      window.close();
    }
  }, [searchParams]);

  useEffect(() => {
    const validRouteNames = userReservationsTabList?.map((tab) => tab?.routeName);
    if (!validRouteNames.includes(travelsType)) {
      router.push('/not_found');
    }
  }, [travelsType]);

  return (
    <div className="min-h-[45vh] p-4">
      {userReservationsTabList?.map(
        (tab: TabListType) =>
          tab?.routeName === travelsType && (
            <CustomTabPanel key={tab?.id} value={parseInt(tab?.id) - 1} index={parseInt(tab?.id) - 1}>
              {isLoading ? <ReservationListSkeletonUpdated /> : <>{(tab?.component as TabMultipleComponents)?.travelCompo}</>}
            </CustomTabPanel>
          )
      )}
    </div>
  );
};

export default Travels;
