import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import LicenseSelfieVerModal from './LicenseSelfieVerModal';
import VerificationContainer from './VerificationContainer';

export interface ILicenseSelfieVerification {
  isPreviousStepVerified?: boolean;
}
const LicenseSelfieVerification = ({ isPreviousStepVerified }: ILicenseSelfieVerification) => {
  const { userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const handleVerifyLicenseSelfie = () => {
    openModal({
      title: 'Selfie With License',
      content: <LicenseSelfieVerModal></LicenseSelfieVerModal>,
    });
  };
  // console.log(userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status);
  const is30minsOver = isTimeExpired(userProfileInfo?.guestVerification?.drivingLicenseWithFace?.createdAt);
  const not30minsOver = !!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.createdAt && !is30minsOver;
  return (
    <VerificationContainer
      isStatusError={userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'declined'}
      // isVerified={!!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.valid}
      isVerified={
        ((is30minsOver && userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'pending') ||
          userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url
      }
      isNotDisabledData={not30minsOver && userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'pending'}
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status || 'pending', showTooltip: true }}
      // isVerified={!!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url}
      title={`${isSmallScreen ? 'Selfie With DL' : 'Selfie With License'}`}
      // title={`${isSmallScreen ? 'With License' : 'Selfie With License'}`}
      // toolTip={`Take a selfie photograph of yourself smiling and holding your driver's license up for verification matching your profile photo.`}
      toolTip={`Capture a selfie of yourself smiling while holding up your driver's license for verification, ensuring it matches your profile photo.`}
      // buttonTitle={`${isSmallScreen ? `${not30minsOver ? 'Edit' : 'Upload'}` : `${not30minsOver ? 'Edit Photo' : 'Upload Photo'}`}`}
      buttonTitle={`${not30minsOver ? 'Edit' : 'Upload'}`}
      handleOnClick={handleVerifyLicenseSelfie}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    ></VerificationContainer>
  );
};

export default LicenseSelfieVerification;
