'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AccountDeactivate from './AccountDeactivate';
import AccountDelete from './AccountDelete';
import Custom404 from '../Error/Custom404';

const AccountUpdate = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);

    if (userCred?.loggedIn !== true) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);
    }
  }, []);

  return (
    <div>
      {/* {searchParams.get('option') === 'deactivate' && <AccountDeactivate></AccountDeactivate>}
      {searchParams.get('option') === 'delete' && <AccountDelete></AccountDelete>} */}
      {searchParams.get('option') === 'delete' ? <AccountDelete></AccountDelete> : searchParams.get('option') === 'deactivate' ? <AccountDeactivate></AccountDeactivate> : <Custom404 />}
    </div>
  );
};

export default AccountUpdate;
