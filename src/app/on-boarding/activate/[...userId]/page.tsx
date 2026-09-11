'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useProfileInfo } from '@/hooks/profile/useProfileInfo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import EmailConfirmation from './EmailConfirmation';
interface User {
  message: string;
  data: {
    userId: string;
    email: string;
    verified: boolean;
  };
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ActivateEmailProps {
  params: {
    userId: string;
  };
}

const ActivateEmail = ({ params }: ActivateEmailProps): JSX.Element => {
  const { setUserCred, setProfileHookEnableKeys, profileHookEnableKeys, userProfileInfo } = useUserCredContext();
  const [enabled, setEnabled] = useState(false);
  const queryClient = useQueryClient();
  const { data: profileInfo } = useProfileInfo();

  const verifyEmail = async (userId: string, token: string): Promise<User> => {
    if (!userId || !token) {
      return {
        message: 'Something went wrong!',
        data: {
          userId: '',
          email: '',
          verified: false,
        },
      };
    }
    const response = await axios.put(`${apiUrl}/auth/verify-email`, {
      userId,
      token,
    });
    // console.log(response);
    // console.log(response?.data?.data);

    if (response?.data?.data?.token && typeof window !== 'undefined') {
      const { userId, email, token } = response?.data?.data;
      const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      localStorage.setItem(
        'tashus',
        JSON.stringify({
          ...tashus,
          userId,
          email,
          loggedIn: true,
          accessToken: token,
          emailVerified: true,
          isAllowListing: userProfileInfo?.isAllowListing || false,
        })
      );
      setUserCred({ userId, email, loggedIn: true });
    }
    return response.data;
  };

  const { isLoading, isError, data } = useQuery<User>(
    ['email-verify', params.userId[0], params.userId[1]],
    () => verifyEmail(params.userId[0], params.userId[1]),
    {
      //enabled,
      // staleTime: Infinity,
      refetchOnWindowFocus: false,

      /*
        By setting staleTime to Infinity, the data will remain fresh indefinitely, and subsequent renders of the 
        component will not trigger additional API calls unless the component is unmounted and remounted.
      */

      /*
        By setting refetchOnWindowFocus to false, preventing refetch when user leaves tashus tab and again come back to the tab.
      */
    }
  );

  useEffect(() => {
    console.count('first');
    setEnabled(true);

    return () => {
      // Disable the query when the component unmounts
    };
  }, []);

  //**** there is an issue with calling API's. Need to fix it later. 4times called API when invalid userId & token not given

  if (isLoading) {
    return (
      <div className="flex flex-col w-full">
        <EmailConfirmation isError={isError} message={'Loading...'} isLoading={isLoading} />
      </div>
    );
  }
  console.log(data);

  if (isError || !data) {
    return (
      <div className="flex flex-col w-full">
        <EmailConfirmation isError={isError} message={data?.message} isLoading={isLoading} />
      </div>
    );
  }

  const { userId, verified, email } = data.data;

  if (verified) {
    return (
      <div className="flex flex-col w-full">
        <EmailConfirmation isError={isError} message={data?.message} isLoading={isLoading} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-full">
        <EmailConfirmation isError={isError} message={data?.message} isLoading={isLoading} />
      </div>
    );
  }
};

export default ActivateEmail;
