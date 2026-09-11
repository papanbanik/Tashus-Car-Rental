'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ReservationBlockDates = {
  listingId: string;
  unblockedDates: any;
  hostId: string | undefined;
};

const unBlockDates = async ({ listingId, unblockedDates, hostId }: ReservationBlockDates) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/unblock-dates/${listingId}`, {
    hostId,
    unblockedDates,
  });
  // console.log(response);
  return response;
};

export const useDateUnblock = () => {
  const { eachCalenderDetails, setEachCalenderDetails } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ listingId, unblockedDates, hostId }: ReservationBlockDates) => unBlockDates({ listingId, unblockedDates, hostId }),
    onSuccess: (data, variables) => {
      // console.log('useUnblockDates success', data);
      const { unblockedDates } = variables;
      const unblockedData = data?.data?.data || [];
      // console.log(unblockedDates);
      // return data;
      // const check = [...eachCalenderDetails];
      // let updateData = [...check];
      // unblockedDates.forEach((unblockedDate: any) => {
      //   const dateIdToRemove = unblockedDate._id;
      //   updateData = check.filter((date) => date._id !== dateIdToRemove);
      // });
      // console.log(check);
      // console.log(updateData);
      const dateIdsToRemove = unblockedDates.map((unblockedDate: any) => unblockedDate._id);
      const updatedData = eachCalenderDetails.filter((date: any) => !dateIdsToRemove.includes(date._id));
      // setEachCalenderDetails([...updatedData]);
      // setEachCalenderDetails(updatedData);
      if (unblockedData?.length > 0) {
        // Merge the updated data with the new data
        const mergedData = [...updatedData, ...unblockedData];
        setEachCalenderDetails(mergedData);
      } else {
        setEachCalenderDetails(updatedData);
      }
      openSnackBar({
        message: data?.data?.message || 'Dates Unblocked Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
    },
    onError: (err: any) => {
      console.log('useUnblockDates mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error dates unblocking',
        severity: 'error',
        hideDuration: 5000,
      });
      return err;
    },
  });
};
