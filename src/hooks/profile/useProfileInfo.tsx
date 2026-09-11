'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TVerificationFieldFlags } from '@/types/profileInfoTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getUserProfileInfo = async (userId: string) => {
  const response = await axiosClient.get(`${apiUrl}/profile/me/${userId}`);
  return response;
};

export const useProfileInfo = () => {
  //******remove redirection this part of code and codes associated with it after mobile redirection is not needed anymore ***/
  const [userCred, setUserCred] = useState<any>();
  useEffect(() => {
    const cred = JSON.parse(localStorage.getItem('tashus') as string);
    setUserCred(cred);
  }, []);
  //************* part ended *************************************/

  const {
    userCred: { userId },
    userProfileInfo,
    setUserProfileInfo,
    setProfileHookEnableKeys,
    profileHookEnableKeys,
    setVerificationFieldFlags,
    setIsDepositSetByAdmin,
  } = useUserCredContext();
  const {
    profileSummary,
    setProfileSummary,
    profileContactDetails,
    setProfileContactDetails,
    setProfileGeneralInfo,
    setSignInMethod,
    profileGeneralInfo,
    setGuestAccess,
    setPartnerAccess,
  } = useProfileInfoContext();
  // console.log(userId, profileHookEnableKeys?.enableUseProfileInfo);
  const uId = userId ?? userCred?.userId;
  return useQuery({
    queryKey: ['profile-info', { userId }],
    queryFn: () => getUserProfileInfo(uId),
    enabled: !!profileHookEnableKeys?.enableUseProfileInfo && !!uId,
    // enabled: (!!userId||!!userCred?.userId),
    refetchOnWindowFocus: profileHookEnableKeys?.enableUseProfileInfo && !!uId,
    onSuccess: (data) => {
      const { firstName, middleName, lastName, dateOfBirth, picture, verificationInfo } = data?.data?.data?.profileInfo;
      setProfileGeneralInfo({
        ...profileGeneralInfo,
        firstName,
        middleName,
        lastName,
        picture,
      });
      // const tempProfileInfo = { ...data?.data?.data?.profileInfo, guestVerification: { ...data?.data?.data?.guestVerification } };
      // console.log(tempProfileInfo);
      const tempProfileInfo = {
        ...data?.data?.data?.profileInfo,
        guestVerification: { ...data?.data?.data?.guestVerification },
        totalCars: data?.data?.data?.totalCars,
      };
      // console.log(tempProfileInfo);
      setUserProfileInfo(tempProfileInfo);
      const verificationInfoFlags: TVerificationFieldFlags =
        data?.data?.data?.guestVerification?.requestVerificationInfo?.verificationInfoFlags || DVerificationFieldFlags;
      setVerificationFieldFlags(verificationInfoFlags);
      // console.log('Profile Info', data?.data?.data?.profileInfo?.profileSummary);
      setSignInMethod(data?.data?.data?.signInMethod);

      const { partner, guest } = data?.data?.data?.profileInfo?.profileSummary || {};
      setProfileSummary({ ...profileSummary, partner, guest });

      const email = data?.data?.data?.email || '';
      const contactDetails = data?.data?.data?.profileInfo?.contactDetails || {};
      const secondaryContact = data?.data?.data?.profileInfo?.secondaryContact || {};
      const phone = data?.data?.data?.profileInfo?.verificationInfo?.phone || {};
      contactDetails.email = email;

      //console.log(contactDetails, secondaryContact, phone);
      setProfileContactDetails({
        ...profileContactDetails,
        contactDetails,
        phone,
        secondaryContact,
      });
      setPartnerAccess(data?.data?.data?.partnerAccess);
      setGuestAccess(data?.data?.data?.guestAccess);
      //console.log('Info', profileContactDetails);
      // console.log('List of deposit', data?.data?.data?.profileInfo?.isDepositApplicableInfoList);
      const depositInfoList = data?.data?.data?.profileInfo?.isDepositApplicableInfoList ?? [];
      const lastEntry = depositInfoList.slice(-1)[0];
      setIsDepositSetByAdmin(!!lastEntry?.adminId);
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: false });
      return data;
    },
    onError: (err) => {
      console.log('useProfileInfo error', err);
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: false });
      return err;
    },
  });
};
