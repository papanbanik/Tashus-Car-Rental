import ProfileStatus from '@/components/Common/Verification/ProfileStatus';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { DVerificationFieldFlags, getFormattedIdType } from '@/utils/Functions/verification/verificationFn';
import { Chip } from '@mui/material';
import dayjs from 'dayjs';

const SecondaryIDInfo = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const verificationFieldFlags =
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const isIDExpired =
    dayjs(userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.expiryDate).isBefore(dayjs(), 'date') ||
    dayjs(userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.expiryDate).isSame(dayjs(), 'date');
  const secondaryIDMessage =
    userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status !== 'resubmitted' && verificationFieldFlags?.isSecondaryIdIncorrect
      ? `Please update your ${
          userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'PassportId' ? 'passport' : 'secondary'
        } info to meet the platform guidelines.`
      : '';
  return (
    <div className="w-full">
      <ProfileStatus
        title={`${
          userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'PassportId' ? 'Passport' : 'Secondary ID'
        }  Information`}
        status={
          !!userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType
            ? userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status || ''
            : 'incomplete'
        }
        message={secondaryIDMessage}
      />
      <span className="text-sm font-bold"></span>
      <div className="grid grid-cols-1 mt-4">
        {/* ID Type */}
        {userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType && (
          <div className="grid grid-cols-2 text-sm my-1">
            <span>ID Type</span>
            <span>{getFormattedIdType(userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType)}</span>
          </div>
        )}
        {/* Other ID */}
        {userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'Other' && (
          <>
            <div className="grid grid-cols-2 text-sm my-1">
              <span>Other ID Type</span>
              <span>{userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.otherTypeName}</span>
            </div>
            <div className="grid grid-cols-2 text-sm my-1">
              <span>Issuing Authority</span>
              <span>{userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.issuingAuthority}</span>
            </div>
          </>
        )}
        {/* Institution Name */}
        {userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'StudentId' && (
          <div className="grid grid-cols-2 text-sm my-1">
            <span>Institution Name</span>
            <span>{userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.institutionName}</span>
          </div>
        )}
        {/* ID Number */}
        <div className="grid grid-cols-2 text-sm my-1">
          <span>ID Number</span>
          <span className="capitalize">{userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idNumber}</span>
        </div>
        {/* Country */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Country</span>
          <span>{userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.country}</span>
        </div>
        {/* Expiry Date */}
        {userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.expiryDate && (
          <div className="grid grid-cols-2 text-sm gap-2 my-1">
            <span>{'Expiry Date'}</span>
            <div className="flex flex-col">
              <span className={`${isIDExpired ? 'text-error' : ''}`}>
                {new Date(userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.expiryDate)?.toLocaleDateString('en-AU')}
              </span>
              {isIDExpired && (
                <div className="flex justify-start items-start">
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

export default SecondaryIDInfo;
