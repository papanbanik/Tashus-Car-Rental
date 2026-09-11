import { useUserCredContext } from '@/context/UserCredProvider';
import { Divider } from '@mui/material';
import ProfileContactVerify from './ProfileContactVerify';
import ProfileEmailVerify from './ProfileEmailVerify';

const ProfileInfoVerify = () => {
  const { userProfileInfo } = useUserCredContext();
  return (
    <div>
      {/* User Name */}
      {userProfileInfo?.firstName && userProfileInfo?.lastName && (
        <span className="text-lg font-bold">
          {`${userProfileInfo?.firstName}`} {`${userProfileInfo?.lastName}`}
        </span>
      )}
      <Divider className="my-2" />
      {/* Email */}
      <ProfileEmailVerify />
      <Divider className="my-2" />
      {/* Phone Number*/}
      <ProfileContactVerify />
      {/* <ContactVerify /> */}
    </div>
  );
};

export default ProfileInfoVerify;
