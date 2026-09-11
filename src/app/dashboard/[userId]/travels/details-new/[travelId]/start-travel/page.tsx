'use client';

import StartTravel from '@/components/UserProfileUpdated/Travels/StartTravel/StartTravel';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from 'react-icons/io';

const UserTravelPhotosRoute = () => {
  const router = useRouter();
  return (
    <div className="w-full lg:px-72 md:px-12 px-2">
      {/* <p className="text-2xl text-center font-semibold mt-0">Start Your Travel</p> */}
      <div className="flex items-center">
        <IoMdArrowRoundBack size={30} className="text-primary" onClick={() => router.back()} />
        <p className="text-2xl text-center font-semibold mt-0 mx-auto">Start Your Travel</p>
      </div>
      <StartTravel />
    </div>
  );
};

export default UserTravelPhotosRoute;
