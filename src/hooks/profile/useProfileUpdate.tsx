'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type UserProfileUpdate = {
  userId: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth?: any;
  picture?: any;
};

const updateProfileInfo = async ({ userId, firstName, lastName, dateOfBirth, picture }: UserProfileUpdate) => {
  // console.log('Update Profile:', dateOfBirth, picture, userId);
  // const response = await axiosClient.post(`${apiUrl}/profile/update-user-profile/${userId}`);
  const response = await axiosClient.post(`${apiUrl}/profile/update-user-profile/${userId}`, {
    firstName,
    lastName,
    dateOfBirth,
    picture,
  });
  // console.log('Profile Update', response);
  return response;
};

export const useProfileUpdate = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  return useMutation({
    // mutationFn: (userId: string | undefined) => updateProfileInfo(userId),
    mutationFn: ({ userId, firstName, lastName, dateOfBirth, picture }: UserProfileUpdate) =>
      updateProfileInfo({ userId, firstName, lastName, dateOfBirth, picture }),
    onSuccess: (data, variables) => {
      const { firstName, lastName, dateOfBirth, picture } = variables;
      // console.log('OnSuccess Update', data);
      // console.log('OnSuccess Photo', data?.data?.data?.updatedData?.picture?.imageInfo?.secure_url);
      // console.log('Info Photo', picture);
      setUserProfileInfo({ ...userProfileInfo, firstName, lastName, dateOfBirth, picture });
    },
    onError: (err: any) => {
      console.log('useProfile mutation error', err);
      return err;
    },
  });
};
