import PhoneVerModal from '@/components/Search/ReservationCheckout/Verification/PhoneVerModal';
import VerificationContainer from '@/components/Search/ReservationCheckout/Verification/VerificationContainer';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ContactDetailsProps } from '@/types/componentTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { useMediaQuery } from '@mui/material';

const ContactVerificationButton = ({ hideTitle, isPreviousStepVerified, onVerifyClick, phoneVerified }: ContactDetailsProps) => {
  const { userProfileInfo } = useUserCredContext();
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const isMediumScreen = useMediaQuery('(max-width:1024px)');
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
      isVerified={isPhoneVerified}
      title={hideTitle ? '' : `${isMediumScreen ? 'Contact' : 'Contact Number'}`}
      buttonTitle="Verify"
      handleOnClick={handleVerifyPhone}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
      buttonDisabled={
        isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)
      }
    ></VerificationContainer>
  );
};

export default ContactVerificationButton;
