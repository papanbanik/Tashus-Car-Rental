'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TAddressInfo, TProofOfAddress } from '@/types/user-verification/userVerificationTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';

const apiUrl = environment?.API_URL || '';

type AddressDetailsSave = {
  userId: string;
  residentialAddressInfo?: TAddressInfo;
  postalAddress?: string;
  postalAddressInfo?: TAddressInfo;
  australianAddressInfo?: TAddressInfo;
  proofOfAddressPhoto?: TProofOfAddress;
};

const saveAddressDetails = async ({
  userId,
  residentialAddressInfo,
  postalAddress,
  postalAddressInfo,
  australianAddressInfo,
  proofOfAddressPhoto,
}: AddressDetailsSave) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/address/${userId}`, {
    residentialAddressInfo,
    postalAddress,
    postalAddressInfo,
    australianAddressInfo,
    proofOfAddressPhoto,
  });
  return response;
};

export const useAddressDetailsSave = () => {
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({
      userId,
      residentialAddressInfo,
      postalAddress,
      postalAddressInfo,
      australianAddressInfo,
      proofOfAddressPhoto,
    }: AddressDetailsSave) =>
      saveAddressDetails({ userId, residentialAddressInfo, postalAddress, postalAddressInfo, australianAddressInfo, proofOfAddressPhoto }),
    onSuccess: (data, variables) => {
      const { residentialAddressInfo, postalAddress, postalAddressInfo, australianAddressInfo, proofOfAddressPhoto } = variables;
      const updatedData = {
        ...userProfileVerificationInfo,
        guestVerification: {
          ...userProfileVerificationInfo?.guestVerification,
          residentialAddress: {
            residentialAddressInfo: residentialAddressInfo,
            postalAddress: postalAddress,
            postalAddressInfo: postalAddressInfo,
            australianAddressInfo: australianAddressInfo,
            proofOfAddressPhoto: proofOfAddressPhoto,
            status: userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isAddressIncorrect
              ? 'resubmitted'
              : 'pending',
          },
          isAgreed: true,
        },
      };
      setUserProfileVerificationInfo(updatedData);
      openSnackBar({
        message: data?.data?.message || 'Address Save Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
    },
    onError: (err: any) => {
      console.log('useDriverLicenseSave mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving address',
        severity: 'error',
      });
      return err;
    },
  });
};
