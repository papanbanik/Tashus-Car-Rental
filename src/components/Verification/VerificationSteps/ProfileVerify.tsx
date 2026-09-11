import ExpandableHelpingBox from '@/components/Common/Verification/CombineSection';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { getRequestVerificationMessages } from '@/utils/Functions/verification/verificationFn';
import { getIndividualVerificationCompleteState, getUpdatedUrl } from '@/utils/Functions/verification/verificationStepsFn';
import { profileHelpingData } from '@/utils/Lists/verificationStepList';
import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';
import ProfileInfoVerify from './Profile/ProfileInfoVerify';
import ProfilePhotoVerify from './Profile/ProfilePhotoVerify';

const ProfileVerify = () => {
  const { handleSaveCurrentVerificationStep, updateCurrentVerificationStep, userProfileVerificationInfo } = useProfileInfoContext();
  const router = useRouter();
  const pathname = usePathname();
  const { isProfileStepComplete } = getIndividualVerificationCompleteState(userProfileVerificationInfo);

  const handleNext = () => {
    if (isProfileStepComplete) {
      handleSaveCurrentVerificationStep(1);
    }
    updateCurrentVerificationStep(2);
    // const queryParams = new URLSearchParams({ step: 'license' }).toString();
    // const url = `${pathname}?${queryParams}`;
    // router.push(url);
    router.push(getUpdatedUrl(pathname, 'license'));
  };
  const { profileMessage } = getRequestVerificationMessages(userProfileVerificationInfo);
  return (
    <div>
      {/* <CommonVerificationStatus status={statusText ?? 'incomplete'} text="Add your profile information to complete your verification process" /> */}
      <ExpandableHelpingBox
        title="Profile"
        helpingBoxes={profileHelpingData}
        isNotExpand={true}
        showStatus={!!userProfileVerificationInfo?.profileInfo?.picture?.status}
        status={userProfileVerificationInfo?.profileInfo?.picture?.status}
        helpingText="Please note that your profile picture is public. Do not upload sensitive documents, such as licenses or other personal identification, as your profile picture."
        message={profileMessage}
        isMandatory={userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isProfilePhotoRequired ?? false}
      >
        <ProfilePhotoVerify />
        <div className="my-4">
          <ProfileInfoVerify />
        </div>
      </ExpandableHelpingBox>
      {/* <div className="flex justify-end w-full lg:w-2/3"> */}
      <Button
        variant="contained"
        endIcon={<FaArrowRight />}
        className="normal-case"
        // disabled={!isProfileStepComplete}
        onClick={handleNext}
      >
        Next
      </Button>
      {/* </div> */}
    </div>
  );
};

export default ProfileVerify;
