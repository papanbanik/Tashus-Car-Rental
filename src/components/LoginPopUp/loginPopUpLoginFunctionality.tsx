'use client';

import { signUpMethods } from '@/utils/Lists/signUp';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'react-phone-input-2/lib/semantic-ui.css';

import { useUserCredContext } from '@/context/UserCredProvider';
import { useEmailChecker } from '@/hooks/useSignupValidation';
import { EmailRegistrationValues } from '@/types/signUpTypes';
import { Alert, Button, Divider, useMediaQuery, useTheme } from '@mui/material';
import { getProviders, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import EmailSignUp from '../SignUp/EmailSignUp';
import JoinModal from '../Verification/JoinModal';

const LoginPopUpLoginFunctionality = () => {
  const [activeMethod, setActiveMethod] = useState('email');
  const { setSocialProviders, signUpStep } = useUserCredContext();
  const { userCred } = useUserCredContext();

  const [isEmailExist, setIsEmailExist] = useState(false);
  // console.log('isEmailExist', isEmailExist);

  const { control, register, handleSubmit, watch, formState, reset } = useForm<EmailRegistrationValues>({
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isLoading: isEmailCheckerLoading, isFetching: isEmailCheckerFetching, refetch } = useEmailChecker(watch('email'));

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmaller = useMediaQuery('(max-width: 330px)');

  const isEmail = watch('email');
  // console.log('Email', isEmail);
  // console.log('handleSubmit', handleSubmit);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProviders();
        // console.log('Providers response:', response);
        setSocialProviders(response);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    })();
  }, []);

  const handleMethods = async (methodId: string) => {
    if (methodId === 'phone' || methodId === 'email') {
      setActiveMethod(methodId);
      return;
    }

    // if (methodId === 'google') {
    // console.log(methodId);
    await signIn(methodId);
    // }
  };

  // console.log('isEmailCheckerFetching', isEmailCheckerFetching);

  return (
    <>
      {userCred?.loggedIn && signUpStep?.current !== 'email-resend' && (
        <div className="w-full flex">
          <Alert className="bg-green-200 w-full" severity="success">
            You are already logged in
          </Alert>
        </div>
      )}
      {!userCred?.loggedIn && signUpStep?.current !== 'email-resend' && (
        <div className="flex flex-col w-full item ">
          <p className="text-start md:text-3xl text-2xl font-bold mt-0 m-0 p-0">
            Welcome to <span className="text-primary">Tashus!</span>
          </p>
          <p className="text-sm text-gray-400 text-start m-0 p-0 pb-6 mt-1">
            Log in now to access exclusive features, offer and personalized content.
          </p>

          {activeMethod === 'email' && <EmailSignUp setIsEmailExist={setIsEmailExist}></EmailSignUp>}
          {!isEmailExist ? (
            <>
              <Divider>or</Divider>
              <div className="grid gap-3 mt-4 place-items-center">
                {signUpMethods.map(
                  (method) =>
                    method.id !== activeMethod && (
                      <Button
                        variant="outlined"
                        key={method.id}
                        onClick={() => handleMethods(method.id)}
                        className="grid grid-cols-7 w-full p-0 border-2 border-secondary rounded-md place-items-center "
                      >
                        <div
                          className={`col-span-7 relative w-full ${
                            isSmaller ? 'text-xs' : 'text-base'
                          } text-center normal-case flex justify-center items-center`}
                        >
                          <div className="flex items-center">
                            <Image
                              src={method.logoSrc}
                              alt={`${method.id}-icon`}
                              width={isSmaller ? 18 : isSmall ? 20 : 30}
                              height={isSmaller ? 18 : isSmall ? 20 : 30}
                              className="mr-2"
                            ></Image>
                            <p style={{ marginLeft: '8px' }}>{`Continue with ${method.name}`}</p>
                          </div>
                        </div>
                      </Button>
                    )
                )}
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      )}
      {signUpStep?.current === 'email-resend' && <JoinModal></JoinModal>}
    </>
  );
};

export default LoginPopUpLoginFunctionality;
