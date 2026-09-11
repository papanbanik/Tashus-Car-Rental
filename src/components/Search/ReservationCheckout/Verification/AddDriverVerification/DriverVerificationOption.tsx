import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { isDrivingAgeValid, isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import Divider from '@mui/material/Divider/Divider';
import { useEffect } from 'react';
import DriverLicenseVerification from '../DrivingLicensePhoto/DriverLicenseVerification';
import EmailVerification from '../EmailVerification';
import LicenseNumVerification from '../LicenseNumVerification';
import PhoneVerification from '../PhoneVerification';
import SecondaryPhotoIDVerification from '../SecondaryID/SecondaryPhotoIDVerification';

const DriverVerificationOptions = () => {
  const { carData } = useCarListingContext();
  const { reservationInfo, setGuestVerificationFlags } = useSearchContext();
  const { userProfileInfo } = useUserCredContext();
  // console.log(userProfileInfo);
  useEffect(() => {
    let isExpired = false;

    if (userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate) {
      isExpired = isLicenseExpired(userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate);
    }

    let isAgeValid = false;

    if (userProfileInfo?.dateOfBirth) {
      isAgeValid = isDrivingAgeValid(userProfileInfo?.dateOfBirth);
    }

    let verificationFlags = {
      isEmailVerified: userProfileInfo?.verificationInfo?.email?.isVerified || false,
      isMobileVerified: !!userProfileInfo?.verificationInfo?.phone?.number,
      isAddressVerified: !!userProfileInfo?.contactDetails?.residentialAddress,
      // isMobileVerified: true,
      isLicenseVerified: !!userProfileInfo?.guestVerification?.drivingLicenseInfo && !isExpired && isAgeValid,
      isProfilePhotoVerified: !!userProfileInfo?.picture?.imageInfo?.secure_url,
      isLicenseFaceVerified: !!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.valid,
      //Additional add
      isLicensePhotoVerified: !!userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url,
      isSecondaryIDVerified: !!userProfileInfo?.guestVerification?.secondaryIdInfo?.idType,
    };
    setGuestVerificationFlags(verificationFlags);
  }, [userProfileInfo]);

  return (
    <div>
      <EmailVerification></EmailVerification>
      <Divider className="my-2" />

      <PhoneVerification></PhoneVerification>
      <Divider className="my-2" />

      <LicenseNumVerification returnDate={reservationInfo?.returnTime}></LicenseNumVerification>
      <Divider className="my-2" />

      <DriverLicenseVerification></DriverLicenseVerification>
      <Divider className="my-2" />

      <SecondaryPhotoIDVerification></SecondaryPhotoIDVerification>
    </div>
  );
};

export default DriverVerificationOptions;
