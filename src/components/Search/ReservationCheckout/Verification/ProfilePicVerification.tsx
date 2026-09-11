import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useMediaQuery } from '@mui/material';
import ProfilePicVerModal from './ProfilePicVerModal';
import VerificationContainer from './VerificationContainer';
export interface ProfilePicVerificationProps {
  isPreviousStepVerified?: boolean;
}
const ProfilePicVerification = ({ isPreviousStepVerified }: ProfilePicVerificationProps) => {
  const { userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const handleVerifyProfilePhoto = () => {
    openModal({
      title: 'Profile Photo Verification',
      content: <ProfilePicVerModal></ProfilePicVerModal>,
    });
  };
  // const isDeclined = userProfileInfo?.picture?.status === 'declined';
  // console.log(userProfileInfo?.picture?.status);
  // console.log(isDeclined);
  return (
    <VerificationContainer
      isStatusError={userProfileInfo?.picture?.status === 'declined'}
      // isVerified={!!userProfileInfo?.picture?.imageInfo?.secure_url}
      isVerified={
        (userProfileInfo?.picture?.status === 'pending' || userProfileInfo?.picture?.status === 'approved') &&
        !!userProfileInfo?.picture?.imageInfo?.secure_url
      }
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.picture?.status || 'pending', showTooltip: true }}
      title="Profile Photo"
      toolTip={`Add a clear profile photo so others know who they are interacting with on the platform. Keep it appropriate and work-related`}
      // buttonTitle={`${isSmallScreen ? 'Upload' : 'Upload Photo'}`}
      buttonTitle={'Upload'}
      handleOnClick={handleVerifyProfilePhoto}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    ></VerificationContainer>
  );
};

export default ProfilePicVerification;
