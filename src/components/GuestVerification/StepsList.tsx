'use client';
import { TGuestVerificationFlags } from '@/context/SearchProvider';
import DriverLicenseVerification from '../Search/ReservationCheckout/Verification/DrivingLicensePhoto/DriverLicenseVerification';
import EmailVerification from '../Search/ReservationCheckout/Verification/EmailVerification';
import LicenseVerification from '../Search/ReservationCheckout/Verification/LicenseNumVerification/LicenseVerification';
import LicenseSelfieVerification from '../Search/ReservationCheckout/Verification/LicenseSelfieVerification';
import PhoneVerification from '../Search/ReservationCheckout/Verification/PhoneVerification';
import ProfilePicVerification from '../Search/ReservationCheckout/Verification/ProfilePicVerification';
import ResidentialVerification from '../Search/ReservationCheckout/Verification/ResidentialAddress/ResidentialVerification';
import SecondaryPhotoIDVerification from '../Search/ReservationCheckout/Verification/SecondaryID/SecondaryPhotoIDVerification';
export const steps = (guestVerificationFlags: TGuestVerificationFlags) => [
  {
    label: <EmailVerification isPreviousStepVerified={guestVerificationFlags?.isEmailVerified} />,
    verificationFlag: 'isEmailVerified',
  },
  {
    label: <PhoneVerification isPreviousStepVerified={guestVerificationFlags?.isMobileVerified} />,
    verificationFlag: 'isMobileVerified',
  },
  {
    label: <ResidentialVerification isPreviousStepVerified={guestVerificationFlags?.isAddressVerified} />,
    verificationFlag: 'isAddressVerified',
  },
  {
    label: <ProfilePicVerification isPreviousStepVerified={guestVerificationFlags?.isProfilePhotoVerified} />,
    verificationFlag: 'isProfilePhotoVerified',
  },
  {
    label: <LicenseVerification isPreviousStepVerified={guestVerificationFlags?.isLicenseVerified} />,
    verificationFlag: 'isLicenseVerified',
  },
  {
    label: <DriverLicenseVerification isPreviousStepVerified={guestVerificationFlags?.isLicensePhotoVerified} />,
    verificationFlag: 'isLicensePhotoVerified',
  },
  {
    label: <LicenseSelfieVerification isPreviousStepVerified={guestVerificationFlags?.isLicenseFaceVerified} />,
    verificationFlag: 'isLicenseFaceVerified',
  },
  {
    label: <SecondaryPhotoIDVerification isPreviousStepVerified={guestVerificationFlags?.isSecondaryIDVerified} />,
    verificationFlag: 'isSecondaryIDVerified',
  },
];
