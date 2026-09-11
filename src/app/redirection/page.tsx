'use client';
import Custom404 from '@/components/Error/Custom404';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Redirection = () => {
  const [redirect, setRedirect] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_DOMAIN;
  const { userCred, setUserCred } = useUserCredContext();
  const [fullPath, setFullPath] = useState('');

  // encoding code
  // useEffect(() => {
  //   const plainText = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdkMGE4ZjEyNTMwYzQ5OWQ1YzJlMGIiLCJpYXQiOjE3MjU1MzYwMjIsImV4cCI6MTcyNjE0MDgyMn0.UfUDxhmYI8ecyACJZno1aKjKUvXqClIb7KS1xw4PG-s";
  //   const key = process.env.NEXT_PUBLIC_AT_SECRET as string;
  //   let result = "";
  //   for (let i = 0; i < plainText.length; i++) {
  //     const plainChar = plainText.charCodeAt(i);
  //     const keyChar = key.charCodeAt(i % key.length);
  //     const encodedChar = plainChar ^ keyChar;
  //     result += String.fromCharCode(encodedChar);
  //   }
  //   console.log(encodeURIComponent(result));
  // }, []);

  useEffect(() => {
    const path = searchParams.get('pt') as string;
    const sp = searchParams.get('sp') as string;
    let qpk;
    let qpv;
    if (sp && sp !== '') {
      qpk = sp.split(',')[0];
      qpv = sp.split(',')[1];
    }
    const userId = searchParams.get('ui') as string;
    const encodedAccessToken = searchParams.get('tatn') as string;
    const email = searchParams.get('em') as string;
    const carListingId = searchParams.get('cli') as string;
    const isAllowListing = searchParams.get('al') ?? false;

    if (!userId || !encodedAccessToken || !email || !path) {
      setRedirect(true);
      return;
    } else {
      let result = '';
      const key = process.env.NEXT_PUBLIC_AT_SECRET as string;
      const encryptedText = encodedAccessToken;
      // console.log(encryptedText);
      for (let i = 0; i < encryptedText.length; i++) {
        const encryptedChar = encryptedText.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const char = encryptedChar ^ keyChar;
        result += String.fromCharCode(char);
      }

      setRedirect(false);
      localStorage.setItem('tashus', JSON.stringify({ userId, email, accessToken: result, loggedIn: true, isAllowListing: isAllowListing }));
      setUserCred({ userId, email, loggedIn: true });

      if (URL && searchParams) {
        const userCred = JSON.parse(localStorage.getItem('tashus') as any);
        if (userCred) {
          if (carListingId) {
            // return setFullPath(`${URL}/profile/${userId}/vehicles/${carListingId}/${path}?from=redirection`);
            return setFullPath(`${URL}/dashboard/${userId}/vehicles/${carListingId}/${path}?${qpk && qpv ? `${qpk}=${qpv}&` : ''}from=redirection`);
          }
          setFullPath(`${URL}${path}?${qpk && qpv ? `${qpk}=${qpv}&` : ''}from=redirection`);
        }
      }

      // setTimeout(() => {
      //     if (URL && searchParams) {
      //         const userCred = JSON.parse(localStorage.getItem('tashus') as any);
      //         if (userCred) {
      //             router.push(`${URL}${path}?from=redirection`);
      //         }
      //     }
      // }, 5000);
    }
  }, []);

  useEffect(() => {
    if (userCred && userCred?.userId !== '' && fullPath !== '') {
      router.push(fullPath);
    }
  }, [userCred, fullPath]);

  return <div>{redirect === true ? <Custom404 /> : undefined}</div>;
};

export default Redirection;
