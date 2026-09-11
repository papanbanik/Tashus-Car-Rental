'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { useResendEmail } from '../../hooks/guest-verification/useResendEmail';
import { ResendEmailValues } from '../../types/user-verification/ResendEmail';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const JoinModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync, isLoading } = useResendEmail();
  const { userType } = useUserCredContext();
  const {
    userCred: { userId, email },
  } = useUserCredContext();
  const [timeLeft, setTimeLeft] = useState(8); // Countdown timer state

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 800);

    if (timeLeft === 0) {
      clearInterval(timer);
      if (pathname === '/login') {
        router.push('/?from=registered');
      } else {
        userType === 'partner' ? router.push('/on-boarding/verification') : userType === 'guest-booking' ? '' : router.push('/');
      }
    }

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const resendEmail: SubmitHandler<ResendEmailValues> = async (data) => {
    try {
      const { userId, email } = data;
      await mutateAsync({ userId, email });
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-md relative">
      <div className="flex flex-col items-center">
        <Image src="/Verification/Email.svg" alt="Picture" width={200} height={200} />
        <span className="text-md md:text-xl lg:text-3xl font-bold my-4 text-center">Email Confirmation</span>
        <span className="text-gray-600 text-center mb-8">
          We have sent an email to <span className="text-primary">{email}</span> to confirm the validity of your email. After receiving the email,
          please verify it to join us. If you did not receive the email{' '}
          <Link href="#" onClick={() => resendEmail({ userId, email })} className={`no-underline ${isLoading ? 'text-gray-500' : 'text-primary'}`}>
            {isLoading ? 'Resending...' : 'Resend confirmation Email'}
          </Link>
        </span>

        {/* Countdown Timer */}

        {pathname === '/login' && (
          <div className="relative bottom-4 mx-auto bg-gray-200 px-6 py-2 rounded-full shadow-md">
            <span className="text-gray-800 font-medium">
              Redirecting in {timeLeft} second{timeLeft !== 1 ? 's' : ''}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinModal;
