'use client';

import { Button, Divider } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PendingApproval = () => {
  const router = useRouter();
  return (
    <div className="flex items-normal justify-normal md:items-center md:justify-center">
      <div className="bg-white w-full md:w-2/3 p-4 md:m-4 rounded-lg">
        <div className="flex items-center justify-center">
          <Image
            src="/Images/Guest-Verification/ThankYou.svg"
            alt="Thank You"
            className="w-1/2 h-1/2 rounded-lg object-cover"
            layout="responsive"
            width={530}
            height={251}
          />
        </div>

        <div className="flex flex-col justify-center items-center">
          <span className="text-center font-bold text-lg md:text-2xl my-4">{`Congratulations! You've become a guest with Tashus!`}</span>
          <span className="text-justify md:text-center tracking-tight">
            {`Thank you for completing the verification process. Our support team will verify your information within 24 hours. If it takes longer, please`}{' '}
            <Link target="_blank" href={`/support/support-center/general`} className="text-primary inline-block no-underline font-bold">
              contact support
            </Link>
            {` for further assistance.`}
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Divider className="w-1/2 my-4" />
        </div>
        <div className="flex justify-center items-center">
          <Button onClick={() => router.push(`/`)} variant="contained" color="success">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
