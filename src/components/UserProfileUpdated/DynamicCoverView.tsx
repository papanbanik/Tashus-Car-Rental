'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useDraftCarList } from '@/hooks/profile/useDraftCarList';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { getVerificationFlags, getVerificationState } from '@/utils/Functions/verification/verificationFn';
import { Typography } from '@mui/material';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';

import Journey from '../../../public/icons/UserProfile/Journey.svg';
import Vehicles from '../../../public/icons/UserProfile/Tesla Model S.svg';
import ReservationCover from '../../../public/ReservationCoverView/Tashus-ReservationTravel.png';
import CommonTextIcon from '../Common/CommonTextIcon';
import { MdVerified } from 'react-icons/md';

interface DynamicCoverViewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  isProfile?: boolean;
  subtitle?: string;
}

const DynamicCoverView = ({ title, isProfile, subtitle, className, ...rest }: DynamicCoverViewProps) => {
  const { userProfileInfo } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { data: draftList } = useDraftCarList();
  const totalListedCars = userProfileInfo?.totalCars - (draftList?.data?.data?.draftList?.length ?? 0);
  const totalCars = totalListedCars > 0 ? totalListedCars : 0;

  const guestVerificationFlags = getVerificationFlags(userProfileVerificationInfo);
  const { verificationApproved } = getVerificationState(
    guestVerificationFlags,
    userProfileVerificationInfo?.guestVerification?.finalVerificationStatus
  );

  return (
    <div className={`h-[122px] relative rounded-t-2xl overflow-hidden group ${className}`} {...rest}>
      {/* Background Image */}
      <Image
        src={ReservationCover}
        alt="Cover View"
        objectFit="cover"
        fill
        placeholder="blur"
        className="transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 transition-opacity duration-500 group-hover:from-black/60 group-hover:to-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        {/* Title */}
        <Typography className="font-bold text-white md:text-[36px] text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 drop-shadow-md">
          {title}
        </Typography>

        {/* Subtitle */}
        {!!subtitle && (
          <span className="text-sm text-gray-200 text-center font-medium drop-shadow-sm transition-opacity duration-300 group-hover:text-white">
            {subtitle}
          </span>
        )}

        {/* Profile Stats */}
        {isProfile && (
          <div className="flex items-center justify-center text-white mt-2">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                <Journey className="text-2xl text-primary drop-shadow-sm" />
                <span className="text-sm font-medium drop-shadow-sm">
                  {userProfileInfo?.guestTotalTrips + userProfileInfo?.hostTotalTrips} Travels
                </span>
              </div>
              <div className="h-6 border-l border-white/40"></div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                {userProfileInfo?.isAllowListing ? (
                  <>
                    <Vehicles className="text-2xl text-primary drop-shadow-sm" />
                    {!!totalCars && totalCars > 0 ? (
                      <span className="text-sm font-medium drop-shadow-sm">
                        {totalCars} {getSingularPluralNoun('Vehicle', totalCars)}
                      </span>
                    ) : (
                      <span className="text-sm font-medium drop-shadow-sm">No Vehicles</span>
                    )}
                  </>
                ) : (
                  <>
                    {verificationApproved ? (
                      <CommonTextIcon
                        text="Approved to Drive"
                        textClassName="text-sm font-medium drop-shadow-sm"
                        startIcon={<MdVerified className="text-white text-lg" />}
                      />
                    ) : (
                      <CommonTextIcon
                        text="Not Approved to Drive"
                        textClassName="text-sm font-medium drop-shadow-sm"
                        startIcon={<RxCross2 className="text-red-400" />}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCoverView;
