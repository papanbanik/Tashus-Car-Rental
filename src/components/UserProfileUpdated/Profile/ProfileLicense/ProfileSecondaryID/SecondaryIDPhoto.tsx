import CommonImageCard from '@/components/Common/CommonImageCard';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';

const SecondaryIDPhoto = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const verificationFieldFlags =
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const secondaryIDMessage =
    userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status !== 'resubmitted' && verificationFieldFlags?.isSecondaryIdPhotoIncorrect
      ? `Please update your ${
          userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'PassportId' ? 'passport' : 'secondary'
        } photo to meet the platform guidelines.`
      : '';
  return (
    <div className="w-full pl-4">
      <CommonImageCard
        imageSrc={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url}
        width={200}
        height={120}
        divClassNames={`w-[200px] relative rounded-lg flex group mt-4`}
        title={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType === 'PassportId' ? 'Passport Photo' : 'Secondary ID Photo'}
        titleClassNames="text-sm font-bold"
        showChip={!!userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url}
        badgeStatus={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status}
        message={secondaryIDMessage}
      />
    </div>
  );
};

export default SecondaryIDPhoto;
