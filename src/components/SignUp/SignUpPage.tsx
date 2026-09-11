'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import SignUp from './SignUp';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';

const SignUpPage = () => {
  const { userCred, setSignUpStep } = useUserCredContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');

  // useEffect(() => {
  //   if (userCred?.loggedIn && stepParam !== 'email-resend') {
  //     console.log('re');
  //     searchParams.get('return_url') ? router.push(`${searchParams.get('return_url')}`) : router.push('/');
  //   }
  // }, [userCred, stepParam]);

  useEffect(() => {
    if (stepParam === 'email' || !stepParam) {
      setSignUpStep({ previous: '', current: 'email' });
    } else if (stepParam === 'password') {
      setSignUpStep({ previous: 'email', current: 'password' });
    } else if (stepParam === 'info') {
      setSignUpStep({ previous: 'email', current: 'info' });
    } else if (stepParam === 'email-resend') {
      setSignUpStep({ previous: 'info', current: 'email-resend' });
    }
  }, [stepParam]);

  return (
    <div className="lg:flex mb-10 lg:mb-14 " style={{ minHeight: '88vh' }}>
      <div className="lg:w-3/5 md:w-full w-full relative">
        <Image
          src="/Images/Tashus-login-3.png"
          alt="Tashus - Login Image"
          layout="fill"
          objectFit="cover"
          objectPosition="bottom center"
          className="rounded-lg"
        />
      </div>

      <div className="lg:w-2/5 md:w-full w-full flex lg:mr-16 ml-0 lg:ml-8 lg:py-14">
        <div className="md:p-10 mx-2 lg:mx-0 px-3 py-4 rounded-lg border-gray-400 w-full h-full" style={{ border: '1px solid red', width: '100%' }}>
          <Typography variant="h1" className="text-center text-xl font-bold mt-0">
            {'Login or Sign Up'}
            <span className="text-success">_</span>
          </Typography>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
