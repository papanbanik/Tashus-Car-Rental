import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ContactDetailsProps } from '@/types/componentTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { useMediaQuery } from '@mui/material';
import PhoneVerModal from './PhoneVerModal';
import VerificationContainer from './VerificationContainer';

const PhoneVerification = ({ hideTitle, isPreviousStepVerified, onVerifyClick, phoneVerified }: ContactDetailsProps) => {
  const { userProfileInfo } = useUserCredContext();
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const isMediumScreen = useMediaQuery('(max-width:10240px)');
  const { openModal } = useModalContext();
  const isPhoneVerified = phoneVerified !== undefined ? phoneVerified : userProfileInfo?.verificationInfo?.phone?.isVerified || false;
  const handleVerifyPhone = async () => {
    if (onVerifyClick) {
      onVerifyClick();
    } else {
      openModal({
        title: 'Phone Verification',
        content: <PhoneVerModal />,
      });
    }
  };
  return (
    <VerificationContainer
      // isVerified={!!userProfileInfo?.verificationInfo?.phone?.number}
      // isVerified={userProfileInfo?.verificationInfo?.phone?.isVerified || false} //use after phone verification
      isVerified={isPhoneVerified}
      title={hideTitle ? '' : `${isMediumScreen ? 'Contact' : 'Contact Number'}`}
      toolTip={`Please add a contact phone number so we can contact you if needed. This will be use for verification and communication purpose. So ensure that you provide active phone number`}
      buttonTitle="Verify"
      handleOnClick={handleVerifyPhone}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
      buttonDisabled={
        isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)
      }
    ></VerificationContainer>
  );
};

export default PhoneVerification;
