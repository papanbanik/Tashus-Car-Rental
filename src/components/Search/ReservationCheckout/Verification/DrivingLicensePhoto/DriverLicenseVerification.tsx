'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import VerificationContainer from '../VerificationContainer';
import DriverLicenseVerModal from './DriverLicenseVerModal';
export interface DriverLIcenseVerificationProps {
  isPreviousStepVerified?: boolean;
}
const DriverLicenseVerification = ({ isPreviousStepVerified }: DriverLIcenseVerificationProps) => {
  const { userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const handleVerifyDriverLicense = () => {
    openModal({
      title: 'Driver License Photo',
      content: <DriverLicenseVerModal></DriverLicenseVerModal>,
    });
  };
  // console.log(userProfileInfo);
  // console.log(userProfileInfo?.guestVerification);
  // console.log(userProfileInfo?.guestVerification?.drivingLicensePhoto);
  // console.log(userProfileInfo?.guestVerification?.drivingLicensePhoto?.status);
  // console.log(!!userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url);
  // console.log(userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url);
  const is30minsOver = isTimeExpired(userProfileInfo?.guestVerification?.drivingLicensePhoto?.createdAt);
  const not30minsOver = !!userProfileInfo?.guestVerification?.drivingLicensePhoto?.createdAt && !is30minsOver;
  return (
    <VerificationContainer
      isStatusError={
        userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'declined' ||
        userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status === 'declined'
      }
      isVerified={
        ((is30minsOver && userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'pending') ||
          userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url
      }
      isNotDisabledData={not30minsOver && userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'pending'}
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.drivingLicensePhoto?.status || 'pending', showTooltip: true }}
      // title={`${isSmallScreen ? 'License Photo' : 'Driver License Photo'}`}
      title={`License Photo`}
      // toolTip={`Take a photo of yourself holding your driver's license up to the camera for added verification of your identity`}
      toolTip={`Kindly submit a clear and readable image of your driver's license for identity verification. Your cooperation is greatly appreciated.`}
      // buttonTitle={`${isSmallScreen ? 'Upload' : 'Upload Photo'}`}
      // buttonTitle={`${isSmallScreen ? `${!is30minsOver ? 'Edit' : 'Upload'}` : `${!is30minsOver ? 'Edit Photo' : 'Upload Photo'}`}`}
      buttonTitle={`${not30minsOver ? 'Edit' : 'Upload'}`}
      handleOnClick={handleVerifyDriverLicense}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    ></VerificationContainer>
  );
};

export default DriverLicenseVerification;
