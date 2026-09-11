import ProfileStatus from '@/components/Common/Verification/ProfileStatus';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { isDrivingAgeValid } from '@/utils/Functions/dateTimeCommonFn';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';
import { Chip } from '@mui/material';
import dayjs from 'dayjs';

const ProfileLicenseInfo = () => {
  // const { verificationFieldFlags } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const verificationFieldFlags =
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const isLicenseExpired =
    dayjs(userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.expiryDate).isBefore(dayjs(), 'date') ||
    dayjs(userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.expiryDate).isSame(dayjs(), 'date');
  const isAgeValid = userProfileVerificationInfo?.profileInfo?.dateOfBirth
    ? isDrivingAgeValid(userProfileVerificationInfo?.profileInfo?.dateOfBirth)
    : true;
  const licenseInfoMessage =
    userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.status !== 'resubmitted' && verificationFieldFlags?.isDLInfoIncorrect
      ? 'Please update your license info to meet the platform guidelines.'
      : '';

  return (
    <div className="w-full">
      <ProfileStatus
        title="License Information"
        status={
          !!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country
            ? userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.status || ''
            : 'incomplete'
        }
        message={licenseInfoMessage}
      />
      <div className="grid grid-cols-1 mt-4">
        {/* License Name */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>License Name</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.licenseName
              ? userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.licenseName
              : 'Not Added'}
          </span>
        </div>
        {/* Gender */}
        {!!userProfileVerificationInfo?.profileInfo?.gender && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>Gender</span>
            <span className="capitalize">{userProfileVerificationInfo?.profileInfo?.gender}</span>
          </div>
        )}
        {/*License Number*/}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>License Number</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.licenseNumber
              ? userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.licenseNumber
              : 'Not Added'}
          </span>
        </div>
        {/* Date of Birth */}
        {!!userProfileVerificationInfo?.profileInfo?.dateOfBirth && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>Birth Date</span>
            <span className={`${!isAgeValid ? 'text-error' : ''}`}>
              {new Date(userProfileVerificationInfo?.profileInfo?.dateOfBirth)?.toLocaleDateString('en-AU')}
              {!isAgeValid && (
                <div className="flex justify-start items-start">
                  <Chip color="error" size="small" variant="outlined" label="Invalid Age" />
                </div>
              )}
            </span>
          </div>
        )}
        {/* Country */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Country</span>
          <span>{userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country}</span>
        </div>
        {/* State */}
        {!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.state && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>{'State'}</span>
            <span>{userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.state}</span>
          </div>
        )}
        {/* Expiry Date */}
        {!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.expiryDate && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>{'Expiry Date'}</span>
            <div className="flex flex-col">
              <span className={`${isLicenseExpired ? 'text-error' : ''}`}>
                {new Date(userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.expiryDate)?.toLocaleDateString('en-AU')}
              </span>
              {isLicenseExpired && (
                <div className="flex justify-start items-start my-1">
                  <Chip color="error" size="small" variant="outlined" label="Expired"></Chip>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLicenseInfo;
