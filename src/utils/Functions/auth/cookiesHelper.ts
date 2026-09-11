'use server';

import { cookies } from 'next/headers';

// set authentication cookies
export const handleSetAuthCookies = async (accessToken: string) => {
  try {
    if (!accessToken) return;
    cookies().set('emailVerifierAccessToken', accessToken);
  } catch (error) {
    console.error('handleUpdateCookies error', error);
  }
};

// get authentication cookies
export const handleGetAuthCookies = () => {
  try {
    const accessToken = cookies().get('emailVerifierAccessToken');
    return accessToken;
  } catch (error) {
    console.error('handleUpdateCookies error', error);
  }
};

// delete authentication cookies
export const handleDeleteAuthCookies = async () => {
  try {
    cookies().delete('emailVerifierAccessToken');
  } catch (error) {
    console.error('handleDeleteCookies error', error);
  }
};
