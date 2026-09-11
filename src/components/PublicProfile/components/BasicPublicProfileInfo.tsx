import ProfileAvatar from '@/components/Common/ProfileAvatar';
import { useModalContext } from '@/context/ModalProvider';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { IoCalendarOutline, IoShareSocial } from 'react-icons/io5';
import { boxBorder } from '../PublicProfile';
import ShareModal from '../ShareModal';
import { TBasicPublicProfileInfo } from '../types/publicProfileTypes';

const BasicPublicProfileInfo = ({ basicProfileInfo }: { basicProfileInfo: TBasicPublicProfileInfo }) => {
  const {
    firstName = '',
    lastName = '',
    pictureUrl: profileImage,
    guestTrips: totalTrips = 0,
    hostReservation: totalReservations = 0,
    isEmailVerified = false,
    isPhoneVerified = false,
    joinedAt,
  } = basicProfileInfo ?? {};
  const { openModal } = useModalContext();
  const handleShareButtonClick = () => {
    openModal({
      content: <ShareModal />,
      title: 'Share',
    });
  };
  return (
    <div className="container mx-auto px-4">
      <div
        className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 relative -mt-16 bg-white p-6 rounded-lg shadow-md shadow-secondary"
        style={boxBorder}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg" style={boxBorder}>
          <ProfileAvatar
            firstName={firstName}
            lastName={lastName}
            profilePictureUrl={profileImage}
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: !profileImage ? '#800080' : 'transparent',
              fontSize: 30,
            }}
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold mb-2">{`${firstName} ${lastName}`}</h1>
            <Button
              variant="outlined"
              startIcon={<IoShareSocial />}
              className="rounded-full normal-case font-bold hover:bg-purple-200 transition-colors duration-200 shadow-sm shadow-secondary my-2 md:my-0"
              onClick={handleShareButtonClick}
            >
              Share Profile
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {totalTrips > 0 ? `${totalTrips} ${getSingularPluralNoun('Trip', totalTrips)}` : 'No Trips'}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {totalReservations > 0 ? `${totalReservations} ${getSingularPluralNoun('Reservation', totalReservations)}` : 'No Reservations'}
            </span>
            {isEmailVerified && <span className="bg-green-100 text-success px-3 py-1 rounded-full text-sm">Email Verified</span>}
            {isPhoneVerified && <span className="bg-green-100 text-success px-3 py-1 rounded-full text-sm">Phone Verified</span>}
          </div>

          {!!joinedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <IoCalendarOutline className="inline-block text-primary" />
                <span className="font-medium">Member Since</span>
              </span>
              <span className="bg-purple-100 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                {`${new Date(dayjs(joinedAt).toDate()).toLocaleString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicPublicProfileInfo;
