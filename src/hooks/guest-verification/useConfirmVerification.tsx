'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type ConfirmType = {
  userId?: string;
  isAgreed: boolean;
};

const confirmVerification = async ({ userId, isAgreed }: ConfirmType) => {
  const response = await axiosClient.put(`${apiUrl}/verify/complete-verification/${userId}`, {
    isAgreed,
  });
  return response;
};

export const useConfirmVerification = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, isAgreed }: ConfirmType) => confirmVerification({ userId, isAgreed }),
    onSuccess: (data, variables) => {
      const { isAgreed } = variables;
      const updatedGuestVerification = {
        ...userProfileInfo?.guestVerification,
        isAgreed: isAgreed,
      };
      setUserProfileInfo({
        ...userProfileInfo,
        guestVerification: updatedGuestVerification,
      });
      openSnackBar({
        message: data?.data?.message || 'Verification Step Completed Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
      closeModal();
    },
    onError: (err: any) => {
      console.log('useAddressType mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
