'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import SignUp from './SignUp';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';

const SignUpPageNew = () => {
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
    <div className="relative h-screen top-[-50px] lg:top-0 ">
      <div className="absolute inset-0 ">
        <Image
          src="/Images/new/login.webp"
          alt="Tashus - Login Image"
          layout="fill"
          objectFit="cover"
          objectPosition="bottom center"
          className="rounded-lg"
        />

        <div
          className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-xs"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        ></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center lg:justify-start  xl:px-52 lg:px-32 md:px-24 px-4 py-4 max-w-[1600px] mx-auto ">
        <div className="p-3 sm:p-4 lg:p-10 bg-white shadow-xl rounded-lg lg:w-[450px] w-full">
          <h1 className="text-center text-xl font-bold mt-0">
            {'Login or Sign Up'}
            <span className="text-success">_</span>
          </h1>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default SignUpPageNew;
