'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ProfileSummaryUpdate = {
  userId: string | undefined;
  partner: string | undefined;
  guest: string | undefined;
};

const updateProfileSummary = async ({ userId, partner, guest }: ProfileSummaryUpdate) => {
  const response = await axiosClient.put(`${apiUrl}/profile/summary/${userId}`, {
    partner,
    guest,
  });
  // console.log(response);
  return response;
};

export const useProfileSummary = () => {
  const { profileSummary, setProfileSummary } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    // mutationFn: (userId: string | undefined) => updateProfileInfo(userId),
    mutationFn: ({ userId, partner, guest }: ProfileSummaryUpdate) => updateProfileSummary({ userId, partner, guest }),
    onSuccess: (data, variables) => {
      // console.log('useSummary success', data);
      const { partner, guest } = variables;
      // console.log('useSummary success', variables);
      setProfileSummary({ ...profileSummary, partner, guest });
      openSnackBar({
        message: data?.data?.message || 'Profile Summary Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useSummary mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Initial Photos',
        severity: 'error',
      });
      return err;
    },
  });
};
