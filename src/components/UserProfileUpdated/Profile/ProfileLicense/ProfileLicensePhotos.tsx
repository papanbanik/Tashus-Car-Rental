import CommonImageCard from '@/components/Common/CommonImageCard';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';

const ProfileLicensePhotos = () => {
  // const { verificationFieldFlags } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const verificationFieldFlags =
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const licenseFrontPhotoMessage =
    userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.status !== 'resubmitted' && verificationFieldFlags?.isDLPhotoIncorrect
      ? 'Please update your license front photo to meet the platform guidelines.'
      : '';
  const licenseBackPhotoMessage =
    userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.status !== 'resubmitted' &&
    verificationFieldFlags?.isDLBackPhotoIncorrect
      ? 'Please update your license back photo to meet the platform guidelines.'
      : '';
  return (
    <div className="w-full md:pl-4">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <CommonImageCard
            imageSrc={userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url}
            width={200}
            height={120}
            divClassNames={`w-[200px] relative rounded-lg flex group mt-4`}
            title="License Front Side"
            titleClassNames="text-sm font-bold"
            showChip={!!userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url}
            badgeStatus={userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.status}
            message={licenseFrontPhotoMessage}
          />
        </div>
        <div className="w-full">
          <CommonImageCard
            imageSrc={userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url}
            width={200}
            height={120}
            divClassNames={`w-[200px] relative rounded-lg flex group mt-4`}
            title="License Back Side"
            titleClassNames="text-sm font-bold"
            showChip={!!userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url}
            badgeStatus={userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.status}
            message={licenseBackPhotoMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileLicensePhotos;
