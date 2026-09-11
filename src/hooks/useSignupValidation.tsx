'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { SignupValues } from '@/types/signUpTypes';
import { handleSetAuthCookies } from '@/utils/Functions/auth/cookiesHelper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getUserEmails = async (email: string) => {
  const response = await axios.get(`${apiUrl}/auth/checkUser`, {
    params: {
      email: email,
    },
  });
  return response;
};

const validateLogin = async (email: string, password: string) => {
  const response = await axios.get(`${apiUrl}/auth/login`, {
    params: {
      email: email,
      password: password,
    },
  });
  return response;
};

const addUser = async ({ email, password, firstName, middleName, lastName, gender, userId }: SignupValues) => {
  //Add gender
  // console.log(email, password, firstName, lastName, userId);
  const response = await axios.post(`${apiUrl}/auth/register`, {
    firstName,
    middleName,
    lastName,
    gender, //Add gender
    password,
    userId,
  });
  const finalResponse = { ...response, cred: { email, userId } };
  return finalResponse;
};

// returns the response if the user is new or not
export const useEmailChecker = (email: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['user-emails', email],
    queryFn: () => getUserEmails(email),
    enabled: false,
    // staleTime: 30000
  });

  // return { data, isLoading, refetch };
};

export const useLoginValidation = (email: string, password: string) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userCred, setUserCred, userType, setValidPassword, setSignUpStep, setUserProfileInfo, userProfileInfo } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { profileGeneralInfo, setProfileGeneralInfo } = useProfileInfoContext(); //Added Profile GeneralInfo for Login
  return useQuery({
    queryKey: ['login-validation', { email, password }],
    queryFn: () => validateLogin(email, password),
    enabled: false,
    // onSuccess: (data) => {
    //   const {
    //     data: { token },
    //   } = data;
    //   // console.log('v data', data);
    //   // console.log('v data', data?.data);
    //   if (token) {
    //     const userData = {
    //       ...userCred,
    //       loggedIn: true,
    //       accessToken: token,
    //       isAllowListing: userProfileInfo?.isAllowListing || false,
    //     };
    //     // console.log('v data', data?.data?.firstName);
    //     // console.log('v data', data?.data?.lastName);
    //     // console.log('v data', data?.data?.profilePic);
    //     // const profileData = {
    //     //   ...userProfileInfo,
    //     //   firstName: data?.data?.firstName,
    //     //   lastName: data?.data?.lastName,
    //     //   picture: data?.data?.profilePic,
    //     // }; //Set Profile Info
    //     const profileData = {
    //       ...profileGeneralInfo,
    //       firstName: data?.data?.firstName,
    //       lastName: data?.data?.lastName,
    //       picture: data?.data?.profilePic,
    //     }; //Set Profile Info
    //     // setUserProfileInfo(profileData); //Set Profile Info
    //     setProfileGeneralInfo(profileData); //Set Profile Info
    //     setUserCred(userData);
    //     setValidPassword(true);
    //     localStorage.setItem('tashus', JSON.stringify(userData));
    //     handleSetAuthCookies(token);
    //     if (pathname === '/login') {
    //       router.push('/?from=login');
    //     }
    //     // } else {
    //     //   userType === 'partner' ? router.push('/on-boarding/verification') : userType === 'guest-booking' ? '' : router.push('/');
    //     // }
    //     // setSignUpStep({ previous: '', current: 'email' });
    //     // userType === 'partner' ? router.push('/car-listing') : userType === 'guest-booking' ? '' : router.push('/');
    //     //redirect to onboarding instead of car-listing
    //     if (!userType && searchParams.get('return_url')) {
    //       router.push(`${searchParams.get('return_url')}`);
    //     }
    //     closeModal();
    //   } else {
    //     setValidPassword(false);
    //   }
    // },
    onSuccess: async (data) => {
      const {
        data: { token },
      } = data;

      if (token) {
        // Save user credentials
        const userData = {
          ...userCred,
          loggedIn: true,
          accessToken: token,
          isAllowListing: userProfileInfo?.isAllowListing || false,
        };
        const profileData = {
          ...profileGeneralInfo,
          firstName: data?.data?.firstName,
          middleName: data?.data?.middleName,
          lastName: data?.data?.lastName,
          picture: data?.data?.profilePic,
        };
        setProfileGeneralInfo(profileData);
        setUserCred(userData);
        setValidPassword(true);
        localStorage.setItem('tashus', JSON.stringify(userData));
        await handleSetAuthCookies(token);

        // Redirect logic
        const returnUrl = searchParams.get('return_url') || '/';
        if (pathname === '/login') {
          router.push(decodeURIComponent(returnUrl));
        }
        closeModal();
      } else {
        setValidPassword(false);
      }
    },
    onError: (err) => {
      console.log('useLoginValidation error', err);
      setValidPassword(false);
      return err;
    },
  });
};

export const useAddUser = () => {
  const { setUserCred, userProfileInfo } = useUserCredContext();
  const pathname = usePathname();
  return useMutation({
    mutationFn: ({ email, password, firstName, middleName, lastName, gender, userId }: SignupValues) =>
      addUser({ email, password, firstName, middleName, lastName, gender, userId }), //Add gender
    onSuccess: (data) => {
      // console.log(data);
      const accessToken = data?.data?.data?.token;
      const {
        cred: { email, userId },
      } = data;
      setUserCred({ userId, email, loggedIn: true });
      localStorage.setItem(
        'tashus',
        JSON.stringify({ userId, email, loggedIn: true, accessToken, isAllowListing: userProfileInfo?.isAllowListing || false })
      );
      handleSetAuthCookies(accessToken);
    },
    onError: (err) => {
      console.log('useAddUser mutation error', err);
      return err;
    },
  });
};
