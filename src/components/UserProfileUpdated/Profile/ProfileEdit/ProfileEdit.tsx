'use client';
import CommonBreadCrumb from '@/components/Common/Breadcrumbs/CommonBreadCrumb';
import ExpandableHelpingBox from '@/components/Common/Verification/CombineSection';
import ResidentialAddressVerifyM from '@/components/Verification/VerificationSteps/Address/AddressM/ResidentialAddressVerifyM';
import LicenseDetailsVerify from '@/components/Verification/VerificationSteps/License/LicenseDetailsVerify';
import LicensePhotoVerify from '@/components/Verification/VerificationSteps/License/LicensePhotoVerify';
import LicenseSelfieVerify from '@/components/Verification/VerificationSteps/License/LicenseSelfieVerify';
import SecondaryIDVerify from '@/components/Verification/VerificationSteps/License/SecondaryIDVerify';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { getRequestVerificationMessages } from '@/utils/Functions/verification/verificationFn';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import {
  addressHelpingData,
  licenseDetailsHelpingData,
  licenseHelpingData,
  licenseSelfieHelpingData,
  secondaryIDHelpingData,
} from '@/utils/Lists/verificationStepList';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { FaUser } from 'react-icons/fa6';

const ProfileEdit = () => {
  useGetVerificationInfo();
  const { userCred } = useUserCredContext();
  const { userProfileVerificationInfo, isCountryAustralia: isCountryAustraliaCheck } = useProfileInfoContext();
  const { editStep } = useParams<{ editStep: string }>();
  //Destruct
  const { guestVerification: guestVerificationInfo, profileInfo } = userProfileVerificationInfo ?? {};
  const router = useRouter();
  //Check Query Params
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const vehicleUrlId = searchParams.get('vehicle');
  const profileUrl = source === 'checkout' ? `/search/${vehicleUrlId}/checkout` : `/dashboard/${userCred?.userId}/profile-info`;
  const editUrl =
    source === 'checkout'
      ? `/dashboard/${userCred?.userId}/profile-info?source=${source}&vehicle=${vehicleUrlId}`
      : `/dashboard/${userCred?.userId}/profile-info`;
  const editBreadcrumbItems = [
    { label: `${source === 'checkout' ? 'Checkout' : 'Profile'}`, href: profileUrl },
    { label: 'Edit', href: editUrl },
    { label: `${editStep === 'address' ? 'Address' : 'License'}` },
  ];
  const helpingText = `N.B. Any edits to your information will require re-verification. If you are already verified, your status will change to 'pending verification'`;
  const { licenseMessage, addressMessage } = getRequestVerificationMessages(userProfileVerificationInfo);
  const isCountryAustralia = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country === 'Australia';
  // const secondaryIdRequired = userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isSecondaryIdRequired || !isCountryAustralia;
  const secondaryIdRequired = true;
  // Back to checkout page
  useEffect(() => {
    const { verificationStatus } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    if ((verificationStatus === 'approved' || verificationStatus === 'pending') && source === 'checkout' && !!vehicleUrlId) {
      router.push(`/search/${vehicleUrlId}/checkout`);
    }
  }, [profileInfo, guestVerificationInfo, vehicleUrlId, source]);
  return (
    <div className="p-4">
      <div className="flex flex-col border border-solid border-accent rounded-lg p-4">
        <CommonBreadCrumb icon={<FaUser className="mr-2" />} items={editBreadcrumbItems}></CommonBreadCrumb>
        <span className="text-xs text-gray-500">{helpingText}</span>
      </div>
      {editStep === 'license' ? (
        <>
          <ExpandableHelpingBox
            title="License photo"
            helpingBoxes={licenseHelpingData}
            message={licenseMessage?.licensePhotoMessage}
            isMandatory={true}
          >
            <LicensePhotoVerify />
          </ExpandableHelpingBox>
          <ExpandableHelpingBox
            title="License Details"
            helpingBoxes={licenseDetailsHelpingData}
            message={licenseMessage?.licenseInfoMessage}
            isMandatory={true}
          >
            <LicenseDetailsVerify />
          </ExpandableHelpingBox>
          <ExpandableHelpingBox
            title="Selfie with License"
            helpingBoxes={licenseSelfieHelpingData}
            message={licenseMessage?.licenseSelfieMessage}
            isMandatory={true}
          >
            <LicenseSelfieVerify />
          </ExpandableHelpingBox>
          {secondaryIdRequired && (
            <ExpandableHelpingBox
              title={`${!isCountryAustralia ? 'Passport' : 'Secondary'} ID Details`}
              helpingBoxes={secondaryIDHelpingData}
              message={licenseMessage?.secondaryIDMessage}
              isMandatory={true}
            >
              <SecondaryIDVerify secondaryIdData={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo} />
            </ExpandableHelpingBox>
          )}
        </>
      ) : (
        <>
          <ExpandableHelpingBox
            title="Address"
            helpingBoxes={
              isCountryAustraliaCheck && !userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isProofOfAddressRequired
                ? addressHelpingData.slice(0, 1)
                : addressHelpingData
            }
            isNotExpand={true}
            message={addressMessage}
          >
            <ResidentialAddressVerifyM />
          </ExpandableHelpingBox>
        </>
      )}
    </div>
  );
};

export default ProfileEdit;
