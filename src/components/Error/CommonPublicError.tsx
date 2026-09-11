'use client';

import Alert from '@mui/material/Alert/Alert';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const CommonPublicError = () => {
  const searchParams = useSearchParams();
  const rawMessage = searchParams.get('error');
  const errorMessage = rawMessage?.split('_')?.join(' ');
  const errorType = searchParams.get('type');

  return (
    <div className="h-screen flex justify-center items-center md:px-0 px-2">
      {errorType === 'google-login-error' ? (
        <Alert severity="error" className="bg-red-200 md:text-xl text-base flex justify-center items-center font-bold">
          {errorMessage}
        </Alert>
      ) : (
        <Alert severity="error" className="bg-red-200 md:text-xl text-base flex justify-center items-center font-bold">
          Error
        </Alert>
      )}
    </div>
  );
};

export default CommonPublicError;
