'use client';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TSecondaryContactInfo, useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type SecondaryContactDetailsSave = {
  userId: string;
  secondaryContact: TSecondaryContactInfo;
};

const updateSecondaryContactDetails = async ({ userId, secondaryContact }: SecondaryContactDetailsSave) => {
  const response = await axiosClient.put(`${apiUrl}/profile/secondary-contact/${userId}`, { secondaryContact });
  return response;
};

export const useSecondaryContactDetails = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, secondaryContact }: SecondaryContactDetailsSave) => updateSecondaryContactDetails({ userId, secondaryContact }),
    onSuccess: (data, variables) => {
      const { secondaryContact } = variables;
      setUserProfileInfo({
        ...userProfileInfo,
        secondaryContact: secondaryContact || {},
      });
      openSnackBar({
        message: data?.data?.message || 'Contact Details Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      // console.log('Info', profileContactDetails);
      return data;
    },
    onError: (err: any) => {
      console.log('useSecondaryContactDetails error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Contact Details',
        severity: 'error',
      });
      return err;
    },
  });
};
