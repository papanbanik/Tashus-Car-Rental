import AddressVerify from '@/components/Verification/VerificationSteps/AddressVerify';
import LicenseVerify from '@/components/Verification/VerificationSteps/LicenseVerify';
import ProfileVerify from '@/components/Verification/VerificationSteps/ProfileVerify';
import { TVerificationFieldFlags } from '@/types/profileInfoTypes';
import {
  TGuestVerification,
  TIndividualVerificationState,
  TProfileInfo,
  UserProfileVerificationInfo,
} from '@/types/user-verification/userVerificationTypes';
import { AccountVerificationStep, VerificationResult } from '@/types/user-verification/verificationListingSteps';
import Link from 'next/link';
import { isDrivingAgeValid, isLicenseExpired } from '../dateTimeCommonFn';
import { buildQueryParams } from '../searchCommonFn';
import { DVerificationFieldFlags, getDiscrepancyMessage } from './verificationFn';

export const getAccountVerificationSteps = () => {
  const accountVerificationSteps: AccountVerificationStep[] = [
    {
      id: 1,
      label: 'Profile',
      description: 'Create your account effortlessly in just a few minutes.',
      component: <ProfileVerify />,
      isCompleted: false,
      isCurrent: true,
    },
    {
      id: 2,
      label: 'License',
      description: 'Choose your vehicle and start your journey with confidence!',
      component: <LicenseVerify />,
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 3,
      label: 'Address',
      description: 'Complete our quick and secure verification process.',
      component: <AddressVerify />,
      isCompleted: false,
      isCurrent: false,
    },
  ];
  return accountVerificationSteps;
};

export const defaultCurrentAccountVerification: AccountVerificationStep = {
  id: 1,
  label: 'Profile',
  description: 'Create your account effortlessly in just a few minutes.',
  component: <ProfileVerify />,
  isCompleted: false,
  isCurrent: true,
};

