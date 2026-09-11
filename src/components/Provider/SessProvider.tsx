'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';

interface SessProviderProps {
  children: ReactNode;
  session: Session | null;
}

const SessProvider = ({ children, session }: SessProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessProvider;
