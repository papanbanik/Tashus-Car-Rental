import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { isDrivingAgeValid, isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import Divider from '@mui/material/Divider/Divider';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import AdditionalDriver from './AdditionalDriver/AdditionalDriver';
import DriverLicenseVerification from './DrivingLicensePhoto/DriverLicenseVerification';
import EmailVerification from './EmailVerification';
import LicenseNumVerification from './LicenseNumVerification';
import LicenseSelfieVerification from './LicenseSelfieVerification';
import PhoneVerification from './PhoneVerification';
import ProfilePicVerification from './ProfilePicVerification';
import SecondaryPhotoIDVerification from './SecondaryID/SecondaryPhotoIDVerification';

const VerificationOptions = () => {
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
      <p className="md:text-3xl text-2xl font-bold mt-0 mb-2">
        {carData?.car?.make} {carData?.car?.model} {carData?.car?.year}
      </p>
      <Divider className="my-2" />

      {reservationInfo?.pickupTime && reservationInfo?.returnTime && (
        <>
          <div className="grid grid-cols-12">
            <p className="col-span-4 m-0">Pickup Time</p>
            <p className="col-span-8 m-0 flex justify-end items-center">
              <span>{dayjs(reservationInfo?.pickupTime).format('DD MMM YYYY')}</span>
              <span className="mx-2">{'|'}</span>
              <span>{dayjs(reservationInfo?.pickupTime).format('h:mm A')}</span>
            </p>
          </div>
          <Divider className="my-2" />

          <div className="grid grid-cols-12">
            <p className="col-span-4 m-0">Return Time</p>
            <p className="col-span-8 m-0 flex justify-end items-center">
              <span>{dayjs(reservationInfo?.returnTime).format('DD MMM YYYY')}</span>
              <span className="mx-2">{'|'}</span>
              <span>{dayjs(reservationInfo?.returnTime).format('h:mm A')}</span>
            </p>
          </div>
          <Divider className="my-2" />
        </>
      )}
      <EmailVerification></EmailVerification>
      <Divider className="my-2" />

      <PhoneVerification></PhoneVerification>
      <Divider className="my-2" />

      <ProfilePicVerification></ProfilePicVerification>
      <Divider className="my-2" />

      <LicenseNumVerification returnDate={reservationInfo?.returnTime}></LicenseNumVerification>
      <Divider className="my-2" />

      <DriverLicenseVerification></DriverLicenseVerification>
      <Divider className="my-2" />

      <LicenseSelfieVerification></LicenseSelfieVerification>
      <Divider className="my-2" />

      <SecondaryPhotoIDVerification></SecondaryPhotoIDVerification>
      <Divider className="my-2" />

      <AdditionalDriver></AdditionalDriver>
    </div>
  );
};

export default VerificationOptions;
