'use client';
import CommonRating from '@/components/Common/CommonRating';
import CommonTooltip from '@/components/Common/CommonTooltip';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getUserFullName, shortenText } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { TiStar } from 'react-icons/ti';
import SectionBorder from '../../SectionBorder';

const ProfileInfo = () => {
  const { userProfileInfo, userCred } = useUserCredContext();
  const platformAgeMonth = dayjs().diff(dayjs(userProfileInfo?.createdAt), 'month');
  const platformAgeDay = dayjs().diff(dayjs(userProfileInfo?.createdAt), 'day') % 24;
  const totalMonths = platformAgeMonth + (platformAgeDay > 0 ? 1 : 0);
  const isSmallDevice = useMediaQuery('(max-width:912px)');
  return (
    <SectionBorder>
      <div className="grid grid-cols-1">
        {/* User Name */}
        {userProfileInfo?.firstName && userProfileInfo?.lastName && (
          <div className="grid grid-cols-2 text-sm gap-2">
            <span>Full Name</span>
            <span>{getUserFullName(userProfileInfo?.firstName, userProfileInfo?.middleName, userProfileInfo?.lastName)}</span>
          </div>
        )}
        {/* Gender */}
        {userProfileInfo?.gender && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>Gender</span>
            <span className=" capitalize">{`${userProfileInfo?.gender}`}</span>
          </div>
        )}
        {/* Joining Date */}
        {userProfileInfo?.createdAt && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>Member Since</span>
            <span>
              {' '}
              {`${new Date(userProfileInfo?.createdAt).toLocaleString('en-US', {
                month: 'short',
                year: 'numeric',
              })}`}
            </span>
          </div>
        )}
        {/* Platform Age */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Platform Age</span>
          {platformAgeMonth > 0 ? <span>{totalMonths} months</span> : <span>Recently Joined</span>}
        </div>
        {/* Completed Travels */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Completed Travels</span>
          <span>{userProfileInfo?.guestTotalTrips}</span>
        </div>
        {userProfileInfo?.isAllowListing && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            {/* Completed Reservation */}
            <span>Completed Reservations</span>
            <span>{userProfileInfo?.hostTotalTrips}</span>
          </div>
        )}
        {/* Rating as Guest */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'Profile Rating (Guest)'}</span>
          <span>
            <CommonRating
              initialRating={parseFloat((userProfileInfo?.guestRatingTotal / userProfileInfo?.guestRatingCount)?.toFixed(2)) || 0}
              emptyIcon={<TiStar />}
              readOnly
              size="small"
              showRatingNumber={true}
              noMaxRating={true}
              typographyProps={{ className: 'text-sm md:text-md' }}
              precision={0.01}
            />
          </span>
        </div>
        {userProfileInfo?.isAllowListing && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>{'Profile Rating (Partner)'}</span>
            <span>
              <CommonRating
                initialRating={parseFloat((userProfileInfo?.hostRatingTotal / userProfileInfo?.hostRatingCount)?.toFixed(2)) || 0}
                emptyIcon={<TiStar />}
                readOnly
                size="small"
                showRatingNumber={true}
                noMaxRating={true}
                typographyProps={{ className: 'text-sm md:text-md' }}
                precision={0.01}
              />
            </span>
          </div>
        )}
        {userCred?.email && (
          <CommonTooltip title={userCred?.email} arrow={true}>
            <div className="grid grid-cols-2 text-sm gap-2 my-1">
              {/* Email */}
              <span>Email</span>
              <span>{shortenText(userCred?.email, isSmallDevice ? 12 : 30)}</span>
            </div>
          </CommonTooltip>
        )}
      </div>
    </SectionBorder>
  );
};

export default ProfileInfo;
