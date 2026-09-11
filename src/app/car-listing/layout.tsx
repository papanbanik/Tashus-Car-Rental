'use client';

import StepHeading from '@/components/Layouts/CarListingSteps/StepHeading';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const CarListingLayout = ({ children }: { children: React.ReactNode }) => {
  const isIPadPro = useIPadProQuery();

  const router = useRouter();
  const { userCred } = useUserCredContext();

  useEffect(() => {
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log(tashus);
    // if (!tashus?.accessToken) {
    //   router.push('/login?return_url=car-listing');
    // }
    //Firefox Issue
    if (!tashus?.accessToken && typeof window !== undefined) {
      window.location.replace('/login?return_url=car-listing');
    }
  }, []);

  return (
    <div className={`${isIPadPro ? 'px-12' : 'lg:px-36'} mt-32 mb-20 bg-neutral ${userCred?.loggedIn ? '' : 'h-screen'}`}>
      {userCred?.loggedIn && (
        <>
          <StepHeading></StepHeading>
          {children}
        </>
      )}
    </div>
  );
};

export default CarListingLayout;
