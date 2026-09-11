'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useProfileInfo } from '@/hooks/profile/useProfileInfo';
import { isDrivingAgeValid, isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import { Alert, Step, StepLabel, Stepper } from '@mui/material';
import { cloneElement, useEffect, useState } from 'react';
import { steps } from './StepsList';
const VerificationSteps = () => {
  useProfileInfo();
  const { userCred } = useUserCredContext();

  useEffect(() => {
    if (userCred?.loggedIn && userCred?.userId) {
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
    }
  }, [userCred?.userId]);

  const { guestVerificationFlags, setGuestVerificationFlags, verificationStatusFlags, setVerificationStatusFlags } = useSearchContext();
  const { userProfileInfo, setProfileHookEnableKeys, profileHookEnableKeys } = useUserCredContext();
  useEffect(() => {
    let isExpired = false;
    if (userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate) {
      isExpired = isLicenseExpired(userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate);
    }
    let isAgeValid = false;
    if (userProfileInfo?.dateOfBirth) {
      isAgeValid = isDrivingAgeValid(userProfileInfo?.dateOfBirth);
    }
    let isSecondaryIDExpired = false;
    if (!!userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate) {
      isSecondaryIDExpired = isLicenseExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate);
    }
    let verificationFlags = {
      isEmailVerified: userProfileInfo?.verificationInfo?.email?.isVerified || false,
      isMobileVerified: !!userProfileInfo?.verificationInfo?.phone?.isVerified || false,
      isAddressVerified: !!userProfileInfo?.contactDetails?.residentialAddressInfo, //Modified the residential addressInfo
      isLicenseVerified: !!userProfileInfo?.guestVerification?.drivingLicenseInfo && !isExpired && isAgeValid,
      isProfilePhotoVerified: !!userProfileInfo?.picture?.imageInfo?.secure_url,
      isLicenseFaceVerified: !!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url,
      isLicensePhotoVerified: !!userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url,
      isSecondaryIDVerified:
        !!userProfileInfo?.guestVerification?.secondaryIdInfo?.idType &&
        (!!userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate ? !isSecondaryIDExpired : true),
    };
    setGuestVerificationFlags(verificationFlags);
    let verificationStatusFlags = {
      isEmailApproved: verificationFlags?.isEmailVerified,
      isMobileApproved: verificationFlags?.isMobileVerified,
      isAddressApproved: verificationFlags?.isAddressVerified && userProfileInfo?.contactDetails?.status === 'approved',
      isLicenseApproved: verificationFlags?.isLicenseVerified && userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'approved',
      isProfilePhotoApproved: verificationFlags?.isProfilePhotoVerified && userProfileInfo?.picture?.status === 'approved',
      isLicenseFaceApproved:
        verificationFlags?.isLicenseFaceVerified && userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'approved',
      isLicensePhotoApproved:
        verificationFlags?.isLicensePhotoVerified &&
        userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'approved' &&
        // userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status === 'approved',
        (userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status !== undefined
          ? userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status === 'approved'
          : true),
      isSecondaryIDApproved: verificationFlags?.isSecondaryIDVerified && userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'approved',
    };
    setVerificationStatusFlags(verificationStatusFlags);
  }, [userProfileInfo]);
  // console.log(guestVerificationFlags?.isSecondaryIDVerified);
  const stepsArray = steps(guestVerificationFlags);
  const [activeStep, setActiveStep] = useState<number>(0);
  useEffect(() => {
    const completedSteps = stepsArray.filter((step, index) => (guestVerificationFlags as any)[step.verificationFlag]);
    setActiveStep(completedSteps.length);
  }, [guestVerificationFlags]);
  return (
    <div>
      {Object.values(verificationStatusFlags).some((value) => value === false) && (
        <Alert severity="info">{`Please follow these quick steps to verify your identity. Once you're verified, you don't have to do it again. Thank you for being a valued guest!`}</Alert>
      )}
      <Stepper activeStep={activeStep} orientation="vertical" connector={null}>
        {stepsArray.map((step, index) => (
          <Step key={index} completed={(guestVerificationFlags as any)[stepsArray[index].verificationFlag]} className="font-bold">
            {/* <div onClick={() => handleStepClick(index)}> */}
            <StepLabel>
              {cloneElement(step.label, {
                isPreviousStepVerified: index > 0 ? (guestVerificationFlags as any)[stepsArray[index - 1].verificationFlag] : true,
              })}
            </StepLabel>
            {/* <StepConnector style={{ display: 'none' }} /> */}
            {/* </div> */}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default VerificationSteps;
