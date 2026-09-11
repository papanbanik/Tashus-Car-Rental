import SignUp from '@/components/SignUp/SignUp';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ContactDetailsProps } from '@/types/componentTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import EmailVerModal from './EmailVerModal';
import VerificationContainer from './VerificationContainer';

const EmailVerification = ({ hideTitle, isPreviousStepVerified }: ContactDetailsProps) => {
  const { userProfileInfo, userCred } = useUserCredContext();
  const { openModal } = useModalContext();
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const handleVerifyEmail = () => {
    userCred.loggedIn
      ? openModal({
          title: 'Email Verification',
          content: <EmailVerModal></EmailVerModal>,
        })
      : openModal({
          title: 'Login or Sign Up',
          content: (
            <div className="md:mx-4 md:my-2">
              <SignUp></SignUp>
            </div>
          ),
        });
  };

  return (
    <VerificationContainer
      isVerified={userProfileInfo?.verificationInfo?.email?.isVerified || false}
      title={hideTitle ? '' : 'Email'}
      toolTip={`Verifying your email is an important security step. It ensures that no one can create an account using someone else's email without their knowledge. Once verified, you'll be able to access your account anytime from any device. If you did not receive the verification email, please check your spam/junk folders.`}
      buttonTitle="Verify"
      handleOnClick={handleVerifyEmail}
      verifiedData={userCred?.email}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
      buttonDisabled={
        isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)
      }
    ></VerificationContainer>
  );
};

export default EmailVerification;
