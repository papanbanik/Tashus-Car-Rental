'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ReservationBlockDates = {
  listingId: string;
  blockedDates: any;
  hostId: string | undefined;
};

const addBlockDates = async ({ listingId, blockedDates, hostId }: ReservationBlockDates) => {
  const response = await axiosClient.put(`${apiUrl}/reservation/block-dates/${listingId}`, {
    hostId,
    blockedDates,
  });
  // console.log(response);
  return response;
};

export const useDateBlocks = () => {
  const { eachCalenderDetails, setEachCalenderDetails } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ listingId, blockedDates, hostId }: ReservationBlockDates) => addBlockDates({ listingId, blockedDates, hostId }),
    onSuccess: (data) => {
      // console.log('useBlockDates success', data);
      // console.log('useBlockDates success', data?.data);
      // console.log('useBlockDates success', data?.data?.data);
      // const { blockedDates } = variables;
      const newUnblockDates = data?.data?.data;
      // console.log(blockedDates);
      // const transformedBlockedDates = blockedDates.map((block: any) => ({
      //   start: block.start instanceof Date ? block.start.toISOString() : block.start.$d.toISOString(),
      //   end: block.end instanceof Date ? block.end.toISOString() : block.end.$d.toISOString(),
      //   title: block.title,
      // }));
      // console.log(transformedBlockedDates);
      // console.log('Before setting in context:', eachCalenderDetails);
      // const check = [...eachCalenderDetails, ...transformedBlockedDates];
      // console.log(check);
      // setEachCalenderDetails([...eachCalenderDetails, ...transformedBlockedDates]);
      // console.log([...eachCalenderDetails, ...newUnblockDates]);
      setEachCalenderDetails([...eachCalenderDetails, ...newUnblockDates]);
      // console.log('After setting in context:', eachCalenderDetails);
      openSnackBar({
        message: data?.data?.message || 'Unavailable Dates Added Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useBlockDates mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'The following date ranges are already blocked',
        severity: 'error',
        hideDuration: 5000,
      });
      return err;
    },
  });
};
