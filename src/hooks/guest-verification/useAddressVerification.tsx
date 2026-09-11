'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type AddressType = {
  userId?: string;
  // address: string;
  residentialAddressInfo: any;
  postalAddress?: string;
  proofOfAddress?: any;
  residentialAddressItemId?: string;
};

const saveAddressVerification = async ({ userId, proofOfAddress, residentialAddressInfo, postalAddress, residentialAddressItemId }: AddressType) => {
  // console.log(userId, proofOfAddress);
  const url = residentialAddressItemId
    ? `${apiUrl}/verify/residential-address/${userId}/${residentialAddressItemId}`
    : `${apiUrl}/verify/residential-address/${userId}`;
  // const response = await axiosClient.put(`${apiUrl}/verify/residential-address/${userId}`, {
  const response = await axiosClient.put(url, {
    residentialAddressInfo,
    proofOfAddress,
    postalAddress,
  });
  return response;
};

export const useAddressVerification = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, proofOfAddress, residentialAddressInfo, postalAddress, residentialAddressItemId }: AddressType) =>
      saveAddressVerification({ userId, proofOfAddress, residentialAddressInfo, postalAddress, residentialAddressItemId }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data[0]);
      // console.log(variables);
      //   console.log(variables);
      const { residentialAddressInfo, proofOfAddress, postalAddress } = variables;
      const addressStatus = verificationFieldFlags?.isAddressIncorrect ? 'resubmitted' : 'pending';
      // console.log(residentialAddressInfo, proofOfAddress);
      //   console.log(userProfileInfo?.contactDetails);
      const newResidentialAddress = {
        residentialAddressInfo: residentialAddressInfo,
        proofOfAddressPhoto: proofOfAddress,
        postalAddress: postalAddress,
        _id: data?.data?.data[0]?.residentialAddressItemId,
        status: addressStatus,
        createdAt: data?.data?.data[0]?.createdAt,
      };
      const updatedGuestVerification = {
        ...userProfileInfo?.guestVerification,
        residentialAddress: newResidentialAddress,
      };
      // console.log(userProfileInfo?.guestVerification?.residentialAddress);
      setUserProfileInfo({
        ...userProfileInfo,
        guestVerification: updatedGuestVerification,
        contactDetails: {
          ...(userProfileInfo?.contactDetails || {}),
          // residentialAddress: residentialAddress,
          residentialAddressItemId: data?.data?.data[0]?.residentialAddressItemId,
          residentialAddressInfo: residentialAddressInfo,
          proofOfAddressPhoto: proofOfAddress,
          status: addressStatus,
        },
      });
      openSnackBar({
        message: data?.data?.message,
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
