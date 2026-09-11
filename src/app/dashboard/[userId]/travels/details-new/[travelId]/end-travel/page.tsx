'use client';

import EndTravel from '@/components/UserProfileUpdated/Travels/EndTravel/EndTravel';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from 'react-icons/io';

const GuestTravelEnd = () => {
  const router = useRouter();
  return (
    <div className="w-full lg:px-72 md:px-12 px-2">
      {/* <p className="text-2xl text-center font-semibold mt-0">End Your Travel</p> */}
      <div className="flex items-center">
        <IoMdArrowRoundBack size={30} className="text-primary" onClick={() => router.back()} />
        <p className="text-2xl text-center font-semibold mt-0 mx-auto">End Your Travel</p>
      </div>
      <EndTravel />
    </div>
  );
};

export default GuestTravelEnd;
