import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useResendEmail } from '@/hooks/guest-verification/useResendEmail';
import { Button } from '@mui/material';
import Image from 'next/image';

const EmailVerModal = () => {
  const { userCred } = useUserCredContext();
  const { mutateAsync, isLoading } = useResendEmail();
  const { closeModal } = useModalContext();
  const sendVerificationEmail = async () => {
    try {
      const { userId, email } = userCred;
      await mutateAsync({ userId, email });
      closeModal();
    } catch (error) {
      console.log('sendVerificationEmail', error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <Image src="/Verification/Email.svg" alt="Picture" width={200} height={200} />
      <p className="text-center">
        {`You're almost there! Click the button below to send a verification email to `}
        <span className="text-primary">{userCred?.email}</span>. {`Make sure to verify your email to complete the verification.`}
      </p>
      <Button className="normal-case" onClick={sendVerificationEmail} variant="contained" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
    </div>
  );
};

export default EmailVerModal;
