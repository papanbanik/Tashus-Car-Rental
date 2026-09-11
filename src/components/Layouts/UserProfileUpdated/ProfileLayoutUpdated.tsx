'use client';
import ProfileUpdatedTab from '@/components/Common/CommonTab/ProfileUpdatedTab';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { userProfileGuestNewTabList, userProfileNewTabList } from '@/utils/Lists/userProfileListInfo';
import { useMediaQuery } from '@mui/material';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';

const ProfileLayoutUpdated = ({ children }: { children: ReactNode }) => {
  const isIPadPro = useIPadProQuery();
  const isSmall = useMediaQuery('(max-width: 1024px)');
  const { userCred, userProfileInfo } = useUserCredContext();
  const baseUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}`;
  const { vehicleId, travelId, reservationId } = useParams<{ vehicleId: string; travelId: string; reservationId: string }>();

  return (
    <div>
      {/* {(isSmall || isIPadPro) && !(vehicleId || reservationId || travelId) ? (
        <>
          <CommonDrawer drawerAnchor="left">
            <ProfileUpdatedTab
              tabList={userProfileInfo?.isAllowListing ? userProfileNewTabList : userProfileGuestNewTabList}
              baseUrl={baseUrl}
              isSmall={isSmall || isIPadPro}
              orientation="vertical"
            />
          </CommonDrawer>
          <div className="bg-white p-2">{children}</div>
        </>
      ) : ( */}
      <ProfileUpdatedTab
        tabList={userProfileInfo?.isAllowListing ? userProfileNewTabList : userProfileGuestNewTabList}
        baseUrl={baseUrl}
        isSmall={isSmall || isIPadPro}
        orientation="vertical"
      >
        {children}
      </ProfileUpdatedTab>
      {/* )} */}
    </div>
  );
};

export default ProfileLayoutUpdated;
