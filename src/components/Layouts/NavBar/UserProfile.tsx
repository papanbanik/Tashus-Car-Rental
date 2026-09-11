'use client';

import ProfileAvatar from '@/components/Common/ProfileAvatar';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useProfileInfo } from '@/hooks/profile/useProfileInfo';
import { getUserFullName } from '@/utils/Functions/randomCommonFn';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
// import { useEffect } from 'react';

const UserProfile = () => {
  useProfileInfo();
  const { userCred, userProfileInfo, setProfileHookEnableKeys, profileHookEnableKeys } = useUserCredContext();
  const { profileGeneralInfo } = useProfileInfoContext();
  // console.log(profileGeneralInfo);
  // console.log(userCred);
  // console.log(userProfileInfo);
  useEffect(() => {
    if (userCred?.loggedIn && userCred?.userId) {
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
    }
  }, [userCred?.userId]);
  return (
    <div className="my-2">
      <div className="flex flex-row gap-2">
        <div className="flex justify-center items-center">
          {/* <Avatar
            src={profileGeneralInfo?.picture?.imageInfo?.secure_url}
            alt="Profile Photo"
            sx={{
              border: '1px solid #800080',
            }}
          /> */}
          <ProfileAvatar
            firstName={profileGeneralInfo.firstName}
            lastName={profileGeneralInfo.lastName}
            profilePictureUrl={profileGeneralInfo.picture?.imageInfo?.secure_url}
          />
        </div>
        <div className="flex flex-col ">
          <Typography className="font-bold">
            {getUserFullName(profileGeneralInfo?.firstName, profileGeneralInfo?.middleName, profileGeneralInfo?.lastName)}
          </Typography>
          <Typography className="text-accent">{userCred?.email}</Typography>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
