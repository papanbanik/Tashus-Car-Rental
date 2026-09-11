'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { ProfileInfoUpdateType } from '@/types/profileInfoTypes';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicCoverView from '../DynamicCoverView';
import PhoneNumber from './PhoneNumber/PhoneNumber';
import ProfileAddress from './ProfileAddress/ProfileAddress';
import ProfileImage from './ProfileBasic/ProfileImage';
import ProfileInfo from './ProfileBasic/ProfileInfo';
import ProfileLicense from './ProfileLicense/ProfileLicense';
import SecondaryContact from './SecondaryContact/SecondaryContact';
import Verified from './Verified';

const ProfileBasicInfo = () => {
  useHealthCheck();
  useGetVerificationInfo();
  //Profile Image
  const { userProfileInfo } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const [profileUrl, setProfileUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const { control } = useForm<ProfileInfoUpdateType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const commonUploadProps = {
    control,
    profileUrl,
    singleFile,
    setSingleFile,
    setProfileUrl,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };
  //Check Query Params
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const vehicleId = searchParams.get('vehicle');
  //Add router
  const router = useRouter();
  //Destruct
  const { profileInfo, guestVerification: guestVerificationInfo } = userProfileVerificationInfo ?? {};
  // Back to checkout page
  useEffect(() => {
    const { verificationStatus } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    if ((verificationStatus === 'approved' || verificationStatus === 'pending') && source === 'checkout' && !!vehicleId) {
      router.push(`/search/${vehicleId}/checkout`);
    }
  }, [profileInfo, guestVerificationInfo, vehicleId, source]);
  return (
    <>
      <DynamicCoverView title={`${userProfileInfo?.firstName ?? 'User'}'s Profile`} isProfile={true} />
      <div className="p-6">
        <span className="text-lg font-bold">My Profile</span>
        <div className="flex flex-col md:flex-row gap-2 my-2">
          <div className="md:w-2/5">
            <ProfileImage {...commonUploadProps} />
          </div>
          <div className="md:w-3/5">
            <ProfileInfo />
          </div>
        </div>
        <Verified />
        {userProfileInfo?.verificationInfo?.phone && <PhoneNumber />}
        <SecondaryContact />
        {!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo && <ProfileLicense />}
        {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo && <ProfileAddress />}
      </div>
    </>
  );
};

export default ProfileBasicInfo;
