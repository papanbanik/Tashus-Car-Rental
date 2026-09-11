'use client';

import SupportTicket from '@/components/Support/Ticket/SupportTicket';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SupportTicketPage = () => {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    // if (!tashus?.accessToken) {
    //   router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/login?return_url=${pathName}`);
    // }
    //Firefox Issue
    if (!tashus?.accessToken && typeof window !== undefined) {
      window.location.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/login?return_url=${pathName}`);
    }
  }, []);

  return (
    <div className="h-full">
      <SupportTicket />
    </div>
  );
};

export default SupportTicketPage;
