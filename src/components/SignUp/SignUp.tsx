'use client';

import 'react-phone-input-2/lib/semantic-ui.css';
import Image from 'next/image';
import { signUpMethods } from '@/utils/Lists/signUp';
import { useEffect, useState } from 'react';
import EmailSignUp from './EmailSignUp';
import { Alert, Button, Divider, useMediaQuery, useTheme } from '@mui/material';
import { signIn, getProviders } from 'next-auth/react';
import { useUserCredContext } from '@/context/UserCredProvider';
import JoinModal from '../Verification/JoinModal';
import { usePathname } from 'next/navigation';

const SignUp = () => {
  const [activeMethod, setActiveMethod] = useState('email');
  const { setSocialProviders, signUpStep } = useUserCredContext();
  const { userCred } = useUserCredContext();
  const pathname = usePathname(); // Get the current pathname
  const [isFirstRender, setIsFirstRender] = useState(true);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmaller = useMediaQuery('(max-width: 330px)');

  useEffect(() => {
    (async () => {
      try {
        const response = await getProviders();
        setSocialProviders(response);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    })();
  }, []);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const handleMethods = async (methodId: string) => {
    if (methodId === 'phone' || methodId === 'email') {
      setActiveMethod(methodId);
      return;
    }

    const response = await signIn(methodId);
    console.log('response', response);
  };

  return (
    <>
      {!userCred?.loggedIn && signUpStep?.current !== 'email-resend' && (
        <div className="flex flex-col w-full">
          <p className="text-center md:text-3xl text-2xl font-bold mt-0">
            Welcome to <span className="text-primary">Tashus</span>
          </p>
          {activeMethod === 'email' && <EmailSignUp />}
          <Divider>or</Divider>
          <div className="grid gap-3 mt-4 place-items-center">
            {signUpMethods.map(
              (method) =>
                method.id !== activeMethod && (
                  <Button
                    variant="outlined"
                    key={method.id}
                    onClick={() => handleMethods(method.id)}
                    className="grid grid-cols-7 w-full p-0 border-2 border-secondary rounded-md place-items-center"
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
                        />
                        <p style={{ marginLeft: '8px' }}>{`Continue with ${method.name}`}</p>
                      </div>
                    </div>
                  </Button>
                )
            )}
          </div>
        </div>
      )}
      {signUpStep?.current === 'email-resend' && <JoinModal />}
      {userCred?.loggedIn && signUpStep?.current !== 'email-resend' && pathname === '/login' && !isFirstRender && (
        <div className="w-full flex">
          <Alert className="bg-green-200 w-full" severity="success">
            You are already logged in
          </Alert>
        </div>
      )}
    </>
  );
};

export default SignUp;
