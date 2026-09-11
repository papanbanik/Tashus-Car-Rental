import CommonImageCard from '@/components/Common/CommonImageCard';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';

const ProfileLicenseSelfie = () => {
  // const { verificationFieldFlags } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const verificationFieldFlags =
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const licenseSelfieMessage =
    userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status !== 'resubmitted' && verificationFieldFlags?.isDLSelfieIncorrect
      ? 'Please update your license with selfie to meet the platform guidelines.'
      : '';
  return (
    <div className="my-4">
      <CommonImageCard
        imageSrc={userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url || ''}
        width={!!userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url ? 271 : 200}
        height={!!userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url ? 158 : 120}
        divClassNames={`w-[271px] relative rounded-lg flex group mt-4`}
        title="Selfie with License"
        titleClassNames="text-sm font-bold"
        showChip={!!userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url}
        badgeStatus={userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status}
        message={licenseSelfieMessage}
      />
    </div>
  );
};

export default ProfileLicenseSelfie;
