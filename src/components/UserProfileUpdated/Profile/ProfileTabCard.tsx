import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Avatar } from '@mui/material';
import { FaCar } from 'react-icons/fa';
import { SiTripdotcom } from 'react-icons/si';
// import Journey from '../../../../public/icons/UserProfile/JourneyDark.svg';
// import Vehicles from '../../../../public/icons/UserProfile/TeslaDark.svg';
const ProfileTabCard = () => {
  const { profileGeneralInfo } = useProfileInfoContext();
  const { userProfileInfo } = useUserCredContext();
  return (
    <div className="flex flex-row gap-2 p-4">
      <div className="flex justify-center items-center">
        <Avatar
          src={profileGeneralInfo?.picture?.imageInfo?.secure_url}
          alt="Profile Photo"
          sx={{
            border: '1px solid #800080',
          }}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-md">
          {profileGeneralInfo?.firstName} {profileGeneralInfo?.lastName}
        </span>
        <div className="flex gap-2">
          <span>
            <CommonTextIcon
              text={`${userProfileInfo?.guestTotalTrips + userProfileInfo?.hostTotalTrips} Travels |`}
              className="text-xs"
              startIcon={<SiTripdotcom />}
            />
          </span>
          <span>
            <CommonTextIcon
              text={
                !!userProfileInfo?.totalCars && userProfileInfo?.totalCars > 0
                  ? `${userProfileInfo?.totalCars} ${userProfileInfo?.totalCars > 1 ? 'Vehicles' : 'Vehicle'}`
                  : 'No Vehicles'
              }
              className="text-xs"
              startIcon={<FaCar />}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabCard;