export const getVerificationStatusInfo = (
  profileInfo: TProfileInfo,
  guestVerificationInfo: TGuestVerification,
  pathName?: string
): VerificationResult => {
  //isCountry Australia
  const isCountryAustralia = !!guestVerificationInfo?.drivingLicenseInfo?.country
    ? guestVerificationInfo?.drivingLicenseInfo?.country === 'Australia'
    : true;

  const verificationInfoFlags = guestVerificationInfo?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  //Check Mandatory Fields
  const mandatoryFields = guestVerificationInfo?.mandatoryFields;

  // Verification Complete

  //Profile step
  const isProfileRequired = mandatoryFields?.isProfilePhotoRequired;
  const profileCheck = isProfileRequired ? !!profileInfo?.picture?.imageInfo?.secure_url : true;
  const isProfileStepComplete = profileInfo?.verificationInfo?.email?.isVerified && profileInfo?.verificationInfo?.phone?.isVerified && profileCheck;

  //License step
  const isSecondaryRequired = true; //!secondary ID always required
  // const isSecondaryRequired = mandatoryFields?.isSecondaryIdRequired || !isCountryAustralia;
  const isLicenseStepComplete =
    !!guestVerificationInfo?.drivingLicensePhoto?.imageInfo?.secure_url &&
    !!guestVerificationInfo?.drivingLicensePhotoBackside?.imageInfo?.secure_url &&
    !!guestVerificationInfo?.drivingLicenseInfo?.country &&
    !!guestVerificationInfo?.drivingLicenseWithFace?.imageInfo?.secure_url &&
    (isSecondaryRequired ? !!guestVerificationInfo?.secondaryIdInfo?.idType : true);
  const hasDateOfBirth = !!profileInfo?.dateOfBirth;
  //Address step
  const isAustralianAddressRequired = guestVerificationInfo?.mandatoryFields?.isAustralianAddressRequired || !isCountryAustralia;
  const ausAddressCheck = isAustralianAddressRequired ? !!guestVerificationInfo?.residentialAddress?.australianAddressInfo : true;
  const isProofOfAddressRequired = guestVerificationInfo?.mandatoryFields?.isProofOfAddressRequired || !isCountryAustralia;
  const proofOfAddressCheck = isProofOfAddressRequired
    ? !!guestVerificationInfo?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url
    : true;
  const isAddressStepComplete =
    !!guestVerificationInfo?.residentialAddress && guestVerificationInfo?.isAgreed && ausAddressCheck && proofOfAddressCheck;

  const isAllStepsCompleted = isProfileStepComplete && isLicenseStepComplete && isAddressStepComplete;

  // Verification Check Pending & Declined
  const checkStatuses = [
    profileInfo?.picture?.status,
    guestVerificationInfo?.drivingLicensePhoto?.status,
    guestVerificationInfo?.drivingLicensePhotoBackside?.status,
    guestVerificationInfo?.drivingLicenseInfo?.status,
    guestVerificationInfo?.drivingLicenseWithFace?.status,
    guestVerificationInfo?.secondaryIdInfo?.status,
    guestVerificationInfo?.residentialAddress?.status,
  ];

  const hasDeclined = checkStatuses.includes('declined');
  const hasPending = checkStatuses.includes('pending');
  const isAllApproved = guestVerificationInfo?.finalVerificationStatus === 'approved';
  const isFinalVerificationPending = guestVerificationInfo?.finalVerificationStatus === 'pending';
  const isFinalVerificationDeclined = guestVerificationInfo?.finalVerificationStatus === 'declined';
  const isFinalVerificationManualDeclined = guestVerificationInfo?.finalVerificationStatus === 'manualDeclined';

  // Check Age and Expiration
  const isExpired = guestVerificationInfo?.drivingLicenseInfo?.expiryDate
    ? isLicenseExpired(guestVerificationInfo?.drivingLicenseInfo?.expiryDate)
    : false;

  const isAgeValid = profileInfo?.dateOfBirth ? isDrivingAgeValid(profileInfo?.dateOfBirth) : false;

  const isSecondaryIDExpired = guestVerificationInfo?.secondaryIdInfo?.idType
    ? !!guestVerificationInfo?.secondaryIdInfo?.expiryDate && isLicenseExpired(guestVerificationInfo?.secondaryIdInfo?.expiryDate)
    : false;

  const hasDiscrepancies = Object.values(verificationInfoFlags).some((flag) => flag === true);
  const isAllResubmitted = hasAllResubmitted(guestVerificationInfo, verificationInfoFlags, profileInfo);

  const hasExpired = isLicenseStepComplete && (isExpired || isSecondaryIDExpired);
  const dynamicSearchParams = !isProfileStepComplete ? 'profile' : !isLicenseStepComplete || hasExpired || !isAgeValid ? 'license' : 'address';
  // Determine  verificationStatus and dynamicText
  let verificationStatus = 'Incomplete';
  let dynamicText: string | JSX.Element = '';
  const secondaryID = !isCountryAustralia ? 'passport' : 'secondary';

  //secondaryID
  const { secondaryIdInfo } = guestVerificationInfo ?? {};
  const { idType } = secondaryIdInfo ?? {};
  const isCorrectId = !!idType && !isCountryAustralia ? idType === 'PassportId' : true;

  if (hasDateOfBirth && !isAgeValid) {
    verificationStatus = 'Invalid';
    // dynamicText = 'Your age is invalid. Please contact Tashus support center.';
    dynamicText = (
      <>
        Your age is invalid. Please contact Tashus{' '}
        <Link href="/support/support-center/general?from=general" target="_blank" className="text-primary font-semibold">
          support center
        </Link>
        .
      </>
    );
  } else if (!hasDeclined && isFinalVerificationDeclined) {
    verificationStatus = 'declined';
    dynamicText = 'Your Tashus profile has been declined in accordance with our policy guidelines. Please check your email for further details.';
  } else if (isFinalVerificationManualDeclined) {
    verificationStatus = 'declined';
    dynamicText =
      'Your Tashus profile has been declined in accordance with our policy guidelines. For any further assistance, please contact our support team.';
  } else if (!isCorrectId) {
    verificationStatus = 'Incomplete';
    dynamicText = 'You need to provide your passport ID details. You can find it in the "License" section.';
  } else if (isLicenseStepComplete && (isExpired || isSecondaryIDExpired)) {
    verificationStatus = 'Expired';
    if (isExpired && isSecondaryIDExpired) {
      dynamicText = `Your license and ${secondaryID} ID have expired. Please provide updated information.`;
    } else if (isExpired) {
      dynamicText = 'Your license has expired. Please provide updated information.';
    } else if (isSecondaryIDExpired) {
      dynamicText = `Your ${secondaryID} ID has expired. Please provide updated information.`;
    }
  } else if (isAllStepsCompleted && hasDiscrepancies && !isAllResubmitted) {
    verificationStatus = 'Inconsistent';
    dynamicText = pathName?.includes('checkout')
      ? 'Some of your information has discrepancies. Please review and provide the correct information to proceed.'
      : getDiscrepancyMessage(verificationInfoFlags, secondaryID);
  } else if (isAllStepsCompleted && isAllApproved) {
    verificationStatus = 'approved';
    dynamicText = 'Your Tashus profile has been verified. You are all set to hit the road.';
  } else if (isAllStepsCompleted && hasDeclined) {
    verificationStatus = 'declined';
    dynamicText = 'Your information has been declined. Please check your email and provide correct information.';
  } else if (isAllStepsCompleted && !hasDeclined && hasPending && !isFinalVerificationManualDeclined) {
    verificationStatus = 'pending';
    dynamicText = 'Your Tashus profile is under review. Admin verification is in progress. You will be notified once approved.';
  } else if (!isProfileStepComplete || !isLicenseStepComplete || !isAddressStepComplete) {
    verificationStatus = 'Incomplete';
    const missingSteps: string[] = [];
    if (!isProfileStepComplete) missingSteps.push('profile');
    if (!isLicenseStepComplete) missingSteps.push('license');
    if (!isAddressStepComplete) missingSteps.push('address');

    if (missingSteps.length === 1) {
      dynamicText = `Add your ${missingSteps[0]} step information to complete your verification process.`;
    } else if (missingSteps.length === 2) {
      dynamicText = `Add your ${missingSteps[0]} and ${missingSteps[1]} steps information to complete your verification process.`;
    } else if (missingSteps.length === 3) {
      dynamicText = `Add your ${missingSteps[0]}, ${missingSteps[1]}, and ${missingSteps[2]} steps information to complete your verification process.`;
    }
  } else if (isAllStepsCompleted && !hasPending && isFinalVerificationPending) {
    verificationStatus = 'pending';
    dynamicText = 'Your Tashus profile is under review. Admin verification is in progress. You will be notified once approved.';
  }

  return { verificationStatus, dynamicText, isAllStepsCompleted: isAllStepsCompleted ?? false, dynamicSearchParams };
};

