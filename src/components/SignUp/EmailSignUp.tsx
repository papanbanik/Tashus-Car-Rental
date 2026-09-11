'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useEmailChecker, useLoginValidation } from '@/hooks/useSignupValidation';
import { EmailRegistrationValues } from '@/types/signUpTypes';
import { Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CommonForm from '../Common/CommonForm';
import PasswordField from '../Common/HookFormFields/PasswordField';
import GeneralInfo from './GeneralInfo';

interface EmailSignUpProps {
  setIsEmailExist?: (value: boolean) => void;
}
const EmailSignUp: React.FC<EmailSignUpProps> = ({ setIsEmailExist }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { control, register, handleSubmit, watch, formState, reset } = useForm<EmailRegistrationValues>({
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isValid } = formState;

  const { isLoading: isEmailCheckerLoading, isFetching: isEmailCheckerFetching, refetch } = useEmailChecker(watch('email'));
  const {
    refetch: validateLogin,
    isError,
    error,
    isFetching: isLoginValidationFetching,
    data,
  } = useLoginValidation(watch('email'), watch('password'));
  const { setUserCred, validPassword, signUpStep, setSignUpStep, setValidPassword, userProfileInfo } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { setVerificationAlertMessage, verificationAlertMessage } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();
  const { current, previous } = signUpStep;

  useEffect(() => {
    const { email } = JSON.parse(localStorage.getItem('tashus') || '{}');
    if (email) {
      reset({ email: email });
    } else {
      reset();
    }
    // reset();
    setSignUpStep({ previous: '', current: 'email' });
  }, [reset]);

  useEffect(() => {
    setValidPassword(true);
  }, []);

  const checkUserEmail = async (email: string): Promise<any> => {
    try {
      await refetch(); //enable the 'user-emails' query
      const updatedData = queryClient.getQueryData(['user-emails', email]);
      const { status, data: response }: any = updatedData ?? {};

      if (status === 200 && typeof window !== 'undefined' && response?.signInMethod === 'email') {
        const { isNew, userId } = response ?? {};
        // console.log('isNew', isNew);
        const userData = { userId, email, loggedIn: false, isAllowListing: userProfileInfo?.isAllowListing || false };
        localStorage.setItem('tashus', JSON.stringify(userData));
        setUserCred(userData);

        if (pathName === '/login') {
          const returnUrl = searchParams.get('return_url') ? `return_url=${searchParams.get('return_url')}&` : '';
          const nextStep = isNew ? 'step=info' : 'step=password';
          router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/login?${returnUrl}${nextStep}`);
        } else {
          setSignUpStep({ previous: 'email', current: isNew ? 'info' : 'password' });
        }

        return isNew;
      }

      if (status === 200 && response?.signInMethod === 'google') {
        openSnackBar({
          message: `You have an active account linked to this email via Google login`,
          severity: 'error',
        });
        // setVerificationAlertMessage({ message: 'You have an active account linked to this email via Google login', messageType: 'error' });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  const loginValidation = async (email: string, password: string): Promise<void> => {
    try {
      await validateLogin();
      // console.log('UserCred', userCred);
      // const updatedData = queryClient.getQueryData(['login-validation', { email, password }]);
      // console.log(updatedData);
      // if (updatedData) {
      //   console.log('in');
      //   userType === 'partner' ? router.push('/car-listing') : router.push('/');
      //   closeModal();
      // }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const onRegister: SubmitHandler<EmailRegistrationValues> = async (data) => {
    try {
      // console.log('Data', data);
      const { email, password } = data;

      if (email && setIsEmailExist) {
        // Check if setIsEmailExist is defined
        setIsEmailExist(true);
      }
      // console.log('emailData', data);

      if (current === 'email') {
        const newUser = await checkUserEmail(email);

        // console.log('newUser', newUser);
        // setSignUpStep({ previous: 'email', current: newUser ? 'info' : 'password' });
      } else {
        await loginValidation(email, password);
      }
    } catch (error) {
      console.log('on register error', error);
    }
  };

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(onRegister)}>
        {current === 'email' && (
          <>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...register('email', {
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
                  message: 'Invalid email format',
                },
              })}
              inputProps={{
                onInput: (e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.toLowerCase();
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="my-4 normal-case font-semibold"
              disabled={!watch('email') || !isValid || isEmailCheckerFetching}
            >
              {isEmailCheckerFetching ? <CircularProgress color="inherit" size={22} /> : 'Continue with Email'}
            </Button>
          </>
        )}
        {current === 'password' && (
          <>
            <TextField className="mb-4" fullWidth label="Email" variant="outlined" {...register('email')} disabled />
            <PasswordField name="password" label="Password" register={register}></PasswordField>
            {!validPassword && <span className="text-error text-xs mt-2">{data?.data?.message}</span>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-4 mb-2 normal-case font-semibold"
              disabled={!watch('password') || isLoginValidationFetching}
            >
              {isLoginValidationFetching ? <CircularProgress color="inherit" size={22} /> : 'Login'}
            </Button>
            <Container className="flex justify-center items-center">
              <Typography variant="h6" component="a" href="/forgot-password" className="no-underline text-primary mb-4 text-xs">
                Forgot Password?
              </Typography>
            </Container>
          </>
        )}
      </CommonForm>
      {current === 'info' && <GeneralInfo></GeneralInfo>}
    </div>
  );
};

export default EmailSignUp;