//Get Individual Completed State [Used:VerificationSteps]
export const getIndividualVerificationCompleteState = (userProfileVerificationInfo: UserProfileVerificationInfo): TIndividualVerificationState => {
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerification = userProfileVerificationInfo?.guestVerification;
  const mandatoryFields = guestVerification?.mandatoryFields;

  // Profile Step
  const isProfileRequired = mandatoryFields?.isProfilePhotoRequired;
  const profileCheck = isProfileRequired ? !!profileInfo?.picture?.imageInfo?.secure_url : true;

  const isProfileStepComplete =
    !!profileInfo?.verificationInfo?.email?.isVerified && !!profileInfo?.verificationInfo?.phone?.isVerified && profileCheck;

  //License Step
  const isLicenseCountryAustralia = !!guestVerification?.drivingLicenseInfo?.country
    ? guestVerification?.drivingLicenseInfo?.country === 'Australia'
    : true;

  // const isSecondaryRequired = !isLicenseCountryAustralia || mandatoryFields?.isSecondaryIdRequired;
  const isSecondaryRequired = true; //!secondary ID always required
  const isLicenseStepComplete =
    !!guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url &&
    !!guestVerification?.drivingLicenseInfo?.country &&
    !!guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url &&
    (isSecondaryRequired ? !!guestVerification?.secondaryIdInfo?.idType : true);

  //Address Step
  const isResidentialCountryAustralia = !!guestVerification?.residentialAddress?.residentialAddressInfo?.country
    ? guestVerification?.residentialAddress?.residentialAddressInfo?.country === 'AU'
    : true;
  const isCountryAustralia = isLicenseCountryAustralia && isResidentialCountryAustralia;
  const isAustralianAddressRequired = !isCountryAustralia || mandatoryFields?.isAustralianAddressRequired;

  const ausAddressCheck = isAustralianAddressRequired ? !!guestVerification?.residentialAddress?.australianAddressInfo?.country : true;

  const isProofOfAddressRequired = !isCountryAustralia || mandatoryFields?.isProofOfAddressRequired;

  const proofOfAddressCheck = isProofOfAddressRequired ? !!guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url : true;

  const isAddressStepComplete = !!guestVerification?.residentialAddress?.residentialAddressInfo?.country && ausAddressCheck && proofOfAddressCheck;

  return {
    isProfileStepComplete,
    isLicenseStepComplete,
    isAddressStepComplete,
  };
};

export const hasAllResubmitted = (
  guestVerification: TGuestVerification,
  verificationInfoFlags: TVerificationFieldFlags,
  profileInfo: TProfileInfo
): boolean => {
  const verificationChecks = [
    verificationInfoFlags?.isDLPhotoIncorrect ? guestVerification?.drivingLicensePhoto?.status === 'resubmitted' : true,

    verificationInfoFlags?.isDLBackPhotoIncorrect ? guestVerification?.drivingLicensePhotoBackside?.status === 'resubmitted' : true,

    verificationInfoFlags?.isDLSelfieIncorrect ? guestVerification?.drivingLicenseWithFace?.status === 'resubmitted' : true,

    verificationInfoFlags?.isSecondaryIdPhotoIncorrect ? guestVerification?.secondaryIdInfo?.status === 'resubmitted' : true,

    verificationInfoFlags?.isAddressIncorrect ? guestVerification?.residentialAddress?.status === 'resubmitted' : true,

    verificationInfoFlags?.isProfileIncorrect ? profileInfo?.picture?.status === 'resubmitted' : true,
  ];

  return verificationChecks?.every((check) => check);
};

export const getVerificationStepsHighlight = (profileInfo: TProfileInfo, guestVerification: TGuestVerification) => {
  const verificationSteps: Record<string, string[]> = {
    Profile: [],
    License: [],
    Address: [],
  };

  //Destruct profile Info
  const { picture, verificationInfo } = profileInfo ?? {};
  //Destruct Guest Info
  const {
    mandatoryFields,
    drivingLicensePhoto,
    drivingLicensePhotoBackside,
    drivingLicenseWithFace,
    drivingLicenseInfo,
    residentialAddress,
    secondaryIdInfo,
  } = guestVerification ?? {};

  const isLicenseCountryAustralia = !!drivingLicenseInfo?.country ? drivingLicenseInfo?.country === 'Australia' : true;
  // Profile Verification
  const isProfileRequired = mandatoryFields?.isProfilePhotoRequired;
  const profilePhotoExists = isProfileRequired ? !!picture?.imageInfo?.secure_url : true;
  const isEmailVerified = verificationInfo?.email?.isVerified;
  const isMobileVerified = verificationInfo?.phone?.isVerified;

  if (!profilePhotoExists) verificationSteps.Profile.push('Add Profile Photo');
  if (!isEmailVerified && !isMobileVerified) {
    verificationSteps.Profile.push('Verify Email & Phone Number');
  } else if (!isEmailVerified) {
    verificationSteps.Profile.push('Verify Email');
  } else if (!isMobileVerified) {
    verificationSteps.Profile.push('Verify Phone Number');
  }

  // License Verification
  const isLicensePhoto = !!drivingLicensePhoto?.imageInfo?.secure_url;
  const isLicenseBackPhoto = !!drivingLicensePhotoBackside?.imageInfo?.secure_url;

  const isLicenseDetails = !!drivingLicenseInfo?.country;

  const isSelfieWithLicense = !!drivingLicenseWithFace?.imageInfo?.secure_url;

  // const isSecondaryIDRequired = mandatoryFields?.isSecondaryIdRequired || !isLicenseCountryAustralia;
  const isSecondaryIDRequired = true; //!secondary ID always required

  const isSecondaryID = isSecondaryIDRequired ? !!secondaryIdInfo?.idType : true;
  const secondaryConsider = !isLicenseCountryAustralia ? 'Passport' : 'Secondary ID';

  if (!isLicensePhoto || !isLicenseBackPhoto) verificationSteps.License.push('Add License Photo');
  if (!isLicenseDetails) verificationSteps.License.push('Add License Details');
  if (!isSelfieWithLicense) verificationSteps.License.push('Add Selfie with License');
  if (!isSecondaryID) verificationSteps.License.push(`Add ${secondaryConsider} Details`);

  // Address Verification
  const isResidentialCountryAustralia = !!residentialAddress?.residentialAddressInfo?.country
    ? residentialAddress?.residentialAddressInfo?.country === 'AU'
    : true;
  const isCountryAustralia = isLicenseCountryAustralia && isResidentialCountryAustralia;
  const isAustralianAddressRequired = !isCountryAustralia || mandatoryFields?.isAustralianAddressRequired;

  const isResidentialAddress = !!residentialAddress?.residentialAddressInfo?.country;
  const hasAustralianAddress = isAustralianAddressRequired ? !!residentialAddress?.australianAddressInfo?.country : true;
  const isProofOfAddressRequired = mandatoryFields?.isProofOfAddressRequired || !isCountryAustralia;

  const hasProofOfAddress = isProofOfAddressRequired ? !!residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url : true;

  if (!isResidentialAddress) verificationSteps.Address.push('Add Residential Address');
  if (!hasProofOfAddress) verificationSteps.Address.push('Add Proof of Address');
  if (!hasAustralianAddress) verificationSteps.Address.push('Add Australian Address');

  return verificationSteps;
};

export const getUpdatedUrl = (pathname: string, stepName: string) => {
  const existingQueryParams = new URLSearchParams(window.location.search);
  const existingSource = existingQueryParams.get('source');
  const existingVehicle = existingQueryParams.get('vehicle');
  // Build the updated query string
  const queryParams = buildQueryParams({
    step: stepName,
    source: existingSource ?? undefined,
    vehicle: existingVehicle ?? undefined,
  });
  return `${pathname}?${queryParams}`;
};
